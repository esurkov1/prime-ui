import * as React from "react";

import type { DigitInputSize } from "@/internal/states";

import { useControllableState } from "../../hooks/useControllableState";
import { cx } from "../../internal/cx";

import styles from "./DigitInput.module.css";

export type { DigitInputSize };

export type DigitInputRootProps = {
  length?: number;
  size?: DigitInputSize;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  onComplete?: (value: string) => void;
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
  onChange,
  disabled,
  hasError,
  onComplete,
  className,
}: DigitInputRootProps) {
  const length = lengthProp;
  const slotKeysRef = React.useRef<string[] | null>(null);
  if (!slotKeysRef.current || slotKeysRef.current.length !== length) {
    slotKeysRef.current = createSlotKeys(length);
  }
  const slotKeys = slotKeysRef.current;
  const defaultNormalized = normalizeDigits(defaultValue, length);
  const [value, setValue] = useControllableState({
    value: valueProp !== undefined ? normalizeDigits(valueProp, length) : undefined,
    defaultValue: defaultNormalized,
    onChange,
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
      aria-label="Digit input"
      className={cx(styles.root, className)}
      data-size={size}
      data-has-error={hasError ? "true" : "false"}
      data-disabled={disabled ? "true" : "false"}
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
          value={cell}
          aria-label={`Digit ${index + 1} of ${length}`}
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

DigitInputRoot.displayName = "DigitInputRoot";

export const DigitInput = { Root: DigitInputRoot };
