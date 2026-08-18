import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isAdminEmail } from "./admin";

describe("isAdminEmail", () => {
  const original = process.env.ADMIN_EMAILS;

  beforeEach(() => {
    process.env.ADMIN_EMAILS = "owner@example.com, second-admin@example.com";
  });

  afterEach(() => {
    if (original === undefined) delete process.env.ADMIN_EMAILS;
    else process.env.ADMIN_EMAILS = original;
  });

  it("returns true for an email in the list", () => {
    expect(isAdminEmail("owner@example.com")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(isAdminEmail("Owner@Example.com")).toBe(true);
  });

  it("handles whitespace around entries in the env var", () => {
    expect(isAdminEmail("second-admin@example.com")).toBe(true);
  });

  it("returns false for an email not in the list", () => {
    expect(isAdminEmail("nobody@example.com")).toBe(false);
  });

  it("returns false for null/undefined", () => {
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
  });

  it("returns false when ADMIN_EMAILS is unset", () => {
    delete process.env.ADMIN_EMAILS;
    expect(isAdminEmail("owner@example.com")).toBe(false);
  });

  it("returns false when ADMIN_EMAILS is empty", () => {
    process.env.ADMIN_EMAILS = "";
    expect(isAdminEmail("owner@example.com")).toBe(false);
  });
});
