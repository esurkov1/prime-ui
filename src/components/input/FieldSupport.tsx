import type * as React from "react";

import { Hint } from "@/components/hint/Hint";
import { cx } from "@/internal/cx";
import { type FieldIds, hasFieldError } from "@/internal/FieldFrame";
import type { ControlSize } from "@/internal/states";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./FieldSupport.module.css";

/*
 * Support row of the text fields (Input, Textarea): hint | error on the left, a character counter
 * on the right, optionally reserved so an appearing error does not shift the layout. FieldFrame
 * renders hint | error alone; this row adds the counter slot and the reserve.
 */

type FieldSupportRowProps = {
  ids: FieldIds;
  size: ControlSize;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  counter?: React.ReactNode;
  reserve?: boolean;
  disabled?: boolean;
};

export function FieldSupportRow({
  ids,
  size,
  hint,
  error,
  counter,
  reserve,
  disabled,
}: FieldSupportRowProps) {
  const showError = hasFieldError(error);
  const showHint = !showError && hint != null && hint !== false && hint !== "";
  if (!showError && !showHint && counter == null && !reserve) return null;

  return (
    <div className={styles.row} data-size={size} data-reserve={reserve || undefined}>
      {showError ? (
        <Hint.Root id={ids.errorId} size={size} invalid className={styles.text}>
          {error}
        </Hint.Root>
      ) : showHint ? (
        <Hint.Root id={ids.hintId} size={size} disabled={disabled} className={styles.text}>
          {hint}
        </Hint.Root>
      ) : (
        <span className={styles.text} />
      )}
      {counter}
    </div>
  );
}

type FieldCounterProps = {
  current: number;
  max: number;
  size: ControlSize;
  /** Spoken text, `{current}` and `{max}` are replaced. */
  label: string;
  className?: string;
};

/** `14/40` for the eye, `labels.counter` for screen readers; danger when `current > max`. */
export function FieldCounter({ current, max, size, label, className }: FieldCounterProps) {
  const spoken = label.replace("{current}", String(current)).replace("{max}", String(max));
  return (
    <span
      className={cx(styles.counter, className)}
      data-size={size}
      data-invalid={current > max || undefined}
      aria-live="polite"
    >
      <span aria-hidden="true">
        {current}/{max}
      </span>
      <VisuallyHidden>{spoken}</VisuallyHidden>
    </span>
  );
}
