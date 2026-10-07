/**
 * Shared math and accessible text for progress indicators in `segments` mode
 * (ProgressBar, ProgressCircle).
 */
import type { Tone } from "./states";

export type ProgressSegment = {
  /** Non-negative weight; negative or non-finite values count as 0. */
  value: number;
  label?: string;
  /** Segment fill. Default `accent`. */
  tone?: Tone;
};

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
