import * as React from "react";
import { cx } from "@/internal/cx";
import { remToPx } from "@/internal/layoutPxFromPrimitives";
import { primitiveTokens } from "../../../tokens/primitives";

import styles from "./ProgressCircle.module.css";

const pc = primitiveTokens.progressCircle;

export type ProgressCircleSize = keyof typeof pc;

export type ProgressCircleRootProps = {
  value: number;
  max?: number;
  size?: ProgressCircleSize;
  label?: string;
  children?: React.ReactNode;
  className?: string;
};

function clampProgress(value: number, max: number): number {
  return Math.min(max, Math.max(value, 0));
}

const ProgressCircleRoot = React.forwardRef<HTMLDivElement, ProgressCircleRootProps>(
  ({ value, max = 100, size = "m", label, children, className }, ref) => {
    const safeMax = max > 0 ? max : 100;
    const safeValue = clampProgress(value, safeMax);
    const tier = pc[size];
    const sizeVal = remToPx(tier.diameter);
    const strokeWidth = Number.parseInt(tier.strokeWidth, 10);
    const radius = (sizeVal - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - safeValue / safeMax);
    const center = sizeVal / 2;
    const innerSize = sizeVal - strokeWidth * 2;

    return (
      <div
        ref={ref}
        className={cx(styles.root, className)}
        data-size={size}
        style={
          {
            "--progress-circle-inner-size": `${innerSize}px`,
          } as React.CSSProperties
        }
      >
        <svg
          width={sizeVal}
          height={sizeVal}
          viewBox={`0 0 ${sizeVal} ${sizeVal}`}
          role="progressbar"
          aria-valuenow={safeValue}
          aria-valuemin={0}
          aria-valuemax={safeMax}
          aria-label={label}
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            className={styles.track}
            fill="none"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            className={styles.fill}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${center} ${center})`}
          />
        </svg>
        {children ? <div className={styles.inner}>{children}</div> : null}
      </div>
    );
  },
);

ProgressCircleRoot.displayName = "ProgressCircleRoot";

export const ProgressCircle = { Root: ProgressCircleRoot };
