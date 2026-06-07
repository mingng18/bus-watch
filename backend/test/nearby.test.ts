import { describe, it, expect } from 'vitest';
import { findNearbyStops } from '../src/nearby';
import { Stop, Route, Trip, VehiclePosition, ScheduleEntry, TripStopEntry, CalendarEntry, Frequency } from '../src/types';

const stops: Stop[] = [
  { id: 's1', name: 'Bangsar LRT', lat: 3.1295, lon: 101.6750, type: 'rail', parentStation: '' },
  { id: 's2', name: 'Bus Stop A', lat: 3.1300, lon: 101.6760, type: 'bus', parentStation: '' },
  { id: 's3', name: 'Far Stop', lat: 3.2000, lon: 101.7000, type: 'bus', parentStation: '' },
];

const routes: Route[] = [
  { id: 'r1', shortName: 'Kelana Jaya', longName: 'Kelana Jaya Line', type: 1 },
  { id: 'r2', shortName: '300', longName: 'Route 300', type: 3 },
];

const trips: Trip[] = [
  { id: 't1', routeId: 'r1', serviceId: 'weekday', headsign: 'Gombak', directionId: 0, shapeId: '' },
  { id: 't2', routeId: 'r2', serviceId: 'weekday', headsign: 'KL Sentral', directionId: 0, shapeId: '' },
];

const tripStops: Record<string, TripStopEntry[]> = {
  t1: [
    { stopId: 's1', stopName: 'Bangsar LRT', lat: 3.1295, lon: 101.6750, arrivalTime: '23:59:59', departureTime: '23:59:59', sequence: 1 },
  ],
};

const now = new Date();
const pad = (n: number) => String(n).padStart(2, '0');
const depTime = `${pad(now.getHours())}:${pad(now.getMinutes() + 10)}:00`;
tripStops.t1[0].departureTime = depTime;

const calendar: CalendarEntry[] = [
  { serviceId: 'weekday', days: [true, true, true, true, true, true, true], startDate: '20200101', endDate: '20991231' },
];

const frequencies: Frequency[] = [];

const vehicles: VehiclePosition[] = [
  { tripId: 't2', routeId: 'r2', lat: 3.1301, lon: 101.6761, currentStopSequence: 5, timestamp: 1000, stopId: 's2' },
];

describe('findNearbyStops', () => {
  it('returns stops within radius sorted by distance', () => {
    const result = findNearbyStops(stops, routes, trips, tripStops, calendar, frequencies, vehicles, 3.1290, 101.6755, 500);
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result[0].distance_m).toBeLessThan(200);
  });

  it('excludes stops beyond radius', () => {
    const result = findNearbyStops(stops, routes, trips, tripStops, calendar, frequencies, vehicles, 3.1290, 101.6755, 500);
    const ids = result.map(s => s.id);
    expect(ids).not.toContain('s3');
  });

  it('includes bus realtime arrivals', () => {
    const result = findNearbyStops(stops, routes, trips, tripStops, calendar, frequencies, vehicles, 3.1290, 101.6755, 500);
    const busStop = result.find(s => s.id === 's2');
    expect(busStop).toBeDefined();
    expect(busStop!.arrivals.length).toBeGreaterThan(0);
    expect(busStop!.arrivals[0].isRealtime).toBe(true);
    expect(busStop!.arrivals[0].route).toBe('300');
  });

  it('includes rail scheduled arrivals', () => {
    const result = findNearbyStops(stops, routes, trips, tripStops, calendar, frequencies, vehicles, 3.1290, 101.6755, 500);
    const railStop = result.find(s => s.id === 's1');
    expect(railStop).toBeDefined();
    expect(railStop!.arrivals.length).toBeGreaterThan(0);
    expect(railStop!.arrivals[0].isRealtime).toBe(false);
  });
});
