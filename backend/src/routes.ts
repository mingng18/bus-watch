import { Stop, Route, Trip, TripStopEntry, RouteInfo } from './types';
import { haversineDistance } from './haversine';

export function findNearbyRoutes(
  stops: Stop[],
  routes: Route[],
  trips: Trip[],
  tripStops: Record<string, TripStopEntry[]>,
  lat: number,
  lon: number,
  radiusM: number
): RouteInfo[] {
  // Performance optimization: Replaced chained array methods (.filter().map())
  // with a standard for loop to avoid intermediate array allocations.
  const stopIds = new Set<string>();
  for (let i = 0; i < stops.length; i++) {
    const s = stops[i];
    if (haversineDistance(lat, lon, s.lat, s.lon) <= radiusM) {
      stopIds.add(s.id);
    }
  }

  // Find route IDs that serve any of these stops
  const routeIds = new Set<string>();
  for (const trip of trips) {
    const stopsForTrip = tripStops[trip.id];
    if (!stopsForTrip) continue;
    // Performance optimization: Replaced `.some()` taking an inline lambda with a standard loop
    // to prevent per-iteration function allocation and reduce garbage collection overhead
    // in this heavily repeated hot path (looping through thousands of trips).
    // Expected impact: Minor reduction in memory allocation and slight CPU efficiency gain.
    let hasMatch = false;
    for (let i = 0; i < stopsForTrip.length; i++) {
      if (stopIds.has(stopsForTrip[i].stopId)) {
        hasMatch = true;
        break;
      }
    }
    if (hasMatch) {
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
        type: [0, 1, 2].includes(route.type) ? 'rail' : 'bus',
      });
    }
  }

  return Array.from(routeMap.values());
}