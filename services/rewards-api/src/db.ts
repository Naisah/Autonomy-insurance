/**
 * Prisma client reads DATABASE_URL. Loaded lazily so the scaffold builds and tests run
 * before the schema task (prisma/**) exists and `prisma generate` has produced the client.
 */
type PrismaLike = Record<string, unknown> & { $disconnect(): Promise<void> };
let client: PrismaLike | undefined;

export async function db(): Promise<PrismaLike> {
  if (!client) {
    const mod = (await import('@prisma/client')) as unknown as { PrismaClient: new () => PrismaLike };
    client = new mod.PrismaClient();
  }
  return client;
}
