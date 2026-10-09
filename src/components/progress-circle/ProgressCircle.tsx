import * as React from "react";

import { useStateSwap } from "@/hooks/useStateSwap";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { GlyphSwap } from "@/internal/glyphSwap";
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
import { RING_DATA_STROKE, RING_PATH, Ring, RingCap, RingCircle } from "@/internal/ring";
import type { ControlSize, Tone } from "@/internal/states";
import swap from "@/internal/swapMotion.module.css";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import { Skeleton } from "../skeleton/Skeleton";
import styles from "./ProgressCircle.module.css";

/** Visible gap between `hairline` parts: ¾ of the stroke, like ProgressBar. */
const HAIRLINE_GAP = RING_DATA_STROKE * 0.75;

/** Legend rows drawn while a distribution loads and its length is not known yet. */
const LOADING_ROWS = 3;

export type ProgressCircleLabels = ProgressSegmentsLabels;

type ValueModeProps = {
  /**
   * Current value, clamped to `0…max`; `null` — under way, the share unknown: a quarter arc that
   * always turns, no `aria-valuenow`.
   */
  value: number | null;
  /** Top of the scale. Default `100`. */
  max?: number;
  /**
   * Fill color. Default `accent`. `inherit` — the arc in the host's text color over a 32% track of
   * it, for a ring on a colored host or over media.
   */
  tone?: Tone | "inherit";
  /** The ring turns at any share (a sync whose share grows). Default `false`; `null` always turns. */
  spin?: boolean;
  segments?: never;
  segmentGap?: never;
  labels?: never;
  legend?: never;
  formatValue?: never;
};

type SegmentsModeProps = Extract<ProgressModeProps, { segments: ProgressSegment[] }> & {
  spin?: never;
};

export type ProgressCircleProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Default `m`. */
  size?: ControlSize;
  /**
   * Centered content: a number, a percent or an `<Icon>`. A changed icon (another `name`) cross-
   * fades into the new one. Not rendered on `xs`; text only from `m`. A string or number child
   * stays available as `aria-valuetext`.
   */
  children?: React.ReactNode;
  /**
   * The data is on its way: a Skeleton ring of the same size (and legend rows), which cross-fades
   * into the data. The root is `aria-busy`.
   */
  loading?: boolean;
  ref?: React.Ref<HTMLDivElement>;
} & (ValueModeProps | SegmentsModeProps);

type Fill = ReturnType<typeof segmentFill>;
type Arc = { start: number; length: number; fill?: Fill; rest?: boolean };

/** One arc of `length` from `start` (`RING_PATH` units along the circle, clockwise from the top). */
function arcStyle(start: number, length: number): React.CSSProperties {
  return {
    strokeDasharray: `${Math.max(length, 0)} ${RING_PATH}`,
    strokeDashoffset: -start,
  };
}

/** `data-tone` / `data-color` and the palette class of a part. */
function fillProps(fill: Fill | undefined) {
  return {
    className: fill?.color ? palette.hue : undefined,
    ...toDataAttributes(fill ?? { tone: "accent" }),
  };
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
    const inset = (RING_DATA_STROKE + HAIRLINE_GAP) / 2;
    return (
      <>
        {arcs.map((a, i) => {
          const own = a.rest ? { className: undefined } : fillProps(a.fill);
          return (
            <RingCircle
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
          <RingCircle
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

function Cap({ position, fill }: { position: number; fill?: Fill }) {
  const own = fillProps(fill);
  return <RingCap position={position} {...own} className={cx(own.className, styles.cap)} />;
}

/**
 * A progress ring drawn from the kit ring (`internal/ring`, `data` weight): a single `value`
 * (`role="progressbar"`; `null` — under way, share unknown) or `segments` — parts of a whole
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
    spin = false,
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
  const isText = typeof children === "string" || typeof children === "number";
  const showInner =
    !loading &&
    children != null &&
    children !== false &&
    size !== "xs" &&
    (size !== "s" || !isText);
  const valueText = isText ? String(children) : undefined;

  let tone: Tone | "inherit" | undefined;
  let ring: React.ReactNode;
  let description: React.ReactNode = null;
  let legendNode: React.ReactNode = null;

  if (segmentsProp) {
    const gap = segmentGap;
    const resolved = resolveSegments(segmentsProp, maxProp, {
      ...DEFAULT_PROGRESS_SEGMENTS_LABELS,
      ...labels,
    });
    const { segments, total, rest: free, scale, text } = resolved;
    const unit = scale > 0 ? RING_PATH / scale : 0;
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

    ring = (
      <Ring
        key="data"
        value={0}
        weight="data"
        track={gap === "none" || total === 0}
        className={cx(styles.svg, swapClass)}
        role="group"
        {...a11y}
        {...toDataAttributes({ "segment-gap": gap })}
      >
        {total > 0 ? <SegmentArcs arcs={arcs} gap={gap} closed={free === 0} /> : null}
      </Ring>
    );
  } else {
    const unknown = valueProp === null || valueProp === undefined;
    const { value, max, ratio } = resolveValue(valueProp ?? 0, maxProp);
    tone = toneProp ?? "accent";
    ring = (
      <Ring
        key="data"
        value={unknown ? null : ratio}
        spin={spin}
        weight="data"
        className={cx(styles.svg, swapClass)}
        role="progressbar"
        aria-valuenow={unknown ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        aria-valuetext={valueText}
      />
    );
  }

  const body = (
    <>
      {loading ? (
        <Skeleton key="loading" shape="block" className={cx(styles.ringSkeleton, swapClass)} />
      ) : (
        ring
      )}
      {loading ? null : description}
      {showInner ? (
        <div className={styles.inner} aria-hidden={valueText !== undefined ? true : undefined}>
          <GlyphSwap>{children}</GlyphSwap>
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
        <div className={styles.ring}>{body}</div>
        {legendNode}
      </div>
    );
  }
  return (
    <div className={cx(styles.root, className)} {...rootProps}>
      {body}
    </div>
  );
}
