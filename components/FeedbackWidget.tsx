"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { HoneypotField } from "@/components/HoneypotField";

/**
 * Always-visible feedback trigger (bottom-right, every page) rather than a
 * timed/triggered popup — simplest reliable pattern, and avoids interrupting
 * anyone mid-task. Kept deliberately short: a rating, a message, and submit.
 */
export function FeedbackWidget() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [formRenderedAt] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setRating(null);
    setMessage("");
    setEmail("");
    setDone(false);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, rating, email: email || undefined, page: pathname, honeypot, formRenderedAt }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Couldn't send that — try again?");
      return;
    }
    setDone(true);
  }

  return (
    <div className="print:hidden fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          {done ? (
            <div className="text-center py-2">
              <p className="text-sm font-medium text-slate-900">Thanks — that helps.</p>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
                className="mt-2 text-xs text-slate-500 underline underline-offset-2"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <HoneypotField value={honeypot} onChange={setHoneypot} />
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Got feedback?</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className={`text-lg ${rating !== null && n <= rating ? "text-amber-400" : "text-slate-300"}`}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's working, what's not, what's missing?"
                rows={3}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
              />
              {!session && (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email (optional, if you want a reply)"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                />
              )}
              {error && <p className="text-xs text-rose-600">{error}</p>}
              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {submitting ? "Sending…" : "Send feedback"}
              </button>
            </form>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-slate-700"
      >
        💬 Feedback
      </button>
    </div>
  );
}
