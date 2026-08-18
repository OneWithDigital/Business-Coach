import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
import { isLikelyBot } from "@/lib/botCheck";

const MAX_MESSAGE_LENGTH = 2000;

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  // Keyed by user id when logged in, IP when not — guests can leave feedback too.
  const limitKey = session ? `feedback:user:${session.user.id}` : `feedback:ip:${getClientIp(request)}`;
  const limit = rateLimit(limitKey, 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too much feedback too fast — try again in a bit." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const body = await request.json().catch(() => null);

  // Bots get a fake success — nothing is written, but there's no useful
  // signal in an error response to help them adapt.
  if (isLikelyBot({ honeypot: body?.honeypot, formRenderedAt: body?.formRenderedAt })) {
    return NextResponse.json({ ok: true });
  }

  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const ratingRaw = body?.rating;
  const rating = typeof ratingRaw === "number" && ratingRaw >= 1 && ratingRaw <= 5 ? Math.round(ratingRaw) : null;
  const email = typeof body?.email === "string" && body.email.trim() ? body.email.trim() : null;
  const page = typeof body?.page === "string" ? body.page.slice(0, 200) : null;

  if (!message) {
    return NextResponse.json({ error: "Feedback message is required." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "That's a bit long — try trimming it down." }, { status: 400 });
  }

  await prisma.feedback.create({
    data: {
      userId: session?.user.id ?? null,
      email: session ? null : email,
      message,
      rating,
      page,
    },
  });

  return NextResponse.json({ ok: true });
}
