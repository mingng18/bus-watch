
import { vi } from 'vitest';
vi.mock('../src/frequency', () => ({
  expandTripsForStop: () => [{
    line: 'Kelana Jaya',
    destination: 'Gombak',
    minutesUntil: 5
  }]
}));
import { describe, it, expect } from 'vitest';
import { findNearbyStops, findNearbyBusRoutes } from '../src/nearby';
import { Stop, Route, Trip, VehiclePosition, ScheduleEntry } from '../src/types';

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
  { id: 't1', routeId: 'r1', serviceId: 'weekday', headsign: 'Gombak', directionId: 0 },
  { id: 't2', routeId: 'r2', serviceId: 'weekday', headsign: 'KL Sentral', directionId: 0 },
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
describe('findNearbyBusRoutes', () => {
  it('returns nearby bus routes sorted by ETA', () => {
    // Add multiple vehicles at different distances to test sorting
    const localVehicles: VehiclePosition[] = [
      { tripId: 't2', routeId: 'r2', lat: 3.1301, lon: 101.6761, currentStopSequence: 5, timestamp: 1000, stopId: 's2' }, // Close
      { tripId: 't1', routeId: 'r1', lat: 3.1350, lon: 101.6800, currentStopSequence: 2, timestamp: 1000, stopId: 's1' }, // Further
    ];

    // lat/lon near 'Close' vehicle
    const result = findNearbyBusRoutes(routes, trips, localVehicles, 3.1290, 101.6755, 2000);

    expect(result.length).toBe(2);
    // Closest should be first (t2)
    expect(result[0].tripId).toBe('t2');
    expect(result[0].routeShortName).toBe('300');
    expect(result[1].tripId).toBe('t1');
    expect(result[1].routeShortName).toBe('Kelana Jaya');
    expect(result[0].minutes).toBeLessThan(result[1].minutes);
  });

  it('excludes vehicles beyond radius', () => {
    const localVehicles: VehiclePosition[] = [
      { tripId: 't2', routeId: 'r2', lat: 3.1301, lon: 101.6761, currentStopSequence: 5, timestamp: 1000, stopId: 's2' }, // Close
      { tripId: 't1', routeId: 'r1', lat: 3.2000, lon: 101.7000, currentStopSequence: 2, timestamp: 1000, stopId: 's3' }, // Very far
    ];

    const result = findNearbyBusRoutes(routes, trips, localVehicles, 3.1290, 101.6755, 1000); // 1km radius

    expect(result.length).toBe(1);
    expect(result[0].tripId).toBe('t2');
  });

  it('deduplicates by route ID', () => {
    const localVehicles: VehiclePosition[] = [
      // Two vehicles on the same route (r2)
      { tripId: 't2', routeId: 'r2', lat: 3.1301, lon: 101.6761, currentStopSequence: 5, timestamp: 1000, stopId: 's2' }, // Close
      { tripId: 't2', routeId: 'r2', lat: 3.1310, lon: 101.6770, currentStopSequence: 6, timestamp: 1000, stopId: 's2' }, // Slightly further
    ];

    const result = findNearbyBusRoutes(routes, trips, localVehicles, 3.1290, 101.6755, 1000);

    expect(result.length).toBe(1);
    expect(result[0].tripId).toBe('t2');
    // First processed close vehicle is kept
    expect(result[0].lat).toBe(3.1301);
  });
});
