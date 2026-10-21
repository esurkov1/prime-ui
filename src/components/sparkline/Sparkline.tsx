import * as React from "react";
import { useControllableState } from "@/hooks/useControllableState";
import { Icon } from "@/icons";
import { type AnchorPoint, ChartTooltip } from "@/internal/ChartTooltip";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { fieldTierClass } from "@/internal/fieldClasses";
import { formatLabel } from "@/internal/formatLabel";
import { useLabels } from "@/internal/labels";
import { RegionSwap } from "@/internal/RegionSwap";
import { RollingNumber } from "@/internal/RollingNumber";
import type { ControlSize } from "@/internal/states";

import { Badge } from "../badge/Badge";
import { Skeleton } from "../skeleton/Skeleton";
import { pathsOf, type SparklineCurve, scaleOf, yOf } from "./geometry";
import styles from "./Sparkline.module.css";

export type { SparklineCurve };

export type SparklinePoint = {
  /** Name of the point on the axis: a date, a week, a month («8 окт»). */
  label: string;
  /** `null`: no data for this point — the line breaks, the bar is absent. */
  value: number | null;
};

export type SparklineLabels = {
  /** Spoken value of the chosen point; `{label}` and `{value}` are replaced. */
  point: string;
  /** The period of a `sum` / `average` / `value` headline at rest; `{first}` and `{last}` are point labels. */
  period: string;
  /** Shown and spoken in place of the value of a point with no data. */
  empty: string;
  /** Description of the reference line; `{value}` is replaced. */
  reference: string;
  /** A change in percentage points (`changeUnit="points"`); `{value}` is the signed difference. */
  points: string;
};

/**
 * `area`: a line over a gradient that fades to the bottom. `line`: the line alone (many trends side
 * by side). `bars`: a bar per point from zero — up when positive, down when negative.
 */
export type SparklineVariant = "area" | "line" | "bars";

/**
 * What the change badge compares the shown point with. `previous`: the point before it.
 * `first`: the first point of the series (the change over the period). `none`: no badge (the
 * default; `compareTo` still shows the change at rest).
 */
export type SparklineChange = "previous" | "first" | "none";

/**
 * What the headline shows at rest. `latest`: the latest point (or `highlight`) — a level such as
 * MRR, a price, a conversion. `sum`: the total of the period — a flow such as revenue or orders
 * per day. `average`: the mean of the period.
 */
export type SparklineSummary = "latest" | "sum" | "average";

/**
 * Which way of the change is good. `higher`: growth is green (revenue, orders). `lower`: a fall is
 * green and growth is red (response time, costs, bounce rate).
 */
export type SparklineBetter = "higher" | "lower";

/**
 * How the change badge measures. `percent`: the relative change. `points`: the difference of the
 * values, for a share already in percent (conversion 4,1% → 4,6% is «+0,5 п. п.»).
 */
export type SparklineChangeUnit = "percent" | "points";

/**
 * `default`: the headline (title · date, value · change) over the plot. `compact`: the plot alone at
 * the height of an `xs` control, for a table cell or a list row.
 */
export type SparklineLayout = "default" | "compact";

export const SPARKLINE_LABELS: SparklineLabels = {
  point: "{label}: {value}",
  period: "{first} – {last}",
  empty: "Нет данных",
  reference: "Ориентир: {value}",
  points: "{value} п. п.",
};

const NUMBER = new Intl.NumberFormat("ru-RU");
const CHANGE = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });
const formatNumber = (value: number) => NUMBER.format(value);

type SparklineRest =
  | {
      summary?: "latest";
      highlight?: number;
      value?: never;
    }
  | {
      summary: "sum" | "average";
      highlight?: never;
      value?: never;
    }
  | {
      value: number | null;
      summary?: never;
      highlight?: never;
    };

export type SparklineProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> &
  SparklineRest & {
    data: SparklinePoint[];
    label: string;
    variant?: SparklineVariant;
    curve?: SparklineCurve;
    layout?: SparklineLayout;
    size?: ControlSize;
    point?: number | null;
    defaultPoint?: number | null;
    onPointChange?: (point: number | null) => void;
    change?: SparklineChange;
    changeUnit?: SparklineChangeUnit;
    better?: SparklineBetter;
    compareTo?: number;
    min?: number;
    max?: number;
    reference?: number;
    loading?: boolean;
    formatValue?: (value: number) => string;
    labels?: Partial<SparklineLabels>;
    ref?: React.Ref<HTMLDivElement>;
  };

/**
 * Change of the shown point against the compared one; `null` when there is nothing to compare or the
 * measure means nothing.
 */
function changeAt(
  data: SparklinePoint[],
  index: number,
  mode: SparklineChange,
  unit: SparklineChangeUnit,
): number | null {
  if (mode === "none") return null;
  const from = mode === "first" ? data.findIndex((p) => p.value !== null) : index - 1;
  if (from < 0 || from >= index) return null;
  return changeOf(data[from].value, data[index].value, unit);
}

/**
 * `points`: the difference; `percent`: the relative change, `null` when a percentage means nothing
 * — the base is 0 or the sign flips. A value missing on either side is no change.
 */
function changeOf(
  base: number | null,
  next: number | null,
  unit: SparklineChangeUnit,
): number | null {
  if (base === null || next === null) return null;
  if (unit === "points") return next - base;
  if (base === 0 || (next !== 0 && Math.sign(base) !== Math.sign(next))) return null;
  return ((next - base) / Math.abs(base)) * 100;
}

function latestPresent(data: SparklinePoint[]): number {
  for (let i = data.length - 1; i >= 0; i--) if (data[i].value !== null) return i;
  return data.length - 1;
}

/**
 * A small chart with its headline: the value at rest (the latest point, `highlight`, or the period's
 * total or mean — `summary`, or its own `value`), its change and its date or period. Scrubbing (pointer, touch, or the arrow keys on the chart) shows any point; the
 * header follows instantly, the trend arrow turns, and leaving glides back to the point at rest.
 * The line is a monotone curve (`curve`), `null` values break it; `bars` draw signed values from a
 * zero line; a tooltip beside the scrubbed point shows its value and date. `layout="compact"` is
 * the plot alone (a table cell). The scrubbed point is a triad (`point`), so several sparklines of
 * one axis follow one cursor: the tooltip stays with the chart under the pointer or the keys.
 */
export function Sparkline({
  data,
  label,
  variant = "area",
  curve = "smooth",
  layout = "default",
  size: sizeProp,
  point: pointProp,
  defaultPoint = null,
  onPointChange,
  change = "none",
  changeUnit = "percent",
  better = "higher",
  summary = "latest",
  value,
  highlight,
  compareTo,
  min,
  max,
  reference,
  loading = false,
  formatValue = formatNumber,
  labels: labelsProp,
  className,
  ref,
  ...rest
}: SparklineProps) {
  const labels = useLabels(SPARKLINE_LABELS, labelsProp);
  const last = data.length - 1;
  const bars = variant === "bars";
  const compact = layout === "compact";
  const restIndex =
    highlight !== undefined && highlight >= 0 && highlight <= last
      ? Math.floor(highlight)
      : latestPresent(data);
  const tier = useHostTier(sizeProp);
  const [active, setActiveValue] = useControllableState<number | null>({
    value: pointProp,
    defaultValue: defaultPoint,
    onChange: onPointChange,
  });
  // The chart a person scrubs leads: only it shows the tooltip; a chart that follows a shared
  // `point` shows the cursor and the headline alone.
  const [leading, setLeading] = React.useState(false);
  const setActive = (next: number | null) => {
    setLeading(next !== null);
    setActiveValue(next);
  };
  const index = active === null ? restIndex : Math.min(active, last);
  const atRest = active === null;
  const point = data[index];
  const plotRef = React.useRef<HTMLDivElement | null>(null);
  // The pointer over the plot (px from its corner): the tooltip follows it; `null` from the keys.
  const [pointer, setPointer] = React.useState<AnchorPoint | null>(null);
  const referenceId = React.useId();
  // An SVG `url(#…)` reference takes a plain id.
  const gradientId = `sparkline-${referenceId.replace(/[^\w-]/g, "")}`;

  // A new series cross-fades its drawing in (foundation §7 rule 8); scrubbing never does.
  const [series, setSeries] = React.useState({ data, version: 0 });
  if (series.data !== data) setSeries({ data, version: series.version + 1 });
  const version = series.data === data ? series.version : series.version + 1;
  const stateKey = loading ? "loading" : "data";

  // Scale and paths once per series: scrubbing re-renders the cursor and the headline only.
  const geometry = React.useMemo(() => {
    const values = data.map((p) => p.value);
    const scale = scaleOf(values, [min, max, reference, bars ? 0 : undefined]);
    const count = Math.max(data.length, 1);
    const end = data.length - 1;
    const x = (i: number) => (bars ? (i + 0.5) / count : end > 0 ? i / end : 0.5);
    const y = (value: number) => yOf(scale, value);
    const present = values.filter((v): v is number => v !== null);
    const total = present.reduce((sum, v) => sum + v, 0);
    return {
      values,
      total,
      mean: present.length ? total / present.length : null,
      x,
      y,
      zero: y(0),
      reference: reference === undefined ? null : y(reference),
      paths: bars ? null : pathsOf(values, x, y, curve),
    };
  }, [data, bars, curve, min, max, reference]);
  const { x, y } = geometry;

  const drawing = React.useMemo(() => {
    const { paths } = geometry;
    if (!paths) return null;
    return (
      <div className={styles.drawing} aria-hidden="true">
        <svg
          className={styles.svg}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {variant === "area" && paths.area ? (
            <>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" className={styles.fadeTop} />
                  <stop offset="1" className={styles.fadeBottom} />
                </linearGradient>
              </defs>
              <path className={styles.area} d={paths.area} fill={`url(#${gradientId})`} />
            </>
          ) : null}
          {paths.line ? <path className={styles.line} d={paths.line} /> : null}
        </svg>
        {paths.lone.map((i) => (
          <span
            key={i}
            className={styles.lone}
            style={
              {
                "--sparkline-x": geometry.x(i),
                "--sparkline-y": geometry.y(geometry.values[i] as number),
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    );
  }, [geometry, variant, gradientId]);

  const fromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = rect.width ? (event.clientX - rect.left) / rect.width : 1;
    const next = bars ? Math.floor(ratio * data.length) : Math.round(ratio * last);
    setPointer({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    setActive(Math.max(0, Math.min(last, next)));
  };

  const shownValue = point?.value ?? null;
  const valueText = shownValue === null ? labels.empty : formatValue(shownValue);
  // A sum, a mean or the own value at rest stands for the whole period, not a point: no dot, the
  // period as date.
  const own = value !== undefined;
  const aggregate = own
    ? value
    : summary === "sum" && data.length
      ? geometry.total
      : summary === "average"
        ? geometry.mean
        : null;
  const restAggregate = atRest && (own || summary !== "latest");
  const restValue = restAggregate ? aggregate : shownValue;
  const headValue = restAggregate
    ? aggregate === null
      ? labels.empty
      : formatValue(aggregate)
    : valueText;
  const headDate = restAggregate
    ? formatLabel(labels.period, { first: data[0]?.label ?? "", last: data[last]?.label ?? "" })
    : point?.label;
  const delta = !point
    ? null
    : atRest && compareTo !== undefined
      ? changeOf(compareTo, restValue, changeUnit)
      : restAggregate
        ? null
        : changeAt(data, index, change, changeUnit);
  // The change as shown (one decimal): a change that rounds to zero is no change — neutral, no arrow.
  const shownDelta = delta === null ? null : Math.round(delta * 10) / 10;
  const signed =
    shownDelta === null
      ? ""
      : `${shownDelta > 0 ? "+" : shownDelta < 0 ? "−" : ""}${CHANGE.format(Math.abs(shownDelta))}`;
  const deltaText =
    changeUnit === "points" ? formatLabel(labels.points, { value: signed }) : `${signed}%`;
  const deltaTone = !shownDelta
    ? "neutral"
    : shownDelta > 0 === (better === "higher")
      ? "success"
      : "danger";
  const layoutAttr = compact ? layout : undefined;
  // Beside the pointer; from the keyboard beside the point, at the middle of the plot.
  const plotNode = plotRef.current;
  const tooltipPoint: AnchorPoint | null =
    active === null || !point || !leading
      ? null
      : (pointer ??
        (plotNode ? { x: x(index) * plotNode.offsetWidth, y: plotNode.offsetHeight / 2 } : null));

  return tier.provide(
    <div
      {...rest}
      ref={ref}
      // The compact plot is as tall as an `xs` control: the tier table resolves `--field-h`.
      className={cx(compact && fieldTierClass, styles.root, className)}
      data-scrubbing={active !== null || undefined}
      data-variant={variant}
      data-layout={layoutAttr}
      data-size={compact ? "xs" : tier.size}
      aria-busy={loading || undefined}
    >
      {compact ? null : (
        <>
          <div className={styles.head}>
            <span className={styles.label}>{label}</span>
            <RegionSwap state={stateKey} className={styles.date}>
              {loading ? (
                <Skeleton shape="text" size="s" className={styles.dateSkeleton} />
              ) : (
                headDate
              )}
            </RegionSwap>
          </div>
          <RegionSwap state={stateKey}>
            {loading ? (
              <Skeleton shape="block" className={styles.valueSkeleton} />
            ) : (
              <div className={styles.valueRow}>
                <span className={styles.value} data-empty={restValue === null || undefined}>
                  {/* Scrubbing changes the value every move: plain digits; a settled value rolls. */}
                  {atRest ? <RollingNumber>{headValue}</RollingNumber> : headValue}
                </span>
                {shownDelta !== null ? (
                  <Badge.Root tone={deltaTone} className={styles.change}>
                    {shownDelta !== 0 ? (
                      <Badge.Icon className={styles.trend} data-down={shownDelta < 0 || undefined}>
                        <Icon name="status.trendUp" />
                      </Badge.Icon>
                    ) : null}
                    {deltaText}
                  </Badge.Root>
                ) : null}
              </div>
            )}
          </RegionSwap>
        </>
      )}
      <RegionSwap state={stateKey}>
        {loading ? (
          <Skeleton shape="block" className={styles.plotSkeleton} />
        ) : (
          <div
            ref={plotRef}
            // A control of its own inside a row: the slider role already keeps a DataTable row from
            // opening; the attribute says so for any host that reads it.
            data-row-click-ignore=""
            className={styles.plot}
            role="slider"
            tabIndex={0}
            aria-label={label}
            aria-describedby={reference === undefined ? undefined : referenceId}
            aria-valuemin={0}
            aria-valuemax={Math.max(last, 0)}
            aria-valuenow={index}
            aria-valuetext={
              point
                ? formatLabel(labels.point, {
                    label: headDate ?? "",
                    value: restAggregate ? headValue : valueText,
                  })
                : undefined
            }
            onPointerDown={(event) => {
              if (event.pointerType !== "mouse")
                event.currentTarget.setPointerCapture(event.pointerId);
              fromPointer(event);
            }}
            onPointerMove={fromPointer}
            onPointerLeave={() => setActive(null)}
            onPointerUp={(event) => {
              if (event.pointerType !== "mouse") setActive(null);
            }}
            onPointerCancel={() => setActive(null)}
            onKeyDown={(event) => {
              const next =
                event.key === "ArrowLeft" || event.key === "ArrowDown"
                  ? index - 1
                  : event.key === "ArrowRight" || event.key === "ArrowUp"
                    ? index + 1
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? last
                        : null;
              if (next === null) return;
              event.preventDefault();
              setPointer(null);
              setActive(Math.max(0, Math.min(last, next)));
            }}
            onBlur={() => setActive(null)}
          >
            {geometry.reference !== null ? (
              <span
                className={styles.reference}
                style={{ "--sparkline-ref": geometry.reference } as React.CSSProperties}
                aria-hidden="true"
              />
            ) : null}
            <RegionSwap state={version} fill>
              {bars ? (
                <div className={styles.bars} aria-hidden="true">
                  <span
                    className={styles.baseline}
                    style={{ "--sparkline-zero": geometry.zero } as React.CSSProperties}
                  />
                  {data.map((p, i) => (
                    <span
                      // biome-ignore lint/suspicious/noArrayIndexKey: one bar per point, in order
                      key={i}
                      className={styles.slot}
                      {...toDataAttributes({
                        current: i === index || undefined,
                        quiet:
                          (active !== null || highlight !== undefined) && i !== index
                            ? true
                            : undefined,
                      })}
                    >
                      {p.value === null ? null : (
                        <span
                          className={styles.bar}
                          data-negative={p.value < 0 || undefined}
                          style={
                            {
                              "--sparkline-top": Math.min(y(p.value), geometry.zero),
                              "--sparkline-height": Math.abs(geometry.zero - y(p.value)),
                            } as React.CSSProperties
                          }
                        />
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                drawing
              )}
            </RegionSwap>
            {point && !bars ? (
              <span
                className={styles.cursor}
                data-hidden={restAggregate || undefined}
                aria-hidden="true"
                style={
                  {
                    "--sparkline-x": x(index),
                    "--sparkline-y": shownValue === null ? 0.5 : y(shownValue),
                  } as React.CSSProperties
                }
              >
                <span className={styles.guide} />
                <span className={styles.dot} data-empty={shownValue === null || undefined} />
              </span>
            ) : null}
          </div>
        )}
      </RegionSwap>
      {reference !== undefined ? (
        // Hidden text still feeds `aria-describedby` and is not read twice in the page flow.
        <span id={referenceId} hidden>
          {formatLabel(labels.reference, { value: formatValue(reference) })}
        </span>
      ) : null}
      <ChartTooltip
        anchorRef={plotRef}
        point={tooltipPoint}
        label={point?.label}
        onDismiss={() => setActive(null)}
      >
        <span className={styles.tooltipValue}>{valueText}</span>
      </ChartTooltip>
    </div>,
  );
}
