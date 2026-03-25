import * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ProgressBarSize } from "@/internal/states";

import styles from "./ProgressBar.module.css";

export type { ProgressBarSize };

export type ProgressBarRootProps = {
  value: number;
  max?: number;
  label?: string;
  size?: ProgressBarSize;
  className?: string;
};

function clampProgress(value: number, max: number): number {
  return Math.min(max, Math.max(value, 0));
}

const ProgressBarRoot = React.forwardRef<HTMLProgressElement, ProgressBarRootProps>(
  ({ value, max = 100, label, size = "m", className }, ref) => {
    const safeMax = max > 0 ? max : 100;
    const safeValue = clampProgress(value, safeMax);
    const labelId = React.useId();

    return (
      <div className={cx(styles.root, className)} {...toDataAttributes({ size })}>
        {label ? (
          <span className={styles.label} id={labelId}>
            {label}
          </span>
        ) : null}
        <progress
          ref={ref}
          value={safeValue}
          max={safeMax}
          aria-labelledby={label ? labelId : undefined}
          className={styles.track}
        />
      </div>
    );
  },
);

ProgressBarRoot.displayName = "ProgressBarRoot";

export const ProgressBar = { Root: ProgressBarRoot };
