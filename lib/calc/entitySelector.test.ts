import { describe, expect, it } from "vitest";
import { recommendEntity } from "./entitySelector";

const base = {
  owners: "one" as const,
  raisingOutsideMoney: false,
  wantsLiabilityProtection: true,
  estimatedAnnualProfit: 0,
};

describe("recommendEntity", () => {
  it("recommends C-corp when raising outside money, regardless of other answers", () => {
    const result = recommendEntity({ ...base, raisingOutsideMoney: true, owners: "multiple" });
    expect(result.id).toBe("c-corp");
  });

  it("recommends multi-member LLC for multiple owners below the S-corp profit threshold", () => {
    const result = recommendEntity({ ...base, owners: "multiple", estimatedAnnualProfit: 10000 });
    expect(result.id).toBe("multi-member-llc");
  });

  it("recommends multi-member LLC with S-corp election above the profit threshold", () => {
    const result = recommendEntity({ ...base, owners: "multiple", estimatedAnnualProfit: 60000 });
    expect(result.id).toBe("llc-s-corp-election");
  });

  it("recommends sole proprietorship when liability protection isn't wanted", () => {
    const result = recommendEntity({ ...base, wantsLiabilityProtection: false });
    expect(result.id).toBe("sole-proprietorship");
  });

  it("recommends single-member LLC for a solo founder wanting protection, below the S-corp threshold", () => {
    const result = recommendEntity({ ...base, estimatedAnnualProfit: 20000 });
    expect(result.id).toBe("single-member-llc");
  });

  it("recommends single-member LLC with S-corp election above the profit threshold", () => {
    const result = recommendEntity({ ...base, estimatedAnnualProfit: 45000 });
    expect(result.id).toBe("llc-s-corp-election");
  });
});
