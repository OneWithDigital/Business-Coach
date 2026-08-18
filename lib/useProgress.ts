"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

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

function writeStored(ids: number[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

/**
 * Guest mode (no account) keeps progress in localStorage, same as Phase 1 —
 * an account stays optional. Once logged in, progress syncs to the database
 * via /api/progress instead, and any guest-mode localStorage progress is
 * merged into the account once, the first time a session is detected.
 */
export function useProgress() {
  const { status } = useSession();
  const [completed, setCompleted] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const mergedRef = useRef(false);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      (async () => {
        if (!mergedRef.current) {
          mergedRef.current = true;
          const local = readStored();
          for (const stageId of local) {
            await fetch("/api/progress", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ stageId }),
            }).catch(() => {});
          }
          if (local.length > 0) {
            window.localStorage.removeItem(STORAGE_KEY);
          }
        }

        const res = await fetch("/api/progress");
        if (res.ok) {
          const data = await res.json().catch(() => null);
          setCompleted(Array.isArray(data?.completed) ? data.completed : []);
        }
        setHydrated(true);
      })();
      return;
    }

    setCompleted(readStored());
    setHydrated(true);
  }, [status]);

  const isComplete = useCallback((stageId: number) => completed.includes(stageId), [completed]);

  const toggleComplete = useCallback(
    (stageId: number) => {
      setCompleted((prev) => {
        const isDone = prev.includes(stageId);
        const next = isDone ? prev.filter((id) => id !== stageId) : [...prev, stageId];

        if (status === "authenticated") {
          const request = isDone
            ? fetch(`/api/progress?stageId=${stageId}`, { method: "DELETE" })
            : fetch("/api/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stageId }),
              });
          request.catch(() => {});
        } else {
          writeStored(next);
        }

        return next;
      });
    },
    [status]
  );

  return { completed, isComplete, toggleComplete, hydrated };
}
