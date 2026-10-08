import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import {
  ChoiceField,
  ChoiceLabel,
  type ChoiceLabelProps,
  choiceInputClass,
  choiceTierClass,
  choiceVisualClass,
} from "@/internal/ChoiceField";
import { useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useFieldFrame } from "@/internal/FieldFrame";
import type { ControlSize } from "@/internal/states";

import styles from "./Checkbox.module.css";

export type CheckboxRootProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "checked" | "defaultChecked" | "onChange"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Mixed state (e.g. «select all» with a partial selection); wins over `checked` visually. */
  indeterminate?: boolean;
  /** Invalid state; a non-empty `error` implies it. */
  invalid?: boolean;
  /** Help text under the label text. Hidden while `error` is shown. */
  hint?: React.ReactNode;
  /** Error message in the hint slot; implies `invalid`. */
  error?: React.ReactNode;
  /** Tier. Default: the tier of the surrounding control (a form, a panel, a table), else `m`. */
  size?: ControlSize;
  /** `Checkbox.Label`; without it the bare box renders (give it an `aria-label`). */
  children?: React.ReactNode;
  /** The native checkbox input. */
  ref?: React.Ref<HTMLInputElement>;
};

/** Check and indeterminate bar; which one shows (and how it draws in) comes from `data-state`. */
function CheckboxMark() {
  // Own SVG instead of `Icon`: the draw-in motion needs `pathLength` on the paths.
  return (
    <svg viewBox="0 0 24 24" className={styles.svg} aria-hidden="true" focusable="false">
      <path d="M5.5 12.5l4.25 4.25L18.5 8" pathLength={1} className={styles.checkPath} />
      <path d="M7 12h10" pathLength={1} className={styles.indeterminateLine} />
    </svg>
  );
}

function CheckboxRoot({
  id,
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  indeterminate = false,
  invalid,
  hint,
  error,
  size: sizeProp,
  disabled = false,
  readOnly = false,
  className,
  "aria-describedby": ariaDescribedBy,
  children,
  ref,
  ...inputRest
}: CheckboxRootProps) {
  const size = useControlSize(sizeProp);
  const ids = useFieldFrame(id, { hint, error, invalid }, ariaDescribedBy);
  const [checked, setChecked] = useControllableState<boolean>({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const internalRef = React.useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRefs(internalRef, ref);

  React.useEffect(() => {
    if (internalRef.current) internalRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <ChoiceField
      ids={ids}
      size={size}
      state={indeterminate ? "indeterminate" : checked ? "checked" : "unchecked"}
      disabled={disabled}
      readOnly={readOnly}
      hint={hint}
      error={error}
      className={cx(styles.root, className)}
      control={
        <>
          <input
            {...inputRest}
            ref={mergedRef}
            id={ids.controlId}
            type="checkbox"
            className={choiceInputClass}
            disabled={disabled}
            checked={checked}
            onChange={(event) => {
              // A native checkbox ignores `readOnly`: the state stays, focus and the value submit.
              if (!readOnly) setChecked(event.target.checked);
            }}
            aria-invalid={ids.invalid || undefined}
            aria-readonly={readOnly || undefined}
            aria-describedby={ids.describedBy}
          />
          <span className={cx(choiceVisualClass, styles.control)} aria-hidden="true">
            <CheckboxMark />
          </span>
        </>
      }
    >
      {children}
    </ChoiceField>
  );
}
CheckboxRoot.displayName = "Checkbox.Root";

export type CheckboxLabelProps = ChoiceLabelProps;

function CheckboxLabel(props: CheckboxLabelProps) {
  return <ChoiceLabel {...props} />;
}
CheckboxLabel.displayName = "Checkbox.Label";

export type CheckboxIndicatorProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  checked?: boolean;
  /** Mixed state; wins over `checked` visually. */
  indeterminate?: boolean;
  disabled?: boolean;
  /** Box tier; without it the nearest control size (e.g. the Select or menu it sits in), else `m`. */
  size?: ControlSize;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * The checkbox box alone, without an input: a decorative mark for rows whose own element carries
 * the state (`role="option"` with `aria-selected`, `role="menuitemcheckbox"` with `aria-checked`).
 * Used outside `Checkbox.Root`; it is `aria-hidden` and takes no focus or clicks.
 */
function CheckboxIndicator({
  checked = false,
  indeterminate = false,
  disabled = false,
  size: sizeProp,
  className,
  ...rest
}: CheckboxIndicatorProps) {
  const size = useControlSize(sizeProp);
  return (
    <span
      aria-hidden="true"
      className={cx(
        choiceTierClass,
        choiceVisualClass,
        styles.control,
        styles.indicator,
        className,
      )}
      {...toDataAttributes({
        size,
        state: indeterminate ? "indeterminate" : checked ? "checked" : "unchecked",
        disabled: disabled || undefined,
      })}
      {...rest}
    >
      <CheckboxMark />
    </span>
  );
}
CheckboxIndicator.displayName = "Checkbox.Indicator";

export const Checkbox = {
  Root: CheckboxRoot,
  Label: CheckboxLabel,
  Indicator: CheckboxIndicator,
};
