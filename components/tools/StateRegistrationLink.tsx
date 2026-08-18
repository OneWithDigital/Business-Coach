"use client";

import { useState } from "react";
import { STATE_LINKS, getStateLink } from "@/lib/stateLinks";

/**
 * Lets someone jump straight to their state's official site to register
 * their business entity themselves, instead of paying a formation service
 * for something the state lets you do directly (often for less). Falls back
 * to a search link — never a guessed URL — for any state we couldn't
 * confidently verify.
 */
export function StateRegistrationLink({
  title = "Register directly with your state",
  helpText = "Skip the formation service fee and file straight with your state, if you'd rather.",
}: {
  title?: string;
  helpText?: string;
}) {
  const [abbreviation, setAbbreviation] = useState("");
  const selected = abbreviation ? getStateLink(abbreviation) : undefined;

  const searchUrl = selected
    ? `https://www.google.com/search?q=${encodeURIComponent(`${selected.state} Secretary of State business entity registration`)}`
    : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-xs text-slate-500">{helpText}</p>
      </div>

      <select
        value={abbreviation}
        onChange={(e) => setAbbreviation(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
      >
        <option value="">Select your state</option>
        {STATE_LINKS.map((s) => (
          <option key={s.abbreviation} value={s.abbreviation}>
            {s.state}
          </option>
        ))}
      </select>

      {selected && selected.confidence !== "not-found" && (
        <div>
          <a
            href={selected.formationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Register with {selected.agencyName} →
          </a>
          <p className="mt-1.5 text-xs text-slate-400">
            {selected.confidence === "verified"
              ? `Official ${selected.state} government site — verified link, not a formation service.`
              : `Official ${selected.state} government site — this is very likely the right page, but we couldn't fully confirm it live (state sites sometimes block automated checks).`}
          </p>
          {selected.note && <p className="mt-1 text-xs text-amber-700">{selected.note}</p>}
        </div>
      )}

      {selected && selected.confidence === "not-found" && searchUrl && (
        <div>
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Search for {selected.state}&rsquo;s official site →
          </a>
          <p className="mt-1.5 text-xs text-slate-400">
            We couldn&rsquo;t confidently identify a direct link for {selected.state} — this searches for it
            instead of guessing, so double-check you land on an official .gov/.us state site.
          </p>
        </div>
      )}
    </div>
  );
}
