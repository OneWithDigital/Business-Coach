export interface ChecklistItem {
  text: string;
  detail?: string;
}

export interface Callout {
  tone: "info" | "warning" | "success" | "trust";
  text: string;
}

export interface ContentBlock {
  heading: string;
  paragraphs: string[];
  checklist?: ChecklistItem[];
  callout?: Callout;
}

export type ToolId =
  | "idea-validation-checklist"
  | "entity-selector"
  | "startup-costs-worksheet"
  | "break-even-calculator"
  | "bank-comparison"
  | "credit-card-comparison";

export type MonetizationType = "none" | "upsell" | "affiliate" | "referral";

export interface Stage {
  id: number; // 0-10
  slug: string;
  title: string;
  tagline: string;
  monetization: MonetizationType;
  /** Shown transparently to the user — matches the "tell them when there's no money in it for us" trust-building approach. */
  monetizationNote: string;
  content: ContentBlock[];
  affiliateLinkIds?: string[];
  tool?: ToolId;
}
