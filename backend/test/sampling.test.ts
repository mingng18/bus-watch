import { describe, it, expect, vi } from 'vitest';
import { sampleBusPositions, aggregateTravelTimes, cleanupOldPositions, aggregateSamples, TravelTimeSample, detectStopPassages, PositionSample } from '../src/sampling';
import { Env, VehiclePosition, PrasaranaBus, TripStopEntry } from '../src/types';

describe('sampling logic', () => {
  describe('detectStopPassages', () => {
    it('returns empty when there are no samples or less than 2 stops', () => {
      const samples: PositionSample[] = [];
      const stops: TripStopEntry[] = [
        { stopId: 'S1', stopName: 'Stop 1', lat: 3.14, lon: 101.68, arrivalTime: '', departureTime: '', sequence: 1 }
      ];
      expect(detectStopPassages(samples, stops, 'R1')).toEqual([]);
    });

    it('returns a travel time sample for consecutive stop passages', () => {
      // Points roughly 2km apart
      const stops: TripStopEntry[] = [
        { stopId: 'S1', stopName: 'S1', lat: 3.14, lon: 101.68, arrivalTime: '', departureTime: '', sequence: 1 },
        { stopId: 'S2', stopName: 'S2', lat: 3.15, lon: 101.69, arrivalTime: '', departureTime: '', sequence: 2 }
      ];
      const samples: PositionSample[] = [
        { bus_no: 'B1', route: 'R1', lat: 3.140001, lon: 101.680001, timestamp: 1700000000 },
        { bus_no: 'B1', route: 'R1', lat: 3.150001, lon: 101.690001, timestamp: 1700000300 }, // 300 seconds later
      ];

      const result = detectStopPassages(samples, stops, 'R1');
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        route: 'R1',
        from_stop_id: 'S1',
        to_stop_id: 'S2',
        seconds: 300,
      });
    });

    it('defensively sorts out-of-order samples', () => {
      const stops: TripStopEntry[] = [
        { stopId: 'S1', stopName: 'S1', lat: 3.14, lon: 101.68, arrivalTime: '', departureTime: '', sequence: 1 },
        { stopId: 'S2', stopName: 'S2', lat: 3.15, lon: 101.69, arrivalTime: '', departureTime: '', sequence: 2 }
      ];
      const samples: PositionSample[] = [
        { bus_no: 'B1', route: 'R1', lat: 3.15, lon: 101.69, timestamp: 1700000300 },
        { bus_no: 'B1', route: 'R1', lat: 3.14, lon: 101.68, timestamp: 1700000000 },
      ];

      const result = detectStopPassages(samples, stops, 'R1');
      expect(result).toHaveLength(1);
      expect(result[0].seconds).toBe(300);
    });

    it('ignores samples outside the passage radius', () => {
      const stops: TripStopEntry[] = [
        { stopId: 'S1', stopName: 'S1', lat: 3.14, lon: 101.68, arrivalTime: '', departureTime: '', sequence: 1 },
        { stopId: 'S2', stopName: 'S2', lat: 3.15, lon: 101.69, arrivalTime: '', departureTime: '', sequence: 2 }
      ];
      const samples: PositionSample[] = [
        { bus_no: 'B1', route: 'R1', lat: 3.14, lon: 101.68, timestamp: 1700000000 },
        // Way off target
        { bus_no: 'B1', route: 'R1', lat: 3.20, lon: 101.75, timestamp: 1700000100 },
        { bus_no: 'B1', route: 'R1', lat: 3.15, lon: 101.69, timestamp: 1700000300 },
      ];

      const result = detectStopPassages(samples, stops, 'R1');
      expect(result).toHaveLength(1);
      expect(result[0].seconds).toBe(300);
    });

    it('does not emit travel time if inter-stop time exceeds max (30 min)', () => {
      const stops: TripStopEntry[] = [
        { stopId: 'S1', stopName: 'S1', lat: 3.14, lon: 101.68, arrivalTime: '', departureTime: '', sequence: 1 },
        { stopId: 'S2', stopName: 'S2', lat: 3.15, lon: 101.69, arrivalTime: '', departureTime: '', sequence: 2 },
        { stopId: 'S3', stopName: 'S3', lat: 3.16, lon: 101.70, arrivalTime: '', departureTime: '', sequence: 3 },
      ];
      const samples: PositionSample[] = [
        { bus_no: 'B1', route: 'R1', lat: 3.14, lon: 101.68, timestamp: 1700000000 },
        // Gap > 30 mins
        { bus_no: 'B1', route: 'R1', lat: 3.15, lon: 101.69, timestamp: 1700002000 },
        // Valid gap
        { bus_no: 'B1', route: 'R1', lat: 3.16, lon: 101.70, timestamp: 1700002300 },
      ];

      const result = detectStopPassages(samples, stops, 'R1');
      // First gap is 2000s (>1800s), should be dropped.
      // Second gap is 300s, should be valid.
      expect(result).toHaveLength(1);
      expect(result[0].from_stop_id).toBe('S2');
      expect(result[0].to_stop_id).toBe('S3');
      expect(result[0].seconds).toBe(300);
    });

    it('enforces in-order passage and stops processing if a stop is skipped', () => {
      const stops: TripStopEntry[] = [
        { stopId: 'S1', stopName: 'S1', lat: 3.14, lon: 101.68, arrivalTime: '', departureTime: '', sequence: 1 },
        { stopId: 'S2', stopName: 'S2', lat: 3.15, lon: 101.69, arrivalTime: '', departureTime: '', sequence: 2 },
        { stopId: 'S3', stopName: 'S3', lat: 3.16, lon: 101.70, arrivalTime: '', departureTime: '', sequence: 3 },
      ];

      // Bus hits S1, skips S2 completely, hits S3
      const samples: PositionSample[] = [
        { bus_no: 'B1', route: 'R1', lat: 3.14, lon: 101.68, timestamp: 1700000000 }, // hits S1
        { bus_no: 'B1', route: 'R1', lat: 3.16, lon: 101.70, timestamp: 1700000300 }, // hits S3 (but target is S2)
      ];

      const result = detectStopPassages(samples, stops, 'R1');
      // Because it enforces in-order, S3 passage shouldn't be recorded as it's looking for S2.
      expect(result).toHaveLength(0);
    });

    it('does not emit travel time if inter-stop time is 0', () => {
      const stops: TripStopEntry[] = [
        { stopId: 'S1', stopName: 'S1', lat: 3.14, lon: 101.68, arrivalTime: '', departureTime: '', sequence: 1 },
        { stopId: 'S2', stopName: 'S2', lat: 3.15, lon: 101.69, arrivalTime: '', departureTime: '', sequence: 2 },
        { stopId: 'S3', stopName: 'S3', lat: 3.16, lon: 101.70, arrivalTime: '', departureTime: '', sequence: 3 },
      ];
      // Bus hits S1 and S2 at the exact same timestamp (e.g. data glitch)
      const samples: PositionSample[] = [
        { bus_no: 'B1', route: 'R1', lat: 3.14, lon: 101.68, timestamp: 1700000000 },
        { bus_no: 'B1', route: 'R1', lat: 3.15, lon: 101.69, timestamp: 1700000000 },
        { bus_no: 'B1', route: 'R1', lat: 3.16, lon: 101.70, timestamp: 1700000300 },
      ];

      const result = detectStopPassages(samples, stops, 'R1');
      // Gap between S1 and S2 is 0 seconds, should not emit.
      // Gap between S2 and S3 is 300 seconds, should emit.
      expect(result).toHaveLength(1);
      expect(result[0].from_stop_id).toBe('S2');
      expect(result[0].to_stop_id).toBe('S3');
    });
  });

  describe('aggregateSamples', () => {
    it('aggregates a single sample correctly', () => {
      const samples: TravelTimeSample[] = [{
        route: 'R1',
        from_stop_id: 'S1',
        to_stop_id: 'S2',
        from_lat: 1,
        from_lon: 2,
        to_lat: 3,
        to_lon: 4,
        seconds: 120,
        day_of_week: 1,
        time_bucket: 8,
      }];
      const result = aggregateSamples(samples);
      expect(result).toHaveLength(1);
      expect(result[0].avg_seconds).toBe(120);
      expect(result[0].spread_seconds).toBe(0);
      expect(result[0].sample_count).toBe(1);
    });

    it('aggregates multiple samples and computes MAD', () => {
      const samples: TravelTimeSample[] = [
        { route: 'R1', from_stop_id: 'S1', to_stop_id: 'S2', from_lat: 1, from_lon: 2, to_lat: 3, to_lon: 4, seconds: 100, day_of_week: 1, time_bucket: 8 },
        { route: 'R1', from_stop_id: 'S1', to_stop_id: 'S2', from_lat: 1, from_lon: 2, to_lat: 3, to_lon: 4, seconds: 120, day_of_week: 1, time_bucket: 8 },
        { route: 'R1', from_stop_id: 'S1', to_stop_id: 'S2', from_lat: 1, from_lon: 2, to_lat: 3, to_lon: 4, seconds: 140, day_of_week: 1, time_bucket: 8 },
      ];
      const result = aggregateSamples(samples);
      expect(result).toHaveLength(1);
      expect(result[0].avg_seconds).toBe(120);
      expect(result[0].spread_seconds).toBe(13);
      expect(result[0].sample_count).toBe(3);
    });

    it('groups by route, stops, day, and time bucket', () => {
      const base = { from_lat: 1, from_lon: 2, to_lat: 3, to_lon: 4, seconds: 100 };
      const samples: TravelTimeSample[] = [
        { ...base, route: 'R1', from_stop_id: 'S1', to_stop_id: 'S2', day_of_week: 1, time_bucket: 8 },
        { ...base, route: 'R1', from_stop_id: 'S1', to_stop_id: 'S2', day_of_week: 1, time_bucket: 9 },
        { ...base, route: 'R2', from_stop_id: 'S1', to_stop_id: 'S2', day_of_week: 1, time_bucket: 8 },
      ];
      const result = aggregateSamples(samples);
      expect(result).toHaveLength(3);
    });

    it('rejects outliers for n > 3', () => {
      const base = { route: 'R1', from_stop_id: 'S1', to_stop_id: 'S2', from_lat: 1, from_lon: 2, to_lat: 3, to_lon: 4, day_of_week: 1, time_bucket: 8 };
      const samples: TravelTimeSample[] = [
        { ...base, seconds: 100 },
        { ...base, seconds: 110 },
        { ...base, seconds: 105 },
        { ...base, seconds: 1000 },
      ];
      const result = aggregateSamples(samples);
      expect(result).toHaveLength(1);
      expect(result[0].sample_count).toBe(3);
    });

    it('does not reject outliers for n <= 3', () => {
      const base = { route: 'R1', from_stop_id: 'S1', to_stop_id: 'S2', from_lat: 1, from_lon: 2, to_lat: 3, to_lon: 4, day_of_week: 1, time_bucket: 8 };
      const samples: TravelTimeSample[] = [
        { ...base, seconds: 100 },
        { ...base, seconds: 110 },
        { ...base, seconds: 1000 },
      ];
      const result = aggregateSamples(samples);
      expect(result).toHaveLength(1);
      expect(result[0].sample_count).toBe(3);
    });
  });

  const mockEnv: Env = {
    KV: {} as any,
    DB: {
      prepare: vi.fn().mockReturnValue({
        bind: vi.fn().mockReturnThis(),
        all: vi.fn().mockResolvedValue({ results: [] }),
        run: vi.fn().mockResolvedValue({ success: true })
      })
    } as any
  };

  it('sampleBusPositions should execute without error', async () => {
    const vehicles: VehiclePosition[] = [];
    const prasaranaBuses: PrasaranaBus[] = [];
    await expect(sampleBusPositions(mockEnv, vehicles, prasaranaBuses)).resolves.not.toThrow();
  });

  it('aggregateTravelTimes should execute without error', async () => {
    await expect(aggregateTravelTimes(mockEnv, new Map())).resolves.not.toThrow();
  });

  it('cleanupOldPositions should call DB prepare', async () => {
    await cleanupOldPositions(mockEnv);
    expect(mockEnv.DB.prepare).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM bus_positions'));
  });

  it('uses a deterministic ROW_NUMBER() window query (issue #132)', async () => {
    // The old `GROUP BY bus_no HAVING timestamp = MAX(timestamp)` was
    // non-standard and selected an indeterminate row. The new query must use
    // ROW_NUMBER() OVER (PARTITION BY bus_no ORDER BY ...) to deterministically
    // pick the latest row per bus_no.
    const prepareSpy = vi.fn().mockReturnValue({
      bind: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue({ results: [] }),
      run: vi.fn().mockResolvedValue({ success: true }),
    });
    const env: Env = { KV: {} as any, DB: { prepare: prepareSpy } as any };

    await sampleBusPositions(env, [], []);

    // The first prepare call is the last-position query.
    const lastPositionSql = prepareSpy.mock.calls[0][0] as string;
    expect(lastPositionSql).toContain('ROW_NUMBER()');
    expect(lastPositionSql).toContain('PARTITION BY bus_no');
    expect(lastPositionSql).toContain('ORDER BY timestamp DESC');
    expect(lastPositionSql).toContain('rn = 1');
    // Must NOT use the old non-standard HAVING form.
    expect(lastPositionSql).not.toMatch(/HAVING timestamp\s*=\s*MAX/);
  });

  it('skips inserting when the last position per bus_no has not moved (determinism flows through)', async () => {
    // Mock the last-position query to return one deterministic row per bus_no,
    // then feed a vehicle at the same coordinates. Because the bus "hasn't
    // moved" (>100m) and hasn't timed out, sampleBusPositions must NOT issue
    // an INSERT for it. This proves the query result (one deterministic row
    // per bus_no) is what drives the skip — not an indeterminate row.
    const now = Math.floor(Date.now() / 1000);
    const allMock = vi.fn().mockResolvedValue({
      results: [{ bus_no: 't1', lat: 3.13, lon: 101.68, ts: now }],
    });
    const bindMock = vi.fn().mockReturnThis();
    const prepareMock = vi.fn().mockImplementation((sql: string) => {
      // The last-position query uses .all(); the INSERT uses .bind(...).batch.
      return { all: allMock, bind: bindMock, run: vi.fn().mockResolvedValue({ success: true }) };
    });
    const env: Env = { KV: {} as any, DB: { prepare: prepareMock, batch: vi.fn().mockResolvedValue({ results: [] }) } as any };

    const vehicles: VehiclePosition[] = [{
      tripId: 't1',
      routeId: 'r1',
      lat: 3.13,
      lon: 101.68, // same as last position → distance 0 → not moved
      currentStopSequence: 1,
      timestamp: now,
      stopId: 's1',
    }];

    await sampleBusPositions(env, vehicles, []);

    // The INSERTs are now prepared unconditionally at the start of their loops,
    // but because the bus hasn't moved, .bind() should not be called for the INSERT.
    expect(bindMock).not.toHaveBeenCalled();
  });

  it('aggregateTravelTimes returns early and logs error if DB fetch fails', async () => {
    const errorMsg = 'DB fetch error';
    const mockDbEnv: Env = {
      KV: {} as any,
      DB: {
        prepare: vi.fn().mockReturnValue({
          bind: vi.fn().mockReturnThis(),
          all: vi.fn().mockRejectedValue(new Error(errorMsg))
        })
      } as any
    };

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(aggregateTravelTimes(mockDbEnv, new Map())).resolves.toBeUndefined();

    expect(consoleSpy).toHaveBeenCalledWith(
      'aggregateTravelTimes: failed to read bus_positions:',
      expect.any(Error)
    );
    expect(consoleSpy.mock.calls[0][1].message).toBe(errorMsg);

    consoleSpy.mockRestore();
  });





  it('aggregateTravelTimes continues if DB.batch throws', async () => {
    const errorMsg = 'DB batch error';
    const mockDbEnv: Env = {
      KV: {} as any,
      DB: {
        prepare: vi.fn().mockImplementation((sql: string) => {
          if (sql.includes('SELECT bus_no, route')) {
            return {
              bind: vi.fn().mockReturnValue({
                all: vi.fn().mockResolvedValue({
                  results: [
                    { bus_no: 'B1', route: 'R1', lat: 3.14, lon: 101.68, timestamp: 1000 },
                    { bus_no: 'B1', route: 'R1', lat: 3.15, lon: 101.69, timestamp: 1100 }
                  ]
                })
              })
            };
          }
          return {
            bind: vi.fn().mockReturnThis(),
            all: vi.fn().mockResolvedValue({ results: [] }),
            run: vi.fn().mockResolvedValue({ success: true })
          };
        }),
        batch: vi.fn().mockRejectedValue(new Error(errorMsg))
      } as any
    };

    const stopSequencesByRoute = new Map<string, any[]>([
      ['R1', [
        { stopId: 'S1', lat: 3.14, lon: 101.68, stopSequence: 1 },
        { stopId: 'S2', lat: 3.15, lon: 101.69, stopSequence: 2 },
      ]]
    ]);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.spyOn(Date, 'now').mockImplementation(() => 1200 * 1000);


    stopSequencesByRoute.set('R1', [
      { stopId: 'S1', lat: 3.14, lon: 101.68, stopSequence: 1 },
      { stopId: 'S2', lat: 3.15, lon: 101.69, stopSequence: 2 },
    ]);

    await expect(aggregateTravelTimes(mockDbEnv, stopSequencesByRoute)).rejects.toThrow('DB batch error');

    expect(mockDbEnv.DB.batch).toHaveBeenCalled();

    expect(consoleSpy).toHaveBeenCalledWith(
      'aggregateTravelTimes: upsert batch failed:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
    vi.restoreAllMocks();
  });
});
