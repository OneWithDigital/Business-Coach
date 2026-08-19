import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { getStripeClient, isStripeConfigured, getPlanReviewPriceCents } from "@/lib/stripe";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Paid plan reviews aren't set up yet." }, { status: 503 });
  }

  const limit = rateLimit(`plan-review-checkout:${session.user.id}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  const amountCents = getPlanReviewPriceCents();
  const baseUrl = (process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");

  const lineItem = process.env.STRIPE_PRICE_ID
    ? { price: process.env.STRIPE_PRICE_ID, quantity: 1 }
    : {
        price_data: {
          currency: "usd",
          unit_amount: amountCents,
          product_data: {
            name: "Business plan review",
            description: "A human review of your AI-generated business plan before it goes to a lender.",
          },
        },
        quantity: 1,
      };

  const stripe = getStripeClient();
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    line_items: [lineItem],
    success_url: `${baseUrl}/business-plan?review=success`,
    cancel_url: `${baseUrl}/business-plan?review=canceled`,
    metadata: { userId: user.id },
  });

  await prisma.planReviewOrder.create({
    data: {
      userId: user.id,
      amountCents,
      stripeSessionId: checkoutSession.id,
      status: "pending_payment",
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
