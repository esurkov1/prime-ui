import * as React from "react";

import { LabelMarks } from "@/components/label/Label";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { type FieldIds, FieldSupport, useErrorShake, useLeavingError } from "@/internal/FieldFrame";
import { fieldTierClass } from "@/internal/fieldClasses";
import press from "@/internal/press.module.css";
import type { CheckState, ControlSize } from "@/internal/states";
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
export const choiceVisualClass = cx(styles.visual, press.pressPartCompact);

/**
 * The square box of a checkbox or a radio: the tier's choice size (`--field-choice`), the mark
 * centred in it. The host sets only its corner radius and draws the mark or the dot.
 */
export const choiceBoxClass = styles.box;

type ChoiceMarks = {
  required: boolean;
  optional: boolean;
  optionalLabel: string;
  disabled: boolean;
};

const ChoiceMarksContext = React.createContext<ChoiceMarks | null>(null);

type ChoiceFieldProps = {
  ids: FieldIds;
  size: ControlSize;
  state: CheckState;
  disabled: boolean;
  /** The state is shown but does not change: no hover or press. */
  readOnly?: boolean;
  /** A change is being saved (a promise from the handler): no press. */
  busy?: boolean;
  /** Red `*` after the text (`LabelMarks`); the native input carries `required`. */
  required?: boolean;
  /** Muted `optionalLabel` after the text. */
  optional?: boolean;
  optionalLabel?: string;
  /**
   * An option of a group (a radio in `Radio.Group`): the group frame shakes and announces its
   * error, the option does neither.
   */
  groupOption?: boolean;
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
  busy = false,
  required = false,
  optional = false,
  optionalLabel = "",
  groupOption = false,
  hint,
  error,
  control,
  className,
  children,
}: ChoiceFieldProps) {
  const shake = useErrorShake(!groupOption && ids.invalid, error);
  const leaving = useLeavingError(ids.showError, error);
  const marks = React.useMemo(
    () => ({ required, optional, optionalLabel, disabled }),
    [required, optional, optionalLabel, disabled],
  );
  return (
    <ControlSizeProvider value={size}>
      <div
        className={cx(fieldTierClass, styles.field, className)}
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
          className={cx(styles.row, press.pressHost)}
          data-loading={busy || undefined}
        >
          <span
            className={cx(styles.controlCell, enterMotion.shake, touchTargetClass)}
            data-shake={shake}
          >
            {control}
          </span>
          <ChoiceMarksContext value={marks}>{children}</ChoiceMarksContext>
        </label>
        <FieldSupport
          ids={ids}
          size={size}
          hint={hint}
          error={error}
          leaving={leaving}
          disabled={disabled}
          live={!groupOption}
          className={styles.support}
        />
      </div>
    </ControlSizeProvider>
  );
}

export type ChoiceLabelProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** The visible text of a choice; it sits in the text column of the label row, marks after it. */
export function ChoiceLabel({ className, children, ...rest }: ChoiceLabelProps) {
  const marks = React.use(ChoiceMarksContext);
  const marked = marks && (marks.required || marks.optional);
  return (
    <span className={cx(styles.text, className)} {...rest}>
      {children}
      {marked ? (
        <>
          {" "}
          <LabelMarks
            required={marks.required}
            optional={marks.optional}
            optionalLabel={marks.optionalLabel}
            disabled={marks.disabled}
          />
        </>
      ) : null}
    </span>
  );
}
