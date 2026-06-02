import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { fetchAndParseAgency } from './gtfs-static';
import { fetchVehiclePositions } from './gtfs-realtime';
import { fetchPrasaranaBuses } from './prasarana-socketio';
import { findNearbyStops, findNearbyBusRoutes, findNearbyPrasaranaBuses } from './nearby';
import { getBusTripProgress } from './bus-tracker';
import { getStationSchedule } from './station';
import { findNearbyRoutes } from './routes';
import { VehiclePosition, PrasaranaBus, BusRouteEntry, Env, Route } from './types';
import { haversineDistance } from './haversine';
import { sampleBusPositions, aggregateTravelTimes, cleanupOldPositions } from './sampling';
import { getHistoricalETA } from './nearby';
import { ingestRailTimetables } from './rail-ingest';
import { getRailSchedule, searchRailStops } from './rail-schedule';

const SELANGOR_AGENCIES = ['selangor-mobility']; // optional, may be unavailable
const REALTIME_AGENCIES = ['rapid-bus-kl', 'rapid-bus-mrtfeeder'];
const AGENCIES = [...REALTIME_AGENCIES, ...SELANGOR_AGENCIES];

const app = new Hono<{ Bindings: Env }>();
app.use('*', cors());

app.get('/', (c) => c.json({ status: 'ok', service: 'bus-watch' }));

app.get('/refresh', async (c) => {
  if (!c.env.ADMIN_TOKEN || c.req.header('Authorization') !== `Bearer ${c.env.ADMIN_TOKEN}`) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

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

  // Enrich bus arrivals with historical ETA when available
  for (const stop of result) {
    if (stop.type === 'bus') {
      for (const arrival of stop.arrivals) {
        if (arrival.route) {
          const eta = await getHistoricalETA(c.env.DB, arrival.route, 0, 0, stop.id);
          if (eta !== null) {
            arrival.minutes = Math.round(eta);
          }
        }
      }
    }
  }

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

app.get('/bus/eta', async (c) => {
  const tripId = c.req.query('tripId');
  const busNo = c.req.query('bus_no');
  const stopId = c.req.query('stopId');
  if (!stopId || (!tripId && !busNo)) return c.json({ error: 'Missing params' }, 400);

  try {
    // Determine route identifier
    let route: string | null = null;
    if (busNo) {
      const { buses } = await getPrasaranaBuses(c.env.KV);
      const bus = buses.find(b => b.bus_no === busNo);
      if (bus) route = bus.route;
    } else if (tripId) {
      const vehicles = await getRealtimeVehicles(c.env.KV);
      const vehicle = vehicles.find(v => v.tripId === tripId);
      if (vehicle) route = vehicle.routeId;
    }
    if (!route) {
      // Could not resolve route, fall back to heuristic
      return c.json({ eta_minutes: 5, source: 'heuristic' });
    }
    // Historical ETA (from, to coordinates not available here, pass 0 placeholders)
    const eta = await getHistoricalETA(c.env.DB, route, 0, 0, stopId);
    if (eta !== null) {
      return c.json({ eta_minutes: Math.round(eta), source: 'historical' });
    }
    // No historical data, fallback
    return c.json({ eta_minutes: 5, source: 'heuristic' });
  } catch (err) {
    console.error('Error fetching ETA:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
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

app.get('/rail/stops', async (c) => {
  const q = c.req.query('q');
  if (!q || q.trim().length < 2) {
    return c.json({ error: 'q must be at least 2 characters' }, 400);
  }
  const stops = await searchRailStops(c.env, q.trim());
  return c.json({ stops });
});

app.get('/rail/schedule', async (c) => {
  const stationId = c.req.query('station_id');
  if (!stationId) return c.json({ error: 'station_id is required' }, 400);

  const window = parseInt(c.req.query('window') || '120');
  const result = await getRailSchedule(c.env, stationId, window);

  if (!result) return c.json({ error: 'Station not found' }, 404);

  return c.json(result);
});

app.post('/rail/ingest', async (c) => {
  if (!c.env.ADMIN_TOKEN || c.req.header('Authorization') !== `Bearer ${c.env.ADMIN_TOKEN}`) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // Manual trigger for testing / ops; protected by obscurity (no auth needed for MVP)
  try {
    const result = await ingestRailTimetables(c.env);
    return c.json({ status: 'ok', inserted: result.inserted });
  } catch (err: any) {
    return c.json({ status: 'error', message: err?.message || String(err) }, 500);
  }
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

  const gtfsBuses = vehicles.filter(v => v.routeId === route!.id).map(v => ({
    routeId: v.routeId,
    routeShortName: route!.shortName || route!.longName || '',
    destination: '',
    minutes: 0,
    tripId: v.tripId,
    lat: v.lat,
    lon: v.lon,
  }));

  const pBuses = prasaranaBuses.filter(b => b.route === route!.shortName || b.route === route!.shortName + '0').map(b => ({
    routeId: route!.id,
    routeShortName: route!.shortName || route!.longName || '',
    destination: '',
    minutes: 0,
    tripId: b.bus_no,
    lat: b.latitude,
    lon: b.longitude,
    busNo: b.bus_no
  }));

  const mergedBuses = mergeBusRoutes(gtfsBuses, pBuses);

  const allTrips = await getAllTrips(c.env.KV);
  const routeTrips = allTrips.filter(t => t.routeId === route!.id && t.shapeId);
  
  const allShapes = await getAllShapes(c.env.KV);
  const shapeIds = Array.from(new Set(routeTrips.map(t => t.shapeId)));
  let shapes = shapeIds.filter(id => allShapes[id]).map(id => ({
    id,
    points: allShapes[id]
  }));

  // Fallback: reconstruct route shape from D1 historical bus positions
  let isReconstructed = false;
  if (shapes.length === 0) {
    try {
      const routeNormal = route!.shortName;
      const routeSuffixed = route!.shortName + '0';
      const { results: posRows } = await c.env.DB.prepare(
        `SELECT bus_no, lat, lon, timestamp FROM bus_positions
         WHERE route = ? OR route = ?
         ORDER BY bus_no, timestamp`
      ).bind(routeNormal, routeSuffixed).all<{ bus_no: string; lat: number; lon: number; timestamp: number }>();

      if (posRows && posRows.length > 0) {
        // Group by bus_no to get per-bus traces
        const groups = new Map<string, [number, number][]>();
        for (const row of posRows) {
          if (!groups.has(row.bus_no)) groups.set(row.bus_no, []);
          const pts = groups.get(row.bus_no)!;
          // Deduplicate: only add if >50m from last point
          const last = pts[pts.length - 1];
          if (!last || haversineDistance(last[0], last[1], row.lat, row.lon) > 50) {
            pts.push([row.lat, row.lon]);
          }
        }
        shapes = Array.from(groups.entries())
          .filter(([, pts]) => pts.length >= 2)
          .map(([busNo, pts]) => ({ id: `trail_${busNo}`, points: pts }));
        if (shapes.length > 0) isReconstructed = true;
      }
    } catch (err) {
      console.error('Failed to reconstruct route shape from D1:', err);
    }
  }

  return c.json({ routeId: route!.id, buses: mergedBuses, shapes, isReconstructed });
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
  const allRoutes = await Promise.all([...AGENCIES, ...SELANGOR_AGENCIES].map(a => getKvJson<Route[]>(kv, `routes:${a}`).catch(() => []))).then(res => res.flat().filter(Boolean));
  return allRoutes;
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
    } else if (event.cron === '0 2 * * 1') {
      // Weekly: refresh rail timetables from GTFS static
      try {
        const result = await ingestRailTimetables(env);
        console.log(`Rail timetable ingest complete: ${result.inserted} rows`);
      } catch (err) {
        console.error('Failed to ingest rail timetables:', err);
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
