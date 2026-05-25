import { Stop, Route, Trip, TripStopEntry, CalendarEntry, Frequency, StationScheduleResponse, Departure } from './types';
import { getActiveServiceIds } from './gtfs-static';

export function getStationSchedule(
  stopId: string,
  stops: Stop[],
  routes: Route[],
  trips: Trip[],
  tripStops: Record<string, TripStopEntry[]>,
  calendar: CalendarEntry[],
  frequencies: Frequency[],
): StationScheduleResponse {
  const stop = stops.find(s => s.id === stopId);
  if (!stop) throw new Error(`Stop not found: ${stopId}`);

  const routeMap = new Map(routes.map(r => [r.id, r]));
  const activeServiceIds = getActiveServiceIds(calendar, new Date());

  const departures: Departure[] = [];

  for (const trip of trips) {
    if (!activeServiceIds.has(trip.serviceId)) continue;

    const stopsForTrip = tripStops[trip.id];
    if (!stopsForTrip) continue;

    const stopEntry = stopsForTrip.find(s => s.stopId === stopId);
    if (!stopEntry) continue;

    const route = routeMap.get(trip.routeId);
    const parts = stopEntry.departureTime.split(':').map(Number);
    const depSeconds = (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
    const now = new Date();
    const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
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
