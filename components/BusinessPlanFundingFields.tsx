"use client";

import { useState } from "react";
import { useBusinessPlanInput } from "@/lib/useBusinessPlanInput";

/** Only ever rendered inside the signed-in app zone (see app/(app)/layout.tsx). */
export function BusinessPlanFundingFields() {
  const { input, updateField } = useBusinessPlanInput();
  const [polishing, setPolishing] = useState(false);

  async function polishUse() {
    if (!input.fundingUse?.trim()) return;
    setPolishing(true);
    const res = await fetch("/api/business-plan/polish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field: "fundingUse", text: input.fundingUse }),
    });
    const data = await res.json().catch(() => null);
    setPolishing(false);
    if (res.ok && typeof data?.polished === "string") {
      updateField("fundingUse", data.polished);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={input.fundingNeeded}
          onChange={(e) => updateField("fundingNeeded", e.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        <span>I'm seeking outside funding</span>
      </label>
      {input.fundingNeeded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="text-sm">
            <span className="block text-xs font-medium text-slate-500 mb-1">Funding amount ($)</span>
            <input
              type="number"
              value={input.fundingAmount ?? ""}
              onChange={(e) => updateField("fundingAmount", e.target.value === "" ? null : parseFloat(e.target.value))}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
            />
          </label>
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="block text-xs font-medium text-slate-500">What the funding will be used for</span>
              <button
                type="button"
                onClick={polishUse}
                disabled={polishing || !input.fundingUse?.trim()}
                className="shrink-0 text-xs font-medium text-emerald-700 hover:text-emerald-800 disabled:opacity-40"
              >
                {polishing ? "Polishing…" : "✨ Improve with AI"}
              </button>
            </div>
            <input
              type="text"
              value={input.fundingUse ?? ""}
              onChange={(e) => updateField("fundingUse", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
