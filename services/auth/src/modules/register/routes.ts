import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { AppError, errorBody } from '../../shared/errors.js';
import { PASSWORD_HINT, hashPassword, isStrongPassword } from '../login/password.js';
import { authResult, newSessionTokens } from '../login/session.js';
import { getStore } from '../login/store.js';
import { assignAgent } from './assignment.js';

const Body = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().email().max(254),
  password: z.string().min(1).max(128),
  acceptTerms: z.literal(true),
  client: z.enum(['web', 'mobile']).default('web'),
});

const routes: FastifyPluginAsync = async (app) => {
  app.post('/auth/register', async (req, reply) => {
    const parsed = Body.safeParse(req.body);
    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const i of parsed.error.issues) fields[i.path.join('.') || '_'] ??= i.message;
      if (fields.acceptTerms) fields.acceptTerms = 'You must agree to the terms';
      return reply.status(400).send(errorBody('VALIDATION', 'Invalid input', req.id, fields));
    }
    const { fullName, email: rawEmail, password, client } = parsed.data;
    if (!isStrongPassword(password)) {
      return reply.status(400).send(errorBody('VALIDATION', 'Invalid input', req.id, { password: PASSWORD_HINT }));
    }
    const email = rawEmail.trim().toLowerCase();
    const store = await getStore();
    const passwordHash = await hashPassword(password);
    const { refresh, session } = newSessionTokens(client);

    const created = await store.registerClient(
      { fullName, email, passwordHash, termsAcceptedAt: new Date() },
      assignAgent,
      session,
    );
    if (!created) throw new AppError('CONFLICT', 'An account with this email already exists', { email: 'Already registered' });
    return reply.status(201).send(authResult(reply, client, created.user, created.sid, refresh.token));
  });
};

export default routes;
