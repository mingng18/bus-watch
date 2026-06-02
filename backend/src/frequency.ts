import { Trip, TripStopEntry, Route, CalendarEntry, Frequency } from './types';
import { getActiveServiceIds } from './gtfs-static';

export function expandTripsForStop(
  stopId: string,
  trips: Trip[],
  tripStops: Record<string, TripStopEntry[]>,
  routes: Route[],
  calendar: CalendarEntry[],
  frequencies: Frequency[],
  now: Date,
  minutesAhead: number
): any[] {
  const activeServiceIds = getActiveServiceIds(calendar, now);
  const routeMap = new Map(routes.map(r => [r.id, r]));

  const expanded: any[] = [];
  const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  for (const trip of trips) {
    if (!activeServiceIds.has(trip.serviceId)) continue;
    const stopsForTrip = tripStops[trip.id];
    if (!stopsForTrip) continue;

    const stopEntry = stopsForTrip.find(s => s.stopId === stopId);
    if (!stopEntry) continue;

    const route = routeMap.get(trip.routeId);
    const parts = stopEntry.departureTime.split(':').map(Number);
    const depSeconds = (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
    const minutesUntil = Math.round((depSeconds - nowSeconds) / 60);

    if (minutesUntil >= 0 && minutesUntil <= minutesAhead) {
      expanded.push({
        line: route?.shortName || '',
        destination: trip.headsign,
        minutesUntil,
      });
    }
  }

  expanded.sort((a, b) => a.minutesUntil - b.minutesUntil);
  return expanded;
}
