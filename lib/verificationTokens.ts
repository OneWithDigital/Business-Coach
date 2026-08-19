import crypto from "crypto";
import { prisma } from "./db";
import type { TokenPurpose } from "@prisma/client";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function ttlForPurpose(purpose: TokenPurpose): number {
  return purpose === "PASSWORD_RESET" ? RESET_TOKEN_TTL_MS : VERIFY_TOKEN_TTL_MS;
}

export async function createVerificationToken(userId: string, purpose: TokenPurpose): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: {
      token,
      purpose,
      userId,
      expiresAt: new Date(Date.now() + ttlForPurpose(purpose)),
    },
  });
  return token;
}

export interface ConsumeResult {
  ok: boolean;
  userId?: string;
}

/** Looks up a token, checks purpose/expiry/reuse, and marks it used in one call. */
export async function consumeVerificationToken(token: string, purpose: TokenPurpose): Promise<ConsumeResult> {
  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record || record.purpose !== purpose || record.usedAt || record.expiresAt < new Date()) {
    return { ok: false };
  }
  await prisma.verificationToken.update({ where: { token }, data: { usedAt: new Date() } });
  return { ok: true, userId: record.userId };
}
