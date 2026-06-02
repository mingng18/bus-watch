import { Trip, TripStopEntry, Frequency, CalendarEntry, Stop } from './types';

export function expandTripsForStop(
  tripsForStop: TripStopEntry[],
  tripsMap: Map<string, Trip>,
  calendarMap: Map<string, CalendarEntry>,
  frequenciesMap: Map<string, Frequency[]>,
  dayOfWeek: string,
  nowMs: number,
  lookaheadMs: number
) {
  return [];
}
