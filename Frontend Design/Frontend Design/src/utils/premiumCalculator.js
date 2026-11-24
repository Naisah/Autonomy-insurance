export function calculatePolicyEstimate({
  age,
  coverageAmount,
  termYears,
  healthTier,
  smoker,
  frequency,
  settings,
}) {
  const baseRate = settings?.baseRatePerThousand ?? 0.14;
  const smokerMult = smoker ? (settings?.smokerMultiplier ?? 1.45) : 1.0;
  const tierMult =
    healthTier === 'Preferred'
      ? settings?.preferredDiscount ?? 0.88
      : healthTier === 'Select'
      ? 0.94
      : 1.0;

  const ageFactor = 1 + Math.max(0, age - 25) * 0.032;
  const termFactor = 1 + (termYears - 10) * 0.012;
  const coverageUnits = coverageAmount / 1000;

  const rawMonthly = coverageUnits * baseRate * ageFactor * termFactor * tierMult * smokerMult;
  const monthlyPremium = Number(rawMonthly.toFixed(2));
  const annualDiscount = settings?.annualBillingDiscount ?? 0.95;
  const annualPremium = Number((monthlyPremium * 12 * annualDiscount).toFixed(2));

  const billedAmount =
    frequency === 'Annual'
      ? annualPremium
      : frequency === 'Quarterly'
      ? Number((monthlyPremium * 3 * 0.98).toFixed(2))
      : monthlyPremium;

  return {
    monthlyPremium,
    annualPremium,
    billedAmount,
    estimatedTotalTermCost: Number((annualPremium * termYears).toFixed(0)),
  };
}
