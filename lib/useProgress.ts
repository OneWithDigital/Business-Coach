"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "bfc:completedStages";

function readStored(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

/**
 * Phase 1 has no accounts/database, so progress lives in the browser's
 * localStorage — good enough to make the wizard feel persistent across
 * visits on the same device, and a natural migration path once Phase 2
 * adds real accounts (same shape, just synced to a server instead).
 */
export function useProgress() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCompleted(readStored());
    setHydrated(true);
  }, []);

  const isComplete = useCallback((stageId: number) => completed.includes(stageId), [completed]);

  const toggleComplete = useCallback((stageId: number) => {
    setCompleted((prev) => {
      const next = prev.includes(stageId) ? prev.filter((id) => id !== stageId) : [...prev, stageId];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { completed, isComplete, toggleComplete, hydrated };
}
