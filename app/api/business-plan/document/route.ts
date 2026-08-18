import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const doc = await prisma.businessPlanDocument.findUnique({ where: { userId: session.user.id } });
  if (!doc) {
    return NextResponse.json({ document: null });
  }

  return NextResponse.json({
    document: { content: doc.content, generatedAt: doc.generatedAt.toISOString() },
  });
}
