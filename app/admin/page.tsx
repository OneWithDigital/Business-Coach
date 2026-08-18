"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AffiliateRow {
  id: string;
  name: string;
  category: string;
  url: string;
  source: "override" | "env" | "none";
}

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  stagesComplete: number;
  hasBusinessPlan: boolean;
}

interface FeedbackRow {
  id: string;
  message: string;
  rating: number | null;
  page: string | null;
  email: string | null;
  createdAt: string;
}

const SOURCE_LABEL: Record<AffiliateRow["source"], string> = {
  override: "Set here",
  env: "From .env",
  none: "Not set",
};

function AffiliateRowEditor({ row, onSaved }: { row: AffiliateRow; onSaved: (row: AffiliateRow) => void }) {
  const [value, setValue] = useState(row.url);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/affiliates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: row.id, url: value }),
    });
    const data = await res.json().catch(() => null);
    setSaving(false);
    if (data) onSaved({ ...row, url: data.url, source: data.source });
  }

  return (
    <tr className="border-t border-slate-100">
      <td className="py-2 pr-3 text-sm font-medium text-slate-900">{row.name}</td>
      <td className="py-2 pr-3 text-xs text-slate-500">{row.category}</td>
      <td className="py-2 pr-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://…"
          className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm"
        />
      </td>
      <td className="py-2 pr-3 text-xs text-slate-400">{SOURCE_LABEL[row.source]}</td>
      <td className="py-2">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </td>
    </tr>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [affiliates, setAffiliates] = useState<AffiliateRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/admin");
      return;
    }
    if (status === "authenticated" && !session.user.isAdmin) {
      router.push("/overview");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status !== "authenticated" || !session.user.isAdmin) return;
    Promise.all([
      fetch("/api/admin/affiliates").then((r) => r.json()),
      fetch("/api/admin/users").then((r) => r.json()),
      fetch("/api/admin/feedback").then((r) => r.json()),
    ])
      .then(([affiliateData, userData, feedbackData]) => {
        setAffiliates(affiliateData?.links ?? []);
        setUsers(userData?.users ?? []);
        setFeedback(feedbackData?.feedback ?? []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [status, session]);

  async function handleDelete(id: string, email: string) {
    if (!window.confirm(`Delete the account for ${email}? This removes their progress, business plan, and profile permanently.`)) {
      return;
    }
    setDeletingId(id);
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  }

  if (status !== "authenticated" || !session.user.isAdmin || !loaded) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin</h1>
        <p className="mt-1 text-sm text-slate-600">
          Update affiliate links without redeploying, and manage accounts.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Affiliate links</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-medium uppercase tracking-wide text-slate-400">
                <th className="pb-2 pr-3">Name</th>
                <th className="pb-2 pr-3">Category</th>
                <th className="pb-2 pr-3">URL</th>
                <th className="pb-2 pr-3">Source</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((row) => (
                <AffiliateRowEditor
                  key={row.id}
                  row={row}
                  onSaved={(updated) =>
                    setAffiliates((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Leave a field blank and save to clear the override and fall back to the AFFILIATE_URL_* env var, if set.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Accounts ({users.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-medium uppercase tracking-wide text-slate-400">
                <th className="pb-2 pr-3">Email</th>
                <th className="pb-2 pr-3">Name</th>
                <th className="pb-2 pr-3">Joined</th>
                <th className="pb-2 pr-3">Stages</th>
                <th className="pb-2 pr-3">Business plan</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-slate-100 text-sm">
                  <td className="py-2 pr-3 text-slate-900">{u.email}</td>
                  <td className="py-2 pr-3 text-slate-600">{u.name || "—"}</td>
                  <td className="py-2 pr-3 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 pr-3 text-slate-500">{u.stagesComplete}/11</td>
                  <td className="py-2 pr-3 text-slate-500">{u.hasBusinessPlan ? "Yes" : "No"}</td>
                  <td className="py-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(u.id, u.email)}
                      disabled={deletingId === u.id}
                      className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                    >
                      {deletingId === u.id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Feedback ({feedback.length})</h2>
        {feedback.length === 0 ? (
          <p className="text-sm text-slate-500">No feedback submitted yet.</p>
        ) : (
          <ul className="space-y-3">
            {feedback.map((f) => (
              <li key={f.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                  <span>
                    {new Date(f.createdAt).toLocaleString()}
                    {f.page && ` · ${f.page}`}
                    {f.email && ` · ${f.email}`}
                  </span>
                  {f.rating && <span className="text-amber-500">{"★".repeat(f.rating)}</span>}
                </div>
                <p className="mt-1 text-slate-700">{f.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
