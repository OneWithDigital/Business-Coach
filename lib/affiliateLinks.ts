import { prisma } from "./db";

export type AffiliateCategory =
  | "formation"
  | "registered-agent"
  | "banking"
  | "accounting"
  | "payroll"
  | "credit-card"
  | "insurance"
  | "website";

export interface AffiliateLink {
  id: string;
  name: string;
  category: AffiliateCategory;
  /** Neutral, factual description — no unverifiable promo claims (bonus amounts, "current" offers) baked in as static text, since those go stale and this file doesn't get reviewed on every deploy. */
  description: string;
  /** Name of the env var holding the real affiliate URL once you've signed up for that program. Intentionally NOT a hardcoded URL — see README. */
  envVar: string;
}

/**
 * No real URLs are hardcoded here — on purpose. This app doesn't fabricate
 * or guess affiliate links; it reads them from environment variables you
 * set once you've actually signed up for each program (Impact, CJ
 * Affiliate, PartnerStack, ShareASale, or the company's own direct
 * program — see each company's affiliate/partner page for how they
 * distribute links). Until an env var is set, the UI shows the option
 * without a live link rather than pointing somewhere unverified.
 *
 * Same reasoning applies to promotional details (sign-up bonuses, APY,
 * etc.): those change constantly and this file isn't something you'll
 * remember to update every time a bank changes its promo, so the
 * descriptions stick to what's structurally true about each product
 * rather than a dollar figure that will go stale.
 */
export const AFFILIATE_LINKS: AffiliateLink[] = [
  // Formation services
  {
    id: "legalzoom",
    name: "LegalZoom",
    category: "formation",
    description: "Online LLC/corporation formation filing service, with add-on registered agent and compliance packages.",
    envVar: "AFFILIATE_URL_LEGALZOOM",
  },
  {
    id: "zenbusiness",
    name: "ZenBusiness",
    category: "formation",
    description: "Online formation service with ongoing compliance and registered agent bundles.",
    envVar: "AFFILIATE_URL_ZENBUSINESS",
  },
  {
    id: "northwest-registered-agent",
    name: "Northwest Registered Agent",
    category: "registered-agent",
    description: "Formation filing and registered agent service, known for privacy-forward registered agent handling.",
    envVar: "AFFILIATE_URL_NORTHWEST",
  },
  {
    id: "incfile",
    name: "Incfile (now Bizee)",
    category: "formation",
    description: "Online LLC/corporation formation filing service.",
    envVar: "AFFILIATE_URL_INCFILE",
  },

  // Business banking
  {
    id: "mercury",
    name: "Mercury",
    category: "banking",
    description: "Online-first business banking built for startups; no physical branches, strong for companies raising venture funding.",
    envVar: "AFFILIATE_URL_MERCURY",
  },
  {
    id: "bluevine",
    name: "Bluevine",
    category: "banking",
    description: "Online business banking with interest-bearing checking and a line-of-credit product; strong for cash-flow-focused small businesses.",
    envVar: "AFFILIATE_URL_BLUEVINE",
  },
  {
    id: "novo",
    name: "Novo",
    category: "banking",
    description: "Online business banking aimed at freelancers and small business owners, with invoicing and bookkeeping integrations.",
    envVar: "AFFILIATE_URL_NOVO",
  },
  {
    id: "relay",
    name: "Relay",
    category: "banking",
    description: "Online business banking with multiple sub-accounts for envelope-style budgeting and team debit cards.",
    envVar: "AFFILIATE_URL_RELAY",
  },

  // Accounting / payroll
  {
    id: "quickbooks",
    name: "QuickBooks",
    category: "accounting",
    description: "The most widely used small business accounting software; strong ecosystem of bookkeepers/CPAs who already know it.",
    envVar: "AFFILIATE_URL_QUICKBOOKS",
  },
  {
    id: "xero",
    name: "Xero",
    category: "accounting",
    description: "Cloud accounting software, popular alternative to QuickBooks with a cleaner interface.",
    envVar: "AFFILIATE_URL_XERO",
  },
  {
    id: "wave",
    name: "Wave",
    category: "accounting",
    description: "Free accounting software for very early-stage/low-transaction-volume businesses, with paid payroll/payments add-ons.",
    envVar: "AFFILIATE_URL_WAVE",
  },
  {
    id: "gusto",
    name: "Gusto",
    category: "payroll",
    description: "Payroll, benefits, and HR software for small businesses with employees.",
    envVar: "AFFILIATE_URL_GUSTO",
  },

  // Credit cards
  {
    id: "chase-ink",
    name: "Chase Ink Business",
    category: "credit-card",
    description: "Revenue-based business credit card line from Chase, strong travel/cashback rewards categories.",
    envVar: "AFFILIATE_URL_CHASE_INK",
  },
  {
    id: "amex-business",
    name: "American Express Business",
    category: "credit-card",
    description: "Revenue-based business charge/credit cards from Amex, strong rewards and expense-management tools.",
    envVar: "AFFILIATE_URL_AMEX_BUSINESS",
  },
  {
    id: "capital-one-spark",
    name: "Capital One Spark",
    category: "credit-card",
    description: "Revenue-based business credit card line from Capital One, flat-rate cashback options.",
    envVar: "AFFILIATE_URL_CAPITAL_ONE_SPARK",
  },

  // Insurance
  {
    id: "next-insurance",
    name: "NEXT Insurance",
    category: "insurance",
    description: "Online small business insurance (general liability, professional liability, workers' comp) with instant quotes.",
    envVar: "AFFILIATE_URL_NEXT_INSURANCE",
  },
  {
    id: "simply-business",
    name: "Simply Business",
    category: "insurance",
    description: "Insurance marketplace comparing quotes from multiple carriers for small business coverage.",
    envVar: "AFFILIATE_URL_SIMPLY_BUSINESS",
  },
  {
    id: "thimble",
    name: "Thimble",
    category: "insurance",
    description: "On-demand business insurance, including short-term and by-the-job coverage.",
    envVar: "AFFILIATE_URL_THIMBLE",
  },
];

export function getAffiliateLink(id: string): AffiliateLink | undefined {
  return AFFILIATE_LINKS.find((l) => l.id === id);
}

export function getAffiliateUrl(link: AffiliateLink): string | null {
  const url = process.env[link.envVar];
  return url && url.trim() ? url.trim() : null;
}

/**
 * DB-aware resolution used by AffiliatePanel: an admin-set override (via
 * /admin, no redeploy needed) takes precedence over the AFFILIATE_URL_* env
 * var, which remains the fallback/seed value. Batches one query for all
 * requested links rather than one per link.
 */
export async function getAffiliateUrlsWithOverrides(links: AffiliateLink[]): Promise<Map<string, string | null>> {
  const overrides = await prisma.affiliateOverride.findMany({
    where: { id: { in: links.map((l) => l.id) } },
  });
  const overrideMap = new Map(overrides.map((o) => [o.id, o.url]));

  const result = new Map<string, string | null>();
  for (const link of links) {
    const override = overrideMap.get(link.id);
    result.set(link.id, override && override.trim() ? override.trim() : getAffiliateUrl(link));
  }
  return result;
}
