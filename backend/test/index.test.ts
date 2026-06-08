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
