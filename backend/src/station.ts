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

  const routeMap = new Map(routes.map((r) => [r.id, r]));
  const activeServiceIds = getActiveServiceIds(calendar, new Date());

  const departures: Departure[] = [];

  const now = new Date();
  const nowSeconds =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  for (let i = 0; i < trips.length; i++) {
    const trip = trips[i];
    if (!activeServiceIds.has(trip.serviceId)) continue;

    const stopsForTrip = tripStops[trip.id];
    if (!stopsForTrip) continue;

    let stopEntry: TripStopEntry | undefined;
    for (let j = 0; j < stopsForTrip.length; j++) {
      if (stopsForTrip[j].stopId === stopId) {
        stopEntry = stopsForTrip[j];
        break;
      }
    }
    if (!stopEntry) continue;

    const route = routeMap.get(trip.routeId);

    // Fast parse supporting H:MM:SS and HH:MM:SS
    const timeStr = stopEntry.departureTime;
    const firstColon = timeStr.indexOf(":");
    const secondColon = timeStr.indexOf(":", firstColon + 1);

    // Fallback if formatting is unexpected
    let h = 0,
      m = 0,
      s = 0;
    if (firstColon > 0) {
      h = parseInt(timeStr.substring(0, firstColon), 10);
      if (secondColon > 0) {
        m = parseInt(timeStr.substring(firstColon + 1, secondColon), 10);
        s = parseInt(timeStr.substring(secondColon + 1), 10) || 0;
      } else {
        m = parseInt(timeStr.substring(firstColon + 1), 10) || 0;
      }
    } else {
      // In case there are no colons, fallback to original logic or default to 0
      const parts = timeStr.split(":").map(Number);
      h = parts[0] || 0;
      m = parts[1] || 0;
      s = parts[2] || 0;
    }

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
