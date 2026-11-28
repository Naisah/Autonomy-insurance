import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { errorBody } from '../../shared/errors.js';
import { burnVerify, verifyPassword } from './password.js';
import { authResult, newSessionTokens } from './session.js';
import { getStore } from './store.js';
import { BLOCK_MS, WINDOW_MS, blockedForSeconds } from './throttle.js';

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
  client: z.enum(['web', 'mobile']).default('web'),
});

// One message for wrong email, wrong password and deactivated accounts.
export const GENERIC_LOGIN_ERROR = 'Email or password is incorrect';

const routes: FastifyPluginAsync = async (app) => {
  app.post('/auth/login', async (req, reply) => {
    const { email: rawEmail, password, client } = Body.parse(req.body);
    const email = rawEmail.trim().toLowerCase();
    const store = await getStore();
    const now = new Date();

    const attempts = await store.attemptsSince(email, new Date(now.getTime() - WINDOW_MS - BLOCK_MS));
    const blocked = blockedForSeconds(attempts, now);
    if (blocked > 0) {
      reply.header('retry-after', String(blocked));
      const base = errorBody('ACCOUNT_BLOCKED', 'Too many failed attempts. Try again later.', req.id).error;
      return reply.status(429).send({ error: { ...base, retryAfterSeconds: blocked } });
    }

    const user = await store.findUserByEmail(email);
    let ok = false;
    if (user) ok = (await verifyPassword(user.passwordHash, password)) && user.status === 'Active';
    else await burnVerify(password);

    await store.recordAttempt(email, ok, req.ip ?? null);
    if (!ok || !user) {
      return reply.status(401).send(errorBody('UNAUTHORIZED', GENERIC_LOGIN_ERROR, req.id));
    }

    const { refresh, session } = newSessionTokens(client);
    const sid = await store.createSession({ ...session, userId: user.id });
    return authResult(reply, client, user, sid, refresh.token);
  });
};

export default routes;
