import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { buildApp } from '../src/app.js';

const fixtures = fileURLToPath(new URL('./fixtures-modules', import.meta.url));

describe('rewards-api scaffold', () => {
  it('GET /health returns ok with a request id', async () => {
    const app = await buildApp();
    const res = await app.inject('/health');
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok', service: 'rewards-api' });
    expect(res.headers['x-request-id']).toBeTruthy();
    await app.close();
  });

  it('serves a module folder with no shared-file edit', async () => {
    const app = await buildApp({ modulesDir: fixtures });
    const res = await app.inject('/probe');
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ probe: true });
    await app.close();
  });

  it('unknown route returns the Error shape with a request id', async () => {
    const app = await buildApp();
    const res = await app.inject({ url: '/nope', headers: { 'x-request-id': 'abc-123' } });
    expect(res.statusCode).toBe(404);
    expect(res.json()).toEqual({
      error: { code: 'NOT_FOUND', message: 'Route not found', requestId: 'abc-123' },
    });
    expect(res.headers['x-request-id']).toBe('abc-123');
    await app.close();
  });

  it('maps Fastify 401/403/404/429 errors to their own codes', async () => {
    const app = await buildApp();
    app.get('/e/:s', async (req) => {
      const s = Number((req.params as { s: string }).s);
      throw Object.assign(new Error('x'), { statusCode: s });
    });
    const want: Record<number, string> = { 401: 'UNAUTHORIZED', 403: 'FORBIDDEN', 404: 'NOT_FOUND', 429: 'RATE_LIMITED' };
    for (const [s, code] of Object.entries(want)) {
      const res = await app.inject(`/e/${s}`);
      expect(res.statusCode).toBe(Number(s));
      expect(res.json().error.code).toBe(code);
    }
    await app.close();
  });
});
