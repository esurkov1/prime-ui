import { describe, expect, it } from "vitest";

import { daysBetween, formatClock, formatTimeOfDay, zonedParts } from "./formatClock";

describe("formatClock", () => {
  it("prints m:ss, and h:mm:ss from an hour on", () => {
    expect(formatClock(0)).toBe("0:00");
    expect(formatClock(75)).toBe("1:15");
    expect(formatClock(3600 + 62)).toBe("1:01:02");
  });

  it("rounds to the second and never goes below zero", () => {
    expect(formatClock(59.6)).toBe("1:00");
    expect(formatClock(-3)).toBe("0:00");
    expect(formatClock(Number.NaN)).toBe("0:00");
  });
});

describe("formatTimeOfDay", () => {
  it("prints HH:mm, 24-hour", () => {
    expect(formatTimeOfDay(new Date(2026, 2, 12, 9, 5))).toBe("09:05");
    expect(formatTimeOfDay(new Date(2026, 2, 12, 23, 40))).toBe("23:40");
  });

  it("reads the clock in a given zone", () => {
    const moment = new Date(Date.UTC(2026, 2, 12, 22, 5));
    expect(formatTimeOfDay(moment, "UTC")).toBe("22:05");
    expect(formatTimeOfDay(moment, "Asia/Vladivostok")).toBe("08:05");
    expect(formatTimeOfDay(new Date(Date.UTC(2026, 2, 12, 0, 0)), "UTC")).toBe("00:00");
  });
});

describe("zonedParts", () => {
  it("reads the calendar day of a zone, the next day east of UTC", () => {
    const moment = new Date(Date.UTC(2026, 2, 12, 22, 5));
    expect(zonedParts(moment, "UTC")).toMatchObject({ year: 2026, month: 2, day: 12, weekday: 4 });
    expect(zonedParts(moment, "Asia/Vladivostok")).toMatchObject({ day: 13, weekday: 5 });
  });

  it("counts calendar days across a month and a year", () => {
    const a = zonedParts(new Date(Date.UTC(2025, 11, 31, 12)), "UTC");
    const b = zonedParts(new Date(Date.UTC(2026, 0, 2, 1)), "UTC");
    expect(daysBetween(a, b)).toBe(2);
    expect(daysBetween(b, a)).toBe(-2);
  });
});
