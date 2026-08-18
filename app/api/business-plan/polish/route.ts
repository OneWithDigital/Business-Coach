import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { getAnthropicClient } from "@/lib/anthropic";
import { BUSINESS_PLAN_FIELDS } from "@/lib/businessPlanFields";

const POLISHES_PER_HOUR = 20;
const MAX_INPUT_LENGTH = 4000;

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = rateLimit(`polish:${session.user.id}`, POLISHES_PER_HOUR, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many polish requests. Try again in a bit." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const body = await request.json().catch(() => null);
  const field = typeof body?.field === "string" ? body.field : null;
  const text = typeof body?.text === "string" ? body.text : null;

  const meta = BUSINESS_PLAN_FIELDS.find((f) => f.field === field && f.polish);
  if (!meta) {
    return NextResponse.json({ error: "This field doesn't support AI polishing." }, { status: 400 });
  }
  if (!text || !text.trim()) {
    return NextResponse.json({ error: "Nothing to polish yet." }, { status: 400 });
  }
  if (text.length > MAX_INPUT_LENGTH) {
    return NextResponse.json({ error: "That's too long to polish in one go." }, { status: 400 });
  }

  let client;
  try {
    client = getAnthropicClient();
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 503 });
  }

  const prompt = [
    `You're helping a first-time founder polish one answer in a business plan questionnaire. The question is: "${meta.label}"`,
    "",
    "Their draft answer:",
    text,
    "",
    "Rewrite it to be clearer and more professional, fixing grammar and awkward phrasing. Keep their meaning and roughly the same length — do not invent new facts, numbers, or claims they didn't make. Respond with ONLY the rewritten answer, no preamble, no quotes around it, no explanation.",
  ].join("\n");

  try {
    const message = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text content in the model's response.");
    }
    return NextResponse.json({ polished: textBlock.text.trim() });
  } catch (err) {
    console.error("Business plan field polish failed:", err);
    return NextResponse.json({ error: "Couldn't polish this right now. Please try again." }, { status: 502 });
  }
}
