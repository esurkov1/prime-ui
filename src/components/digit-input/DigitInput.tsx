import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import {
  FieldFrame,
  type FieldFrameProps,
  type FieldRootDomProps,
  useFieldFrame,
} from "@/internal/FieldFrame";
import { fieldSurfaceClass, fieldTierClass } from "@/internal/fieldClasses";
import { formatLabel } from "@/internal/formatLabel";
import type { ControlSize } from "@/internal/states";

import styles from "./DigitInput.module.css";

export type DigitInputLabels = {
  /** Accessible name of the group when there is no visible `label`. */
  group: string;
  /** Accessible name of a cell; `{index}` (1-based) and `{length}` are replaced. */
  cell: string;
  /** Muted marker after the label when `optional`. */
  optional: string;
};

const DIGIT_INPUT_LABELS: DigitInputLabels = {
  group: "Код",
  cell: "Цифра {index} из {length}",
  optional: "необязательно",
};

export type DigitInputProps = FieldRootDomProps &
  FieldFrameProps & {
    /** Number of cells. */
    length?: number;
    /** Tier. Default: the tier of the surrounding control (a form, a panel), else `m`. */
    size?: ControlSize;
    /**
     * Cells share the container width and grow with it (height stays the tier height, so they become
     * wider than tall). Default `false`: square cells of the tier size, centered.
     */
    fullWidth?: boolean;
    /** Name of the hidden input that carries the joined code in a native form submit. */
    name?: string;
    /** Splits the cells into groups of this size with a wider gap between them (`3` → 123 456). */
    groupSize?: number;
    /** Hides the digits (PIN): cells are `type="password"`. */
    mask?: boolean;
    /** Focuses the first empty cell on mount. */
    autoFocus?: boolean;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    /** Called once when the last empty cell is filled. */
    onComplete?: (value: string) => void;
    disabled?: boolean;
    /** Invalid state: danger ring on every cell. A non-empty `error` implies it. */
    invalid?: boolean;
    /**
     * The code was accepted (after the server checked it): the cells turn success one after
     * another. Say it in words too (`hint`), never by color alone.
     */
    success?: boolean;
    /** Id of the first cell (the label points at it); generated when omitted. */
    id?: string;
    "aria-describedby"?: string;
    labels?: Partial<DigitInputLabels>;
  };

const normalizeDigits = (raw: string, length: number) => raw.replace(/\D/g, "").slice(0, length);

/** A one-time code or PIN split into cells, with the field label, hint and error. */
export function DigitInput({
  length = 4,
  size: sizeProp,
  fullWidth = false,
  name,
  groupSize,
  mask = false,
  autoFocus = false,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onComplete,
  disabled,
  invalid,
  success = false,
  focusRing = true,
  label,
  required,
  optional,
  hint,
  error,
  id,
  "aria-describedby": ariaDescribedBy,
  labels: labelsProp,
  className,
  ...rest
}: DigitInputProps) {
  const size = useControlSize(sizeProp);
  const labels = { ...DIGIT_INPUT_LABELS, ...labelsProp };
  const ids = useFieldFrame(id, { label, hint, error, invalid }, ariaDescribedBy);

  const [value, setValue] = useControllableState({
    value: valueProp !== undefined ? normalizeDigits(valueProp, length) : undefined,
    defaultValue: normalizeDigits(defaultValue, length),
    onChange: onValueChange,
  });

  const commit = (nextRaw: string) => {
    const next = normalizeDigits(nextRaw, length);
    const wasComplete = value.length === length;
    setValue(next);
    if (next.length === length && !wasComplete) onComplete?.(next);
  };

  const cells = Array.from({ length }, (_, index) => value[index] ?? "");
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);
  /** Cell to focus once a value change has committed (its `onFocus` reads the new entry index). */
  const pendingFocusRef = React.useRef<number | null>(null);

  React.useLayoutEffect(() => {
    const index = pendingFocusRef.current;
    if (index === null) return;
    pendingFocusRef.current = null;
    inputRefs.current[index]?.focus();
  });

  // One focus ring for the whole row: it glides to the focused cell instead of jumping between
  // six rings (foundation §7 rule 8). It appears in place and only moves between cells.
  const [focusIndex, setFocusIndex] = React.useState<number | null>(null);
  const ringRef = React.useRef<HTMLSpanElement>(null);
  const ringShown = React.useRef(false);

  React.useLayoutEffect(() => {
    const ring = ringRef.current;
    const cell = focusIndex === null ? null : inputRefs.current[focusIndex];
    if (!ring) return;
    if (!cell) {
      ringShown.current = false;
      return;
    }
    const place = () => {
      ring.style.width = `${cell.offsetWidth}px`;
      ring.style.height = `${cell.offsetHeight}px`;
      ring.style.transform = `translate(${cell.offsetLeft}px, ${cell.offsetTop}px)`;
    };
    if (!ringShown.current) {
      ring.style.transition = "none";
      place();
      ring.getBoundingClientRect();
      ring.style.transition = "";
      ringShown.current = true;
    } else {
      place();
    }
  });

  /** The value has no gaps, so the only cell that accepts input is the first empty one (or the last). */
  const entryIndex = Math.min(value.length, length - 1);

  const handleChangeAt = (index: number, nextChar: string) => {
    const at = Math.min(index, entryIndex);
    const nextCells = [...cells];
    nextCells[at] = nextChar;
    if (nextChar && at < length - 1) pendingFocusRef.current = at + 1;
    commit(nextCells.join(""));
  };

  const handlePaste = (startIndex: number, pasted: string) => {
    const digits = normalizeDigits(pasted, length);
    if (digits.length === 0) return;
    const start = Math.min(startIndex, entryIndex);
    const nextCells = [...cells];
    for (let offset = 0; offset < digits.length && start + offset < length; offset++) {
      nextCells[start + offset] = digits[offset];
    }
    pendingFocusRef.current = Math.min(start + digits.length, length - 1);
    commit(nextCells.join(""));
  };

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
      optionalLabel={labels.optional}
      className={cx(styles.frame, className)}
      data-full-width={fullWidth || undefined}
    >
      <fieldset
        aria-label={ids.labelledBy ? undefined : labels.group}
        aria-labelledby={ids.labelledBy}
        aria-describedby={ids.describedBy}
        disabled={disabled}
        className={cx(fieldTierClass, styles.root)}
        {...toDataAttributes({
          size,
          "full-width": fullWidth || undefined,
          invalid: ids.invalid || undefined,
          success: (success && !ids.invalid) || undefined,
          disabled: disabled || undefined,
          "focus-ring": focusRing ? undefined : false,
        })}
        onFocus={(event) => {
          const index = inputRefs.current.indexOf(event.target as unknown as HTMLInputElement);
          if (index >= 0) setFocusIndex(index);
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocusIndex(null);
        }}
      >
        <span
          ref={ringRef}
          className={styles.ring}
          aria-hidden="true"
          data-visible={focusIndex !== null || undefined}
        />
        {name ? <input type="hidden" name={name} value={value} /> : null}
        {cells.map((cell, index) => (
          <input
            // biome-ignore lint/suspicious/noArrayIndexKey: a cell is its position; cells are never reordered
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            id={index === 0 ? ids.controlId : undefined}
            type={mask ? "password" : "text"}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoCorrect="off"
            spellCheck={false}
            // biome-ignore lint/a11y/noAutofocus: opt-in `autoFocus` of a one-time-code step
            autoFocus={autoFocus && index === entryIndex}
            disabled={disabled}
            required={required}
            className={cx(fieldSurfaceClass, styles.cell)}
            // The row's gliding ring replaces each cell's own.
            data-focus-ring="false"
            style={{ "--digit-i": index } as React.CSSProperties}
            data-size={size}
            data-filled={cell ? "true" : undefined}
            data-group-start={
              groupSize && index > 0 && index % groupSize === 0 ? "true" : undefined
            }
            value={cell}
            aria-label={formatLabel(labels.cell, { index: index + 1, length })}
            aria-invalid={ids.invalid || undefined}
            onFocus={(event) => {
              if (index > entryIndex) {
                inputRefs.current[entryIndex]?.focus();
                return;
              }
              event.currentTarget.select();
            }}
            onChange={(event) => {
              const digits = normalizeDigits(event.target.value, length);
              if (digits.length <= 1) {
                handleChangeAt(index, digits);
              } else if (digits.length === 2 && cells[index]) {
                // Typing into a filled cell without a selection: keep the new digit only.
                handleChangeAt(index, digits.replace(cells[index], "").slice(0, 1) || digits[1]);
              } else {
                // Autofill or IME delivered the whole code into one cell.
                handlePaste(0, digits);
              }
            }}
            onKeyDown={(event) => {
              // Moving between cells changes no value: focus the target cell at once.
              const target =
                (event.key === "Backspace" && !cells[index] && index > 0) ||
                (event.key === "ArrowLeft" && index > 0)
                  ? index - 1
                  : event.key === "ArrowRight" && index < entryIndex
                    ? index + 1
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? entryIndex
                        : null;
              if (target === null) return;
              event.preventDefault();
              inputRefs.current[target]?.focus();
            }}
            onPaste={(event) => {
              event.preventDefault();
              handlePaste(index, event.clipboardData.getData("text"));
            }}
          />
        ))}
      </fieldset>
    </FieldFrame>
  );
}
