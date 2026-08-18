import type { ToolId } from "@/lib/types";
import { IdeaValidationWorksheet } from "./IdeaValidationWorksheet";
import { StartupCostsCalculator } from "./StartupCostsCalculator";
import { EntitySelectorTool } from "./EntitySelectorTool";
import { BankComparisonTool } from "./BankComparisonTool";
import { CreditCardComparisonTool } from "./CreditCardComparisonTool";
import { StateRegistrationLink } from "./StateRegistrationLink";

function StateRegistrationLinkForCompliance() {
  return (
    <StateRegistrationLink
      title="Find your state's business registration portal"
      helpText="Many states' one-stop business portal is also where sales tax/seller's permit registration happens — worth checking here before searching separately."
    />
  );
}

/** break-even-calculator is intentionally folded into the startup-costs-worksheet tool — see that component. */
const TOOL_COMPONENTS: Record<ToolId, () => React.JSX.Element> = {
  "idea-validation-checklist": IdeaValidationWorksheet,
  "startup-costs-worksheet": StartupCostsCalculator,
  "break-even-calculator": StartupCostsCalculator,
  "entity-selector": EntitySelectorTool,
  "bank-comparison": BankComparisonTool,
  "credit-card-comparison": CreditCardComparisonTool,
  "state-registration": StateRegistrationLinkForCompliance,
};

export function ToolRenderer({ tool }: { tool: ToolId }) {
  const Component = TOOL_COMPONENTS[tool];
  return <Component />;
}
