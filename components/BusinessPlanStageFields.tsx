import { fieldsForStage } from "@/lib/businessPlanFields";
import { BusinessPlanField } from "./BusinessPlanField";
import { BusinessPlanFundingFields } from "./BusinessPlanFundingFields";

/**
 * Renders whichever business-plan questionnaire fields belong on this
 * stage, per lib/businessPlanFields.ts. Returns null for stages that don't
 * collect anything (most of them) — cheap to include everywhere.
 */
export function BusinessPlanStageFields({ stageSlug }: { stageSlug: string }) {
  // fundingUse is rendered by BusinessPlanFundingFields below, alongside
  // fundingNeeded/fundingAmount which aren't in this generic list at all —
  // exclude it here to avoid rendering it twice.
  const fields = fieldsForStage(stageSlug).filter((f) => f.field !== "fundingUse");
  const showFunding = stageSlug === "business-plan";

  if (fields.length === 0 && !showFunding) return null;

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">For your business plan</p>
      {fields.map((meta) => (
        <BusinessPlanField key={meta.field} meta={meta} />
      ))}
      {showFunding && <BusinessPlanFundingFields />}
    </div>
  );
}
