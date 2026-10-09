import * as React from "react";

import { useStateSwap } from "@/hooks/useStateSwap";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { ProgressLegend, ProgressLegendSkeleton } from "@/internal/ProgressLegend";
import palette from "@/internal/palette.module.css";
import {
  DEFAULT_PROGRESS_SEGMENTS_LABELS,
  formatProgressValue,
  type ProgressModeProps,
  type ProgressSegment,
  type ProgressSegmentsLabels,
  resolveSegments,
  resolveValue,
  segmentFill,
} from "@/internal/progressSegments";
import type { ControlSize, Tone } from "@/internal/states";
import swap from "@/internal/swapMotion.module.css";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import { Skeleton } from "../skeleton/Skeleton";
import styles from "./ProgressCircle.module.css";

/*
 * Geometry in viewBox units (0…100): the stroke is always 1/12 of the diameter, so the ring keeps
 * one proportion at every tier; the diameter itself comes from CSS (`--pc-size`, rem tokens).
 */
const STROKE = 100 / 12;
const RADIUS = 50 - STROKE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** Visible gap between `hairline` parts: ¾ of the stroke, like ProgressBar. */
const HAIRLINE_GAP = STROKE * 0.75;

/** Rings below `m` are too small for readable inner text: `children` are not rendered there. */
const SIZES_WITHOUT_INNER: ReadonlySet<ControlSize> = new Set(["xs", "s"]);

/** Legend rows drawn while a distribution loads and its length is not known yet. */
const LOADING_ROWS = 3;

export type ProgressCircleLabels = ProgressSegmentsLabels;

export type ProgressCircleProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Default `m`. */
  size?: ControlSize;
  /**
   * Centered content (number, percent, icon). Not rendered on `xs` / `s`; a string or number
   * child stays available as `aria-valuetext`.
   */
  children?: React.ReactNode;
  /**
   * The data is on its way: a Skeleton ring of the same size (and legend rows), which cross-fades
   * into the data. The root is `aria-busy`.
   */
  loading?: boolean;
  ref?: React.Ref<HTMLDivElement>;
} & ProgressModeProps;

type Fill = ReturnType<typeof segmentFill>;
type Arc = { start: number; length: number; fill?: Fill; rest?: boolean };

/** One arc of `length` from `start` (viewBox units along the circle, clockwise from the top). */
function arcStyle(start: number, length: number): React.CSSProperties {
  return {
    strokeDasharray: `${Math.max(length, 0)} ${CIRCUMFERENCE}`,
    strokeDashoffset: -start,
  };
}

function Ring(props: React.SVGProps<SVGCircleElement>) {
  return <circle cx={50} cy={50} r={RADIUS} strokeWidth={STROKE} {...props} />;
}

/** `data-tone` / `data-color` and the palette class of a part. */
function fillProps(fill: Fill | undefined) {
  return {
    className: fill?.color ? palette.hue : undefined,
    ...toDataAttributes(fill ?? { tone: "accent" }),
  };
}

/** Round cap of a continuous arc: a dot at the arc start (3 o'clock), rotated to `position`. */
function Cap({ position, fill }: { position: number; fill?: Fill }) {
  const own = fillProps(fill);
  return (
    <circle
      cx={50 + RADIUS}
      cy={50}
      r={STROKE / 2}
      {...own}
      className={cx(own.className, styles.cap)}
      style={{ rotate: `${(position / CIRCUMFERENCE) * 360}deg` }}
    />
  );
}

function SegmentArcs({
  arcs,
  gap,
  closed,
}: {
  arcs: Arc[];
  gap: "none" | "hairline";
  closed: boolean;
}) {
  if (gap === "hairline" && arcs.length > 1) {
    // Round caps add half a stroke on each side; shorten every dash to keep the visible gap.
    const inset = (STROKE + HAIRLINE_GAP) / 2;
    return (
      <>
        {arcs.map((a, i) => {
          const own = a.rest ? { className: undefined } : fillProps(a.fill);
          return (
            <Ring
              // biome-ignore lint/suspicious/noArrayIndexKey: presentational parts in source order
              key={i}
              {...own}
              className={cx(own.className, a.rest ? styles.restRound : styles.segmentRound)}
              style={arcStyle(a.start + inset, a.length - inset * 2)}
            />
          );
        })}
      </>
    );
  }
  const parts = arcs.filter((a) => !a.rest);
  const first = parts[0];
  const last = parts[parts.length - 1];
  return (
    <>
      {parts.map((a, i) => {
        const own = fillProps(a.fill);
        return (
          <Ring
            // biome-ignore lint/suspicious/noArrayIndexKey: presentational parts in source order
            key={i}
            {...own}
            className={cx(own.className, styles.segment)}
            style={arcStyle(a.start, a.length)}
          />
        );
      })}
      {/* Flat joints inside, round caps at both ends of the filled share (as in ProgressBar). */}
      {first && last && !closed ? (
        <>
          <Cap position={first.start} fill={first.fill} />
          <Cap position={last.start + last.length} fill={last.fill} />
        </>
      ) : null}
    </>
  );
}

/**
 * A progress ring: a single `value` (`role="progressbar"`) or `segments` — parts of a whole
 * clockwise from the top (`role="group"` described by the distribution), with an optional legend
 * beside the ring.
 */
export function ProgressCircle(props: ProgressCircleProps) {
  const {
    size = "m",
    children,
    className,
    loading = false,
    "aria-label": label,
    value: valueProp,
    max: maxProp,
    tone: toneProp,
    segments: segmentsProp,
    segmentGap = "none",
    legend = false,
    formatValue = formatProgressValue,
    labels,
    ...rest
  } = props;
  const descriptionId = React.useId();
  const swapped = useStateSwap(loading ? "loading" : "data");
  const swapClass = swapped ? swap.swapIn : undefined;
  const showInner =
    !loading && children != null && children !== false && !SIZES_WITHOUT_INNER.has(size);
  const valueText =
    typeof children === "string" || typeof children === "number" ? String(children) : undefined;

  let tone: Tone | undefined;
  let svg: React.ReactNode;
  let description: React.ReactNode = null;
  let legendNode: React.ReactNode = null;

  if (segmentsProp) {
    const gap = segmentGap;
    const resolved = resolveSegments(segmentsProp, maxProp, {
      ...DEFAULT_PROGRESS_SEGMENTS_LABELS,
      ...labels,
    });
    const { segments, total, rest: free, scale, text } = resolved;
    const unit = scale > 0 ? CIRCUMFERENCE / scale : 0;
    const arcs: Arc[] = [];
    let cursor = 0;
    for (const seg of segments as ProgressSegment[]) {
      if (seg.value > 0)
        arcs.push({ start: cursor, length: seg.value * unit, fill: segmentFill(seg) });
      cursor += seg.value * unit;
    }
    if (free > 0 && total > 0) arcs.push({ start: cursor, length: free * unit, rest: true });
    const showLegend = legend && segments.length > 0;
    const a11y = label
      ? { "aria-label": label, "aria-describedby": descriptionId }
      : { "aria-label": text };
    if (label && !showLegend) {
      description = <VisuallyHidden id={descriptionId}>{text}</VisuallyHidden>;
    }
    if (legend) {
      legendNode = loading ? (
        <ProgressLegendSkeleton
          key="loading"
          rows={segmentsProp.length || LOADING_ROWS}
          size={size}
          className={cx(styles.legend, swapClass)}
        />
      ) : showLegend ? (
        <ProgressLegend
          key="data"
          id={label ? descriptionId : undefined}
          segments={segments}
          scale={scale}
          formatValue={formatValue}
          size={size}
          className={cx(styles.legend, swapClass)}
        />
      ) : null;
    }

    svg = (
      // biome-ignore lint/a11y/useSemanticElements: a distribution is a group of parts, not a fieldset
      <svg
        key="data"
        viewBox="0 0 100 100"
        className={cx(styles.svg, swapClass)}
        role="group"
        {...a11y}
        {...toDataAttributes({ "segment-gap": gap })}
      >
        <g className={styles.arcs}>
          {gap === "none" || total === 0 ? <Ring className={styles.track} /> : null}
          {total > 0 ? <SegmentArcs arcs={arcs} gap={gap} closed={free === 0} /> : null}
        </g>
      </svg>
    );
  } else {
    const { value, max, ratio } = resolveValue(valueProp ?? 0, maxProp);
    tone = toneProp ?? "accent";
    svg = (
      <svg
        key="data"
        viewBox="0 0 100 100"
        className={cx(styles.svg, swapClass)}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        aria-valuetext={valueText}
      >
        <g className={styles.arcs}>
          <Ring className={styles.track} />
          <Ring
            className={styles.fill}
            style={{
              strokeDasharray: `${CIRCUMFERENCE} ${CIRCUMFERENCE}`,
              strokeDashoffset: CIRCUMFERENCE * (1 - ratio),
              opacity: value === 0 ? 0 : undefined,
            }}
          />
        </g>
      </svg>
    );
  }

  const ring = (
    <>
      {loading ? (
        <Skeleton key="loading" shape="block" className={cx(styles.ringSkeleton, swapClass)} />
      ) : (
        svg
      )}
      {loading ? null : description}
      {showInner ? (
        <div className={styles.inner} aria-hidden={valueText !== undefined ? true : undefined}>
          {children}
        </div>
      ) : null}
    </>
  );
  const rootProps = {
    ...rest,
    "aria-busy": loading || undefined,
    ...toDataAttributes({ size, tone, legend: legend || undefined }),
  };

  // With a legend the root is a row: the ring and the legend beside it (below when narrow).
  if (legend) {
    return (
      <div className={cx(styles.root, className)} {...rootProps}>
        <div className={styles.ring}>{ring}</div>
        {legendNode}
      </div>
    );
  }
  return (
    <div className={cx(styles.root, className)} {...rootProps}>
      {ring}
    </div>
  );
}
