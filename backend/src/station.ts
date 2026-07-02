import { Stop, Route, Trip, TripStopEntry, CalendarEntry, StationScheduleResponse, Departure } from './types';
import { getActiveServiceIds } from './gtfs-static';
import { klSecondsSinceMidnight } from './time-kl';

export function getStationSchedule(
  stopId: string,
  stops: Stop[],
  routes: Route[],
  trips: Trip[],
  tripStops: Record<string, TripStopEntry[]>,
  calendar: CalendarEntry[],
): StationScheduleResponse {
  const stop = stops.find(s => s.id === stopId);
  if (!stop) throw new Error(`Stop not found: ${stopId}`);

  const routeMap = new Map<string, Route>();
  for (let i = 0; i < routes.length; i++) {
    routeMap.set(routes[i].id, routes[i]);
  }
  const activeServiceIds = getActiveServiceIds(calendar, new Date());

  const departures: Departure[] = [];

  // Performance optimization: Hoist current time calculation outside of loop.
  // GTFS departure_time is KL-local (UTC+8); Workers run in UTC, so shift
  // before deriving seconds-of-day. See issue #127.
  const nowSeconds = klSecondsSinceMidnight(new Date());

  for (const trip of trips) {
    if (!activeServiceIds.has(trip.serviceId)) continue;

    const stopsForTrip = tripStops[trip.id];
    if (!stopsForTrip) continue;

    // Performance optimization: Replaced .find() with standard loop to prevent
    // per-iteration lambda function allocation and reduce GC overhead in this hot loop.
    let stopEntry: TripStopEntry | undefined;
    for (let i = 0; i < stopsForTrip.length; i++) {
      if (stopsForTrip[i].stopId === stopId) {
        stopEntry = stopsForTrip[i];
        break;
      }
    }
    if (!stopEntry) continue;

    const route = routeMap.get(trip.routeId);

    // Performance optimization: Replace string split/map with faster zero-allocation index search
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
    departures: departures.slice(0, 10),
  };
}
