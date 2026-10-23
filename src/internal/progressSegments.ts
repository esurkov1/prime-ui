/**
 * Shared props, math and accessible text of the progress indicators (ProgressBar, ProgressCircle):
 * one `value`, or `segments` that split a whole.
 */
import type * as React from "react";
import type { PaletteColor, Tone } from "./states";

/** The two modes of a progress indicator; the component adds its own common props. */
export type ProgressModeProps =
  | {
      value: number;
      max?: number;
      tone?: Tone;
      segments?: never;
      segmentGap?: never;
      labels?: never;
      legend?: never;
      formatValue?: never;
    }
  | {
      segments: ProgressSegment[];
      max?: number;
      segmentGap?: "none" | "hairline";
      labels?: Partial<ProgressSegmentsLabels>;
      legend?: boolean;
      formatValue?: (value: number) => string;
      value?: never;
      tone?: never;
    };

/**
 * How a progress indicator draws its scale: `line` — one continuous stroke; `steps` — `max` equal
 * cells (value mode); `ticks` — many thin cells.
 */
export type ProgressVariant = "line" | "steps" | "ticks";

/** Cells of a `steps` scale: `max` rounded into 2…12. */
export function stepCells(max: number): number {
  return Math.min(12, Math.max(2, Math.round(max)));
}

/** Whole cells a share fills: `ratio` (0…1) of `count`, rounded to a cell. */
export function filledCells(ratio: number, count: number): number {
  return Math.round(Math.min(1, Math.max(0, ratio)) * count);
}

/**
 * Whole cells per weight: `count` cells shared by the weights (pass the free rest last) by the
 * largest remainder; a weight above zero keeps at least one cell while the cells last.
 */
export function allocateCells(weights: number[], count: number): number[] {
  const own = weights.map(nonNegative);
  const sum = own.reduce((acc, w) => acc + w, 0);
  if (sum <= 0 || count <= 0) return own.map(() => 0);
  const exact = own.map((w) => (w / sum) * count);
  const cells = exact.map((x, i) => (own[i] > 0 ? Math.max(1, Math.floor(x)) : 0));
  let used = cells.reduce((acc, c) => acc + c, 0);
  const byRemainder = own
    .map((_, i) => i)
    .filter((i) => own[i] > 0)
    .sort((a, b) => exact[b] - cells[b] - (exact[a] - cells[a]) || a - b);
  for (let k = 0; used < count; k = (k + 1) % byRemainder.length) {
    cells[byRemainder[k]] += 1;
    used += 1;
  }
  while (used > count) {
    cells[cells.indexOf(Math.max(...cells))] -= 1;
    used -= 1;
  }
  return cells;
}

/** `value` mode: `max` defaults to 100 (or when not positive) and `value` is clamped to `0…max`. */
export function resolveValue(
  value: number,
  max: number | undefined,
): { value: number; max: number; ratio: number; percent: number } {
  const top = max !== undefined && max > 0 ? max : 100;
  const clamped = Math.min(top, Math.max(Number.isFinite(value) ? value : 0, 0));
  return {
    value: clamped,
    max: top,
    ratio: clamped / top,
    percent: Math.round((clamped / top) * 100),
  };
}

/**
 * One part of a whole. `tone` names a meaning (done, overdue), `color` names a category (a
 * platform, a source) with its chart color; one or the other. Neither → `accent`.
 */
export type ProgressSegment = {
  /** Non-negative weight; negative or non-finite values count as 0. */
  value: number;
  label?: string;
  /** `rows` layout, `scale="own"`: the top of this row's own scale (else the root `max`, else 100). */
  max?: number;
  /** `rows` layout: the whole row is a link to it. */
  href?: string;
  /** `rows` layout: runs on a press of the row's link (`href` only), e.g. to navigate by a router. */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
} & (
  | {
      /** Fill by meaning. Default `accent`. */
      tone?: Tone;
      color?: never;
    }
  | {
      /** Fill by category: the hue's step of the chart palette (`--prime-color-chart-*`). */
      color: PaletteColor;
      tone?: never;
    }
);

/** `data-tone` / `data-color` of a part: a category color, else a tone (default `accent`). */
export function segmentFill(segment: ProgressSegment): {
  tone: Tone | undefined;
  color: PaletteColor | undefined;
} {
  return segment.color
    ? { tone: undefined, color: segment.color }
    : { tone: segment.tone ?? "accent", color: undefined };
}

/** What 100% of a row is in the `rows` layout. */
export type ProgressScale = "sum" | "max" | "first" | "own";

type ResolvedRow = {
  segment: ProgressSegment;
  /** Bar length, 0–1. */
  ratio: number;
  /** Rounded share shown at the end of the row, 0–100. */
  percent: number;
};

/**
 * Rows of a ranking: `sum` — length and share of the total (`max` raises the total); `max` — the
 * leader is a full bar, the share is still of the total; `first` — both against the first row
 * (a funnel: the first step is 100%); `own` — each row against its own `max` (else the root `max`,
 * else 100): a load per model, a quota per seat.
 */
export function resolveRows(
  input: ProgressSegment[],
  scale: ProgressScale,
  max: number | undefined,
): ResolvedRow[] {
  const segments = input.map((s) => ({ ...s, value: nonNegative(s.value) }));
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  const sum = max !== undefined && max > 0 ? Math.max(max, total) : total;
  const largest = segments.reduce((acc, s) => Math.max(acc, s.value), 0);
  const first = segments[0]?.value ?? 0;
  const lengthBase = scale === "max" ? largest : scale === "first" ? first : sum;
  const shareBase = scale === "first" ? first : sum;
  if (scale === "own") {
    const fallback = max !== undefined && max > 0 ? max : 100;
    return segments.map((segment) => {
      const top = segment.max !== undefined && segment.max > 0 ? segment.max : fallback;
      return {
        segment,
        ratio: Math.min(1, segment.value / top),
        percent: Math.round((segment.value / top) * 100),
      };
    });
  }
  return segments.map((segment) => ({
    segment,
    ratio: lengthBase > 0 ? Math.min(1, segment.value / lengthBase) : 0,
    percent: shareBase > 0 ? Math.round((segment.value / shareBase) * 100) : 0,
  }));
}

/** Default display of a value in a legend or a row: Russian digit groups. */
const NUMBER = new Intl.NumberFormat("ru-RU");
export const formatProgressValue = (value: number): string => NUMBER.format(value);

export type ProgressSegmentsLabels = {
  /** Accessible description when `segments` is empty. */
  empty: string;
  /** Accessible description when every segment weighs zero. */
  allEmpty: string;
};

export const PROGRESS_SEGMENTS_LABELS: ProgressSegmentsLabels = {
  empty: "Нет сегментов",
  allEmpty: "Все сегменты пусты",
};

type ResolvedSegments = {
  segments: ProgressSegment[];
  /** Sum of the segment weights. */
  total: number;
  /** Full scale: `max` when it exceeds the sum, otherwise the sum. */
  scale: number;
  /** Free capacity: `scale - total`. */
  rest: number;
  /** Rounded filled share, 0–100. */
  percent: number;
  /** "Видео: 38%, Документы: 21%" or the empty texts. */
  text: string;
};

function nonNegative(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function resolveSegments(
  input: ProgressSegment[],
  max: number | undefined,
  labels: ProgressSegmentsLabels,
): ResolvedSegments {
  const segments = input.map((s) => ({ ...s, value: nonNegative(s.value) }));
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  const scale = max !== undefined && max > 0 ? Math.max(max, total) : total;
  let text: string;
  if (segments.length === 0) text = labels.empty;
  else if (scale <= 0) text = labels.allEmpty;
  else
    text = segments
      .map((s) => {
        const pct = Math.round((s.value / scale) * 100);
        return s.label ? `${s.label}: ${pct}%` : `${pct}%`;
      })
      .join(", ");
  return {
    segments,
    total,
    scale,
    rest: scale - total,
    percent: scale > 0 ? Math.round((total / scale) * 100) : 0,
    text,
  };
}
