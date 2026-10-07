import * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize, Tone } from "@/internal/states";

import styles from "./ProgressBar.module.css";

export type ProgressBarRootProps = {
  value: number;
  max?: number;
  label?: string;
  size?: ControlSize;
  /** Цвет заполнения. По умолчанию `accent`. */
  tone?: Exclude<Tone, "neutral" | "info">;
  /** Показать значение в процентах справа от подписи. */
  showValue?: boolean;
  className?: string;
};

function clampProgress(value: number, max: number): number {
  return Math.min(max, Math.max(value, 0));
}

const ProgressBarRoot = React.forwardRef<HTMLProgressElement, ProgressBarRootProps>(
  ({ value, max = 100, label, size = "m", tone = "accent", showValue = false, className }, ref) => {
    const safeMax = max > 0 ? max : 100;
    const safeValue = clampProgress(value, safeMax);
    const labelId = React.useId();
    const percent = Math.round((safeValue / safeMax) * 100);

    return (
      <div className={cx(styles.root, className)} {...toDataAttributes({ size, tone })}>
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
        <progress
          ref={ref}
          value={safeValue}
          max={safeMax}
          aria-labelledby={label ? labelId : undefined}
          className={styles.track}
        />
        {/* The native value bar is hidden; this fill moves by transform in every engine. */}
        <span className={styles.fillClip} aria-hidden="true">
          <span
            className={styles.fill}
            style={{ "--pb-ratio": safeValue / safeMax } as React.CSSProperties}
          />
        </span>
      </div>
    );
  },
);

ProgressBarRoot.displayName = "ProgressBarRoot";

export const ProgressBar = { Root: ProgressBarRoot };
