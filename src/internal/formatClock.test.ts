import { describe, expect, it } from "vitest";

import { formatClock, formatTimeOfDay } from "./formatClock";

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
});
