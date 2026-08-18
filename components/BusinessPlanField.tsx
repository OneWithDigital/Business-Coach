"use client";

import { useState } from "react";
import { useBusinessPlanInput } from "@/lib/useBusinessPlanInput";
import type { BusinessPlanFieldMeta } from "@/lib/businessPlanFields";

/**
 * A single business-plan questionnaire field, rendered inline on the stage
 * that already covers its topic. Reads/writes the shared
 * BusinessPlanInputProvider context, so it stays in sync with every other
 * instance of this component and with the /business-plan review page.
 * Only ever rendered inside the signed-in app zone (see
 * app/(app)/layout.tsx), so it can assume an authenticated session.
 */
export function BusinessPlanField({ meta }: { meta: BusinessPlanFieldMeta }) {
  const { input, updateField } = useBusinessPlanInput();
  const [polishing, setPolishing] = useState(false);
  const [polishError, setPolishError] = useState<string | null>(null);

  const value = input[meta.field];
  const textValue = typeof value === "string" ? value : "";

  async function handlePolish() {
    if (!textValue.trim()) return;
    setPolishing(true);
    setPolishError(null);
    const res = await fetch("/api/business-plan/polish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field: meta.field, text: textValue }),
    });
    const data = await res.json().catch(() => null);
    setPolishing(false);
    if (!res.ok) {
      setPolishError(data?.error ?? "Couldn't polish this right now.");
      return;
    }
    if (typeof data?.polished === "string") {
      updateField(meta.field, data.polished as never);
    }
  }

  const inputClass = "w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-500">{meta.label}</span>
        {meta.polish && (
          <button
            type="button"
            onClick={handlePolish}
            disabled={polishing || !textValue.trim()}
            className="shrink-0 text-xs font-medium text-emerald-700 hover:text-emerald-800 disabled:opacity-40"
          >
            {polishing ? "Polishing…" : "✨ Improve with AI"}
          </button>
        )}
      </div>
      {meta.kind === "textarea" ? (
        <textarea
          value={textValue}
          onChange={(e) => updateField(meta.field, e.target.value as never)}
          placeholder={meta.placeholder}
          rows={3}
          className={inputClass}
        />
      ) : (
        <input
          type="text"
          value={textValue}
          onChange={(e) => updateField(meta.field, e.target.value as never)}
          placeholder={meta.placeholder}
          className={inputClass}
        />
      )}
      {polishError && <p className="text-xs text-rose-600">{polishError}</p>}
    </div>
  );
}
