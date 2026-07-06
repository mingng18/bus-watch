import { describe, it, expect, vi } from 'vitest';
import { sampleBusPositions, aggregateTravelTimes, cleanupOldPositions } from '../src/sampling';
import { Env, VehiclePosition, PrasaranaBus } from '../src/types';

describe('sampling logic', () => {
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
    const env: Env = { KV: {} as any, DB: { prepare: prepareMock, batch: vi.fn().mockResolvedValue([]) } as any };

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

    // The INSERT queries are prepared unconditionally now for performance,
    // but they shouldn't be executed (bind not called on them, or batch not called).
    // The only batch call would be if stmts had items.
    expect((env.DB.batch as any).mock.calls.length).toBe(0);
    // Alternatively, ensure `bindMock` was not called (or rather, we know it's skipped).
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
});
