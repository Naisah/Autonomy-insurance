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
    expect(res.json()).toEqual({ status: 'ok', service: 'auth' });
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

describe('error shape', () => {
  it('maps unexpected errors to INTERNAL and validation errors to a fields map', async () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'mods-'));
    mkdirSync(path.join(dir, 'boom'));
    writeFileSync(
      path.join(dir, 'boom', 'routes.js'),
      "export default async (app) => { app.get('/boom', async () => { throw new Error('x'); }); app.post('/v', { schema: { body: { type: 'object', required: ['a'], properties: { a: { type: 'string' } } } } }, async () => ({})); };",
    );
    const app = await buildApp({ modulesDir: dir });
    const boom = await app.inject({ url: '/boom' });
    expect(boom.statusCode).toBe(500);
    expect(boom.json().error.code).toBe('INTERNAL');
    const v = await app.inject({ method: 'POST', url: '/v', payload: {} });
    expect(v.statusCode).toBe(400);
    expect(v.json().error.code).toBe('VALIDATION');
    expect(typeof v.json().error.fields).toBe('object');
    expect(v.json().error.details).toBeUndefined();
  });
});
