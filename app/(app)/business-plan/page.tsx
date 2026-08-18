"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import { useBusinessPlanInput } from "@/lib/useBusinessPlanInput";
import { STAGES, getStageBySlug } from "@/lib/stages";
import { BUSINESS_PLAN_FIELDS, CALCULATOR_FIELDS } from "@/lib/businessPlanFields";
import { isBusinessPlanReady, type GeneratedBusinessPlan } from "@/lib/businessPlan";

interface StatusItem {
  label: string;
  stageSlug: string;
  done: boolean;
}

export default function BusinessPlanPage() {
  const { status } = useSession();
  const { completed, hydrated: progressHydrated } = useProgress();
  const { input, hydrated: inputHydrated } = useBusinessPlanInput();

  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [plan, setPlan] = useState<GeneratedBusinessPlan | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [docLoaded, setDocLoaded] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/business-plan/document")
      .then((r) => r.json())
      .then((data) => {
        if (data?.document) {
          setPlan(data.document.content);
          setGeneratedAt(data.document.generatedAt);
        }
        setDocLoaded(true);
      })
      .catch(() => setDocLoaded(true));
  }, [status]);

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

  if (status !== "authenticated" || !progressHydrated || !inputHydrated || !docLoaded) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  const stagesComplete = completed.length;
  const allStagesComplete = stagesComplete >= STAGES.length;

  const statusItems: StatusItem[] = [
    ...BUSINESS_PLAN_FIELDS.filter((f) => f.required).map((f) => ({
      label: f.label,
      stageSlug: f.stageSlug,
      done: typeof input[f.field] === "string" && (input[f.field] as string).trim().length > 0,
    })),
    ...CALCULATOR_FIELDS.map((f) => ({
      label: f.label,
      stageSlug: "business-plan",
      done: typeof input[f.field] === "number" && !Number.isNaN(input[f.field] as number),
    })),
  ];
  if (input.fundingNeeded) {
    statusItems.push(
      { label: "Funding amount", stageSlug: "business-plan", done: typeof input.fundingAmount === "number" },
      { label: "What the funding will be used for", stageSlug: "business-plan", done: Boolean(input.fundingUse?.trim()) }
    );
  }

  const questionnaireComplete = statusItems.every((i) => i.done);
  const ready = isBusinessPlanReady({ input, completedStageCount: stagesComplete, totalStages: STAGES.length });

  return (
    <div className="space-y-8">
      <div className="print:hidden">
        <h1 className="text-2xl font-bold text-slate-900">Business Plan</h1>
        <p className="mt-1 text-sm text-slate-600">
          As you work through the 11 stages, the questions relevant to a business plan are collected right there in
          context — look for the &ldquo;For your business plan&rdquo; sections. Once everything below is checked
          off, generate a professional business plan built from what you've entered.
        </p>
      </div>

      <div className="print:hidden rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
        <p className={allStagesComplete ? "text-emerald-700" : "text-slate-600"}>
          Stages complete: <strong>{stagesComplete}/{STAGES.length}</strong>
          {!allStagesComplete && " — finish the rest of the guide to unlock generation."}
        </p>
      </div>

      <div className="print:hidden rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">What's collected so far</h2>
        <ul className="space-y-1.5">
          {statusItems.map((item, i) => {
            const stage = getStageBySlug(item.stageSlug);
            return (
              <li key={i} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                      item.done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {item.done ? "✓" : ""}
                  </span>
                  <span className={item.done ? "text-slate-700" : "text-slate-500"}>{item.label}</span>
                </span>
                {!item.done && stage && (
                  <Link href={`/stage/${stage.slug}`} className="text-xs font-medium text-slate-500 underline underline-offset-2 hover:text-slate-900">
                    Go to Stage {stage.id}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>

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
      {!ready && !generating && (allStagesComplete ? !questionnaireComplete : true) && (
        <p className="print:hidden text-xs text-slate-500">
          Generation unlocks once all 11 stages are marked complete and everything above is checked off.
        </p>
      )}
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
