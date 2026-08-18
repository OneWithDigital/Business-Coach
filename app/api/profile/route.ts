import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.businessProfile.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json({
    entityType: profile?.entityType ?? null,
    state: profile?.state ?? null,
    formationDate: profile?.formationDate?.toISOString() ?? null,
  });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const entityType = typeof body?.entityType === "string" && body.entityType.trim() ? body.entityType.trim() : null;
  const state = typeof body?.state === "string" && body.state.trim() ? body.state.trim() : null;
  const formationDateRaw = typeof body?.formationDate === "string" && body.formationDate ? body.formationDate : null;
  const formationDate = formationDateRaw ? new Date(formationDateRaw) : null;
  if (formationDateRaw && Number.isNaN(formationDate?.getTime())) {
    return NextResponse.json({ error: "Invalid formationDate." }, { status: 400 });
  }

  const profile = await prisma.businessProfile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, entityType, state, formationDate },
    update: { entityType, state, formationDate },
  });

  return NextResponse.json({
    entityType: profile.entityType,
    state: profile.state,
    formationDate: profile.formationDate?.toISOString() ?? null,
  });
}
