import { fetchVehiclePositions } from './gtfs-realtime';
// @ts-ignore
import { fetchPrasaranaBuses } from './prasarana-socketio';
import { canonicalStopSequencesByRoute } from './sampling';
import type { Stop, Route, Trip, TripStopEntry, CalendarEntry, Frequency, VehiclePosition, PrasaranaBus } from './types';

export const SELANGOR_AGENCIES = ['selangor-mobility'];
export const REALTIME_AGENCIES = ['rapid-bus-kl', 'rapid-bus-mrtfeeder'];
export const AGENCIES = [...REALTIME_AGENCIES, ...SELANGOR_AGENCIES];
const CACHE_TTL_MS = 60_000;

export async function getKvJson<T>(kv: KVNamespace, key: string): Promise<T> {
  return await kv.get(key, 'json') as T;
}

// Bindings can change between invocations. Keep each binding's data isolated,
// deduplicate concurrent reads, and discard rejected loads so a retry can recover.
const caches = new WeakMap<KVNamespace, Map<string, { promise: Promise<unknown>; expires: number }>>();
function cached<T>(kv: KVNamespace, key: string, load: () => Promise<T>): Promise<T> {
  let cache = caches.get(kv);
  if (!cache) caches.set(kv, cache = new Map());
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.promise as Promise<T>;
  const promise = Promise.resolve().then(load);
  const entry = { promise, expires: Date.now() + CACHE_TTL_MS };
  cache.set(key, entry);
  void promise.catch(() => {
    if (cache.get(key) === entry) cache.delete(key);
  });
  return promise;
}

export function invalidateStaticData(kv: KVNamespace): void {
  caches.delete(kv);
}

function agencyArrays<T>(kv: KVNamespace, kind: string, agencies = AGENCIES): Promise<T[]> {
  return cached(kv, kind, async () => {
    const results = await Promise.all(agencies.map(a => getKvJson<T[] | null>(kv, `${kind}:${a}`).catch(() => [])));
    return results.flatMap(r => r || []);
  });
}

export const getAllStops = (kv: KVNamespace) => agencyArrays<Stop>(kv, 'stops');
// Preserve existing agency ordering and duplicate-route precedence.
export const getAllRoutes = (kv: KVNamespace) => agencyArrays<Route>(kv, 'routes', [...AGENCIES, ...SELANGOR_AGENCIES]);
export const getAllTrips = (kv: KVNamespace) => agencyArrays<Trip>(kv, 'trips');
export const getAllCalendar = (kv: KVNamespace) => agencyArrays<CalendarEntry>(kv, 'calendar');
export const getAllFrequencies = (kv: KVNamespace) => agencyArrays<Frequency>(kv, 'frequencies');
export const getAllTripStops = (kv: KVNamespace): Promise<Record<string, TripStopEntry[]>> =>
  cached(kv, 'tripStops', async () => Object.assign({}, ...await Promise.all(
    AGENCIES.map(a => getKvJson<Record<string, TripStopEntry[]>>(kv, `tripStops:${a}`).catch(() => ({})))
  )));
export const getAllShapes = (kv: KVNamespace): Promise<Record<string, [number, number][]>> =>
  cached(kv, 'shapes', async () => Object.assign({}, ...await Promise.all(
    AGENCIES.map(a => getKvJson<Record<string, [number, number][]>>(kv, `shapes:${a}`).catch(() => ({})))
  )));

// Derived indexes belong to the exact source snapshot, so they cannot outlive
// it through an independent TTL or serve an older snapshot after refresh.
const stopMaps = new WeakMap<Stop[], Map<string, Stop>>();
export async function getStopsMap(kv: KVNamespace): Promise<Map<string, Stop>> {
  const stops = await getAllStops(kv);
  let map = stopMaps.get(stops);
  if (!map) {
    map = new Map();
    for (const stop of stops) if (!map.has(stop.id)) map.set(stop.id, stop);
    stopMaps.set(stops, map);
  }
  return map;
}

type RoutesMaps = { map: Map<string, Route>; shortNameMap: Map<string, Route>; lastById: Map<string, Route> };
const routeMaps = new WeakMap<Route[], RoutesMaps>();
export async function getRoutesMaps(kv: KVNamespace): Promise<RoutesMaps> {
  const routes = await getAllRoutes(kv);
  let maps = routeMaps.get(routes);
  if (!maps) {
    maps = { map: new Map(), shortNameMap: new Map(), lastById: new Map() };
    for (const route of routes) {
      if (route.id && !maps.map.has(route.id)) maps.map.set(route.id, route);
      if (route.shortName && !maps.shortNameMap.has(route.shortName)) maps.shortNameMap.set(route.shortName, route);
      // Trip progress historically used the last duplicate, unlike nearby.
      maps.lastById.set(route.id, route);
    }
    routeMaps.set(routes, maps);
  }
  return maps;
}

type TripsMaps = { tripMap: Map<string, Trip>; routeTripMap: Map<string, Trip> };
const tripMaps = new WeakMap<Trip[], TripsMaps>();
export async function getTripsMaps(kv: KVNamespace): Promise<TripsMaps> {
  const trips = await getAllTrips(kv);
  let maps = tripMaps.get(trips);
  if (!maps) {
    maps = { tripMap: new Map(), routeTripMap: new Map() };
    for (const trip of trips) {
      maps.tripMap.set(trip.id, trip);
      if (!maps.routeTripMap.has(trip.routeId)) maps.routeTripMap.set(trip.routeId, trip);
    }
    tripMaps.set(trips, maps);
  }
  return maps;
}

const canonicalSequences = new WeakMap<Trip[], WeakMap<Record<string, TripStopEntry[]>, Map<string, TripStopEntry[]>>>();
export async function getCanonicalStopSequences(kv: KVNamespace): Promise<Map<string, TripStopEntry[]>> {
  const [trips, tripStops] = await Promise.all([getAllTrips(kv), getAllTripStops(kv)]);
  let byStops = canonicalSequences.get(trips);
  if (!byStops) canonicalSequences.set(trips, byStops = new WeakMap());
  let sequences = byStops.get(tripStops);
  if (!sequences) {
    sequences = canonicalStopSequencesByRoute(trips, tripStops);
    byStops.set(tripStops, sequences);
  }
  return sequences;
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

