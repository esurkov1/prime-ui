import * as React from "react";

import { Label } from "@/components/label/Label";
import { useControllableState } from "@/hooks/useControllableState";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";

import styles from "./Slider.module.css";

export type SliderRootProps = {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onValueChange?: (value: number) => void;
  /** Visible label linked to the range input. Without it, set `aria-label`. */
  label?: React.ReactNode;
  /** Shows the current value at the end of the label row (tabular numbers). */
  showValue?: boolean;
  /** Formats the displayed value and `aria-valuetext` (e.g. `(v) => \`${v} °C\``). */
  formatValue?: (value: number) => string;
  size?: ControlSize;
  className?: string;
  "aria-label"?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function SliderRoot({
  value: valueProp,
  defaultValue,
  min: minProp,
  max: maxProp,
  step: stepProp,
  disabled,
  onValueChange,
  label,
  showValue = false,
  formatValue,
  size = "m",
  className,
  "aria-label": ariaLabel,
}: SliderRootProps) {
  const min = minProp ?? 0;
  const max = maxProp ?? 100;
  const step = stepProp ?? 1;
  const initialDefault = defaultValue ?? min;
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: clamp(initialDefault, min, max),
    onChange: onValueChange,
  });

  const id = React.useId();
  const safeValue = clamp(value, min, max);
  const percent = max > min ? ((safeValue - min) / (max - min)) * 100 : 0;
  const valueText = formatValue ? formatValue(safeValue) : String(safeValue);

  const applyValueFromInput = (el: HTMLInputElement) => {
    const next = Number.parseFloat(el.value);
    if (Number.isNaN(next)) {
      return;
    }
    setValue(next);
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyValueFromInput(e.currentTarget);
  };

  const handleRangeInput = (e: React.FormEvent<HTMLInputElement>) => {
    applyValueFromInput(e.currentTarget);
  };

  const showHeader = label != null || showValue;

  return (
    <div
      className={cx(styles.root, className)}
      style={{ "--slider-percent": `${percent}%` } as React.CSSProperties}
      {...toDataAttributes({ size, disabled: disabled || undefined })}
    >
      <ControlSizeProvider value={size}>
        {showHeader ? (
          <div className={styles.header}>
            {label != null ? (
              <Label.Root htmlFor={id} size={size} disabled={disabled} className={styles.label}>
                {label}
              </Label.Root>
            ) : (
              <span />
            )}
            {showValue ? (
              <output className={styles.value} htmlFor={id} aria-hidden="true">
                {valueText}
              </output>
            ) : null}
          </div>
        ) : null}
        <input
          id={id}
          type="range"
          className={styles.track}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          value={safeValue}
          onChange={handleRangeChange}
          onInput={handleRangeInput}
          aria-label={ariaLabel}
          aria-valuetext={formatValue ? valueText : undefined}
        />
      </ControlSizeProvider>
    </div>
  );
}

SliderRoot.displayName = "Slider.Root";

export const Slider = { Root: SliderRoot };
