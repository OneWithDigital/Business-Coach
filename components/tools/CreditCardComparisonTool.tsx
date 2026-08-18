"use client";

import { useMemo, useState } from "react";
import { recommendCreditCard } from "@/lib/calc/creditCardSelector";

export function CreditCardComparisonTool() {
  const [hasBusinessRevenueHistory, setHasBusinessRevenueHistory] = useState(false);
  const [prioritizesTravelRewards, setPrioritizesTravelRewards] = useState(false);

  const result = useMemo(
    () => recommendCreditCard({ hasBusinessRevenueHistory, prioritizesTravelRewards }),
    [hasBusinessRevenueHistory, prioritizesTravelRewards]
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
      <h3 className="text-sm font-semibold text-slate-900">Credit card comparison</h3>
      <div className="space-y-2 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hasBusinessRevenueHistory}
            onChange={(e) => setHasBusinessRevenueHistory(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          <span>My business already has some revenue history</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={prioritizesTravelRewards}
            onChange={(e) => setPrioritizesTravelRewards(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          <span>Travel rewards matter more to me than flat cashback</span>
        </label>
      </div>
      <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm space-y-2">
        <p className="font-semibold text-slate-900">Suggested: {result.name}</p>
        <ul className="space-y-1 text-slate-600">
          {result.reasoning.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
