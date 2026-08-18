export interface BreakEvenInput {
  startupCosts: number;
  monthlyFixedCosts: number;
  pricePerUnit: number;
  variableCostPerUnit: number;
  /** Optional — realistic expected units/month, used only to estimate time to recover startup costs. */
  expectedMonthlyUnits?: number;
}

export interface BreakEvenResult {
  contributionMargin: number;
  contributionMarginRatio: number | null;
  breakEvenUnitsPerMonth: number | null;
  breakEvenRevenuePerMonth: number | null;
  monthlyProfitAtExpectedVolume: number | null;
  monthsToRecoverStartupCosts: number | null;
}

export function calculateBreakEven(input: BreakEvenInput): BreakEvenResult {
  const { startupCosts, monthlyFixedCosts, pricePerUnit, variableCostPerUnit, expectedMonthlyUnits } = input;

  const contributionMargin = pricePerUnit - variableCostPerUnit;
  const contributionMarginRatio = pricePerUnit > 0 ? contributionMargin / pricePerUnit : null;

  const breakEvenUnitsPerMonth = contributionMargin > 0 ? monthlyFixedCosts / contributionMargin : null;
  const breakEvenRevenuePerMonth =
    breakEvenUnitsPerMonth !== null ? breakEvenUnitsPerMonth * pricePerUnit : null;

  let monthlyProfitAtExpectedVolume: number | null = null;
  let monthsToRecoverStartupCosts: number | null = null;

  if (expectedMonthlyUnits !== undefined && contributionMargin > 0) {
    monthlyProfitAtExpectedVolume = expectedMonthlyUnits * contributionMargin - monthlyFixedCosts;
    if (monthlyProfitAtExpectedVolume > 0) {
      monthsToRecoverStartupCosts = startupCosts / monthlyProfitAtExpectedVolume;
    }
  }

  return {
    contributionMargin,
    contributionMarginRatio,
    breakEvenUnitsPerMonth,
    breakEvenRevenuePerMonth,
    monthlyProfitAtExpectedVolume,
    monthsToRecoverStartupCosts,
  };
}
