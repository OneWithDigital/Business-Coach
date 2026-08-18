"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STAGES } from "@/lib/stages";
import { useProgress } from "@/lib/useProgress";

export function StageNav() {
  const pathname = usePathname();
  const { isComplete, hydrated } = useProgress();

  return (
    <nav className="space-y-1">
      <Link
        href="/overview"
        className={`block rounded-lg px-3 py-2 text-sm font-medium ${
          pathname === "/overview" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        Overview
      </Link>
      {STAGES.map((stage) => {
        const href = `/stage/${stage.slug}`;
        const active = pathname === href;
        const done = hydrated && isComplete(stage.id);
        return (
          <Link
            key={stage.id}
            href={href}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
              active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] ${
                done
                  ? "bg-emerald-500 text-white"
                  : active
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {done ? "✓" : stage.id}
            </span>
            <span className="truncate">{stage.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
