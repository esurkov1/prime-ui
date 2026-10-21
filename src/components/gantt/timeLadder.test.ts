import { ru } from "date-fns/locale";
import { describe, expect, it } from "vitest";

import { DAY_STEP, daysBetween } from "./ganttModel";
import { headLabels, headStepOf } from "./timeHead";
import { gridLines, gridStep, weekendBands, weekendsShown } from "./timeLadder";

const day = (month: number, date: number, year = 2026) => new Date(year, month - 1, date);
const ORIGIN = day(10, 1);
const DAYS = 500;
const dateOf = (offset: number) => new Date(2026, 9, 1 + offset);

describe("grid: one family of lines, one weight", () => {
  it("draws a line every day once a day reads as a column, else the head's own ticks", () => {
    const sevenDays = headStepOf("7days");
    expect(gridStep(6, sevenDays)).toBe(DAY_STEP);
    expect(gridStep(40, sevenDays)).toBe(DAY_STEP);
    expect(gridStep(5, sevenDays)).toBe(sevenDays);
    // A line every day, nothing between and nothing stronger: a line is only its day.
    const lines = gridLines(DAY_STEP, 0, 40, ORIGIN, DAYS);
    expect(lines.map((line) => line.day)).toEqual(Array.from({ length: 39 }, (_, at) => at + 1));
    expect(Object.keys(lines[0]).sort()).toEqual(["day", "key"]);
  });

  it("counts every step coarser than a day from each month's 1st: a month's start is a tick", () => {
    const dates = (id: "2days" | "7days") =>
      gridLines(headStepOf(id), 0, 160, ORIGIN, DAYS).map((line) => dateOf(line.day).getDate());
    // 1, 3, 5… restarting on the 1st, whatever the month's length.
    for (const date of dates("2days")) expect(date % 2).toBe(1);
    // 1, 8, 15, 22, 29, then the next month's 1st: the last cell runs 0–3 days short.
    for (const date of dates("7days")) expect([1, 8, 15, 22, 29]).toContain(date);
    const months = gridLines(headStepOf("7days"), 0, 160, ORIGIN, DAYS).filter(
      (line) => dateOf(line.day).getDate() === 1,
    );
    expect(months.map((line) => dateOf(line.day).getMonth())).toEqual([10, 11, 0, 1, 2]);
    // Quarters from January, years on years.
    const quarters = gridLines(headStepOf("quarter"), 0, DAYS, ORIGIN, DAYS);
    expect(quarters.map((line) => dateOf(line.day).getMonth())).toEqual([0, 3, 6, 9, 0]);
  });

  it("stands every boundary label of a step on one of its lines", () => {
    for (const id of ["2days", "7days", "month", "quarter", "half"] as const) {
      const step = headStepOf(id);
      const ticks = new Set(gridLines(step, 0, DAYS, ORIGIN, DAYS).map((line) => line.day));
      const labels = headLabels(step, 0, DAYS, ORIGIN, DAYS, ru).filter((label) => label.day > 0);
      for (const label of labels) expect(ticks.has(label.day), `${id} ${label.day}`).toBe(true);
      // And no line without its label: the head is the top of the grid.
      expect(labels.length).toBe(ticks.size);
    }
    // «1 янв 2027» on a line of the 7-day step, the 29th of December one tick before it.
    const ticks = gridLines(headStepOf("7days"), 0, DAYS, ORIGIN, DAYS).map((line) => line.day);
    const january = daysBetween(ORIGIN, day(1, 1, 2027));
    expect(ticks).toContain(january);
    expect(ticks[ticks.indexOf(january) - 1]).toBe(daysBetween(ORIGIN, day(12, 29)));
  });

  it("keeps the axis start the head's own edge, never a line", () => {
    const lines = gridLines(headStepOf("month"), 0, 120, ORIGIN, 120);
    expect(lines.some((line) => line.day === 0)).toBe(false);
    expect(lines.every((line) => line.day > 0 && line.day < 120)).toBe(true);
  });

  it("washes weekends only where a day reads as a column, in two-day bands", () => {
    expect(weekendsShown(15)).toBe(false);
    expect(weekendsShown(16)).toBe(true);
    // 6 July 2026 is a Monday: the first Saturday is day 5.
    const bands = weekendBands(0, 21, day(7, 6), 21);
    expect(bands.map((band) => [band.day, band.span])).toEqual([
      [5, 2],
      [12, 2],
      [19, 2],
    ]);
  });
});
