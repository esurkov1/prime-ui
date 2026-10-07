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

  const handleChangeAt = (index: number, nextChar: string) => {
    const nextCells = [...cells];
    nextCells[index] = nextChar;
    commit(nextCells.join(""));
    if (nextChar && index < length - 1) {
      focusAt(index + 1);
    }
  };

  const handlePaste = (startIndex: number, pasted: string) => {
    const digits = normalizeDigits(pasted, length);
    if (digits.length === 0) {
      return;
    }
    const nextCells = [...cells];
    let writeIndex = startIndex;
    for (const d of digits) {
      if (writeIndex >= length) {
        break;
      }
      nextCells[writeIndex] = d;
      writeIndex++;
    }
    commit(nextCells.join(""));
    const focusIndex = Math.min(startIndex + digits.length, length - 1);
    focusAt(focusIndex);
  };

  return (
    <fieldset
      aria-label={labels.group}
      aria-describedby={ariaDescribedBy}
      disabled={disabled}
      className={cx(styles.root, className)}
      {...toDataAttributes({
        size,
        invalid: invalid || undefined,
        disabled: disabled || undefined,
        "focus-ring": focusRing ? undefined : false,
      })}
    >
      {cells.map((cell, index) => (
        <input
          key={slotKeys[index]}
          ref={(el) => setInputRef(el, index)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          className={styles.cell}
          data-size={size}
          data-filled={cell ? "true" : undefined}
          value={cell}
          aria-label={labels.cell
            .replace("{index}", String(index + 1))
            .replace("{length}", String(length))}
          aria-invalid={invalid || undefined}
          onFocus={(e) => e.currentTarget.select()}
          onChange={(e) => {
            if (disabled) {
              return;
            }
            const raw = e.target.value;
            const digitsOnly = normalizeDigits(raw, 1);
            const nextChar = digitsOnly.slice(-1) ?? "";
            handleChangeAt(index, nextChar);
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
            } else if (e.key === "ArrowRight" && index < length - 1) {
              e.preventDefault();
              focusAt(index + 1);
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
