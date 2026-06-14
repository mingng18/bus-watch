import { describe, it, expect, vi } from 'vitest';
import worker from '../src/index';
import * as nearby from '../src/nearby';

vi.mock('../src/nearby', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/nearby')>();
  return {
    ...actual,
    getHistoricalETA: vi.fn(),
  };
});

// Mock realtime vehicles properly to bypass its logic, and reach the DB call
vi.mock('../src/gtfs-realtime', () => ({
  fetchVehiclePositions: vi.fn().mockResolvedValue([{ tripId: 't1', routeId: 'r1' }])
}));

describe('GET /bus/eta', () => {
  it('returns 500 on internal server error when getHistoricalETA throws', async () => {
    // We mock the getHistoricalETA function to throw an error, which
    // simulates a database failure or other unexpected error during ETA calculation
    vi.mocked(nearby.getHistoricalETA).mockRejectedValue(new Error('DB Error'));

    const req = new Request('http://localhost/bus/eta?tripId=t1&stopId=s1');
    const res = await worker.fetch(req, {
      KV: {
        get: vi.fn().mockResolvedValue(null),
        put: vi.fn().mockResolvedValue(undefined),
      },
      DB: {},
    } as any, {} as any);

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
