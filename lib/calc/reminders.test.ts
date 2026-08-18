import { describe, expect, it } from "vitest";
import { computeReminders } from "./reminders";

describe("computeReminders", () => {
  it("omits the annual report reminder when no formation date is given", () => {
    const reminders = computeReminders({ today: new Date(2026, 0, 1) });
    expect(reminders.find((r) => r.id === "annual-report")).toBeUndefined();
  });

  it("estimates next annual report as the upcoming formation-date anniversary", () => {
    const reminders = computeReminders({
      formationDate: new Date(2024, 5, 10), // June 10
      today: new Date(2026, 0, 1), // Jan 1, 2026
    });
    const annual = reminders.find((r) => r.id === "annual-report");
    expect(annual?.dueDate).toEqual(new Date(2026, 5, 10));
  });

  it("rolls the anniversary to next year once it's already passed this year", () => {
    const reminders = computeReminders({
      formationDate: new Date(2024, 0, 10), // Jan 10
      today: new Date(2026, 5, 1), // June 1, 2026 — Jan 10 already passed
    });
    const annual = reminders.find((r) => r.id === "annual-report");
    expect(annual?.dueDate).toEqual(new Date(2027, 0, 10));
  });

  it("includes the state name in the annual report hedge when provided", () => {
    const reminders = computeReminders({
      formationDate: new Date(2024, 5, 10),
      state: "Texas",
      today: new Date(2026, 0, 1),
    });
    const annual = reminders.find((r) => r.id === "annual-report");
    expect(annual?.hedge).toContain("Texas");
  });

  it("picks the nearest upcoming quarterly estimated tax date", () => {
    const reminders = computeReminders({ today: new Date(2026, 1, 1) }); // Feb 1
    const quarterly = reminders.find((r) => r.id === "quarterly-estimated-taxes");
    expect(quarterly?.dueDate).toEqual(new Date(2026, 3, 15)); // April 15
  });

  it("rolls quarterly tax date into next year after the last Q4/Jan date passes", () => {
    const reminders = computeReminders({ today: new Date(2026, 11, 20) }); // Dec 20
    const quarterly = reminders.find((r) => r.id === "quarterly-estimated-taxes");
    expect(quarterly?.dueDate).toEqual(new Date(2027, 0, 15));
  });

  it("always includes the license/permit renewal reminder with no specific date", () => {
    const reminders = computeReminders({ today: new Date(2026, 0, 1) });
    const licenses = reminders.find((r) => r.id === "license-permit-renewals");
    expect(licenses).toBeDefined();
    expect(licenses?.dueDate).toBeNull();
  });
});
