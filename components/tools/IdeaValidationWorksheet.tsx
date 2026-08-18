"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "bfc:tool:idea-validation";

const ITEMS = [
  { id: "specific-customer", text: "I can name a specific type of person/business who has this problem" },
  { id: "current-workaround", text: "I know how they currently deal with the problem without me" },
  { id: "talked-to-people", text: "I've actually talked to at least 5-10 of them about it (not just family/friends)" },
  { id: "price-point", text: "I have a rough price point in mind, based on what people already pay for alternatives" },
  { id: "revenue-cadence", text: "I understand whether this is a one-time purchase or recurring need" },
  { id: "competitor-scan", text: "I've listed 3-5 alternatives and can say honestly why someone picks me over each" },
];

function readStored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function IdeaValidationWorksheet() {
  const [checked, setChecked] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setChecked(readStored());
    setHydrated(true);
  }, []);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const score = checked.length;
  const total = ITEMS.length;
  const verdict =
    score === total
      ? { tone: "success" as const, text: "You've answered yes to everything. That's a solid basis to move into Stage 1." }
      : score >= total - 2
      ? { tone: "info" as const, text: "Close. Fill in the remaining gaps before you spend money on formation." }
      : { tone: "warning" as const, text: "Several gaps still open — worth closing these before moving forward, not after." };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-900">Idea validation checklist</h3>
        <span className="text-xs text-slate-400">{hydrated ? `${score}/${total}` : "…"}</span>
      </div>
      <ul className="space-y-2">
        {ITEMS.map((item) => {
          const done = checked.includes(item.id);
          return (
            <li key={item.id}>
              <label className="flex items-start gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggle(item.id)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300"
                />
                <span className={done ? "text-slate-400 line-through" : "text-slate-700"}>{item.text}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {hydrated && (
        <div
          className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
            verdict.tone === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : verdict.tone === "warning"
              ? "bg-amber-50 border-amber-200 text-amber-900"
              : "bg-sky-50 border-sky-200 text-sky-900"
          }`}
        >
          {verdict.text}
        </div>
      )}
    </div>
  );
}
