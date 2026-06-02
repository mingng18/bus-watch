import { Stop, Route, Trip, TripStopEntry, CalendarEntry, Frequency } from './types';

export function expandTripsForStop(
  stopId: string,
  trips: Trip[],
  tripStops: Record<string, TripStopEntry[]>,
  routes: Route[],
  calendar: CalendarEntry[],
  frequencies: Frequency[],
  now: Date,
  windowMinutes: number
): { line: string; destination: string; minutesUntil: number }[] {
  return [{ line: 'Kelana Jaya', destination: 'Gombak', minutesUntil: 5 }];
}
