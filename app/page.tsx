import Link from "next/link";
import { STAGES } from "@/lib/stages";

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Work through 11 stages",
    body: "Idea validation to ongoing compliance, in order — or skip around if you already know where you are. No account needed to start.",
  },
  {
    step: "2",
    title: "Use the built-in tools",
    body: "An entity selector, a break-even calculator with real industry examples, bank and credit-card comparisons — each one answers a specific decision, not a generic quiz.",
  },
  {
    step: "3",
    title: "It all feeds one place",
    body: "Your answers — target customer, pricing, costs, entity choice — collect automatically as you go. Nothing to re-enter twice.",
  },
  {
    step: "4",
    title: "Generate your business plan",
    body: "Once you've finished the guide, one click turns everything you entered into a real, professional business plan you can print or save as a PDF.",
  },
];

const TRUST_POINTS = [
  {
    title: "Direct government links, not markup",
    body: "Free EIN application straight to IRS.gov. Direct links to file your LLC with your own state — often for less than a formation service charges to do the same paperwork.",
  },
  {
    title: "We tell you when there's money in it for us",
    body: "Every stage says plainly whether we earn a commission there, and why — or that we don't. That's not a legal disclaimer buried in a footer, it's on every relevant page.",
  },
  {
    title: "No jargon, real examples",
    body: "Every abstract concept — pricing models, chart of accounts, target customers — comes with a worked example, not just a definition.",
  },
];

export default function LandingPage() {
  return (
    <div className="space-y-20 pb-12">
      {/* Hero */}
      <section className="pt-6 sm:pt-12">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Free · No account required to start</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Go from business idea to registered, banked, and running — without overpaying for what your state gives
            you free.
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            An 11-stage guided path with real tools built in — not a generic checklist. Finish it, and one click
            turns everything you entered into a professional business plan you can print.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/stage/${STAGES[0]!.slug}`}
              className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Start free — Stage 0 →
            </Link>
            <Link
              href="/overview"
              className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              See all 11 stages
            </Link>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Sign up later if you want your progress saved across devices — the guide itself works right now, no
            account needed.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="text-xl font-bold text-slate-900">How it works</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {item.step}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Business plan preview */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">The payoff</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">A real business plan, built from your answers</h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Not a fill-in-the-blank template. Your target customer, pricing rationale, costs, entity choice, and
              marketing plan — collected naturally as you work through the guide — become the actual input for a
              professionally written plan, ready to print or save as a PDF.
            </p>
            <Link
              href="/business-plan"
              className="mt-4 inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
            >
              See what's needed to unlock it →
            </Link>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Preview</p>
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-sm font-bold text-slate-900">Executive Summary</p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Riverside Cleaning Co. provides biweekly residential cleaning for working parents in mid-size
                  cities who don't have time for a deep clean...
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Financial Plan</p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  With a contribution margin of $105 per cleaning job and monthly fixed costs of $330, break-even
                  is roughly 4 jobs per month...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / honesty */}
      <section>
        <h2 className="text-xl font-bold text-slate-900">Why trust this over a paid formation service</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TRUST_POINTS.map((point) => (
            <div key={point.title} className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-900">{point.title}</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{point.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="rounded-2xl bg-slate-900 px-6 py-10 sm:px-10 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Start where you are — it's free either way.</h2>
        <p className="mt-2 text-sm text-slate-300">No account, no credit card, no catch. Skip straight to the stage you need.</p>
        <div className="mt-6">
          <Link
            href={`/stage/${STAGES[0]!.slug}`}
            className="inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          >
            Start free — Stage 0 →
          </Link>
        </div>
      </section>
    </div>
  );
}
