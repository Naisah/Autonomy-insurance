import argon2 from 'argon2';

// Spec 02 A1: at least 8 characters with a letter and a number.
export const PASSWORD_HINT = 'Use at least 8 characters with a letter and a number';

export function isStrongPassword(pw: string): boolean {
  return pw.length >= 8 && pw.length <= 128 && /[A-Za-z]/.test(pw) && /[0-9]/.test(pw);
}

export function hashPassword(pw: string): Promise<string> {
  return argon2.hash(pw, { type: argon2.argon2id });
}

export async function verifyPassword(hash: string, pw: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, pw);
  } catch {
    return false;
  }
}

// Run when the email is unknown, so both failures cost the same time.
let dummy: Promise<string> | undefined;
export async function burnVerify(pw: string): Promise<void> {
  dummy ??= hashPassword('not-a-real-password-1');
  await verifyPassword(await dummy, pw);
}
