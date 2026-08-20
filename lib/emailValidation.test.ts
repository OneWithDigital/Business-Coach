import { describe, expect, it } from "vitest";
import { interpretEmailValidation } from "./emailValidation";

describe("interpretEmailValidation", () => {
  it.each(["invalid", "spamtrap", "abuse", "do_not_mail"])("rejects %s addresses", (status) => {
    expect(interpretEmailValidation({ status }).deliverable).toBe(false);
  });

  it.each(["valid", "catch-all", "unknown"])("allows %s addresses pending link verification", (status) => {
    expect(interpretEmailValidation({ status }).deliverable).toBe(true);
  });

  it("fails open when the provider response is unusable", () => {
    expect(interpretEmailValidation({ error: "temporary failure" })).toEqual({
      deliverable: true,
      checked: false,
      reason: "temporary failure",
    });
  });
});

