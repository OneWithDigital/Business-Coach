export interface BankSelectorInput {
  handlesCashDeposits: boolean;
  wantsBranchAccess: boolean;
  planningToRaiseOutsideMoney: boolean;
  wantsSubAccounts: boolean;
  wantsInterestBearingChecking: boolean;
  /** Explicit preference for member-owned/relationship banking over a big traditional bank. */
  prefersCreditUnion: boolean;
}

export interface BankRecommendation {
  /** null means "traditional bank" or "credit union" — deliberately not one of our affiliate options. */
  affiliateId: "mercury" | "bluevine" | "novo" | "relay" | null;
  name: string;
  reasoning: string[];
}

export function recommendBank(input: BankSelectorInput): BankRecommendation {
  const {
    handlesCashDeposits,
    wantsBranchAccess,
    planningToRaiseOutsideMoney,
    wantsSubAccounts,
    wantsInterestBearingChecking,
    prefersCreditUnion,
  } = input;

  if (prefersCreditUnion) {
    return {
      affiliateId: null,
      name: "A local credit union",
      reasoning: [
        "Credit unions are member-owned rather than shareholder-owned, which often means lower fees and better rates than a big bank — and they can accept cash deposits and offer branch access just like a traditional bank.",
        "The tradeoff: fewer branches/ATMs nationally than a major bank, and you may need to meet a membership requirement (living/working in a service area, or a small one-time membership deposit).",
        "Worth knowing for a startup specifically: credit unions are often more willing to have an actual relationship-based conversation about small business lending than a large bank's standardized underwriting — useful once you're past the \"needs 2+ years of business history\" stage most lenders default to.",
      ],
    };
  }

  if (handlesCashDeposits || wantsBranchAccess) {
    return {
      affiliateId: null,
      name: "A traditional bank",
      reasoning: [
        handlesCashDeposits
          ? "Online-first business banks generally can't accept meaningful cash deposits — that alone rules them out if cash is a regular part of your business."
          : "You want branch access, which the online-first banks below don't offer.",
        "A traditional bank is the straightforward fit here, and also gives you a single relationship for an eventual SBA loan. If lower fees and a more personal relationship matter more to you than brand recognition, a local credit union covers the same cash/branch needs — worth comparing both.",
      ],
    };
  }

  if (planningToRaiseOutsideMoney) {
    return {
      affiliateId: "mercury",
      name: "Mercury",
      reasoning: [
        "Mercury is built specifically for startups raising outside money — it's the most commonly used online bank among VC-backed companies, which matters for investor familiarity and integrations (cap table tools, SAFEs, etc.).",
      ],
    };
  }

  if (wantsSubAccounts) {
    return {
      affiliateId: "relay",
      name: "Relay",
      reasoning: [
        "Relay's multiple sub-accounts are built for envelope-style budgeting (separating taxes, payroll, profit) and giving team members their own debit cards without a shared login.",
      ],
    };
  }

  if (wantsInterestBearingChecking) {
    return {
      affiliateId: "bluevine",
      name: "Bluevine",
      reasoning: [
        "Bluevine's checking account pays interest on your balance, plus offers a line of credit if you ever need short-term cash flow support.",
      ],
    };
  }

  return {
    affiliateId: "novo",
    name: "Novo",
    reasoning: [
      "For straightforward day-to-day business banking without cash deposits, branch needs, fundraising, or sub-account requirements, Novo is a simple, low-fee default aimed at freelancers and small businesses.",
    ],
  };
}
