import { createHash, createPrivateKey, createPublicKey, generateKeyPairSync, randomBytes, sign, type KeyObject } from 'node:crypto';

export const ACCESS_TTL_SECONDS = 15 * 60;
export const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;
export const CORE_AUDIENCE = 'core-api';

let key: { priv: KeyObject; kid: string } | undefined;

// AUTH_JWT_PRIVATE_KEY: RS256 private key in PEM ("\n" escapes allowed). Without it a key is
// generated at start-up: fine for dev and tests, but sessions break on restart.
function signingKey(): { priv: KeyObject; kid: string } {
  if (key) return key;
  const pem = process.env.AUTH_JWT_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const priv = pem ? createPrivateKey(pem) : generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey;
  const der = createPublicKey(priv).export({ type: 'spki', format: 'der' });
  key = { priv, kid: createHash('sha256').update(der).digest('base64url').slice(0, 16) };
  return key;
}

const b64 = (v: object): string => Buffer.from(JSON.stringify(v)).toString('base64url');

export interface AccessClaims {
  sub: string;
  role: string;
  sid: string;
  aud: string;
}

export function signAccessToken(c: AccessClaims, now = new Date()): string {
  const k = signingKey();
  const iat = Math.floor(now.getTime() / 1000);
  const head = b64({ alg: 'RS256', typ: 'JWT', kid: k.kid });
  const body = b64({
    sub: c.sub,
    role: c.role,
    sid: c.sid,
    aud: c.aud,
    iss: process.env.AUTH_ISSUER ?? 'autonomy-auth',
    iat,
    exp: iat + ACCESS_TTL_SECONDS,
  });
  const sig = sign('RSA-SHA256', Buffer.from(`${head}.${body}`), k.priv).toString('base64url');
  return `${head}.${body}.${sig}`;
}

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

// Opaque random string; only the hash is stored.
export function newRefreshToken(now = new Date()): { token: string; hash: string; expiresAt: Date } {
  const token = randomBytes(32).toString('base64url');
  return { token, hash: hashRefreshToken(token), expiresAt: new Date(now.getTime() + REFRESH_TTL_SECONDS * 1000) };
}
