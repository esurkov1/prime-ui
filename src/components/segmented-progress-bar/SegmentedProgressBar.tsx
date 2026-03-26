import * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ProgressBarSize } from "@/internal/states";

import styles from "./SegmentedProgressBar.module.css";

export type { ProgressBarSize };

/** Семантические тона сегментов — цвета из `--prime-sys-color-status-*` и action. */
export type SegmentedProgressTone =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "pending"
  | "info";

export type SegmentedProgressSegment = {
  /** Вклад в сумму; пропорции считаются от суммы всех неотрицательных значений. */
  value: number;
  /** Подпись в легенде и в `aria-label` (если не задан свой `ariaLabel` на корне). */
  label?: string;
  tone?: SegmentedProgressTone;
  /** Стабильный ключ React при дублирующихся label/value/tone. */
  id?: string;
};

export type SegmentedProgressBarRootProps = {
  segments: SegmentedProgressSegment[];
  /** Подпись над полосой. */
  label?: string;
  size?: ProgressBarSize;
  /**
   * Имя для `role="img"` (сводка распределения) и вспомогательных технологий.
   * Если не задано, собирается из сегментов с подписями и округлённых процентов.
   */
  ariaLabel?: string;
  className?: string;
};

function nonNegative(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function sumValues(segments: SegmentedProgressSegment[]): number {
  return segments.reduce((acc, s) => acc + nonNegative(s.value), 0);
}

function buildDefaultAriaLabel(segments: SegmentedProgressSegment[], total: number): string {
  const parts: string[] = [];
  segments.forEach((seg, index) => {
    const v = nonNegative(seg.value);
    if (v <= 0) return;
    const pct = total > 0 ? Math.round((v / total) * 100) : 0;
    const name = seg.label?.trim() || `Segment ${index + 1}`;
    parts.push(`${name} ${pct}%`);
  });
  return parts.length > 0 ? parts.join(", ") : "Empty";
}

const SegmentedProgressBarRoot = React.forwardRef<HTMLDivElement, SegmentedProgressBarRootProps>(
  ({ segments, label, size = "m", ariaLabel, className }, ref) => {
    const total = sumValues(segments);
    const breakdown = total > 0 ? buildDefaultAriaLabel(segments, total) : "No data";
    const resolvedAria = ariaLabel ?? (label ? `${label}. ${breakdown}` : breakdown);

    return (
      <div ref={ref} className={cx(styles.root, className)} {...toDataAttributes({ size })}>
        {label ? <span className={styles.caption}>{label}</span> : null}
        <div className={styles.track} role="img" aria-label={resolvedAria}>
          {total <= 0 ? <div className={styles.empty} aria-hidden="true" /> : null}
          {total > 0
            ? segments.map((seg) => {
                const v = nonNegative(seg.value);
                if (v <= 0) return null;
                const tone: SegmentedProgressTone = seg.tone ?? "primary";
                const segmentKey = seg.id ?? `${seg.label ?? "segment"}-${v}-${tone}`;
                return (
                  <div
                    key={segmentKey}
                    className={styles.segment}
                    style={{ flexGrow: v }}
                    {...toDataAttributes({ tone })}
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
