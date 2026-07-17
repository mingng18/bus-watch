import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { timingSafeEqual } from 'hono/utils/buffer';
import { fetchAndParseAgency } from './gtfs-static';
import { fetchVehiclePositions } from './gtfs-realtime';
// @ts-ignore
import { fetchPrasaranaBuses } from './prasarana-socketio';
import { findNearbyStops, findNearbyBusRoutes, findNearbyPrasaranaBuses, getHistoricalETA, getBatchedHistoricalETAs, nearestFromStopOnRoute } from './nearby';
import { getBusTripProgress } from './bus-tracker';
import { getStationSchedule } from './station';
import { findNearbyRoutes } from './routes';
import { VehiclePosition, PrasaranaBus, BusRouteEntry, Env, Route, Trip } from './types';
import { haversineDistance } from './haversine';
import { sampleBusPositions, aggregateTravelTimes, cleanupOldPositions, canonicalStopSequencesByRoute } from './sampling';
import { ingestRailTimetables } from './rail-ingest';
import { getRailSchedule, searchRailStops } from './rail-schedule';
import { getDeparturesTowardDestination } from './departures-toward';
import { getCachedAlerts, DEFAULT_ALERT_LIMIT } from './alerts';

const SELANGOR_AGENCIES = ['selangor-mobility']; // optional, may be unavailable
const REALTIME_AGENCIES = ['rapid-bus-kl', 'rapid-bus-mrtfeeder'];
const AGENCIES = [...REALTIME_AGENCIES, ...SELANGOR_AGENCIES];

const app = new Hono<{ Bindings: Env }>();
app.use('*', secureHeaders());
app.use('*', cors({ origin: (origin, c) => c.env.FRONTEND_URL || '' }));
app.use('*', cors({ origin: (origin, c) => c.env.FRONTEND_URL ?? null }));

// Security: Global input length validation to prevent DoS via excessively large payloads
app.use('*', async (c, next) => {
  if (c.req.path.length > 256) {
    return c.json({ error: 'URI path too long' }, 414);
  }
  const queries = c.req.query();
  for (const key in queries) {
    if (queries[key] && queries[key].length > 100) {
      return c.json({ error: `Parameter ${key} is too long` }, 400);
    }
  }
  await next();
});

// Security: Fail securely and consistently format errors as JSON to prevent stack trace leaks
app.onError((err, c) => {
  console.error('Unhandled application error:', err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

app.get('/', (c) => c.json({ status: 'ok', service: 'bus-watch' }));

/**
 * Validate a lat/lon pair. `parseFloat('foo')` is NaN and `parseFloat('999')`
 * Validate a lat/lon pair. `parseFloat('foo')` is NaN and `parseFloat('999')`
 * is 999; both must be rejected before they reach the spatial queries (NaN
 * poisons haversine math, out-of-range produces bogus "nearby" results).
 * Accepts only finite numbers within geographic bounds.
 * Returns an error message string when invalid, or null when valid.
 * See issue #131.
 */
function validateLatLon(lat: number, lon: number): string | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return 'lat and lon must be finite numbers';
  }
  if (lat < -90 || lat > 90) return 'lat must be in [-90, 90]';
  if (lon < -180 || lon > 180) return 'lon must be in [-180, 180]';
  return null;
}

// POST because /refresh mutates state (re-ingests GTFS into KV). GET would be
// CSRF/prefetch-prone (browsers prefetch links, prefetch robots hit URLs found
// in HTML, image preloaders have historically fired GETs on linked URLs).
// See issue #131.
app.post('/refresh', async (c) => {
  const authHeader = c.req.header('Authorization');
  const expectedToken = `Bearer ${c.env.ADMIN_TOKEN}`;
  if (!c.env.ADMIN_TOKEN || !authHeader) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const compareStr = authHeader.length === expectedToken.length ? authHeader : expectedToken;
  const isMatch = await timingSafeEqual(compareStr, expectedToken) && authHeader.length === expectedToken.length;

  if (!isMatch) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await refreshStaticData(c.env.KV);
  return c.json({ status: 'refreshed' });
});

app.get('/nearby', async (c) => {
  const lat = parseFloat(c.req.query('lat') || '');
  const lon = parseFloat(c.req.query('lon') || '');
  let radius = parseInt(c.req.query('radius') || '500', 10);
  if (!Number.isFinite(radius) || radius < 0) radius = 500;
  if (radius > 10000) radius = 10000;
  // Reject missing/NaN/out-of-range coords before they reach spatial queries.
  // Note: we cannot use `if (!lat)` here because lat=0 (the equator) is a
  // legitimate value; we must validate finiteness and range explicitly.
  // See issue #131.
  const coordErr = validateLatLon(lat, lon);
  if (coordErr) return c.json({ error: coordErr }, 400);

  const allStops = await getAllStops(c.env.KV);
  const allRoutes = await getAllRoutes(c.env.KV);
  const allTrips = await getAllTrips(c.env.KV);
  const { map: routeMap } = await getRoutesMaps(c.env.KV);
  const { tripMap, routeTripMap } = await getTripsMaps(c.env.KV);
  const allTripStops = await getAllTripStops(c.env.KV);
  const allCalendar = await getAllCalendar(c.env.KV);
  const allFrequencies = await getAllFrequencies(c.env.KV);
  const vehicles = await getRealtimeVehicles(c.env.KV);

  const result = findNearbyStops({
    stops: allStops,
    routes: allRoutes,
    trips: allTrips,
    tripStops: allTripStops,
    calendar: allCalendar,
    frequencies: allFrequencies,
    vehicles,
    lat,
    lon,
    radiusM: radius
  });
  const busRoutes = findNearbyBusRoutes(allRoutes, allTrips, vehicles, lat, lon, 1000, routeMap, tripMap);

  // Merge Prasarana Socket.IO bus data (covers routes not in GTFS like T816)
  const { buses: prasaranaBuses } = await getPrasaranaBuses(c.env.KV);
  const prasaranaNearby = findNearbyPrasaranaBuses(prasaranaBuses, allRoutes, allTrips, lat, lon, Math.max(radius, 1000), routeTripMap);
  const mergedBusRoutes = mergeBusRoutes(busRoutes, prasaranaNearby);

  // Enrich bus arrivals with historical ETA when available
  // Collect all unique route-stop pairs
  const queries: { route: string; stopId: string }[] = [];
  // Use a Map of Sets for faster membership checking without building strings
  const seenQueries = new Map<string, Set<string>>();
  for (const stop of result) {
    if (stop.type === 'bus') {
      let stopSeen = seenQueries.get(stop.id);
      if (!stopSeen) {
        stopSeen = new Set<string>();
        seenQueries.set(stop.id, stopSeen);
      }
      for (const arrival of stop.arrivals) {
        if (arrival.route) {
          if (!stopSeen.has(arrival.route)) {
            stopSeen.add(arrival.route);
            queries.push({ route: arrival.route, stopId: stop.id });
          }
        }
      }
    }
  }

  // Fetch all ETAs in a single batch
  if (queries.length > 0) {
    const etas = await getBatchedHistoricalETAs(c.env.DB, queries);
    for (const stop of result) {
      if (stop.type === 'bus') {
        for (const arrival of stop.arrivals) {
          if (arrival.route) {
            const key = arrival.route + '-' + stop.id;
            const eta = etas.get(key);
            if (eta) {
              // Only let the historical estimate override the live distance-
              // based minutes when it has at least medium confidence — a
              // single low-sample historical point shouldn't displace a live
              // position. Either way we surface the confidence + uncertainty
              // so the client can render the qualifier (issue #133).
              if (eta.confidence !== 'low') {
                arrival.minutes = Math.round(eta.minutes);
              }
              arrival.confidence = eta.confidence;
              arrival.uncertainty_minutes = Math.round(eta.uncertaintyMinutes);
              // The historical estimate is not a live position; flag it as
              // scheduled so the client can distinguish the two.
              arrival.eta_source = 'scheduled';
            }
          }
        }
      }
    }
  }

  return c.json({ stops: result, busRoutes: mergedBusRoutes });
});

app.get('/bus/trip/:tripId/progress', async (c) => {
  const tripId = c.req.param('tripId');
  try {
    const allRoutes = await getAllRoutes(c.env.KV);
    const vehicles = await getRealtimeVehicles(c.env.KV);
    // Optimization: Prevent lambda allocation in hot path
    let vehicle = null;
    for (let i = 0, len = vehicles.length; i < len; i++) {
      if (vehicles[i].tripId === tripId) {
        vehicle = vehicles[i];
        break;
      }
    }
    const allTripStops = await getAllTripStops(c.env.KV);
    const routeMap = new Map<string, Route>();
    for (const r of allRoutes) routeMap.set(r.id, r);
    const result = getBusTripProgress(tripId, routeMap, allTripStops, vehicle);
    return c.json(result);
  } catch (err) {
    // getBusTripProgress throws on unknown tripId (e.g. a stale saved
    // favorite referencing a trip removed from GTFS). Return a clean 404
    // instead of letting Hono turn the unhandled rejection into a 500.
    // See issue #128.
    return c.json({ error: 'Trip not found' }, 404);
  }
});

app.get('/bus/eta', async (c) => {
  const tripId = c.req.query('tripId');
  const busNo = c.req.query('bus_no');
  const stopId = c.req.query('stopId');
  if (!stopId || (!tripId && !busNo)) return c.json({ error: 'Missing params' }, 400);

  try {
    // Resolve route + current bus position. The from-stop for the historical
    // lookup is whichever stop on the route the bus is currently nearest
    // (issue #133: the old code passed literal 0,0 and ignored fromLat/fromLon).
    let route: string | null = null;
    let busLat: number | null = null;
    let busLon: number | null = null;
    let routeIdForSeq: string | null = null; // GTFS route_id for stop-sequence lookup
    if (busNo) {
      const { buses } = await getPrasaranaBuses(c.env.KV);
      // Optimization: Prevent lambda allocation in hot path
      let bus;
      for (let i = 0, len = buses.length; i < len; i++) {
        if (buses[i].bus_no === busNo) {
          bus = buses[i];
          break;
        }
      }
      if (bus) {
        route = bus.route;
        busLat = bus.latitude;
        busLon = bus.longitude;
      }
    } else if (tripId) {
      const vehicles = await getRealtimeVehicles(c.env.KV);
      // Optimization: Prevent lambda allocation in hot path
      let vehicle;
      for (let i = 0, len = vehicles.length; i < len; i++) {
        if (vehicles[i].tripId === tripId) {
          vehicle = vehicles[i];
          break;
        }
      }
      if (vehicle) {
        route = vehicle.routeId;
        routeIdForSeq = vehicle.routeId;
        busLat = vehicle.lat;
        busLon = vehicle.lon;
      }
    }
    if (!route) {
      // Could not resolve route, fall back to heuristic
      return c.json({ eta_minutes: 5, source: 'heuristic', is_live: false });
    }

    // Resolve the from-stop from the bus's current position + the route's
    // stop sequence. Prasarana route codes (e.g. "T816") may not match a GTFS
    // route_id, so match by shortName as a fallback.
    let fromStopId: string | null = null;
    if (busLat !== null && busLon !== null) {
      const [allTrips, allTripStops, allRoutes] = await Promise.all([
        getAllTrips(c.env.KV),
        getAllTripStops(c.env.KV),
        getAllRoutes(c.env.KV),
      ]);
      const seqs = canonicalStopSequencesByRoute(allTrips, allTripStops);
      let stops = routeIdForSeq ? seqs.get(routeIdForSeq) : undefined;
      if (!stops) {
        // Fallback: match by route short name (prasarana codes).
        // Optimization: Turn O(N) linear search into O(1) Map lookup
        const { shortNameMap } = await getRoutesMaps(c.env.KV);
        const r = shortNameMap.get(route);
        if (r) stops = seqs.get(r.id);
      }
      if (stops) {
        const fromStop = nearestFromStopOnRoute(busLat, busLon, stops);
        if (fromStop) fromStopId = fromStop.stopId;
      }
    }

    if (fromStopId) {
      const eta = await getHistoricalETA(c.env.DB, route, fromStopId, stopId);
      if (eta) {
        return c.json({
          eta_minutes: Math.round(eta.minutes),
          // Uncertainty window + confidence so the client can render an honest
          // "≈5 min" qualifier (issue #133).
          uncertainty_minutes: Math.round(eta.uncertaintyMinutes),
          confidence: eta.confidence,
          is_live: eta.isLive,
          sample_count: eta.sampleCount,
          source: 'historical',
        });
      }
    }
    // No historical data, fallback
    return c.json({ eta_minutes: 5, source: 'heuristic', is_live: false });
  } catch (err) {
    console.error('Error fetching ETA:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get('/bus/position/:busId', async (c) => {
  const busId = c.req.param('busId');
  const { buses } = await getPrasaranaBuses(c.env.KV);
  // Optimization: Prevent lambda allocation in hot path
  let bus;
  for (let i = 0, len = buses.length; i < len; i++) {
    if (buses[i].bus_no === busId) {
      bus = buses[i];
      break;
    }
  }
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
  try {
    const allStops = await getAllStops(c.env.KV);
    const allRoutes = await getAllRoutes(c.env.KV);
    const routesMaps = await getRoutesMaps(c.env.KV);
    const allTrips = await getAllTrips(c.env.KV);
    const allTripStops = await getAllTripStops(c.env.KV);
    const allCalendar = await getAllCalendar(c.env.KV);
    const allFrequencies = await getAllFrequencies(c.env.KV);

    const result = getStationSchedule(stopId, allStops, allRoutes, allTrips, allTripStops, allCalendar, routesMaps.map);
    return c.json(result);
  } catch (err) {
    // getStationSchedule throws on unknown stopId (e.g. a stale saved
    // favorite referencing a stop removed from GTFS). Return a clean 404
    // instead of letting Hono turn the unhandled rejection into a 500.
    // See issue #128.
    return c.json({ error: 'Station not found' }, 404);
  }
});

app.get('/station/:stopId/schedule/toward', async (c) => {
  const stopId = c.req.param('stopId');
  const destinationStopId = c.req.query('destinationStopId');
  if (!destinationStopId) return c.json({ error: 'destinationStopId is required' }, 400);

  const parsed = parseInt(c.req.query('limit') || '5', 10);
  const limit = Math.min(Math.max(Number.isFinite(parsed) ? parsed : 5, 1), 50);

  try {
    const allStops = await getAllStops(c.env.KV);
    const allRoutes = await getAllRoutes(c.env.KV);
    const routesMaps = await getRoutesMaps(c.env.KV);
    const allTrips = await getAllTrips(c.env.KV);
    const allTripStops = await getAllTripStops(c.env.KV);
    const allCalendar = await getAllCalendar(c.env.KV);

    const result = getDeparturesTowardDestination(
      stopId, destinationStopId, allStops, allRoutes, allTrips, allTripStops, allCalendar, limit, routesMaps.map
    );
    return c.json(result);
  } catch (err) {
    // getDeparturesTowardDestination throws on unknown stopId (e.g. a stale
    // saved favorite referencing a stop removed from GTFS). Return a clean
    // 404 instead of letting Hono turn the unhandled rejection into a 500.
    // See issue #128.
    return c.json({ error: 'Station not found' }, 404);
  }
});

app.get('/rail/stops', async (c) => {
  const q = c.req.query('q');
  if (!q || q.trim().length < 2 || q.trim().length > 50) {
    return c.json({ error: 'q must be between 2 and 50 characters' }, 400);
  }
  const stops = await searchRailStops(c.env, q.trim());
  return c.json({ stops });
});

app.get('/rail/schedule', async (c) => {
  const stationId = c.req.query('station_id');
  if (!stationId) return c.json({ error: 'station_id is required' }, 400);

  const parsed = parseInt(c.req.query('window') || '120', 10);
  const window = Math.min(Math.max(Number.isFinite(parsed) ? parsed : 120, 1), 1440);
  const result = await getRailSchedule(c.env, stationId, window);

  if (!result) return c.json({ error: 'Station not found' }, 404);

  return c.json(result);
});

app.post('/rail/ingest', async (c) => {
  const authHeader = c.req.header('Authorization');
  const expectedToken = `Bearer ${c.env.ADMIN_TOKEN}`;
  if (!c.env.ADMIN_TOKEN || !authHeader) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const compareStr = authHeader.length === expectedToken.length ? authHeader : expectedToken;
  const isMatch = await timingSafeEqual(compareStr, expectedToken) && authHeader.length === expectedToken.length;

  if (!isMatch) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  try {
    const result = await ingestRailTimetables(c.env);
    return c.json({ status: 'ok', inserted: result.inserted });
  } catch (err: any) {
    return c.json({ status: 'error', message: 'Internal Server Error' }, 500); // Do not leak error details
  }
});

app.get('/routes', async (c) => {
  const lat = parseFloat(c.req.query('lat') || '');
  const lon = parseFloat(c.req.query('lon') || '');
  let radius = parseInt(c.req.query('radius') || '500', 10);
  if (!Number.isFinite(radius) || radius < 0) radius = 500;
  if (radius > 10000) radius = 10000;
  const coordErr = validateLatLon(lat, lon);
  if (coordErr) return c.json({ error: coordErr }, 400);

  const allStops = await getAllStops(c.env.KV);
  const allRoutes = await getAllRoutes(c.env.KV);
  const allTrips = await getAllTrips(c.env.KV);
  const allTripStops = await getAllTripStops(c.env.KV);
  const result = findNearbyRoutes(allStops, allRoutes, allTrips, allTripStops, lat, lon, radius);
  return c.json({ routes: result });
});

app.get('/alerts', async (c) => {
  // Clamp limit: parseInt('foo') is NaN, parseInt('99999999') is unbounded.
  // Either could let a caller dump the entire alert list (cheap DoS / large
  // payload). Coerce to the default on parse failure, then clamp to [1, 100].
  // See issue #131.
  const parsed = parseInt(c.req.query('limit') || '', 10);
  const limit = Math.min(Math.max(Number.isFinite(parsed) ? parsed : DEFAULT_ALERT_LIMIT, 1), 100);
  try {
    const all = await getCachedAlerts(c.env);
    const alerts = all.slice(0, limit);
    return c.json({ alerts });
  } catch (err: any) {
    // Defensive: never 500 on alert failures.
    console.error('Error fetching alerts:', err?.message || err);
    return c.json({ alerts: [] });
  }
});

app.get('/route/:routeId', async (c) => {
  const routeId = c.req.param('routeId');
  const allRoutes = await getAllRoutes(c.env.KV);
  // Optimization: Turn O(N) linear search into O(1) Map lookup
  const { map, shortNameMap } = await getRoutesMaps(c.env.KV);
  let route = map.get(routeId) || shortNameMap.get(routeId);

  const { buses: prasaranaBuses } = await getPrasaranaBuses(c.env.KV);

  if (!route) {
    const hasPrasarana = prasaranaBuses.some(b => b.route === routeId || b.route === routeId + '0');
    if (!hasPrasarana) return c.json({ error: 'Route not found' }, 404);
    route = { id: routeId, shortName: routeId, longName: '', type: 3 } as any;
  }

  // Get active buses
  const vehicles = await getRealtimeVehicles(c.env.KV);

  const gtfsBuses: Array<{ routeId: string; routeShortName: string; destination: string; minutes: number; tripId: string; lat: number; lon: number; }> = [];
  const routeShortName = route!.shortName || route!.longName || '';
  const tgtRouteId = route!.id;
  for (let i = 0, len = vehicles.length; i < len; i++) {
    const v = vehicles[i];
    if (v.routeId === tgtRouteId) {
      gtfsBuses.push({
        routeId: tgtRouteId,
        routeShortName,
        destination: '',
        minutes: 0,
        tripId: v.tripId,
        lat: v.lat,
        lon: v.lon,
      });
    }
  }

  const pBuses: Array<{ routeId: string; routeShortName: string; destination: string; minutes: number; tripId: string; lat: number; lon: number; busNo: string; }> = [];
  const pTargetRoute1 = route!.shortName;
  const pTargetRoute2 = route!.shortName + '0';
  for (let i = 0, len = prasaranaBuses.length; i < len; i++) {
    const b = prasaranaBuses[i];
    if (b.route === pTargetRoute1 || b.route === pTargetRoute2) {
      pBuses.push({
        routeId: tgtRouteId,
        routeShortName,
        destination: '',
        minutes: 0,
        tripId: b.bus_no,
        lat: b.latitude,
        lon: b.longitude,
        busNo: b.bus_no
      });
    }
  }

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
        // Performance optimization: Data is already sorted by bus_no.
        // Cache lastKey and lastArr to prevent redundant map lookups.
        let lastKey: string | null = null;
        let lastArr: [number, number][] = [];

        for (const row of posRows) {
          let pts: [number, number][];
          if (row.bus_no === lastKey) {
            pts = lastArr;
          } else {
            pts = groups.get(row.bus_no) || [];
            if (pts.length === 0) {
              groups.set(row.bus_no, pts);
            }
            lastKey = row.bus_no;
            lastArr = pts;
          }
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

const CACHE_TTL_MS = 60000; // 1 minute TTL

let cachedStopsPromise: { promise: Promise<any[]>, expires: number } | null = null;
async function getAllStops(kv: KVNamespace) {
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

async function getAllRoutes(kv: KVNamespace) {
  const now = Date.now();
  if (cachedRoutes && cachedRoutes.expires > now) return cachedRoutes.routes;
  const allRoutes = await Promise.all([...AGENCIES, ...SELANGOR_AGENCIES].map(a => getKvJson<Route[]>(kv, `routes:${a}`).catch(() => []))).then(res => res.flatMap(r => r || []));
  cachedRoutes = { routes: allRoutes, expires: now + CACHE_TTL_MS };
  return allRoutes;
}

async function getRoutesMaps(kv: KVNamespace): Promise<{ map: Map<string, Route>, shortNameMap: Map<string, Route> }> {
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
async function getTripsMaps(kv: KVNamespace): Promise<{ tripMap: Map<string, Trip>, routeTripMap: Map<string, Trip> }> {
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
async function getAllTrips(kv: KVNamespace) {
  const now = Date.now();
  if (cachedTripsPromise && cachedTripsPromise.expires > now) return cachedTripsPromise.promise;
  const promise = Promise.all(AGENCIES.map(a => getKvJson<any[]>(kv, `trips:${a}`).catch(() => [])))
    // Optimization: flatMap avoids intermediate array allocations vs flat().filter()
    .then(results => results.flatMap(r => r || []));
  cachedTripsPromise = { promise, expires: now + CACHE_TTL_MS };
  return promise;
}

let cachedTripStopsPromise: { promise: Promise<Record<string, any[]>>, expires: number } | null = null;
async function getAllTripStops(kv: KVNamespace) {
  const now = Date.now();
  if (cachedTripStopsPromise && cachedTripStopsPromise.expires > now) return cachedTripStopsPromise.promise;
  const promise = Promise.all(AGENCIES.map(a => getKvJson<Record<string, any[]>>(kv, `tripStops:${a}`).catch(() => ({}))))
    .then(results => Object.assign({}, ...results));
  cachedTripStopsPromise = { promise, expires: now + CACHE_TTL_MS };
  return promise;
}

let cachedCalendarPromise: { promise: Promise<any[]>, expires: number } | null = null;
async function getAllCalendar(kv: KVNamespace) {
  const now = Date.now();
  if (cachedCalendarPromise && cachedCalendarPromise.expires > now) return cachedCalendarPromise.promise;
  const promise = Promise.all(AGENCIES.map(a => getKvJson<any[]>(kv, `calendar:${a}`).catch(() => [])))
    // Optimization: flatMap avoids intermediate array allocations vs flat().filter()
    .then(results => results.flatMap(r => r || []));
  cachedCalendarPromise = { promise, expires: now + CACHE_TTL_MS };
  return promise;
}

let cachedFrequenciesPromise: { promise: Promise<any[]>, expires: number } | null = null;
async function getAllFrequencies(kv: KVNamespace) {
  const now = Date.now();
  if (cachedFrequenciesPromise && cachedFrequenciesPromise.expires > now) return cachedFrequenciesPromise.promise;
  const promise = Promise.all(AGENCIES.map(a => getKvJson<any[]>(kv, `frequencies:${a}`).catch(() => [])))
    // Optimization: flatMap avoids intermediate array allocations vs flat().filter()
    .then(results => results.flatMap(r => r || []));
  cachedFrequenciesPromise = { promise, expires: now + CACHE_TTL_MS };
  return promise;
}

let cachedShapesPromise: { promise: Promise<Record<string, [number, number][]>>, expires: number } | null = null;
async function getAllShapes(kv: KVNamespace) {
  const now = Date.now();
  if (cachedShapesPromise && cachedShapesPromise.expires > now) return cachedShapesPromise.promise;
  const promise = Promise.all(AGENCIES.map(a => getKvJson<Record<string, [number, number][]>>(kv, `shapes:${a}`).catch(() => ({}))))
    .then(results => Object.assign({}, ...results));
  cachedShapesPromise = { promise, expires: now + CACHE_TTL_MS };
  return promise;
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
  await Promise.allSettled(
    AGENCIES.map(async (agency) => {
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
    })
  );
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
        // Build canonical stop sequences per route from KV trip_stops so
        // aggregateTravelTimes can key passages to inter-stop legs. Loading
        // once per cron run (5 min) is cheap relative to the GTFS fetches
        // already happening here.
        let stopSeqs = new Map();
        try {
          const [allTrips, allTripStops] = await Promise.all([
            getAllTrips(env.KV),
            getAllTripStops(env.KV),
          ]);
          stopSeqs = canonicalStopSequencesByRoute(allTrips, allTripStops);
        } catch (err) {
          console.error('Failed to load stop sequences for aggregation:', err);
        }
        await aggregateTravelTimes(env, stopSeqs);
        await cleanupOldPositions(env);
      } catch (err) {
        console.error('Failed to run sampling and aggregation tasks:', err);
      }
    } else if (event.cron === '0 2 * * 1') {
      // Weekly: refresh rail timetables from GTFS static
      try {
        await ingestRailTimetables(env);
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
