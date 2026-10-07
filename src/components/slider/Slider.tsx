import * as React from "react";

import { Label } from "@/components/label/Label";
import { useControllableState } from "@/hooks/useControllableState";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize, Tone } from "@/internal/states";

import styles from "./Slider.module.css";

export type SliderProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "defaultChecked" | "onChange"
> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** Visible label linked to the range input. Without it, set `aria-label`. */
  label?: React.ReactNode;
  /** Shows the current value at the end of the label row (tabular numbers). */
  showValue?: boolean;
  /** Formats the displayed value and `aria-valuetext` (e.g. `(v) => \`${v} °C\``). */
  formatValue?: (value: number) => string;
  size?: ControlSize;
  /** Color of the filled part of the track. */
  tone?: Tone;
  /** Name of the range input when there is no `label`. */
  "aria-label"?: string;
  /** The outer `<div>`. */
  ref?: React.Ref<HTMLDivElement>;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** A single value on a range: label row with the value, a track with a glass thumb. */
export function Slider({
  value: valueProp,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  label,
  showValue = false,
  formatValue,
  size = "m",
  tone = "accent",
  className,
  style,
  "aria-label": ariaLabel,
  ...rest
}: SliderProps) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: clamp(defaultValue ?? min, min, max),
    onChange: onValueChange,
  });

  const inputId = React.useId();
  const safeValue = clamp(value, min, max);
  const ratio = max > min ? (safeValue - min) / (max - min) : 0;
  const valueText = formatValue ? formatValue(safeValue) : String(safeValue);

  return (
    <div
      {...rest}
      className={cx(styles.root, className)}
      // The fill and the thumb position follow the value; a custom property carries it to CSS.
      style={{ ...style, "--slider-ratio": ratio } as React.CSSProperties}
      {...toDataAttributes({ size, tone, disabled: disabled || undefined })}
    >
      <ControlSizeProvider value={size}>
        {label != null || showValue ? (
          <div className={styles.header}>
            {label != null ? (
              <Label.Root htmlFor={inputId} size={size} disabled={disabled}>
                {label}
              </Label.Root>
            ) : null}
            {showValue ? (
              <output className={styles.value} htmlFor={inputId} aria-hidden="true">
                {valueText}
              </output>
            ) : null}
          </div>
        ) : null}
        <div className={styles.control}>
          <input
            id={inputId}
            type="range"
            className={styles.input}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            value={safeValue}
            onChange={(event) => {
              const next = Number.parseFloat(event.currentTarget.value);
              if (!Number.isNaN(next)) setValue(next);
            }}
            aria-label={ariaLabel}
            aria-valuetext={formatValue ? valueText : undefined}
          />
          {/* Visual layer: the transparent native input above handles pointer, keys and a11y. */}
          <span className={styles.track} aria-hidden="true">
            <span className={styles.range} />
          </span>
          <span className={styles.thumb} aria-hidden="true" />
        </div>
      </ControlSizeProvider>
    </div>
  );
}
