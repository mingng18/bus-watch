import { Stop, Route, Trip, TripStopEntry, CalendarEntry, StationScheduleResponse, Departure } from './types';
import { getActiveServiceIds } from './gtfs-static';
import { klSecondsSinceMidnight } from './time-kl';

/**
 * Given a current stop and a saved destination stop, return the next N
 * departures from the current stop heading toward the destination — by
 * filtering existing schedule/trip data.
 *
 * A trip is considered to head "toward" the destination when the destination
 * stop appears later in that trip's stop sequence than the current stop.
 * This matches the user's mental model: a bus/train boarding here will pass
 * through (and stop at) the destination.
 */
export function getDeparturesTowardDestination(
  stopId: string,
  destinationStopId: string,
  stops: Stop[],
  routes: Route[],
  trips: Trip[],
  tripStops: Record<string, TripStopEntry[]>,
  calendar: CalendarEntry[],
  limit = 5,
): StationScheduleResponse {
  const stop = stops.find(s => s.id === stopId);
  if (!stop) throw new Error(`Stop not found: ${stopId}`);

  const routeMap = new Map<string, Route>();
  for (let i = 0; i < routes.length; i++) {
    routeMap.set(routes[i].id, routes[i]);
  }
  const activeServiceIds = getActiveServiceIds(calendar, new Date());

  const departures: Departure[] = [];

  // Hoist current time calculation outside of the loop.
  // GTFS departure_time is KL-local (UTC+8); Workers run in UTC, so shift
  // before deriving seconds-of-day. See issue #127.
  const nowSeconds = klSecondsSinceMidnight(new Date());

  for (const trip of trips) {
    if (!activeServiceIds.has(trip.serviceId)) continue;

    const stopsForTrip = tripStops[trip.id];
    if (!stopsForTrip) continue;

    // Performance optimization: Replaced .findIndex() with standard loop to prevent
    // per-iteration lambda function allocation and reduce GC overhead in this hot loop.
    let currentIdx = -1;
    for (let i = 0; i < stopsForTrip.length; i++) {
      if (stopsForTrip[i].stopId === stopId) {
        currentIdx = i;
        break;
      }
    }
    if (currentIdx === -1) continue;

    // The trip must continue on to the destination stop AFTER the current stop.
    // Optimization: start searching from currentIdx + 1 directly instead of doing a full array iteration
    let hasDestination = false;
    for (let i = currentIdx + 1; i < stopsForTrip.length; i++) {
      if (stopsForTrip[i].stopId === destinationStopId) {
        hasDestination = true;
        break;
      }
    }
    if (!hasDestination) continue;

    const stopEntry = stopsForTrip[currentIdx];
    const route = routeMap.get(trip.routeId);

    // Zero-allocation time parsing (matches station.ts convention).
    const time = stopEntry.departureTime;
    const c1 = time.indexOf(':');
    const c2 = time.indexOf(':', c1 + 1);
    const h = parseInt(time.substring(0, c1), 10) || 0;
    const m = parseInt(time.substring(c1 + 1, c2 !== -1 ? c2 : undefined), 10) || 0;
    const s = c2 !== -1 ? parseInt(time.substring(c2 + 1), 10) || 0 : 0;

    const depSeconds = h * 3600 + m * 60 + s;
    const minutesUntil = Math.round((depSeconds - nowSeconds) / 60);

    departures.push({
      line: route?.shortName || '',
      destination: trip.headsign,
      departureTime: stopEntry.departureTime,
      minutesUntil,
    });
  }

  departures.sort((a, b) => a.departureTime.localeCompare(b.departureTime));

  return {
    stopId,
    stopName: stop.name,
    departures: departures.slice(0, limit),
  };
}
