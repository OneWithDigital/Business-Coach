export type EntityRecommendationId =
  | "sole-proprietorship"
  | "single-member-llc"
  | "multi-member-llc"
  | "llc-s-corp-election"
  | "c-corp";

export interface EntitySelectorInput {
  owners: "one" | "multiple";
  raisingOutsideMoney: boolean;
  wantsLiabilityProtection: boolean;
  /** Rough estimated annual net profit (after paying yourself), used only for the S-corp election threshold. */
  estimatedAnnualProfit: number;
}

export interface EntityRecommendation {
  id: EntityRecommendationId;
  name: string;
  reasoning: string[];
}

/**
 * The $40k figure is the commonly cited rule of thumb for when S-corp payroll
 * tax savings start outweighing the extra payroll/administrative cost — not a
 * legal threshold. It's a reason to run the numbers with a CPA, not a rule.
 */
const S_CORP_PROFIT_THRESHOLD = 40000;

export function recommendEntity(input: EntitySelectorInput): EntityRecommendation {
  const { owners, raisingOutsideMoney, wantsLiabilityProtection, estimatedAnnualProfit } = input;

  if (raisingOutsideMoney) {
    return {
      id: "c-corp",
      name: "C-corporation",
      reasoning: [
        "You said you're planning to raise money from outside investors. Venture and angel investors overwhelmingly expect a C-corp (usually Delaware) because of how preferred stock, option pools, and future funding rounds work.",
        "This is worth confirming with a startup-focused attorney before filing — the mechanics (stock classes, vesting, cap table) go beyond what a formation service alone should set up for you.",
      ],
    };
  }

  if (owners === "multiple") {
    const reasoning = [
      "Multiple owners need a formal operating agreement covering ownership percentages, profit splits, decision-making, and what happens if someone leaves — an LLC is the standard structure for this.",
    ];
    if (estimatedAnnualProfit >= S_CORP_PROFIT_THRESHOLD) {
      reasoning.push(
        `At your estimated profit level, ask a CPA about electing S-corp tax treatment for the LLC — above roughly $${S_CORP_PROFIT_THRESHOLD.toLocaleString()}/year in profit, the self-employment tax savings often outweigh the added payroll/admin cost, but run the actual numbers first.`
      );
      return { id: "llc-s-corp-election", name: "Multi-member LLC, consider S-corp election", reasoning };
    }
    return { id: "multi-member-llc", name: "Multi-member LLC", reasoning };
  }

  if (!wantsLiabilityProtection) {
    return {
      id: "sole-proprietorship",
      name: "Sole proprietorship",
      reasoning: [
        "You said liability protection isn't a priority right now. A sole proprietorship is the simplest and cheapest option — no separate filing, but your personal assets aren't shielded from business debts or lawsuits.",
        "You can always form an LLC later as the business grows — this isn't a permanent decision.",
      ],
    };
  }

  if (estimatedAnnualProfit >= S_CORP_PROFIT_THRESHOLD) {
    return {
      id: "llc-s-corp-election",
      name: "Single-member LLC, consider S-corp election",
      reasoning: [
        "A single-member LLC gives you the liability protection you're after with minimal extra paperwork.",
        `At your estimated profit level, ask a CPA about electing S-corp tax treatment — above roughly $${S_CORP_PROFIT_THRESHOLD.toLocaleString()}/year in profit, the self-employment tax savings often outweigh the added payroll/admin cost, but run the actual numbers first, since S-corp status adds payroll and filing requirements.`,
      ],
    };
  }

  return {
    id: "single-member-llc",
    name: "Single-member LLC",
    reasoning: [
      "A single-member LLC is the standard default for a solo founder who wants liability protection without corporate complexity — simple to form, flexible tax treatment, and you can elect S-corp status later once profit justifies it.",
    ],
  };
}
