import { addDays } from "date-fns";

import { DAY_STEP, daysBetween, stepShift, stepStart, type TimeStep } from "./ganttModel";

/**
 * The grid of the Gantt's time axis: one family of lines at a time, one weight. Once a day is wide
 * enough to read as a column, a line every day — every coarser boundary is one of them, so it all
 * lines up by itself; below that, a line at every tick of the head's step (`timeHead`), which
 * stands on the calendar's own boundaries. No stronger month or year lines, no line between the
 * family's: the head's ticks are the same lines, so the head reads as the top of the grid.
 */

/** A line every day from this length of a day on, px. */
const DAY_LINES_PX = 6;
/** Weekends wash in only where a day reads as a column, px a day. */
const WEEKEND_FROM_PX = 16;

/** The step the grid draws at this zoom: a day, or the head's own step while days are narrow. */
export function gridStep(dayPx: number, head: TimeStep): TimeStep {
  return dayPx >= DAY_LINES_PX ? DAY_STEP : head;
}

/** Whether the weekends wash in: a day at least `WEEKEND_FROM_PX` wide. */
export function weekendsShown(dayPx: number): boolean {
  return dayPx >= WEEKEND_FROM_PX;
}

/** A line of the grid (and a tick of the head): its day from the axis start. */
export type GridLine = { key: number; day: number };

/** Every tick of `step` in `[from, to)` days of an axis from `origin`, clipped to `[1, days)`. */
export function gridLines(
  step: TimeStep,
  from: number,
  to: number,
  origin: Date,
  days: number,
): GridLine[] {
  const lines: GridLine[] = [];
  const first = Math.max(from, 1);
  const last = Math.min(to, days);
  if (step.family === "day" && step.every === 1) {
    for (let day = Math.ceil(first); day < last; day++) lines.push({ key: day, day });
    return lines;
  }
  let cursor = stepStart(addDays(origin, Math.floor(first)), step);
  for (let day = daysBetween(origin, cursor); day < last; ) {
    if (day >= first) lines.push({ key: day, day });
    cursor = stepShift(cursor, 1, step);
    day = daysBetween(origin, cursor);
  }
  return lines;
}

/** The Saturdays in `[from, to)` days of an axis from `origin`: two-day bands, clipped to it. */
export function weekendBands(
  from: number,
  to: number,
  origin: Date,
  days: number,
): { key: number; day: number; span: number }[] {
  const bands: { key: number; day: number; span: number }[] = [];
  const offset = (6 - origin.getDay() + 7) % 7;
  let day = Math.floor((Math.max(from, 0) - 1 - offset) / 7) * 7 + offset;
  for (; day < Math.min(to, days); day += 7) {
    const start = Math.max(day, 0);
    const end = Math.min(day + 2, days);
    if (end > start && end > from) bands.push({ key: day, day: start, span: end - start });
  }
  return bands;
}
