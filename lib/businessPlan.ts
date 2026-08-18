export interface BusinessPlanInputData {
  businessName: string | null;
  onePagerPitch: string | null;
  targetCustomer: string | null;
  problemSolved: string | null;
  revenueModel: string | null;
  competitiveEdge: string | null;
  startupCosts: number | null;
  monthlyCosts: number | null;
  pricePerUnit: number | null;
  variableCostPerUnit: number | null;
  expectedMonthlyUnits: number | null;
  unitLabel: string | null;
  marketingPlan: string | null;
  fundingNeeded: boolean;
  fundingAmount: number | null;
  fundingUse: string | null;
  milestones: string | null;
}

export const EMPTY_BUSINESS_PLAN_INPUT: BusinessPlanInputData = {
  businessName: null,
  onePagerPitch: null,
  targetCustomer: null,
  problemSolved: null,
  revenueModel: null,
  competitiveEdge: null,
  startupCosts: null,
  monthlyCosts: null,
  pricePerUnit: null,
  variableCostPerUnit: null,
  expectedMonthlyUnits: null,
  unitLabel: null,
  marketingPlan: null,
  fundingNeeded: false,
  fundingAmount: null,
  fundingUse: null,
  milestones: null,
};

export interface BusinessProfileData {
  entityType: string | null;
  state: string | null;
  formationDate: Date | null;
}

export interface BusinessPlanSection {
  heading: string;
  paragraphs: string[];
}

export interface GeneratedBusinessPlan {
  sections: BusinessPlanSection[];
}

/** Fields required before generation is allowed — everything else is optional context. */
const REQUIRED_STRING_FIELDS: (keyof BusinessPlanInputData)[] = [
  "businessName",
  "onePagerPitch",
  "targetCustomer",
  "problemSolved",
  "revenueModel",
  "marketingPlan",
  "unitLabel",
];

const REQUIRED_NUMBER_FIELDS: (keyof BusinessPlanInputData)[] = [
  "startupCosts",
  "monthlyCosts",
  "pricePerUnit",
  "variableCostPerUnit",
  "expectedMonthlyUnits",
];

export function isBusinessPlanInputComplete(input: BusinessPlanInputData): boolean {
  for (const field of REQUIRED_STRING_FIELDS) {
    const value = input[field];
    if (typeof value !== "string" || !value.trim()) return false;
  }
  for (const field of REQUIRED_NUMBER_FIELDS) {
    const value = input[field];
    if (typeof value !== "number" || Number.isNaN(value)) return false;
  }
  if (input.fundingNeeded) {
    if (typeof input.fundingAmount !== "number" || Number.isNaN(input.fundingAmount)) return false;
    if (!input.fundingUse || !input.fundingUse.trim()) return false;
  }
  return true;
}

export interface BusinessPlanReadinessInput {
  input: BusinessPlanInputData;
  completedStageCount: number;
  totalStages: number;
}

export function isBusinessPlanReady({ input, completedStageCount, totalStages }: BusinessPlanReadinessInput): boolean {
  return completedStageCount >= totalStages && isBusinessPlanInputComplete(input);
}

function formatMoney(n: number | null): string {
  if (n === null) return "not provided";
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

/**
 * Assembles the prompt sent to Claude. Pure and deterministic (no API call)
 * so it's directly unit-testable — the actual generation call lives in the
 * /api/business-plan/generate route.
 */
export function buildBusinessPlanPrompt(input: BusinessPlanInputData, profile: BusinessProfileData): string {
  const contributionMargin =
    input.pricePerUnit !== null && input.variableCostPerUnit !== null
      ? input.pricePerUnit - input.variableCostPerUnit
      : null;

  const lines: string[] = [
    `Business name: ${input.businessName ?? "not provided"}`,
    `One-line pitch: ${input.onePagerPitch ?? "not provided"}`,
    `Target customer: ${input.targetCustomer ?? "not provided"}`,
    `Problem being solved: ${input.problemSolved ?? "not provided"}`,
    `Revenue model / pricing rationale: ${input.revenueModel ?? "not provided"}`,
    `Competitive edge: ${input.competitiveEdge ?? "not stated"}`,
    `Entity type: ${profile.entityType ?? "not yet chosen"}`,
    `State of formation: ${profile.state ?? "not yet chosen"}`,
    `Formation date: ${profile.formationDate ? profile.formationDate.toDateString() : "not yet formed"}`,
    `Startup costs: ${formatMoney(input.startupCosts)}`,
    `Recurring monthly costs: ${formatMoney(input.monthlyCosts)}/month`,
    `Unit of sale: "${input.unitLabel ?? "unit"}"`,
    `Price per ${input.unitLabel ?? "unit"}: ${formatMoney(input.pricePerUnit)}`,
    `Variable cost per ${input.unitLabel ?? "unit"}: ${formatMoney(input.variableCostPerUnit)}`,
    contributionMargin !== null ? `Contribution margin per unit: ${formatMoney(contributionMargin)}` : null,
    `Expected volume: ${input.expectedMonthlyUnits ?? "not provided"} ${input.unitLabel ?? "units"}/month`,
    `Marketing plan: ${input.marketingPlan ?? "not provided"}`,
    input.fundingNeeded
      ? `Seeking funding: yes, ${formatMoney(input.fundingAmount)}, intended use: ${input.fundingUse ?? "not stated"}`
      : "Seeking funding: no",
    input.milestones ? `Year-one milestones: ${input.milestones}` : null,
  ].filter((line): line is string => line !== null);

  return [
    "You are an expert small-business consultant writing a lean, practical business plan for a first-time founder based on the information below. Write in plain, direct language a first-time founder can act on - no jargon, no filler, no generic advice that isn't grounded in the specifics given.",
    "",
    "FOUNDER'S INFORMATION:",
    ...lines,
    "",
    "Write a business plan with these sections: Executive Summary, Company Description, Target Market, Products & Services, Marketing & Sales Strategy, Organization & Management, Financial Plan (use the actual numbers given - break-even, margins, funding ask if any), and Milestones & Next Steps.",
    "",
    "Respond with ONLY a JSON object matching this exact shape, and nothing else - no markdown code fences, no explanation before or after:",
    '{"sections": [{"heading": "string", "paragraphs": ["string", "string"]}]}',
  ].join("\n");
}

/**
 * Parses Claude's response text into a GeneratedBusinessPlan, tolerating the
 * model wrapping the JSON in a markdown code fence despite being told not
 * to. Throws a descriptive error on anything else malformed, so the API
 * route can surface a clear "generation failed, try again" rather than a
 * silent bad render.
 */
export function parseBusinessPlanResponse(text: string): GeneratedBusinessPlan {
  const stripped = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripped);
  } catch {
    throw new Error("Could not parse the generated business plan as JSON.");
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !Array.isArray((parsed as Record<string, unknown>).sections)
  ) {
    throw new Error("Generated business plan JSON did not match the expected shape.");
  }

  const sections = (parsed as { sections: unknown[] }).sections.map((section, i) => {
    if (
      typeof section !== "object" ||
      section === null ||
      typeof (section as Record<string, unknown>).heading !== "string" ||
      !Array.isArray((section as Record<string, unknown>).paragraphs)
    ) {
      throw new Error(`Section ${i} of the generated business plan did not match the expected shape.`);
    }
    const { heading, paragraphs } = section as { heading: string; paragraphs: unknown[] };
    return {
      heading,
      paragraphs: paragraphs.filter((p): p is string => typeof p === "string"),
    };
  });

  return { sections };
}
