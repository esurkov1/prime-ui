import * as React from "react";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useElementSize } from "@/hooks/useElementSize";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { readCssLengthPx } from "@/hooks/usePosition";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { fieldTierClass } from "@/internal/fieldClasses";
import { useLabels } from "@/internal/labels";
import { ProgressLegend, ProgressLegendSkeleton } from "@/internal/ProgressLegend";
import palette from "@/internal/palette.module.css";
import {
  allocateCells,
  filledCells,
  formatProgressValue,
  PROGRESS_SEGMENTS_LABELS,
  type ProgressModeProps,
  type ProgressScale,
  type ProgressSegment,
  type ProgressSegmentsLabels,
  type ProgressVariant,
  resolveRows,
  resolveSegments,
  resolveValue,
  segmentFill,
  stepCells,
} from "@/internal/progressSegments";
import { RegionSwap } from "@/internal/RegionSwap";
import type { ControlSize, Tone } from "@/internal/states";
import { TOKEN_DEFAULTS } from "@/internal/tokenDefaults";
import { Skeleton } from "../skeleton/Skeleton";
import styles from "./ProgressBar.module.css";

export type ProgressBarLabels = ProgressSegmentsLabels;

export type ProgressBarProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  label?: string;
  size?: ControlSize;
  showValue?: boolean;
  loading?: boolean;
  ref?: React.Ref<HTMLDivElement>;
} & ProgressBarModeProps;

type SegmentsModeProps = Extract<ProgressModeProps, { segments: unknown }>;

/**
 * Value mode draws its scale as a line, steps or ticks; segments draw one bar (a line or ticks)
 * or one line per row.
 */
type ProgressBarModeProps =
  | (Extract<ProgressModeProps, { value: number }> & {
      variant?: ProgressVariant;
      layout?: never;
      scale?: never;
      showShare?: never;
    })
  | (SegmentsModeProps & { scale?: never; showShare?: never } & (
        | { variant?: "line"; layout?: "bar" }
        | { variant: "ticks"; layout?: "bar"; segmentGap?: never }
      ))
  | (SegmentsModeProps & {
      variant?: "line";
      layout: "rows";
      scale?: ProgressScale;
      showShare?: boolean;
      segmentGap?: never;
      legend?: never;
    });

/** Ticks: a tick is ⅔ of the tier's track and the gap ½ of it (`.cells` in the CSS). */
const TICK_PITCH = 7 / 6;

/** Ticks drawn before the bar is measured (server render, a test without layout). */
const MIN_TICKS = 12;

/** Rows drawn while a ranking loads and its length is not known yet. */
const LOADING_ROWS = 3;

type CellFill = ReturnType<typeof segmentFill> | undefined;

type CellScaleProps = React.HTMLAttributes<HTMLSpanElement> & {
  count: number;
  filled: number;
  /** Fill of each filled cell (segments); none — the root's tone. */
  fills?: CellFill[];
};

/**
 * A scale of whole cells (`steps`, `ticks`) as one field: the cells are drawn twice — the rest
 * row, and the fill row inside `.reveal`, which slides like the line's fill while the fill row
 * slides back by as much. The cells stand still and one front moves, so a change caught mid-way
 * goes on from where the front is — no cell ever runs on its own clock. At rest the front stops
 * in the middle of a gap: a cell is always whole. A cell the front leaves keeps its last fill
 * while the front passes it.
 */
function CellScale({ count, filled, fills, className, style, ...rest }: CellScaleProps) {
  const kept = React.useRef<CellFill[]>([]);
  const shown = Array.from({ length: count }, (_, i) =>
    i < filled ? fills?.[i] : kept.current[i],
  );
  React.useEffect(() => {
    kept.current = shown;
  });
  const row = (paint: boolean) => (
    <span className={styles.cellRow}>
      {shown.map((fill, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: cells of a fixed scale
          key={i}
          className={cx(paint && fill?.color && palette.hue, styles.cell)}
          {...(paint && fill ? toDataAttributes(fill) : {})}
        />
      ))}
    </span>
  );
  return (
    <span
      {...rest}
      className={cx(styles.cells, className)}
      style={{ ...style, "--pb-cells": count, "--pb-filled": filled } as React.CSSProperties}
    >
      {row(false)}
      <span className={styles.reveal}>{row(true)}</span>
    </span>
  );
}

/** Loading: Skeleton cells in the scale's own geometry. */
function CellSkeleton({ count }: { count: number }) {
  return (
    <span className={cx(styles.cells, styles.cellRow)}>
      {Array.from({ length: count }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: identical placeholder cells
        <Skeleton key={i} shape="block" className={styles.cellSkeleton} />
      ))}
    </span>
  );
}

/**
 * A linear progress line: a single `value` (native `<progress>` for assistive tech), `segments` —
 * parts of a whole in one bar (`role="group"` named by the distribution) with an optional legend,
 * or `layout="rows"` — a ranking, one labelled bar per part (`<ol>`). `variant` draws the scale as
 * a line, as `max` steps or as ticks as many as the width holds.
 */
export function ProgressBar(props: ProgressBarProps) {
  const {
    label,
    size: sizeProp,
    showValue = false,
    loading = false,
    className,
    value: valueProp,
    max: maxProp,
    tone: toneProp,
    segments: segmentsProp,
    segmentGap = "none",
    variant = "line",
    legend = false,
    formatValue = formatProgressValue,
    layout = "bar",
    scale = "sum",
    showShare = true,
    labels,
    ref,
    "aria-label": ariaLabel,
    ...rest
  } = props;
  const labelId = React.useId();
  const descriptionId = React.useId();
  const { size, provide } = useHostTier(sizeProp);
  const segmentLabels = useLabels(PROGRESS_SEGMENTS_LABELS, labels);

  // Ticks: as many as the width holds at the tier's pitch; their count follows the width.
  const rootRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(rootRef, ref);
  const ticks = variant === "ticks" && layout === "bar";
  const width = useElementSize(rootRef, { enabled: ticks })?.width ?? 0;
  const trackPx = readCssLengthPx(
    "--field-track",
    TOKEN_DEFAULTS[`--prime-control-${size}-track`],
    rootRef.current,
  );
  const tickGap = trackPx / 2;
  const tickCount = Math.max(MIN_TICKS, Math.floor((width + tickGap) / (trackPx * TICK_PITCH)));

  // A name from `label` / `aria-label`, for the group, the list and the native progress.
  const named = Boolean(label || ariaLabel);
  const nameProps = {
    "aria-labelledby": label ? labelId : undefined,
    "aria-label": label ? undefined : ariaLabel,
  };
  const barSkeleton = <Skeleton shape="block" className={styles.barSkeleton} />;

  const rowBody = (segment: ProgressSegment, share: number, ratio: number) => (
    <>
      <div className={styles.rowHeader}>
        <span className={styles.rowLabel}>{segment.label}</span>
        <span className={styles.rowValue}>{formatValue(segment.value)}</span>
        {showShare ? <span className={styles.rowShare}>{share}%</span> : null}
      </div>
      <span className={styles.bar} aria-hidden="true">
        <span
          className={cx(palette.hue, styles.fill)}
          style={{ "--pb-ratio": ratio } as React.CSSProperties}
          {...toDataAttributes(segmentFill(segment))}
        />
      </span>
    </>
  );

  let percent: number | null = null;
  let tone: Tone | undefined;
  let body: React.ReactNode;

  if (segmentsProp && layout === "rows") {
    const rows = resolveRows(segmentsProp, scale, maxProp);
    body = loading ? (
      <div className={styles.rows}>
        {Array.from({ length: segmentsProp.length || LOADING_ROWS }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: identical placeholder rows
          <div key={i} className={styles.row}>
            <ProgressLegendSkeleton rows={1} size={size} className={styles.rowSkeletonText} />
            {barSkeleton}
          </div>
        ))}
      </div>
    ) : (
      <ol
        // biome-ignore lint/a11y/noRedundantRoles: `list-style: none` drops the list semantics in WebKit; the role keeps them
        role="list"
        className={styles.rows}
        {...nameProps}
      >
        {rows.map(({ segment, ratio, percent: share }, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: rows in source order
          <li key={i} className={segment.href ? styles.rowItem : styles.row}>
            {segment.href ? (
              <a
                className={cx(styles.row, styles.rowLink)}
                href={segment.href}
                onClick={segment.onClick}
              >
                {rowBody(segment, share, ratio)}
              </a>
            ) : (
              rowBody(segment, share, ratio)
            )}
          </li>
        ))}
      </ol>
    );
  } else if (segmentsProp) {
    const resolved = resolveSegments(segmentsProp, maxProp, segmentLabels);
    const { segments, total, rest: free, text } = resolved;
    percent = resolved.percent;
    // Named: the legend (or the hidden distribution text) describes the group.
    const a11y = named
      ? { ...nameProps, "aria-describedby": descriptionId }
      : { "aria-label": text };
    const showLegend = legend && segments.length > 0;

    let bar: React.ReactNode;
    if (ticks) {
      // Each part takes whole ticks by its share; the free rest stays track.
      const counts = allocateCells([...segments.map((seg) => seg.value), free], tickCount);
      const fills = segments.flatMap((seg, i) =>
        Array.from({ length: counts[i] }, () => segmentFill(seg)),
      );
      bar = (
        <CellScale role="group" {...a11y} count={tickCount} filled={fills.length} fills={fills} />
      );
    } else {
      bar = (
        // biome-ignore lint/a11y/useSemanticElements: a distribution is a group of parts, not a fieldset
        <div
          className={styles.bar}
          role="group"
          {...a11y}
          {...toDataAttributes({ "segment-gap": segmentGap })}
        >
          {total > 0 ? (
            <span className={styles.segments} style={{ flexGrow: total }}>
              {segments.map((seg, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: presentational parts in source order
                  key={i}
                  className={cx(palette.hue, styles.segment)}
                  style={{ flexGrow: seg.value }}
                  title={seg.label}
                  {...toDataAttributes(segmentFill(seg))}
                />
              ))}
            </span>
          ) : null}
          {free > 0 || total === 0 ? (
            <span className={styles.rest} style={{ flexGrow: free > 0 ? free : 1 }} />
          ) : null}
        </div>
      );
    }

    body = loading ? (
      <div className={styles.stack}>
        {ticks ? <CellSkeleton count={tickCount} /> : barSkeleton}
        {legend ? (
          <ProgressLegendSkeleton rows={segmentsProp.length || LOADING_ROWS} size={size} />
        ) : null}
      </div>
    ) : (
      <div className={styles.stack}>
        {named && !showLegend ? <VisuallyHidden id={descriptionId}>{text}</VisuallyHidden> : null}
        {bar}
        {showLegend ? (
          <ProgressLegend
            id={named ? descriptionId : undefined}
            segments={segments}
            scale={resolved.scale}
            formatValue={formatValue}
            size={size}
          />
        ) : null}
      </div>
    );
  } else {
    const resolved = resolveValue(valueProp ?? 0, maxProp);
    const { value, max } = resolved;
    percent = resolved.percent;
    tone = toneProp ?? "accent";
    const cellCount = variant === "steps" ? stepCells(max) : tickCount;

    body = loading ? (
      variant === "line" ? (
        barSkeleton
      ) : (
        <CellSkeleton count={cellCount} />
      )
    ) : (
      <>
        <progress value={value} max={max} {...nameProps} className={styles.native} />
        {/* Visual bar: the native element is transparent; one pill slides over the track, or
            one front fills whole cells. */}
        {variant === "line" ? (
          <span
            className={styles.bar}
            aria-hidden="true"
            style={{ "--pb-ratio": resolved.ratio } as React.CSSProperties}
          >
            <span className={styles.fill} />
          </span>
        ) : (
          <CellScale
            aria-hidden="true"
            count={cellCount}
            filled={filledCells(resolved.ratio, cellCount)}
          />
        )}
      </>
    );
  }

  const valueShown = showValue && layout === "bar" && !loading && percent !== null;

  return provide(
    <div
      ref={mergedRef}
      className={cx(fieldTierClass, styles.root, className)}
      aria-busy={loading || undefined}
      {...rest}
      {...toDataAttributes({
        size,
        tone,
        variant: layout === "rows" ? undefined : variant,
        layout: layout === "rows" ? "rows" : undefined,
      })}
    >
      {label || valueShown ? (
        <div className={styles.header}>
          {label ? (
            <span className={styles.label} id={labelId}>
              {label}
            </span>
          ) : null}
          {valueShown ? (
            <span className={styles.value} aria-hidden="true">
              {percent}%
            </span>
          ) : null}
        </div>
      ) : null}
      <RegionSwap state={loading ? "loading" : "data"}>{body}</RegionSwap>
    </div>,
  );
}
