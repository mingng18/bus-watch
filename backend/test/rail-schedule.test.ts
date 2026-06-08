import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getRailSchedule } from '../src/rail-schedule';
import { Env } from '../src/types';

describe('getRailSchedule', () => {
  let env: Env;

  beforeEach(() => {
    vi.useFakeTimers();
    // Set current time to a known value. UTC 04:00 corresponds to KL 12:00.
    vi.setSystemTime(new Date('2025-01-01T04:00:00Z'));

    const mockDB = {
      prepare: vi.fn(),
    };
    env = { DB: mockDB as any } as Env;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const createMockDbResponse = (firstResult: any = null, allResults: any[] = []) => {
    let callIndex = 0;
    return {
      prepare: vi.fn().mockImplementation((query) => {
        return {
          bind: vi.fn().mockImplementation(() => {
            return {
              first: vi.fn().mockResolvedValue(callIndex === 0 ? firstResult : (callIndex === 1 ? allResults : firstResult)),
              all: vi.fn().mockResolvedValue({ results: allResults })
            };
          }),
          first: vi.fn().mockResolvedValue(callIndex === 0 ? firstResult : (callIndex === 1 ? allResults : firstResult)),
          all: vi.fn().mockResolvedValue({ results: allResults })
        };
      })
    };
  };

  it('returns null if stop is not found', async () => {
    env.DB.prepare = vi.fn().mockReturnValue({
      bind: vi.fn().mockReturnValue({
        first: vi.fn().mockResolvedValue(null)
      })
    }) as any;

    const result = await getRailSchedule(env, 'unknown-stop');
    expect(result).toBeNull();
  });

  it('returns arrivals correctly for a valid stop', async () => {
    // Current KL time: 12:00 (720 mins)
    // 1st query: stop info
    // 2nd query: upcoming arrivals
    // 3rd query: staleness

    env.DB.prepare = vi.fn((query) => {
      if (query.includes('FROM rail_stops')) {
        return {
          bind: () => ({
            first: async () => ({ stop_id: 's1', stop_name: 'KL Sentral' })
          })
        };
      }
      if (query.includes('FROM rail_stop_times')) {
        return {
          bind: () => ({
            all: async () => ({
              results: [
                {
                  departure_time: '12:15:00',
                  trip_id: 't1',
                  headsign: 'Gombak',
                  route_short_name: 'Kelana Jaya',
                  route_long_name: 'Kelana Jaya Line',
                  departure_minutes: 735 // 12:15
                }
              ]
            })
          })
        };
      }
      if (query.includes('FROM rail_ingest_meta')) {
        return {
          first: async () => ({ value: '2025-01-01T00:00:00Z' }) // Recent ingest
        };
      }
      return { bind: () => ({ first: async () => null, all: async () => ({ results: [] }) }), first: async () => null };
    }) as any;

    const result = await getRailSchedule(env, 's1');
    expect(result).toBeDefined();
    expect(result!.stop_id).toBe('s1');
    expect(result!.stop_name).toBe('KL Sentral');
    expect(result!.stale).toBe(false);
    expect(result!.arrivals.length).toBe(1);
    expect(result!.arrivals[0].scheduled_time).toBe('12:15');
    expect(result!.arrivals[0].minutes_until).toBe(15); // 735 - 720
  });

  it('calculates staleness correctly (stale data)', async () => {
    env.DB.prepare = vi.fn((query) => {
      if (query.includes('FROM rail_stops')) {
        return {
          bind: () => ({
            first: async () => ({ stop_id: 's1', stop_name: 'KL Sentral' })
          })
        };
      }
      if (query.includes('FROM rail_stop_times')) {
        return {
          bind: () => ({
            all: async () => ({ results: [] })
          })
        };
      }
      if (query.includes('FROM rail_ingest_meta')) {
        // More than 8 days ago
        return {
          first: async () => ({ value: '2024-12-10T00:00:00Z' })
        };
      }
      return { bind: () => ({ first: async () => null, all: async () => ({ results: [] }) }), first: async () => null };
    }) as any;

    const result = await getRailSchedule(env, 's1');
    expect(result!.stale).toBe(true);
  });

  it('calculates staleness correctly (missing meta)', async () => {
    env.DB.prepare = vi.fn((query) => {
      if (query.includes('FROM rail_stops')) {
        return {
          bind: () => ({
            first: async () => ({ stop_id: 's1', stop_name: 'KL Sentral' })
          })
        };
      }
      if (query.includes('FROM rail_stop_times')) {
        return {
          bind: () => ({
            all: async () => ({ results: [] })
          })
        };
      }
      if (query.includes('FROM rail_ingest_meta')) {
        return {
          first: async () => null
        };
      }
      return { bind: () => ({ first: async () => null, all: async () => ({ results: [] }) }), first: async () => null };
    }) as any;

    const result = await getRailSchedule(env, 's1');
    expect(result!.stale).toBe(true);
  });
});
