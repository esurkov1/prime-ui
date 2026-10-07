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

import styles from "./ProgressBar.module.css";

export type ProgressBarLabels = ProgressSegmentsLabels;

type ProgressBarCommonProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Visible label above the bar and its accessible name. */
  label?: string;
  /** Default `m`. */
  size?: ControlSize;
  /** Shows the rounded filled percentage at the end of the label row. */
  showValue?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

type ProgressBarValueProps = ProgressBarCommonProps & {
  /** Current value; clamped to `0…max`. */
  value: number;
  /** Top of the scale. Default `100`. */
  max?: number;
  /** Fill color. Default `accent`. */
  tone?: Tone;
  segments?: never;
  segmentGap?: never;
  labels?: never;
};

type ProgressBarSegmentsProps = ProgressBarCommonProps & {
  /** Parts of the bar in order; each one's width is its share of `max`. */
  segments: ProgressSegment[];
  /** Total capacity. Default: the sum of the segments (they fill the whole bar). */
  max?: number;
  /** `hairline` draws every segment as its own pill with a gap. Default `none`. */
  segmentGap?: "none" | "hairline";
  /** Built-in accessible strings for empty distributions. */
  labels?: Partial<ProgressBarLabels>;
  value?: never;
  tone?: never;
};

export type ProgressBarProps = ProgressBarValueProps | ProgressBarSegmentsProps;

/**
 * A linear progress line: a single `value` (native `<progress>` for assistive tech) or
 * `segments` — parts of a whole in one bar (`role="group"` named by the distribution).
 */
export function ProgressBar(props: ProgressBarProps) {
  const {
    label,
    size = "m",
    showValue = false,
    className,
    value: valueProp,
    max: maxProp,
    tone: toneProp,
    segments: segmentsProp,
    segmentGap = "none",
    labels,
    "aria-label": ariaLabel,
    ...rest
  } = props;
  const labelId = React.useId();
  const descriptionId = React.useId();

  let percent: number;
  let tone: Tone | undefined;
  let bar: React.ReactNode;

  if (segmentsProp) {
    const resolved = resolveSegments(segmentsProp, maxProp, {
      ...DEFAULT_PROGRESS_SEGMENTS_LABELS,
      ...labels,
    });
    const { segments, total, rest: free, text } = resolved;
    percent = resolved.percent;
    // A name from `label` / `aria-label` keeps the distribution as the description.
    const named = Boolean(label || ariaLabel);
    const a11y = named
      ? {
          "aria-labelledby": label ? labelId : undefined,
          "aria-label": label ? undefined : ariaLabel,
          "aria-describedby": descriptionId,
        }
      : { "aria-label": text };

    bar = (
      <>
        {named ? <VisuallyHidden id={descriptionId}>{text}</VisuallyHidden> : null}
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
                  className={styles.segment}
                  style={{ flexGrow: seg.value }}
                  title={seg.label}
                  {...toDataAttributes({ tone: seg.tone ?? "accent" })}
                />
              ))}
            </span>
          ) : null}
          {free > 0 || total === 0 ? (
            <span className={styles.rest} style={{ flexGrow: free > 0 ? free : 1 }} />
          ) : null}
        </div>
      </>
    );
  } else {
    const max = maxProp !== undefined && maxProp > 0 ? maxProp : 100;
    const value = Math.min(max, Math.max(valueProp ?? 0, 0));
    percent = Math.round((value / max) * 100);
    tone = toneProp ?? "accent";

    bar = (
      <>
        <progress
          value={value}
          max={max}
          aria-labelledby={label ? labelId : undefined}
          aria-label={label ? undefined : ariaLabel}
          className={styles.native}
        />
        {/* Visual bar: the native element is transparent; one pill slides over the track. */}
        <span
          className={styles.bar}
          aria-hidden="true"
          style={{ "--pb-ratio": value / max } as React.CSSProperties}
        >
          <span className={styles.fill} />
        </span>
      </>
    );
  }

  return (
    <div className={cx(styles.root, className)} {...rest} {...toDataAttributes({ size, tone })}>
      {label || showValue ? (
        <div className={styles.header}>
          {label ? (
            <span className={styles.label} id={labelId}>
              {label}
            </span>
          ) : null}
          {showValue ? (
            <span className={styles.value} aria-hidden="true">
              {percent}%
            </span>
          ) : null}
        </div>
      ) : null}
      {bar}
    </div>
  );
}
