
import { vi } from 'vitest';
vi.mock('../src/frequency', () => ({
  expandTripsForStop: () => [{
    line: 'Kelana Jaya',
    destination: 'Gombak',
    minutesUntil: 5
  }]
}));
import { describe, it, expect } from 'vitest';
import { findNearbyStops, getHistoricalETA } from '../src/nearby';
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

describe('getHistoricalETA', () => {
  const createMockDb = (mockResults: any) => {
    const bindFn = vi.fn().mockReturnThis();
    const prepareFn = vi.fn().mockReturnThis();
    const allFn = vi.fn().mockResolvedValue({ results: mockResults });

    // Wire up the chain
    prepareFn.mockImplementation(() => ({ bind: bindFn }));
    bindFn.mockImplementation(() => ({ all: allFn }));

    return {
      prepare: prepareFn,
      bind: bindFn,
      all: allFn,
    } as any;
  };

  it('returns null if no results are found', async () => {
    const db = createMockDb([]);
    const result = await getHistoricalETA(db, 'route1', 1, 2, 'stop1');
    expect(result).toBeNull();
  });

  it('returns null if results is null/undefined', async () => {
    const db = createMockDb(null);
    const result = await getHistoricalETA(db, 'route1', 1, 2, 'stop1');
    expect(result).toBeNull();
  });

  it('returns historical ETA in minutes based on avg_seconds', async () => {
    const db = createMockDb([{ avg_seconds: 300 }]);
    const result = await getHistoricalETA(db, 'route1', 1, 2, 'stop1');
    expect(result).toBe(5); // 300 seconds / 60 = 5 minutes
  });

  it('binds parameters correctly', async () => {
    const db = createMockDb([{ avg_seconds: 300 }]);
    await getHistoricalETA(db, 'route1', 1, 2, 'stop1');
    expect(db.prepare).toHaveBeenCalledWith('SELECT * FROM travel_times WHERE route = ? AND to_stop_id = ? LIMIT 1');
    expect(db.bind).toHaveBeenCalledWith('route1', 'stop1');
    expect(db.all).toHaveBeenCalled();
  });
});
