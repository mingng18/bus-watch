
import { vi } from 'vitest';
vi.mock('../src/frequency', () => ({
  expandTripsForStop: () => [{
    line: 'Kelana Jaya',
    destination: 'Gombak',
    minutesUntil: 5
  }]
}));
import { describe, it, expect } from 'vitest';
import { findNearbyStops, nearestFromStopOnRoute } from '../src/nearby';
import { Stop, Route, Trip, VehiclePosition, ScheduleEntry, TripStopEntry } from '../src/types';

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

const vehicles: VehiclePosition[] = [
  { tripId: 't2', routeId: 'r2', lat: 3.1301, lon: 101.6761, currentStopSequence: 5, timestamp: 1000, stopId: 's2' },
];

const schedule: Record<string, ScheduleEntry[]> = {
  s1: [
    { tripId: 't1', routeShortName: 'Kelana Jaya', headsign: 'Gombak', departureTime: '22:30:00', directionId: 0 },
  ],
};

describe('findNearbyStops', () => {
  it('returns stops within radius sorted by distance', () => {
    const result = findNearbyStops(stops, routes, trips, schedule as any, [], [], vehicles, 3.1290, 101.6755, 500);
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result[0].distance_m).toBeLessThan(200);
  });

  it('excludes stops beyond radius', () => {
    const result = findNearbyStops(stops, routes, trips, schedule as any, [], [], vehicles, 3.1290, 101.6755, 500);
    const ids = result.map(s => s.id);
    expect(ids).not.toContain('s3');
  });

  it('includes bus realtime arrivals', () => {
    const result = findNearbyStops(stops, routes, trips, schedule as any, [], [], vehicles, 3.1290, 101.6755, 500);
    const busStop = result.find(s => s.id === 's2');
    expect(busStop).toBeDefined();
    expect(busStop!.arrivals.length).toBeGreaterThan(0);
    expect(busStop!.arrivals[0].isRealtime).toBe(true);
    expect(busStop!.arrivals[0].route).toBe('300');
  });

  it('includes rail scheduled arrivals', () => {
    const result = findNearbyStops(stops, routes, trips, schedule as any, [], [], vehicles, 3.1290, 101.6755, 500);
    const railStop = result.find(s => s.id === 's1');
    expect(railStop).toBeDefined();
    expect(railStop!.arrivals.length).toBeGreaterThan(0);
    expect(railStop!.arrivals[0].isRealtime).toBe(false);
  });
});

describe('nearestFromStopOnRoute', () => {
  const tripStops: TripStopEntry[] = [
    { stopId: 'ts1', stopName: 'Stop 1', lat: 3.100, lon: 101.600, arrivalTime: '', departureTime: '', sequence: 1 },
    { stopId: 'ts2', stopName: 'Stop 2', lat: 3.150, lon: 101.650, arrivalTime: '', departureTime: '', sequence: 2 },
    { stopId: 'ts3', stopName: 'Stop 3', lat: 3.200, lon: 101.700, arrivalTime: '', departureTime: '', sequence: 3 },
  ];

  it('returns null if stops array is empty', () => {
    expect(nearestFromStopOnRoute(3.150, 101.650, [])).toBeNull();
  });

  it('returns the exact match if bus is exactly at a stop', () => {
    const result = nearestFromStopOnRoute(3.150, 101.650, tripStops);
    expect(result).not.toBeNull();
    expect(result?.stopId).toBe('ts2');
  });

  it('returns the nearest stop among multiple', () => {
    // Bus is closer to ts3 (3.200, 101.700) than ts2 (3.150, 101.650)
    // Bus at 3.180, 101.680
    const result = nearestFromStopOnRoute(3.180, 101.680, tripStops);
    expect(result).not.toBeNull();
    expect(result?.stopId).toBe('ts3');
  });

  it('returns the only stop when array has one item', () => {
    const singleStop = [tripStops[0]];
    const result = nearestFromStopOnRoute(3.900, 101.900, singleStop);
    expect(result).not.toBeNull();
    expect(result?.stopId).toBe('ts1');
  });
});
