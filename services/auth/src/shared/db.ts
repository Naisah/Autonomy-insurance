// Lazy Prisma client. Reads DATABASE_URL from the environment.
// `prisma generate` needs services/auth/prisma/schema.prisma (schema task T010), so the
// client is imported on first use and typed loosely until that task lands.
type PrismaLike = Record<string, unknown>;
let client: PrismaLike | undefined;

export async function db(): Promise<PrismaLike> {
  if (!client) {
    const mod = (await import('@prisma/client')) as unknown as { PrismaClient: new () => PrismaLike };
    client = new mod.PrismaClient();
  }
  return client;
}
