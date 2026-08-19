"use client";

import { useEffect, useState } from "react";

interface ReviewStatus {
  enabled: boolean;
  priceCents: number;
  order: { status: string; createdAt: string } | null;
}

const STATUS_COPY: Record<string, string> = {
  pending_payment: "Checkout started — finish payment to submit your plan for review.",
  paid: "Received — a person on the team will review your plan and follow up by email.",
  in_review: "Your plan is being reviewed. We'll email you when it's done.",
  completed: "Review complete — check your email for the notes.",
  canceled: "Checkout was canceled.",
};

export function PlanReviewUpsell() {
  const [status, setStatus] = useState<ReviewStatus | null>(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/business-plan/review")
      .then((res) => res.json())
      .then(setStatus)
      .catch(() => {});
  }, []);

  async function startCheckout() {
    setStarting(true);
    setError(null);
    const res = await fetch("/api/business-plan/review/checkout", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) {
      setError(data.error ?? "Couldn't start checkout right now.");
      setStarting(false);
      return;
    }
    window.location.href = data.url;
  }

  if (!status) return null;

  const activeOrder = status.order && status.order.status !== "canceled" ? status.order : null;

  return (
    <div className="print:hidden rounded-xl border border-slate-200 bg-white p-4 space-y-2">
      <h2 className="text-sm font-semibold text-slate-900">Want a second set of eyes on this?</h2>
      {!status.enabled ? (
        <p className="text-xs text-slate-500">
          Paid plan reviews aren't set up yet — this will be a real option here soon.
        </p>
      ) : activeOrder ? (
        <p className="text-xs text-slate-600">{STATUS_COPY[activeOrder.status] ?? activeOrder.status}</p>
      ) : (
        <>
          <p className="text-xs text-slate-500">
            A person on the team reviews your plan before it goes to a lender — catches gaps the AI missed, sanity-checks
            your numbers, and flags anything that reads as risky.
          </p>
          <button
            type="button"
            onClick={startCheckout}
            disabled={starting}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {starting ? "Starting checkout…" : `Get a professional review — $${(status.priceCents / 100).toFixed(0)}`}
          </button>
        </>
      )}
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
