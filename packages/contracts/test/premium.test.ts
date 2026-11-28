import { describe, expect, it } from 'vitest';
import premiumVectors from '../test-vectors/premium.json';
import {
  computePremium,
  FORMULA_VERSION,
  formatMoney,
  monthlyPremiumCentavos,
} from '../src/premium';

describe('premium formula vectors', () => {
  it('uses the shared formula version', () => {
    expect(FORMULA_VERSION).toBe(premiumVectors.formulaVersion);
  });

  it('has at least 20 vectors', () => {
    expect(premiumVectors.vectors.length).toBeGreaterThanOrEqual(20);
  });

  it('includes the documented example vector', () => {
    const example = premiumVectors.vectors.find(
      (vector) =>
        vector.age === 30 &&
        vector.coverageAmount === 2000000 &&
        vector.termYears === 20,
    );
    expect(example).toBeDefined();
    expect(example?.expectedMonthlyPremium).toBe('1818.88');
    expect(example?.expectedCentavos).toBe(181888);
  });

  for (const vector of premiumVectors.vectors) {
    const inputs = {
      age: vector.age,
      coverageAmount: vector.coverageAmount,
      termYears: vector.termYears,
    };
    const label = `age ${vector.age}, coverage ${vector.coverageAmount}, term ${vector.termYears}`;

    it(`rounds ${label} to ${vector.expectedCentavos} centavos`, () => {
      expect(monthlyPremiumCentavos(inputs)).toBe(vector.expectedCentavos);
    });

    it(`formats ${label} as ${vector.expectedMonthlyPremium}`, () => {
      expect(formatMoney(vector.expectedCentavos)).toBe(
        vector.expectedMonthlyPremium,
      );
    });

    it(`returns the full result for ${label}`, () => {
      expect(computePremium(inputs)).toEqual({
        monthlyPremiumCentavos: vector.expectedCentavos,
        monthlyPremium: vector.expectedMonthlyPremium,
        formulaVersion: premiumVectors.formulaVersion,
      });
    });
  }
});
