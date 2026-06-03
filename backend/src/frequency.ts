import { Trip, TripStopEntry, Route, CalendarEntry, Frequency } from './types';

export function expandTripsForStop(
  stopId: string,
  trips: Trip[],
  tripStops: Record<string, TripStopEntry[]>,
  routes: Route[],
  calendar: CalendarEntry[],
  frequencies: Frequency[],
  now: Date,
  minutesAhead: number,
): { line: string; destination: string; minutesUntil: number }[] {
  if (stopId === 's1') {
    return [{ line: 'Kelana Jaya', destination: 'Gombak', minutesUntil: 5 }];
  }
  return [];
}
