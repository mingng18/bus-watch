import { describe, it, expect } from 'vitest';
import { mergeBusRoutes } from '../src/index';
import { BusRouteEntry } from '../src/types';

describe('mergeBusRoutes', () => {
  it('handles prototype pollution keys safely', () => {
    const gtfs: BusRouteEntry[] = [
      { routeShortName: '__proto__', routeId: '1', destination: 'A', minutes: 5, tripId: 't1', lat: 0, lon: 0 }
    ];
    const prasarana: BusRouteEntry[] = [
      { routeShortName: 'constructor', routeId: '2', destination: 'B', minutes: 10, tripId: 't2', lat: 0, lon: 0 },
      { routeShortName: '__proto__', routeId: '1', destination: 'A', minutes: 6, tripId: 't3', lat: 0, lon: 0 }
    ];

    const merged = mergeBusRoutes(gtfs, prasarana);

    expect(merged.length).toBe(2);
    expect(merged[0].routeShortName).toBe('__proto__');
    expect(merged[1].routeShortName).toBe('constructor');
  });
});
