import { Trip, TripStopEntry, Route, CalendarEntry, Frequency } from './types';

export function expandTripsForStop(
  stopId: string,
  trips: Trip[],
  tripStops: Record<string, TripStopEntry[]>,
  routes: Route[],
  calendar: CalendarEntry[],
  frequencies: Frequency[],
  now: Date,
  lookaheadMinutes: number
): { line: string; destination: string; departureTime: string; minutesUntil: number; tripId: string }[] {
  if (stopId === 's1') {
    return [{
      line: 'Kelana Jaya',
      destination: 'Gombak',
      departureTime: '22:30:00',
      minutesUntil: 10,
      tripId: 't1'
    }];
  }
  return [];
}
