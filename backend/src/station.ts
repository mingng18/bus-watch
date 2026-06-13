import {
  Stop,
  Route,
  Trip,
  TripStopEntry,
  CalendarEntry,
  StationScheduleResponse,
  Departure,
} from "./types";
import { getActiveServiceIds } from "./gtfs-static";

export function getStationSchedule(
  stopId: string,
  stops: Stop[],
  routes: Route[],
  trips: Trip[],
  tripStops: Record<string, TripStopEntry[]>,
  calendar: CalendarEntry[],
): StationScheduleResponse {
  const stop = stops.find((s) => s.id === stopId);
  if (!stop) throw new Error(`Stop not found: ${stopId}`);

  // ⚡ Bolt optimization: Hoist Date instantiation outside the loop
  const now = new Date();
  const routeMap = new Map(routes.map((r) => [r.id, r]));
  const activeServiceIds = getActiveServiceIds(calendar, now);

  const departures: Departure[] = [];
  // ⚡ Bolt optimization: Pre-calculate current time outside the loop
  const nowSeconds =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  for (const trip of trips) {
    if (!activeServiceIds.has(trip.serviceId)) continue;

    const stopsForTrip = tripStops[trip.id];
    if (!stopsForTrip) continue;

    const stopEntry = stopsForTrip.find((s) => s.stopId === stopId);
    if (!stopEntry) continue;

    const route = routeMap.get(trip.routeId);
    const t = stopEntry.departureTime;

    // ⚡ Bolt optimization: Use zero-allocation index scanning instead of .split(':').map(Number)
    const firstColon = t.indexOf(":");
    const secondColon = t.indexOf(":", firstColon + 1);

    const h = parseInt(t.substring(0, firstColon), 10) || 0;
    const mStr =
      secondColon !== -1
        ? t.substring(firstColon + 1, secondColon)
        : t.substring(firstColon + 1);
    const m = parseInt(mStr, 10) || 0;
    const s =
      secondColon !== -1 ? parseInt(t.substring(secondColon + 1), 10) || 0 : 0;

    const depSeconds = h * 3600 + m * 60 + s;
    const minutesUntil = Math.round((depSeconds - nowSeconds) / 60);

    departures.push({
      line: route?.shortName || "",
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
