import { describe, it, expect, vi } from 'vitest';
import worker from '../src/index';
import * as nearby from '../src/nearby';
import * as alerts from '../src/alerts';

vi.mock('../src/nearby', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/nearby')>();
  return {
    ...actual,
    getHistoricalETA: vi.fn(),
  };
});

// Mock realtime vehicles properly to bypass its logic, and reach the DB call.
// Include a position so /bus/eta can resolve a from-stop before the historical
// lookup (issue #133: the handler now keys the ETA off the bus's nearest stop).
vi.mock('../src/gtfs-realtime', () => ({
  fetchVehiclePositions: vi.fn().mockResolvedValue([{ tripId: 't1', routeId: 'r1', lat: 3.13, lon: 101.68, currentStopSequence: 1, timestamp: 0, stopId: 's1' }])
}));

// Avoid real network calls to the MyRapid sitemap from getCachedAlerts. The
// alert-validation tests below only care about limit clamping, not the fetch
// path, so a deterministic stub keeps them fast and offline-safe. Tests can
// override getCachedAlerts's return value per-case.
vi.mock('../src/alerts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/alerts')>();
  return {
    ...actual,
    getCachedAlerts: vi.fn().mockResolvedValue([]),
    fetchAlerts: vi.fn().mockResolvedValue([]),
  };
});

describe('GET /bus/eta', () => {
  it('returns 500 on internal server error when getHistoricalETA throws', async () => {
    // We mock the getHistoricalETA function to throw an error, which
    // simulates a database failure or other unexpected error during ETA calculation
    vi.mocked(nearby.getHistoricalETA).mockRejectedValue(new Error('DB Error'));

    // /bus/eta (issue #133) resolves a from-stop from the bus's current
    // position + the route's stop sequence, so KV must return minimal
    // trips/tripStops/routes for that lookup to reach getHistoricalETA.
    // Note: the mock returns already-parsed values (the real KV `get(k,'json')`
    // parses; this mock bypasses that, so hand back objects, not strings).
    const kv = {
      get: vi.fn((key: string) => {
        if (key.startsWith('trips:')) {
          return Promise.resolve([{ id: 't1', routeId: 'r1', serviceId: 's', headsign: 'h', directionId: 0, shapeId: '' }]);
        }
        if (key.startsWith('tripStops:')) {
          return Promise.resolve({
            t1: [{ stopId: 's0', stopName: 's0', lat: 3.13, lon: 101.68, arrivalTime: '', departureTime: '', sequence: 1 }],
          });
        }
        if (key.startsWith('routes:')) {
          return Promise.resolve([{ id: 'r1', shortName: 'r1', longName: 'r1', type: 3 }]);
        }
        return Promise.resolve(null);
      }),
      put: vi.fn().mockResolvedValue(undefined),
    } as any;

    const req = new Request('http://localhost/bus/eta?tripId=t1&stopId=s1');
    const res = await worker.fetch(req, { KV: kv, DB: {} } as any, {} as any);

    // Verify that the error is caught and a 500 response is returned
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toEqual({ error: 'Internal server error' });

    // Verify that we reached the catch block specifically by triggering this function
    expect(nearby.getHistoricalETA).toHaveBeenCalled();
  });
});

describe('Not-found routes return clean 404 (issue #128)', () => {
  // Empty KV: every getAll* returns empty arrays/objects, so the underlying
  // functions hit their "not found" throw instead of the happy path.
  const emptyKv = {
    get: vi.fn().mockResolvedValue(null),
    put: vi.fn().mockResolvedValue(undefined),
  } as any;

  it('GET /bus/trip/:tripId/progress → 404 for unknown tripId', async () => {
    const req = new Request('http://localhost/bus/trip/unknown/progress');
    const res = await worker.fetch(req, { KV: emptyKv, DB: {} } as any, {} as any);

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body).toEqual({ error: 'Trip not found' });
    // No stack / internal detail leaked.
    expect(JSON.stringify(body)).not.toMatch(/Trip not found: unknown/);
  });

  it('GET /station/:stopId/schedule → 404 for unknown stopId', async () => {
    const req = new Request('http://localhost/station/unknown/schedule');
    const res = await worker.fetch(req, { KV: emptyKv, DB: {} } as any, {} as any);

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body).toEqual({ error: 'Station not found' });
    expect(JSON.stringify(body)).not.toMatch(/Stop not found: unknown/);
  });

  it('GET /station/:stopId/schedule/toward → 404 for unknown stopId', async () => {
    const req = new Request('http://localhost/station/unknown/schedule/toward?destinationStopId=dest');
    const res = await worker.fetch(req, { KV: emptyKv, DB: {} } as any, {} as any);

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body).toEqual({ error: 'Station not found' });
    expect(JSON.stringify(body)).not.toMatch(/Stop not found: unknown/);
  });

  it('GET /station/:stopId/schedule/toward → 400 when destinationStopId missing (happy path not reached)', async () => {
    // Sanity: the 400 guard runs before the try/catch, so it must still 400.
    const req = new Request('http://localhost/station/unknown/schedule/toward');
    const res = await worker.fetch(req, { KV: emptyKv, DB: {} } as any, {} as any);

    expect(res.status).toBe(400);
  });
});

describe('Input-validation hardening (issue #131)', () => {
  // Empty KV: getAll* return [], so the routes/handlers short-circuit or return
  // trivially after the guard. We only care the guard rejects bad input with 400.
  const emptyKv = {
    get: vi.fn().mockResolvedValue(null),
    put: vi.fn().mockResolvedValue(undefined),
  } as any;

  describe('GET /alerts — limit clamping', () => {
    it('rejects NaN limit (e.g. ?limit=foo) by falling back to DEFAULT, never unbounded', async () => {
      // The handler never returns ALL alerts now; even with NaN it slices by
      // the clamped default. Assert the response is well-formed (an array,
      // not a 500) and that the source list is sliced (not returned whole).
      vi.mocked(alerts.getCachedAlerts).mockResolvedValue(
        Array.from({ length: 250 }, (_, i) => ({ id: `a${i}`, title: `T${i}` })) as any,
      );
      const req = new Request('http://localhost/alerts?limit=foo');
      const res = await worker.fetch(req, { KV: emptyKv, DB: {} } as any, {} as any);
      expect(res.status).toBe(200);
      const body = await res.json() as { alerts: unknown[] };
      // Default limit is 20 (DEFAULT_ALERT_LIMIT), so a NaN falls back to it.
      expect(body.alerts.length).toBe(20);
    });

    it('clamps a huge limit down to at most 100', async () => {
      // Source list of 250; limit=99999 must be clamped to 100.
      vi.mocked(alerts.getCachedAlerts).mockResolvedValue(
        Array.from({ length: 250 }, (_, i) => ({ id: `a${i}`, title: `T${i}` })) as any,
      );
      const req = new Request('http://localhost/alerts?limit=99999');
      const res = await worker.fetch(req, { KV: emptyKv, DB: {} } as any, {} as any);
      expect(res.status).toBe(200);
      const body = await res.json() as { alerts: unknown[] };
      expect(body.alerts.length).toBe(100);
    });

    it('clamps a negative limit up to 1', async () => {
      vi.mocked(alerts.getCachedAlerts).mockResolvedValue(
        Array.from({ length: 250 }, (_, i) => ({ id: `a${i}`, title: `T${i}` })) as any,
      );
      const req = new Request('http://localhost/alerts?limit=-5');
      const res = await worker.fetch(req, { KV: emptyKv, DB: {} } as any, {} as any);
      expect(res.status).toBe(200);
      const body = await res.json() as { alerts: unknown[] };
      expect(body.alerts.length).toBe(1);
    });

    it('respects an explicit small limit within [1, 100]', async () => {
      vi.mocked(alerts.getCachedAlerts).mockResolvedValue(
        Array.from({ length: 250 }, (_, i) => ({ id: `a${i}`, title: `T${i}` })) as any,
      );
      const req = new Request('http://localhost/alerts?limit=5');
      const res = await worker.fetch(req, { KV: emptyKv, DB: {} } as any, {} as any);
      expect(res.status).toBe(200);
      const body = await res.json() as { alerts: unknown[] };
      expect(body.alerts.length).toBe(5);
    });
  });

  describe('GET /nearby — lat/lon validation', () => {
    it('returns 400 for NaN lat', async () => {
      const req = new Request('http://localhost/nearby?lat=foo&lon=101.68');
      const res = await worker.fetch(req, { KV: emptyKv, DB: {} } as any, {} as any);
      expect(res.status).toBe(400);
    });

    it('returns 400 for out-of-range lat (999)', async () => {
      const req = new Request('http://localhost/nearby?lat=999&lon=101.68');
      const res = await worker.fetch(req, { KV: emptyKv, DB: {} } as any, {} as any);
      expect(res.status).toBe(400);
    });

    it('returns 400 for out-of-range lon (-1000)', async () => {
      const req = new Request('http://localhost/nearby?lat=3.13&lon=-1000');
      const res = await worker.fetch(req, { KV: emptyKv, DB: {} } as any, {} as any);
      expect(res.status).toBe(400);
    });

    it('returns 400 for missing lat/lon', async () => {
      const req = new Request('http://localhost/nearby');
      const res = await worker.fetch(req, { KV: emptyKv, DB: {} } as any, {} as any);
      expect(res.status).toBe(400);
    });

    it('accepts lat=0 (equator) — must not be rejected as falsy', async () => {
      // Regression guard: the old `if (!lat)` guard rejected 0. The new
      // Number.isFinite + range check must accept it.
      const req = new Request('http://localhost/nearby?lat=0&lon=0');
      const res = await worker.fetch(req, { KV: emptyKv, DB: {} } as any, {} as any);
      expect(res.status).toBe(200);
    });
  });

  describe('GET /routes — lat/lon validation', () => {
    it('returns 400 for NaN lon', async () => {
      const req = new Request('http://localhost/routes?lat=3.13&lon=bar');
      const res = await worker.fetch(req, { KV: emptyKv, DB: {} } as any, {} as any);
      expect(res.status).toBe(400);
    });

    it('returns 400 for out-of-range lat (-91)', async () => {
      const req = new Request('http://localhost/routes?lat=-91&lon=101.68');
      const res = await worker.fetch(req, { KV: emptyKv, DB: {} } as any, {} as any);
      expect(res.status).toBe(400);
    });

    it('returns 400 for out-of-range lon (181)', async () => {
      const req = new Request('http://localhost/routes?lat=3.13&lon=181');
      const res = await worker.fetch(req, { KV: emptyKv, DB: {} } as any, {} as any);
      expect(res.status).toBe(400);
    });
  });

  describe('/refresh — GET rejected (issue #131)', () => {
    it('GET /refresh → 404 (route only registered as POST)', async () => {
      // Hono returns 404 for an unregistered method on a known path.
      const req = new Request('http://localhost/refresh');
      const res = await worker.fetch(req, { KV: emptyKv, DB: {} } as any, {} as any);
      expect(res.status).toBe(404);
    });

    it('POST /refresh without token → 401 (auth check still runs)', async () => {
      const req = new Request('http://localhost/refresh', { method: 'POST' });
      const res = await worker.fetch(req, {
        KV: emptyKv,
        DB: {},
        ADMIN_TOKEN: 'secret',
      } as any, {} as any);
      expect(res.status).toBe(401);
    });
  });
});


describe('Global Security middleware', () => {
  const dummyEnv = {
    KV: { get: vi.fn(), put: vi.fn() },
    DB: { prepare: vi.fn(), batch: vi.fn() },
  };

  it('rejects overly long paths (414 URI Too Long)', async () => {
    const longPath = 'a'.repeat(300);
    const req = new Request(`http://localhost/${longPath}`);
    const res = await worker.fetch(req, dummyEnv as any);
    expect(res.status).toBe(414);
    const json = await res.json() as any;
    expect(json.error).toBe('URI path too long');
  });

  it('rejects overly long query parameters (400 Bad Request)', async () => {
    const longQuery = 'a'.repeat(150);
    const req = new Request(`http://localhost/nearby?lat=3&lon=101&foo=${longQuery}`);
    const res = await worker.fetch(req, dummyEnv as any);
    expect(res.status).toBe(400);
    const json = await res.json() as any;
    expect(json.error).toBe('Parameter foo is too long');
  });

  it('handles 404 cleanly in JSON', async () => {
    const req = new Request('http://localhost/does-not-exist');
    const res = await worker.fetch(req, dummyEnv as any);
    expect(res.status).toBe(404);
    const json = await res.json() as any;
    expect(json.error).toBe('Not Found');
  });
});
