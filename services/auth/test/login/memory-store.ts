import { randomUUID } from 'node:crypto';
import type { Attempt, AuthStore, NewSession, StoredUser } from '../../src/modules/login/store.js';

export interface MemoryStore extends AuthStore {
  users: (StoredUser & { waitingSince: Date | null })[];
  attempts: (Attempt & { email: string })[];
  sessions: ({ id: string } & NewSession)[];
}

export function memoryStore(): MemoryStore {
  const s: MemoryStore = {
    users: [],
    attempts: [],
    sessions: [],
    async findUserByEmail(email) {
      return s.users.find((u) => u.email === email) ?? null;
    },
    async attemptsSince(email, since) {
      return s.attempts.filter((a) => a.email === email && a.createdAt >= since).sort((a, b) => +a.createdAt - +b.createdAt);
    },
    async recordAttempt(email, succeeded) {
      s.attempts.push({ email, succeeded, createdAt: new Date() });
    },
    async createSession(x) {
      const id = randomUUID();
      s.sessions.push({ id, ...x });
      return id;
    },
    async registerClient(c, assign, sess) {
      if (s.users.some((u) => u.email === c.email)) return null;
      const id = randomUUID();
      const agentId = await assign(id);
      const user: StoredUser = {
        id,
        email: c.email,
        passwordHash: c.passwordHash,
        fullName: c.fullName,
        role: 'Client',
        status: 'Active',
        mustChangePassword: false,
        reportsTo: agentId ? { id: agentId, fullName: 'Agent' } : null,
        waitingSince: agentId ? null : new Date(),
        availability: null,
        maxClients: null,
        createdAt: new Date(),
      };
      s.users.push(user);
      const sid = randomUUID();
      s.sessions.push({ id: sid, userId: id, ...sess });
      return { user, sid };
    },
  };
  return s;
}

export function decodeJwt(token: string): { header: Record<string, unknown>; claims: Record<string, unknown> } {
  const [h, p] = token.split('.');
  return {
    header: JSON.parse(Buffer.from(h!, 'base64url').toString()),
    claims: JSON.parse(Buffer.from(p!, 'base64url').toString()),
  };
}
