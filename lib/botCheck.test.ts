import { describe, expect, it } from "vitest";
import { isLikelyBot } from "./botCheck";

describe("isLikelyBot", () => {
  it("flags a filled honeypot field", () => {
    expect(isLikelyBot({ honeypot: "I am a bot", formRenderedAt: Date.now() - 5000 })).toBe(true);
  });

  it("flags a missing formRenderedAt", () => {
    expect(isLikelyBot({ honeypot: "" })).toBe(true);
  });

  it("flags a submission faster than the minimum fill time", () => {
    expect(isLikelyBot({ honeypot: "", formRenderedAt: Date.now() - 100 })).toBe(true);
  });

  it("flags a stale/replayed timestamp", () => {
    expect(isLikelyBot({ honeypot: "", formRenderedAt: Date.now() - 1000 * 60 * 60 * 7 })).toBe(true);
  });

  it("allows a normal human submission", () => {
    expect(isLikelyBot({ honeypot: "", formRenderedAt: Date.now() - 5000 })).toBe(false);
  });
});
