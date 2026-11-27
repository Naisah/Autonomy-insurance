import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Fastify, { type FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { AppError, errorBody, type ErrorCode } from './shared/errors.js';
import { loadModules } from './shared/modules.js';

const here = path.dirname(fileURLToPath(import.meta.url));

export interface BuildOptions {
  modulesDir?: string;
  logger?: boolean;
}

const CODE_BY_STATUS: Record<number, ErrorCode> = {
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  429: 'RATE_LIMITED',
};

export async function buildApp(opts: BuildOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({
    logger: opts.logger ?? false,
    requestIdHeader: 'x-request-id',
    genReqId: () => randomUUID(),
  });

  app.addHook('onSend', async (req, reply) => {
    reply.header('x-request-id', req.id);
  });

  app.setNotFoundHandler((req, reply) => {
    reply.status(404).send(errorBody('NOT_FOUND', 'Route not found', req.id));
  });

  app.setErrorHandler((err, req, reply) => {
    if (err instanceof AppError) {
      return reply.status(err.statusCode).send(errorBody(err.code, err.message, req.id, err.details));
    }
    if (err instanceof ZodError) {
      return reply.status(400).send(errorBody('VALIDATION', 'Invalid input', req.id, err.flatten().fieldErrors));
    }
    const e = err as { statusCode?: number; validation?: unknown };
    if (e.validation) {
      return reply.status(400).send(errorBody('VALIDATION', 'Invalid input', req.id, e.validation));
    }
    if (typeof e.statusCode === 'number' && e.statusCode >= 400 && e.statusCode < 500) {
      const code = CODE_BY_STATUS[e.statusCode] ?? 'VALIDATION';
      return reply.status(e.statusCode).send(errorBody(code, 'Request could not be processed', req.id));
    }
    req.log.error({ errName: (err as Error).name }, 'unhandled error');
    return reply.status(500).send(errorBody('INVALID_STATE', 'Unexpected server error', req.id));
  });

  await loadModules(app, opts.modulesDir ?? path.join(here, 'modules'));
  return app;
}
