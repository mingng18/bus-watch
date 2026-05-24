import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { fetchAndParseAgency } from './gtfs-static';
import { fetchVehiclePositions } from './gtfs-realtime';
import { fetchPrasaranaBuses } from './prasarana-socketio';
import { findNearbyStops, findNearbyBusRoutes, findNearbyPrasaranaBuses } from './nearby';
import { getBusTripProgress } from './bus-tracker';
import { getStationSchedule } from './station';
import { findNearbyRoutes } from './routes';
import { VehiclePosition, PrasaranaBus, BusRouteEntry, Env } from './types';
import { sampleBusPositions, aggregateTravelTimes, cleanupOldPositions } from './sampling';

const AGENCIES = ['rapid-bus-kl', 'rapid-bus-mrtfeeder', 'rapid-rail-kl'];
const REALTIME_AGENCIES = ['rapid-bus-kl', 'rapid-bus-mrtfeeder'];

const app = new Hono<{ Bindings: Env }>();
app.use('*', cors());

app.get('/', (c) => c.json({ status: 'ok', service: 'bus-watch' }));

app.get('/refresh', async (c) => {
  await refreshStaticData(c.env.KV);
  return c.json({ status: 'refreshed' });
});

app.get('/nearby', async (c) => {
  const lat = parseFloat(c.req.query('lat') || '0');
  const lon = parseFloat(c.req.query('lon') || '0');
  const radius = parseInt(c.req.query('radius') || '500');
  if (!lat || !lon) return c.json({ error: 'lat and lon required' }, 400);

  const allStops = await getAllStops(c.env.KV);
  const allRoutes = await getAllRoutes(c.env.KV);
  const allTrips = await getAllTrips(c.env.KV);
  const allTripStops = await getAllTripStops(c.env.KV);
  const allCalendar = await getAllCalendar(c.env.KV);
  const allFrequencies = await getAllFrequencies(c.env.KV);
  const vehicles = await getRealtimeVehicles(c.env.KV);

  const result = findNearbyStops(allStops, allRoutes, allTrips, allTripStops, allCalendar, allFrequencies, vehicles, lat, lon, radius);
  const busRoutes = findNearbyBusRoutes(allRoutes, allTrips, vehicles, lat, lon, 1000);

  // Merge Prasarana Socket.IO bus data (covers routes not in GTFS like T816)
  const { buses: prasaranaBuses } = await getPrasaranaBuses(c.env.KV);
  const prasaranaNearby = findNearbyPrasaranaBuses(prasaranaBuses, allRoutes, allTrips, lat, lon, Math.max(radius, 1000));
  const mergedBusRoutes = mergeBusRoutes(busRoutes, prasaranaNearby);

  return c.json({ stops: result, busRoutes: mergedBusRoutes });
});

app.get('/bus/trip/:tripId/progress', async (c) => {
  const tripId = c.req.param('tripId');
  const allRoutes = await getAllRoutes(c.env.KV);
  const vehicles = await getRealtimeVehicles(c.env.KV);
  const vehicle = vehicles.find(v => v.tripId === tripId) || null;
  const allTripStops = await getAllTripStops(c.env.KV);
  const result = getBusTripProgress(tripId, allRoutes, allTripStops, vehicle);
  return c.json(result);
});

app.get('/bus/position/:busId', async (c) => {
  const busId = c.req.param('busId');
  const { buses } = await getPrasaranaBuses(c.env.KV);
  const bus = buses.find(b => b.bus_no === busId);
  if (!bus) return c.json({ error: 'Bus not found' }, 404);
  return c.json({
    bus_no: bus.bus_no,
    route: bus.route.endsWith('0') ? bus.route.slice(0, -1) : bus.route,
    latitude: bus.latitude,
    longitude: bus.longitude,
    speed: bus.speed,
    dt_gps: bus.dt_gps,
  });
});

app.get('/station/:stopId/schedule', async (c) => {
  const stopId = c.req.param('stopId');
  const allStops = await getAllStops(c.env.KV);
  const allRoutes = await getAllRoutes(c.env.KV);
  const allTrips = await getAllTrips(c.env.KV);
  const allTripStops = await getAllTripStops(c.env.KV);
  const allCalendar = await getAllCalendar(c.env.KV);
  const allFrequencies = await getAllFrequencies(c.env.KV);

  const result = getStationSchedule(stopId, allStops, allRoutes, allTrips, allTripStops, allCalendar, allFrequencies);
  return c.json(result);
});

app.get('/routes', async (c) => {
  const lat = parseFloat(c.req.query('lat') || '0');
  const lon = parseFloat(c.req.query('lon') || '0');
  const radius = parseInt(c.req.query('radius') || '500');
  if (!lat || !lon) return c.json({ error: 'lat and lon required' }, 400);

  const allStops = await getAllStops(c.env.KV);
  const allRoutes = await getAllRoutes(c.env.KV);
  const allTrips = await getAllTrips(c.env.KV);
  const allTripStops = await getAllTripStops(c.env.KV);
  const result = findNearbyRoutes(allStops, allRoutes, allTrips, allTripStops, lat, lon, radius);
  return c.json({ routes: result });
});

app.get('/route/:routeId', async (c) => {
  const routeId = c.req.param('routeId');
  const allRoutes = await getAllRoutes(c.env.KV);
  let route = allRoutes.find(r => r.id === routeId || r.shortName === routeId);

  const { buses: prasaranaBuses } = await getPrasaranaBuses(c.env.KV);

  if (!route) {
    const hasPrasarana = prasaranaBuses.some(b => b.route === routeId || b.route === routeId + '0');
    if (!hasPrasarana) return c.json({ error: 'Route not found' }, 404);
    route = { id: routeId, shortName: routeId, longName: '', type: 3 } as any;
  }

  // Get active buses
  const vehicles = await getRealtimeVehicles(c.env.KV);

  const gtfsBuses = vehicles.filter(v => v.routeId === route.id).map(v => ({
    routeId: v.routeId,
    routeShortName: route.shortName,
    destination: '',
    minutes: 0,
    tripId: v.tripId,
    lat: v.lat,
    lon: v.lon,
  }));

  const pBuses = prasaranaBuses.filter(b => b.route === route.shortName || b.route === route.shortName + '0').map(b => ({
    routeId: route.id,
    routeShortName: route.shortName,
    destination: '',
    minutes: 0,
    tripId: b.bus_no,
    lat: b.latitude,
    lon: b.longitude,
    busNo: b.bus_no
  }));

  const mergedBuses = mergeBusRoutes(gtfsBuses, pBuses);

  const allTrips = await getAllTrips(c.env.KV);
  const routeTrips = allTrips.filter(t => t.routeId === route.id && t.shapeId);
  
  const allShapes = await getAllShapes(c.env.KV);
  const shapeIds = Array.from(new Set(routeTrips.map(t => t.shapeId)));
  const shapes = shapeIds.filter(id => allShapes[id]).map(id => ({
    id,
    points: allShapes[id]
  }));

  return c.json({ routeId: route.id, buses: mergedBuses, shapes });
});

// --- Data helpers ---

async function getKvJson<T>(kv: KVNamespace, key: string): Promise<T> {
  const val = await kv.get(key, 'json');
  return val as T;
}

async function getAllStops(kv: KVNamespace) {
  const results = await Promise.all(AGENCIES.map(a => getKvJson<any[]>(kv, `stops:${a}`).catch(() => [])));
  return results.flat().filter(Boolean);
}

async function getAllRoutes(kv: KVNamespace) {
  const results = await Promise.all(AGENCIES.map(a => getKvJson<any[]>(kv, `routes:${a}`).catch(() => [])));
  return results.flat().filter(Boolean);
}

async function getAllTrips(kv: KVNamespace) {
  const results = await Promise.all(AGENCIES.map(a => getKvJson<any[]>(kv, `trips:${a}`).catch(() => [])));
  return results.flat().filter(Boolean);
}

async function getAllTripStops(kv: KVNamespace) {
  const results = await Promise.all(AGENCIES.map(a => getKvJson<Record<string, any[]>>(kv, `tripStops:${a}`).catch(() => ({}))));
  return Object.assign({}, ...results);
}

async function getAllCalendar(kv: KVNamespace) {
  const results = await Promise.all(AGENCIES.map(a => getKvJson<any[]>(kv, `calendar:${a}`).catch(() => [])));
  return results.flat().filter(Boolean);
}

async function getAllFrequencies(kv: KVNamespace) {
  const results = await Promise.all(AGENCIES.map(a => getKvJson<any[]>(kv, `frequencies:${a}`).catch(() => [])));
  return results.flat().filter(Boolean);
}

async function getAllShapes(kv: KVNamespace) {
  const results = await Promise.all(AGENCIES.map(a => getKvJson<Record<string, [number, number][]>>(kv, `shapes:${a}`).catch(() => ({}))));
  return Object.assign({}, ...results);
}

async function getRealtimeVehicles(kv: KVNamespace): Promise<VehiclePosition[]> {
  const cached = await getKvJson<{ ts: number; vehicles: VehiclePosition[] } | null>(kv, 'realtime:vehicles');
  if (cached && Date.now() - cached.ts < 25000) return cached.vehicles;

  const allVehicles = await Promise.all(REALTIME_AGENCIES.map(a => fetchVehiclePositions(a)));
  const vehicles = allVehicles.flat();
  await kv.put('realtime:vehicles', JSON.stringify({ ts: Date.now(), vehicles }));
  return vehicles;
}

async function getPrasaranaBuses(kv: KVNamespace): Promise<{ buses: PrasaranaBus[]; error?: string }> {
  const cached = await getKvJson<{ ts: number; buses: PrasaranaBus[] } | null>(kv, 'prasarana:buses');
  if (cached && Date.now() - cached.ts < 60000) return { buses: cached.buses };

  try {
    const buses = await fetchPrasaranaBuses('RKL');
    if (buses.length > 0) {
      await kv.put('prasarana:buses', JSON.stringify({ ts: Date.now(), buses }));
    }
    return { buses };
  } catch (err: any) {
    console.error('Failed to fetch Prasarana buses:', err?.message || err);
    return { buses: cached?.buses || [], error: err?.message };
  }
}

function mergeBusRoutes(gtfsRoutes: BusRouteEntry[], prasaranaRoutes: BusRouteEntry[]): BusRouteEntry[] {
  const seen = new Set<string>();
  const merged: BusRouteEntry[] = [];

  for (const r of gtfsRoutes) {
    seen.add(r.routeShortName);
    merged.push(r);
  }
  for (const r of prasaranaRoutes) {
    if (!seen.has(r.routeShortName)) {
      merged.push(r);
    }
  }

  merged.sort((a, b) => a.minutes - b.minutes);
  return merged;
}

// --- Scheduled handler ---

async function refreshStaticData(kv: KVNamespace) {
  for (const agency of AGENCIES) {
    try {
      const data = await fetchAndParseAgency(agency);
      await Promise.all([
        kv.put(`stops:${agency}`, JSON.stringify(data.stops)),
        kv.put(`routes:${agency}`, JSON.stringify(data.routes)),
        kv.put(`trips:${agency}`, JSON.stringify(data.trips)),
        kv.put(`tripStops:${agency}`, JSON.stringify(data.tripStops)),
        kv.put(`calendar:${agency}`, JSON.stringify(data.calendar)),
        kv.put(`frequencies:${agency}`, JSON.stringify(data.frequencies)),
        kv.put(`shapes:${agency}`, JSON.stringify(data.shapes)),
      ]);
    } catch (err) {
      console.error(`Failed to refresh ${agency}:`, err);
    }
  }
}

export default {
  fetch: app.fetch,
  scheduled: async (event: ScheduledEvent, env: Env, ctx: ExecutionContext) => {
    if (event.cron === '*/5 * * * *') {
      let vehicles: VehiclePosition[] = [];
      let buses: PrasaranaBus[] = [];
      try {
        const [vehiclesResult, prasaranaResult] = await Promise.allSettled([
          getRealtimeVehicles(env.KV),
          getPrasaranaBuses(env.KV)
        ]);
        if (vehiclesResult.status === 'fulfilled') vehicles = vehiclesResult.value;
        if (prasaranaResult.status === 'fulfilled') buses = prasaranaResult.value.buses;
      } catch (err) {
        console.error('Failed to fetch realtime data for sampling:', err);
      }
      
      try {
        await sampleBusPositions(env, vehicles, buses);
        await aggregateTravelTimes(env);
        await cleanupOldPositions(env);
      } catch (err) {
        console.error('Failed to run sampling and aggregation tasks:', err);
      }
    } else {
      await refreshStaticData(env.KV);
      try {
        const buses = await fetchPrasaranaBuses('RKL');
        await env.KV.put('prasarana:buses', JSON.stringify({ ts: Date.now(), buses }));
      } catch (err) {
        console.error('Failed to refresh Prasarana buses:', err);
      }
    }
  },
};
