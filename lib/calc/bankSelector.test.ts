import { describe, expect, it } from "vitest";
import { recommendBank } from "./bankSelector";

const base = {
  handlesCashDeposits: false,
  wantsBranchAccess: false,
  planningToRaiseOutsideMoney: false,
  wantsSubAccounts: false,
  wantsInterestBearingChecking: false,
};

describe("recommendBank", () => {
  it("recommends a traditional bank when the business handles cash deposits", () => {
    const result = recommendBank({ ...base, handlesCashDeposits: true });
    expect(result.affiliateId).toBeNull();
  });

  it("recommends a traditional bank when branch access is wanted", () => {
    const result = recommendBank({ ...base, wantsBranchAccess: true });
    expect(result.affiliateId).toBeNull();
  });

  it("recommends Mercury when raising outside money and no cash/branch need", () => {
    const result = recommendBank({ ...base, planningToRaiseOutsideMoney: true });
    expect(result.affiliateId).toBe("mercury");
  });

  it("recommends Relay when sub-accounts matter", () => {
    const result = recommendBank({ ...base, wantsSubAccounts: true });
    expect(result.affiliateId).toBe("relay");
  });

  it("recommends Bluevine when interest-bearing checking matters", () => {
    const result = recommendBank({ ...base, wantsInterestBearingChecking: true });
    expect(result.affiliateId).toBe("bluevine");
  });

  it("recommends Novo as the simple default", () => {
    const result = recommendBank(base);
    expect(result.affiliateId).toBe("novo");
  });

  it("prioritizes cash/branch needs over fundraising plans", () => {
    const result = recommendBank({ ...base, handlesCashDeposits: true, planningToRaiseOutsideMoney: true });
    expect(result.affiliateId).toBeNull();
  });
});
