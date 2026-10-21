import {
  addDays,
  addMonths,
  addYears,
  format,
  type Locale,
  startOfMonth,
  startOfYear,
} from "date-fns";

import { daysBetween, type TimeStep } from "./ganttModel";

/**
 * The head of the Gantt's time axis: one row of labels on ONE step at a time, as a ruler does
 * (d3's multi-scale ticks and format, Highcharts' tick pixel interval and boundary ticks,
 * vis-timeline's minimum step, ECharts' label priority by level).
 *
 * - The step is the smallest «nice» interval — 1 day, 2 days, 7 days, 1, 3 or 6 months, 1, 2, 5
 *   or 10 years — whose labels stand far enough apart for the widest of them, MEASURED, plus
 *   margins; a finer step needs 15 % to spare, so a zoom at a threshold never flickers. A step
 *   change cross-fades the label layer.
 * - Every step stands on the calendar's own boundaries (`TimeStep`): 2 and 7 days count from
 *   each month's 1st (1, 3, 5… and 1, 8, 15, 22, 29), months from January — so a month's and a
 *   year's start is always a tick of the step, never a line squeezed between two (weeks do not
 *   nest in months, so there are none).
 * - Three families with one format each, numbers and names only: the days («12») — 2 and 7 days
 *   only thin the same labels, so nothing changes format and nothing overlaps; the months
 *   («Янв»); the years («2027»).
 * - Under the labels a ruler: the grid's own lines (`timeLadder`), one weight — the head is the
 *   top of the grid.
 * - Boundary labels: on a month's 1st the day family writes the date with its month — «1 ноя»,
 *   the number as every day's, the month semibold in the primary text («1 янв 2027» at a year);
 *   the month family names the year at January. A boundary always stands — an ordinary label next
 *   to it fades by the room left, never the boundary.
 * - The boundary of the period at the start edge sticks there, on the head's fill, pushed out by
 *   the next one: the month you are in (the year, from a month step on) is always named.
 */

export type HeadStepId =
  | "day"
  | "2days"
  | "7days"
  | "month"
  | "quarter"
  | "half"
  | "year"
  | "2years"
  | "5years"
  | "10years";

export type HeadStep = TimeStep & {
  id: HeadStepId;
  /**
   * The room its labels are measured in, in days: a full cell (a month step: February). The short
   * last cell of a month gives way to the month's 1st (`placeLabels`).
   */
  minDays: number;
};

/** Finest first. */
const STEPS: readonly HeadStep[] = [
  { id: "day", family: "day", every: 1, minDays: 1 },
  { id: "2days", family: "day", every: 2, minDays: 2 },
  { id: "7days", family: "day", every: 7, minDays: 7 },
  { id: "month", family: "month", every: 1, minDays: 28 },
  { id: "quarter", family: "month", every: 3, minDays: 89 },
  { id: "half", family: "month", every: 6, minDays: 181 },
  { id: "year", family: "year", every: 1, minDays: 365 },
  { id: "2years", family: "year", every: 2, minDays: 730 },
  { id: "5years", family: "year", every: 5, minDays: 1826 },
  { id: "10years", family: "year", every: 10, minDays: 3652 },
];

/** The text widths the head reads: measured once per text and weight, px. */
export type MeasureText = (text: string, strong: boolean) => number;

const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase() + text.slice(1);
/** «Ноя»: the first three letters of the month's own name. */
const monthShort = (date: Date, locale: Locale) =>
  capitalize(format(date, "LLLL", { locale }).slice(0, 3));

/** Every text a step's ordinary labels may show: what its room is measured on. */
export function stepSamples(step: HeadStep, locale: Locale): string[] {
  if (step.family === "year") return ["2027", "2028"];
  if (step.family === "month") {
    return Array.from({ length: 12 }, (_, month) => monthShort(new Date(2027, month, 1), locale));
  }
  return ["28", "30"];
}

/** A finer step is taken only with this much room to spare. */
const ENTER_RATIO = 1.15;

/**
 * The step at `dayPx`: the finest whose ordinary labels, measured, fit `room` (the margin after a
 * tick and the least gap to the next label) apart. From `current`, a finer step needs 15 % to
 * spare. Boundary labels are wider, and are given way to (`placeLabels`).
 */
export function headStep(
  dayPx: number,
  current: HeadStepId | null,
  measure: MeasureText,
  room: number,
  locale: Locale,
): HeadStep {
  const at = current === null ? -1 : STEPS.findIndex((step) => step.id === current);
  for (let index = 0; index < STEPS.length; index++) {
    const step = STEPS[index];
    const strong = step.family === "year";
    const widest = Math.max(...stepSamples(step, locale).map((text) => measure(text, strong)));
    const need = (widest + room) * (index < at ? ENTER_RATIO : 1);
    if (step.minDays * dayPx >= need) return step;
  }
  return STEPS[STEPS.length - 1];
}

export function headStepOf(id: HeadStepId): HeadStep {
  return STEPS.find((step) => step.id === id) ?? STEPS[STEPS.length - 1];
}

/**
 * A run of a label's text: a day's number (in the muted figures of every day), or a name — a
 * month's, a year's — semibold in the primary text when `strong`.
 */
export type HeadPart = { text: string; strong: boolean; role: "number" | "name" };

/** One label of the head: a tick of the step, or a boundary the family names. */
export type HeadLabel = {
  key: number;
  /** Days from the axis start. */
  day: number;
  /** «12»; a month's 1st on a day step «1 ноя» («1 янв 2027» at a year's); «Окт», «2027». */
  parts: HeadPart[];
  /** A month's or a year's start (or the period the axis start cuts): it always stands. */
  boundary: boolean;
  /**
   * It names the period of the start edge when the view passes it, stuck there: a month on the
   * day steps and the month step, a year from the quarter step on.
   */
  sticks: boolean;
};

/**
 * The labels of `step` in `[from, to)` days of an axis from `origin`, `days` long, from the period
 * that holds `from` on (its boundary sticks at the start edge).
 */
export function headLabels(
  step: HeadStep,
  from: number,
  to: number,
  origin: Date,
  days: number,
  locale: Locale,
): HeadLabel[] {
  const labels = new Map<number, HeadLabel>();
  const first = Math.min(Math.max(from, 0), Math.max(days - 1, 0));
  const last = Math.min(to, days);
  const put = (date: Date, label: Omit<HeadLabel, "key" | "day">) => {
    const day = daysBetween(origin, date);
    if (day >= last || day < 0) return;
    const existing = labels.get(day);
    if (existing?.boundary && !label.boundary) return;
    labels.set(day, { key: day, day, ...label });
  };
  const name = (text: string, strong = true): HeadPart => ({ text, strong, role: "name" });
  const yearAt = (date: Date) => ({
    parts: [name(format(date, "yyyy"))],
    boundary: true,
    sticks: true,
  });

  if (step.family === "day") {
    // From the month that holds `from`: its 1st is the boundary that sticks.
    let month = startOfMonth(addDays(origin, Math.floor(first)));
    for (; daysBetween(origin, month) < last; month = addMonths(month, 1)) {
      // A month's 1st names its month after its number; a year's 1st, its year too.
      const parts: HeadPart[] = [
        { text: "1", strong: false, role: "number" },
        name(monthShort(month, locale).toLocaleLowerCase()),
      ];
      if (month.getMonth() === 0) parts.push(name(format(month, "yyyy")));
      put(month, { parts, boundary: true, sticks: true });
      const length = daysBetween(month, addMonths(month, 1));
      // The step's ticks count from the 1st: 1, 3, 5… or 1, 8, 15, 22, 29.
      for (let date = step.every; date < length; date += step.every) {
        const at = addDays(month, date);
        // Before the scene only the boundary that sticks is needed.
        if (daysBetween(origin, at) < first) continue;
        put(at, {
          parts: [{ text: format(at, "d"), strong: false, role: "number" }],
          boundary: false,
          sticks: false,
        });
      }
    }
  } else if (step.family === "month") {
    let year = startOfYear(addDays(origin, Math.floor(first)));
    for (; daysBetween(origin, year) < last; year = addYears(year, 1)) {
      put(year, yearAt(year));
      for (let month = step.every; month < 12; month += step.every) {
        put(addMonths(year, month), {
          parts: [name(monthShort(addMonths(year, month), locale), false)],
          boundary: false,
          // On the month step the month you are in sticks; from the quarter step on, the year.
          sticks: step.every === 1,
        });
      }
    }
  } else {
    const start = startOfYear(addDays(origin, Math.floor(first)));
    let year = new Date(start.getFullYear() - (start.getFullYear() % step.every), 0, 1);
    for (; daysBetween(origin, year) < last; year = addYears(year, step.every))
      put(year, yearAt(year));
  }

  // The period the axis start cuts is named on its first day.
  if (!labels.get(0)?.boundary && first <= 0) {
    // A month on the day steps and the month step; a year from the quarter step on.
    const month = step.family === "day" || (step.family === "month" && step.every === 1);
    const text = month ? monthShort(origin, locale) : format(startOfYear(origin), "yyyy");
    labels.set(0, {
      key: 0,
      day: 0,
      parts: [name(text, step.family === "day" || !month)],
      boundary: true,
      sticks: true,
    });
  }

  return [...labels.values()].sort((a, b) => a.day - b.day);
}

export type HeadPlaceOptions = {
  /** A day's place in the layer, px: the camera's `toPx`. */
  px: (day: number) => number;
  measure: MeasureText;
  /** The margin after a tick, px. */
  pad: number;
  /** The least room between two labels, px. */
  gap: number;
  /** An ordinary label fades over this much more room as a boundary closes in, px. */
  fade: number;
  /** The room between the runs of one label («1 ноя»), px. */
  space: number;
};

/** A label's length, px: its runs, measured, with the room between them. */
export function labelWidth(label: HeadLabel, measure: MeasureText, space: number): number {
  return label.parts.reduce(
    (sum, part, index) => sum + measure(part.text, part.strong) + (index > 0 ? space : 0),
    0,
  );
}

/** A placed label: its start and length in the layer's px, and its opacity, `0…1`. */
export type HeadPlaced = { x: number; width: number; opacity: number };

/**
 * Places the labels: each after its tick; an ordinary label next to a boundary fades by the room
 * left between them (never the boundary), so no two visible labels ever overlap. Continuous in the
 * zoom: positions scale with it, the fades follow the room.
 */
export function placeLabels(labels: readonly HeadLabel[], options: HeadPlaceOptions): HeadPlaced[] {
  const { px, measure, pad, gap, fade, space } = options;
  const placed = labels.map((label) => ({
    x: px(label.day) + pad,
    width: labelWidth(label, measure, space),
    opacity: 1,
  }));
  const boundaries = labels.flatMap((label, index) => (label.boundary ? [index] : []));
  let next = 0;
  labels.forEach((label, index) => {
    if (label.boundary) return;
    while (next < boundaries.length && boundaries[next] < index) next++;
    const box = placed[index];
    for (const at of [boundaries[next - 1], boundaries[next]]) {
      if (at === undefined) continue;
      const other = placed[at];
      const apart = Math.max(other.x - (box.x + box.width), box.x - (other.x + other.width));
      box.opacity = Math.min(box.opacity, Math.min(1, Math.max(0, (apart - gap) / fade)));
    }
  });
  return placed;
}

/**
 * The label that sticks at the start edge `edgePx` (the layer's px, after any inset): the last
 * one whose place is at or before the edge, at the edge — pushed out by the next one, never over
 * it. `null` when none stands before the edge.
 */
export function stickyBoundary(
  labels: readonly HeadLabel[],
  placed: readonly HeadPlaced[],
  edgePx: number,
  gap: number,
): { index: number; x: number } | null {
  let index = -1;
  let after = -1;
  labels.forEach((label, at) => {
    if (!label.sticks) return;
    if (placed[at].x <= edgePx) index = at;
    else if (after === -1 && index !== -1) after = at;
  });
  if (index === -1) return null;
  const box = placed[index];
  let x = Math.max(box.x, edgePx);
  if (after !== -1) x = Math.min(x, placed[after].x - gap - box.width);
  return { index, x };
}

/**
 * Today's date on the head: a pill that starts on the today line at `linePx` (the layer's px, the
 * start of today's cell, where today's label would stand) and grows to the end side, kept whole
 * inside the visible axis `[windowPx + inset, windowPx + viewPx]` while the line is on it; `null`
 * once the line has left (the «Сегодня» button stands at that edge instead).
 */
export function todayPill(
  linePx: number,
  widthPx: number,
  windowPx: number,
  viewPx: number,
  inset: number,
  margin: number,
): { x: number } | null {
  if (linePx < windowPx || linePx > windowPx + viewPx) return null;
  const min = windowPx + inset + margin;
  const max = windowPx + viewPx - margin - widthPx;
  return { x: Math.max(min, Math.min(linePx, max)) };
}

/**
 * How much of a label shows next to the boxes that stand over it (today's pill over every label,
 * the stuck boundary over the ordinary ones): `gap` clear of them it shows whole, closer it fades
 * over `fade`, touching it is gone.
 */
export function occlusion(
  box: { x: number; width: number },
  over: readonly { x: number; width: number }[],
  gap: number,
  fade: number,
): number {
  let shown = 1;
  for (const other of over) {
    const apart = Math.max(other.x - (box.x + box.width), box.x - (other.x + other.width));
    shown = Math.min(shown, Math.min(1, Math.max(0, (apart - gap) / fade)));
  }
  return shown;
}
