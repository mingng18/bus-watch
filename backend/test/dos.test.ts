import { describe, expect, it } from 'vitest';
import worker from '../src/index';

describe('Global DoS protection', () => {
  it('blocks long query strings', async () => {
    const mockEnv = {} as any;
    const longQuery = 'a'.repeat(500) + '=1';
    const req = new Request(`http://localhost/bus/eta?${longQuery}`);
    const res = await worker.fetch(req, mockEnv);
    expect(res.status).toBe(400); // or 414
  });

  it('blocks long query strings across arrays', async () => {
    const mockEnv = {} as any;
    const longParam = 'a'.repeat(150);
    const req = new Request(`http://localhost/test?foo=1&foo=${longParam}`);
    const res = await worker.fetch(req, mockEnv);
    expect(res.status).toBe(400);
  });
});
