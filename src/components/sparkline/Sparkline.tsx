import * as React from "react";
import { useStateSwap } from "@/hooks/useStateSwap";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { formatLabel } from "@/internal/formatLabel";
import { RollingNumber } from "@/internal/RollingNumber";
import swap from "@/internal/swapMotion.module.css";

import { Badge } from "../badge/Badge";
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

const SPARKLINE_LABELS: SparklineLabels = { point: "{label}: {value}" };

const NUMBER = new Intl.NumberFormat("ru-RU");
const PERCENT = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });

export type SparklineProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Points in order, oldest first; at least two draw a line. */
  data: SparklinePoint[];
  /** Visible title above the value and the accessible name of the chart. */
  label: string;
  /** Display of a value («312 400 ₽»). Default: the number with Russian digit groups. */
  formatValue?: (value: number) => string;
  labels?: Partial<SparklineLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

/** Change of a point against the one before it, in percent; `null` for the first point. */
function changeAt(data: SparklinePoint[], index: number): number | null {
  if (index <= 0) return null;
  const prev = data[index - 1].value;
  return prev === 0 ? null : ((data[index].value - prev) / Math.abs(prev)) * 100;
}

/**
 * A small line chart with its headline: the latest value, its change against the point before and
 * its date. Scrubbing (pointer, touch, or the arrow keys on the chart) shows any point; the header
 * follows instantly, the trend arrow turns, and leaving glides the cursor back to the latest point.
 */
export function Sparkline({
  data,
  label,
  formatValue = (value) => NUMBER.format(value),
  labels: labelsProp,
  className,
  ref,
  ...rest
}: SparklineProps) {
  const labels = { ...SPARKLINE_LABELS, ...labelsProp };
  const last = data.length - 1;
  const [active, setActive] = React.useState<number | null>(null);
  const index = active === null ? last : Math.min(active, last);
  const point = data[index];

  // A new series cross-fades its line in (foundation §7 rule 8); scrubbing never does.
  const [series, setSeries] = React.useState({ data, version: 0 });
  if (series.data !== data) setSeries({ data, version: series.version + 1 });
  const version = series.data === data ? series.version : series.version + 1;
  const swapped = useStateSwap(version);

  const values = data.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const y = (value: number) => 1 - (value - min) / span;
  const x = (i: number) => (last > 0 ? i / last : 0.5);
  const line = data.map((p, i) => `${i ? "L" : "M"}${x(i) * 100},${y(p.value) * 100}`).join("");

  const fromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = rect.width ? (event.clientX - rect.left) / rect.width : 1;
    setActive(Math.max(0, Math.min(last, Math.round(ratio * last))));
  };

  const change = changeAt(data, index);
  const valueText = point ? formatValue(point.value) : "";

  return (
    <div
      {...rest}
      ref={ref}
      className={cx(styles.root, className)}
      data-scrubbing={active !== null || undefined}
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
        <svg
          key={version}
          className={cx(styles.svg, swapped && swap.swapIn)}
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
        {point ? (
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
