import type { PrismaClient } from '@prisma/client';
import { db } from '../../shared/db.js';

export type Role = 'Client' | 'Agent' | 'Manager' | 'Admin';

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: Role;
  status: 'Active' | 'Deactivated';
  mustChangePassword: boolean;
  reportsTo: { id: string; fullName: string } | null;
  waitingSince: Date | null;
  availability: 'Available' | 'Away' | null;
  maxClients: number | null;
  createdAt: Date;
}

export interface Attempt {
  succeeded: boolean;
  createdAt: Date;
}

export interface NewSession {
  userId: string;
  audience: 'CoreApi' | 'RewardsApi';
  deviceLabel: string | null;
  refreshTokenHash: string;
  refreshExpiresAt: Date;
}

export interface NewClient {
  fullName: string;
  email: string;
  passwordHash: string;
  termsAcceptedAt: Date;
}

// Returns the id of the agent the client is assigned to, or null when nobody qualifies.
export type AssignHook = (clientId: string) => Promise<string | null>;

export interface AuthStore {
  findUserByEmail(email: string): Promise<StoredUser | null>;
  attemptsSince(email: string, since: Date): Promise<Attempt[]>;
  recordAttempt(email: string, succeeded: boolean, ip: string | null): Promise<void>;
  createSession(s: NewSession): Promise<string>;
  // One transaction: create the client, run the assignment hook, set reports_to or waiting_since,
  // open the first session. Returns null when the email already exists.
  registerClient(
    c: NewClient,
    assign: AssignHook,
    s: Omit<NewSession, 'userId'>,
  ): Promise<{ user: StoredUser; sid: string } | null>;
}

let override: AuthStore | undefined;
export function setStore(s: AuthStore | undefined): void {
  override = s;
}

type UserRow = Omit<StoredUser, 'reportsTo'> & {
  reportsTo: string | null;
  parent?: { id: string; fullName: string } | null;
};

function toStored(u: UserRow): StoredUser {
  const { parent, ...rest } = u;
  return { ...rest, reportsTo: parent ? { id: parent.id, fullName: parent.fullName } : null };
}

const withParent = { parent: { select: { id: true, fullName: true } } } as const;

function prismaStore(p: PrismaClient): AuthStore {
  return {
    async findUserByEmail(email) {
      const u = await p.user.findUnique({ where: { email }, include: withParent });
      return u ? toStored(u as unknown as UserRow) : null;
    },
    async attemptsSince(email, since) {
      return p.loginAttempt.findMany({
        where: { email, createdAt: { gte: since } },
        orderBy: { createdAt: 'asc' },
        select: { succeeded: true, createdAt: true },
      });
    },
    async recordAttempt(email, succeeded, ip) {
      await p.loginAttempt.create({ data: { email, succeeded, ip } });
    },
    async createSession(s) {
      const session = await p.session.create({
        data: {
          userId: s.userId,
          audience: s.audience,
          deviceLabel: s.deviceLabel,
          refreshTokens: { create: { tokenHash: s.refreshTokenHash, expiresAt: s.refreshExpiresAt } },
        },
        select: { id: true },
      });
      return session.id;
    },
    async registerClient(c, assign, s) {
      if (await p.user.findUnique({ where: { email: c.email }, select: { id: true } })) return null;
      try {
        return await p.$transaction(async (tx) => {
          const created = await tx.user.create({
            data: {
              email: c.email,
              passwordHash: c.passwordHash,
              fullName: c.fullName,
              role: 'Client',
              termsAcceptedAt: c.termsAcceptedAt,
            },
          });
          const agentId = await assign(created.id);
          const user = await tx.user.update({
            where: { id: created.id },
            data: agentId ? { reportsTo: agentId } : { waitingSince: new Date() },
            include: withParent,
          });
          const session = await tx.session.create({
            data: {
              userId: user.id,
              audience: s.audience,
              deviceLabel: s.deviceLabel,
              refreshTokens: { create: { tokenHash: s.refreshTokenHash, expiresAt: s.refreshExpiresAt } },
            },
            select: { id: true },
          });
          return { user: toStored(user as unknown as UserRow), sid: session.id };
        });
      } catch (err) {
        if ((err as { code?: string }).code === 'P2002') return null; // unique email race
        throw err;
      }
    },
  };
}

export async function getStore(): Promise<AuthStore> {
  if (override) return override;
  return prismaStore((await db()) as unknown as PrismaClient);
}
