import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { consumeVerificationToken } from "@/lib/verificationTokens";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  if (!token) {
    return NextResponse.json({ error: "Missing verification token." }, { status: 400 });
  }

  const result = await consumeVerificationToken(token, "EMAIL_VERIFICATION");
  if (!result.ok || !result.userId) {
    return NextResponse.json(
      { error: "This link is invalid or has expired. Request a new one from your account page." },
      { status: 400 }
    );
  }

  await prisma.user.update({ where: { id: result.userId }, data: { emailVerifiedAt: new Date() } });
  return NextResponse.json({ ok: true });
}
