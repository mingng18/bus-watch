import * as sampling from '../src/sampling';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAllStops, getAllRoutes, getRoutesMaps, getTripsMaps, getStopsMap, getCanonicalStopSequences, invalidateStaticData } from '../src/kv';
import { getStationSchedule } from '../src/station';
import { getDeparturesTowardDestination } from '../src/departures-toward';
import type { Route, Stop, Trip, TripStopEntry } from '../src/types';

function makeKV(data: Record<string, unknown>) {
  return { get: vi.fn(async (key: string) => data[key] ?? null), put: vi.fn() } as unknown as KVNamespace;
}
const stop = (name: string): Stop => ({ id: 's1', name, lat: 3.14, lon: 101.68, type: 'rail', parentStation: '' });
const route = (name: string): Route => ({ id: 'r1', shortName: name, longName: name, type: 3 });
const trip = (id: string): Trip => ({ id, routeId: 'r1', serviceId: 'svc', headsign: id, directionId: 0, shapeId: '' });
const entry = (id: string, sequence: number): TripStopEntry => ({ stopId: id, stopName: id, sequence, lat: 3.14, lon: 101.68, arrivalTime: '', departureTime: '' });

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

describe('static transit snapshots', () => {
  it('deduplicates concurrent source reads and derived indexes', async () => {
    const kv = makeKV({ 'routes:rapid-bus-kl': [route('First')] });
    const [routes, first, second] = await Promise.all([getAllRoutes(kv), getRoutesMaps(kv), getRoutesMaps(kv)]);
    expect(first).toBe(second);
    expect(first.map.get('r1')).toBe(routes[0]);
    expect(vi.mocked(kv.get).mock.calls.filter(([key]) => key === 'routes:rapid-bus-kl')).toHaveLength(1);
  });

  it('isolates KV bindings without resetting modules', async () => {
    const a = makeKV({ 'stops:rapid-bus-kl': [stop('A')] });
    const b = makeKV({ 'stops:rapid-bus-kl': [stop('B')] });
    expect((await getStopsMap(a)).get('s1')?.name).toBe('A');
    expect((await getStopsMap(b)).get('s1')?.name).toBe('B');
  });

  it('preserves first-stop lookup semantics in both schedule functions', async () => {
    const kv = makeKV({ 'stops:rapid-bus-kl': [stop('First')], 'stops:rapid-bus-mrtfeeder': [stop('Last')] });
    const stops = await getAllStops(kv);
    const map = await getStopsMap(kv);
    expect(map.get('s1')).toBe(stops[0]);
    expect(getStationSchedule('s1', stops, [], [], {}, [], undefined, map))
      .toEqual(getStationSchedule('s1', stops, [], [], {}, []));
    expect(getDeparturesTowardDestination('s1', 's2', stops, [], [], {}, [], 5, undefined, map))
      .toEqual(getDeparturesTowardDestination('s1', 's2', stops, [], [], {}, []));
    expect(() => getStationSchedule('missing', stops, [], [], {}, [], undefined, map)).toThrow('Stop not found');
  });

  it('preserves each route and trip lookup duplicate rule', async () => {
    const kv = makeKV({
      'routes:rapid-bus-kl': [route('First')],
      'routes:rapid-bus-mrtfeeder': [route('Last')],
      'trips:rapid-bus-kl': [trip('t1'), { ...trip('t1'), headsign: 'Last t1' }, trip('t2')],
    });
    const maps = await getRoutesMaps(kv);
    expect(maps.map.get('r1')?.shortName).toBe('First');
    expect(maps.lastById.get('r1')?.shortName).toBe('Last');
    expect(maps.shortNameMap.get('First')?.id).toBe('r1');
    const trips = await getTripsMaps(kv);
    expect(trips.tripMap.get('t1')?.headsign).toBe('Last t1');
    expect(trips.routeTripMap.get('r1')?.headsign).toBe('t1');
  });

  it('refreshes derived maps when their source expires, even if built late in its TTL', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const data = { 'stops:rapid-bus-kl': [stop('Old')] };
    const kv = makeKV(data);
    await getAllStops(kv);
    vi.setSystemTime(59_999);
    const oldMap = await getStopsMap(kv);
    data['stops:rapid-bus-kl'] = [stop('New')];
    vi.setSystemTime(60_001);
    const newMap = await getStopsMap(kv);
    expect(newMap).not.toBe(oldMap);
    expect(newMap.get('s1')?.name).toBe('New');
  });

  it('reuses canonical sequences and invalidates them with their source', async () => {
    const data = {
      'trips:rapid-bus-kl': [trip('t1'), trip('t2')],
      'tripStops:rapid-bus-kl': { t1: [entry('s1', 1)], t2: [entry('s1', 1), entry('s2', 2)] },
    };
    const kv = makeKV(data);
    const [first, same] = await Promise.all([getCanonicalStopSequences(kv), getCanonicalStopSequences(kv)]);
    expect(same).toBe(first);
    expect(first.get('r1')).toHaveLength(2);
    data['tripStops:rapid-bus-kl'] = { t1: [entry('s1', 1)], t2: [entry('s1', 1), entry('s2', 2), entry('s3', 3)] };
    invalidateStaticData(kv);
    const refreshed = await getCanonicalStopSequences(kv);
    expect(refreshed).not.toBe(first);
    expect(refreshed.get('r1')).toHaveLength(3);
  });

  it('keeps available agencies when the optional agency fails', async () => {
    const kv = makeKV({ 'stops:rapid-bus-kl': [stop('Available')] });
    vi.mocked(kv.get).mockImplementation(async (key: string) => {
      if (key === 'stops:selangor-mobility') throw new Error('Unavailable');
      return key === 'stops:rapid-bus-kl' ? [stop('Available')] : null;
    });
    expect((await getAllStops(kv)).map(s => s.name)).toEqual(['Available']);
  });
});


it('retries canonical transformation after a failure without retaining a rejected promise', async () => {
  const kv = makeKV({ 'trips:rapid-bus-kl': [trip('t1')], 'tripStops:rapid-bus-kl': { t1: [entry('s1', 1)] } });
  vi.spyOn(sampling, 'canonicalStopSequencesByRoute').mockImplementationOnce(() => { throw new Error('Temporary transformation failure'); });
  await expect(getCanonicalStopSequences(kv)).rejects.toThrow('Temporary transformation failure');
  expect((await getCanonicalStopSequences(kv)).get('r1')).toHaveLength(1);
});
