import { describe, expect, it, vi } from 'vitest';
import worker from '../src/index';
import * as gtfsStatic from '../src/gtfs-static';

describe('Admin endpoints caching policy', () => {
  it('applies Cache-Control: no-store on /refresh', async () => {
    vi.spyOn(gtfsStatic, 'fetchAndParseAgency').mockResolvedValue({} as any);

    const req = new Request('http://localhost/refresh', {
      method: 'POST',
      headers: { Authorization: 'Bearer secret' }
    });
    const env = { ADMIN_TOKEN: 'secret', KV: { put: vi.fn(), get: vi.fn() } };
    const res = await worker.fetch(req, env as any, {} as any);
    expect(res.headers.get('Cache-Control')).toBe('no-store');
  });

  it('applies Cache-Control: no-store on /rail/ingest', async () => {
    const req = new Request('http://localhost/rail/ingest', {
      method: 'POST',
      headers: { Authorization: 'Bearer secret' }
    });
    const env = { ADMIN_TOKEN: 'secret', KV: { put: vi.fn(), get: vi.fn() }, DB: { prepare: vi.fn(() => ({ bind: vi.fn(() => ({ run: vi.fn() })) })) } };
    const res = await worker.fetch(req, env as any, {} as any);
    expect(res.headers.get('Cache-Control')).toBe('no-store');
  });
});
