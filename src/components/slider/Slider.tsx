import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import {
  FieldFrame,
  type FieldFrameProps,
  type FieldRootDomProps,
  useFieldFrame,
} from "@/internal/FieldFrame";
import { useLabels } from "@/internal/labels";
import { motionDurationMs } from "@/internal/motionTiming";
import type { ControlSize, Tone } from "@/internal/states";
import { isPromiseLike } from "@/internal/usePendingChanges";

import styles from "./Slider.module.css";

export type SliderLabels = {
  /** Muted marker after the label when `optional`. */
  optional: string;
};

export const SLIDER_LABELS: SliderLabels = { optional: "необязательно" };

export type SliderProps = FieldRootDomProps &
  FieldFrameProps & {
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    onCommit?: (value: number) => void | Promise<void>;
    name?: string;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    invalid?: boolean;
    showValue?: boolean;
    formatValue?: (value: number) => string;
    size?: ControlSize;
    tone?: Tone;
    orientation?: "horizontal" | "vertical";
    id?: string;
    "aria-label"?: string;
    "aria-describedby"?: string;
    labels?: Partial<SliderLabels>;
  };

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Keys that change the value of a range input. */
const VALUE_KEYS = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
]);

/**
 * A single value on a range, framed like every field: label row (with the value), the track
 * with a glass thumb, then hint or error. `className`, `ref` and the rest go to the frame, `id`
 * and `aria-label` to the range input.
 */
export function Slider({
  value: valueProp,
  defaultValue,
  onValueChange,
  onCommit,
  name,
  min = 0,
  max = 100,
  step = 1,
  disabled: disabledProp,
  invalid,
  label,
  required,
  optional,
  hint,
  hintTone,
  error,
  showValue = false,
  formatValue,
  size: sizeProp,
  tone = "accent",
  orientation = "horizontal",
  id,
  className,
  style,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  labels: labelsProp,
  ...rest
}: SliderProps) {
  const tier = useHostTier(sizeProp);
  const { size } = tier;
  const disabled = useInheritedDisabled(disabledProp);
  const labels = useLabels(SLIDER_LABELS, labelsProp);
  const ids = useFieldFrame(id, { label, hint, error, invalid }, ariaDescribedBy);
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: clamp(defaultValue ?? min, min, max),
    onChange: onValueChange,
  });

  const safeValue = clamp(value, min, max);
  // The value of the last commit; a release that ends where it started commits nothing.
  const committedRef = React.useRef(safeValue);
  // The last value the owner accepted: a refused commit goes back to it.
  const savedRef = React.useRef(safeValue);
  /** Commits in flight: only the answer to the latest one counts. */
  const sequenceRef = React.useRef(0);
  const [pending, setPending] = React.useState(false);
  const pendingRef = React.useRef(false);
  pendingRef.current = pending;
  /** The last value the person moved the thumb to (pointer or keys). */
  const movedRef = React.useRef(safeValue);
  // A value set from outside (the owner, a form reset) is the new starting point: a release or a
  // key that changes nothing commits nothing. A commit in flight keeps its own baseline.
  React.useEffect(() => {
    if (safeValue === movedRef.current || pendingRef.current) return;
    movedRef.current = safeValue;
    committedRef.current = safeValue;
    savedRef.current = safeValue;
  }, [safeValue]);
  /** A refused commit glides the thumb back (no glide while it follows a drag). */
  const [settling, setSettling] = React.useState(false);
  const settleTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(
    () => () => {
      if (settleTimer.current !== null) clearTimeout(settleTimer.current);
    },
    [],
  );

  const commit = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const next = Number.parseFloat(event.currentTarget.value);
    if (Number.isNaN(next) || next === committedRef.current) return;
    committedRef.current = next;
    const outcome = onCommit?.(next);
    sequenceRef.current += 1;
    const sequence = sequenceRef.current;
    if (!isPromiseLike(outcome)) {
      savedRef.current = next;
      setPending(false);
      return;
    }
    setPending(true);
    outcome.then(
      () => {
        if (sequence !== sequenceRef.current) return;
        savedRef.current = next;
        setPending(false);
      },
      () => {
        if (sequence !== sequenceRef.current) return;
        const saved = savedRef.current;
        committedRef.current = saved;
        setPending(false);
        setSettling(true);
        setValue(saved);
        if (settleTimer.current !== null) clearTimeout(settleTimer.current);
        settleTimer.current = setTimeout(() => setSettling(false), motionDurationMs("base"));
      },
    );
  };
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
      hintTone={hintTone}
      error={error}
      disabled={disabled}
      optionalLabel={labels.optional}
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
      {...toDataAttributes({
        tone,
        orientation: orientation === "vertical" ? "vertical" : undefined,
        pending: pending || undefined,
        settling: settling || undefined,
      })}
    >
      {tier.provide(
        <div className={styles.control}>
          <input
            id={ids.controlId}
            type="range"
            name={name}
            className={styles.input}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            value={safeValue}
            onChange={(event) => {
              const next = Number.parseFloat(event.currentTarget.value);
              if (Number.isNaN(next)) return;
              movedRef.current = next;
              setSettling(false);
              setValue(next);
            }}
            onPointerDown={() => {
              committedRef.current = safeValue;
            }}
            onPointerUp={commit}
            onKeyUp={(event) => {
              // Only a key that moves the thumb commits: Tab, Shift or Escape never do.
              if (VALUE_KEYS.has(event.key)) commit(event);
            }}
            aria-label={ariaLabel}
            aria-orientation={orientation === "vertical" ? "vertical" : undefined}
            aria-valuetext={formatValue ? valueText : undefined}
            aria-describedby={ids.describedBy}
            aria-invalid={ids.invalid || undefined}
            aria-busy={pending || undefined}
          />
          {/* Visual layer: the transparent native input above handles pointer, keys and a11y. */}
          <span className={styles.track} aria-hidden="true">
            <span className={styles.range} />
          </span>
          <span className={styles.thumb} aria-hidden="true" />
        </div>,
      )}
    </FieldFrame>
  );
}
