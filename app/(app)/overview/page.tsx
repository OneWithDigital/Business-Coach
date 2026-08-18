import Link from "next/link";
import { STAGES } from "@/lib/stages";

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">From idea to running business</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          11 stages, in order. Each one covers what you need to know and a tool to help you decide.
          Skip around if you already know where you are.
        </p>
      </div>

      <ol className="space-y-3">
        {STAGES.map((stage) => (
          <li key={stage.id}>
            <Link
              href={`/stage/${stage.slug}`}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {stage.id}
              </span>
              <span>
                <span className="block font-semibold text-slate-900">{stage.title}</span>
                <span className="block text-sm text-slate-500">{stage.tagline}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
