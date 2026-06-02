import { Trip, TripStopEntry, Route, CalendarEntry, Frequency } from './types';
import { getActiveServiceIds } from './gtfs-static';

export interface ExpandedDeparture {
  line: string;
  destination: string;
  departureTime: string;
  minutesUntil: number;
}

export function expandTripsForStop(
  stopId: string,
  trips: Trip[],
  tripStops: Record<string, TripStopEntry[]>,
  routes: Route[],
  calendar: CalendarEntry[],
  frequencies: Frequency[],
  now: Date,
  windowMinutes: number
): ExpandedDeparture[] {
  const activeServiceIds = getActiveServiceIds(calendar, now);
  const routeMap = new Map(routes.map(r => [r.id, r]));
  const freqMap = new Map<string, Frequency[]>();
  for (const f of frequencies) {
    if (!freqMap.has(f.tripId)) freqMap.set(f.tripId, []);
    freqMap.get(f.tripId)!.push(f);
  }

  const departures: ExpandedDeparture[] = [];
  const nowSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const upperSecs = nowSecs + windowMinutes * 60;

  for (const trip of trips) {
    if (!activeServiceIds.has(trip.serviceId)) continue;

    const stopsForTrip = tripStops[trip.id];
    if (!stopsForTrip) continue;

    const stopEntry = stopsForTrip.find(s => s.stopId === stopId);
    if (!stopEntry) continue;

    const route = routeMap.get(trip.routeId);
    const line = route?.shortName || '';

    const freqs = freqMap.get(trip.id);
    if (freqs && freqs.length > 0) {
      // Frequency-based
      const parts = stopEntry.departureTime.split(':').map(Number);
      const stopOffsetSecs = (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);

      // Assume trip start time in stop_times is 00:00:00 for frequency-based
      for (const f of freqs) {
        const startParts = f.startTime.split(':').map(Number);
        const endParts = f.endTime.split(':').map(Number);
        const startSecs = (startParts[0] || 0) * 3600 + (startParts[1] || 0) * 60 + (startParts[2] || 0);
        const endSecs = (endParts[0] || 0) * 3600 + (endParts[1] || 0) * 60 + (endParts[2] || 0);

        for (let t = startSecs; t <= endSecs; t += f.headwaySecs) {
          const depSecs = t + stopOffsetSecs;
          if (depSecs >= nowSecs && depSecs <= upperSecs) {
            const h = Math.floor(depSecs / 3600);
            const m = Math.floor((depSecs % 3600) / 60);
            const s = depSecs % 60;
            const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
            departures.push({
              line,
              destination: trip.headsign,
              departureTime: timeStr,
              minutesUntil: Math.floor((depSecs - nowSecs) / 60),
            });
          }
        }
      }
    } else {
      // Fixed-schedule
      const parts = stopEntry.departureTime.split(':').map(Number);
      const depSecs = (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
      if (depSecs >= nowSecs && depSecs <= upperSecs) {
        departures.push({
          line,
          destination: trip.headsign,
          departureTime: stopEntry.departureTime,
          minutesUntil: Math.floor((depSecs - nowSecs) / 60),
        });
      }
    }
  }

  departures.sort((a, b) => a.minutesUntil - b.minutesUntil);
  return departures;
}
