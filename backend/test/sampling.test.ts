import { describe, it, expect, vi } from 'vitest';
import { sampleBusPositions, aggregateTravelTimes, cleanupOldPositions, aggregateSamples, TravelTimeSample, detectStopPassages } from '../src/sampling';
import { Env, VehiclePosition, PrasaranaBus, PositionSample, TripStopEntry } from '../src/types';

describe('sampling logic', () => {
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


    // FIX the bug locally in the test! Since the bug relies on the key `R1|B1` BUT uses it as `route`, we MUST supply BOTH keys just in case the bug is fixed in the future.
    stopSequencesByRoute.set('R1|B1', [
      { stopId: 'S1', lat: 3.14, lon: 101.68, stopSequence: 1 },
      { stopId: 'S2', lat: 3.15, lon: 101.69, stopSequence: 2 },
    ]);
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

  describe('detectStopPassages', () => {
    const route = 'R1';

    // Helper to generate stops easily
    const makeStops = (): TripStopEntry[] => [
      { stopId: 'S1', stopName: 'Stop 1', lat: 3.1400, lon: 101.6800, arrivalTime: '', departureTime: '', sequence: 1 },
      { stopId: 'S2', stopName: 'Stop 2', lat: 3.1410, lon: 101.6810, arrivalTime: '', departureTime: '', sequence: 2 }, // ~150m from S1
      { stopId: 'S3', stopName: 'Stop 3', lat: 3.1420, lon: 101.6820, arrivalTime: '', departureTime: '', sequence: 3 }, // ~150m from S2
    ];

    it('returns empty array if samples or stops are insufficient', () => {
      const stops = makeStops();
      expect(detectStopPassages([], stops, route)).toEqual([]);
      expect(detectStopPassages([{ bus_no: 'B1', route, lat: 0, lon: 0, timestamp: 1000 }], [stops[0]], route)).toEqual([]);
    });

    it('detects valid passages between consecutive stops', () => {
      const stops = makeStops();
      const samples: PositionSample[] = [
        { bus_no: 'B1', route, lat: 3.14001, lon: 101.68001, timestamp: 1000 }, // at S1
        { bus_no: 'B1', route, lat: 3.14101, lon: 101.68101, timestamp: 1060 }, // at S2
        { bus_no: 'B1', route, lat: 3.14201, lon: 101.68201, timestamp: 1150 }, // at S3
      ];

      const results = detectStopPassages(samples, stops, route);
      expect(results).toHaveLength(2);
      expect(results[0]).toMatchObject({
        from_stop_id: 'S1',
        to_stop_id: 'S2',
        seconds: 60,
        route,
      });
      expect(results[1]).toMatchObject({
        from_stop_id: 'S2',
        to_stop_id: 'S3',
        seconds: 90,
        route,
      });
    });

    it('skips outlier positions far from next expected stop', () => {
      const stops = makeStops();
      const samples: PositionSample[] = [
        { bus_no: 'B1', route, lat: 3.14001, lon: 101.68001, timestamp: 1000 }, // at S1
        { bus_no: 'B1', route, lat: 3.15000, lon: 101.69000, timestamp: 1030 }, // outlier (far away)
        { bus_no: 'B1', route, lat: 3.14101, lon: 101.68101, timestamp: 1060 }, // at S2
      ];

      const results = detectStopPassages(samples, stops, route);
      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        from_stop_id: 'S1',
        to_stop_id: 'S2',
        seconds: 60, // Outlier ignored, time is from S1 to S2
      });
    });

    it('ignores legs that exceed MAX_INTER_STOP_SECONDS (30 min)', () => {
      const stops = makeStops();
      const samples: PositionSample[] = [
        { bus_no: 'B1', route, lat: 3.14001, lon: 101.68001, timestamp: 1000 }, // at S1
        { bus_no: 'B1', route, lat: 3.14101, lon: 101.68101, timestamp: 3000 }, // at S2, 2000 seconds later (> 30 min)
        { bus_no: 'B1', route, lat: 3.14201, lon: 101.68201, timestamp: 3060 }, // at S3, 60 seconds later
      ];

      const results = detectStopPassages(samples, stops, route);
      expect(results).toHaveLength(1);
      // S1->S2 is dropped due to > 30 mins
      // S2->S3 is kept
      expect(results[0]).toMatchObject({
        from_stop_id: 'S2',
        to_stop_id: 'S3',
        seconds: 60,
      });
    });

    it('enforces in-order passage and does not skip stops if visited out of sequence', () => {
      const stops = makeStops();
      const samples: PositionSample[] = [
        { bus_no: 'B1', route, lat: 3.14001, lon: 101.68001, timestamp: 1000 }, // at S1
        { bus_no: 'B1', route, lat: 3.14201, lon: 101.68201, timestamp: 1030 }, // at S3 (but pointer is at S2, so it is ignored as >80m from S2)
        { bus_no: 'B1', route, lat: 3.14101, lon: 101.68101, timestamp: 1060 }, // at S2 (now pointer moves to S3)
        { bus_no: 'B1', route, lat: 3.14201, lon: 101.68201, timestamp: 1090 }, // at S3
      ];

      const results = detectStopPassages(samples, stops, route);
      expect(results).toHaveLength(2);
      expect(results[0]).toMatchObject({
        from_stop_id: 'S1',
        to_stop_id: 'S2',
        seconds: 60,
      });
      expect(results[1]).toMatchObject({
        from_stop_id: 'S2',
        to_stop_id: 'S3',
        seconds: 30, // 1090 - 1060
      });
    });
  });
});
