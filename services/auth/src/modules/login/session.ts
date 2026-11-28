import type { FastifyReply } from 'fastify';
import type { NewSession, StoredUser } from './store.js';
import { ACCESS_TTL_SECONDS, CORE_AUDIENCE, REFRESH_TTL_SECONDS, newRefreshToken, signAccessToken } from './tokens.js';

export type ClientKind = 'web' | 'mobile';

export function newSessionTokens(kind: ClientKind): {
  refresh: ReturnType<typeof newRefreshToken>;
  session: Omit<NewSession, 'userId'>;
} {
  const refresh = newRefreshToken();
  return {
    refresh,
    session: { audience: 'CoreApi', deviceLabel: kind, refreshTokenHash: refresh.hash, refreshExpiresAt: refresh.expiresAt },
  };
}

// Contract User schema. Never any password data.
export function publicUser(u: StoredUser): Record<string, unknown> {
  return {
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    role: u.role,
    status: u.status,
    mustChangePassword: u.mustChangePassword,
    reportsTo: u.reportsTo,
    ...(u.role === 'Client' ? { agentStatus: u.reportsTo ? 'Assigned' : 'Waiting' } : {}),
    ...(u.role === 'Agent' ? { availability: u.availability, maxClients: u.maxClients } : {}),
    createdAt: u.createdAt.toISOString(),
  };
}

// Web gets the refresh token as an httpOnly cookie, mobile in the body (contract ClientKind).
export function authResult(
  reply: FastifyReply,
  kind: ClientKind,
  user: StoredUser,
  sid: string,
  refreshToken: string,
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    accessToken: signAccessToken({ sub: user.id, role: user.role, sid, aud: CORE_AUDIENCE }),
    expiresInSeconds: ACCESS_TTL_SECONDS,
    user: publicUser(user),
  };
  if (kind === 'mobile') {
    body.refreshToken = refreshToken;
  } else {
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    reply.header(
      'set-cookie',
      `ai_refresh=${refreshToken}; HttpOnly; Path=/auth; SameSite=Lax; Max-Age=${REFRESH_TTL_SECONDS}${secure}`,
    );
  }
  return body;
}
