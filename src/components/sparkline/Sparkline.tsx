import * as React from "react";
import { useStateSwap } from "@/hooks/useStateSwap";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { formatLabel } from "@/internal/formatLabel";
import { RollingNumber } from "@/internal/RollingNumber";
import swap from "@/internal/swapMotion.module.css";

import { Badge } from "../badge/Badge";
import { Skeleton } from "../skeleton/Skeleton";
import styles from "./Sparkline.module.css";

export type SparklinePoint = {
  /** Name of the point on the axis: a date, a week, a month («8 окт»). */
  label: string;
  value: number;
};

export type SparklineLabels = {
  /** Spoken value of the chosen point; `{label}` and `{value}` are replaced. */
  point: string;
};

/** `line`: a line with a soft area. `bars`: a bar per point from zero — up when positive, down when negative. */
export type SparklineVariant = "line" | "bars";

const SPARKLINE_LABELS: SparklineLabels = { point: "{label}: {value}" };

const NUMBER = new Intl.NumberFormat("ru-RU");
const PERCENT = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });

export type SparklineProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Points in order, oldest first; at least two draw a line. */
  data: SparklinePoint[];
  /** Visible title above the value and the accessible name of the chart. */
  label: string;
  /** Default `line`. */
  variant?: SparklineVariant;
  /**
   * Index of the point at rest (the current month): the headline shows it when nobody scrubs, and
   * `bars` draw the other bars quieter. Default: the latest point.
   */
  highlight?: number;
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
 * Change of a point against the one before it, in percent; `null` for the first point and when a
 * percentage means nothing — the previous value is 0 or the sign flips (−20 → +30).
 */
function changeAt(data: SparklinePoint[], index: number): number | null {
  if (index <= 0) return null;
  const prev = data[index - 1].value;
  const next = data[index].value;
  if (prev === 0 || (next !== 0 && Math.sign(prev) !== Math.sign(next))) return null;
  return ((next - prev) / Math.abs(prev)) * 100;
}

/**
 * A small chart with its headline: the value at rest (the latest point or `highlight`), its change
 * against the point before and its date. Scrubbing (pointer, touch, or the arrow keys on the chart)
 * shows any point; the header follows instantly, the trend arrow turns, and leaving glides back to
 * the point at rest. `bars` draw signed values from a zero line.
 */
export function Sparkline({
  data,
  label,
  variant = "line",
  highlight,
  loading = false,
  formatValue = (value) => NUMBER.format(value),
  labels: labelsProp,
  className,
  ref,
  ...rest
}: SparklineProps) {
  const labels = { ...SPARKLINE_LABELS, ...labelsProp };
  const last = data.length - 1;
  const restIndex =
    highlight !== undefined && highlight >= 0 && highlight <= last ? Math.floor(highlight) : last;
  const [active, setActive] = React.useState<number | null>(null);
  const index = active === null ? restIndex : Math.min(active, last);
  const point = data[index];
  const bars = variant === "bars";

  // A new series cross-fades its line in (foundation §7 rule 8); scrubbing never does.
  const [series, setSeries] = React.useState({ data, version: 0 });
  if (series.data !== data) setSeries({ data, version: series.version + 1 });
  const version = series.data === data ? series.version : series.version + 1;
  const swapped = useStateSwap(loading ? "loading" : version);
  const swapClass = swapped ? swap.swapIn : undefined;

  const values = data.map((p) => p.value);
  // Bars stand on zero, so the scale always holds it; a line spans only its own values.
  const min = bars ? Math.min(0, ...values) : Math.min(...values);
  const max = bars ? Math.max(0, ...values) : Math.max(...values);
  const span = max - min || 1;
  const y = (value: number) => 1 - (value - min) / span;
  const count = Math.max(data.length, 1);
  const x = (i: number) => (bars ? (i + 0.5) / count : last > 0 ? i / last : 0.5);
  const line = data.map((p, i) => `${i ? "L" : "M"}${x(i) * 100},${y(p.value) * 100}`).join("");
  const zero = y(0);

  const fromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = rect.width ? (event.clientX - rect.left) / rect.width : 1;
    const next = bars ? Math.floor(ratio * count) : Math.round(ratio * last);
    setActive(Math.max(0, Math.min(last, next)));
  };

  const change = changeAt(data, index);
  const valueText = point ? formatValue(point.value) : "";

  if (loading) {
    return (
      <div {...rest} ref={ref} className={cx(styles.root, className)} aria-busy="true">
        <div className={styles.head}>
          <span className={styles.label}>{label}</span>
          <Skeleton shape="text" size="s" className={cx(styles.dateSkeleton, swapClass)} />
        </div>
        <Skeleton shape="block" className={cx(styles.valueSkeleton, swapClass)} />
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
    >
      <div className={styles.head}>
        <span className={styles.label}>{label}</span>
        <span className={styles.date}>{point?.label}</span>
      </div>
      <div className={styles.valueRow}>
        <span className={styles.value}>
          {/* Scrubbing changes the value every move: plain digits; a settled value rolls. */}
          {active === null ? <RollingNumber>{valueText}</RollingNumber> : valueText}
        </span>
        {change !== null ? (
          <Badge.Root color={change < 0 ? "red" : "green"} className={styles.change}>
            <Badge.Icon className={styles.trend} data-down={change < 0 || undefined}>
              <Icon name="status.trendUp" />
            </Badge.Icon>
            {`${change > 0 ? "+" : change < 0 ? "−" : ""}${PERCENT.format(Math.abs(change))}%`}
          </Badge.Root>
        ) : null}
      </div>
      <div
        className={styles.plot}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={Math.max(last, 0)}
        aria-valuenow={index}
        aria-valuetext={
          point ? formatLabel(labels.point, { label: point.label, value: valueText }) : undefined
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
          setActive(Math.max(0, Math.min(last, next)));
        }}
        onBlur={() => setActive(null)}
      >
        {bars ? (
          <div key={version} className={cx(styles.bars, swapClass)} aria-hidden="true">
            <span
              className={styles.baseline}
              style={{ "--sparkline-zero": zero } as React.CSSProperties}
            />
            {data.map((p, i) => {
              const top = Math.min(y(p.value), zero);
              const height = Math.abs(zero - y(p.value));
              return (
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
                  <span
                    className={styles.bar}
                    data-negative={p.value < 0 || undefined}
                    style={
                      {
                        "--sparkline-top": top,
                        "--sparkline-height": height,
                      } as React.CSSProperties
                    }
                  />
                </span>
              );
            })}
          </div>
        ) : (
          <svg
            key={version}
            className={cx(styles.svg, swapClass)}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {data.length > 1 ? (
              <>
                <path className={styles.area} d={`${line}L100,100L0,100Z`} />
                <path className={styles.line} d={line} />
              </>
            ) : null}
          </svg>
        )}
        {point && !bars ? (
          <span
            className={styles.cursor}
            aria-hidden="true"
            style={
              { "--sparkline-x": x(index), "--sparkline-y": y(point.value) } as React.CSSProperties
            }
          >
            <span className={styles.guide} />
            <span className={styles.dot} />
          </span>
        ) : null}
      </div>
    </div>
  );
}
