import type { FastifyPluginAsync } from 'fastify';

const routes: FastifyPluginAsync = async (app) => {
  app.get('/probe', async () => ({ probe: true }));
};
export default routes;
