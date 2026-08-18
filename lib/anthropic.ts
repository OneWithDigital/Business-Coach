import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

/** Throws a clear error at call time (not import time) if the key is missing, rather than a cryptic SDK auth error. */
export function getAnthropicClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set — business plan generation is unavailable until it's configured.");
  }
  if (!client) {
    client = new Anthropic();
  }
  return client;
}
