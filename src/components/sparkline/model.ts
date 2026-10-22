import type { Locale } from "date-fns";
import * as React from "react";
import { useControllableState } from "@/hooks/useControllableState";
import { HUE_CHART } from "@/internal/palette";
import type { PaletteColor } from "@/internal/states";
import { chartColors } from "@/theme/chartColors";

import {
  type BucketAggregate,
  type Bucketed,
  bucketize,
  type DatedValue,
  type DaySeries,
  daysOf,
  type Grain,
  grainsOf,
  resolveGrain,
} from "./buckets";

/*
 * The series model shared by the plot (`Sparkline`) and the reading of its headline
 * (`useSparkline`): dated days folded by the grain, the points, the lines of `series` beside them,
 * and the change of a point. One model, so a card's headline and its plot never disagree.
 */

export type ModelPoint =
  | { label: string; date?: never; value: number | null }
  | { date: Date | string; label?: never; value: number | null };

export type ModelSeries = {
  id: string;
  label: string;
  data: ModelPoint[];
  color?: PaletteColor;
  variant?: "area" | "line" | "dashed" | "dotted";
};

export type ModelChange = "previous" | "first" | "none";
export type ModelChangeUnit = "percent" | "points";

/** Points of a dated series under `auto`: a month by days, half a year by weeks. */
export const GRAIN_LIMIT = 31;

/**
 * The main series as points of its grain: `{ label, value }` as it is, or dated days folded by
 * `grain` (the triad; `auto` resolved against `limit`) with `aggregate`.
 */
export function useSeriesModel({
  data,
  grain: grainProp,
  defaultGrain = "auto",
  onGrainChange,
  aggregate,
  locale,
  quarterLabel,
  limit,
}: {
  data: ModelPoint[];
  grain?: Grain | "auto";
  defaultGrain?: Grain | "auto";
  onGrainChange?: (grain: Grain | "auto") => void;
  aggregate: BucketAggregate;
  locale: Locale;
  quarterLabel: string;
  limit: number;
}) {
  const dated = data[0]?.date !== undefined;
  const days = React.useMemo(
    () => (dated ? daysOf(data as DatedValue[], aggregate) : null),
    [data, dated, aggregate],
  );
  const [grainValue, setGrain] = useControllableState<Grain | "auto">({
    value: grainProp,
    defaultValue: defaultGrain,
    onChange: onGrainChange,
  });
  const grain = resolveGrain(days, grainValue, limit);
  const bucketed = React.useMemo(
    () => (days ? bucketize(days, grain, aggregate, locale, quarterLabel) : null),
    [days, grain, aggregate, locale, quarterLabel],
  );
  const points: readonly { label: string; value: number | null }[] = bucketed
    ? bucketed.points
    : (data as { label: string; value: number | null }[]);
  const grains = React.useMemo(() => grainsOf(days), [days]);
  return { days, bucketed, points, grain, grains, setGrain };
}

export type ModelLine = {
  key: string;
  label: string;
  values: (number | null)[];
  total: number;
  mean: number | null;
  color: string;
  variant: "area" | "line" | "dashed" | "dotted";
};

/** The lines of `series` on the main points: the same grain, the n-th point beside the n-th. */
export function useSeriesLines(
  series: ModelSeries[] | undefined,
  count: number,
  grain: Grain,
  aggregate: BucketAggregate,
  locale: Locale,
  quarterLabel: string,
): ModelLine[] {
  return React.useMemo(
    () =>
      (series ?? []).map((item, i) => {
        const days =
          item.data[0]?.date !== undefined ? daysOf(item.data as DatedValue[], aggregate) : null;
        const own = days
          ? bucketize(days, grain, aggregate, locale, quarterLabel).points
          : (item.data as { value: number | null }[]);
        const values = Array.from({ length: count }, (_, k) => own[k]?.value ?? null);
        const present = values.filter((v): v is number => v !== null);
        const total = present.reduce((sum, v) => sum + v, 0);
        return {
          key: item.id,
          label: item.label,
          values,
          total,
          mean: present.length ? total / present.length : null,
          color: item.color
            ? HUE_CHART[item.color]
            : (chartColors.series[i + 1] ?? chartColors.other),
          variant: item.variant ?? "line",
        };
      }),
    [series, count, grain, aggregate, locale, quarterLabel],
  );
}

/** The point marked at rest by default: the latest with a value. */
export function latestPresent(points: readonly { value: number | null }[]): number {
  for (let i = points.length - 1; i >= 0; i--) if (points[i].value !== null) return i;
  return points.length - 1;
}

/**
 * `points`: the difference; `percent`: the relative change, `null` when a percentage means nothing
 * — the base is 0 or the sign flips. A value missing on either side is no change.
 */
export function changeOf(
  base: number | null,
  next: number | null,
  unit: ModelChangeUnit,
): number | null {
  if (base === null || next === null) return null;
  if (unit === "points") return next - base;
  if (base === 0 || (next !== 0 && Math.sign(base) !== Math.sign(next))) return null;
  return ((next - base) / Math.abs(base)) * 100;
}

/**
 * Change of the point at `index` against the compared one; a dated period against the one before
 * over the same days (a cut October against the same days of September). `null` when there is
 * nothing to compare or the measure means nothing.
 */
export function changeAt(
  points: readonly { value: number | null }[],
  bucketed: Bucketed | null,
  index: number,
  mode: ModelChange,
  unit: ModelChangeUnit,
): number | null {
  if (mode === "none") return null;
  if (mode === "previous" && bucketed) {
    const pair = bucketed.previous[index];
    return pair ? changeOf(pair[0], pair[1], unit) : null;
  }
  const from = mode === "first" ? points.findIndex((p) => p.value !== null) : index - 1;
  if (from < 0 || from >= index) return null;
  return changeOf(points[from].value, points[index].value, unit);
}

/** The total and mean of the period: from its days when it has them (the mean of a month's days). */
export function periodOf(
  days: DaySeries | null,
  points: readonly { value: number | null }[],
): { total: number; mean: number | null } {
  const present = (days ? days.values : points.map((p) => p.value)).filter(
    (v): v is number => v !== null,
  );
  const total = present.reduce((sum, v) => sum + v, 0);
  return { total, mean: present.length ? total / present.length : null };
}
