import Link from "next/link";
import { Fraunces, Source_Sans_3 } from "next/font/google";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

/* ---------- Hand-authored illustrations ---------- */

function PathHero() {
  const nodes = [
    { x: 40, y: 210, label: "Idea" },
    { x: 160, y: 120, label: "Entity" },
    { x: 300, y: 170, label: "Banked" },
    { x: 430, y: 70, label: "Launch" },
    { x: 560, y: 110, label: "Growing" },
  ];
  const d = `M${nodes.map((n) => `${n.x},${n.y}`).join(" L")}`;
  return (
    <svg viewBox="0 0 600 260" className="w-full" role="img" aria-label="A winding path from idea to a growing business">
      <path d={d} fill="none" stroke="#C9A24B" strokeWidth="3" strokeDasharray="1 14" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#1F6F54" strokeWidth="1.5" opacity="0.35" />
      {nodes.map((n, i) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r={i === nodes.length - 1 ? 11 : 8} fill={i === nodes.length - 1 ? "#C9A24B" : "#14231C"} />
          <circle cx={n.x} cy={n.y} r={i === nodes.length - 1 ? 11 : 8} fill="none" stroke="#F6F5EF" strokeWidth="2" />
          <text
            x={n.x}
            y={n.y - 20}
            textAnchor="middle"
            className="fill-[#14231C]"
            style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600 }}
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function IconMaze() {
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6h28v10H16v8h18v10H6V24h10v-8H6V6z" />
    </svg>
  );
}

function IconKnot() {
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="15" cy="15" r="8" />
      <circle cx="25" cy="25" r="8" />
      <path d="M15 23c0 4 4 6 7 3M25 17c0-4-4-6-7-3" />
    </svg>
  );
}

function IconScale() {
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6v28M12 34h16M8 12h9M23 12h9" />
      <path d="M8 12l-4 9a5 5 0 0010 0l-4-9zM32 12l-4 9a5 5 0 0010 0l-4-9z" />
    </svg>
  );
}

function IconFork() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20 34V20M20 20C10 20 8 8 8 8M20 20c10 0 12-12 12-12" />
      <circle cx="8" cy="6" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="32" cy="6" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ---------- Content ---------- */

const PROBLEMS = [
  {
    icon: IconMaze,
    title: "Everything about this is designed to confuse you",
    body: "LLC or sole prop? EIN before or after the bank? Which license actually applies to you? The paperwork is scattered across a dozen sites, and half of what shows up when you search is a paid service standing between you and a free government form.",
  },
  {
    icon: IconKnot,
    title: "You have a good idea. You don't have confidence.",
    body: "Not confidence that you're structuring it right, pricing it right, or walking into a bank with the documents they'll actually ask for — and no way to find out except by getting it wrong first.",
  },
  {
    icon: IconScale,
    title: "You shouldn't need a $3,000 consultant to ask \"am I doing this right?\"",
    body: "The information exists. It's just buried, or sold back to you at a markup. That's backwards for someone who hasn't made a dollar yet.",
  },
];

const GUIDE_PROOF = [
  {
    title: "Direct links, not markup",
    body: "Free EIN application straight to IRS.gov. Direct links to file your LLC with your own state — often for less than a formation service charges to do the same paperwork.",
  },
  {
    title: "We say when there's money in it for us",
    body: "Every stage states plainly whether we earn a commission there, and why — or that we don't. Not a disclaimer buried in a footer.",
  },
  {
    title: "Real examples, not definitions",
    body: "Pricing models, chart of accounts, target customers — every abstract concept comes with a worked example from an actual small business.",
  },
];

const PLAN_STEPS = [
  {
    step: "1",
    title: "Work the 11 stages",
    body: "Idea validation to ongoing compliance, in order — or skip to wherever you already are. Each one covers a single decision, start to finish.",
  },
  {
    step: "2",
    title: "Use the tools built into each stage",
    body: "An entity selector, a break-even calculator loaded with real industry numbers, side-by-side bank and credit-card comparisons — answers to specific decisions, not a generic quiz.",
  },
  {
    step: "3",
    title: "Get a business plan you didn't have to write from scratch",
    body: "Your target customer, pricing, costs, and entity choice collect automatically as you go. Finish the guide, and one click turns it into a plan you can print or hand to a lender.",
  },
];

export default function LandingPage() {
  return (
    <div className={`${body.variable} ${display.variable} min-h-screen bg-[#F6F5EF] text-[#14231C]`} style={{ fontFamily: "var(--font-body)" }}>
      <header className="border-b border-[#DEDACB]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <span className="text-lg font-semibold tracking-tight text-[#14231C]" style={{ fontFamily: "var(--font-display)" }}>
            Business Formation Coach
          </span>
          <Link href="/login" className="text-sm font-medium text-[#14231C]/70 hover:text-[#14231C]">
            Log in
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4">
        <div className="space-y-24 py-14 sm:py-20">
          {/* HERO — Character + first taste of the Plan/CTA */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1F6F54]">
                For first-time founders — free account, no credit card
              </p>
              <h1
                className="mt-4 text-4xl sm:text-5xl leading-[1.08] text-[#14231C]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                You don&apos;t need an MBA. You need the next right step.
              </h1>
              <p className="mt-5 text-base sm:text-[17px] text-[#14231C]/70 leading-relaxed">
                Business Formation Coach walks you from idea to registered, banked, and running —
                one stage at a time, with the tools and knowledge built in so you&apos;re never
                guessing, and never overpaying for what your state hands out free.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/signup"
                  className="rounded-lg bg-[#1F6F54] px-6 py-3 text-sm font-semibold text-white hover:bg-[#175840] transition-colors"
                >
                  Start free — no credit card
                </Link>
                <Link
                  href="/overview"
                  className="rounded-lg border border-[#14231C]/20 px-6 py-3 text-sm font-semibold text-[#14231C] hover:bg-white transition-colors"
                >
                  See all 11 stages
                </Link>
              </div>
              <p className="mt-4 text-xs text-[#14231C]/45">
                Takes about a minute. Already have an account?{" "}
                <Link href="/login" className="font-medium text-[#14231C]/70 underline underline-offset-2">
                  Log in
                </Link>
                .
              </p>
            </div>
            <div className="rounded-2xl border border-[#DEDACB] bg-white/60 p-6 sm:p-8">
              <PathHero />
            </div>
          </section>

          {/* PROBLEM — external, internal, philosophical */}
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B8863B]">The problem</p>
            <h2 className="mt-2 text-2xl sm:text-3xl text-[#14231C]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              Starting a business shouldn&apos;t feel like this.
            </h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {PROBLEMS.map((p) => (
                <div key={p.title} className="rounded-2xl border border-[#DEDACB] bg-white p-5">
                  <div className="text-[#1F6F54]">
                    <p.icon />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[#14231C] leading-snug">{p.title}</h3>
                  <p className="mt-2 text-sm text-[#14231C]/65 leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* GUIDE — empathy + authority */}
          <section className="rounded-2xl bg-[#14231C] px-6 py-10 sm:px-10 sm:py-12 text-[#F6F5EF]">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C9A24B]">Who&apos;s guiding you</p>
              <h2 className="mt-2 text-2xl sm:text-3xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                We&apos;ve watched too many first-time founders get this wrong — not from a lack of
                effort, but a lack of a straight answer.
              </h2>
              <p className="mt-4 text-sm text-[#F6F5EF]/75 leading-relaxed">
                Built by <span className="font-semibold text-[#F6F5EF]">One With Digital</span>, this
                guide exists so you get the direct path — the same free forms, the same real numbers,
                the same honest tradeoffs we&apos;d walk a friend through.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {GUIDE_PROOF.map((g) => (
                <div key={g.title} className="rounded-xl border border-[#F6F5EF]/15 bg-[#F6F5EF]/5 p-4">
                  <h3 className="text-sm font-semibold text-[#F6F5EF]">{g.title}</h3>
                  <p className="mt-1.5 text-xs text-[#F6F5EF]/65 leading-relaxed">{g.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* PLAN */}
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B8863B]">The plan</p>
            <h2 className="mt-2 text-2xl sm:text-3xl text-[#14231C]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              Three steps. Everything else is detail.
            </h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {PLAN_STEPS.map((item) => (
                <div key={item.step} className="rounded-2xl border border-[#DEDACB] bg-white p-5">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1F6F54] text-sm font-semibold text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-[#14231C]">{item.title}</h3>
                  <p className="mt-1.5 text-xs text-[#14231C]/60 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-[#DEDACB] bg-white p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1F6F54]">The payoff</p>
                  <h3 className="mt-2 text-lg font-semibold text-[#14231C]">
                    A real business plan, built from your own answers
                  </h3>
                  <p className="mt-3 text-sm text-[#14231C]/65 leading-relaxed">
                    Not a fill-in-the-blank template. Your target customer, pricing rationale,
                    costs, entity choice, and marketing plan — collected naturally as you work
                    through the guide — become the actual input for a professionally written
                    plan, ready to print or save as a PDF.
                  </p>
                  <Link
                    href="/signup"
                    className="mt-4 inline-block text-sm font-semibold text-[#1F6F54] hover:text-[#175840] underline underline-offset-2"
                  >
                    Sign up to start building it →
                  </Link>
                </div>
                <div className="rounded-xl border border-[#DEDACB] bg-[#F6F5EF] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#14231C]/40">Preview</p>
                  <div className="mt-3 space-y-3">
                    <div>
                      <p className="text-sm font-bold text-[#14231C]">Executive Summary</p>
                      <p className="mt-1 text-xs text-[#14231C]/55 leading-relaxed">
                        Riverside Cleaning Co. provides biweekly residential cleaning for working
                        parents in mid-size cities who don&apos;t have time for a deep clean...
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#14231C]">Financial Plan</p>
                      <p className="mt-1 text-xs text-[#14231C]/55 leading-relaxed">
                        With a contribution margin of $105 per cleaning job and monthly fixed
                        costs of $330, break-even is roughly 4 jobs per month...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAILURE / SUCCESS contrast */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-[#B0473F]/25 bg-[#B0473F]/5 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[#B0473F]">Without a plan</h3>
                <ul className="mt-3 space-y-2 text-sm text-[#14231C]/70 leading-relaxed">
                  <li>· Overpay a formation service for paperwork your state gives away free</li>
                  <li>· Pick the wrong entity and find out at tax time, when it&apos;s expensive to fix</li>
                  <li>· Show up at the bank without the one document that sends you home</li>
                  <li>· Price by guessing, and find out you&apos;re losing money on every sale</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-[#1F6F54]/25 bg-[#1F6F54]/5 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[#1F6F54]">With one</h3>
                <ul className="mt-3 space-y-2 text-sm text-[#14231C]/70 leading-relaxed">
                  <li>· Registered correctly the first time, for the cost your state actually charges</li>
                  <li>· A business bank account open before you need it, documents in hand</li>
                  <li>· Pricing based on your real numbers, not a guess</li>
                  <li>· A business plan you&apos;re proud to hand a lender — not a template you never open again</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 flex justify-center text-[#C9A24B]">
              <IconFork />
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="rounded-2xl bg-[#14231C] px-6 py-12 sm:px-10 text-center">
            <h2 className="text-2xl sm:text-3xl text-[#F6F5EF]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              Create your free account and take the next right step.
            </h2>
            <p className="mt-2 text-sm text-[#F6F5EF]/60">No credit card, no catch — just an email and a password.</p>
            <div className="mt-7">
              <Link
                href="/signup"
                className="inline-block rounded-lg bg-[#C9A24B] px-7 py-3 text-sm font-semibold text-[#14231C] hover:bg-[#DBB868] transition-colors"
              >
                Start free — no credit card
              </Link>
            </div>
          </section>
        </div>

        <footer className="border-t border-[#DEDACB] py-8 text-center text-xs text-[#14231C]/40">
          Business Formation Coach — built by One With Digital.
        </footer>
      </div>
    </div>
  );
}
