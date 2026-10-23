/**
 * The legend of a distribution (ProgressBar, ProgressCircle `legend`): one row per part — the
 * part's color, its name, its value and its share. Text wears text tokens; only the swatch carries
 * the color, so identity is never color alone.
 */
import { Skeleton } from "@/components/skeleton/Skeleton";

import { cx } from "./cx";
import { toDataAttributes } from "./data-attributes";
import { fieldTierClass } from "./fieldClasses";
import listRowStyles from "./listRow.module.css";
import styles from "./ProgressLegend.module.css";
import palette from "./palette.module.css";
import { type ProgressSegment, segmentFill } from "./progressSegments";
import { type ControlSize, tierMappings } from "./states";

type ProgressLegendProps = {
  segments: ProgressSegment[];
  /** 100% of a share (the resolved scale of the distribution). */
  scale: number;
  formatValue: (value: number) => string;
  /** The row tier (`xs` on ProgressBar / ProgressCircle, `tierMappings.kpiLegend` in a Kpi). */
  size: ControlSize;
  id?: string;
  className?: string;
};

export function ProgressLegend({
  segments,
  scale,
  formatValue,
  size,
  id,
  className,
}: ProgressLegendProps) {
  if (segments.length === 0) return null;
  return (
    <ul
      id={id}
      className={cx(fieldTierClass, listRowStyles.tier, styles.legend, className)}
      data-size={size}
    >
      {segments.map((segment, index) => {
        const { tone, color } = segmentFill(segment);
        const share = scale > 0 ? Math.round((segment.value / scale) * 100) : 0;
        return (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: parts in source order, like the bar
            key={index}
            className={cx(listRowStyles.row, listRowStyles.hit, styles.item)}
            data-plain=""
          >
            <span className={listRowStyles.mark} data-kind="dot" aria-hidden="true">
              <span
                className={cx(palette.hue, styles.swatch)}
                {...toDataAttributes({ tone, color })}
              />
            </span>
            <span className={listRowStyles.title}>{segment.label}</span>
            <span className={listRowStyles.end}>
              <span className={listRowStyles.meta}>{formatValue(segment.value)}</span>
              <span className={cx(listRowStyles.meta, styles.share)}>{share}%</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** The legend while the distribution loads: one row-high line per expected row. */
export function ProgressLegendSkeleton({
  rows,
  size,
  className,
}: {
  rows: number;
  size: ControlSize;
  className?: string;
}) {
  const tier = tierMappings.legendSkeleton[size];
  return (
    <div className={cx(fieldTierClass, styles.skeleton, className)} data-size={size}>
      {Array.from({ length: Math.max(1, rows) }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: identical placeholder rows
        <div key={index} className={styles.skeletonRow}>
          <Skeleton shape="text" size={tier} className={styles.skeletonLine} />
        </div>
      ))}
    </div>
  );
}
