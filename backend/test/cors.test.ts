import { describe, expect, test } from 'vitest';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Env } from '../src/types';

describe('CORS vulnerability check', () => {
  test('cors allows fallback origin when env variable is absent', async () => {
    const app = new Hono<{ Bindings: Env }>();
    app.use('*', cors({
      origin: (origin, c) => {
        const allowed = c.env?.FRONTEND_URL || 'http://localhost:3000';
        if (!origin || origin === allowed) return origin || allowed;
        return null;
      }
    }));
    app.get('/', (c) => c.json({ ok: true }));

    const res = await app.request('/', { headers: { 'Origin': 'http://localhost:3000' } }, { FRONTEND_URL: undefined } as any);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
  });

  test('cors blocks invalid origin', async () => {
    const app = new Hono<{ Bindings: Env }>();
    app.use('*', cors({
      origin: (origin, c) => {
        const allowed = c.env?.FRONTEND_URL || 'http://localhost:3000';
        if (!origin || origin === allowed) return origin || allowed;
        return null;
      }
    }));
    app.get('/', (c) => c.json({ ok: true }));

    const res = await app.request('/', { headers: { 'Origin': 'https://attacker.com' } }, { FRONTEND_URL: 'https://example.com' } as any);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  test('cors allows configured environment FRONTEND_URL', async () => {
    const app = new Hono<{ Bindings: Env }>();
    app.use('*', cors({
      origin: (origin, c) => {
        const allowed = c.env?.FRONTEND_URL || 'http://localhost:3000';
        if (!origin || origin === allowed) return origin || allowed;
        return null;
      }
    }));
    app.get('/', (c) => c.json({ ok: true }));

    const res = await app.request('/', { headers: { 'Origin': 'https://example.com' } }, { FRONTEND_URL: 'https://example.com' } as any);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://example.com');
  });
});
