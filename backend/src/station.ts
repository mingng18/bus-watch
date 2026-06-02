import { Stop, Route, Trip, TripStopEntry, CalendarEntry, StationScheduleResponse, Departure } from './types';
import { getActiveServiceIds } from './gtfs-static';

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

  const routeMap = new Map(routes.map(r => [r.id, r]));

  const now = new Date();
  const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const activeServiceIds = getActiveServiceIds(calendar, now);

  const departures: Departure[] = [];

  for (const trip of trips) {
    if (!activeServiceIds.has(trip.serviceId)) continue;

    const stopsForTrip = tripStops[trip.id];
    if (!stopsForTrip) continue;

    let stopEntry;
    for (let i = 0, len = stopsForTrip.length; i < len; i++) {
      if (stopsForTrip[i].stopId === stopId) {
        stopEntry = stopsForTrip[i];
        break;
      }
    }
    if (!stopEntry) continue;

    const route = routeMap.get(trip.routeId);

    const time = stopEntry.departureTime;
    const h = (time.charCodeAt(0) - 48) * 10 + (time.charCodeAt(1) - 48);
    const m = (time.charCodeAt(3) - 48) * 10 + (time.charCodeAt(4) - 48);
    const s = (time.charCodeAt(6) - 48) * 10 + (time.charCodeAt(7) - 48);

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
