import { describe, expect, it } from "vitest";
import { calculateBreakEven } from "./breakEven";

describe("calculateBreakEven", () => {
  it("computes contribution margin and break-even units/revenue", () => {
    const result = calculateBreakEven({
      startupCosts: 5000,
      monthlyFixedCosts: 2000,
      pricePerUnit: 50,
      variableCostPerUnit: 20,
    });

    expect(result.contributionMargin).toBe(30);
    expect(result.contributionMarginRatio).toBeCloseTo(0.6);
    expect(result.breakEvenUnitsPerMonth).toBeCloseTo(2000 / 30);
    expect(result.breakEvenRevenuePerMonth).toBeCloseTo((2000 / 30) * 50);
  });

  it("returns null break-even figures when contribution margin is zero or negative", () => {
    const result = calculateBreakEven({
      startupCosts: 1000,
      monthlyFixedCosts: 500,
      pricePerUnit: 10,
      variableCostPerUnit: 10,
    });

    expect(result.contributionMargin).toBe(0);
    expect(result.breakEvenUnitsPerMonth).toBeNull();
    expect(result.breakEvenRevenuePerMonth).toBeNull();
  });

  it("returns null contribution margin ratio when price is zero", () => {
    const result = calculateBreakEven({
      startupCosts: 0,
      monthlyFixedCosts: 0,
      pricePerUnit: 0,
      variableCostPerUnit: 0,
    });

    expect(result.contributionMarginRatio).toBeNull();
  });

  it("computes months to recover startup costs when expected volume clears monthly fixed costs", () => {
    const result = calculateBreakEven({
      startupCosts: 3000,
      monthlyFixedCosts: 1000,
      pricePerUnit: 50,
      variableCostPerUnit: 30,
      expectedMonthlyUnits: 100,
    });

    // monthly profit = 100 * 20 - 1000 = 1000
    expect(result.monthlyProfitAtExpectedVolume).toBe(1000);
    expect(result.monthsToRecoverStartupCosts).toBe(3);
  });

  it("leaves monthsToRecoverStartupCosts null when expected volume doesn't clear monthly fixed costs", () => {
    const result = calculateBreakEven({
      startupCosts: 3000,
      monthlyFixedCosts: 5000,
      pricePerUnit: 50,
      variableCostPerUnit: 30,
      expectedMonthlyUnits: 10,
    });

    expect(result.monthlyProfitAtExpectedVolume).toBeLessThan(0);
    expect(result.monthsToRecoverStartupCosts).toBeNull();
  });

  it("leaves expected-volume figures null when expectedMonthlyUnits isn't provided", () => {
    const result = calculateBreakEven({
      startupCosts: 3000,
      monthlyFixedCosts: 1000,
      pricePerUnit: 50,
      variableCostPerUnit: 30,
    });

    expect(result.monthlyProfitAtExpectedVolume).toBeNull();
    expect(result.monthsToRecoverStartupCosts).toBeNull();
  });
});
