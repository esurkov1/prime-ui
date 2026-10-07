import type * as React from "react";

import { Hint } from "@/components/hint/Hint";
import { Label } from "@/components/label/Label";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { type FieldIds, hasFieldError } from "@/internal/FieldFrame";
import type { ControlSize, DataState } from "@/internal/states";

import styles from "./ChoiceField.module.css";

/*
 * Layout shared by Checkbox, Radio and Switch:
 *   grid  [control] [label text]
 *         [       ] [hint | error]
 * The `<label>` row wraps the native input and its visual, so a click anywhere on it toggles.
 */

/** Class of the visually hidden native input that sits on top of the visual control. */
export const choiceInputClass = styles.input;

type ChoiceFieldProps = {
  ids: FieldIds;
  size: ControlSize;
  state: Extract<DataState, "checked" | "unchecked" | "indeterminate">;
  disabled: boolean;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  /** The native input (with `choiceInputClass`) followed by its aria-hidden visual. */
  control: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export function ChoiceField({
  ids,
  size,
  state,
  disabled,
  hint,
  error,
  control,
  className,
  children,
}: ChoiceFieldProps) {
  const showError = hasFieldError(error);
  const showHint = !showError && hint != null && hint !== false && hint !== "";

  return (
    <ControlSizeProvider value={size}>
      <div
        className={cx(styles.field, className)}
        {...toDataAttributes({
          size,
          state,
          invalid: ids.invalid || undefined,
          disabled: disabled || undefined,
        })}
      >
        <Label.Root htmlFor={ids.controlId} size={size} disabled={disabled} className={styles.row}>
          <span className={styles.controlCell}>{control}</span>
          {children}
        </Label.Root>
        {showError ? (
          <Hint.Root id={ids.errorId} size={size} invalid className={styles.support}>
            {error}
          </Hint.Root>
        ) : showHint ? (
          <Hint.Root id={ids.hintId} size={size} disabled={disabled} className={styles.support}>
            {hint}
          </Hint.Root>
        ) : null}
      </div>
    </ControlSizeProvider>
  );
}

export type ChoiceLabelProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** The visible text of a choice; it sits in the text column of the label row. */
export function ChoiceLabel({ className, ...rest }: ChoiceLabelProps) {
  return <span className={cx(styles.text, className)} {...rest} />;
}
