import type { Attempt } from './store.js';

export const WINDOW_MS = 10 * 60 * 1000;
export const MAX_FAILURES = 5;
export const BLOCK_MS = 5 * 60 * 1000;

// Spec 03 section 4: 5 failures in 10 minutes block the email for 5 minutes.
// `attempts` must be oldest first and cover at least the last WINDOW_MS + BLOCK_MS.
// A success clears the count. The 5th failure within the window starts a block; attempts made
// during a block are not recorded, and a finished block starts from zero.
export function blockedForSeconds(attempts: Attempt[], now: Date): number {
  let recent: number[] = [];
  let blockUntil = 0;
  for (const a of attempts) {
    const t = a.createdAt.getTime();
    if (t < blockUntil) continue;
    if (a.succeeded) {
      recent = [];
      continue;
    }
    recent = recent.filter((f) => t - f < WINDOW_MS);
    recent.push(t);
    if (recent.length >= MAX_FAILURES) {
      blockUntil = t + BLOCK_MS;
      recent = [];
    }
  }
  const left = blockUntil - now.getTime();
  return left > 0 ? Math.ceil(left / 1000) : 0;
}
