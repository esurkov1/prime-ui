import type { Locale } from "date-fns";
import { ru } from "date-fns/locale";
import * as React from "react";
import { useControllableState } from "@/hooks/useControllableState";
import { type AnchorPoint, ChartTooltip } from "@/internal/ChartTooltip";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { fieldTierClass } from "@/internal/fieldClasses";
import { formatLabel } from "@/internal/formatLabel";
import { useLabels } from "@/internal/labels";
import { RegionSwap } from "@/internal/RegionSwap";
import type { ControlSize, PaletteColor } from "@/internal/states";

import { Skeleton } from "../skeleton/Skeleton";
import type { BucketAggregate, Grain } from "./buckets";
import { pathsOf, type SparklineCurve, scaleOf, yOf } from "./geometry";
import { latestPresent, useSeriesLines, useSeriesModel } from "./model";
import styles from "./Sparkline.module.css";

export type { SparklineCurve };

/**
 * A point of the series: named by its `label` («8 окт», a series ready as it is), or a day by its
 * `date` (a `Date` or an ISO date «2026-10-08») — dated days fold into weeks, months or quarters
 * (`grain`) and the kit names them.
 */
export type SparklinePoint =
  | {
      /** Name of the point on the axis: a date, a week, a month («8 окт»). */
      label: string;
      date?: never;
      /** `null`: no data for this point — the line breaks, the bar is absent. */
      value: number | null;
    }
  | {
      /** The day of the point: a `Date` or an ISO date. */
      date: Date | string;
      label?: never;
      /** `null`: no data for this day. */
      value: number | null;
    };

/**
 * The step of a dated series. `auto`: the finest step with at most 31 points (16 in `compact`) —
 * a month by days, half a year by weeks, two and a half years by months, longer by quarters.
 */
export type SparklineGrain = "auto" | Grain;

/**
 * How the days of a dated point make its value: `sum` — a flow (revenue, orders per week);
 * `average` — the mean of its days; `latest` — its last day, a level (MRR, a balance).
 */
export type SparklineAggregate = BucketAggregate;

export type SparklineLabels = {
  /** Spoken value of the chosen point; `{label}` and `{value}` are replaced. */
  point: string;
  /** The period of a reading at rest (`useSparkline`); `{first}` and `{last}` are its first and last day or point. */
  period: string;
  /** Shown and spoken in place of the value of a point with no data. */
  empty: string;
  /** Description of the reference line; `{value}` is replaced. */
  reference: string;
  /** A change in percentage points (`useSparkline`, `changeUnit="points"`); `{value}` is the signed difference. */
  points: string;
  /** The name of a quarter point; `{quarter}` is its Roman number. */
  quarter: string;
  /** One line of a point with `series`; `{label}` and `{value}` are replaced. */
  series: string;
  /** The accessible name of the legend of `series`. */
  legend: string;
};

/**
 * How a line is drawn. `area`: over a gradient that fades to the bottom. `line`: the line alone.
 * `dashed`: a dashed line (a plan, a forecast). `dotted`: a dotted line (a previous period).
 */
export type SparklineLine = "area" | "line" | "dashed" | "dotted";

/** A line of `variant` (`SparklineLine`), or `bars`: a bar per point from zero — up when positive, down when negative. */
export type SparklineVariant = SparklineLine | "bars";

/**
 * A line drawn with the main series on its scale (last year, a plan, another channel), named in
 * the legend. Its points stand by position beside the main ones: the n-th with the n-th.
 */
export type SparklineSeries = {
  /** Stable key of the line. */
  id: string;
  /** Its name in the legend, the tooltip and the spoken point. */
  label: string;
  /** Its points, `{ label, value }` or dated days folded by the main series' `grain`. */
  data: SparklinePoint[];
  /** Its chart hue; default: the next chart color after the main series' accent. */
  color?: PaletteColor;
  /** How it is drawn; default `line`. */
  variant?: SparklineLine;
};

/**
 * `default`: the plot at the height of its `size`. `compact`: the plot at the height of an `xs`
 * control with a tooltip for the point, for a table cell or a list row.
 */
export type SparklineLayout = "default" | "compact";

export const SPARKLINE_LABELS: SparklineLabels = {
  point: "{label}: {value}",
  period: "{first} – {last}",
  empty: "Нет данных",
  reference: "Ориентир: {value}",
  points: "{value} п. п.",
  quarter: "{quarter} кв.",
  series: "{label}: {value}",
  legend: "Линии графика",
};

/** Points of a dated series under `auto`: a plot of its size, and a table cell. */
const GRAIN_LIMIT = { default: 31, compact: 16 } as const;

const NUMBER = new Intl.NumberFormat("ru-RU");
const formatNumber = (value: number) => NUMBER.format(value);

export type SparklineProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  data: SparklinePoint[];
  series?: SparklineSeries[];
  label: string;
  variant?: SparklineVariant;
  curve?: SparklineCurve;
  layout?: SparklineLayout;
  size?: ControlSize;
  point?: number | null;
  defaultPoint?: number | null;
  onPointChange?: (point: number | null) => void;
  highlight?: number | null;
  grain?: SparklineGrain;
  defaultGrain?: SparklineGrain;
  onGrainChange?: (grain: SparklineGrain) => void;
  aggregate?: SparklineAggregate;
  locale?: Locale;
  min?: number;
  max?: number;
  reference?: number;
  loading?: boolean;
  formatValue?: (value: number) => string;
  labels?: Partial<SparklineLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * A small chart with no headline of its own: a line, an area or bars, the lines of `series` beside
 * it and their legend. Scrubbing (pointer, touch, or the arrow keys on the chart) picks a point —
 * the `point` triad, which the headline a consumer lays out reads through `useSparkline`; leaving
 * glides back to the point at rest (`highlight`). The line is a monotone curve (`curve`), `null`
 * values break it; `bars` draw signed values from a zero line. `layout="compact"` fits a table cell:
 * a tooltip beside the point shows its value and date. Several sparklines of one axis share
 * `point`, so they follow one cursor; a compact tooltip stays with the chart scrubbed.
 */
export function Sparkline({
  data,
  series,
  label,
  variant = "area",
  curve = "smooth",
  layout = "default",
  size: sizeProp,
  point: pointProp,
  defaultPoint = null,
  onPointChange,
  highlight,
  grain: grainProp,
  defaultGrain,
  onGrainChange,
  aggregate = "latest",
  locale = ru,
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
  const bars = variant === "bars";
  const compact = layout === "compact";
  const { bucketed, points, grain } = useSeriesModel({
    data,
    grain: grainProp,
    defaultGrain,
    onGrainChange,
    aggregate,
    locale,
    quarterLabel: labels.quarter,
    limit: GRAIN_LIMIT[layout],
  });
  const last = points.length - 1;
  // `null`: the reading rests on the whole period (a total, a mean): no point is marked.
  const marksRest = highlight !== null;
  const restIndex =
    typeof highlight === "number" && highlight >= 0 && highlight <= last
      ? Math.floor(highlight)
      : latestPresent(points);
  const tier = useHostTier(sizeProp);
  const [active, setActiveValue] = useControllableState<number | null>({
    value: pointProp,
    defaultValue: defaultPoint,
    onChange: onPointChange,
  });
  // The chart a person scrubs leads: only it shows the tooltip; a chart that follows a shared
  // `point` shows the cursor alone.
  const [leading, setLeading] = React.useState(false);
  const setActive = (next: number | null) => {
    setLeading(next !== null);
    setActiveValue(next);
  };
  const index = active === null ? restIndex : Math.min(active, last);
  const atRest = active === null;
  const point = points[index];
  const plotRef = React.useRef<HTMLDivElement | null>(null);
  // The pointer over the plot (px from its corner): the tooltip follows it; `null` from the keys.
  const [pointer, setPointer] = React.useState<AnchorPoint | null>(null);
  const referenceId = React.useId();
  // An SVG `url(#…)` reference takes a plain id.
  const gradientId = `sparkline-${referenceId.replace(/[^\w-]/g, "")}`;

  // A new series cross-fades its drawing in (foundation §7 rule 8); scrubbing never does.
  const [swap, setSwap] = React.useState({ points, extra: series, version: 0 });
  const swapped = swap.points !== points || swap.extra !== series;
  if (swapped) setSwap({ points, extra: series, version: swap.version + 1 });
  const version = swapped ? swap.version + 1 : swap.version;
  const stateKey = loading ? "loading" : "data";

  const extra = useSeriesLines(series, points.length, grain, aggregate, locale, labels.quarter);

  // Scale and paths once per series: scrubbing re-renders the cursor only.
  const geometry = React.useMemo(() => {
    const values = points.map((p) => p.value);
    const scale = scaleOf(
      [...values, ...extra.flatMap((line) => line.values)],
      [min, max, reference, bars ? 0 : undefined],
    );
    const count = Math.max(points.length, 1);
    const end = points.length - 1;
    const x = (i: number) => (bars ? (i + 0.5) / count : end > 0 ? i / end : 0.5);
    const y = (value: number) => yOf(scale, value);
    // A period cut by the series' start or end is drawn dashed: its value is not the period's yet
    // (a line already dashed or dotted needs no mark).
    const solid = variant === "area" || variant === "line";
    const cutStart = solid && bucketed?.partial[0] && end > 0 ? x(1) : null;
    const cutEnd = solid && bucketed?.partial[end] && end > 0 ? x(end - 1) : null;
    const cut =
      cutStart === null && cutEnd === null ? null : { from: cutStart ?? 0, to: cutEnd ?? 1 };
    // Behind the main line, in the order given; the main one (not as bars) on top.
    const lines = [
      ...extra.map((line) => ({ ...line, cut: null, paths: pathsOf(line.values, x, y, curve) })),
      ...(bars
        ? []
        : [
            {
              key: "",
              values,
              color: undefined as string | undefined,
              variant: variant as SparklineLine,
              cut,
              paths: pathsOf(values, x, y, curve),
            },
          ]),
    ];
    return {
      lines,
      x,
      y,
      zero: y(0),
      reference: reference === undefined ? null : y(reference),
    };
  }, [points, extra, bucketed, bars, variant, curve, min, max, reference]);
  const { x, y } = geometry;

  const drawing = React.useMemo(() => {
    if (!geometry.lines.length) return null;
    return (
      <div className={styles.drawing} aria-hidden="true">
        <svg
          className={styles.svg}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {geometry.lines.map(({ key, color, variant: look, cut, paths }, i) => {
            const id = `${gradientId}-${i}`;
            return (
              <g
                key={key}
                style={color ? ({ "--sparkline-color": color } as React.CSSProperties) : undefined}
              >
                {look === "area" && paths.area ? (
                  <>
                    <defs>
                      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" className={styles.fadeTop} />
                        <stop offset="1" className={styles.fadeBottom} />
                      </linearGradient>
                    </defs>
                    <path className={styles.area} d={paths.area} fill={`url(#${id})`} />
                  </>
                ) : null}
                {paths.line && cut ? (
                  <>
                    <defs>
                      <clipPath id={`${id}-whole`}>
                        <rect
                          x={cut.from * 100}
                          y={-50}
                          width={(cut.to - cut.from) * 100}
                          height={200}
                        />
                      </clipPath>
                      <clipPath id={`${id}-cut`}>
                        <rect x={-50} y={-50} width={cut.from * 100 + 50} height={200} />
                        <rect x={cut.to * 100} y={-50} width={150 - cut.to * 100} height={200} />
                      </clipPath>
                    </defs>
                    <path className={styles.line} d={paths.line} clipPath={`url(#${id}-whole)`} />
                    <path
                      className={styles.line}
                      data-cut=""
                      d={paths.line}
                      clipPath={`url(#${id}-cut)`}
                    />
                  </>
                ) : paths.line ? (
                  <path className={styles.line} data-line={look} d={paths.line} />
                ) : null}
              </g>
            );
          })}
        </svg>
        {geometry.lines.flatMap(({ key, color, values, paths }) =>
          paths.lone.map((i) => (
            <span
              key={`${key}-${i}`}
              className={styles.lone}
              style={
                {
                  "--sparkline-x": geometry.x(i),
                  "--sparkline-y": geometry.y(values[i] as number),
                  ...(color ? { "--sparkline-color": color } : null),
                } as React.CSSProperties
              }
            />
          )),
        )}
      </div>
    );
  }, [geometry, gradientId]);

  const fromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = rect.width ? (event.clientX - rect.left) / rect.width : 1;
    const next = bars ? Math.floor(ratio * points.length) : Math.round(ratio * last);
    setPointer({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    setActive(Math.max(0, Math.min(last, next)));
  };

  const shownValue = point?.value ?? null;
  const valueText = shownValue === null ? labels.empty : formatValue(shownValue);
  // A reading of the whole period hides the dot at rest; the legend then gives each line's own
  // total or mean, as its days fold (`aggregate`).
  const restPeriod = atRest && !marksRest;
  const lineTexts = extra.map((line) => {
    const shown = !restPeriod
      ? line.values[index]
      : aggregate === "sum"
        ? line.total
        : aggregate === "average"
          ? line.mean
          : line.values[index];
    return {
      ...line,
      text: shown === null || shown === undefined ? labels.empty : formatValue(shown),
    };
  });
  const layoutAttr = compact ? layout : undefined;
  // Beside the pointer; from the keyboard beside the point, at the middle of the plot.
  const plotNode = plotRef.current;
  const tooltipPoint: AnchorPoint | null =
    !compact || active === null || !point || !leading
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
                    label: point.label,
                    value: [
                      valueText,
                      ...lineTexts.map((line) =>
                        formatLabel(labels.series, { label: line.label, value: line.text }),
                      ),
                    ].join("; "),
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
              if (event.key === "Escape" && active !== null && !compact) {
                // The compact tooltip dismisses itself (and the point) on Escape.
                event.preventDefault();
                setActive(null);
                return;
              }
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
                  {points.map((p, i) => (
                    <span
                      // biome-ignore lint/suspicious/noArrayIndexKey: one bar per point, in order
                      key={i}
                      className={styles.slot}
                      {...toDataAttributes({
                        current: i === index || undefined,
                        partial: bucketed?.partial[i] || undefined,
                        quiet:
                          (active !== null || typeof highlight === "number") && i !== index
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
                  {/* The lines of `series` over the bars. */}
                  {drawing}
                </div>
              ) : (
                drawing
              )}
            </RegionSwap>
            {point && geometry.lines.length ? (
              <span
                className={styles.cursor}
                data-hidden={restPeriod || undefined}
                aria-hidden="true"
                style={{ "--sparkline-x": x(index) } as React.CSSProperties}
              >
                <span className={styles.guide} />
                {geometry.lines.map((line) => {
                  const at = line.values[index] ?? null;
                  return (
                    <span
                      key={line.key}
                      className={styles.dot}
                      data-empty={at === null || undefined}
                      style={
                        {
                          "--sparkline-y": at === null ? 0.5 : y(at),
                          ...(line.color ? { "--sparkline-color": line.color } : null),
                        } as React.CSSProperties
                      }
                    />
                  );
                })}
              </span>
            ) : null}
          </div>
        )}
      </RegionSwap>
      {lineTexts.length && !compact ? (
        // The names of the lines (meaning never by color alone) and their values at the point; the
        // headline already gives the main one's. Not ChartFrame.Legend: that one toggles the series
        // of its frame, these lines are not hidden.
        // biome-ignore lint/a11y/noRedundantRoles: `list-style: none` drops the list semantics in WebKit; the role keeps them
        <ul role="list" className={styles.legend} aria-label={labels.legend}>
          <LegendItem label={label} variant={variant} />
          {lineTexts.map((line) => (
            <LegendItem key={line.key} label={line.label} variant={line.variant} color={line.color}>
              {loading ? null : line.text}
            </LegendItem>
          ))}
        </ul>
      ) : null}
      {reference !== undefined ? (
        // Hidden text still feeds `aria-describedby` and is not read twice in the page flow.
        <span id={referenceId} hidden>
          {formatLabel(labels.reference, { value: formatValue(reference) })}
        </span>
      ) : null}
      {/* The headline already shows the point: only the compact plot, which has none, needs a tooltip. */}
      {compact ? (
        <ChartTooltip
          anchorRef={plotRef}
          point={tooltipPoint}
          label={point?.label}
          onDismiss={() => setActive(null)}
        >
          {lineTexts.length ? (
            // biome-ignore lint/a11y/noRedundantRoles: `list-style: none` drops the list semantics in WebKit; the role keeps them
            <ul role="list" className={styles.legend} data-in="tooltip">
              <LegendItem label={label} variant={variant}>
                {valueText}
              </LegendItem>
              {lineTexts.map((line) => (
                <LegendItem
                  key={line.key}
                  label={line.label}
                  variant={line.variant}
                  color={line.color}
                >
                  {line.text}
                </LegendItem>
              ))}
            </ul>
          ) : (
            <span className={styles.tooltipValue}>{valueText}</span>
          )}
        </ChartTooltip>
      ) : null}
    </div>,
  );
}

/** A line of the legend: a swatch drawn like the line, its name and, given, its value. */
function LegendItem({
  label,
  variant,
  color,
  children,
}: {
  label: string;
  variant: SparklineVariant;
  color?: string;
  children?: React.ReactNode;
}) {
  return (
    <li
      className={styles.legendItem}
      style={color ? ({ "--sparkline-color": color } as React.CSSProperties) : undefined}
    >
      <span className={styles.swatch} data-line={variant} aria-hidden="true" />
      <span className={styles.legendLabel}>{label}</span>
      {children === undefined || children === null ? null : (
        <span className={styles.legendValue}>{children}</span>
      )}
    </li>
  );
}
