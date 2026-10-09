/**
 * Shared props, math and accessible text of the progress indicators (ProgressBar, ProgressCircle):
 * one `value`, or `segments` that split a whole.
 */
import type { PaletteColor, Tone } from "./states";

/** The two modes of a progress indicator; the component adds its own common props. */
export type ProgressModeProps =
  | {
      /** Current value; clamped to `0…max`. */
      value: number;
      /** Top of the scale. Default `100`. */
      max?: number;
      /** Fill color. Default `accent`. */
      tone?: Tone;
      segments?: never;
      segmentGap?: never;
      labels?: never;
      legend?: never;
      formatValue?: never;
    }
  | {
      /** Parts in order (left to right, clockwise from the top); each one's size is its share of `max`. */
      segments: ProgressSegment[];
      /** Total capacity. Default: the sum of the segments (they fill the whole indicator). */
      max?: number;
      /** `hairline` draws every part on its own with a gap. Default `none`. */
      segmentGap?: "none" | "hairline";
      /** Built-in accessible strings for empty distributions. */
      labels?: Partial<ProgressSegmentsLabels>;
      /** A legend of the parts: color · name · value · share. Default `false`. */
      legend?: boolean;
      /** Display of a value in the legend (and in ProgressBar rows). Default: Russian digit groups. */
      formatValue?: (value: number) => string;
      value?: never;
      tone?: never;
    };

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
export type ProgressScale = "sum" | "max" | "first";

export type ResolvedRow = {
  segment: ProgressSegment;
  /** Bar length, 0–1. */
  ratio: number;
  /** Rounded share shown at the end of the row, 0–100. */
  percent: number;
};

/**
 * Rows of a ranking: `sum` — length and share of the total (`max` raises the total); `max` — the
 * leader is a full bar, the share is still of the total; `first` — both against the first row
 * (a funnel: the first step is 100%).
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

export const DEFAULT_PROGRESS_SEGMENTS_LABELS: ProgressSegmentsLabels = {
  empty: "Нет сегментов",
  allEmpty: "Все сегменты пусты",
};

export type ResolvedSegments = {
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
