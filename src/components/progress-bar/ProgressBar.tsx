import * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import {
  DEFAULT_PROGRESS_SEGMENTS_LABELS,
  type ProgressModeProps,
  type ProgressSegmentsLabels,
  resolveSegments,
  resolveValue,
} from "@/internal/progressSegments";
import type { ControlSize, Tone } from "@/internal/states";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./ProgressBar.module.css";

export type ProgressBarLabels = ProgressSegmentsLabels;

export type ProgressBarProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /**
   * Visible label above the bar and its accessible name. A `value` bar needs a name: `label`, or
   * `aria-label` when the text around it already says what is loading.
   */
  label?: string;
  /** Default `m`. */
  size?: ControlSize;
  /** Shows the rounded filled percentage at the end of the label row. */
  showValue?: boolean;
  ref?: React.Ref<HTMLDivElement>;
} & ProgressModeProps;

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
    const resolved = resolveValue(valueProp ?? 0, maxProp);
    const { value, max } = resolved;
    percent = resolved.percent;
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
          style={{ "--pb-ratio": resolved.ratio } as React.CSSProperties}
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
