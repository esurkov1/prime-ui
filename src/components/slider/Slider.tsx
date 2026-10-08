import type * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { ControlSizeProvider, useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import {
  FieldFrame,
  type FieldFrameProps,
  type FieldRootDomProps,
  useFieldFrame,
} from "@/internal/FieldFrame";
import type { ControlSize, Tone } from "@/internal/states";

import styles from "./Slider.module.css";

export type SliderLabels = {
  /** Muted marker after the label when `optional`. */
  optional: string;
};

const SLIDER_LABELS: SliderLabels = { optional: "необязательно" };

export type SliderProps = FieldRootDomProps &
  Omit<FieldFrameProps, "focusRing"> & {
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    /** Invalid state: `aria-invalid` on the range input. A non-empty `error` implies it. */
    invalid?: boolean;
    /** Shows the current value at the end of the label row (tabular numbers). */
    showValue?: boolean;
    /** Formats the displayed value and `aria-valuetext` (e.g. `(v) => \`${v} °C\``). */
    formatValue?: (value: number) => string;
    /** Tier. Default: the tier of the surrounding control (a form, a panel), else `m`. */
    size?: ControlSize;
    /** Color of the filled part of the track. */
    tone?: Tone;
    /** Id of the range input; generated when omitted. */
    id?: string;
    /** Name of the range input when there is no `label`. */
    "aria-label"?: string;
    "aria-describedby"?: string;
    labels?: Partial<SliderLabels>;
  };

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * A single value on a range, framed like every field: label row (with the value), the track
 * with a glass thumb, then hint or error. `className`, `ref` and the rest go to the frame, `id`
 * and `aria-label` to the range input.
 */
export function Slider({
  value: valueProp,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  invalid,
  label,
  required,
  optional,
  hint,
  error,
  showValue = false,
  formatValue,
  size: sizeProp,
  tone = "accent",
  id,
  className,
  style,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  labels: labelsProp,
  ...rest
}: SliderProps) {
  const size = useControlSize(sizeProp);
  const ids = useFieldFrame(id, { label, hint, error, invalid }, ariaDescribedBy);
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: clamp(defaultValue ?? min, min, max),
    onChange: onValueChange,
  });

  const safeValue = clamp(value, min, max);
  const ratio = max > min ? (safeValue - min) / (max - min) : 0;
  const valueText = formatValue ? formatValue(safeValue) : String(safeValue);

  return (
    <FieldFrame
      {...rest}
      size={size}
      ids={ids}
      label={label}
      required={required}
      optional={optional}
      hint={hint}
      error={error}
      disabled={disabled}
      optionalLabel={labelsProp?.optional ?? SLIDER_LABELS.optional}
      labelEnd={
        showValue ? (
          <output className={styles.value} htmlFor={ids.controlId} aria-hidden="true">
            {valueText}
          </output>
        ) : undefined
      }
      className={cx(styles.root, className)}
      // The fill and the thumb position follow the value; a custom property carries it to CSS.
      style={{ ...style, "--slider-ratio": ratio } as React.CSSProperties}
      {...toDataAttributes({ tone })}
    >
      <ControlSizeProvider value={size}>
        <div className={styles.control}>
          <input
            id={ids.controlId}
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
            aria-describedby={ids.describedBy}
            aria-invalid={ids.invalid || undefined}
          />
          {/* Visual layer: the transparent native input above handles pointer, keys and a11y. */}
          <span className={styles.track} aria-hidden="true">
            <span className={styles.range} />
          </span>
          <span className={styles.thumb} aria-hidden="true" />
        </div>
      </ControlSizeProvider>
    </FieldFrame>
  );
}
