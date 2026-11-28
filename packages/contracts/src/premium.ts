export const FORMULA_VERSION = 'v1';

export interface PremiumInputs {
  age: number;
  coverageAmount: number;
  termYears: number;
}

export interface PremiumResult {
  monthlyPremiumCentavos: number;
  monthlyPremium: string;
  formulaVersion: string;
}

const CENTAVO_DENOMINATOR = 100000000n;
const BASE_RATE_NUMERATOR = 7n;
const FACTOR_SCALE = 1000n;
const AGE_FACTOR_PER_YEAR = 32n;
const AGE_FREE_UNTIL = 25;
const TERM_FACTOR_PER_YEAR = 12n;
const TERM_BASE_YEARS = 10;

export function ageFactorScaled(age: number): bigint {
  const yearsOver = Math.max(0, age - AGE_FREE_UNTIL);
  return FACTOR_SCALE + BigInt(yearsOver) * AGE_FACTOR_PER_YEAR;
}

export function termFactorScaled(termYears: number): bigint {
  return FACTOR_SCALE + BigInt(termYears - TERM_BASE_YEARS) * TERM_FACTOR_PER_YEAR;
}

export function monthlyPremiumCentavos(inputs: PremiumInputs): number {
  const numerator =
    BigInt(inputs.coverageAmount) *
    BASE_RATE_NUMERATOR *
    ageFactorScaled(inputs.age) *
    termFactorScaled(inputs.termYears);
  const rounded = (2n * numerator + CENTAVO_DENOMINATOR) / (2n * CENTAVO_DENOMINATOR);
  return Number(rounded);
}

export function formatMoney(centavos: number): string {
  const sign = centavos < 0 ? '-' : '';
  const absolute = Math.abs(centavos);
  const whole = Math.floor(absolute / 100);
  const fraction = (absolute % 100).toString().padStart(2, '0');
  return `${sign}${whole}.${fraction}`;
}

export function computePremium(inputs: PremiumInputs): PremiumResult {
  const centavos = monthlyPremiumCentavos(inputs);
  return {
    monthlyPremiumCentavos: centavos,
    monthlyPremium: formatMoney(centavos),
    formulaVersion: FORMULA_VERSION,
  };
}
