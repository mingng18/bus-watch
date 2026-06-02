import { describe, it, expect } from 'vitest';
import { findNearbyStops, findNearbyPrasaranaBuses } from '../src/nearby';
import { Stop, Route, Trip, VehiclePosition, ScheduleEntry, PrasaranaBus } from '../src/types';

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
  { id: 't1', routeId: 'r1', serviceId: 'weekday', headsign: 'Gombak', directionId: 0, shapeId: 'sh1' },
  { id: 't2', routeId: 'r2', serviceId: 'weekday', headsign: 'KL Sentral', directionId: 0, shapeId: 'sh2' },
];

const vehicles: VehiclePosition[] = [
  { tripId: 't2', routeId: 'r2', lat: 3.1301, lon: 101.6761, currentStopSequence: 5, timestamp: 1000, stopId: 's2' },
];

// Provide minimal valid objects to satisfy function arguments
const schedule: Record<string, any[]> = {
  s1: [
    { tripId: 't1', routeShortName: 'Kelana Jaya', headsign: 'Gombak', departureTime: '22:30:00', directionId: 0, stopId: 's1', stopName: 'Bangsar LRT', lat: 3.1295, lon: 101.6750, arrivalTime: '22:30:00', sequence: 1 },
  ],
};

const calendar: any[] = [];
const frequencies: any[] = [];

describe('findNearbyStops', () => {
  it('returns stops within radius sorted by distance', () => {
    const result = findNearbyStops(stops, routes, trips, schedule, calendar, frequencies, vehicles, 3.1290, 101.6755, 500);
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result[0].distance_m).toBeLessThan(200);
  });

  it('excludes stops beyond radius', () => {
    const result = findNearbyStops(stops, routes, trips, schedule, calendar, frequencies, vehicles, 3.1290, 101.6755, 500);
    const ids = result.map(s => s.id);
    expect(ids).not.toContain('s3');
  });

  it('includes bus realtime arrivals', () => {
    const result = findNearbyStops(stops, routes, trips, schedule, calendar, frequencies, vehicles, 3.1290, 101.6755, 500);
    const busStop = result.find(s => s.id === 's2');
    expect(busStop).toBeDefined();
    expect(busStop!.arrivals.length).toBeGreaterThan(0);
    expect(busStop!.arrivals[0].isRealtime).toBe(true);
    expect(busStop!.arrivals[0].route).toBe('300');
  });

  it('includes rail scheduled arrivals', () => {
    const result = findNearbyStops(stops, routes, trips, schedule, calendar, frequencies, vehicles, 3.1290, 101.6755, 500);
    const railStop = result.find(s => s.id === 's1');
    expect(railStop).toBeDefined();
    expect(railStop!.arrivals.length).toBeGreaterThan(0);
    expect(railStop!.arrivals[0].isRealtime).toBe(false);
  });
});

describe('findNearbyPrasaranaBuses', () => {
  const mockRoutes: Route[] = [
    { id: 'r300', shortName: '300', longName: 'Route 300', type: 3 },
    { id: 'r250', shortName: '250', longName: 'Route 250', type: 3 },
  ];

  const mockTrips: Trip[] = [
    { id: 't300', routeId: 'r300', serviceId: 'weekday', headsign: 'Pandan Indah', directionId: 0, shapeId: '' },
  ];

  const mockBuses: PrasaranaBus[] = [
    { bus_no: 'B1', route: '3000', latitude: 3.1301, longitude: 101.6761, speed: 10, trip_rev_kind: '00', dir: 1, provider: '', captain_id: '', dt_gps: '', dt_received: '' },
    { bus_no: 'B2', route: '250', latitude: 3.1310, longitude: 101.6770, speed: 0, trip_rev_kind: '00', dir: 1, provider: '', captain_id: '', dt_gps: '', dt_received: '' },
    { bus_no: 'B3', route: '300', latitude: 3.2000, longitude: 101.7000, speed: 10, trip_rev_kind: '00', dir: 1, provider: '', captain_id: '', dt_gps: '', dt_received: '' },
    { bus_no: 'B4', route: '300', latitude: 3.1301, longitude: 101.6761, speed: 10, trip_rev_kind: '03', dir: 1, provider: '', captain_id: '', dt_gps: '', dt_received: '' },
  ];

  it('includes valid buses within radius and sorts them by ETA', () => {
    const result = findNearbyPrasaranaBuses(mockBuses, mockRoutes, mockTrips, 3.1300, 101.6760, 500);
    expect(result.length).toBeGreaterThanOrEqual(1);

    const b1 = result.find(b => b.busNo === 'B1');
    expect(b1).toBeDefined();
    expect(b1!.routeShortName).toBe('300'); // Validates '3000' -> '300' logic
    expect(b1!.destination).toBe('Pandan Indah'); // Validates GTFS match
  });

  it('excludes buses beyond radius', () => {
    const result = findNearbyPrasaranaBuses(mockBuses, mockRoutes, mockTrips, 3.1300, 101.6760, 500);
    const busNos = result.map(b => b.busNo);
    expect(busNos).not.toContain('B3'); // B3 is at 3.2, 101.7
  });

  it('ignores skipped trip_rev_kind values', () => {
    const result = findNearbyPrasaranaBuses(mockBuses, mockRoutes, mockTrips, 3.1300, 101.6760, 500);
    const busNos = result.map(b => b.busNo);
    expect(busNos).not.toContain('B4'); // B4 has trip_rev_kind '03'
  });
});
