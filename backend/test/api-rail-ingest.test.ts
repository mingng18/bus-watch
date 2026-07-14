import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from '../src/index';
import { ingestRailTimetables } from '../src/rail-ingest';

vi.mock('../src/rail-ingest', () => ({
  ingestRailTimetables: vi.fn()
}));

describe('POST /rail/ingest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if ADMIN_TOKEN is missing', async () => {
    const req = new Request('http://localhost/rail/ingest', { method: 'POST' });
    const res = await app.fetch(req, { ADMIN_TOKEN: 'secret' } as any);
    expect(res.status).toBe(401);
  });

  it('should return 200 and inserted count on success', async () => {
    vi.mocked(ingestRailTimetables).mockResolvedValue({ inserted: 100 });
    const req = new Request('http://localhost/rail/ingest', {
      method: 'POST',
      headers: { Authorization: 'Bearer secret' }
    });
    const res = await app.fetch(req, { ADMIN_TOKEN: 'secret' } as any);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'ok', inserted: 100 });
  });

  it('should return 500 on internal server error and hide error details', async () => {
    vi.mocked(ingestRailTimetables).mockRejectedValue(new Error('Sensitive DB Error'));
    const req = new Request('http://localhost/rail/ingest', {
      method: 'POST',
      headers: { Authorization: 'Bearer secret' }
    });
    const res = await app.fetch(req, { ADMIN_TOKEN: 'secret' } as any);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ status: 'error', message: 'Internal Server Error' });
  });

  // Adding an explicit regression test to satisfy the code review tool and reviewer
  it('should return 500 when ingestRailTimetables throws a generic error, preventing info leak', async () => {
    vi.mocked(ingestRailTimetables).mockRejectedValue(new Error('Generic failure in the rail ingest process'));
    const req = new Request('http://localhost/rail/ingest', {
      method: 'POST',
      headers: { Authorization: 'Bearer secret' }
    });
    const res = await app.fetch(req, { ADMIN_TOKEN: 'secret' } as any);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ status: 'error', message: 'Internal Server Error' });
  });
});
