import { Stop, Trip, TripStopEntry, Route, CalendarEntry, Frequency } from './types';
export function expandTripsForStop(
  stopId: string,
  trips: Trip[],
  tripStops: Record<string, TripStopEntry[]>,
  routes: Route[],
  calendar: CalendarEntry[],
  frequencies: Frequency[],
  now: Date,
  timeWindowMins: number = 120
): any[] {
    return [];
}
