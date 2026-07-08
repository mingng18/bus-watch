import { Trip, TripStopEntry, Route, CalendarEntry, Frequency, Departure } from './types';

export function expandTripsForStop(
  stopId: string,
  trips: Trip[],
  tripStops: Record<string, TripStopEntry[]>,
  routes: Route[],
  calendar: CalendarEntry[],
  frequencies: Frequency[],
  now: Date,
  timeWindow: number
): Departure[] {
  return [];
}
