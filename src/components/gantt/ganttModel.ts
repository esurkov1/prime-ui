import {
  addDays,
  addMonths,
  addYears,
  differenceInCalendarDays,
  format,
  isSameMonth,
  isSameYear,
  type Locale,
  max as maxDate,
  min as minDate,
  startOfDay,
  startOfMonth,
  startOfYear,
} from "date-fns";

import type { PaletteColor, Tone } from "@/internal/states";

/**
 * Gantt logic without time zones: every date is a calendar day (local midnight), like Datepicker.
 * Geometry is in days from the range start; the time core turns days into px (`timeCore`).
 */

/**
 * A step of the time axis, always on the calendar's own boundaries, so steps nest and a month's
 * or a year's start is always a tick: `every` days counted from each month's 1st (1, 8, 15, 22,
 * 29 — the last cell of a month runs short), `every` months from January, `every` years.
 */
export type TimeStep = { family: "day" | "month" | "year"; every: number };

/** One day: the step of every edit without Alt and of the grid once days are wide enough. */
export const DAY_STEP: TimeStep = { family: "day", every: 1 };

/** A named zoom of the selector: a day, a week or a month in view per cell. */
export type GanttZoomPreset = "day" | "week" | "month";

/** The zoom of the time axis: a preset, or the length of a day in px (a pinch, the wheel, a key). */
export type GanttZoom = GanttZoomPreset | number;

/** A time span. `end` is exclusive: a one-day task on 3 July ends on 4 July. */
export type GanttDates = { start: Date; end: Date };

/** One bar of a row. `start` equal to `end` is a milestone (a diamond on that day). */
export type GanttBar = GanttDates & {
  /** Stable id, unique across the chart. */
  id: string;
  /** Text inside the bar (beside it when the bar is too short) and in its accessible name. */
  label: string;
  /** Palette hue. Default: the hue of its `category`, else `blue`. */
  color?: PaletteColor;
  /** Id of the bar's `GanttCategory`: its hue, its legend entry, and hidden with it. */
  category?: string;
  /** Status color; wins over `color`. */
  tone?: Tone;
  /** Share done, `0…1`: a stronger fill from the start of the bar. */
  progress?: number;
  /**
   * Which dates a person may change: `all` (move and both edges), `end` (only the end: a rental
   * already under way), `none` (a public holiday, a closed phase). Default `all`.
   */
  edit?: GanttBarEdit;
};

/** A kind of bar (rentals, bookings, service): a legend entry and a choice of «what to show». */
export type GanttCategory = {
  /** Stable id: `GanttBar.category` and `hiddenCategories` refer to it. */
  id: string;
  /** Text of its legend entry and of its item in `GanttCategoriesMenu`. */
  label: string;
  /** Palette hue of its bars and its legend dot. Default `blue`. */
  color?: PaletteColor;
};

/** The edits a bar allows: every edit, only its end, or none. */
export type GanttBarEdit = "all" | "end" | "none";

/** The edits a bar at `dates` allows: a milestone has no end of its own, so `end` leaves it still. */
export function barEdit(bar: Pick<GanttBar, "edit">, dates: GanttDates): GanttBarEdit {
  const edit = bar.edit ?? "all";
  return edit === "end" && isMilestone(dates) ? "none" : edit;
}

/** Empty room before the first and after the last bar (and today), in months. */
const PAD_MONTHS = 1;

/** Shortest default axis, in months: room to zoom out to a year. */
const MIN_MONTHS = 12;

/** Days in a step, on average (months and years vary; steps go through `stepShift`). */
export function stepDays(step: TimeStep): number {
  if (step.family === "day") return step.every;
  return step.every * (step.family === "month" ? 30.44 : 365.25);
}

/** The tick of `step` at or before `date`: where the cell that holds `date` starts. */
export function stepStart(date: Date, step: TimeStep): Date {
  const day = startOfDay(date);
  if (step.family === "day") {
    const offset = day.getDate() - 1;
    return addDays(startOfMonth(day), offset - (offset % step.every));
  }
  if (step.family === "month") {
    const year = startOfYear(day);
    return addMonths(year, day.getMonth() - (day.getMonth() % step.every));
  }
  const year = day.getFullYear();
  return new Date(year - (((year % step.every) + step.every) % step.every), 0, 1);
}

/** The tick after the one at or before `date`: a day step ends a cell at the next month's 1st. */
function nextTick(date: Date, step: TimeStep): Date {
  const start = stepStart(date, step);
  if (step.family === "day") {
    const next = addDays(start, step.every);
    const month = addMonths(startOfMonth(start), 1);
    return next < month ? next : month;
  }
  return step.family === "month" ? addMonths(start, step.every) : addYears(start, step.every);
}

/**
 * `date` moved by `steps` ticks of `step`: forward to each next tick, back to each tick before.
 * A day step of one day is `addDays`; on a tick it is a whole cell at a time.
 */
export function stepShift(date: Date, steps: number, step: TimeStep): Date {
  if (steps === 0) return date;
  if (step.family === "day" && step.every === 1) return addDays(date, steps);
  let at = date;
  for (let count = 0; count < Math.abs(steps); count++) {
    at = steps > 0 ? nextTick(at, step) : stepStart(addDays(at, -1), step);
  }
  return at;
}

/**
 * The tick of `step` nearest to `day` (days from `origin`, fractional), as days from `origin`:
 * where a gesture lands on the grid it sees.
 */
function nearestLine(origin: Date, day: number, step: TimeStep): number {
  if (step.family === "day" && step.every === 1) return Math.round(day);
  const before = stepStart(addDays(origin, Math.floor(day)), step);
  const from = daysBetween(origin, before);
  const to = daysBetween(origin, nextTick(before, step));
  return day - from <= to - day ? from : to;
}

/** Days between two calendar dates (`b − a`). */
export function daysBetween(a: Date, b: Date): number {
  return differenceInCalendarDays(b, a);
}

export function isMilestone(dates: GanttDates): boolean {
  return daysBetween(dates.start, dates.end) <= 0;
}

/**
 * The axis: `range` when given (whole days, as given), otherwise every bar and today with a month
 * of room on both sides, from the 1st of a month, at least `MIN_MONTHS` long — one axis for every
 * zoom, so a zoom never moves the days under the view.
 */
export function resolveRange(
  bars: readonly GanttDates[],
  today: Date,
  range?: GanttDates,
): GanttDates {
  if (range) {
    const start = startOfDay(range.start);
    const end = startOfDay(range.end);
    return { start, end: end > start ? end : addDays(start, 1) };
  }
  const starts = [today, ...bars.map((bar) => bar.start)];
  const ends = [addDays(today, 1), ...bars.map((bar) => bar.end)];
  const start = startOfMonth(addMonths(minDate(starts), -PAD_MONTHS));
  const to = addMonths(maxDate(ends), PAD_MONTHS);
  let end = startOfMonth(to);
  if (end < to) end = addMonths(end, 1);
  const shortest = addMonths(start, MIN_MONTHS);
  return { start, end: end < shortest ? shortest : end };
}

/**
 * Lanes of one row: bars that overlap in time go to separate lanes, each bar to the first lane
 * that is free at its start. A milestone takes its day. Returns the lane per bar id and the count.
 */
export function assignLanes(bars: readonly GanttBar[]): {
  lanes: Map<string, number>;
  count: number;
} {
  const sorted = [...bars].sort(
    (a, b) => a.start.getTime() - b.start.getTime() || a.end.getTime() - b.end.getTime(),
  );
  const laneEnds: number[] = [];
  const lanes = new Map<string, number>();
  for (const bar of sorted) {
    const start = bar.start.getTime();
    const end = Math.max(bar.end.getTime(), addDays(bar.start, 1).getTime());
    let lane = laneEnds.findIndex((laneEnd) => laneEnd <= start);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(end);
    } else {
      laneEnds[lane] = end;
    }
    lanes.set(bar.id, lane);
  }
  return { lanes, count: Math.max(1, laneEnds.length) };
}

/** What a pointer or a key changes: the whole bar, its start or its end. */
export type GanttEdit = "move" | "start" | "end";

/**
 * The dates after `steps` steps of `edit`, a step being one tick of `step`: a day (the keyboard's
 * precision at every zoom), or the head's step with Alt. A move takes the start to the tick and
 * keeps the length; a resize clamps at the opposite edge: a bar is never shorter than one day and
 * never flips; a milestone only moves.
 */
export function applyEdit(
  dates: GanttDates,
  edit: GanttEdit,
  steps: number,
  step: TimeStep,
): GanttDates {
  if (edit === "move" || isMilestone(dates)) {
    const start = stepShift(dates.start, steps, step);
    return { start, end: addDays(dates.end, daysBetween(dates.start, start)) };
  }
  if (edit === "start") {
    const start = stepShift(dates.start, steps, step);
    const latest = addDays(dates.end, -1);
    return { start: start > latest ? latest : start, end: dates.end };
  }
  const end = stepShift(dates.end, steps, step);
  const earliest = addDays(dates.start, 1);
  return { start: dates.start, end: end < earliest ? earliest : end };
}

/**
 * The dates a pointer drag of `raw` days (fractional) lands on with Alt: the edge it moves — the
 * start for a move — goes to the tick of `step` (the head's) nearest to where the pointer took it.
 * What you see is what you land on. Clamped as `applyEdit` is.
 */
export function snapEdit(
  dates: GanttDates,
  edit: GanttEdit,
  raw: number,
  step: TimeStep,
  origin: Date,
): GanttDates {
  const x = daysBetween(origin, dates.start);
  if (edit === "end" && !isMilestone(dates)) {
    const end = x + daysBetween(dates.start, dates.end);
    return applyEdit(dates, "end", nearestLine(origin, end + raw, step) - end, DAY_STEP);
  }
  return applyEdit(dates, edit, nearestLine(origin, x + raw, step) - x, DAY_STEP);
}

/**
 * Hysteresis of a day snap, in days: an edge leaves its day only when the pointer passes the
 * middle by this much (and at least ~2 px), so at a few px per day it never jitters between two.
 */
export function snapHysteresis(px: number): number {
  return Math.min(0.4, Math.max(0.15, px > 0 ? 2 / px : 0.15));
}

/** `raw` (days, fractional) rounded to whole days, keeping `current` until `raw` clearly leaves it. */
export function stickyRound(raw: number, current: number, hysteresis: number): number {
  return Math.abs(raw - current) < 0.5 + hysteresis ? current : Math.round(raw);
}

/** The whole day under `raw` (days from the start), keeping `current` near its edges. */
export function stickyFloor(raw: number, current: number | null, hysteresis: number): number {
  if (current !== null && raw >= current - hysteresis && raw < current + 1 + hysteresis) {
    return current;
  }
  return Math.floor(raw);
}

export function sameDates(a: GanttDates, b: GanttDates): boolean {
  return a.start.getTime() === b.start.getTime() && a.end.getTime() === b.end.getTime();
}

/** «3 июля 2026» — the spoken and tooltip form of a day. */
export function formatDay(date: Date, locale: Locale, withYear = true): string {
  return format(date, withYear ? "d MMMM yyyy" : "d MMMM", { locale });
}

/** Display of a span: «3 – 14 июля», «28 июня – 4 июля», a milestone «3 июля»; the last day is inclusive. */
export function formatSpan(dates: GanttDates, locale: Locale): string {
  if (isMilestone(dates)) return formatDay(dates.start, locale, false);
  const last = addDays(dates.end, -1);
  if (daysBetween(dates.start, last) === 0) return formatDay(dates.start, locale, false);
  if (!isSameYear(dates.start, last)) {
    return `${formatDay(dates.start, locale)} – ${formatDay(last, locale)}`;
  }
  if (isSameMonth(dates.start, last)) {
    return `${format(dates.start, "d", { locale })} – ${formatDay(last, locale, false)}`;
  }
  return `${formatDay(dates.start, locale, false)} – ${formatDay(last, locale, false)}`;
}

/**
 * A focusable cell in reading order: a row header (`row`) or a bar, with its row index and, for a
 * bar, its centre in days. Items come row by row, the header first, then the bars in time order.
 */
export type GanttNavItem = { id: string; row: number; center: number; kind: "row" | "bar" };

/**
 * The cell a navigation key moves to, or `null`. ←/→ step along the row (its header, then its
 * bars in time order) and stop at the ends. ↑/↓ from a bar go to the nearest bar in time of the
 * closest row that has bars; from a row header, to the header of the next row (empty rows too).
 * Home/End — first/last bar of the row; Ctrl+Home/End — of the chart.
 */
export function navigate(
  items: readonly GanttNavItem[],
  currentId: string,
  key: string,
  ctrl: boolean,
): string | null {
  const current = items.find((item) => item.id === currentId);
  if (!current) return items[0]?.id ?? null;
  const inRow = items.filter((item) => item.row === current.row);
  const index = inRow.indexOf(current);
  const bars = (list: readonly GanttNavItem[]) => list.filter((item) => item.kind === "bar");
  switch (key) {
    case "ArrowRight":
      return inRow[index + 1]?.id ?? null;
    case "ArrowLeft":
      return inRow[index - 1]?.id ?? null;
    case "Home": {
      const list = bars(ctrl ? items : inRow);
      return list[0]?.id ?? null;
    }
    case "End": {
      const list = bars(ctrl ? items : inRow);
      return list[list.length - 1]?.id ?? null;
    }
    case "ArrowDown":
    case "ArrowUp": {
      const down = key === "ArrowDown";
      let target: number | null = null;
      for (const item of items) {
        if (item.kind !== current.kind) continue;
        if (down ? item.row <= current.row : item.row >= current.row) continue;
        if (target === null || (down ? item.row < target : item.row > target)) target = item.row;
      }
      if (target === null) return null;
      let best: GanttNavItem | null = null;
      for (const item of items) {
        if (item.row !== target || item.kind !== current.kind) continue;
        if (
          !best ||
          Math.abs(item.center - current.center) < Math.abs(best.center - current.center)
        ) {
          best = item;
        }
      }
      return best?.id ?? null;
    }
    default:
      return null;
  }
}

/** A box in viewport px. */
export type GanttRect = { top: number; left: number; right: number; bottom: number };

/**
 * The part of `rect` inside `viewport` (the timeline: the scroller without its sticky header and
 * label column), as an anchor rect, or `null` when nothing of it is visible.
 */
export function visibleSegment(
  rect: GanttRect,
  viewport: GanttRect,
): (GanttRect & { width: number; height: number }) | null {
  const left = Math.max(rect.left, viewport.left);
  const right = Math.min(rect.right, viewport.right);
  const top = Math.max(rect.top, viewport.top);
  const bottom = Math.min(rect.bottom, viewport.bottom);
  if (right <= left || bottom <= top) return null;
  return { left, right, top, bottom, width: right - left, height: bottom - top };
}
