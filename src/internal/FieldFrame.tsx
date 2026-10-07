import * as React from "react";

import { Hint } from "@/components/hint/Hint";
import { Label } from "@/components/label/Label";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";

import styles from "./FieldFrame.module.css";

/** Field props shared by Select, TagSelect and Datepicker (the same contract as `Input.Root`). */
export type FieldFrameProps = {
  label?: React.ReactNode;
  /** Red `*` after the label; the control gets native `required` / `aria-required`. */
  required?: boolean;
  /** Muted `labels.optional` marker after the label. */
  optional?: boolean;
  hint?: React.ReactNode;
  /** Error message; replaces the hint in the same slot and implies `invalid`. */
  error?: React.ReactNode;
  /**
   * Draws the focus ring on the field (default). `false` sets `data-focus-ring="false"` on it and
   * hides only the visual ring — focus, keyboard and ARIA are unchanged, the error ring still shows.
   * Turn it off only where focus is otherwise obvious; WCAG 2.4.7.
   */
  focusRing?: boolean;
};

export function hasFieldError(error: React.ReactNode): boolean {
  return error != null && error !== false && error !== "";
}

export type FieldIds = {
  controlId: string;
  /** Id of the label element (rendered only when `label` is set). */
  labelId: string;
  hintId: string;
  errorId: string;
  /** `aria-describedby` of the control: caller ids + hint or error. */
  describedBy: string | undefined;
  invalid: boolean;
};

/** Ids and validation state of a framed field. */
export function useFieldFrame(
  explicitId: string | undefined,
  { hint, error, invalid }: { hint?: React.ReactNode; error?: React.ReactNode; invalid?: boolean },
  ariaDescribedBy?: string,
): FieldIds {
  const generated = React.useId();
  const controlId = explicitId ?? generated;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;
  const showError = hasFieldError(error);
  const showHint = !showError && hint != null && hint !== false && hint !== "";
  const describedBy =
    [ariaDescribedBy, showHint ? hintId : undefined, showError ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
  return {
    controlId,
    labelId: `${controlId}-label`,
    hintId,
    errorId,
    describedBy,
    invalid: Boolean(invalid) || showError,
  };
}

type FieldFrameRenderProps = FieldFrameProps & {
  size: ControlSize;
  ids: FieldIds;
  disabled?: boolean;
  optionalLabel: string;
  className?: string;
  children: React.ReactNode;
};

/** Label row · control · support row (hint or error), spaced by the tier's `label-gap` / `hint-gap`. */
export function FieldFrame({
  size,
  ids,
  label,
  required,
  optional,
  hint,
  error,
  disabled,
  optionalLabel,
  className,
  children,
}: FieldFrameRenderProps) {
  const showError = hasFieldError(error);
  const showHint = !showError && hint != null && hint !== false && hint !== "";

  return (
    <div
      className={cx(styles.root, className)}
      {...toDataAttributes({
        size,
        invalid: ids.invalid || undefined,
        disabled: disabled || undefined,
      })}
    >
      {label != null && label !== false ? (
        <Label.Root
          id={ids.labelId}
          htmlFor={ids.controlId}
          size={size}
          required={required}
          optional={optional}
          disabled={disabled}
          labels={{ optional: optionalLabel }}
          className={styles.label}
        >
          {label}
        </Label.Root>
      ) : null}
      <div className={styles.body}>
        {children}
        {showError ? (
          <Hint.Root id={ids.errorId} size={size} invalid>
            {error}
          </Hint.Root>
        ) : showHint ? (
          <Hint.Root id={ids.hintId} size={size} disabled={disabled}>
            {hint}
          </Hint.Root>
        ) : null}
      </div>
    </div>
  );
}
