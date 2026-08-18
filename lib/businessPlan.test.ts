import { describe, expect, it } from "vitest";
import {
  buildBusinessPlanPrompt,
  isBusinessPlanInputComplete,
  isBusinessPlanReady,
  parseBusinessPlanResponse,
  type BusinessPlanInputData,
} from "./businessPlan";

const completeInput: BusinessPlanInputData = {
  businessName: "Riverside Cleaning Co",
  onePagerPitch: "Residential cleaning for busy families.",
  targetCustomer: "Working parents in mid-size cities.",
  problemSolved: "No time to deep clean.",
  revenueModel: "Recurring biweekly visits, flat rate per visit.",
  competitiveEdge: "Faster booking than competitors.",
  startupCosts: 1750,
  monthlyCosts: 330,
  pricePerUnit: 120,
  variableCostPerUnit: 15,
  expectedMonthlyUnits: 40,
  unitLabel: "cleaning job",
  marketingPlan: "Local Facebook ads and referral program.",
  fundingNeeded: false,
  fundingAmount: null,
  fundingUse: null,
  milestones: "10 recurring clients by month 6.",
};

const profile = { entityType: "Single-member LLC", state: "Texas", formationDate: new Date(2026, 0, 15) };

describe("isBusinessPlanInputComplete", () => {
  it("returns true when all required fields are filled and funding isn't needed", () => {
    expect(isBusinessPlanInputComplete(completeInput)).toBe(true);
  });

  it("returns false when a required string field is missing", () => {
    expect(isBusinessPlanInputComplete({ ...completeInput, businessName: null })).toBe(false);
  });

  it("returns false when a required string field is blank/whitespace", () => {
    expect(isBusinessPlanInputComplete({ ...completeInput, targetCustomer: "   " })).toBe(false);
  });

  it("returns false when a required number field is missing", () => {
    expect(isBusinessPlanInputComplete({ ...completeInput, startupCosts: null })).toBe(false);
  });

  it("requires fundingAmount and fundingUse when fundingNeeded is true", () => {
    const withFunding = { ...completeInput, fundingNeeded: true };
    expect(isBusinessPlanInputComplete(withFunding)).toBe(false);
    expect(
      isBusinessPlanInputComplete({ ...withFunding, fundingAmount: 20000, fundingUse: "Equipment" })
    ).toBe(true);
  });
});

describe("isBusinessPlanReady", () => {
  it("requires all stages complete even if the questionnaire is done", () => {
    const ready = isBusinessPlanReady({ input: completeInput, completedStageCount: 10, totalStages: 11 });
    expect(ready).toBe(false);
  });

  it("requires the questionnaire complete even if all stages are done", () => {
    const ready = isBusinessPlanReady({
      input: { ...completeInput, businessName: null },
      completedStageCount: 11,
      totalStages: 11,
    });
    expect(ready).toBe(false);
  });

  it("is ready when both conditions are met", () => {
    const ready = isBusinessPlanReady({ input: completeInput, completedStageCount: 11, totalStages: 11 });
    expect(ready).toBe(true);
  });
});

describe("buildBusinessPlanPrompt", () => {
  it("includes the founder's key inputs and the entity/state from the profile", () => {
    const prompt = buildBusinessPlanPrompt(completeInput, profile);
    expect(prompt).toContain("Riverside Cleaning Co");
    expect(prompt).toContain("Single-member LLC");
    expect(prompt).toContain("Texas");
    expect(prompt).toContain("$120");
    expect(prompt).toContain("cleaning job");
  });

  it("computes and includes the contribution margin when price and variable cost are set", () => {
    const prompt = buildBusinessPlanPrompt(completeInput, profile);
    expect(prompt).toContain("Contribution margin per unit: $105");
  });

  it("handles missing profile fields gracefully", () => {
    const prompt = buildBusinessPlanPrompt(completeInput, { entityType: null, state: null, formationDate: null });
    expect(prompt).toContain("not yet chosen");
    expect(prompt).toContain("not yet formed");
  });

  it("asks for JSON-only output", () => {
    const prompt = buildBusinessPlanPrompt(completeInput, profile);
    expect(prompt).toContain('"sections"');
  });
});

describe("parseBusinessPlanResponse", () => {
  it("parses well-formed JSON", () => {
    const result = parseBusinessPlanResponse(
      '{"sections": [{"heading": "Executive Summary", "paragraphs": ["Test."]}]}'
    );
    expect(result.sections).toHaveLength(1);
    expect(result.sections[0]?.heading).toBe("Executive Summary");
  });

  it("strips a markdown code fence if the model adds one anyway", () => {
    const result = parseBusinessPlanResponse(
      '```json\n{"sections": [{"heading": "A", "paragraphs": ["B"]}]}\n```'
    );
    expect(result.sections[0]?.heading).toBe("A");
  });

  it("throws a descriptive error on invalid JSON", () => {
    expect(() => parseBusinessPlanResponse("not json")).toThrow(/parse/i);
  });

  it("throws a descriptive error when the shape doesn't match", () => {
    expect(() => parseBusinessPlanResponse('{"foo": "bar"}')).toThrow(/expected shape/i);
  });

  it("filters out non-string paragraph entries rather than throwing", () => {
    const result = parseBusinessPlanResponse(
      '{"sections": [{"heading": "A", "paragraphs": ["B", 5, "C"]}]}'
    );
    expect(result.sections[0]?.paragraphs).toEqual(["B", "C"]);
  });
});
