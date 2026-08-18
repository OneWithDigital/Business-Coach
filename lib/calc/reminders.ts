export interface ReminderInput {
  state?: string | null;
  formationDate?: Date | null;
  /** Injectable for tests; defaults to the real current date. */
  today?: Date;
}

export interface Reminder {
  id: string;
  title: string;
  /** null when there's no way to estimate a specific date. */
  dueDate: Date | null;
  hedge: string;
}

function nextAnniversary(formationDate: Date, today: Date): Date {
  const next = new Date(today.getFullYear(), formationDate.getMonth(), formationDate.getDate());
  if (next.getTime() < today.getTime()) {
    next.setFullYear(next.getFullYear() + 1);
  }
  return next;
}

function nextQuarterlyTaxDate(today: Date): Date {
  const year = today.getFullYear();
  const candidates = [
    new Date(year, 0, 15),
    new Date(year, 3, 15),
    new Date(year, 5, 15),
    new Date(year, 8, 15),
    new Date(year + 1, 0, 15),
  ];
  const upcoming = candidates.find((d) => d.getTime() >= today.getTime());
  return upcoming ?? candidates[candidates.length - 1]!;
}

/**
 * Deliberately generic. State annual-report rules (fixed calendar date vs.
 * formation anniversary, annual vs. biennial, fee amounts) vary too much to
 * hardcode per-state without a maintained dataset we don't have yet — every
 * estimate here is hedged rather than asserted, same pattern as the Stage 4
 * BOI/FinCEN callout.
 */
export function computeReminders(input: ReminderInput): Reminder[] {
  const today = input.today ?? new Date();
  const reminders: Reminder[] = [];

  if (input.formationDate) {
    reminders.push({
      id: "annual-report",
      title: "Annual/periodic report filing",
      dueDate: nextAnniversary(input.formationDate, today),
      hedge: input.state
        ? `Estimated from your formation date — confirm the actual deadline and fee with ${input.state}'s Secretary of State (some states use a fixed calendar date instead of your formation anniversary, or file biennially rather than annually).`
        : "Estimated from your formation date — confirm the actual deadline with your state's Secretary of State (some states use a fixed calendar date instead of your formation anniversary, or file biennially rather than annually).",
    });
  }

  reminders.push({
    id: "quarterly-estimated-taxes",
    title: "Estimated quarterly tax payment",
    dueDate: nextQuarterlyTaxDate(today),
    hedge: "Standard IRS quarterly estimated tax due dates — shifts a day or two if the date falls on a weekend/holiday. Only applies if you expect to owe enough tax to require estimated payments; check with a CPA if unsure.",
  });

  reminders.push({
    id: "license-permit-renewals",
    title: "License/permit renewals",
    dueDate: null,
    hedge: "Any state or local license/permit from Stage 4 has its own renewal schedule — track each one's actual expiration date directly with the issuing agency.",
  });

  return reminders;
}
