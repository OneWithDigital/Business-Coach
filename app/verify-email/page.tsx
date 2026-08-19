"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"checking" | "ok" | "error">("checking");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("This link is missing its token.");
      return;
    }
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setStatus("error");
          setError(data.error ?? "Something went wrong.");
          return;
        }
        setStatus("ok");
      })
      .catch(() => {
        setStatus("error");
        setError("Something went wrong.");
      });
  }, [token]);

  if (status === "checking") return <p className="text-sm text-slate-500">Verifying…</p>;

  if (status === "error") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-rose-600">{error}</p>
        <p className="text-sm text-slate-500">
          You can request a new link from your{" "}
          <Link href="/account" className="font-medium text-slate-900 underline underline-offset-2">
            account page
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">Your email is verified.</p>
      <Link href="/overview" className="font-medium text-slate-900 underline underline-offset-2 text-sm">
        Continue to the guide →
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthCard title="Verify your email" subtitle="Confirming your address.">
      <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
        <VerifyEmailInner />
      </Suspense>
    </AuthCard>
  );
}
