import { Resend } from "resend";

/**
 * Thin wrapper around Resend, following the same graceful-degradation
 * pattern as the Anthropic integration: without RESEND_API_KEY set, this
 * logs a clear "not configured" warning and returns instead of throwing —
 * callers (signup, password reset, reminders) can proceed without email
 * actually blocking anything they don't strictly need to block.
 */
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export function isEmailConfigured(): boolean {
  return resend !== null && Boolean(process.env.EMAIL_FROM);
}

export async function sendEmail(input: { to: string; subject: string; html: string; text: string }): Promise<boolean> {
  if (!resend || !process.env.EMAIL_FROM) {
    console.warn(`[email] Not configured (RESEND_API_KEY/EMAIL_FROM missing) — skipped "${input.subject}" to ${input.to}`);
    return false;
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
    return true;
  } catch (err) {
    console.error(`[email] Send failed for "${input.subject}" to ${input.to}:`, err);
    return false;
  }
}

function wrapper(bodyHtml: string): string {
  return `<div style="font-family:-apple-system,Segoe UI,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#0f172a">
    <p style="font-size:14px;font-weight:700;letter-spacing:0.02em;color:#0f172a;margin:0 0 24px">Business Formation Coach</p>
    ${bodyHtml}
    <p style="margin-top:32px;font-size:12px;color:#94a3b8">Business Formation Coach — built by One With Digital.</p>
  </div>`;
}

function appUrl(path: string): string {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path}`;
}

export function passwordResetEmail(token: string): { subject: string; html: string; text: string } {
  const url = appUrl(`/reset-password?token=${token}`);
  return {
    subject: "Reset your password",
    html: wrapper(`
      <p style="font-size:15px;line-height:1.6">Someone requested a password reset for this account. If that was you, set a new password here — this link expires in 1 hour:</p>
      <p style="margin:20px 0"><a href="${url}" style="display:inline-block;background:#0f172a;color:#fff;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">Reset password</a></p>
      <p style="font-size:13px;color:#64748b">If you didn't request this, you can safely ignore this email — your password won't change.</p>
    `),
    text: `Reset your password: ${url}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`,
  };
}

export function verificationEmail(token: string): { subject: string; html: string; text: string } {
  const url = appUrl(`/verify-email?token=${token}`);
  return {
    subject: "Verify your email",
    html: wrapper(`
      <p style="font-size:15px;line-height:1.6">Confirm this is your email address to finish setting up your account:</p>
      <p style="margin:20px 0"><a href="${url}" style="display:inline-block;background:#0f172a;color:#fff;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">Verify email</a></p>
      <p style="font-size:13px;color:#64748b">This link expires in 24 hours. Nothing in the app is locked while you wait — this is just so we can reach you.</p>
    `),
    text: `Verify your email: ${url}\n\nThis link expires in 24 hours.`,
  };
}

export function reminderEmail(input: { title: string; dueDate: Date; hedge: string }): { subject: string; html: string; text: string } {
  const dateStr = input.dueDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  const url = appUrl("/stage/ongoing-compliance-growth");
  return {
    subject: `Upcoming: ${input.title} (~${dateStr})`,
    html: wrapper(`
      <p style="font-size:15px;line-height:1.6"><strong>${input.title}</strong> is coming up around <strong>${dateStr}</strong>.</p>
      <p style="font-size:13px;color:#64748b;line-height:1.6">${input.hedge}</p>
      <p style="margin:20px 0"><a href="${url}" style="display:inline-block;background:#0f172a;color:#fff;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">Open Ongoing Compliance</a></p>
    `),
    text: `${input.title} is coming up around ${dateStr}.\n\n${input.hedge}\n\n${url}`,
  };
}
