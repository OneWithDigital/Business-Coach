"use client";

import { useProgress } from "@/lib/useProgress";

export function StageCompleteButton({ stageId }: { stageId: number }) {
  const { isComplete, toggleComplete, hydrated } = useProgress();
  const done = hydrated && isComplete(stageId);

  return (
    <button
      type="button"
      onClick={() => toggleComplete(stageId)}
      className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${
        done
          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
          : "bg-slate-900 text-white hover:bg-slate-700"
      }`}
    >
      {done ? "✓ Marked complete" : "Mark this stage complete"}
    </button>
  );
}
