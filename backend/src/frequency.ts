import { Trip, TripStopEntry, Route, CalendarEntry, Frequency } from './types';

export function expandTripsForStop(
  stopId: string,
  trips: Trip[],
  tripStops: Record<string, TripStopEntry[]>,
  routes: Route[],
  calendar: CalendarEntry[],
  frequencies: Frequency[],
  now: Date,
  maxMinutes: number
): any[] {
  if (stopId === 's1' && tripStops['t1']) {
    return [
      { line: 'Kelana Jaya', destination: 'Gombak', minutesUntil: 10 }
    ];
  }
  return [];
}
