"use client";

import { useState } from "react";

/** Soft nudge, not a gate — dismissible per browser session, never blocks anything. */
export function EmailVerifyBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (dismissed) return null;

  async function resend() {
    setStatus("sending");
    const res = await fetch("/api/auth/resend-verification", { method: "POST" });
    setStatus(res.ok ? "sent" : "error");
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 print:hidden">
      <span>
        {status === "sent"
          ? "Verification email sent — check your inbox."
          : "Verify your email so we can reach you about your account and reminders."}
      </span>
      <div className="flex items-center gap-3">
        {status !== "sent" && (
          <button
            type="button"
            onClick={resend}
            disabled={status === "sending"}
            className="font-semibold underline underline-offset-2 disabled:opacity-50"
          >
            {status === "sending" ? "Sending…" : status === "error" ? "Try again" : "Resend email"}
          </button>
        )}
        <button type="button" onClick={() => setDismissed(true)} className="text-amber-600 hover:text-amber-900" aria-label="Dismiss">
          ✕
        </button>
      </div>
    </div>
  );
}
