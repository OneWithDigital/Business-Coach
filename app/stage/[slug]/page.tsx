import Link from "next/link";
import { notFound } from "next/navigation";
import { STAGES, getStageBySlug } from "@/lib/stages";
import { ContentBlocks } from "@/components/ContentBlocks";
import { AffiliatePanel } from "@/components/AffiliatePanel";
import { StageCompleteButton } from "@/components/StageCompleteButton";
import { ToolRenderer } from "@/components/tools/ToolRenderer";
import { BusinessPlanStageFields } from "@/components/BusinessPlanStageFields";

// Rendered dynamically (not statically prerendered) because AffiliatePanel
// reads live admin-editable overrides from the database — there's no DB
// connection available at Docker build time, only at request time.
export const dynamic = "force-dynamic";

export default function StagePage({ params }: { params: { slug: string } }) {
  const stage = getStageBySlug(params.slug);
  if (!stage) notFound();

  const prevStage = STAGES.find((s) => s.id === stage.id - 1);
  const nextStage = STAGES.find((s) => s.id === stage.id + 1);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Stage {stage.id}</p>
        <h1 className="text-2xl font-bold text-slate-900">{stage.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{stage.tagline}</p>
      </div>

      {stage.monetization !== "none" && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          {stage.monetizationNote}
        </div>
      )}
      {stage.monetization === "none" && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          {stage.monetizationNote}
        </div>
      )}

      <ContentBlocks blocks={stage.content} stageId={stage.id} />

      {stage.tool && <ToolRenderer tool={stage.tool} />}

      <BusinessPlanStageFields stageSlug={stage.slug} />

      {stage.affiliateLinkIds && stage.affiliateLinkIds.length > 0 && (
        <AffiliatePanel linkIds={stage.affiliateLinkIds} />
      )}

      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        {prevStage ? (
          <Link href={`/stage/${prevStage.slug}`} className="text-sm font-medium text-slate-500 hover:text-slate-900">
            ← Stage {prevStage.id}: {prevStage.title}
          </Link>
        ) : (
          <span />
        )}
        <StageCompleteButton stageId={stage.id} />
        {nextStage ? (
          <Link href={`/stage/${nextStage.slug}`} className="text-sm font-medium text-slate-500 hover:text-slate-900">
            Stage {nextStage.id}: {nextStage.title} →
          </Link>
        ) : (
          <Link
            href="/business-plan"
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Build your business plan →
          </Link>
        )}
      </div>
    </div>
  );
}
