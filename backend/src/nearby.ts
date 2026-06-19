import {
  Stop,
  Route,
  Trip,
  TripStopEntry,
  CalendarEntry,
  Frequency,
  VehiclePosition,
  NearbyStop,
  Arrival,
  BusRouteEntry,
  PrasaranaBus,
  HistoricalEtaResult,
  EtaConfidence,
} from "./types";
import { haversineDistance } from "./haversine";
import { klDayOfWeek, klHour } from "./time-kl";
// @ts-ignore
import { expandTripsForStop } from "./frequency";

export function findNearbyStops(
  stops: Stop[],
  routes: Route[],
  trips: Trip[],
  tripStops: Record<string, TripStopEntry[]>,
  calendar: CalendarEntry[],
  frequencies: Frequency[],
  vehicles: VehiclePosition[],
  lat: number,
  lon: number,
  radiusM: number,
): NearbyStop[] {
  const now = new Date();
  const nearby = stops
    .map((stop) => ({
      stop,
      distance: haversineDistance(lat, lon, stop.lat, stop.lon),
    }))
    .filter(({ distance }) => distance <= radiusM)
    .sort((a, b) => a.distance - b.distance);

  // Performance optimization: Precompute map to avoid O(N^2) lookups in loop
  const tripMap = new Map(trips.map((t) => [t.id, t]));

  return nearby.map(({ stop, distance }) => {
    const arrivals: Arrival[] = [];

    if (stop.type === "bus") {
      const nearbyVehicles = vehicles.filter(
        (v) => haversineDistance(stop.lat, stop.lon, v.lat, v.lon) <= 500,
      );
      const routeMap = new Map(routes.map((r) => [r.id, r]));
      const seen = new Set<string>();
      for (const v of nearbyVehicles) {
        const trip = tripMap.get(v.tripId);
        const route = trip ? routeMap.get(trip.routeId) : null;
        const key = route?.id || v.tripId;
        if (seen.has(key)) continue;
        seen.add(key);
        const d = haversineDistance(stop.lat, stop.lon, v.lat, v.lon);
        arrivals.push({
          route: route?.shortName || "",
          destination: trip?.headsign || "",
          minutes: Math.max(1, Math.round(d / 300)),
          isRealtime: true,
          tripId: v.tripId,
          // Mark as a live GTFS-realtime position so the client can show the
          // scheduled-vs-live qualifier (issue #133).
          eta_source: "live",
        });
      }
    } else {
      const expanded = expandTripsForStop(
        stop.id,
        trips,
        tripStops,
        routes,
        calendar,
        frequencies,
        now,
        120,
      );
      for (const dep of expanded.slice(0, 3)) {
        arrivals.push({
          line: dep.line,
          destination: dep.destination,
          minutes: dep.minutesUntil,
          isRealtime: false,
        });
      }
    }

    return {
      id: stop.id,
      name: stop.name,
      type: stop.type,
      lat: stop.lat,
      lon: stop.lon,
      distance_m: Math.round(distance),
      arrivals: arrivals.slice(0, 3),
    };
  });
}

export function findNearbyBusRoutes(
  routes: Route[],
  trips: Trip[],
  vehicles: VehiclePosition[],
  lat: number,
  lon: number,
  radiusM: number = 1000,
): BusRouteEntry[] {
  const routeMap = new Map(routes.map((r) => [r.id, r]));
  // Performance optimization: Precompute map to avoid O(N^2) lookups in loop
  const tripMap = new Map(trips.map((t) => [t.id, t]));
  const results: BusRouteEntry[] = [];
  const seen = new Set<string>();

  for (const v of vehicles) {
    const d = haversineDistance(lat, lon, v.lat, v.lon);
    if (d > radiusM) continue;

    const trip = tripMap.get(v.tripId);
    const route = trip ? routeMap.get(trip.routeId) : null;
    const key = route?.id || v.tripId;
    if (seen.has(key)) continue;
    seen.add(key);

    results.push({
      routeId: route?.id || v.routeId,
      routeShortName: route?.shortName || route?.longName || "",
      destination: trip?.headsign || "",
      minutes: Math.max(1, Math.round(d / 300)),
      tripId: v.tripId,
      lat: v.lat,
      lon: v.lon,
    });
  }

  results.sort((a, b) => a.minutes - b.minutes);
  return results;
}

export function findNearbyPrasaranaBuses(
  buses: PrasaranaBus[],
  routes: Route[],
  trips: Trip[],
  lat: number,
  lon: number,
  radiusM: number = 1000,
): BusRouteEntry[] {
  // Performance optimization: Precompute map to avoid O(N^2) lookups in loop
  const routeTripMap = new Map<string, Trip>();
  for (const t of trips) {
    if (!routeTripMap.has(t.routeId)) {
      routeTripMap.set(t.routeId, t);
    }
  }

  const routeNameMap = new Map<
    string,
    { route: Route; trip: Trip | undefined }
  >();
  for (const r of routes) {
    if (!routeNameMap.has(r.shortName)) {
      const trip = routeTripMap.get(r.id);
      routeNameMap.set(r.shortName, { route: r, trip });
    }
  }

  const results: BusRouteEntry[] = [];

  for (const b of buses) {
    if (
      b.trip_rev_kind === "01" ||
      b.trip_rev_kind === "03" ||
      b.trip_rev_kind === "05"
    )
      continue;

    const d = haversineDistance(lat, lon, b.latitude, b.longitude);
    if (d > radiusM) continue;

    const routeCode = normalizeRouteCode(b.route);

    // Match with GTFS route for destination
    const gtfsMatch = routeNameMap.get(routeCode);
    const destination = gtfsMatch?.trip?.headsign || "";

    // Road distance factor ~1.4 for urban KL
    const roadDist = d * 1.4;
    const minutes =
      b.speed > 0
        ? Math.max(1, Math.round(roadDist / (b.speed * 16.67)))
        : Math.max(1, Math.round(roadDist / 250));

    results.push({
      routeId: gtfsMatch?.route.id || routeCode,
      routeShortName: routeCode,
      destination,
      minutes,
      tripId: b.bus_no,
      lat: b.latitude,
      lon: b.longitude,
      busNo: b.bus_no,
    });
  }

  results.sort((a, b) => a.minutes - b.minutes);
  return results;
}

function normalizeRouteCode(code: string): string {
  if (code.endsWith("0")) return code.slice(0, -1);
  return code;
}

/**
 * Coarse confidence bucket from sample size + spread. Used by both ETA paths
 * so the rider sees an honest "approx N min ±M" instead of a single false-
 * precision point estimate. Thresholds are deliberately conservative:
 *   - high:   ≥8 samples AND spread ≤ 25% of the mean (consistent leg)
 *   - medium: ≥3 samples (enough to trust a rough number)
 *   - low:    anything else (one-off; show but flag as uncertain)
 */
export function confidenceFromSamples(
  sampleCount: number,
  spreadSeconds: number,
  avgSeconds: number,
): EtaConfidence {
  if (
    sampleCount >= 8 &&
    (avgSeconds === 0 || spreadSeconds / avgSeconds <= 0.25)
  )
    return "high";
  if (sampleCount >= 3) return "medium";
  return "low";
}

/**
 * Build a HistoricalEtaResult from a travel_times row.
 */
function resultFromRow(row: {
  avg_seconds: number;
  sample_count: number;
  spread_seconds: number;
}): HistoricalEtaResult {
  const minutes = row.avg_seconds / 60;
  const uncertaintyMinutes = row.spread_seconds / 60;
  return {
    minutes,
    uncertaintyMinutes,
    confidence: confidenceFromSamples(
      row.sample_count,
      row.spread_seconds,
      row.avg_seconds,
    ),
    isLive: false,
    sampleCount: row.sample_count,
  };
}

/**
 * Historical ETA for a single (route, from_stop → to_stop) leg at the current
 * KL day + hour. Returns null when there's no data at all.
 *
 * The previous signature took (fromLat, fromLon) and ignored them (audit,
 * issue #133); the caller now resolves the from-stop id from the bus's
 * position via nearestFromStopOnRoute, which is the actual key travel_times
 * is stored under.
 */
export async function getHistoricalETA(
  db: import("@cloudflare/workers-types").D1Database,
  route: string,
  fromStopId: string,
  toStopId: string,
  now: Date = new Date(),
): Promise<HistoricalEtaResult | null> {
  const dow = klDayOfWeek(now);
  const hour = klHour(now);
  // Prefer an exact (day, hour) bucket; fall back to same-day any-hour, then
  // any bucket for this leg. ORDER BY sample_count desc picks the most
  // representative row when several hours match the fallback.
  const { results } = await db
    .prepare(
      `SELECT avg_seconds, sample_count, spread_seconds FROM travel_times
       WHERE route = ? AND from_stop_id = ? AND to_stop_id = ?
       ORDER BY
         CASE WHEN day_of_week = ? AND time_bucket = ? THEN 0
              WHEN day_of_week = ? THEN 1
              ELSE 2 END,
         sample_count DESC
       LIMIT 1`,
    )
    .bind(route, fromStopId, toStopId, dow, hour, dow)
    .all<{
      avg_seconds: number;
      sample_count: number;
      spread_seconds: number;
    }>();
  if (!results || results.length === 0) return null;
  return resultFromRow(results[0]);
}

/**
 * Batched historical ETA for the /nearby enrichment path. For each query the
 * rider is AT `stopId` (the to_stop); we don't know the bus's exact from-stop
 * here, so pick the travel_times row for (route, to_stop=stopId) with the
 * highest sample_count at the current KL day/hour — the most representative
 * upstream leg. Returns confidence + isLive alongside the minutes.
 */
export async function getBatchedHistoricalETAs(
  db: import("@cloudflare/workers-types").D1Database,
  queries: { route: string; stopId: string }[],
  now: Date = new Date(),
): Promise<Map<string, HistoricalEtaResult>> {
  const map = new Map<string, HistoricalEtaResult>();
  if (queries.length === 0) return map;

  const dow = klDayOfWeek(now);
  const hour = klHour(now);
  const stmt = db.prepare(
    `SELECT avg_seconds, sample_count, spread_seconds FROM travel_times
     WHERE route = ? AND to_stop_id = ?
     ORDER BY
       CASE WHEN day_of_week = ? AND time_bucket = ? THEN 0
            WHEN day_of_week = ? THEN 1
            ELSE 2 END,
       sample_count DESC
     LIMIT 1`,
  );

  const dbQueries = queries.map((q) =>
    stmt.bind(q.route, q.stopId, dow, hour, dow),
  );
  const results = await db.batch<{
    avg_seconds: number;
    sample_count: number;
    spread_seconds: number;
  }>(dbQueries);

  for (let i = 0; i < results.length; i++) {
    const res = results[i].results;
    if (res && res.length > 0) {
      const q = queries[i];
      map.set(`${q.route}-${q.stopId}`, resultFromRow(res[0]));
    }
  }

  return map;
}

/**
 * Given a bus position and a route's ordered stop list, return the stop the
 * bus most recently passed (the from-stop for an ETA to a downstream stop).
 * Used by /bus/eta to resolve the from-stop key the audit flagged as missing.
 */
export function nearestFromStopOnRoute(
  busLat: number,
  busLon: number,
  stops: TripStopEntry[],
): TripStopEntry | null {
  if (stops.length === 0) return null;
  let best = stops[0];
  let bestD = haversineDistance(busLat, busLon, best.lat, best.lon);
  for (let i = 1; i < stops.length; i++) {
    const d = haversineDistance(busLat, busLon, stops[i].lat, stops[i].lon);
    if (d < bestD) {
      bestD = d;
      best = stops[i];
    }
  }
  return best;
}
