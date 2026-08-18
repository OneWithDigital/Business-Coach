import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const feedback = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { email: true } } },
  });

  return NextResponse.json({
    feedback: feedback.map((f) => ({
      id: f.id,
      message: f.message,
      rating: f.rating,
      page: f.page,
      email: f.user?.email ?? f.email,
      createdAt: f.createdAt.toISOString(),
    })),
  });
}
