import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../../src/app.js';
import { setStore } from '../../src/modules/login/store.js';
import { blockedForSeconds } from '../../src/modules/login/throttle.js';
import { decodeJwt, memoryStore, type MemoryStore } from './memory-store.js';

const creds = { email: 'ben@example.com', password: 'Passw0rdOk' };
const login = (app: FastifyInstance, payload: object) => app.inject({ method: 'POST', url: '/auth/login', payload });

describe('POST /auth/login', () => {
  let app: FastifyInstance;
  let store: MemoryStore;
  beforeEach(async () => {
    store = memoryStore();
    setStore(store);
    app = await buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { fullName: 'Ben Cruz', ...creds, acceptTerms: true },
    });
    expect(res.statusCode).toBe(201);
    store.sessions.length = 0;
  });
  afterEach(() => setStore(undefined));

  it('signs in and returns a token with sub, role, sid, aud', async () => {
    const res = await login(app, creds);
    expect(res.statusCode).toBe(200);
    const body = res.json();
    const { header, claims } = decodeJwt(body.accessToken);
    expect(header.alg).toBe('RS256');
    expect(claims.sub).toBe(body.user.id);
    expect(claims.role).toBe('Client');
    expect(claims.sid).toBe(store.sessions[0]!.id);
    expect(claims.aud).toBe('core-api');
    expect(Number(claims.exp) - Number(claims.iat)).toBe(900);
    expect(claims).not.toHaveProperty('email');
    expect(JSON.stringify(body)).not.toMatch(/passwordHash|argon2/);
  });

  it('gives the identical response for wrong email and wrong password', async () => {
    const wrongPassword = await login(app, { ...creds, password: 'Wrong1234' });
    const wrongEmail = await login(app, { email: 'nobody@example.com', password: 'Wrong1234' });
    expect(wrongPassword.statusCode).toBe(401);
    expect(wrongEmail.statusCode).toBe(401);
    const a = wrongPassword.json().error;
    const b = wrongEmail.json().error;
    expect(a.code).toBe('UNAUTHORIZED');
    expect(a.message).toBe(b.message);
    expect(a.message).toBe('Email or password is incorrect');
    expect(a.fields).toBeUndefined();
    expect(b.fields).toBeUndefined();
  });

  it('blocks the 6th attempt within the window with 429 and retryAfterSeconds', async () => {
    for (let i = 0; i < 5; i++) {
      expect((await login(app, { ...creds, password: 'Wrong1234' })).statusCode).toBe(401);
    }
    const res = await login(app, creds); // even the right password is blocked
    expect(res.statusCode).toBe(429);
    const err = res.json().error;
    expect(err.code).toBe('ACCOUNT_BLOCKED');
    expect(err.retryAfterSeconds).toBeGreaterThan(0);
    expect(err.retryAfterSeconds).toBeLessThanOrEqual(300);
    expect(res.headers['retry-after']).toBe(String(err.retryAfterSeconds));
  });

  it('blocks per email only', async () => {
    for (let i = 0; i < 5; i++) await login(app, { ...creds, password: 'Wrong1234' });
    const other = await login(app, { email: 'other@example.com', password: 'Wrong1234' });
    expect(other.statusCode).toBe(401);
  });

  it('is case-insensitive on email', async () => {
    expect((await login(app, { ...creds, email: 'BEN@Example.com' })).statusCode).toBe(200);
  });

  it('refuses a deactivated account with the generic message', async () => {
    store.users[0]!.status = 'Deactivated';
    const res = await login(app, creds);
    expect(res.statusCode).toBe(401);
    expect(res.json().error.message).toBe('Email or password is incorrect');
  });

  it('mobile gets the refresh token in the body, web gets a cookie', async () => {
    const mobile = await login(app, { ...creds, client: 'mobile' });
    expect(mobile.json().refreshToken).toBeTruthy();
    const web = await login(app, creds);
    expect(web.json().refreshToken).toBeUndefined();
    expect(String(web.headers['set-cookie'])).toContain('HttpOnly');
  });

  it('rejects a malformed body with 400', async () => {
    expect((await login(app, { email: 'not-an-email', password: 'x' })).statusCode).toBe(400);
  });
});

describe('blockedForSeconds', () => {
  const at = (minAgo: number, succeeded = false) => ({ succeeded, createdAt: new Date(NOW - minAgo * 60_000) });
  const NOW = Date.UTC(2026, 10, 28, 12, 0, 0);
  const now = new Date(NOW);

  it('is open below 5 failures', () => {
    expect(blockedForSeconds([at(4), at(3), at(2), at(1)], now)).toBe(0);
  });
  it('blocks for 5 minutes after the 5th failure', () => {
    expect(blockedForSeconds([at(5), at(4), at(3), at(2), at(1)], now)).toBe(240);
  });
  it('opens again after 5 minutes and starts counting from zero', () => {
    const old = [at(9), at(8.9), at(8.8), at(8.7), at(8.6)];
    expect(blockedForSeconds(old, now)).toBe(0);
    expect(blockedForSeconds([...old, at(1), at(0.5)], now)).toBe(0);
  });
  it('ignores failures older than 10 minutes', () => {
    expect(blockedForSeconds([at(30), at(29), at(28), at(27), at(1)], now)).toBe(0);
  });
  it('a success clears the count', () => {
    expect(blockedForSeconds([at(5), at(4), at(3), at(2, true), at(1)], now)).toBe(0);
  });
});
