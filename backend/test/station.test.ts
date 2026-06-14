import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getStationSchedule } from '../src/station';
import { Stop, Route, Trip, TripStopEntry, CalendarEntry } from '../src/types';

const stops: Stop[] = [
  { id: 'st1', name: 'Bangsar LRT', lat: 3.1295, lon: 101.6750, type: 'rail', parentStation: '' },
];

const routes: Route[] = [
  { id: 'r1', shortName: 'Kelana Jaya', longName: 'Kelana Jaya Line', type: 1 },
];

const trips: Trip[] = [
  { id: 't1', routeId: 'r1', serviceId: 'wk', headsign: 'Gombak', directionId: 0 },
  { id: 't2', routeId: 'r1', serviceId: 'wk', headsign: 'Putra Heights', directionId: 1 },
];

const tripStops: Record<string, TripStopEntry[]> = {
  t1: [
    { stopId: 'st1', stopName: 'Bangsar LRT', lat: 3.1295, lon: 101.6750, arrivalTime: '08:30:00', departureTime: '08:30:30', sequence: 1 },
    { stopId: 'st2', stopName: 'KL Sentral', lat: 3.1350, lon: 101.6820, arrivalTime: '08:35:00', departureTime: '08:35:30', sequence: 2 },
  ],
  t2: [
    { stopId: 'st1', stopName: 'Bangsar LRT', lat: 3.1295, lon: 101.6750, arrivalTime: '08:32:00', departureTime: '08:32:30', sequence: 1 },
    { stopId: 'st3', stopName: 'Taman Jaya', lat: 3.1200, lon: 101.6600, arrivalTime: '08:37:00', departureTime: '08:37:30', sequence: 2 },
  ],
};

const calendar: CalendarEntry[] = [
  { serviceId: 'wk', days: [true, true, true, true, true, true, true], startDate: '20260101', endDate: '20261231' },
];

describe('getStationSchedule', () => {
  it('returns departures for a station', () => {
    const result = getStationSchedule('st1', stops, routes, trips, tripStops, calendar);
    expect(result.stopName).toBe('Bangsar LRT');
    expect(result.departures.length).toBe(2);
    expect(result.departures[0].line).toBe('Kelana Jaya');
    expect(result.departures[0].destination).toBe('Gombak');
  });

  it('returns departures sorted by time', () => {
    const result = getStationSchedule('st1', stops, routes, trips, tripStops, calendar);
    expect(result.departures[0].departureTime.localeCompare(result.departures[1].departureTime)).toBeLessThanOrEqual(0);
  });

  it('throws for unknown stop', () => {
    expect(() => getStationSchedule('unknown', stops, routes, trips, tripStops, calendar)).toThrow();
  });

  describe('KL timezone (issue #127)', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('computes minutesUntil in KL-local (UTC+8), not UTC', () => {
      // 2026-06-14T00:30:00Z is 08:30 KL-local. A trip departing at 08:35 KL
      // must read as ~5 minutes away. Before the fix, getStationSchedule
      // derived "now" from UTC wall-clock (00:30) and reported ~8h off.
      vi.setSystemTime(new Date('2026-06-14T00:30:00Z'));

      // Service calendar valid for this date; single trip departing 08:35:00 KL.
      const klTrips: Trip[] = [
        { id: 'kl1', routeId: 'r1', serviceId: 'wk', headsign: 'Gombak', directionId: 0 },
      ];
      const klTripStops: Record<string, TripStopEntry[]> = {
        kl1: [
          { stopId: 'st1', stopName: 'Bangsar LRT', lat: 3.1295, lon: 101.6750, arrivalTime: '08:35:00', departureTime: '08:35:00', sequence: 1 },
        ],
      };

      const result = getStationSchedule('st1', stops, routes, klTrips, klTripStops, calendar);
      expect(result.departures.length).toBe(1);
      expect(result.departures[0].minutesUntil).toBe(5);
    });

    it('does not regress at the UTC midnight boundary', () => {
      // 16:30 UTC = 00:30 next-day KL. A 00:35 KL departure must be ~5 min away.
      // Before the fix, getStationSchedule read UTC wall-clock (16:30) and
      // reported ~16h05m off.
      vi.setSystemTime(new Date('2026-06-14T16:30:00Z'));

      const klTrips: Trip[] = [
        { id: 'kl2', routeId: 'r1', serviceId: 'wk', headsign: 'Late', directionId: 0 },
      ];
      const klTripStops: Record<string, TripStopEntry[]> = {
        kl2: [
          { stopId: 'st1', stopName: 'Bangsar LRT', lat: 3.1295, lon: 101.6750, arrivalTime: '00:35:00', departureTime: '00:35:00', sequence: 1 },
        ],
      };

      const result = getStationSchedule('st1', stops, routes, klTrips, klTripStops, calendar);
      expect(result.departures.length).toBe(1);
      expect(result.departures[0].minutesUntil).toBe(5);
    });
  });
});