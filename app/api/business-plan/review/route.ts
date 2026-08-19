import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isStripeConfigured, getPlanReviewPriceCents } from "@/lib/stripe";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const order = await prisma.planReviewOrder.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    enabled: isStripeConfigured(),
    priceCents: getPlanReviewPriceCents(),
    order: order ? { status: order.status, createdAt: order.createdAt } : null,
  });
}
