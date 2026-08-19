import { afterEach, describe, expect, it } from "vitest";
import { getPlanReviewPriceCents, isStripeConfigured } from "./stripe";

describe("getPlanReviewPriceCents", () => {
  const original = process.env.PLAN_REVIEW_PRICE_CENTS;

  afterEach(() => {
    if (original === undefined) delete process.env.PLAN_REVIEW_PRICE_CENTS;
    else process.env.PLAN_REVIEW_PRICE_CENTS = original;
  });

  it("defaults to 9900 when unset", () => {
    delete process.env.PLAN_REVIEW_PRICE_CENTS;
    expect(getPlanReviewPriceCents()).toBe(9900);
  });

  it("uses the configured value when set", () => {
    process.env.PLAN_REVIEW_PRICE_CENTS = "14900";
    expect(getPlanReviewPriceCents()).toBe(14900);
  });

  it("falls back to the default for garbage input", () => {
    process.env.PLAN_REVIEW_PRICE_CENTS = "not-a-number";
    expect(getPlanReviewPriceCents()).toBe(9900);
  });

  it("falls back to the default for zero or negative values", () => {
    process.env.PLAN_REVIEW_PRICE_CENTS = "-500";
    expect(getPlanReviewPriceCents()).toBe(9900);
  });
});

describe("isStripeConfigured", () => {
  // The underlying Stripe client is constructed once at module load from
  // process.env.STRIPE_SECRET_KEY (same graceful-degradation pattern as
  // lib/email.ts), so this only reflects env state at import time, not
  // whatever a test mutates afterward — this just documents that this
  // test process (no Stripe keys set) reports "not configured".
  it("is false in this test environment (no Stripe keys set)", () => {
    expect(isStripeConfigured()).toBe(false);
  });
});
