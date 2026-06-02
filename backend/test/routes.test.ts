import { describe, it, expect } from 'vitest';
import { findNearbyRoutes } from '../src/routes';
import { Stop, Route, Trip, TripStopEntry } from '../src/types';

const stops: Stop[] = [
  { id: 's1', name: 'Nearby Stop 1', lat: 3.1295, lon: 101.6750, type: 'rail', parentStation: '' },
  { id: 's2', name: 'Nearby Stop 2', lat: 3.1300, lon: 101.6760, type: 'bus', parentStation: '' },
  { id: 's3', name: 'Far Stop', lat: 3.2000, lon: 101.7000, type: 'bus', parentStation: '' },
];

const routes: Route[] = [
  { id: 'r1', shortName: 'Route 1', longName: 'Rail Route 1', type: 1 }, // rail
  { id: 'r2', shortName: 'Route 2', longName: 'Bus Route 2', type: 3 }, // bus
  { id: 'r3', shortName: 'Route 3', longName: 'Rail Route 3', type: 0 }, // rail
];

const trips: Trip[] = [
  { id: 't1', routeId: 'r1', serviceId: 'weekday', headsign: 'Dest 1', directionId: 0, shapeId: 'sh1' },
  { id: 't2', routeId: 'r2', serviceId: 'weekday', headsign: 'Dest 2', directionId: 0, shapeId: 'sh2' },
  { id: 't3', routeId: 'r3', serviceId: 'weekday', headsign: 'Dest 3', directionId: 0, shapeId: 'sh3' },
];

const tripStops: Record<string, TripStopEntry[]> = {
  't1': [
    { stopId: 's1', stopName: 'Nearby Stop 1', lat: 3.1295, lon: 101.6750, arrivalTime: '10:00:00', departureTime: '10:00:00', sequence: 1 },
    { stopId: 's3', stopName: 'Far Stop', lat: 3.2000, lon: 101.7000, arrivalTime: '10:10:00', departureTime: '10:10:00', sequence: 2 },
  ],
  't2': [
    { stopId: 's2', stopName: 'Nearby Stop 2', lat: 3.1300, lon: 101.6760, arrivalTime: '10:05:00', departureTime: '10:05:00', sequence: 1 },
  ],
  't3': [
    { stopId: 's3', stopName: 'Far Stop', lat: 3.2000, lon: 101.7000, arrivalTime: '10:15:00', departureTime: '10:15:00', sequence: 1 },
  ],
};

const centerLat = 3.1290;
const centerLon = 101.6755;

describe('findNearbyRoutes', () => {
  it('returns routes that serve stops within the specified radius', () => {
    // 500m radius covers s1 and s2, but not s3.
    // s1 is served by r1 (via t1).
    // s2 is served by r2 (via t2).
    // s3 is served by r1 (via t1) and r3 (via t3).
    // So within 500m, we should find r1 and r2.
    const result = findNearbyRoutes(stops, routes, trips, tripStops, centerLat, centerLon, 500);

    expect(result).toHaveLength(2);

    const routeIds = result.map(r => r.id);
    expect(routeIds).toContain('r1');
    expect(routeIds).toContain('r2');
    expect(routeIds).not.toContain('r3');
  });

  it('returns empty array if no stops are found within the radius', () => {
    // Very small radius (10m) should not cover any stop
    const result = findNearbyRoutes(stops, routes, trips, tripStops, centerLat, centerLon, 10);
    expect(result).toHaveLength(0);
  });

  it('handles empty inputs gracefully', () => {
    expect(findNearbyRoutes([], routes, trips, tripStops, centerLat, centerLon, 500)).toHaveLength(0);
    expect(findNearbyRoutes(stops, [], trips, tripStops, centerLat, centerLon, 500)).toHaveLength(0);
    expect(findNearbyRoutes(stops, routes, [], tripStops, centerLat, centerLon, 500)).toHaveLength(0);
    expect(findNearbyRoutes(stops, routes, trips, {}, centerLat, centerLon, 500)).toHaveLength(0);
  });

  it('maps route types correctly to rail or bus', () => {
    const result = findNearbyRoutes(stops, routes, trips, tripStops, centerLat, centerLon, 500);

    const r1Info = result.find(r => r.id === 'r1');
    const r2Info = result.find(r => r.id === 'r2');

    expect(r1Info).toBeDefined();
    expect(r1Info?.type).toBe('rail'); // type 1 -> rail

    expect(r2Info).toBeDefined();
    expect(r2Info?.type).toBe('bus'); // type 3 -> bus
  });

  it('deduplicates routes serving multiple nearby stops', () => {
    // Add another trip for r1 that serves s2
    const extraTrips = [...trips, { id: 't4', routeId: 'r1', serviceId: 'weekday', headsign: 'Dest 4', directionId: 1, shapeId: 'sh4' }];
    const extraTripStops = {
      ...tripStops,
      't4': [
        { stopId: 's2', stopName: 'Nearby Stop 2', lat: 3.1300, lon: 101.6760, arrivalTime: '11:00:00', departureTime: '11:00:00', sequence: 1 },
      ],
    };

    const result = findNearbyRoutes(stops, routes, extraTrips, extraTripStops, centerLat, centerLon, 500);

    // r1 is served by t1 at s1 and t4 at s2. Still it should appear only once.
    const r1Infos = result.filter(r => r.id === 'r1');
    expect(r1Infos).toHaveLength(1);
  });
});
