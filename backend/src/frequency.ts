import { Trip, TripStopEntry, Frequency, Route, CalendarEntry } from './types';

export function expandTripsForStop(
  stopId: string,
  trips: Trip[],
  tripStops: Record<string, TripStopEntry[]>,
  routes: Route[],
  calendar: CalendarEntry[],
  frequencies: Frequency[],
  now: Date,
  lookaheadMinutes: number
): any[] {
  return [];
}
