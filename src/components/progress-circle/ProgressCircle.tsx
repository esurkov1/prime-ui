import * as React from "react";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { GlyphSwap } from "@/internal/glyphSwap";
import { useLabels } from "@/internal/labels";
import { useMediaSlotSize } from "@/internal/mediaSlot";
import { ProgressLegend, ProgressLegendSkeleton } from "@/internal/ProgressLegend";
import palette from "@/internal/palette.module.css";
import {
  formatProgressValue,
  PROGRESS_SEGMENTS_LABELS,
  type ProgressModeProps,
  type ProgressSegment,
  type ProgressSegmentsLabels,
  resolveSegments,
  resolveValue,
  segmentFill,
} from "@/internal/progressSegments";
import { RegionSwap } from "@/internal/RegionSwap";
import { RING_DATA_STROKE, RING_PATH, Ring, RingCap, RingCircle } from "@/internal/ring";
import type { ControlSize, PaletteColor, Tone } from "@/internal/states";

import { Skeleton } from "../skeleton/Skeleton";
import styles from "./ProgressCircle.module.css";

/** Visible gap between `hairline` parts: ¾ of the stroke, like ProgressBar. */
const HAIRLINE_GAP = RING_DATA_STROKE * 0.75;

/** Legend rows drawn while a distribution loads and its length is not known yet. */
const LOADING_ROWS = 3;

export type ProgressCircleLabels = ProgressSegmentsLabels;

type ValueModeProps = {
  value: number | null;
  max?: number;
  spin?: boolean;
  track?: "surface" | "tinted";
  segments?: never;
  segmentGap?: never;
  labels?: never;
  legend?: never;
  formatValue?: never;
} & ({ tone?: Tone | "inherit"; color?: never } | { color: PaletteColor; tone?: never });

type SegmentsModeProps = Extract<ProgressModeProps, { segments: ProgressSegment[] }> & {
  spin?: never;
  track?: never;
  color?: never;
};

export type ProgressCircleProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  size?: ControlSize;
  children?: React.ReactNode;
  loading?: boolean;
  ref?: React.Ref<HTMLDivElement>;
} & (ValueModeProps | SegmentsModeProps);

type Fill = ReturnType<typeof segmentFill>;
type Arc = { start: number; length: number; fill?: Fill; rest?: boolean };

/**
 * One arc of `length` from `start` (`RING_PATH` units along the circle, clockwise from the top):
 * the circle turns to its start (`rotate`) and its dash shows `length` (`stroke-dashoffset` over a
 * full-length dash), so a change of weights glides on the two compositor- and paint-only
 * properties, as the ring's own arc and caps do.
 */
function arcStyle(start: number, length: number): React.CSSProperties {
  return {
    rotate: `${(start / RING_PATH) * 360}deg`,
    strokeDashoffset: RING_PATH - Math.max(length, 0),
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
    size: sizeProp,
    children,
    className,
    loading = false,
    "aria-label": label,
    value: valueProp,
    max: maxProp,
    tone: toneProp,
    color,
    track: trackProp,
    spin = false,
    segments: segmentsProp,
    segmentGap = "none",
    legend = false,
    formatValue = formatProgressValue,
    labels,
    ...rest
  } = props;
  const descriptionId = React.useId();
  // In a mark slot (`Card.Icon`) the ring stands for the record's state: the tile gives way and
  // the ring takes its 40 box.
  const { size, provide } = useHostTier(useMediaSlotSize("ring") ?? sizeProp);
  const segmentLabels = useLabels(PROGRESS_SEGMENTS_LABELS, labels);
  const isText = typeof children === "string" || typeof children === "number";
  const showInner = !loading && children != null && children !== false && size !== "xs";
  const valueText = isText ? String(children) : undefined;

  let tone: Tone | "inherit" | undefined;
  let ring: React.ReactNode;
  let description: React.ReactNode = null;
  let legendNode: React.ReactNode = null;

  if (segmentsProp) {
    const gap = segmentGap;
    const resolved = resolveSegments(segmentsProp, maxProp, segmentLabels);
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
    // The centre text (a total, a share) is hidden from the ring itself, so it joins the name.
    const a11y = label
      ? {
          "aria-label": valueText ? `${label}, ${valueText}` : label,
          "aria-describedby": descriptionId,
        }
      : { "aria-label": text };
    if (label && !showLegend) {
      description = <VisuallyHidden id={descriptionId}>{text}</VisuallyHidden>;
    }
    if (legend) {
      legendNode = loading ? (
        <ProgressLegendSkeleton rows={segmentsProp.length || LOADING_ROWS} size={size} />
      ) : showLegend ? (
        <ProgressLegend
          id={label ? descriptionId : undefined}
          segments={segments}
          scale={scale}
          formatValue={formatValue}
          size={size}
        />
      ) : null;
    }

    ring = (
      <Ring
        value={0}
        weight="data"
        track={gap === "none" || total === 0 ? "surface" : "none"}
        className={styles.svg}
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
    tone = color ? undefined : (toneProp ?? "accent");
    ring = (
      <Ring
        value={unknown ? null : ratio}
        spin={spin}
        weight="data"
        // `inherit` keeps the ring's own track, a tint of the host's color; `tinted` is the same
        // line track with the ring's color set to the fill.
        track={tone === "inherit" || trackProp === "tinted" ? "line" : "surface"}
        className={styles.svg}
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
      <RegionSwap state={loading ? "loading" : "data"} fill>
        {loading ? <Skeleton shape="block" className={styles.ringSkeleton} /> : ring}
      </RegionSwap>
      {loading ? null : description}
      {showInner ? (
        <div
          // The text of the hole is primary ink; `inherit` takes the host's color, like its ring.
          className={cx(styles.inner, tone !== "inherit" && styles.ink)}
          aria-hidden={valueText !== undefined ? true : undefined}
        >
          <GlyphSwap>{children}</GlyphSwap>
        </div>
      ) : null}
    </>
  );
  const rootProps = {
    ...rest,
    className: cx(styles.root, color && !segmentsProp && palette.hue, className),
    "aria-busy": loading || undefined,
    ...toDataAttributes({
      size,
      tone,
      color: segmentsProp ? undefined : color,
      track: segmentsProp || tone === "inherit" ? undefined : trackProp,
      legend: legend || undefined,
    }),
  };

  // With a legend the root is a row: the ring and the legend beside it (below when narrow).
  if (legend) {
    return provide(
      <div {...rootProps}>
        <div className={styles.ring}>{body}</div>
        <RegionSwap state={loading ? "loading" : "data"} className={styles.legend}>
          {legendNode}
        </RegionSwap>
      </div>,
    );
  }
  return provide(<div {...rootProps}>{body}</div>);
}
