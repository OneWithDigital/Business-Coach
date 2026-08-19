import Stripe from "stripe";

/**
 * Same graceful-degradation pattern as Anthropic/Resend: without
 * STRIPE_SECRET_KEY set, the paid plan-review feature shows as "not
 * configured yet" instead of the checkout button — nothing else in the
 * app depends on this.
 */
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-07-29.dahlia" })
  : null;

export function isStripeConfigured(): boolean {
  return stripe !== null && Boolean(process.env.STRIPE_PRICE_ID || process.env.PLAN_REVIEW_PRICE_CENTS);
}

export function getStripeClient(): Stripe {
  if (!stripe) throw new Error("Stripe is not configured (STRIPE_SECRET_KEY missing).");
  return stripe;
}

/** In cents. Defaults to $99 — change via PLAN_REVIEW_PRICE_CENTS, not in code. */
export function getPlanReviewPriceCents(): number {
  const raw = process.env.PLAN_REVIEW_PRICE_CENTS;
  const parsed = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 9900;
}
