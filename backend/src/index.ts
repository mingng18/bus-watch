import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { fetchAndParseAgency } from './gtfs-static';
import { fetchVehiclePositions } from './gtfs-realtime';
import { findNearbyStops } from './nearby';
import { getBusTripProgress } from './bus-tracker';
import { getStationSchedule } from './station';
import { findNearbyRoutes } from './routes';
import { VehiclePosition } from './types';

interface Env {
  KV: KVNamespace;
}

const AGENCIES = ['rapid-bus-kl', 'rapid-bus-mrtfeeder', 'rapid-rail-kl'];
const REALTIME_AGENCIES = ['rapid-bus-kl', 'rapid-bus-mrtfeeder'];

const app = new Hono<{ Bindings: Env }>();
app.use('*', cors());

app.get('/', (c) => c.json({ status: 'ok', service: 'bus-watch' }));

app.get('/nearby', async (c) => {
  const lat = parseFloat(c.req.query('lat') || '0');
  const lon = parseFloat(c.req.query('lon') || '0');
  const radius = parseInt(c.req.query('radius') || '500');
  if (!lat || !lon) return c.json({ error: 'lat and lon required' }, 400);

  const allStops = await getAllStops(c.env.KV);
  const allRoutes = await getAllRoutes(c.env.KV);
  const allTrips = await getAllTrips(c.env.KV);
  const vehicles = await getRealtimeVehicles(c.env.KV);
  const schedule = await getSchedule(c.env.KV);

  const result = findNearbyStops(allStops, allRoutes, allTrips, vehicles, schedule, lat, lon, radius);
  return c.json({ stops: result });
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

app.get('/station/:stopId/schedule', async (c) => {
  const stopId = c.req.param('stopId');
  const allStops = await getAllStops(c.env.KV);
  const allRoutes = await getAllRoutes(c.env.KV);
  const allTrips = await getAllTrips(c.env.KV);
  const allTripStops = await getAllTripStops(c.env.KV);
  const allCalendar = await getAllCalendar(c.env.KV);

  const result = getStationSchedule(stopId, allStops, allRoutes, allTrips, allTripStops, allCalendar);
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

// --- Data helpers ---

async function getKvJson<T>(kv: KVNamespace, key: string): Promise<T> {
  const val = await kv.get(key, 'json');
  return val as T;
}

async function getAllStops(kv: KVNamespace) {
  const results = await Promise.all(AGENCIES.map(a => getKvJson<any[]>(kv, `stops:${a}`).catch(() => [])));
  return results.flat();
}

async function getAllRoutes(kv: KVNamespace) {
  const results = await Promise.all(AGENCIES.map(a => getKvJson<any[]>(kv, `routes:${a}`).catch(() => [])));
  return results.flat();
}

async function getAllTrips(kv: KVNamespace) {
  const results = await Promise.all(AGENCIES.map(a => getKvJson<any[]>(kv, `trips:${a}`).catch(() => [])));
  return results.flat();
}

async function getAllTripStops(kv: KVNamespace) {
  const results = await Promise.all(AGENCIES.map(a => getKvJson<Record<string, any[]>>(kv, `tripStops:${a}`).catch(() => ({}))));
  return Object.assign({}, ...results);
}

async function getAllCalendar(kv: KVNamespace) {
  const results = await Promise.all(AGENCIES.map(a => getKvJson<any[]>(kv, `calendar:${a}`).catch(() => [])));
  return results.flat();
}

async function getRealtimeVehicles(kv: KVNamespace): Promise<VehiclePosition[]> {
  const cached = await getKvJson<{ ts: number; vehicles: VehiclePosition[] } | null>(kv, 'realtime:vehicles');
  if (cached && Date.now() - cached.ts < 25000) return cached.vehicles;

  const allVehicles = await Promise.all(REALTIME_AGENCIES.map(a => fetchVehiclePositions(a)));
  const vehicles = allVehicles.flat();
  await kv.put('realtime:vehicles', JSON.stringify({ ts: Date.now(), vehicles }));
  return vehicles;
}

async function getSchedule(kv: KVNamespace): Promise<Record<string, any[]>> {
  const today = new Date().toISOString().slice(0, 10);
  return await getKvJson<Record<string, any[]>>(kv, `schedule:${today}`).catch(() => ({}));
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
      ]);
    } catch (err) {
      console.error(`Failed to refresh ${agency}:`, err);
    }
  }
}

export default {
  fetch: app.fetch,
  scheduled: async (_event: ScheduledEvent, env: Env, _ctx: ExecutionContext) => {
    await refreshStaticData(env.KV);
  },
};
