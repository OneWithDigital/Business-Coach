"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { EMPTY_BUSINESS_PLAN_INPUT, type BusinessPlanInputData } from "./businessPlan";

interface BusinessPlanInputContextValue {
  input: BusinessPlanInputData;
  updateField: <K extends keyof BusinessPlanInputData>(key: K, value: BusinessPlanInputData[K]) => void;
  hydrated: boolean;
  saving: boolean;
}

const BusinessPlanInputContext = createContext<BusinessPlanInputContextValue | null>(null);

const SAVE_DEBOUNCE_MS = 800;

/**
 * Single shared source of truth for the business-plan questionnaire
 * answers, now collected inline across several stages rather than one
 * standalone form — every BusinessPlanField instance (wherever it's
 * rendered) reads/writes the same state through this context, and changes
 * autosave to /api/business-plan/input after a short pause rather than
 * needing an explicit Save button per field.
 *
 * Guests (no account) get an in-memory-only version: nothing to fetch or
 * save, since the business plan feature is login-gated already. Fields
 * still render for guests so the writing prompts make sense while reading
 * the stage, they just don't persist until the person logs in.
 */
export function BusinessPlanInputProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [input, setInput] = useState<BusinessPlanInputData>(EMPTY_BUSINESS_PLAN_INPUT);
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextSave = useRef(true);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      fetch("/api/business-plan/input")
        .then((r) => r.json())
        .then((data) => {
          skipNextSave.current = true;
          setInput({ ...EMPTY_BUSINESS_PLAN_INPUT, ...data });
          setHydrated(true);
        })
        .catch(() => setHydrated(true));
      return;
    }

    setHydrated(true);
  }, [status]);

  useEffect(() => {
    if (!hydrated || status !== "authenticated") return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSaving(true);
      fetch("/api/business-plan/input", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
        .catch(() => {})
        .finally(() => setSaving(false));
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, hydrated, status]);

  function updateField<K extends keyof BusinessPlanInputData>(key: K, value: BusinessPlanInputData[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <BusinessPlanInputContext.Provider value={{ input, updateField, hydrated, saving }}>
      {children}
    </BusinessPlanInputContext.Provider>
  );
}

export function useBusinessPlanInput(): BusinessPlanInputContextValue {
  const ctx = useContext(BusinessPlanInputContext);
  if (!ctx) {
    throw new Error("useBusinessPlanInput must be used within a BusinessPlanInputProvider");
  }
  return ctx;
}
