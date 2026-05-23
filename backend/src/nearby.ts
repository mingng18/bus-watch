import { Stop, Route, Trip, VehiclePosition, ScheduleEntry, NearbyStop, Arrival } from './types';
import { haversineDistance } from './haversine';

export function findNearbyStops(
  stops: Stop[],
  routes: Route[],
  trips: Trip[],
  vehicles: VehiclePosition[],
  schedule: Record<string, ScheduleEntry[]>,
  lat: number,
  lon: number,
  radiusM: number,
): NearbyStop[] {
  const now = new Date();
  const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  const nearby = stops
    .map(stop => ({
      stop,
      distance: haversineDistance(lat, lon, stop.lat, stop.lon),
    }))
    .filter(({ distance }) => distance <= radiusM)
    .sort((a, b) => a.distance - b.distance);

  const routeMap = new Map(routes.map(r => [r.id, r]));
  const tripMap = new Map(trips.map(t => [t.id, t]));

  return nearby.map(({ stop, distance }) => {
    const arrivals: Arrival[] = [];

    if (stop.type === 'bus') {
      const nearbyVehicles = vehicles.filter(v => {
        const d = haversineDistance(stop.lat, stop.lon, v.lat, v.lon);
        return d <= 500;
      });

      const seen = new Set<string>();
      for (const v of nearbyVehicles) {
        const trip = tripMap.get(v.tripId);
        const route = trip ? routeMap.get(trip.routeId) : null;
        const key = route?.id || v.tripId;
        if (seen.has(key)) continue;
        seen.add(key);

        const d = haversineDistance(stop.lat, stop.lon, v.lat, v.lon);
        const minutes = Math.max(1, Math.round(d / 300));
        arrivals.push({
          route: route?.shortName || '',
          destination: trip?.headsign || '',
          minutes,
          isRealtime: true,
        });
      }
    } else {
      const entries = schedule[stop.id] || [];
      for (const entry of entries) {
        const parts = entry.departureTime.split(':').map(Number);
        const depSeconds = (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
        const minutesUntil = Math.round((depSeconds - nowSeconds) / 60);
        if (minutesUntil >= 0 && minutesUntil < 120) {
          arrivals.push({
            line: entry.routeShortName,
            destination: entry.headsign,
            minutes: minutesUntil,
            isRealtime: false,
          });
        }
      }
      arrivals.sort((a, b) => a.minutes - b.minutes);
    }

    return {
      id: stop.id,
      name: stop.name,
      type: stop.type,
      distance_m: Math.round(distance),
      arrivals: arrivals.slice(0, 3),
    };
  });
}