import fp from 'fastify-plugin';
import { Server } from 'socket.io';

declare module 'fastify' {
  interface FastifyInstance {
    io: Server;
  }
}

/** Placeholder: Socket.IO is registered with no events yet (chat tasks add them). */
export default fp(async (app) => {
  const io = new Server(app.server, { cors: { origin: false } });
  app.decorate('io', io);
  app.addHook('onClose', async () => {
    await new Promise<void>((resolve) => io.close(() => resolve()));
  });
});
