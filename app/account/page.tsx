"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { computeReminders } from "@/lib/calc/reminders";
import { US_STATES } from "@/lib/usStates";

interface Profile {
  entityType: string | null;
  state: string | null;
  formationDate: string | null;
}

const ENTITY_TYPES = [
  "Sole proprietorship",
  "Single-member LLC",
  "Multi-member LLC",
  "LLC with S-corp election",
  "C-corporation",
];

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile>({ entityType: null, state: null, formationDate: null });
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/account");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile({
          entityType: data.entityType ?? null,
          state: data.state ?? null,
          formationDate: data.formationDate ? data.formationDate.slice(0, 10) : null,
        });
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [status]);

  const reminders = useMemo(() => {
    return computeReminders({
      state: profile.state,
      formationDate: profile.formationDate ? new Date(profile.formationDate) : null,
    });
  }, [profile.state, profile.formationDate]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    setSaved(true);
  }

  if (status !== "authenticated" || !loaded) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Your account</h1>
        <p className="mt-1 text-sm text-slate-600">
          Signed in as {session?.user?.email}. Fill in a few details below and we'll estimate the
          recurring deadlines that apply to your business.
        </p>
      </div>

      <form onSubmit={handleSave} className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">Business profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="text-sm">
            <span className="block text-xs font-medium text-slate-500 mb-1">Entity type</span>
            <select
              value={profile.entityType ?? ""}
              onChange={(e) => setProfile((p) => ({ ...p, entityType: e.target.value || null }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5"
            >
              <option value="">Not set</option>
              {ENTITY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-xs font-medium text-slate-500 mb-1">State of formation</span>
            <select
              value={profile.state ?? ""}
              onChange={(e) => setProfile((p) => ({ ...p, state: e.target.value || null }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5"
            >
              <option value="">Not set</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-xs font-medium text-slate-500 mb-1">Formation date</span>
            <input
              type="date"
              value={profile.formationDate ?? ""}
              onChange={(e) => setProfile((p) => ({ ...p, formationDate: e.target.value || null }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5"
            />
          </label>
        </div>
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

      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-900">Upcoming reminders</h2>
        {!profile.formationDate && (
          <p className="text-xs text-slate-500">
            Add a formation date above to get an estimated annual report deadline too.
          </p>
        )}
        <ul className="space-y-3">
          {reminders.map((r) => (
            <li key={r.id} className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-slate-900">{r.title}</span>
                {r.dueDate && (
                  <span className="text-xs font-medium text-slate-500">
                    {r.dueDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500">{r.hedge}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
