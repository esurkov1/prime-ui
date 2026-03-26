import * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ProgressBarSize } from "@/internal/states";

import styles from "./SegmentedProgressBar.module.css";

export type { ProgressBarSize };

export type SegmentedProgressSegmentTone = "primary" | "success" | "warning" | "danger" | "neutral";

export type SegmentedProgressSegment = {
  /** Non-negative weight; segments are sized proportionally to the sum of all weights. */
  value: number;
  label?: string;
  tone?: SegmentedProgressSegmentTone;
};

export type SegmentedProgressBarRootProps = {
  segments: SegmentedProgressSegment[];
  label?: string;
  size?: ProgressBarSize;
  /** Visual gap between segments; `hairline` draws a 1px separator using the track background. */
  segmentGap?: "none" | "hairline";
  className?: string;
};

function clampNonNegative(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function buildDistributionDescription(segments: SegmentedProgressSegment[], total: number): string {
  if (segments.length === 0) {
    return "No segments";
  }
  if (total <= 0) {
    return "All segments empty";
  }
  const parts = segments.map((s) => {
    const pct = Math.round((clampNonNegative(s.value) / total) * 100);
    return s.label ? `${s.label}: ${pct}%` : `${pct}%`;
  });
  return parts.join(", ");
}

const SegmentedProgressBarRoot = React.forwardRef<HTMLDivElement, SegmentedProgressBarRootProps>(
  ({ segments, label, size = "m", segmentGap = "hairline", className }, ref) => {
    const labelId = React.useId();
    const descriptionId = React.useId();
    const safe = React.useMemo(
      () => segments.map((s) => ({ ...s, value: clampNonNegative(s.value) })),
      [segments],
    );
    const total = React.useMemo(() => safe.reduce((acc, s) => acc + s.value, 0), [safe]);

    const distributionText = buildDistributionDescription(safe, total);

    const trackA11y = label
      ? { "aria-labelledby": labelId, "aria-describedby": descriptionId }
      : { "aria-label": distributionText };

    return (
      <div
        className={cx(styles.root, className)}
        {...toDataAttributes({ size, "segment-gap": segmentGap })}
      >
        {label ? (
          <span className={styles.label} id={labelId}>
            {label}
          </span>
        ) : null}
        {label ? (
          <span id={descriptionId} className={styles.visuallyHidden}>
            {distributionText}
          </span>
        ) : null}
        {/* biome-ignore lint/a11y/useSemanticElements: distribution track is not a form fieldset; role="group" matches WAI-ARIA grouping */}
        <div ref={ref} className={styles.track} role="group" {...trackA11y}>
          {total > 0
            ? safe.map((seg, i) => {
                /* flex-grow по весу — не зависит от разрешения % ширины при shrink-to-fit родителе (playground stack). */
                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: segments are presentational bars in source order; no reorder/dnd
                    key={i}
                    className={styles.segment}
                    style={{ flex: `${seg.value} 1 0%` }}
                    {...toDataAttributes({ tone: seg.tone ?? "primary" })}
                    title={seg.label}
                  />
                );
              })
            : null}
        </div>
      </div>
    );
  },
);

SegmentedProgressBarRoot.displayName = "SegmentedProgressBarRoot";

export const SegmentedProgressBar = { Root: SegmentedProgressBarRoot };
