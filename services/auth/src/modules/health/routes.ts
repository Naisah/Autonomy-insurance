import type { FastifyPluginAsync } from 'fastify';

const routes: FastifyPluginAsync = async (app) => {
  app.get('/health', async () => ({ status: 'ok', service: 'auth' }));
};
export default routes;
