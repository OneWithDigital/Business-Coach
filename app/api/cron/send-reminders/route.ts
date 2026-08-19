import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { computeReminders } from "@/lib/calc/reminders";
import { sendEmail, reminderEmail } from "@/lib/email";

const LOOKAHEAD_DAYS = 14;

/**
 * Meant to be hit once a day by an external cron (see DEPLOYMENT.md) —
 * there's no in-process scheduler here, since this app runs as a single
 * Next.js container with no background-worker process. Protected by a
 * shared secret rather than auth, since the caller is a cron job, not a
 * browser session.
 *
 * Idempotent: safe to call more than once a day. Each reminder is keyed by
 * (user, reminder id, computed due date) in ReminderLog, so a reminder for
 * a specific deadline instance only ever goes out once, no matter how many
 * times this endpoint runs before that deadline passes.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured." }, { status: 503 });
  }
  const provided = request.headers.get("x-cron-secret");
  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const profiles = await prisma.businessProfile.findMany({
    where: { formationDate: { not: null } },
    include: { user: { select: { id: true, email: true } } },
  });

  const now = new Date();
  const lookaheadMs = LOOKAHEAD_DAYS * 24 * 60 * 60 * 1000;

  let sent = 0;
  let skipped = 0;

  for (const profile of profiles) {
    const reminders = computeReminders({
      state: profile.state,
      formationDate: profile.formationDate,
      today: now,
    });

    for (const reminder of reminders) {
      if (!reminder.dueDate) continue;
      const msUntilDue = reminder.dueDate.getTime() - now.getTime();
      if (msUntilDue < 0 || msUntilDue > lookaheadMs) continue;

      const deadlineKey = `${reminder.id}:${reminder.dueDate.toISOString().slice(0, 10)}`;

      const alreadySent = await prisma.reminderLog.findUnique({
        where: { userId_reminderId_deadlineKey: { userId: profile.userId, reminderId: reminder.id, deadlineKey } },
      });
      if (alreadySent) {
        skipped += 1;
        continue;
      }

      const { subject, html, text } = reminderEmail({
        title: reminder.title,
        dueDate: reminder.dueDate,
        hedge: reminder.hedge,
      });
      const ok = await sendEmail({ to: profile.user.email, subject, html, text });

      // Log the send attempt either way — if email isn't configured, we'd
      // otherwise retry (and log a warning) every single day until it is.
      await prisma.reminderLog.create({
        data: { userId: profile.userId, reminderId: reminder.id, deadlineKey },
      });
      if (ok) sent += 1;
    }
  }

  return NextResponse.json({ ok: true, sent, skipped, profilesChecked: profiles.length });
}
