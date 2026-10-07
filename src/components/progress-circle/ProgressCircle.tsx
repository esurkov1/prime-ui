import * as React from "react";
import { cx } from "@/internal/cx";
import { remToPx } from "@/internal/layoutPxFromPrimitives";
import type { ControlSize, Tone } from "@/internal/states";

import styles from "./ProgressCircle.module.css";

/**
 * Ring geometry per size. Diameters sit on the 4px grid (rem, so they scale with the root font size);
 * stroke widths are line weights in CSS px.
 */
const PROGRESS_CIRCLE_SIZES = {
  xs: { diameter: "1.5rem", strokeWidth: 3 },
  s: { diameter: "2rem", strokeWidth: 4 },
  m: { diameter: "3rem", strokeWidth: 4 },
  l: { diameter: "4rem", strokeWidth: 6 },
  xl: { diameter: "5rem", strokeWidth: 8 },
} as const satisfies Record<ControlSize, { diameter: string; strokeWidth: number }>;

/** Rings below `m` are too small for readable inner text: `children` are not rendered there. */
const SIZES_WITHOUT_INNER: ReadonlySet<ControlSize> = new Set(["xs", "s"]);

export type ProgressCircleRootProps = {
  value: number;
  max?: number;
  size?: ControlSize;
  /** Цвет дуги. По умолчанию `accent`. */
  tone?: Exclude<Tone, "neutral" | "info">;
  label?: string;
  /**
   * Центрированное содержимое (число, процент, иконка). На `xs` / `s` не рендерится — кольцо
   * слишком мало; строковое / числовое значение остаётся доступным через `aria-valuetext`.
   */
  children?: React.ReactNode;
  className?: string;
};

function clampProgress(value: number, max: number): number {
  return Math.min(max, Math.max(value, 0));
}

const ProgressCircleRoot = React.forwardRef<HTMLDivElement, ProgressCircleRootProps>(
  ({ value, max = 100, size = "m", tone = "accent", label, children, className }, ref) => {
    const safeMax = max > 0 ? max : 100;
    const safeValue = clampProgress(value, safeMax);
    const tier = PROGRESS_CIRCLE_SIZES[size];
    const sizeVal = remToPx(tier.diameter);
    const strokeWidth = tier.strokeWidth;
    const radius = (sizeVal - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - safeValue / safeMax);
    const center = sizeVal / 2;
    const innerSize = sizeVal - strokeWidth * 2;
    const showInner = children != null && children !== false && !SIZES_WITHOUT_INNER.has(size);
    const valueText =
      typeof children === "string" || typeof children === "number" ? String(children) : undefined;

    return (
      <div
        ref={ref}
        className={cx(styles.root, className)}
        data-size={size}
        data-tone={tone}
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
          aria-valuetext={valueText}
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
            opacity={safeValue === 0 ? 0 : undefined}
          />
        </svg>
        {showInner ? (
          <div className={styles.inner} aria-hidden={valueText !== undefined ? true : undefined}>
            {children}
          </div>
        ) : null}
      </div>
    );
  },
);

ProgressCircleRoot.displayName = "ProgressCircleRoot";

export const ProgressCircle = { Root: ProgressCircleRoot };
