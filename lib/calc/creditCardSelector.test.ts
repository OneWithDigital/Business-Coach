import { describe, expect, it } from "vitest";
import { recommendCreditCard } from "./creditCardSelector";

describe("recommendCreditCard", () => {
  it("recommends a cash-based startup card when there's no revenue history", () => {
    const result = recommendCreditCard({ hasBusinessRevenueHistory: false, prioritizesTravelRewards: true });
    expect(result.affiliateId).toBeNull();
  });

  it("recommends Chase Ink when travel rewards are prioritized and revenue history exists", () => {
    const result = recommendCreditCard({ hasBusinessRevenueHistory: true, prioritizesTravelRewards: true });
    expect(result.affiliateId).toBe("chase-ink");
  });

  it("recommends Capital One Spark for flat cashback preference", () => {
    const result = recommendCreditCard({ hasBusinessRevenueHistory: true, prioritizesTravelRewards: false });
    expect(result.affiliateId).toBe("capital-one-spark");
  });
});
