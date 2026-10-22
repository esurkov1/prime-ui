import type { Locale } from "date-fns";
import { ru } from "date-fns/locale";
import * as React from "react";
import { useControllableState } from "@/hooks/useControllableState";
import { formatLabel } from "@/internal/formatLabel";
import { useLabels } from "@/internal/labels";

import { changeAt, changeOf, GRAIN_LIMIT, latestPresent, periodOf, useSeriesModel } from "./model";
import {
  SPARKLINE_LABELS,
  type SparklineAggregate,
  type SparklineGrain,
  type SparklineLabels,
  type SparklinePoint,
  type SparklineProps,
  type SparklineSeries,
} from "./Sparkline";

/**
 * What the reading shows at rest. `latest`: the latest point (or `highlight`) — a level such as
 * MRR, a price, a conversion. `sum`: the total of the period — a flow such as revenue or orders
 * per day. `average`: the mean of the period.
 */
export type SparklineSummary = "latest" | "sum" | "average";

/**
 * What the change compares the shown point with. `previous`: the point before it (a cut period:
 * the same days of the one before). `first`: the first point with a value. `none`: no change for a
 * point (`compareTo` still gives the change at rest).
 */
export type SparklineChange = "previous" | "first" | "none";

/**
 * Which way of the change is good. `higher`: growth is `success` (revenue, orders). `lower`: a fall
 * is `success` and growth `danger` (response time, costs, bounce rate).
 */
export type SparklineBetter = "higher" | "lower";

/**
 * How the change measures. `percent`: the relative change. `points`: the difference of the values,
 * for a share already in percent (conversion 4,1% → 4,6% is «+0,5 п. п.»).
 */
export type SparklineChangeUnit = "percent" | "points";

type ReadingRest =
  | { summary?: "latest"; highlight?: number; value?: never }
  | { summary: "sum" | "average"; highlight?: never; value?: never }
  | { value: number | null; summary?: never; highlight?: never };

export type UseSparklineOptions = ReadingRest & {
  data: SparklinePoint[];
  series?: SparklineSeries[];
  grain?: SparklineGrain;
  defaultGrain?: SparklineGrain;
  onGrainChange?: (grain: SparklineGrain) => void;
  aggregate?: SparklineAggregate;
  locale?: Locale;
  point?: number | null;
  defaultPoint?: number | null;
  onPointChange?: (point: number | null) => void;
  change?: SparklineChange;
  changeUnit?: SparklineChangeUnit;
  better?: SparklineBetter;
  compareTo?: number;
  formatValue?: (value: number) => string;
  labels?: Partial<SparklineLabels>;
};

/** The props of the plot that shows this reading: spread them onto `<Sparkline>`. */
export type SparklinePlotProps = Pick<
  SparklineProps,
  | "data"
  | "series"
  | "grain"
  | "aggregate"
  | "locale"
  | "point"
  | "onPointChange"
  | "highlight"
  | "formatValue"
  | "labels"
>;

export type SparklineReading = {
  value: number | null;
  valueText: string;
  date: string;
  change: number | null;
  changeText: string;
  changeTone: "success" | "danger" | "neutral";
  atRest: boolean;
  grain: Exclude<SparklineGrain, "auto">;
  grains: Exclude<SparklineGrain, "auto">[];
  setGrain: (grain: SparklineGrain) => void;
  plot: SparklinePlotProps;
};

const NUMBER = new Intl.NumberFormat("ru-RU");
const CHANGE = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });
const formatNumber = (value: number) => NUMBER.format(value);

/**
 * The reading of a series for a headline the consumer lays out (a KPI card's value, change and
 * date): the value at rest — the latest point, `highlight`, the period's total or mean (`summary`)
 * or its own `value` — or the point scrubbed on the plot; its change and its date or period. The
 * plot is `<Sparkline {...reading.plot} />`: one model, so the headline follows the plot's point.
 */
export function useSparkline(options: UseSparklineOptions): SparklineReading {
  const {
    data,
    series,
    grain,
    defaultGrain,
    onGrainChange,
    aggregate,
    locale = ru,
    point: pointProp,
    defaultPoint = null,
    onPointChange,
    change = "none",
    changeUnit = "percent",
    better = "higher",
    compareTo,
    formatValue = formatNumber,
    labels: labelsProp,
  } = options;
  const summary = options.summary ?? "latest";
  const own = options.value !== undefined;
  const labels = useLabels(SPARKLINE_LABELS, labelsProp);
  // Dated days fold the way the headline sums them unless `aggregate` says otherwise: a flow per
  // period, a level at the period's end, a mean.
  const how = aggregate ?? (own ? "latest" : summary);
  const model = useSeriesModel({
    data,
    grain,
    defaultGrain,
    onGrainChange,
    aggregate: how,
    locale,
    quarterLabel: labels.quarter,
    limit: GRAIN_LIMIT,
  });
  const { points, bucketed, days } = model;
  const [active, setActive] = useControllableState<number | null>({
    value: pointProp,
    defaultValue: defaultPoint,
    onChange: onPointChange,
  });
  const last = points.length - 1;
  const highlight = options.highlight;
  const restIndex =
    highlight !== undefined && highlight >= 0 && highlight <= last
      ? Math.floor(highlight)
      : latestPresent(points);
  const atRest = active === null;
  const index = atRest ? restIndex : Math.min(active, last);
  const shown = points[index]?.value ?? null;
  const period = React.useMemo(() => periodOf(days, points), [days, points]);
  // A sum, a mean or the own value at rest stands for the whole period, not a point.
  const aggregateRest = atRest && (own || summary !== "latest");
  const value = !aggregateRest
    ? shown
    : own
      ? (options.value ?? null)
      : summary === "sum"
        ? points.length
          ? period.total
          : null
        : period.mean;
  const date = aggregateRest
    ? formatLabel(labels.period, {
        first: bucketed ? bucketed.firstDay : (points[0]?.label ?? ""),
        last: bucketed ? bucketed.lastDay : (points[last]?.label ?? ""),
      })
    : (points[index]?.label ?? "");
  const delta = !points.length
    ? null
    : atRest && compareTo !== undefined
      ? changeOf(compareTo, value, changeUnit)
      : aggregateRest
        ? null
        : changeAt(points, bucketed, index, change, changeUnit);
  // The change as shown (one decimal): a change that rounds to zero is no change — neutral.
  const rounded = delta === null ? null : Math.round(delta * 10) / 10;
  const signed =
    rounded === null
      ? ""
      : `${rounded > 0 ? "+" : rounded < 0 ? "−" : ""}${CHANGE.format(Math.abs(rounded))}`;
  const changeText =
    rounded === null
      ? ""
      : changeUnit === "points"
        ? formatLabel(labels.points, { value: signed })
        : `${signed}%`;
  const changeTone = !rounded
    ? "neutral"
    : rounded > 0 === (better === "higher")
      ? "success"
      : "danger";

  return {
    value,
    valueText: value === null ? labels.empty : formatValue(value),
    date,
    change: rounded,
    changeText,
    changeTone,
    atRest,
    grain: model.grain,
    grains: model.grains,
    setGrain: model.setGrain,
    plot: {
      data,
      series,
      grain: model.grain,
      aggregate: how,
      locale,
      point: active,
      onPointChange: setActive,
      // A period's total, mean or own value marks no point on the plot.
      highlight: own || summary !== "latest" ? null : highlight,
      formatValue,
      labels: labelsProp,
    },
  };
}
