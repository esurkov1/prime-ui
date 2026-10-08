import type * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import {
  ChoiceField,
  ChoiceLabel,
  type ChoiceLabelProps,
  choiceInputClass,
  choiceVisualClass,
} from "@/internal/ChoiceField";
import { useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { useFieldFrame } from "@/internal/FieldFrame";
import type { ControlSize } from "@/internal/states";

import styles from "./Switch.module.css";

export type SwitchRootProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "checked" | "defaultChecked" | "onChange"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Invalid state; a non-empty `error` implies it. */
  invalid?: boolean;
  /** Help text under the label text. Hidden while `error` is shown. */
  hint?: React.ReactNode;
  /** Error message in the hint slot; implies `invalid`. */
  error?: React.ReactNode;
  /** Tier. Default: the tier of the surrounding control (a form, a panel), else `m`. */
  size?: ControlSize;
  /** `Switch.Label`; without it only the track renders (give it an `aria-label`). */
  children?: React.ReactNode;
  /** The native `role="switch"` input. */
  ref?: React.Ref<HTMLInputElement>;
};

function SwitchRoot({
  id,
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
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
}: SwitchRootProps) {
  const size = useControlSize(sizeProp);
  const ids = useFieldFrame(id, { hint, error, invalid }, ariaDescribedBy);
  const [checked, setChecked] = useControllableState<boolean>({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  return (
    <ChoiceField
      ids={ids}
      size={size}
      state={checked ? "checked" : "unchecked"}
      disabled={disabled}
      readOnly={readOnly}
      hint={hint}
      error={error}
      className={cx(styles.root, className)}
      control={
        <>
          <input
            {...inputRest}
            ref={ref}
            id={ids.controlId}
            className={choiceInputClass}
            type="checkbox"
            // biome-ignore lint/a11y/useAriaPropsForRole: a native checkbox exposes its checked state to role="switch"; an aria-checked copy could drift
            role="switch"
            checked={checked}
            disabled={disabled}
            aria-invalid={ids.invalid || undefined}
            aria-readonly={readOnly || undefined}
            aria-describedby={ids.describedBy}
            onChange={(event) => {
              if (!readOnly) setChecked(event.target.checked);
            }}
          />
          <span className={cx(choiceVisualClass, styles.track)} aria-hidden="true" />
        </>
      }
    >
      {children}
    </ChoiceField>
  );
}
SwitchRoot.displayName = "Switch.Root";

export type SwitchLabelProps = ChoiceLabelProps;

function SwitchLabel(props: SwitchLabelProps) {
  return <ChoiceLabel {...props} />;
}
SwitchLabel.displayName = "Switch.Label";

export const Switch = {
  Root: SwitchRoot,
  Label: SwitchLabel,
};
