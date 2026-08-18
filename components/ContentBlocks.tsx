"use client";

import { useEffect, useState } from "react";
import type { ContentBlock } from "@/lib/types";

const CALLOUT_STYLES: Record<string, string> = {
  info: "bg-sky-50 border-sky-200 text-sky-900",
  warning: "bg-amber-50 border-amber-200 text-amber-900",
  success: "bg-emerald-50 border-emerald-200 text-emerald-900",
  trust: "bg-indigo-50 border-indigo-200 text-indigo-900",
};

function storageKey(stageId: number): string {
  return `bfc:checklist:${stageId}`;
}

function itemKey(blockHeading: string, itemText: string): string {
  return `${blockHeading}::${itemText}`;
}

function readChecked(stageId: number): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(stageId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

/**
 * stageId is optional so this component still works (as a static,
 * non-interactive render) anywhere it's used without stage context — but
 * every real usage in the app passes it, since checklist state is scoped
 * per stage.
 */
export function ContentBlocks({ blocks, stageId }: { blocks: ContentBlock[]; stageId?: number }) {
  const [checked, setChecked] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (stageId === undefined) return;
    setChecked(readChecked(stageId));
    setHydrated(true);
  }, [stageId]);

  function toggle(blockHeading: string, itemText: string) {
    if (stageId === undefined) return;
    const key = itemKey(blockHeading, itemText);
    setChecked((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      window.localStorage.setItem(storageKey(stageId), JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="space-y-8">
      {blocks.map((block) => (
        <section key={block.heading}>
          <h2 className="text-lg font-bold text-slate-900 mb-2">{block.heading}</h2>
          <div className="space-y-3">
            {block.paragraphs.map((p, i) => (
              <p key={i} className="text-sm text-slate-600 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
          {block.checklist && (
            <ul className="mt-3 space-y-2">
              {block.checklist.map((item) => {
                const key = itemKey(block.heading, item.text);
                const done = hydrated && checked.includes(key);
                return (
                  <li key={item.text}>
                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggle(block.heading, item.text)}
                        disabled={stageId === undefined}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300"
                      />
                      <span className={done ? "text-slate-400 line-through" : "text-slate-700"}>
                        {item.text}
                        {item.detail && <span className="block text-xs text-slate-400 no-underline">{item.detail}</span>}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
          {block.callout && (
            <div
              className={`mt-3 rounded-lg border px-4 py-3 text-sm ${CALLOUT_STYLES[block.callout.tone]}`}
            >
              {block.callout.text}
            </div>
          )}
          {block.externalLink && (
            <div className="mt-3">
              <a
                href={block.externalLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
              >
                {block.externalLink.label} →
              </a>
              {block.externalLink.note && (
                <p className="mt-1.5 text-xs text-slate-400">{block.externalLink.note}</p>
              )}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
