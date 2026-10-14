import * as React from "react";
import { useStateSwap } from "@/hooks/useStateSwap";
import { Icon } from "@/icons";
import { type AnchorPoint, ChartTooltip } from "@/internal/ChartTooltip";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { formatLabel } from "@/internal/formatLabel";
import { RollingNumber } from "@/internal/RollingNumber";
import swap from "@/internal/swapMotion.module.css";

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
  /** The period of a `sum` / `average` headline at rest; `{first}` and `{last}` are point labels. */
  period: string;
  /** Shown and spoken in place of the value of a point with no data. */
  empty: string;
  /** Description of the reference line; `{value}` is replaced. */
  reference: string;
};

/**
 * `area`: a line over a gradient that fades to the bottom. `line`: the line alone (many trends side
 * by side). `bars`: a bar per point from zero — up when positive, down when negative.
 */
export type SparklineVariant = "area" | "line" | "bars";

/**
 * What the change badge compares the shown point with. `previous`: the point before it.
 * `first`: the first point of the series (the change over the period). `none`: no badge.
 */
export type SparklineChange = "previous" | "first" | "none";

/**
 * What the headline shows at rest. `latest`: the latest point (or `highlight`) — a level such as
 * MRR, a price, a conversion. `sum`: the total of the period — a flow such as revenue or orders
 * per day. `average`: the mean of the period.
 */
export type SparklineSummary = "latest" | "sum" | "average";

/**
 * `default`: the headline (title · date, value · change) over the plot. `compact`: the plot alone at
 * the height of an `xs` control, for a table cell or a list row.
 */
export type SparklineLayout = "default" | "compact";

const SPARKLINE_LABELS: SparklineLabels = {
  point: "{label}: {value}",
  period: "{first} – {last}",
  empty: "Нет данных",
  reference: "Ориентир: {value}",
};

const NUMBER = new Intl.NumberFormat("ru-RU");
const PERCENT = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });
const formatNumber = (value: number) => NUMBER.format(value);

type SparklineRest =
  | {
      /** Default `latest`. */
      summary?: "latest";
      /**
       * Index of the point at rest (the current month): the headline shows it when nobody scrubs,
       * and `bars` draw the other bars quieter. Default: the latest point with a value.
       */
      highlight?: number;
    }
  | {
      summary: "sum" | "average";
      /** A total or a mean is no point: there is nothing to highlight at rest. */
      highlight?: never;
    };

export type SparklineProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> &
  SparklineRest & {
    /** Points in order, oldest first; two present points in a row draw a line. */
    data: SparklinePoint[];
    /**
     * Visible title above the value and the accessible name of the chart; with `layout="compact"`
     * only the accessible name.
     */
    label: string;
    /** Default `area`. */
    variant?: SparklineVariant;
    /** Shape of the line between points (`area`, `line`). Default `smooth`. */
    curve?: SparklineCurve;
    /** Default `default`. */
    layout?: SparklineLayout;
    /** What a scrubbed point's change badge compares with. Default `previous`. */
    change?: SparklineChange;
    /**
     * The same summary for the previous period («прошлые 30 дней»): the change badge at rest compares
     * the headline with it. Without it a `sum` / `average` headline shows no change at rest.
     */
    compareTo?: number;
    /**
     * The value axis spans at least `min`…`max`: one scale for several sparklines (a table column)
     * or a meaningful floor. Data outside widens the scale, never gets cut.
     */
    min?: number;
    max?: number;
    /** A dashed horizontal line at this value: a plan, a target, an average. */
    reference?: number;
    /**
     * The series is on its way: Skeletons of the value, the date and the plot, which cross-fade into
     * the data. The title stays; the root is `aria-busy`.
     */
    loading?: boolean;
    /** Display of a value («312 400 ₽»). Default: the number with Russian digit groups. */
    formatValue?: (value: number) => string;
    labels?: Partial<SparklineLabels>;
    ref?: React.Ref<HTMLDivElement>;
  };

/**
 * Change of the shown point against the compared one, in percent; `null` when there is nothing to
 * compare or a percentage means nothing — a value is missing, the base is 0, or the sign flips.
 */
function changeAt(data: SparklinePoint[], index: number, mode: SparklineChange): number | null {
  if (mode === "none") return null;
  const from = mode === "first" ? data.findIndex((p) => p.value !== null) : index - 1;
  if (from < 0 || from >= index) return null;
  return percentChange(data[from].value, data[index].value);
}

function percentChange(base: number | null, next: number | null): number | null {
  if (base === null || next === null) return null;
  if (base === 0 || (next !== 0 && Math.sign(base) !== Math.sign(next))) return null;
  return ((next - base) / Math.abs(base)) * 100;
}

function latestPresent(data: SparklinePoint[]): number {
  for (let i = data.length - 1; i >= 0; i--) if (data[i].value !== null) return i;
  return data.length - 1;
}

/**
 * A small chart with its headline: the value at rest (the latest point, `highlight`, or the period's
 * total or mean — `summary`), its change and its date or period. Scrubbing (pointer, touch, or the arrow keys on the chart) shows any point; the
 * header follows instantly, the trend arrow turns, and leaving glides back to the point at rest.
 * The line is a monotone curve (`curve`), `null` values break it; `bars` draw signed values from a
 * zero line; a tooltip beside the scrubbed point shows its value and date. `layout="compact"` is
 * the plot alone (a table cell).
 */
export function Sparkline({
  data,
  label,
  variant = "area",
  curve = "smooth",
  layout = "default",
  change = "previous",
  summary = "latest",
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
  const labels = { ...SPARKLINE_LABELS, ...labelsProp };
  const last = data.length - 1;
  const bars = variant === "bars";
  const compact = layout === "compact";
  const restIndex =
    highlight !== undefined && highlight >= 0 && highlight <= last
      ? Math.floor(highlight)
      : latestPresent(data);
  const [active, setActive] = React.useState<number | null>(null);
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
  const swapped = useStateSwap(loading ? "loading" : version);
  const swapClass = swapped ? swap.swapIn : undefined;

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
      <div key={version} className={cx(styles.drawing, swapClass)} aria-hidden="true">
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
  }, [geometry, variant, version, swapClass, gradientId]);

  const fromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = rect.width ? (event.clientX - rect.left) / rect.width : 1;
    const next = bars ? Math.floor(ratio * data.length) : Math.round(ratio * last);
    setPointer({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    setActive(Math.max(0, Math.min(last, next)));
  };

  const shownValue = point?.value ?? null;
  const valueText = shownValue === null ? labels.empty : formatValue(shownValue);
  // A sum or a mean at rest stands for the whole period, not a point: no dot, the period as date.
  const aggregate =
    summary === "sum" && data.length
      ? geometry.total
      : summary === "average"
        ? geometry.mean
        : null;
  const restAggregate = atRest && summary !== "latest";
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
      ? percentChange(compareTo, restValue)
      : restAggregate
        ? null
        : changeAt(data, index, change);
  const layoutAttr = compact ? layout : undefined;
  // Beside the pointer; from the keyboard beside the point, at the middle of the plot.
  const plotNode = plotRef.current;
  const tooltipPoint: AnchorPoint | null =
    active === null || !point
      ? null
      : (pointer ??
        (plotNode ? { x: x(index) * plotNode.offsetWidth, y: plotNode.offsetHeight / 2 } : null));

  if (loading) {
    return (
      <div
        {...rest}
        ref={ref}
        className={cx(styles.root, className)}
        data-layout={layoutAttr}
        aria-busy="true"
      >
        {compact ? null : (
          <>
            <div className={styles.head}>
              <span className={styles.label}>{label}</span>
              <Skeleton shape="text" size="s" className={cx(styles.dateSkeleton, swapClass)} />
            </div>
            <Skeleton shape="block" className={cx(styles.valueSkeleton, swapClass)} />
          </>
        )}
        <Skeleton shape="block" className={cx(styles.plotSkeleton, swapClass)} />
      </div>
    );
  }

  return (
    <div
      {...rest}
      ref={ref}
      className={cx(styles.root, className)}
      data-scrubbing={active !== null || undefined}
      data-variant={variant}
      data-layout={layoutAttr}
    >
      {compact ? null : (
        <>
          <div className={styles.head}>
            <span className={styles.label}>{label}</span>
            <span className={styles.date}>{headDate}</span>
          </div>
          <div className={styles.valueRow}>
            <span className={styles.value} data-empty={restValue === null || undefined}>
              {/* Scrubbing changes the value every move: plain digits; a settled value rolls. */}
              {atRest ? <RollingNumber>{headValue}</RollingNumber> : headValue}
            </span>
            {delta !== null ? (
              <Badge.Root color={delta < 0 ? "red" : "green"} className={styles.change}>
                <Badge.Icon className={styles.trend} data-down={delta < 0 || undefined}>
                  <Icon name="status.trendUp" />
                </Badge.Icon>
                {`${delta > 0 ? "+" : delta < 0 ? "−" : ""}${PERCENT.format(Math.abs(delta))}%`}
              </Badge.Root>
            ) : null}
          </div>
        </>
      )}
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
          if (event.pointerType !== "mouse") event.currentTarget.setPointerCapture(event.pointerId);
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
        {bars ? (
          <div key={version} className={cx(styles.bars, swapClass)} aria-hidden="true">
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
                    (active !== null || highlight !== undefined) && i !== index ? true : undefined,
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
    </div>
  );
}
