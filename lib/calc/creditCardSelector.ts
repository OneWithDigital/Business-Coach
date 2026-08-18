export interface CreditCardSelectorInput {
  hasBusinessRevenueHistory: boolean;
  prioritizesTravelRewards: boolean;
}

export interface CreditCardRecommendation {
  /** null means "cash-based startup card (e.g. Mercury/Brex)" — not one of our current affiliate options. */
  affiliateId: "chase-ink" | "amex-business" | "capital-one-spark" | null;
  name: string;
  reasoning: string[];
}

export function recommendCreditCard(input: CreditCardSelectorInput): CreditCardRecommendation {
  const { hasBusinessRevenueHistory, prioritizesTravelRewards } = input;

  if (!hasBusinessRevenueHistory) {
    return {
      affiliateId: null,
      name: "A cash-based startup card",
      reasoning: [
        "Without revenue history yet, look at startup cards that underwrite based on cash in the bank rather than personal credit or time in business (e.g. from online-first banks like Mercury) — the revenue-based cards below will be a harder approval right now.",
        "Come back to this once you have a few months of revenue.",
      ],
    };
  }

  if (prioritizesTravelRewards) {
    return {
      affiliateId: "chase-ink",
      name: "Chase Ink Business",
      reasoning: [
        "Chase Ink's rewards categories and transfer partners are generally the strongest option for travel-focused rewards among revenue-based business cards.",
        "American Express Business is a reasonable alternative worth comparing directly if you value Amex's expense-management tools.",
      ],
    };
  }

  return {
    affiliateId: "capital-one-spark",
    name: "Capital One Spark",
    reasoning: [
      "For straightforward flat-rate cashback without optimizing bonus categories or travel transfer partners, Capital One Spark's flat-rate cashback is the simplest fit.",
    ],
  };
}
