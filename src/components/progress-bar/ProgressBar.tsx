import * as React from "react";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { fieldTierClass } from "@/internal/fieldClasses";
import { useLabels } from "@/internal/labels";
import { ProgressLegend, ProgressLegendSkeleton } from "@/internal/ProgressLegend";
import palette from "@/internal/palette.module.css";
import {
  formatProgressValue,
  PROGRESS_SEGMENTS_LABELS,
  type ProgressModeProps,
  type ProgressScale,
  type ProgressSegmentsLabels,
  resolveRows,
  resolveSegments,
  resolveValue,
  segmentFill,
} from "@/internal/progressSegments";
import { RegionSwap } from "@/internal/RegionSwap";
import type { ControlSize, Tone } from "@/internal/states";
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

/** Value mode may draw its scale as steps; segments draw one bar or one bar per row. */
type ProgressBarModeProps =
  | (Extract<ProgressModeProps, { value: number }> & {
      steps?: boolean;
      layout?: never;
      scale?: never;
    })
  | (SegmentsModeProps & { steps?: never } & (
        | {
            layout?: "bar";
            scale?: never;
          }
        | {
            layout: "rows";
            scale?: ProgressScale;
            segmentGap?: never;
            legend?: never;
          }
      ));

/** Cells of a stepped bar: `max` rounded into 2…12. */
const MIN_STEPS = 2;
const MAX_STEPS = 12;

/** Rows drawn while a ranking loads and its length is not known yet. */
const LOADING_ROWS = 3;

/**
 * Order of each cell in the current change: cells fill from the start and empty from the end,
 * one stagger step apart, so a level reads as a walk, not a flash.
 */
function useStepOrder(filled: number, count: number): number[] {
  const prev = React.useRef(filled);
  const from = prev.current;
  React.useEffect(() => {
    prev.current = filled;
  }, [filled]);
  return Array.from({ length: count }, (_, i) =>
    filled >= from ? Math.max(0, i - from) : Math.max(0, from - 1 - i),
  );
}

/**
 * A linear progress line: a single `value` (native `<progress>` for assistive tech), `segments` —
 * parts of a whole in one bar (`role="group"` named by the distribution) with an optional legend,
 * or `layout="rows"` — a ranking, one labelled bar per part (`<ol>`).
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
    steps = false,
    legend = false,
    formatValue = formatProgressValue,
    layout = "bar",
    scale = "sum",
    labels,
    "aria-label": ariaLabel,
    ...rest
  } = props;
  const labelId = React.useId();
  const descriptionId = React.useId();
  const { size, provide } = useHostTier(sizeProp);
  const segmentLabels = useLabels(PROGRESS_SEGMENTS_LABELS, labels);

  const stepResolved = !segmentsProp && steps ? resolveValue(valueProp ?? 0, maxProp) : null;
  const stepCount = stepResolved
    ? Math.min(MAX_STEPS, Math.max(MIN_STEPS, Math.round(stepResolved.max)))
    : 0;
  const stepFilled = stepResolved
    ? Math.round((stepResolved.value / stepResolved.max) * stepCount)
    : 0;
  const stepOrder = useStepOrder(stepFilled, stepCount);

  // A name from `label` / `aria-label`, for the group, the list and the native progress.
  const named = Boolean(label || ariaLabel);
  const nameProps = {
    "aria-labelledby": label ? labelId : undefined,
    "aria-label": label ? undefined : ariaLabel,
  };
  const barSkeleton = <Skeleton shape="block" className={styles.barSkeleton} />;

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
          <li key={i} className={styles.row}>
            <div className={styles.rowHeader}>
              <span className={styles.rowLabel}>{segment.label}</span>
              <span className={styles.rowValue}>{formatValue(segment.value)}</span>
              <span className={styles.rowShare}>{share}%</span>
            </div>
            <span className={styles.bar} aria-hidden="true">
              <span
                className={cx(palette.hue, styles.fill)}
                style={{ "--pb-ratio": ratio } as React.CSSProperties}
                {...toDataAttributes(segmentFill(segment))}
              />
            </span>
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

    body = loading ? (
      <div className={styles.stack}>
        {barSkeleton}
        {legend ? (
          <ProgressLegendSkeleton rows={segmentsProp.length || LOADING_ROWS} size={size} />
        ) : null}
      </div>
    ) : (
      <div className={styles.stack}>
        {named && !showLegend ? <VisuallyHidden id={descriptionId}>{text}</VisuallyHidden> : null}
        {/* biome-ignore lint/a11y/useSemanticElements: a distribution is a group of parts, not a fieldset */}
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

    body = loading ? (
      <Skeleton shape="block" className={styles.barSkeleton} />
    ) : (
      <>
        <progress value={value} max={max} {...nameProps} className={styles.native} />
        {/* Visual bar: the native element is transparent; one pill slides over the track, or
            whole cells fill one after another. */}
        {steps ? (
          <span className={styles.bar} aria-hidden="true" data-steps="true">
            {stepOrder.map((order, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: cells of a fixed scale
                key={i}
                className={styles.step}
                data-filled={i < stepFilled || undefined}
                style={{ "--pb-step-order": order } as React.CSSProperties}
              />
            ))}
          </span>
        ) : (
          <span
            className={styles.bar}
            aria-hidden="true"
            style={{ "--pb-ratio": resolved.ratio } as React.CSSProperties}
          >
            <span className={styles.fill} />
          </span>
        )}
      </>
    );
  }

  const valueShown = showValue && layout === "bar" && !loading && percent !== null;

  return provide(
    <div
      className={cx(fieldTierClass, styles.root, className)}
      aria-busy={loading || undefined}
      {...rest}
      {...toDataAttributes({ size, tone, layout: layout === "rows" ? "rows" : undefined })}
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
