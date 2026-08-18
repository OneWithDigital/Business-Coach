import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { getAnthropicClient } from "@/lib/anthropic";
import { STAGES } from "@/lib/stages";
import {
  buildBusinessPlanPrompt,
  isBusinessPlanReady,
  parseBusinessPlanResponse,
  type BusinessPlanInputData,
} from "@/lib/businessPlan";

const GENERATIONS_PER_DAY = 3;

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const limit = rateLimit(`businessplan:${userId}`, GENERATIONS_PER_DAY, 24 * 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: `You can generate up to ${GENERATIONS_PER_DAY} business plans per day. Try again later.` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const [progressRows, storedInput, profile] = await Promise.all([
    prisma.stageProgress.findMany({ where: { userId }, select: { stageId: true } }),
    prisma.businessPlanInput.findUnique({ where: { userId } }),
    prisma.businessProfile.findUnique({ where: { userId } }),
  ]);

  const input: BusinessPlanInputData = {
    businessName: storedInput?.businessName ?? null,
    onePagerPitch: storedInput?.onePagerPitch ?? null,
    targetCustomer: storedInput?.targetCustomer ?? null,
    problemSolved: storedInput?.problemSolved ?? null,
    revenueModel: storedInput?.revenueModel ?? null,
    competitiveEdge: storedInput?.competitiveEdge ?? null,
    startupCosts: storedInput?.startupCosts ?? null,
    monthlyCosts: storedInput?.monthlyCosts ?? null,
    pricePerUnit: storedInput?.pricePerUnit ?? null,
    variableCostPerUnit: storedInput?.variableCostPerUnit ?? null,
    expectedMonthlyUnits: storedInput?.expectedMonthlyUnits ?? null,
    unitLabel: storedInput?.unitLabel ?? null,
    marketingPlan: storedInput?.marketingPlan ?? null,
    fundingNeeded: storedInput?.fundingNeeded ?? false,
    fundingAmount: storedInput?.fundingAmount ?? null,
    fundingUse: storedInput?.fundingUse ?? null,
    milestones: storedInput?.milestones ?? null,
  };

  const ready = isBusinessPlanReady({
    input,
    completedStageCount: progressRows.length,
    totalStages: STAGES.length,
  });
  if (!ready) {
    return NextResponse.json(
      { error: "Finish all 11 stages and fill in the business plan questionnaire before generating." },
      { status: 400 }
    );
  }

  const prompt = buildBusinessPlanPrompt(input, {
    entityType: profile?.entityType ?? null,
    state: profile?.state ?? null,
    formationDate: profile?.formationDate ?? null,
  });

  let client;
  try {
    client = getAnthropicClient();
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 503 });
  }

  let responseText: string;
  try {
    const message = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 8000,
      messages: [{ role: "user", content: prompt }],
    });
    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text content in the model's response.");
    }
    responseText = textBlock.text;
  } catch (err) {
    console.error("Business plan generation failed:", err);
    return NextResponse.json({ error: "Generation failed. Please try again." }, { status: 502 });
  }

  let plan;
  try {
    plan = parseBusinessPlanResponse(responseText);
  } catch (err) {
    console.error("Business plan response parsing failed:", err);
    return NextResponse.json({ error: "Generation produced an unexpected format. Please try again." }, { status: 502 });
  }

  // Prisma's Json field wants a plain JSON-compatible value, not our typed
  // interface — round-tripping through JSON also guarantees no non-JSON
  // artifacts (e.g. undefined) sneak into storage.
  const planJson = JSON.parse(JSON.stringify(plan));

  const doc = await prisma.businessPlanDocument.upsert({
    where: { userId },
    create: { userId, content: planJson },
    update: { content: planJson, generatedAt: new Date() },
  });

  return NextResponse.json({
    document: { content: doc.content, generatedAt: doc.generatedAt.toISOString() },
  });
}
