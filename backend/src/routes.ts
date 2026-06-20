import { Stop, Route, Trip, TripStopEntry, RouteInfo } from "./types";
import { haversineDistance } from "./haversine";

export function findNearbyRoutes(
  stops: Stop[],
  routes: Route[],
  trips: Trip[],
  tripStops: Record<string, TripStopEntry[]>,
  lat: number,
  lon: number,
  radiusM: number,
): RouteInfo[] {
  const stopsWithinRadius = stops.filter(
    (s) => haversineDistance(lat, lon, s.lat, s.lon) <= radiusM,
  );
  const stopIds = new Set(stopsWithinRadius.map((s) => s.id));

  // Find route IDs that serve any of these stops
  const routeIds = new Set<string>();
  for (const trip of trips) {
    const stopsForTrip = tripStops[trip.id];
    if (!stopsForTrip) continue;
    if (stopsForTrip.some((s) => stopIds.has(s.stopId))) {
      routeIds.add(trip.routeId);
    }
  }

  const routeMap = new Map<string, RouteInfo>();
  for (const route of routes) {
    if (routeIds.has(route.id) && !routeMap.has(route.id)) {
      routeMap.set(route.id, {
        id: route.id,
        shortName: route.shortName,
        longName: route.longName,
        type: [0, 1, 2].includes(route.type) ? "rail" : "bus",
      });
    }
  }

  return Array.from(routeMap.values());
}
