"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { trackEvent } from "@/lib/analytics";

interface ProgressContextValue {
  completed: number[];
  isComplete: (stageId: number) => boolean;
  toggleComplete: (stageId: number) => void;
  hydrated: boolean;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

/**
 * Single shared source of truth for stage-completion state, provided once
 * near the root layout. Every component that calls useProgress() (StageNav,
 * StageCompleteButton, etc.) reads/writes the SAME state through this
 * context — previously each call to a plain hook created its own
 * independent state, so marking a stage complete in one component silently
 * never showed up in another (e.g. the sidebar checkmark never updating).
 *
 * An account is required to reach any page that renders these components
 * (see app/(app)/layout.tsx), so this only ever needs the authenticated,
 * database-synced path — no guest/localStorage fallback to maintain.
 */
export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [completed, setCompleted] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/progress")
      .then((res) => res.json())
      .then((data) => setCompleted(Array.isArray(data?.completed) ? data.completed : []))
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, [status]);

  const isComplete = useCallback((stageId: number) => completed.includes(stageId), [completed]);

  const toggleComplete = useCallback((stageId: number) => {
    setCompleted((prev) => {
      const isDone = prev.includes(stageId);
      const next = isDone ? prev.filter((id) => id !== stageId) : [...prev, stageId];

      const request = isDone
        ? fetch(`/api/progress?stageId=${stageId}`, { method: "DELETE" })
        : fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stageId }),
          });
      request.catch(() => {});

      if (!isDone) trackEvent("Stage Completed", { stageId });

      return next;
    });
  }, []);

  return (
    <ProgressContext.Provider value={{ completed, isComplete, toggleComplete, hydrated }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return ctx;
}
