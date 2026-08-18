"use client";

import { useMemo, useState } from "react";
import { recommendEntity } from "@/lib/calc/entitySelector";
import { StateRegistrationLink } from "./StateRegistrationLink";

export function EntitySelectorTool() {
  const [owners, setOwners] = useState<"one" | "multiple">("one");
  const [raisingOutsideMoney, setRaisingOutsideMoney] = useState(false);
  const [wantsLiabilityProtection, setWantsLiabilityProtection] = useState(true);
  const [estimatedAnnualProfit, setEstimatedAnnualProfit] = useState("");

  const result = useMemo(
    () =>
      recommendEntity({
        owners,
        raisingOutsideMoney,
        wantsLiabilityProtection,
        estimatedAnnualProfit: parseFloat(estimatedAnnualProfit) || 0,
      }),
    [owners, raisingOutsideMoney, wantsLiabilityProtection, estimatedAnnualProfit]
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
      <h3 className="text-sm font-semibold text-slate-900">Entity selector</h3>

      <div className="space-y-3 text-sm">
        <label className="block">
          <span className="block text-xs font-medium text-slate-500 mb-1">Owners</span>
          <select
            value={owners}
            onChange={(e) => setOwners(e.target.value as "one" | "multiple")}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5"
          >
            <option value="one">Just me</option>
            <option value="multiple">Multiple owners</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={raisingOutsideMoney}
            onChange={(e) => setRaisingOutsideMoney(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          <span>Planning to raise money from investors (VC/angel)</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={wantsLiabilityProtection}
            onChange={(e) => setWantsLiabilityProtection(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          <span>Liability protection for my personal assets matters to me</span>
        </label>

        <label className="block">
          <span className="block text-xs font-medium text-slate-500 mb-1">Estimated annual profit (rough guess is fine)</span>
          <input
            type="number"
            value={estimatedAnnualProfit}
            onChange={(e) => setEstimatedAnnualProfit(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5"
          />
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

      {result.id === "sole-proprietorship" ? (
        <p className="text-xs text-slate-500">
          Sole proprietorships usually don&rsquo;t need to file anything with the state to exist — you may still
          need to register a DBA (&ldquo;doing business as&rdquo;) name if you operate under a name other than
          your own, which is typically a quick county or state filing.
        </p>
      ) : (
        <StateRegistrationLink
          title="Ready to register?"
          helpText="Formation services (below) will do this paperwork for you for a fee. You can also file directly with your state yourself, often for less — here's the direct link."
        />
      )}
    </div>
  );
}
