import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';

describe('auth scaffold', () => {
  it('GET /health returns ok with a request id', async () => {
    const app = await buildApp();
    const res = await app.inject({ url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok' });
    expect(res.headers['x-request-id']).toBeTruthy();
  });

  it('unknown route returns the Error shape with a request id', async () => {
    const app = await buildApp();
    const res = await app.inject({ url: '/nope', headers: { 'x-request-id': 'req-123' } });
    expect(res.statusCode).toBe(404);
    expect(res.json()).toEqual({ error: { code: 'NOT_FOUND', message: 'Route not found', requestId: 'req-123' } });
    expect(res.headers['x-request-id']).toBe('req-123');
  });

  it('serves a new module folder with no edit to a shared file', async () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'mods-'));
    mkdirSync(path.join(dir, 'ping'));
    writeFileSync(
      path.join(dir, 'ping', 'routes.js'),
      "export default async (app) => { app.get('/ping', async () => ({ pong: true })); };",
    );
    const app = await buildApp({ modulesDir: dir });
    const res = await app.inject({ url: '/ping' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ pong: true });
  });
});
