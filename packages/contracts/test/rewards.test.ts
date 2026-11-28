import { describe, expect, it } from 'vitest';
import rewardVectors from '../test-vectors/rewards.json';
import {
  DEFAULT_STATUS,
  STANDARD_PROCESSING_DAYS,
  addBusinessDays,
  dailyPoints,
  extensionDays,
  levelForPoints,
  payoutDelayDays,
  payoutDueDate,
  statusOnDate,
  type RewardStatus,
} from '../src/rewards';

describe('reward rule vectors', () => {
  it('documents the status-on-date rule and Asia/Manila business dates in the header', () => {
    expect(rewardVectors.statusOnDateRule).toContain(
      'Premium uses the reward status on its due date',
    );
    expect(rewardVectors.statusOnDateRule).toContain(
      'claim payout uses the status on the approval date',
    );
    expect(rewardVectors.statusOnDateRule).toContain('otherwise Bronze');
    expect(rewardVectors.timeZone).toBe('Asia/Manila');
    expect(rewardVectors.businessDates).toContain('Asia/Manila');
    expect(rewardVectors.businessDates).toContain('UTC');
  });

  describe('daily points from steps', () => {
    it('covers every step edge from the task', () => {
      expect(rewardVectors.dailyPoints.vectors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ steps: 4999, expectedPoints: 0 }),
          expect.objectContaining({ steps: 5000, expectedPoints: 10 }),
          expect.objectContaining({ steps: 7999, expectedPoints: 10 }),
          expect.objectContaining({ steps: 8000, expectedPoints: 20 }),
          expect.objectContaining({ steps: 11999, expectedPoints: 20 }),
          expect.objectContaining({ steps: 12000, expectedPoints: 30 }),
        ]),
      );
    });

    for (const vector of rewardVectors.dailyPoints.vectors) {
      it(`${vector.steps} steps gives ${vector.expectedPoints} points`, () => {
        expect(dailyPoints(vector.steps)).toBe(vector.expectedPoints);
      });
    }
  });

  describe('monthly points to level', () => {
    it('covers every level edge from the task', () => {
      expect(rewardVectors.levels.vectors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ points: 199, expectedStatus: 'Bronze' }),
          expect.objectContaining({ points: 200, expectedStatus: 'Silver' }),
          expect.objectContaining({ points: 399, expectedStatus: 'Silver' }),
          expect.objectContaining({ points: 400, expectedStatus: 'Gold' }),
          expect.objectContaining({ points: 599, expectedStatus: 'Gold' }),
          expect.objectContaining({ points: 600, expectedStatus: 'Platinum' }),
        ]),
      );
    });

    for (const vector of rewardVectors.levels.vectors) {
      it(`${vector.points} monthly points is ${vector.expectedStatus}`, () => {
        expect(levelForPoints(vector.points)).toBe(vector.expectedStatus);
      });
    }
  });

  describe('extension and delay days', () => {
    it('covers all four levels', () => {
      expect(rewardVectors.effects.vectors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ status: 'Bronze' }),
          expect.objectContaining({ status: 'Silver' }),
          expect.objectContaining({ status: 'Gold' }),
          expect.objectContaining({ status: 'Platinum' }),
        ]),
      );
    });

    for (const vector of rewardVectors.effects.vectors) {
      const status = vector.status as RewardStatus;
      it(`${status} gives +${vector.expectedExtensionDays} premium days and +${vector.expectedPayoutDelayDays} payout days`, () => {
        expect(extensionDays(status)).toBe(vector.expectedExtensionDays);
        expect(payoutDelayDays(status)).toBe(vector.expectedPayoutDelayDays);
      });
    }
  });

  describe('status on a date', () => {
    for (const vector of rewardVectors.statusOnDate.vectors) {
      it(`gives ${vector.expectedStatus} on ${vector.date}`, () => {
        expect(
          statusOnDate(
            vector.history.map((entry) => ({
              period: entry.period,
              effectiveDate: entry.effectiveDate,
              status: entry.status as RewardStatus,
              points: entry.points,
            })),
            vector.date,
          ),
        ).toBe(vector.expectedStatus);
      });
    }
  });

  describe('payout example', () => {
    const example = rewardVectors.payoutExample;

    it('uses the Platinum day-0 to day-14 example', () => {
      expect(example.status).toBe('Platinum');
      expect(example.approvalDayOffset).toBe(0);
      expect(example.expectedPayoutDayOffset).toBe(14);
      expect(example.standardProcessingDays).toBe(STANDARD_PROCESSING_DAYS);
      expect(payoutDelayDays(example.status as RewardStatus)).toBe(
        example.expectedPayoutDelayDays,
      );
    });

    it(`pays a ${example.status} claim approved on ${example.approvalDate} on ${example.expectedPayoutDate}`, () => {
      expect(
        payoutDueDate(
          example.approvalDate,
          example.status as RewardStatus,
          example.standardProcessingDays,
        ),
      ).toBe(example.expectedPayoutDate);
      expect(
        addBusinessDays(example.approvalDate, example.expectedPayoutDayOffset),
      ).toBe(example.expectedPayoutDate);
    });

    it('uses Bronze and no delay when no result exists', () => {
      expect(DEFAULT_STATUS).toBe('Bronze');
      expect(extensionDays(DEFAULT_STATUS)).toBe(0);
      expect(payoutDelayDays(DEFAULT_STATUS)).toBe(0);
      expect(
        payoutDueDate(example.approvalDate, DEFAULT_STATUS),
      ).toBe(addBusinessDays(example.approvalDate, STANDARD_PROCESSING_DAYS));
    });
  });
});
