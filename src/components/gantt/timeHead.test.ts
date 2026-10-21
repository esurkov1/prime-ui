import { ru } from "date-fns/locale";
import { describe, expect, it } from "vitest";

import { sceneFor, toPx } from "./timeCore";
import {
  type HeadLabel,
  type HeadStepId,
  headLabels,
  headStep,
  headStepOf,
  labelWidth,
  occlusion,
  placeLabels,
  stickyBoundary,
  todayPill,
} from "./timeHead";

const ORIGIN = new Date(2025, 0, 1);
const DAYS = 6 * 365;
/** Every zoom from a decade in view to the top step, 3 % apart: a frame of a pinch. */
const ZOOMS = Array.from({ length: 300 }, (_, index) => 0.2 * 1.03 ** index).filter(
  (px) => px <= 96,
);
/** Text widths as the `m` tier draws them, roughly: tabular figures, semibold names. */
const measure = (text: string, strong: boolean) => text.length * (strong ? 8.4 : 7.6);
const PAD = 4;
const GAP = 8;
const ROOM = PAD + GAP;
const ORDER: HeadStepId[] = [
  "day",
  "2days",
  "7days",
  "month",
  "quarter",
  "half",
  "year",
  "2years",
  "5years",
  "10years",
];

const textOf = (label: HeadLabel) => label.parts.map((part) => part.text).join(" ");

/** The head's labels and their places at `dayPx`, the view's start edge at `start`. */
function head(dayPx: number, start: number, current: HeadStepId | null = null) {
  const step = headStep(dayPx, current, measure, ROOM, ru);
  const scene = sceneFor({ dayPx, start }, 900, "wide", DAYS, 2);
  const labels = headLabels(step, scene.from, scene.to, ORIGIN, DAYS, ru);
  const placed = placeLabels(labels, {
    px: (day) => toPx(day, scene),
    measure,
    pad: PAD,
    gap: GAP,
    fade: GAP,
    space: PAD,
  });
  return { step, labels, placed, windowPx: (start - scene.origin) * dayPx };
}

describe("head: one step at a time", () => {
  it("thins as it zooms out, through the nice steps in order, one step at every zoom", () => {
    let last = -1;
    for (const px of [...ZOOMS].reverse()) {
      const at = ORDER.indexOf(headStep(px, null, measure, ROOM, ru).id);
      expect(at).toBeGreaterThanOrEqual(last);
      last = at;
    }
    const seen = new Set(ZOOMS.map((px) => headStep(px, null, measure, ROOM, ru).id));
    expect([...seen].sort()).toEqual([...ORDER.slice(0, 6)].sort());
    // Further out than any axis of a year or more needs, the years.
    expect(headStep(0.15, null, measure, ROOM, ru).id).toBe("year");
    expect(headStep(0.03, null, measure, ROOM, ru).id).toBe("5years");
  });

  it("holds a step at a threshold: a finer one needs 15 % to spare", () => {
    // A day's labels fit from here: the widest number and its margins, a px a day.
    const day = measure("28", false) + ROOM;
    expect(headStep(day * 1.05, "2days", measure, ROOM, ru).id).toBe("2days");
    expect(headStep(day * 1.2, "2days", measure, ROOM, ru).id).toBe("day");
    expect(headStep(day * 0.99, "day", measure, ROOM, ru).id).toBe("2days");
  });

  it("keeps one format per family: numbers for days, names for months, years; boundaries named", () => {
    const DAY = /^\d{1,2}$/;
    const BOUNDARY_DAY = /^(1 [а-яё]{3}( \d{4})?|[А-ЯЁ][а-яё]{2})$/;
    const MONTH = /^[А-ЯЁ][а-яё]{2}$/;
    const YEAR = /^\d{4}$/;
    for (const px of ZOOMS) {
      const { step, labels } = head(px, 500);
      for (const label of labels) {
        const text = textOf(label);
        if (step.family === "day") expect(text).toMatch(label.boundary ? BOUNDARY_DAY : DAY);
        else if (step.family === "month") expect(text).toMatch(label.boundary ? YEAR : MONTH);
        else expect(text).toMatch(YEAR);
      }
    }
  });

  it("names a month's 1st with its month on a day step; the 7-day step counts from the 1st", () => {
    const week = headStepOf("7days");
    const labels = headLabels(week, 300, 340, ORIGIN, DAYS, ru);
    // 1 November 2025: «1 ноя», then the 8th, the 15th… whatever their weekday.
    const texts = labels.filter((label) => label.day >= 304).map(textOf);
    expect(texts.slice(0, 5)).toEqual(["1 ноя", "8", "15", "22", "29"]);
    const days = headLabels(headStepOf("day"), 364, 367, ORIGIN, DAYS, ru);
    expect(days.filter((label) => label.day >= 364).map(textOf)).toEqual(["31", "1 янв 2026", "2"]);
  });

  it("never overlaps two labels on screen, and a boundary always stands", () => {
    for (const px of ZOOMS) {
      for (const start of [10, 333.3, 500, 731.7]) {
        const { labels, placed } = head(px, start);
        const shown = placed
          .map((box, index) => ({ box, label: labels[index] }))
          .filter(({ box }) => box.opacity > 0.01);
        for (let i = 1; i < shown.length; i++) {
          const before = shown[i - 1].box;
          expect(before.x + before.width, `${px} px a day at ${start}`).toBeLessThanOrEqual(
            shown[i].box.x + 0.01,
          );
        }
        labels.forEach((label, index) => {
          if (label.boundary) expect(placed[index].opacity).toBe(1);
        });
      }
    }
  });

  it("fades an ordinary label continuously as a boundary closes in", () => {
    const sample = (px: number) => {
      const { labels, placed } = head(px, 300, "day");
      const at = labels.findIndex((label) => textOf(label) === "31");
      return placed[at]?.opacity ?? 0;
    };
    // A 3 % zoom moves two neighbours `0.03 · px` apart at most, plus the device-pixel rounding
    // of the four cell edges (half a px each at a dpr of 2): the fade never steps further.
    let faded = false;
    for (let px = 24; px < 48; px *= 1.03) {
      const step = Math.abs(sample(px * 1.03) - sample(px));
      expect(step).toBeLessThanOrEqual((0.03 * px + 1) / GAP + 1e-9);
      if (sample(px) > 0 && sample(px) < 1) faded = true;
    }
    expect(faded).toBe(true);
  });

  it("sticks the boundary of the period at the start edge, pushed out by the next, never over it", () => {
    const px = 30;
    for (let step = 0; step < 1800; step++) {
      const start = 280 + step / px;
      const { labels, placed, windowPx } = head(px, start, "day");
      const edge = windowPx + PAD;
      const sticky = stickyBoundary(labels, placed, edge, PAD);
      expect(sticky, `at ${start}`).not.toBeNull();
      if (!sticky) continue;
      const next = labels.findIndex((label, at) => at > sticky.index && label.boundary);
      const width = labelWidth(labels[sticky.index], measure, PAD);
      if (next !== -1) expect(sticky.x + width).toBeLessThanOrEqual(placed[next].x - PAD + 0.01);
      // At the edge, or pushed off it by the next month — never behind its own place.
      expect(sticky.x).toBeGreaterThanOrEqual(placed[sticky.index].x - 0.01);
      expect(sticky.x).toBeLessThanOrEqual(Math.max(edge, placed[sticky.index].x) + 0.01);
    }
  });

  it("stands today's pill on the today line, whole inside the axis, and lets labels give way", () => {
    // From the line to the end side while there is room; at an edge, kept whole; off the axis, none.
    expect(todayPill(500, 40, 100, 800, 0, 4)).toEqual({ x: 500 });
    expect(todayPill(102, 40, 100, 800, 0, 4)).toEqual({ x: 104 });
    expect(todayPill(102, 40, 100, 800, 60, 4)).toEqual({ x: 164 });
    expect(todayPill(898, 40, 100, 800, 0, 4)).toEqual({ x: 856 });
    expect(todayPill(99, 40, 100, 800, 0, 4)).toBeNull();
    // A label touching the pill is gone; `gap` clear it fades in over `fade`; further, whole.
    const pill = { x: 480, width: 40 };
    expect(occlusion({ x: 520, width: 20 }, [pill], 4, 8)).toBe(0);
    expect(occlusion({ x: 528, width: 20 }, [pill], 4, 8)).toBe(0.5);
    expect(occlusion({ x: 560, width: 20 }, [pill], 4, 8)).toBe(1);
    expect(occlusion({ x: 430, width: 20 }, [pill], 4, 8)).toBe(1);
  });

  it("stands today's pill as today's own label: from the today line, its text where the plain one is", () => {
    // Today: 21 October 2026 (day 658 of the axis), at the day and the week steps.
    const today = 658;
    for (const [px, current] of [
      [40, "day"],
      [12, "7days"],
    ] as const) {
      const { labels, placed, windowPx } = head(px, 640, current);
      const scene = sceneFor({ dayPx: px, start: 640 }, 900, "wide", DAYS, 2);
      // The today line: the start of today's cell, its tick.
      const line = toPx(today, scene);
      // The pill is padded as a label is after its tick (`pad`), and grows to the end side.
      const width = PAD + measure("21", false) + PAD;
      const pill = todayPill(line, width, windowPx, 900, 0, PAD);
      expect(pill).toEqual({ x: line });
      if (!pill) continue;
      const pillText = pill.x + PAD;
      // The plain «21» at the day step stands exactly there; at a coarser step, where it would.
      const plain = labels.findIndex((label) => label.day === today);
      if (current === "day") expect(Math.abs(placed[plain].x - pillText)).toBeLessThanOrEqual(0.5);
      else expect(plain).toBe(-1);
      expect(Math.abs(line + PAD - pillText)).toBeLessThanOrEqual(0.5);
    }
  });

  it("writes a year only at a January boundary, or stuck at the start edge from the quarter step on", () => {
    const YEAR = /\d{4}/;
    for (const id of ORDER) {
      const step = headStepOf(id);
      const labels = headLabels(step, 0, 2 * 365, ORIGIN, DAYS, ru);
      for (const label of labels) {
        const text = textOf(label);
        if (!YEAR.test(text)) continue;
        // 1 January (days from 1 Jan 2025: 0, 365, 730), as «1 янв 2026» / «2026», or a year step.
        expect([0, 365, 730].includes(label.day) || step.family === "year", `${id}: ${text}`).toBe(
          true,
        );
        if (step.family === "day") expect(text).toMatch(/^1 янв \d{4}$/);
      }
      // The month step names the month at the start edge; from the quarter step on, the year.
      const first = labels[0];
      if (id === "month") expect(first.sticks && textOf(first)).toBe("2025");
      if (id === "quarter" || id === "half") expect(first.sticks && textOf(first)).toBe("2025");
    }
    // Mid-year at the month step: the month you are in sticks, not a year.
    const mid = headLabels(headStepOf("month"), 200, 400, ORIGIN, DAYS, ru);
    const stuck = mid.filter((label) => label.sticks && label.day <= 200).at(-1);
    expect(stuck && textOf(stuck)).toBe("Июл");
  });
});
