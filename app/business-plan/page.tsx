"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useProgress } from "@/lib/useProgress";
import { STAGES } from "@/lib/stages";
import {
  isBusinessPlanInputComplete,
  isBusinessPlanReady,
  type BusinessPlanInputData,
  type GeneratedBusinessPlan,
} from "@/lib/businessPlan";

const EMPTY_INPUT: BusinessPlanInputData = {
  businessName: null,
  onePagerPitch: null,
  targetCustomer: null,
  problemSolved: null,
  revenueModel: null,
  competitiveEdge: null,
  startupCosts: null,
  monthlyCosts: null,
  pricePerUnit: null,
  variableCostPerUnit: null,
  expectedMonthlyUnits: null,
  unitLabel: null,
  marketingPlan: null,
  fundingNeeded: false,
  fundingAmount: null,
  fundingUse: null,
  milestones: null,
};

function TextField({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
}: {
  label: string;
  value: string | null;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const shared = "w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm";
  return (
    <label className="block text-sm">
      <span className="block text-xs font-medium text-slate-500 mb-1">{label}</span>
      {multiline ? (
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={shared}
        />
      ) : (
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={shared}
        />
      )}
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="block text-xs font-medium text-slate-500 mb-1">{label}</span>
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
        className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
      />
    </label>
  );
}

export default function BusinessPlanPage() {
  const { status } = useSession();
  const router = useRouter();
  const { completed, hydrated: progressHydrated } = useProgress();

  const [input, setInput] = useState<BusinessPlanInputData>(EMPTY_INPUT);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [plan, setPlan] = useState<GeneratedBusinessPlan | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/business-plan");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/business-plan/input").then((r) => r.json()),
      fetch("/api/business-plan/document").then((r) => r.json()),
    ])
      .then(([inputData, docData]) => {
        setInput({ ...EMPTY_INPUT, ...inputData });
        if (docData?.document) {
          setPlan(docData.document.content);
          setGeneratedAt(docData.document.generatedAt);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [status]);

  const stagesComplete = completed.length;
  const allStagesComplete = stagesComplete >= STAGES.length;
  const questionnaireComplete = isBusinessPlanInputComplete(input);
  const ready = isBusinessPlanReady({ input, completedStageCount: stagesComplete, totalStages: STAGES.length });

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/business-plan/input", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json().catch(() => null);
    if (data) setInput({ ...EMPTY_INPUT, ...data });
    setSaving(false);
    setSaved(true);
  }

  async function handleGenerate() {
    setGenerating(true);
    setGenerateError(null);
    const res = await fetch("/api/business-plan/generate", { method: "POST" });
    const data = await res.json().catch(() => null);
    setGenerating(false);
    if (!res.ok) {
      setGenerateError(data?.error ?? "Something went wrong generating your business plan.");
      return;
    }
    if (data?.document) {
      setPlan(data.document.content);
      setGeneratedAt(data.document.generatedAt);
    }
  }

  function updateField<K extends keyof BusinessPlanInputData>(key: K, value: BusinessPlanInputData[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  if (status !== "authenticated" || !loaded || !progressHydrated) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  return (
    <div className="space-y-8">
      <div className="print:hidden">
        <h1 className="text-2xl font-bold text-slate-900">Business Plan</h1>
        <p className="mt-1 text-sm text-slate-600">
          Fill in the questions below, finish all 11 stages, then generate a professional business plan built from
          everything you've entered — print it or save it as a PDF.
        </p>
      </div>

      <div className="print:hidden rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
        <p className={allStagesComplete ? "text-emerald-700" : "text-slate-600"}>
          Stages complete: <strong>{stagesComplete}/{STAGES.length}</strong>
          {!allStagesComplete && " — finish the rest of the guide to unlock generation."}
        </p>
        <p className={questionnaireComplete ? "text-emerald-700" : "text-slate-600"}>
          Questionnaire: <strong>{questionnaireComplete ? "complete" : "incomplete"}</strong>
          {!questionnaireComplete && " — fill in the required fields below."}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="print:hidden rounded-xl border border-slate-200 bg-white p-4 space-y-4"
      >
        <h2 className="text-sm font-semibold text-slate-900">Tell us about your business</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Business name *" value={input.businessName} onChange={(v) => updateField("businessName", v)} />
          <TextField label={'Unit of sale (e.g. "cleaning job") *'} value={input.unitLabel} onChange={(v) => updateField("unitLabel", v)} />
        </div>
        <TextField
          label="One-line pitch — what do you do? *"
          value={input.onePagerPitch}
          onChange={(v) => updateField("onePagerPitch", v)}
        />
        <TextField
          label="Target customer — who exactly pays? *"
          value={input.targetCustomer}
          onChange={(v) => updateField("targetCustomer", v)}
          multiline
        />
        <TextField
          label="Problem being solved *"
          value={input.problemSolved}
          onChange={(v) => updateField("problemSolved", v)}
          multiline
        />
        <TextField
          label="Revenue model & pricing rationale *"
          value={input.revenueModel}
          onChange={(v) => updateField("revenueModel", v)}
          multiline
        />
        <TextField
          label="Competitive edge (optional)"
          value={input.competitiveEdge}
          onChange={(v) => updateField("competitiveEdge", v)}
          multiline
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberField label="Startup costs ($) *" value={input.startupCosts} onChange={(v) => updateField("startupCosts", v)} />
          <NumberField label="Monthly costs ($) *" value={input.monthlyCosts} onChange={(v) => updateField("monthlyCosts", v)} />
          <NumberField label="Expected units/month *" value={input.expectedMonthlyUnits} onChange={(v) => updateField("expectedMonthlyUnits", v)} />
          <NumberField label="Price per unit ($) *" value={input.pricePerUnit} onChange={(v) => updateField("pricePerUnit", v)} />
          <NumberField label="Variable cost per unit ($) *" value={input.variableCostPerUnit} onChange={(v) => updateField("variableCostPerUnit", v)} />
        </div>

        <TextField
          label="Marketing plan — how will people find you? *"
          value={input.marketingPlan}
          onChange={(v) => updateField("marketingPlan", v)}
          multiline
        />

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
            <NumberField label="Funding amount ($) *" value={input.fundingAmount} onChange={(v) => updateField("fundingAmount", v)} />
            <TextField label="What the funding will be used for *" value={input.fundingUse} onChange={(v) => updateField("fundingUse", v)} />
          </div>
        )}

        <TextField
          label="Year-one milestones (optional)"
          value={input.milestones}
          onChange={(v) => updateField("milestones", v)}
          multiline
        />

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {saved && <span className="text-xs text-emerald-700">Saved.</span>}
        </div>
      </form>

      <div className="print:hidden flex items-center gap-3">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!ready || generating}
          className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {generating ? "Generating…" : plan ? "Regenerate my business plan" : "Generate my business plan"}
        </button>
        {plan && (
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Print / Save as PDF
          </button>
        )}
      </div>
      {generateError && <p className="print:hidden text-sm text-rose-600">{generateError}</p>}

      {plan && (
        <div className="print-plan rounded-xl border border-slate-200 bg-white p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{input.businessName || "Business Plan"}</h1>
            {generatedAt && (
              <p className="mt-1 text-xs text-slate-400">
                Generated {new Date(generatedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
              </p>
            )}
          </div>
          {plan.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-lg font-bold text-slate-900 mb-2">{section.heading}</h2>
              <div className="space-y-2">
                {section.paragraphs.map((p, j) => (
                  <p key={j} className="text-sm text-slate-700 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
