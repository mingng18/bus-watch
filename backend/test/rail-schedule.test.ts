import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getRailSchedule, searchRailStops } from '../src/rail-schedule';
import { Env } from '../src/types';

describe('getRailSchedule', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('handles overnight wrap-around window correctly', async () => {
    // 23:30 KL time (UTC+8) -> 15:30 UTC
    const date = new Date('2023-10-10T15:30:00Z');
    vi.setSystemTime(date);

    let stopTimesArgs: any[] = [];

    const mockEnv = {
      DB: {
        prepare: vi.fn().mockImplementation((query) => {
          const firstFn = vi.fn().mockImplementation(async () => {
            if (query.includes('FROM rail_stops')) {
              return { stop_id: 's1', stop_name: 'Station 1' };
            }
            if (query.includes('rail_ingest_meta')) {
              return { value: date.toISOString() };
            }
            return null;
          });

          const allFn = vi.fn().mockImplementation(async () => {
            if (query.includes('FROM rail_stop_times')) {
              return {
                results: [
                  {
                    departure_time: '24:30:00',
                    trip_id: 't1',
                    headsign: 'Terminal',
                    route_short_name: 'R1',
                    route_long_name: 'Route 1',
                    departure_minutes: 1470 // 24:30 in minutes
                  }
                ]
              };
            }
            return { results: [] };
          });

          return {
            bind: (...args: any[]) => {
              if (query.includes('FROM rail_stop_times')) {
                stopTimesArgs = args;
              }
              return { first: firstFn, all: allFn };
            },
            first: firstFn,
            all: allFn
          };
        })
      }
    } as unknown as Env;

    const result = await getRailSchedule(mockEnv, 's1', 120);

    // Verify SQL bound parameters for wrap around logic
    // currentMinutes should be 23 * 60 + 30 = 1410
    // upperMinutes should be 1410 + 120 = 1530
    expect(stopTimesArgs[1]).toBe(1410);
    expect(stopTimesArgs[2]).toBe(1530);

    expect(result).not.toBeNull();
    expect(result?.arrivals.length).toBe(1);

    // Should correctly wrap 24:30 to 00:30
    expect(result?.arrivals[0].scheduled_time).toBe('00:30');

    // Minutes until should be 60 (1470 - 1410)
    expect(result?.arrivals[0].minutes_until).toBe(60);
  });

  it('handles standard window correctly', async () => {
    // 12:00 KL time (UTC+8) -> 04:00 UTC
    const date = new Date('2023-10-10T04:00:00Z');
    vi.setSystemTime(date);

    let stopTimesArgs: any[] = [];

    const mockEnv = {
      DB: {
        prepare: vi.fn().mockImplementation((query) => {
          const firstFn = vi.fn().mockImplementation(async () => {
            if (query.includes('FROM rail_stops')) {
              return { stop_id: 's1', stop_name: 'Station 1' };
            }
            if (query.includes('rail_ingest_meta')) {
              return { value: date.toISOString() };
            }
            return null;
          });

          const allFn = vi.fn().mockImplementation(async () => {
            if (query.includes('FROM rail_stop_times')) {
              return {
                results: [
                  {
                    departure_time: '12:30:00',
                    trip_id: 't2',
                    headsign: 'Terminal',
                    route_short_name: 'R1',
                    route_long_name: 'Route 1',
                    departure_minutes: 750 // 12:30 in minutes
                  }
                ]
              };
            }
            return { results: [] };
          });

          return {
            bind: (...args: any[]) => {
              if (query.includes('FROM rail_stop_times')) {
                stopTimesArgs = args;
              }
              return { first: firstFn, all: allFn };
            },
            first: firstFn,
            all: allFn
          };
        })
      }
    } as unknown as Env;

    const result = await getRailSchedule(mockEnv, 's1', 120);

    // Verify SQL bound parameters
    // currentMinutes should be 12 * 60 = 720
    // upperMinutes should be 720 + 120 = 840
    expect(stopTimesArgs[1]).toBe(720);
    expect(stopTimesArgs[2]).toBe(840);

    expect(result).not.toBeNull();
    expect(result?.arrivals.length).toBe(1);

    expect(result?.arrivals[0].scheduled_time).toBe('12:30');
    expect(result?.arrivals[0].minutes_until).toBe(30);
  });

  it('returns null for unknown stop', async () => {
    const mockEnv = {
      DB: {
        prepare: vi.fn().mockImplementation(() => {
          const firstFn = vi.fn().mockImplementation(async () => {
             return null; // Stop not found
          });

          return {
            bind: () => ({ first: firstFn, all: vi.fn() }),
            first: firstFn,
            all: vi.fn()
          };
        })
      }
    } as unknown as Env;

    const result = await getRailSchedule(mockEnv, 'unknown', 120);
    expect(result).toBeNull();
  });
});



describe('searchRailStops', () => {
  it('returns matching stops for a query', async () => {
    let boundArgs: any[] = [];
    const mockEnv = {
      DB: {
        prepare: vi.fn().mockImplementation((query) => {
          return {
            bind: (...args: any[]) => {
              boundArgs = args;
              return {
                all: vi.fn().mockResolvedValue({
                  results: [
                    { stop_id: 's1', stop_name: 'KL Sentral', lat: 3.134, lon: 101.686 },
                    { stop_id: 's2', stop_name: 'Sentral Market', lat: 3.145, lon: 101.695 }
                  ]
                })
              };
            }
          };
        })
      }
    } as unknown as Env;

    const results = await searchRailStops(mockEnv, 'sentral');

    expect(boundArgs[0]).toBe('%sentral%');
    expect(results).toHaveLength(2);
    expect(results[0].stop_name).toBe('KL Sentral');
    expect(results[1].stop_id).toBe('s2');
  });

  it('handles empty results', async () => {
    const mockEnv = {
      DB: {
        prepare: vi.fn().mockImplementation(() => {
          return {
            bind: () => ({
              all: vi.fn().mockResolvedValue({ results: [] })
            })
          };
        })
      }
    } as unknown as Env;

    const results = await searchRailStops(mockEnv, 'unknown');
    expect(results).toHaveLength(0);
    expect(results).toEqual([]);
  });

  it('escapes special characters in stop search query', async () => {
    let boundValue = '';
    const mockEnv = {
      DB: {
        prepare: vi.fn().mockImplementation((query) => {
          return {
            bind: (...args: any[]) => {
              boundValue = args[0];
              return { all: vi.fn().mockResolvedValue({ results: [] }) };
            }
          };
        })
      }
    } as unknown as Env;

    const { searchRailStops } = await import('../src/rail-schedule');
    await searchRailStops(mockEnv, '100% _real_ \\ test');
    expect(boundValue).toBe('%100\\% \\_real\\_ \\\\ test%');
  });
});
