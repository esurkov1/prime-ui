import * as React from "react";
import { useControllableState } from "@/hooks/useControllableState";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";

import styles from "./DigitInput.module.css";

export type DigitInputLabels = {
  /** Accessible name of the group. */
  group: string;
  /** Accessible name of a cell; `{index}` (1-based) and `{length}` are replaced. */
  cell: string;
};

const DIGIT_INPUT_LABELS: DigitInputLabels = {
  group: "Код",
  cell: "Цифра {index} из {length}",
};

export type DigitInputRootProps = {
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
  invalid?: boolean;
  /**
   * Draws the focus ring on the focused cell (default). `false` sets `data-focus-ring="false"` on
   * the fieldset and hides only the visual ring — focus, keyboard and ARIA are unchanged, the error
   * ring still shows. Turn it off only where focus is otherwise obvious; WCAG 2.4.7.
   */
  focusRing?: boolean;
  /** Id(s) of the hint / error text describing the group. */
  "aria-describedby"?: string;
  labels?: Partial<DigitInputLabels>;
  className?: string;
};

function normalizeDigits(raw: string, len: number) {
  return raw.replace(/\D/g, "").slice(0, len);
}

function toCells(value: string, len: number): string[] {
  const digits = normalizeDigits(value, len);
  const cells: string[] = [];
  for (let i = 0; i < len; i++) {
    cells.push(digits[i] ?? "");
  }
  return cells;
}

function createSlotKeys(len: number) {
  return Array.from({ length: len }, () => crypto.randomUUID());
}

function DigitInputRoot({
  length: lengthProp = 4,
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
  "aria-describedby": ariaDescribedBy,
  labels: labelsProp,
  className,
}: DigitInputRootProps) {
  const length = lengthProp;
  const labels = { ...DIGIT_INPUT_LABELS, ...labelsProp };
  const slotKeysRef = React.useRef<string[] | null>(null);
  if (!slotKeysRef.current || slotKeysRef.current.length !== length) {
    slotKeysRef.current = createSlotKeys(length);
  }
  const slotKeys = slotKeysRef.current;
  const defaultNormalized = normalizeDigits(defaultValue, length);
  const [value, setValue] = useControllableState({
    value: valueProp !== undefined ? normalizeDigits(valueProp, length) : undefined,
    defaultValue: defaultNormalized,
    onChange: onValueChange,
  });

  const prevLenRef = React.useRef(0);

  React.useEffect(() => {
    prevLenRef.current = normalizeDigits(value, length).length;
  }, [length, value]);

  const commit = React.useCallback(
    (nextRaw: string) => {
      const next = normalizeDigits(nextRaw, length);
      const prevLen = prevLenRef.current;
      setValue(next);
      prevLenRef.current = next.length;
      if (next.length === length && prevLen < length) {
        onComplete?.(next);
      }
    },
    [length, onComplete, setValue],
  );

  const cells = toCells(value, length);
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  const setInputRef = React.useCallback((el: HTMLInputElement | null, index: number) => {
    inputRefs.current[index] = el;
  }, []);

  const focusAt = React.useCallback((index: number) => {
    const el = inputRefs.current[index];
    if (el) {
      queueMicrotask(() => el.focus());
    }
  }, []);

  /** The value has no gaps, so the only cell that accepts input is the first empty one (or the last). */
  const entryIndex = Math.min(normalizeDigits(value, length).length, length - 1);

  const handleChangeAt = (index: number, nextChar: string) => {
    const at = Math.min(index, entryIndex);
    const nextCells = [...cells];
    nextCells[at] = nextChar;
    commit(nextCells.join(""));
    if (nextChar && at < length - 1) {
      focusAt(at + 1);
    }
  };

  const handlePaste = (startIndex: number, pasted: string) => {
    const digits = normalizeDigits(pasted, length);
    if (digits.length === 0) {
      return;
    }
    const start = Math.min(startIndex, entryIndex);
    const nextCells = [...cells];
    let writeIndex = start;
    for (const d of digits) {
      if (writeIndex >= length) {
        break;
      }
      nextCells[writeIndex] = d;
      writeIndex++;
    }
    commit(nextCells.join(""));
    focusAt(Math.min(start + digits.length, length - 1));
  };

  const entryIndexRef = React.useRef(entryIndex);
  entryIndexRef.current = entryIndex;

  React.useEffect(() => {
    if (autoFocus) {
      inputRefs.current[entryIndexRef.current]?.focus();
    }
  }, [autoFocus]);

  return (
    <fieldset
      aria-label={labels.group}
      aria-describedby={ariaDescribedBy}
      disabled={disabled}
      className={cx(styles.root, className)}
      {...toDataAttributes({
        size,
        "full-width": fullWidth || undefined,
        invalid: invalid || undefined,
        disabled: disabled || undefined,
        "focus-ring": focusRing ? undefined : false,
      })}
    >
      {name ? <input type="hidden" name={name} value={normalizeDigits(value, length)} /> : null}
      {cells.map((cell, index) => (
        <input
          key={slotKeys[index]}
          ref={(el) => setInputRef(el, index)}
          type={mask ? "password" : "text"}
          inputMode="numeric"
          autoComplete="one-time-code"
          autoCorrect="off"
          spellCheck={false}
          disabled={disabled}
          className={styles.cell}
          data-size={size}
          data-filled={cell ? "true" : undefined}
          data-group-start={groupSize && index > 0 && index % groupSize === 0 ? "true" : undefined}
          value={cell}
          aria-label={labels.cell
            .replace("{index}", String(index + 1))
            .replace("{length}", String(length))}
          aria-invalid={invalid || undefined}
          onFocus={(e) => {
            if (index > entryIndex) {
              focusAt(entryIndex);
              return;
            }
            e.currentTarget.select();
          }}
          onChange={(e) => {
            if (disabled) {
              return;
            }
            const digits = normalizeDigits(e.target.value, length);
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
          onKeyDown={(e) => {
            if (disabled) {
              return;
            }
            if (e.key === "Backspace" && !cells[index] && index > 0) {
              e.preventDefault();
              focusAt(index - 1);
            } else if (e.key === "ArrowLeft" && index > 0) {
              e.preventDefault();
              focusAt(index - 1);
            } else if (e.key === "ArrowRight" && index < entryIndex) {
              e.preventDefault();
              focusAt(index + 1);
            } else if (e.key === "Home") {
              e.preventDefault();
              focusAt(0);
            } else if (e.key === "End") {
              e.preventDefault();
              focusAt(entryIndex);
            }
          }}
          onPaste={(e) => {
            if (disabled) {
              return;
            }
            e.preventDefault();
            handlePaste(index, e.clipboardData.getData("text"));
          }}
        />
      ))}
    </fieldset>
  );
}

DigitInputRoot.displayName = "DigitInput.Root";

export const DigitInput = { Root: DigitInputRoot };
