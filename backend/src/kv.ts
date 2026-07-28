import type { KVNamespace } from '@cloudflare/workers-types';
import { fetchVehiclePositions } from './gtfs-realtime';
// @ts-ignore
import { fetchPrasaranaBuses } from './prasarana-socketio';
import { VehiclePosition, PrasaranaBus, BusRouteEntry, Route, Trip } from './types';

export const SELANGOR_AGENCIES = ['selangor-mobility']; // optional, may be unavailable
export const REALTIME_AGENCIES = ['rapid-bus-kl', 'rapid-bus-mrtfeeder'];
export const AGENCIES = [...REALTIME_AGENCIES, ...SELANGOR_AGENCIES];


export async function getKvJson<T>(kv: KVNamespace, key: string): Promise<T> {
  const val = await kv.get(key, 'json');
  return val as T;
}

const CACHE_TTL_MS = 60000; // 1 minute TTL

let cachedStopsPromise: { promise: Promise<any[]>, expires: number } | null = null;
export async function getAllStops(kv: KVNamespace) {
  const now = Date.now();
  if (cachedStopsPromise && cachedStopsPromise.expires > now) return cachedStopsPromise.promise;
  const promise = Promise.all(AGENCIES.map(a => getKvJson<any[]>(kv, `stops:${a}`).catch(() => [])))
    // Optimization: flatMap avoids intermediate array allocations vs flat().filter()
    .then(results => results.flatMap(r => r || []));
  cachedStopsPromise = { promise, expires: now + CACHE_TTL_MS };
  return promise;
}

let cachedRoutesMap: { map: Map<string, Route>, shortNameMap: Map<string, Route>, expires: number } | null = null;
let cachedRoutes: { routes: Route[], expires: number } | null = null;

export async function getAllRoutes(kv: KVNamespace) {
  const now = Date.now();
  if (cachedRoutes && cachedRoutes.expires > now) return cachedRoutes.routes;
  const allRoutes = await Promise.all([...AGENCIES, ...SELANGOR_AGENCIES].map(a => getKvJson<Route[]>(kv, `routes:${a}`).catch(() => []))).then(res => res.flatMap(r => r || []));
  cachedRoutes = { routes: allRoutes, expires: now + CACHE_TTL_MS };
  return allRoutes;
}

export async function getRoutesMaps(kv: KVNamespace): Promise<{ map: Map<string, Route>, shortNameMap: Map<string, Route> }> {
  const now = Date.now();
  if (cachedRoutesMap && cachedRoutesMap.expires > now) return cachedRoutesMap;
  const allRoutes = await getAllRoutes(kv);
  const map = new Map<string, Route>();
  const shortNameMap = new Map<string, Route>();
  for (let i = 0; i < allRoutes.length; i++) {
    const r = allRoutes[i];
    if (r.id && !map.has(r.id)) map.set(r.id, r);
    if (r.shortName && !shortNameMap.has(r.shortName)) shortNameMap.set(r.shortName, r);
  }
  cachedRoutesMap = { map, shortNameMap, expires: now + CACHE_TTL_MS };
  return cachedRoutesMap;
}

let cachedTripsMap: { tripMap: Map<string, Trip>, routeTripMap: Map<string, Trip>, expires: number } | null = null;
export async function getTripsMaps(kv: KVNamespace): Promise<{ tripMap: Map<string, Trip>, routeTripMap: Map<string, Trip> }> {
  const now = Date.now();
  if (cachedTripsMap && cachedTripsMap.expires > now) return cachedTripsMap;
  const allTrips = await getAllTrips(kv);
  const tripMap = new Map<string, Trip>();
  const routeTripMap = new Map<string, Trip>();
  for (let i = 0; i < allTrips.length; i++) {
    const t = allTrips[i];
    tripMap.set(t.id, t);
    if (!routeTripMap.has(t.routeId)) {
      routeTripMap.set(t.routeId, t);
    }
  }
  cachedTripsMap = { tripMap, routeTripMap, expires: now + CACHE_TTL_MS };
  return cachedTripsMap;
}

let cachedTripsPromise: { promise: Promise<any[]>, expires: number } | null = null;
export async function getAllTrips(kv: KVNamespace) {
  const now = Date.now();
  if (cachedTripsPromise && cachedTripsPromise.expires > now) return cachedTripsPromise.promise;
  const promise = Promise.all(AGENCIES.map(a => getKvJson<any[]>(kv, `trips:${a}`).catch(() => [])))
    // Optimization: flatMap avoids intermediate array allocations vs flat().filter()
    .then(results => results.flatMap(r => r || []));
  cachedTripsPromise = { promise, expires: now + CACHE_TTL_MS };
  return promise;
}

let cachedTripStopsPromise: { promise: Promise<Record<string, any[]>>, expires: number } | null = null;
export async function getAllTripStops(kv: KVNamespace) {
  const now = Date.now();
  if (cachedTripStopsPromise && cachedTripStopsPromise.expires > now) return cachedTripStopsPromise.promise;
  const promise = Promise.all(AGENCIES.map(a => getKvJson<Record<string, any[]>>(kv, `tripStops:${a}`).catch(() => ({}))))
    .then(results => Object.assign({}, ...results));
  cachedTripStopsPromise = { promise, expires: now + CACHE_TTL_MS };
  return promise;
}

let cachedCalendarPromise: { promise: Promise<any[]>, expires: number } | null = null;
export async function getAllCalendar(kv: KVNamespace) {
  const now = Date.now();
  if (cachedCalendarPromise && cachedCalendarPromise.expires > now) return cachedCalendarPromise.promise;
  const promise = Promise.all(AGENCIES.map(a => getKvJson<any[]>(kv, `calendar:${a}`).catch(() => [])))
    // Optimization: flatMap avoids intermediate array allocations vs flat().filter()
    .then(results => results.flatMap(r => r || []));
  cachedCalendarPromise = { promise, expires: now + CACHE_TTL_MS };
  return promise;
}

let cachedFrequenciesPromise: { promise: Promise<any[]>, expires: number } | null = null;
export async function getAllFrequencies(kv: KVNamespace) {
  const now = Date.now();
  if (cachedFrequenciesPromise && cachedFrequenciesPromise.expires > now) return cachedFrequenciesPromise.promise;
  const promise = Promise.all(AGENCIES.map(a => getKvJson<any[]>(kv, `frequencies:${a}`).catch(() => [])))
    // Optimization: flatMap avoids intermediate array allocations vs flat().filter()
    .then(results => results.flatMap(r => r || []));
  cachedFrequenciesPromise = { promise, expires: now + CACHE_TTL_MS };
  return promise;
}

let cachedShapesPromise: { promise: Promise<Record<string, [number, number][]>>, expires: number } | null = null;
export async function getAllShapes(kv: KVNamespace) {
  const now = Date.now();
  if (cachedShapesPromise && cachedShapesPromise.expires > now) return cachedShapesPromise.promise;
  const promise = Promise.all(AGENCIES.map(a => getKvJson<Record<string, [number, number][]>>(kv, `shapes:${a}`).catch(() => ({}))))
    .then(results => Object.assign({}, ...results));
  cachedShapesPromise = { promise, expires: now + CACHE_TTL_MS };
  return promise;
}

export async function getRealtimeVehicles(kv: KVNamespace): Promise<VehiclePosition[]> {
  const cached = await getKvJson<{ ts: number; vehicles: VehiclePosition[] } | null>(kv, 'realtime:vehicles');
  if (cached && Date.now() - cached.ts < 25000) return cached.vehicles;

  const allVehicles = await Promise.all(REALTIME_AGENCIES.map(a => fetchVehiclePositions(a)));
  const vehicles = allVehicles.flat();
  await kv.put('realtime:vehicles', JSON.stringify({ ts: Date.now(), vehicles }));
  return vehicles;
}

export async function getPrasaranaBuses(kv: KVNamespace): Promise<{ buses: PrasaranaBus[]; error?: string }> {
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

export function mergeBusRoutes(gtfsRoutes: BusRouteEntry[], prasaranaRoutes: BusRouteEntry[]): BusRouteEntry[] {
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
