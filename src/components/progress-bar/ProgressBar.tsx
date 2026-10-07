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

import styles from "./ProgressBar.module.css";

export type ProgressBarLabels = ProgressSegmentsLabels;

type ProgressBarCommonProps = {
  /** Visible label above the bar and its accessible name. */
  label?: string;
  size?: ControlSize;
  /** Shows the rounded filled percentage at the end of the label row. */
  showValue?: boolean;
  className?: string;
};

type ProgressBarValueProps = ProgressBarCommonProps & {
  /** Current value; clamped to `0…max`. */
  value: number;
  /** Top of the scale. Default `100`. */
  max?: number;
  /** Fill color. */
  tone?: Tone;
  segments?: never;
  segmentGap?: never;
  labels?: never;
};

type ProgressSegmentsProps = ProgressBarCommonProps & {
  /** Parts of the bar in order; each one's width is its share of `max`. */
  segments: ProgressSegment[];
  /** Total capacity. Default: the sum of the segments (they fill the whole bar). */
  max?: number;
  /** `hairline` draws every segment as its own pill with a gap. */
  segmentGap?: "none" | "hairline";
  /** Built-in accessible strings for empty distributions. */
  labels?: Partial<ProgressBarLabels>;
  value?: never;
  tone?: never;
};

export type ProgressBarRootProps = ProgressBarValueProps | ProgressSegmentsProps;

const ProgressBarRoot = React.forwardRef<HTMLDivElement, ProgressBarRootProps>((props, ref) => {
  const { label, size = "m", showValue = false, className } = props;
  const labelId = React.useId();
  const descriptionId = React.useId();

  let percent: number;
  let tone: Tone | undefined;
  let bar: React.ReactNode;

  if (props.segments) {
    const { segments, total, rest, text, ...resolved } = resolveSegments(
      props.segments,
      props.max,
      {
        ...DEFAULT_PROGRESS_SEGMENTS_LABELS,
        ...props.labels,
      },
    );
    percent = resolved.percent;
    const a11y = label
      ? { "aria-labelledby": labelId, "aria-describedby": descriptionId }
      : { "aria-label": text };

    bar = (
      <>
        {label ? (
          <span id={descriptionId} className={styles.visuallyHidden}>
            {text}
          </span>
        ) : null}
        {/* biome-ignore lint/a11y/useSemanticElements: a distribution is a group of parts, not a fieldset */}
        <div
          className={styles.bar}
          role="group"
          {...a11y}
          {...toDataAttributes({ "segment-gap": props.segmentGap ?? "none" })}
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
          {rest > 0 || total === 0 ? (
            <span className={styles.rest} style={{ flexGrow: rest > 0 ? rest : 1 }} />
          ) : null}
        </div>
      </>
    );
  } else {
    const max = props.max !== undefined && props.max > 0 ? props.max : 100;
    const value = Math.min(max, Math.max(props.value, 0));
    percent = Math.round((value / max) * 100);
    tone = props.tone ?? "accent";

    bar = (
      <>
        <progress
          value={value}
          max={max}
          aria-labelledby={label ? labelId : undefined}
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
    <div ref={ref} className={cx(styles.root, className)} {...toDataAttributes({ size, tone })}>
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
});

ProgressBarRoot.displayName = "ProgressBar.Root";

export const ProgressBar = { Root: ProgressBarRoot };
