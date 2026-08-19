import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
import { isLikelyBot } from "@/lib/botCheck";
import { createVerificationToken } from "@/lib/verificationTokens";
import { sendEmail, passwordResetEmail } from "@/lib/email";

/**
 * Always responds with the same generic message regardless of whether the
 * email exists — same "don't tell an attacker what they hit" principle as
 * the login rate limiter in lib/auth.ts.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(`forgot-password:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const body = await request.json().catch(() => null);
  const generic = { message: "If an account exists for that email, a reset link is on its way." };

  if (isLikelyBot({ honeypot: body?.honeypot, formRenderedAt: body?.formRenderedAt })) {
    return NextResponse.json(generic);
  }

  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email) return NextResponse.json(generic);

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = await createVerificationToken(user.id, "PASSWORD_RESET");
    const { subject, html, text } = passwordResetEmail(token);
    await sendEmail({ to: user.email, subject, html, text });
  }

  return NextResponse.json(generic);
}
