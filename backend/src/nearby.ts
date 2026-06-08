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
} from "./types";
import { haversineDistance } from "./haversine";
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

// @ts-ignore
export async function getHistoricalETA(
  db: import('@cloudflare/workers-types').D1Database,
  route: string,
  fromLat: number,
  fromLon: number,
  toStopId: string,
): Promise<number | null> {
  const { results } = await db
    .prepare(
      `SELECT * FROM travel_times WHERE route = ? AND to_stop_id = ? LIMIT 1`,
    )
    .bind(route, toStopId)
    .all();
  if (!results || results.length === 0) return null;
  // Simplistic sum approach, can be refined based on closest from_lat/from_lon
  return (results[0].avg_seconds as number) / 60;
}

export async function getBatchedHistoricalETAs(
  db: import('@cloudflare/workers-types').D1Database,
  queries: {route: string, stopId: string}[],
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (queries.length === 0) return map;

  const stmt = db.prepare(
    `SELECT * FROM travel_times WHERE route = ? AND to_stop_id = ? LIMIT 1`,
  );

  const dbQueries = queries.map((q) => stmt.bind(q.route, q.stopId));
  const results = await db.batch<{avg_seconds: number, route: string, to_stop_id: string}>(dbQueries);

  for (let i = 0; i < results.length; i++) {
    const res = results[i].results;
    if (res && res.length > 0) {
      const q = queries[i];
      map.set(`${q.route}-${q.stopId}`, (res[0].avg_seconds as number) / 60);
    }
  }

  return map;
}
