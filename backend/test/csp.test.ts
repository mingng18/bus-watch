import { describe, expect, it } from 'vitest';
import worker from '../src/index';

describe('CSP Security Headers', () => {
  it('applies default-src "none" to prevent XSS in case of accidental HTML rendering', async () => {
    const req = new Request('http://localhost/');
    const res = await worker.fetch(req, {} as any);
    const csp = res.headers.get('Content-Security-Policy');

    expect(csp).toBeDefined();
    expect(csp || '').toContain("default-src 'none'");
  });
});
