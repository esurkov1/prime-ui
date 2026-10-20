import {
  addDays,
  addMonths,
  addWeeks,
  differenceInCalendarDays,
  format,
  isSameMonth,
  isSameYear,
  type Locale,
  max as maxDate,
  min as minDate,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

import type { PaletteColor, Tone } from "@/internal/states";

/**
 * Gantt logic without time zones: every date is a calendar day (local midnight), like Datepicker.
 * Geometry is in days from the range start; CSS turns days into length (`--gantt-day`).
 */

/** Zoom of the time axis: one column per day, week or month. */
export type GanttScale = "day" | "week" | "month";

/** A time span. `end` is exclusive: a one-day task on 3 July ends on 4 July. */
export type GanttDates = { start: Date; end: Date };

/** One bar of a row. `start` equal to `end` is a milestone (a diamond on that day). */
export type GanttBar = GanttDates & {
  /** Stable id, unique across the chart. */
  id: string;
  /** Text inside the bar (beside it when the bar is too short) and in its accessible name. */
  label: string;
  /** Palette hue for a category. Default `blue`. */
  color?: PaletteColor;
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

/** The edits a bar allows: every edit, only its end, or none. */
export type GanttBarEdit = "all" | "end" | "none";

/** The edits a bar at `dates` allows: a milestone has no end of its own, so `end` leaves it still. */
export function barEdit(bar: Pick<GanttBar, "edit">, dates: GanttDates): GanttBarEdit {
  const edit = bar.edit ?? "all";
  return edit === "end" && isMilestone(dates) ? "none" : edit;
}

export const SCALES: readonly GanttScale[] = ["day", "week", "month"];

/** Days of one snapping step per scale (a month varies; its steps go through `shiftDate`). */
const UNIT_DAYS: Record<GanttScale, number> = { day: 1, week: 7, month: 30.44 };

/** Empty room before the first and after the last bar (and today), in scale units. */
const PAD_UNITS: Record<GanttScale, number> = { day: 7, week: 2, month: 1 };

/** Shortest axis per scale, in scale units, so a short plan still fills a few screens of the scale. */
const MIN_UNITS: Record<GanttScale, number> = { day: 35, week: 14, month: 12 };

export function unitDays(scale: GanttScale): number {
  return UNIT_DAYS[scale];
}

/** `date` moved by `steps` units of the scale (whole days, weeks or calendar months). */
export function shiftDate(date: Date, steps: number, scale: GanttScale): Date {
  if (steps === 0) return date;
  if (scale === "day") return addDays(date, steps);
  if (scale === "week") return addWeeks(date, steps);
  return addMonths(date, steps);
}

/** Start of the scale unit holding `date`: the day, the Monday of its week, the 1st of its month. */
export function unitStart(date: Date, scale: GanttScale): Date {
  if (scale === "day") return startOfDay(date);
  if (scale === "week") return startOfWeek(date, { weekStartsOn: 1 });
  return startOfMonth(date);
}

/** Days between two calendar dates (`b − a`). */
export function daysBetween(a: Date, b: Date): number {
  return differenceInCalendarDays(b, a);
}

export function isMilestone(dates: GanttDates): boolean {
  return daysBetween(dates.start, dates.end) <= 0;
}

/**
 * The axis: `range` when given (snapped to whole units), otherwise every bar and today with
 * `PAD_UNITS` of room on both sides, at least `MIN_UNITS` long.
 */
export function resolveRange(
  bars: readonly GanttDates[],
  today: Date,
  scale: GanttScale,
  range?: GanttDates,
): GanttDates {
  let from: Date;
  let to: Date;
  if (range) {
    from = range.start;
    to = range.end;
  } else {
    const starts = [today, ...bars.map((bar) => bar.start)];
    const ends = [addDays(today, 1), ...bars.map((bar) => bar.end)];
    from = shiftDate(minDate(starts), -PAD_UNITS[scale], scale);
    to = shiftDate(maxDate(ends), PAD_UNITS[scale], scale);
  }
  const start = unitStart(from, scale);
  let end = unitStart(to, scale);
  if (end < to) end = shiftDate(end, 1, scale);
  if (!range) {
    const shortest = shiftDate(start, MIN_UNITS[scale], scale);
    if (end < shortest) end = shortest;
  }
  return { start, end };
}

/** A cell of a header tier, in days from the range start. */
export type GanttHeaderCell = {
  key: string;
  x: number;
  span: number;
  text: string;
  /** Saturday or Sunday (day scale). */
  weekend?: boolean;
  /** The cell holds today. */
  today?: boolean;
  /** Bottom tier: the first cell of a new upper period (a month, a year) after the first. */
  boundary?: boolean;
};

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

const NEXT_UNIT: Record<GanttScale, (date: Date) => Date> = {
  day: (date) => addDays(date, 1),
  week: (date) => addWeeks(date, 1),
  month: (date) => addMonths(date, 1),
};

/**
 * The upper period a bottom cell belongs to: the month of a day; the month of a week's Thursday
 * (ISO: a week belongs to the month that holds most of it); the year of a month.
 */
const PERIOD_OF: Record<GanttScale, (start: Date) => Date> = {
  day: (start) => startOfMonth(start),
  week: (start) => startOfMonth(addDays(start, 3)),
  month: (start) => startOfYear(start),
};

/**
 * The two header tiers of a scale: days under months, weeks under months, months under years.
 * The upper tier is built from whole bottom cells — a month label at the week zoom starts at the
 * first week of that month, never inside a column — and the bottom cell that opens a new period is
 * marked `boundary`.
 */
export function headerTiers(
  scale: GanttScale,
  range: GanttDates,
  today: Date,
  locale: Locale,
): { top: GanttHeaderCell[]; bottom: GanttHeaderCell[] } {
  const next = NEXT_UNIT[scale];
  const bottom: GanttHeaderCell[] = [];
  const top: GanttHeaderCell[] = [];
  let period: number | null = null;
  for (let cursor = range.start; cursor < range.end; cursor = next(cursor)) {
    const to = minDate([next(cursor), range.end]);
    const last = addDays(to, -1);
    const x = daysBetween(range.start, cursor);
    const span = daysBetween(cursor, to);
    const periodStart = PERIOD_OF[scale](cursor);
    const opens = periodStart.getTime() !== period;
    bottom.push({
      key: cursor.toISOString(),
      x,
      span,
      text:
        scale === "day"
          ? format(cursor, "d")
          : scale === "week"
            ? `${format(cursor, "d")}–${format(last, "d")}`
            : format(cursor, "LLLL", { locale }),
      weekend: scale === "day" ? isWeekend(cursor) : undefined,
      today: today >= cursor && today < to ? true : undefined,
      boundary: opens && period !== null ? true : undefined,
    });
    if (opens) {
      period = periodStart.getTime();
      top.push({
        key: periodStart.toISOString(),
        x,
        span,
        text: format(periodStart, scale === "month" ? "yyyy" : "MM.yyyy", { locale }),
      });
    } else {
      top[top.length - 1].span += span;
    }
  }
  return { top, bottom };
}

/**
 * Offset of the week pattern (weekend washes) from the range start, in days: the Monday on or
 * before the start, so the repeating week tile lines up with the calendar. Zero or negative.
 */
export function weekOffset(range: GanttDates): number {
  return -((range.start.getDay() + 6) % 7);
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
 * The dates after `steps` steps of `edit`, a step being one `unit`: a day (the editing precision
 * at every zoom), or the zoom's week / month for a coarse step.
 * A resize clamps at the opposite edge: a bar is never shorter than one day and never flips; a
 * milestone only moves.
 */
export function applyEdit(
  dates: GanttDates,
  edit: GanttEdit,
  steps: number,
  unit: GanttScale,
): GanttDates {
  if (edit === "move" || isMilestone(dates)) {
    return { start: shiftDate(dates.start, steps, unit), end: shiftDate(dates.end, steps, unit) };
  }
  if (edit === "start") {
    const start = shiftDate(dates.start, steps, unit);
    const latest = addDays(dates.end, -1);
    return { start: start > latest ? latest : start, end: dates.end };
  }
  const end = shiftDate(dates.end, steps, unit);
  const earliest = addDays(dates.start, 1);
  return { start: dates.start, end: end < earliest ? earliest : end };
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
