import { randomUUID } from 'node:crypto';
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import Fastify, { type FastifyInstance, type FastifyPluginAsync } from 'fastify';
import { ZodError } from 'zod';
import { AppError, errorBody, type ErrorCode } from './errors.js';
import socketPlugin from './plugins/socket.js';

export interface BuildOptions {
  modulesDir?: string;
  logger?: boolean;
}

const CODE_BY_STATUS: Record<number, ErrorCode> = {
  400: 'VALIDATION', 401: 'UNAUTHORIZED', 403: 'FORBIDDEN', 404: 'NOT_FOUND', 429: 'RATE_LIMITED',
};

const here = fileURLToPath(new URL('.', import.meta.url));

/** Loads every `<modulesDir>/<name>/routes.(ts|js)` so modules never edit a shared file (K2). */
async function loadModules(app: FastifyInstance, dir: string) {
  if (!existsSync(dir)) return;
  const names = readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
  for (const name of names) {
    const file = ['routes.ts', 'routes.js'].map((f) => join(dir, name, f)).find(existsSync);
    if (!file) continue;
    const mod = (await import(pathToFileURL(file).href)) as { default: FastifyPluginAsync };
    await app.register(mod.default);
  }
}

export async function buildApp(opts: BuildOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({
    logger: opts.logger ? { redact: ['req.headers.authorization', 'req.headers.cookie'] } : false,
    genReqId: (req) => {
      const h = req.headers['x-request-id'];
      return typeof h === 'string' && /^[\w.-]{1,64}$/.test(h) ? h : randomUUID();
    },
    requestIdLogLabel: 'requestId',
  });

  app.addHook('onRequest', async (req, reply) => {
    reply.header('x-request-id', req.id);
  });

  app.setNotFoundHandler((req, reply) => {
    reply.code(404).send(errorBody('NOT_FOUND', 'Route not found', req.id));
  });

  app.setErrorHandler((err: Error, req, reply) => {
    if (err instanceof AppError) {
      return reply.code(err.statusCode).send(errorBody(err.code, err.message, req.id));
    }
    if (err instanceof ZodError) {
      return reply.code(400).send(errorBody('VALIDATION', 'Invalid request', req.id));
    }
    const status = (err as { statusCode?: number }).statusCode;
    if (status && status >= 400 && status < 500) {
      const code = CODE_BY_STATUS[status] ?? 'INVALID_STATE';
      return reply.code(status).send(errorBody(code, 'Invalid request', req.id));
    }
    req.log.error({ errName: err.name }, 'unhandled error');
    return reply.code(500).send(errorBody('INTERNAL', 'Something went wrong', req.id));
  });

  await app.register(socketPlugin);
  await loadModules(app, opts.modulesDir ?? join(here, 'modules'));
  return app;
}
