import * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import {
  DEFAULT_PROGRESS_SEGMENTS_LABELS,
  type ProgressSegment,
  type ProgressSegmentsLabels,
  resolveSegments,
} from "@/internal/progressSegments";
import type { ControlSize, Tone } from "@/internal/states";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

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

export type ProgressCircleLabels = ProgressSegmentsLabels;

type ProgressCircleCommonProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Default `m`. */
  size?: ControlSize;
  /**
   * Centered content (number, percent, icon). Not rendered on `xs` / `s`; a string or number
   * child stays available as `aria-valuetext`.
   */
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

type ProgressCircleValueProps = ProgressCircleCommonProps & {
  /** Current value; clamped to `0…max`. */
  value: number;
  /** Top of the scale. Default `100`. */
  max?: number;
  /** Arc color. Default `accent`. */
  tone?: Tone;
  segments?: never;
  segmentGap?: never;
  labels?: never;
};

type ProgressCircleSegmentsProps = ProgressCircleCommonProps & {
  /** Parts of the ring in order, clockwise from the top; each one's length is its share of `max`. */
  segments: ProgressSegment[];
  /** Total capacity. Default: the sum of the segments (they close the ring). */
  max?: number;
  /** `hairline` draws every part as its own rounded arc with a gap. */
  segmentGap?: "none" | "hairline";
  /** Built-in accessible strings for empty distributions. */
  labels?: Partial<ProgressCircleLabels>;
  value?: never;
  tone?: never;
};

export type ProgressCircleProps = ProgressCircleValueProps | ProgressCircleSegmentsProps;

type Arc = { start: number; length: number; tone?: Tone; rest?: boolean };

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

/** Round cap of a continuous arc: a dot at the arc start (3 o'clock), rotated to `position`. */
function Cap({ position, tone }: { position: number; tone?: Tone }) {
  return (
    <circle
      cx={50 + RADIUS}
      cy={50}
      r={STROKE / 2}
      className={styles.cap}
      style={{ rotate: `${(position / CIRCUMFERENCE) * 360}deg` }}
      {...toDataAttributes({ tone: tone ?? "accent" })}
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
        {arcs.map((a, i) => (
          <Ring
            // biome-ignore lint/suspicious/noArrayIndexKey: presentational parts in source order
            key={i}
            className={a.rest ? styles.restRound : styles.segmentRound}
            style={arcStyle(a.start + inset, a.length - inset * 2)}
            {...(a.rest ? {} : toDataAttributes({ tone: a.tone ?? "accent" }))}
          />
        ))}
      </>
    );
  }
  const parts = arcs.filter((a) => !a.rest);
  const first = parts[0];
  const last = parts[parts.length - 1];
  return (
    <>
      {parts.map((a, i) => (
        <Ring
          // biome-ignore lint/suspicious/noArrayIndexKey: presentational parts in source order
          key={i}
          className={styles.segment}
          style={arcStyle(a.start, a.length)}
          {...toDataAttributes({ tone: a.tone ?? "accent" })}
        />
      ))}
      {/* Flat joints inside, round caps at both ends of the filled share (as in ProgressBar). */}
      {first && last && !closed ? (
        <>
          <Cap position={first.start} tone={first.tone} />
          <Cap position={last.start + last.length} tone={last.tone} />
        </>
      ) : null}
    </>
  );
}

/**
 * A progress ring: a single `value` (`role="progressbar"`) or `segments` — parts of a whole
 * clockwise from the top (`role="group"` described by the distribution).
 */
export function ProgressCircle(props: ProgressCircleProps) {
  const {
    size = "m",
    children,
    className,
    "aria-label": label,
    value: valueProp,
    max: maxProp,
    tone: toneProp,
    segments: segmentsProp,
    segmentGap = "none",
    labels,
    ...rest
  } = props;
  const descriptionId = React.useId();
  const showInner = children != null && children !== false && !SIZES_WITHOUT_INNER.has(size);
  const valueText =
    typeof children === "string" || typeof children === "number" ? String(children) : undefined;

  let tone: Tone | undefined;
  let svg: React.ReactNode;
  let description: React.ReactNode = null;

  if (segmentsProp) {
    const gap = segmentGap;
    const {
      segments,
      total,
      rest: free,
      scale,
      text,
    } = resolveSegments(segmentsProp, maxProp, {
      ...DEFAULT_PROGRESS_SEGMENTS_LABELS,
      ...labels,
    });
    const unit = scale > 0 ? CIRCUMFERENCE / scale : 0;
    const arcs: Arc[] = [];
    let cursor = 0;
    for (const seg of segments) {
      if (seg.value > 0) arcs.push({ start: cursor, length: seg.value * unit, tone: seg.tone });
      cursor += seg.value * unit;
    }
    if (free > 0 && total > 0) arcs.push({ start: cursor, length: free * unit, rest: true });
    const a11y = label
      ? { "aria-label": label, "aria-describedby": descriptionId }
      : { "aria-label": text };
    if (label) description = <VisuallyHidden id={descriptionId}>{text}</VisuallyHidden>;

    svg = (
      // biome-ignore lint/a11y/useSemanticElements: a distribution is a group of parts, not a fieldset
      <svg
        viewBox="0 0 100 100"
        className={styles.svg}
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
    const max = maxProp !== undefined && maxProp > 0 ? maxProp : 100;
    const value = Math.min(max, Math.max(valueProp ?? 0, 0));
    tone = toneProp ?? "accent";
    svg = (
      <svg
        viewBox="0 0 100 100"
        className={styles.svg}
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
              strokeDashoffset: CIRCUMFERENCE * (1 - value / max),
              opacity: value === 0 ? 0 : undefined,
            }}
          />
        </g>
      </svg>
    );
  }

  return (
    <div className={cx(styles.root, className)} {...rest} {...toDataAttributes({ size, tone })}>
      {svg}
      {description}
      {showInner ? (
        <div className={styles.inner} aria-hidden={valueText !== undefined ? true : undefined}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
