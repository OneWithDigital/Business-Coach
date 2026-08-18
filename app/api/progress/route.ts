import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { STAGES } from "@/lib/stages";

const VALID_STAGE_IDS = new Set(STAGES.map((s) => s.id));

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.stageProgress.findMany({
    where: { userId: session.user.id },
    select: { stageId: true },
  });

  return NextResponse.json({ completed: rows.map((r) => r.stageId) });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const stageId = typeof body?.stageId === "number" ? body.stageId : null;
  if (stageId === null || !VALID_STAGE_IDS.has(stageId)) {
    return NextResponse.json({ error: "Invalid stageId." }, { status: 400 });
  }

  await prisma.stageProgress.upsert({
    where: { userId_stageId: { userId: session.user.id, stageId } },
    create: { userId: session.user.id, stageId },
    update: {},
  });

  const rows = await prisma.stageProgress.findMany({
    where: { userId: session.user.id },
    select: { stageId: true },
  });

  return NextResponse.json({ completed: rows.map((r) => r.stageId) });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stageIdParam = request.nextUrl.searchParams.get("stageId");
  const stageId = stageIdParam !== null ? Number(stageIdParam) : NaN;
  if (Number.isNaN(stageId) || !VALID_STAGE_IDS.has(stageId)) {
    return NextResponse.json({ error: "Invalid stageId." }, { status: 400 });
  }

  await prisma.stageProgress.deleteMany({
    where: { userId: session.user.id, stageId },
  });

  const rows = await prisma.stageProgress.findMany({
    where: { userId: session.user.id },
    select: { stageId: true },
  });

  return NextResponse.json({ completed: rows.map((r) => r.stageId) });
}
