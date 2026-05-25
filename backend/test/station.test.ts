import { describe, it, expect } from 'vitest';
import { getStationSchedule } from '../src/station';
import { Stop, Route, Trip, TripStopEntry, CalendarEntry, Frequency } from '../src/types';

const stops: Stop[] = [
  { id: 'st1', name: 'Bangsar LRT', lat: 3.1295, lon: 101.6750, type: 'rail', parentStation: '' },
];

const routes: Route[] = [
  { id: 'r1', shortName: 'Kelana Jaya', longName: 'Kelana Jaya Line', type: 1 },
];

const trips: Trip[] = [
  { id: 't1', routeId: 'r1', serviceId: 'wk', headsign: 'Gombak', directionId: 0, shapeId: '' },
  { id: 't2', routeId: 'r1', serviceId: 'wk', headsign: 'Putra Heights', directionId: 1, shapeId: '' },
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
  { serviceId: 'wk', days: [true, true, true, true, true, true, true], startDate: '20000101', endDate: '20991231' },
];

const frequencies: Frequency[] = [];

describe('getStationSchedule', () => {
  it('returns departures for a station', () => {
    const result = getStationSchedule('st1', stops, routes, trips, tripStops, calendar, frequencies);
    expect(result.stopName).toBe('Bangsar LRT');
    expect(result.departures.length).toBe(2);
    expect(result.departures[0].line).toBe('Kelana Jaya');
    expect(result.departures[0].destination).toBe('Gombak');
  });

  it('returns departures sorted by time', () => {
    const result = getStationSchedule('st1', stops, routes, trips, tripStops, calendar, frequencies);
    expect(result.departures[0].departureTime.localeCompare(result.departures[1].departureTime)).toBeLessThanOrEqual(0);
  });

  it('throws for unknown stop', () => {
    expect(() => getStationSchedule('unknown', stops, routes, trips, tripStops, calendar, frequencies)).toThrow();
  });
});
