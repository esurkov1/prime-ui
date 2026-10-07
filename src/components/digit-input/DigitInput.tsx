import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { FieldFrame, type FieldFrameProps, useFieldFrame } from "@/internal/FieldFrame";
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

export type DigitInputProps = FieldFrameProps & {
  /** Number of cells. */
  length?: number;
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
  /** Id of the first cell (the label points at it); generated when omitted. */
  id?: string;
  "aria-describedby"?: string;
  labels?: Partial<DigitInputLabels>;
  className?: string;
};

const normalizeDigits = (raw: string, length: number) => raw.replace(/\D/g, "").slice(0, length);

const createSlotKeys = (length: number) => Array.from({ length }, () => crypto.randomUUID());

/** A one-time code or PIN split into cells, with the field label, hint and error. */
export function DigitInput({
  length = 4,
  size = "m",
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
}: DigitInputProps) {
  const labels = { ...DIGIT_INPUT_LABELS, ...labelsProp };
  const ids = useFieldFrame(id, { hint, error, invalid }, ariaDescribedBy);

  // Stable keys per cell position; recreated only when the number of cells changes.
  const slotKeysRef = React.useRef<string[] | null>(null);
  if (slotKeysRef.current?.length !== length) slotKeysRef.current = createSlotKeys(length);
  const slotKeys = slotKeysRef.current;

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

  const focusAt = (index: number) => {
    const el = inputRefs.current[index];
    if (el) queueMicrotask(() => el.focus());
  };

  /** The value has no gaps, so the only cell that accepts input is the first empty one (or the last). */
  const entryIndex = Math.min(value.length, length - 1);

  const handleChangeAt = (index: number, nextChar: string) => {
    const at = Math.min(index, entryIndex);
    const nextCells = [...cells];
    nextCells[at] = nextChar;
    commit(nextCells.join(""));
    if (nextChar && at < length - 1) focusAt(at + 1);
  };

  const handlePaste = (startIndex: number, pasted: string) => {
    const digits = normalizeDigits(pasted, length);
    if (digits.length === 0) return;
    const start = Math.min(startIndex, entryIndex);
    const nextCells = [...cells];
    for (let offset = 0; offset < digits.length && start + offset < length; offset++) {
      nextCells[start + offset] = digits[offset];
    }
    commit(nextCells.join(""));
    focusAt(Math.min(start + digits.length, length - 1));
  };

  const entryIndexRef = React.useRef(entryIndex);
  entryIndexRef.current = entryIndex;

  React.useEffect(() => {
    if (autoFocus) inputRefs.current[entryIndexRef.current]?.focus();
  }, [autoFocus]);

  return (
    <FieldFrame
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
    >
      <fieldset
        aria-label={label != null ? undefined : labels.group}
        aria-labelledby={label != null ? ids.labelId : undefined}
        aria-describedby={ids.describedBy}
        disabled={disabled}
        className={styles.root}
        {...toDataAttributes({
          size,
          "full-width": fullWidth || undefined,
          invalid: ids.invalid || undefined,
          disabled: disabled || undefined,
          "focus-ring": focusRing ? undefined : false,
        })}
      >
        {name ? <input type="hidden" name={name} value={value} /> : null}
        {cells.map((cell, index) => (
          <input
            key={slotKeys[index]}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            id={index === 0 ? ids.controlId : undefined}
            type={mask ? "password" : "text"}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoCorrect="off"
            spellCheck={false}
            disabled={disabled}
            required={required}
            className={styles.cell}
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
                focusAt(entryIndex);
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
              if (event.key === "Backspace" && !cells[index] && index > 0) {
                event.preventDefault();
                focusAt(index - 1);
              } else if (event.key === "ArrowLeft" && index > 0) {
                event.preventDefault();
                focusAt(index - 1);
              } else if (event.key === "ArrowRight" && index < entryIndex) {
                event.preventDefault();
                focusAt(index + 1);
              } else if (event.key === "Home") {
                event.preventDefault();
                focusAt(0);
              } else if (event.key === "End") {
                event.preventDefault();
                focusAt(entryIndex);
              }
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
