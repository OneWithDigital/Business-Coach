import type { ToolId } from "@/lib/types";
import { IdeaValidationWorksheet } from "./IdeaValidationWorksheet";
import { StartupCostsCalculator } from "./StartupCostsCalculator";
import { EntitySelectorTool } from "./EntitySelectorTool";
import { BankComparisonTool } from "./BankComparisonTool";
import { CreditCardComparisonTool } from "./CreditCardComparisonTool";

/** break-even-calculator is intentionally folded into the startup-costs-worksheet tool — see that component. */
const TOOL_COMPONENTS: Record<ToolId, () => React.JSX.Element> = {
  "idea-validation-checklist": IdeaValidationWorksheet,
  "startup-costs-worksheet": StartupCostsCalculator,
  "break-even-calculator": StartupCostsCalculator,
  "entity-selector": EntitySelectorTool,
  "bank-comparison": BankComparisonTool,
  "credit-card-comparison": CreditCardComparisonTool,
};

export function ToolRenderer({ tool }: { tool: ToolId }) {
  const Component = TOOL_COMPONENTS[tool];
  return <Component />;
}
