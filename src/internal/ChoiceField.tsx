import type * as React from "react";

import { Hint } from "@/components/hint/Hint";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import {
  type FieldIds,
  leavingErrorClass,
  useErrorShake,
  useLeavingError,
} from "@/internal/FieldFrame";
import frameStyles from "@/internal/FieldFrame.module.css";
import type { ControlSize, DataState } from "@/internal/states";
import { touchTargetClass } from "@/internal/touchTarget";

import styles from "./ChoiceField.module.css";

/*
 * Layout and states shared by Checkbox, Radio and Switch:
 *   grid  [control] [label text]
 *         [       ] [hint | error]
 * The `<label>` row wraps the native input and its visual, so a click anywhere on it toggles.
 */

/** Class of the visually hidden native input that sits on top of the visual control. */
export const choiceInputClass = styles.input;

/**
 * Class of the visual control (box, circle, track): fill, hover, press, checked, focus ring,
 * invalid and disabled come from the field state. A host tunes the fills with `--choice-bg*`.
 * Outside a field (`Checkbox.Indicator`) the element's own `data-state` / `data-disabled` drive it.
 */
export const choiceVisualClass = styles.visual;

/** `--prime-choice-size` / gap / text of the tier in `data-size` on the same element. */
export const choiceTierClass = styles.tier;

type ChoiceFieldProps = {
  ids: FieldIds;
  size: ControlSize;
  state: Extract<DataState, "checked" | "unchecked" | "indeterminate">;
  disabled: boolean;
  /** The state is shown but does not change: no hover or press. */
  readOnly?: boolean;
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
  readOnly = false,
  hint,
  error,
  control,
  className,
  children,
}: ChoiceFieldProps) {
  const shake = useErrorShake(ids.invalid, error);
  const leaving = useLeavingError(ids.showError, error);
  return (
    <ControlSizeProvider value={size}>
      <div
        className={cx(styles.tier, styles.field, className)}
        {...toDataAttributes({
          size,
          state,
          invalid: ids.invalid || undefined,
          disabled: disabled || undefined,
          readonly: readOnly || undefined,
        })}
      >
        <label
          htmlFor={ids.controlId}
          className={cx(styles.row, frameStyles.shakeSelf)}
          data-shake={shake}
        >
          <span className={cx(styles.controlCell, touchTargetClass)}>{control}</span>
          {children}
        </label>
        {ids.showError ? (
          <Hint.Root id={ids.errorId} size={size} invalid className={styles.support}>
            {error}
          </Hint.Root>
        ) : leaving ? (
          <Hint.Root
            size={size}
            invalid
            aria-hidden="true"
            data-state="closed"
            onAnimationEnd={leaving.onExitEnd}
            className={cx(styles.support, leavingErrorClass)}
          >
            {leaving.node}
          </Hint.Root>
        ) : ids.showHint ? (
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
