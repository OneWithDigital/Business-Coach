import type { BusinessPlanInputData } from "./businessPlan";

export type BusinessPlanFieldKind = "text" | "textarea" | "number";

export interface BusinessPlanFieldMeta {
  field: keyof BusinessPlanInputData;
  label: string;
  stageSlug: string;
  kind: BusinessPlanFieldKind;
  /** Narrative fields only — never on names, numbers, or the unit label. */
  polish: boolean;
  /** Whether this field is required before the business plan can be generated (see isBusinessPlanInputComplete). */
  required: boolean;
  placeholder?: string;
}

/**
 * Single source of truth for where each business-plan input is collected —
 * inline on the stage that already covers that topic, not in a separate
 * questionnaire. Used both to render the right BusinessPlanField instances
 * per stage (BusinessPlanStageFields) and to build the "what's still
 * missing, and where" list on the /business-plan review page.
 *
 * The five calculator-driven number fields (startupCosts, monthlyCosts,
 * pricePerUnit, variableCostPerUnit, expectedMonthlyUnits) plus unitLabel
 * aren't listed here — they're captured automatically by the startup-costs
 * calculator tool on the business-plan stage, not typed in separately.
 * fundingAmount/fundingUse are handled directly in Stage 1's content
 * (conditional on the fundingNeeded checkbox), not through this list.
 */
export const BUSINESS_PLAN_FIELDS: BusinessPlanFieldMeta[] = [
  {
    field: "targetCustomer",
    label: "Who is your target customer?",
    stageSlug: "idea-validation",
    kind: "textarea",
    polish: true,
    required: true,
    placeholder: "Be specific enough that you could go find 10 of these people this week.",
  },
  {
    field: "problemSolved",
    label: "What problem are you solving for them?",
    stageSlug: "idea-validation",
    kind: "textarea",
    polish: true,
    required: true,
  },
  {
    field: "competitiveEdge",
    label: "Why would someone choose you over the alternatives?",
    stageSlug: "idea-validation",
    kind: "textarea",
    polish: true,
    required: false,
  },
  {
    field: "businessName",
    label: "Business name",
    stageSlug: "business-plan",
    kind: "text",
    polish: false,
    required: true,
  },
  {
    field: "onePagerPitch",
    label: "One-line pitch — what do you do?",
    stageSlug: "business-plan",
    kind: "textarea",
    polish: true,
    required: true,
  },
  {
    field: "revenueModel",
    label: "Revenue model & pricing rationale",
    stageSlug: "business-plan",
    kind: "textarea",
    polish: true,
    required: true,
  },
  {
    field: "fundingUse",
    label: "What the funding will be used for",
    stageSlug: "business-plan",
    kind: "text",
    polish: true,
    required: false,
  },
  {
    field: "marketingPlan",
    label: "Marketing plan — how will people find you?",
    stageSlug: "brand-website-marketing",
    kind: "textarea",
    polish: true,
    required: true,
  },
  {
    field: "milestones",
    label: "Year-one milestones",
    stageSlug: "ongoing-compliance-growth",
    kind: "textarea",
    polish: true,
    required: false,
  },
];

export function fieldsForStage(stageSlug: string): BusinessPlanFieldMeta[] {
  return BUSINESS_PLAN_FIELDS.filter((f) => f.stageSlug === stageSlug);
}

/** Calculator-driven fields, tracked here only for the review page's "collected on this stage" links. */
export const CALCULATOR_FIELD_STAGE_SLUG = "business-plan";

export const CALCULATOR_FIELDS: { field: keyof BusinessPlanInputData; label: string }[] = [
  { field: "startupCosts", label: "Startup costs" },
  { field: "monthlyCosts", label: "Monthly costs" },
  { field: "pricePerUnit", label: "Price per unit" },
  { field: "variableCostPerUnit", label: "Variable cost per unit" },
  { field: "expectedMonthlyUnits", label: "Expected units/month" },
];
