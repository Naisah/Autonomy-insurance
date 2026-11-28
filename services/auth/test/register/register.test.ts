import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../../src/app.js';
import { setStore } from '../../src/modules/login/store.js';
import { setAssignHook } from '../../src/modules/register/assignment.js';
import { decodeJwt, memoryStore, type MemoryStore } from '../login/memory-store.js';

const valid = { fullName: 'Ana Reyes', email: 'ana@example.com', password: 'Passw0rdOk', acceptTerms: true };

describe('POST /auth/register', () => {
  let app: FastifyInstance;
  let store: MemoryStore;
  beforeEach(async () => {
    store = memoryStore();
    setStore(store);
    app = await buildApp();
  });
  afterEach(() => {
    setStore(undefined);
    setAssignHook(undefined);
  });

  it('rejects a weak password with a hint and creates nothing', async () => {
    for (const password of ['short1', 'allletters', '12345678']) {
      const res = await app.inject({ method: 'POST', url: '/auth/register', payload: { ...valid, password } });
      expect(res.statusCode).toBe(400);
      expect(res.json().error.code).toBe('VALIDATION');
      expect(res.json().error.fields.password).toMatch(/8 characters/);
    }
    expect(store.users).toHaveLength(0);
  });

  it('requires terms', async () => {
    const res = await app.inject({ method: 'POST', url: '/auth/register', payload: { ...valid, acceptTerms: false } });
    expect(res.statusCode).toBe(400);
    expect(res.json().error.fields.acceptTerms).toBeTruthy();
  });

  it('stores only an argon2id hash, never the password', async () => {
    const res = await app.inject({ method: 'POST', url: '/auth/register', payload: valid });
    expect(res.statusCode).toBe(201);
    const stored = store.users[0]!;
    expect(stored.passwordHash).toMatch(/^\$argon2id\$/);
    expect(JSON.stringify(store)).not.toContain(valid.password);
    expect(res.body).not.toContain(valid.password);
    expect(res.body).not.toContain('passwordHash');
    expect(res.body).not.toContain('$argon2');
  });

  it('with the stub returning no agent creates a waiting client', async () => {
    const res = await app.inject({ method: 'POST', url: '/auth/register', payload: valid });
    expect(res.statusCode).toBe(201);
    expect(res.json().user.role).toBe('Client');
    expect(res.json().user.agentStatus).toBe('Waiting');
    expect(res.json().user.reportsTo).toBeNull();
    expect(store.users[0]!.waitingSince).toBeInstanceOf(Date);
  });

  it('assigns the client when the hook returns an agent', async () => {
    setAssignHook(async () => 'agent-1');
    const res = await app.inject({ method: 'POST', url: '/auth/register', payload: valid });
    expect(res.json().user.agentStatus).toBe('Assigned');
    expect(store.users[0]!.waitingSince).toBeNull();
  });

  it('returns a token with sub, role, sid, aud and the web refresh cookie', async () => {
    const res = await app.inject({ method: 'POST', url: '/auth/register', payload: valid });
    const body = res.json();
    const { header, claims } = decodeJwt(body.accessToken);
    expect(header.alg).toBe('RS256');
    expect(claims).toMatchObject({ sub: body.user.id, role: 'Client', aud: 'core-api', sid: store.sessions[0]!.id });
    expect(body.expiresInSeconds).toBe(900);
    expect(body.refreshToken).toBeUndefined();
    expect(String(res.headers['set-cookie'])).toMatch(/^ai_refresh=.+HttpOnly/);
  });

  it('mobile gets the refresh token in the body; only its hash is stored', async () => {
    const res = await app.inject({ method: 'POST', url: '/auth/register', payload: { ...valid, client: 'mobile' } });
    const token = res.json().refreshToken as string;
    expect(token).toBeTruthy();
    expect(res.headers['set-cookie']).toBeUndefined();
    expect(JSON.stringify(store.sessions)).not.toContain(token);
  });

  it('returns 409 for a repeated email, ignoring case', async () => {
    await app.inject({ method: 'POST', url: '/auth/register', payload: valid });
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { ...valid, email: 'ANA@example.com' },
    });
    expect(res.statusCode).toBe(409);
    expect(res.json().error.code).toBe('CONFLICT');
  });
});
