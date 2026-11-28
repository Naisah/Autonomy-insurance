// Shared reference for the reward vectors in test-vectors/rewards.json.
// Rules: spec 02 section 6, spec 03 sections 9.2 and 9.3, spec 04 reward.rules.
// Status on date D: the latest reward_status_history row with effective_from on
// or before the end of D, else Bronze. Premium uses the status on its due date;
// a claim payout uses the status on its approval date. Business dates are
// Asia/Manila calendar dates (Q6); timestamps are stored in UTC.

export type RewardStatus = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface DailyPointsBand {
  minSteps: number;
  points: number;
}

export interface RewardTier {
  status: RewardStatus;
  minPoints: number;
  extensionDays: number;
  payoutDelayDays: number;
}

export interface RewardStatusEntry {
  period: string;
  /** Asia/Manila calendar date (YYYY-MM-DD) of effective_from. */
  effectiveDate: string;
  status: RewardStatus;
  points: number;
}

export const DAILY_POINTS_BANDS: readonly DailyPointsBand[] = [
  { minSteps: 0, points: 0 },
  { minSteps: 5000, points: 10 },
  { minSteps: 8000, points: 20 },
  { minSteps: 12000, points: 30 },
];

export const REWARD_TIERS: readonly RewardTier[] = [
  { status: 'Bronze', minPoints: 0, extensionDays: 0, payoutDelayDays: 0 },
  { status: 'Silver', minPoints: 200, extensionDays: 7, payoutDelayDays: 3 },
  { status: 'Gold', minPoints: 400, extensionDays: 14, payoutDelayDays: 5 },
  { status: 'Platinum', minPoints: 600, extensionDays: 21, payoutDelayDays: 7 },
];

export const DEFAULT_STATUS: RewardStatus = 'Bronze';
export const STANDARD_PROCESSING_DAYS = 7;

/** Highest daily band reached by the step count. */
export function dailyPoints(steps: number): number {
  for (let index = DAILY_POINTS_BANDS.length - 1; index >= 0; index -= 1) {
    const band = DAILY_POINTS_BANDS[index];
    if (steps >= band.minSteps) return band.points;
  }
  return 0;
}

/** Level for monthly points. Bronze applies below the first threshold. */
export function levelForPoints(points: number): RewardStatus {
  for (let index = REWARD_TIERS.length - 1; index >= 0; index -= 1) {
    const tier = REWARD_TIERS[index];
    if (points >= tier.minPoints) return tier.status;
  }
  return DEFAULT_STATUS;
}

export function tierFor(status: RewardStatus): RewardTier {
  const tier = REWARD_TIERS.find((candidate) => candidate.status === status);
  if (!tier) throw new RangeError(`Unknown reward status: ${status}`);
  return tier;
}

/** Extra days to pay each premium; nothing is stored on the policy. */
export function extensionDays(status: RewardStatus): number {
  return tierFor(status).extensionDays;
}

/** Extra days after standard processing before a claim is paid. */
export function payoutDelayDays(status: RewardStatus): number {
  return tierFor(status).payoutDelayDays;
}

/** Latest history row on or before the date, else Bronze. Date-only lookup. */
export function statusOnDate(
  history: readonly RewardStatusEntry[],
  date: string,
): RewardStatus {
  let latest: RewardStatusEntry | undefined;
  for (const entry of history) {
    if (
      entry.effectiveDate <= date &&
      (!latest || entry.effectiveDate >= latest.effectiveDate)
    ) {
      latest = entry;
    }
  }
  return latest?.status ?? DEFAULT_STATUS;
}

/** Add calendar days to an Asia/Manila business date (YYYY-MM-DD). */
export function addBusinessDays(date: string, days: number): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) throw new RangeError(`Invalid business date: ${date}`);
  const shifted = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );
  if (shifted.toISOString().slice(0, 10) !== date) {
    throw new RangeError(`Invalid business date: ${date}`);
  }
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted.toISOString().slice(0, 10);
}

/** approval date + standard processing days + status delay; never a reduction. */
export function payoutDueDate(
  approvalDate: string,
  status: RewardStatus,
  standardProcessingDays: number = STANDARD_PROCESSING_DAYS,
): string {
  return addBusinessDays(
    approvalDate,
    standardProcessingDays + payoutDelayDays(status),
  );
}
