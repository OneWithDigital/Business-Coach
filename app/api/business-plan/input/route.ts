import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { BusinessPlanInputData } from "@/lib/businessPlan";

function serialize(input: {
  businessName: string | null;
  onePagerPitch: string | null;
  targetCustomer: string | null;
  problemSolved: string | null;
  revenueModel: string | null;
  competitiveEdge: string | null;
  startupCosts: number | null;
  monthlyCosts: number | null;
  pricePerUnit: number | null;
  variableCostPerUnit: number | null;
  expectedMonthlyUnits: number | null;
  unitLabel: string | null;
  marketingPlan: string | null;
  fundingNeeded: boolean;
  fundingAmount: number | null;
  fundingUse: string | null;
  milestones: string | null;
} | null): BusinessPlanInputData {
  return {
    businessName: input?.businessName ?? null,
    onePagerPitch: input?.onePagerPitch ?? null,
    targetCustomer: input?.targetCustomer ?? null,
    problemSolved: input?.problemSolved ?? null,
    revenueModel: input?.revenueModel ?? null,
    competitiveEdge: input?.competitiveEdge ?? null,
    startupCosts: input?.startupCosts ?? null,
    monthlyCosts: input?.monthlyCosts ?? null,
    pricePerUnit: input?.pricePerUnit ?? null,
    variableCostPerUnit: input?.variableCostPerUnit ?? null,
    expectedMonthlyUnits: input?.expectedMonthlyUnits ?? null,
    unitLabel: input?.unitLabel ?? null,
    marketingPlan: input?.marketingPlan ?? null,
    fundingNeeded: input?.fundingNeeded ?? false,
    fundingAmount: input?.fundingAmount ?? null,
    fundingUse: input?.fundingUse ?? null,
    milestones: input?.milestones ?? null,
  };
}

const STRING_FIELDS = [
  "businessName",
  "onePagerPitch",
  "targetCustomer",
  "problemSolved",
  "revenueModel",
  "competitiveEdge",
  "unitLabel",
  "marketingPlan",
  "fundingUse",
  "milestones",
] as const;

const NUMBER_FIELDS = [
  "startupCosts",
  "monthlyCosts",
  "pricePerUnit",
  "variableCostPerUnit",
  "expectedMonthlyUnits",
  "fundingAmount",
] as const;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const input = await prisma.businessPlanInput.findUnique({ where: { userId: session.user.id } });
  return NextResponse.json(serialize(input));
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const data: Record<string, string | number | boolean | null> = {};
  for (const field of STRING_FIELDS) {
    const value = (body as Record<string, unknown>)[field];
    if (value === undefined) continue;
    data[field] = typeof value === "string" && value.trim() ? value.trim() : null;
  }
  for (const field of NUMBER_FIELDS) {
    const value = (body as Record<string, unknown>)[field];
    if (value === undefined) continue;
    const num = typeof value === "number" ? value : typeof value === "string" ? parseFloat(value) : NaN;
    data[field] = Number.isFinite(num) ? num : null;
  }
  if (typeof (body as Record<string, unknown>).fundingNeeded === "boolean") {
    data.fundingNeeded = (body as Record<string, unknown>).fundingNeeded as boolean;
  }

  const updated = await prisma.businessPlanInput.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, ...data },
    update: data,
  });

  return NextResponse.json(serialize(updated));
}
