"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateBreakEven } from "@/lib/calc/breakEven";
import { INDUSTRY_PRESETS, getIndustryPreset, type CostLineItem } from "@/lib/industryPresets";
import { useBusinessPlanInput } from "@/lib/useBusinessPlanInput";

interface LineItem {
  id: string;
  label: string;
  amount: string;
}

function newItem(): LineItem {
  return { id: crypto.randomUUID(), label: "", amount: "" };
}

function toLineItems(items: CostLineItem[]): LineItem[] {
  return items.map((i) => ({ id: crypto.randomUUID(), label: i.label, amount: String(i.amount) }));
}

function sum(items: LineItem[]): number {
  return items.reduce((total, item) => total + (parseFloat(item.amount) || 0), 0);
}

function LineItemsEditor({
  items,
  onChange,
  addLabel,
}: {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
  addLabel: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Equipment"
            value={item.label}
            onChange={(e) => onChange(items.map((i) => (i.id === item.id ? { ...i, label: e.target.value } : i)))}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="$"
            value={item.amount}
            onChange={(e) => onChange(items.map((i) => (i.id === item.id ? { ...i, amount: e.target.value } : i)))}
            className="w-28 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((i) => i.id !== item.id))}
            className="text-slate-400 hover:text-red-600 text-sm px-1"
            aria-label="Remove"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, newItem()])}
        className="text-xs font-medium text-slate-600 hover:text-slate-900"
      >
        + {addLabel}
      </button>
    </div>
  );
}

export function StartupCostsCalculator() {
  const [presetId, setPresetId] = useState("");
  const [unitLabel, setUnitLabel] = useState("unit/job");
  const [startupItems, setStartupItems] = useState<LineItem[]>([newItem()]);
  const [monthlyItems, setMonthlyItems] = useState<LineItem[]>([newItem()]);
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [variableCostPerUnit, setVariableCostPerUnit] = useState("");
  const [expectedMonthlyUnits, setExpectedMonthlyUnits] = useState("");

  function applyPreset(id: string) {
    setPresetId(id);
    const preset = getIndustryPreset(id);
    if (!preset) return;
    setUnitLabel(preset.unitLabel);
    setStartupItems(toLineItems(preset.startupItems));
    setMonthlyItems(toLineItems(preset.monthlyItems));
    setPricePerUnit(String(preset.pricePerUnit));
    setVariableCostPerUnit(String(preset.variableCostPerUnit));
    setExpectedMonthlyUnits(String(preset.expectedMonthlyUnits));
  }

  const startupCosts = sum(startupItems);
  const monthlyFixedCosts = sum(monthlyItems);

  const { updateField } = useBusinessPlanInput();

  // Feeds these numbers into the business plan automatically — this tool is
  // the only place they're entered, so there's no separate "save to your
  // business plan" step. Guests get a no-op save (see useBusinessPlanInput),
  // so this is harmless when logged out.
  useEffect(() => {
    updateField("startupCosts", startupCosts > 0 ? startupCosts : null);
    updateField("monthlyCosts", monthlyFixedCosts > 0 ? monthlyFixedCosts : null);
    updateField("pricePerUnit", pricePerUnit ? parseFloat(pricePerUnit) : null);
    updateField("variableCostPerUnit", variableCostPerUnit ? parseFloat(variableCostPerUnit) : null);
    updateField("expectedMonthlyUnits", expectedMonthlyUnits ? parseFloat(expectedMonthlyUnits) : null);
    updateField("unitLabel", unitLabel !== "unit/job" ? unitLabel : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startupCosts, monthlyFixedCosts, pricePerUnit, variableCostPerUnit, expectedMonthlyUnits, unitLabel]);

  const result = useMemo(
    () =>
      calculateBreakEven({
        startupCosts,
        monthlyFixedCosts,
        pricePerUnit: parseFloat(pricePerUnit) || 0,
        variableCostPerUnit: parseFloat(variableCostPerUnit) || 0,
        expectedMonthlyUnits: expectedMonthlyUnits ? parseFloat(expectedMonthlyUnits) || 0 : undefined,
      }),
    [startupCosts, monthlyFixedCosts, pricePerUnit, variableCostPerUnit, expectedMonthlyUnits]
  );

  const fmt = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">Startup costs &amp; break-even</h3>
        <p className="mt-1 text-xs text-slate-500">
          Never priced this out before? Pick a similar business below to load example numbers, then edit every
          field to match your actual situation — these are realistic starting points, not predictions.
        </p>
        <select
          value={presetId}
          onChange={(e) => applyPreset(e.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
        >
          <option value="">Start from scratch (no example)</option>
          {INDUSTRY_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">One-time startup costs</p>
        <LineItemsEditor items={startupItems} onChange={setStartupItems} addLabel="Add cost" />
        <p className="mt-1 text-xs text-slate-500">Total: {fmt(startupCosts)}</p>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">Recurring monthly costs</p>
        <LineItemsEditor items={monthlyItems} onChange={setMonthlyItems} addLabel="Add cost" />
        <p className="mt-1 text-xs text-slate-500">Total: {fmt(monthlyFixedCosts)}/month</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="text-sm">
          <span className="block text-xs font-medium text-slate-500 mb-1">Price per {unitLabel}</span>
          <input
            type="number"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5"
          />
        </label>
        <label className="text-sm">
          <span className="block text-xs font-medium text-slate-500 mb-1">Variable cost per {unitLabel}</span>
          <input
            type="number"
            value={variableCostPerUnit}
            onChange={(e) => setVariableCostPerUnit(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5"
          />
        </label>
        <label className="text-sm">
          <span className="block text-xs font-medium text-slate-500 mb-1">Expected {unitLabel}s/month (optional)</span>
          <input
            type="number"
            value={expectedMonthlyUnits}
            onChange={(e) => setExpectedMonthlyUnits(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5"
          />
        </label>
      </div>

      <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm space-y-1">
        {result.contributionMargin <= 0 ? (
          <p className="text-amber-700">
            Your variable cost per unit is at or above your price — this can never break even until that changes.
          </p>
        ) : (
          <>
            <p>
              Contribution margin: <strong>{fmt(result.contributionMargin)}</strong> per unit
              {result.contributionMarginRatio !== null && ` (${Math.round(result.contributionMarginRatio * 100)}%)`}
            </p>
            {result.breakEvenUnitsPerMonth !== null && (
              <p>
                Break-even: <strong>{Math.ceil(result.breakEvenUnitsPerMonth)} units/month</strong> (
                {fmt(result.breakEvenRevenuePerMonth ?? 0)} revenue) just to cover monthly costs.
              </p>
            )}
            {result.monthsToRecoverStartupCosts !== null && (
              <p>
                At your expected volume, startup costs are recovered in about{" "}
                <strong>{result.monthsToRecoverStartupCosts.toFixed(1)} months</strong>.
              </p>
            )}
            {expectedMonthlyUnits && result.monthlyProfitAtExpectedVolume !== null && result.monthlyProfitAtExpectedVolume <= 0 && (
              <p className="text-amber-700">
                At your expected volume, you're not covering monthly costs yet — you'd need at least{" "}
                {result.breakEvenUnitsPerMonth !== null ? Math.ceil(result.breakEvenUnitsPerMonth) : "more"} units/month.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
