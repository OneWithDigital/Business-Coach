"use client";

/**
 * Thin wrapper around Plausible's custom-events API. No-ops if
 * NEXT_PUBLIC_PLAUSIBLE_DOMAIN isn't set (script never loads, see
 * PlausibleScript) or the script hasn't loaded yet — funnel tracking is a
 * nice-to-have, never something that should throw and break a real user
 * action.
 */
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

export function trackEvent(event: string, props?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined" || typeof window.plausible !== "function") return;
  try {
    window.plausible(event, props ? { props } : undefined);
  } catch {
    // Analytics should never break the feature it's attached to.
  }
}
