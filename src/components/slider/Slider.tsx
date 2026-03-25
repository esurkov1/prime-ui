import * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { toDataAttributes } from "@/internal/data-attributes";
import type { SliderSize } from "@/internal/states";

import { useControllableState } from "../../hooks/useControllableState";
import { cx } from "../../internal/cx";

import styles from "./Slider.module.css";

export type { SliderSize };

export type SliderRootProps = {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
  label?: string;
  size?: SliderSize;
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
  onChange,
  label,
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
    onChange,
  });

  const id = React.useId();
  const safeValue = clamp(value, min, max);

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

  return (
    <div className={cx(styles.root, className)} {...toDataAttributes({ size })}>
      <ControlSizeProvider value={size}>
        {label ? (
          <label className={styles.label} htmlFor={id}>
            {label}
          </label>
        ) : null}
        <input
          id={label ? id : undefined}
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
        />
      </ControlSizeProvider>
    </div>
  );
}

SliderRoot.displayName = "SliderRoot";

export const Slider = { Root: SliderRoot };
