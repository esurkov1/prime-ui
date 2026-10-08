import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import {
  ChoiceField,
  ChoiceLabel,
  type ChoiceLabelProps,
  choiceInputClass,
  choiceVisualClass,
} from "@/internal/ChoiceField";
import { ControlSizeProvider, useControlSize } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { FieldFrame, type FieldRootDomProps, useFieldFrame } from "@/internal/FieldFrame";
import type { ControlSize } from "@/internal/states";

import styles from "./Radio.module.css";

export type RadioGroupLabels = {
  /** Muted marker after the group label when `optional`. */
  optional: string;
};

const RADIO_GROUP_LABELS: RadioGroupLabels = { optional: "необязательно" };

// ─── Group ───────────────────────────────────────────────────────────────────

type RadioGroupContextValue = {
  name: string;
  value: string | undefined;
  setValue: (value: string) => void;
  size: ControlSize;
  disabled: boolean;
  invalid: boolean;
  required: boolean;
};

const [RadioGroupProvider, useRadioGroupContext] =
  createComponentContext<RadioGroupContextValue>("Radio.Group");

export type RadioGroupProps = Omit<FieldRootDomProps, "dir"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Native `name` shared by the radios; generated when omitted. */
  name?: string;
  /** Tier. Default: the tier of the surrounding control (a form, a panel), else `m`. */
  size?: ControlSize;
  disabled?: boolean;
  /** Group heading above the options; names the radiogroup (`aria-labelledby`). */
  label?: React.ReactNode;
  /** Red `*` after the label, native `required` on the radios, `aria-required` on the group. */
  required?: boolean;
  /** Muted `labels.optional` marker after the label. */
  optional?: boolean;
  /** Help text under the options. Hidden while `error` is shown. */
  hint?: React.ReactNode;
  /** Error message under the options; implies `invalid`. */
  error?: React.ReactNode;
  /** Invalid state for every radio (`aria-invalid` on the group and the inputs). */
  invalid?: boolean;
  /** `vertical` stacks the options, `horizontal` lays them out in a wrapping row. */
  orientation?: "vertical" | "horizontal";
  /** Id of the `role="radiogroup"` element; generated when omitted. */
  id?: string;
  labels?: Partial<RadioGroupLabels>;
  /** `Radio.Root` options. */
  children?: React.ReactNode;
};

/**
 * The field: label · radiogroup · hint or error. `className`, `ref` and the rest go to the frame,
 * `id` and the `aria-label*` / `aria-describedby` names to the radiogroup.
 */
function RadioGroup({
  id,
  value: valueProp,
  defaultValue,
  onValueChange,
  name: nameProp,
  size: sizeProp,
  disabled = false,
  label,
  required = false,
  optional = false,
  hint,
  error,
  invalid,
  orientation = "vertical",
  labels: labelsProp,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
  children,
  ...rest
}: RadioGroupProps) {
  const size = useControlSize(sizeProp);
  const ids = useFieldFrame(id, { label, hint, error, invalid }, ariaDescribedBy);
  const name = nameProp ?? ids.controlId;
  const reportChange = React.useCallback(
    (next: string | undefined) => {
      if (next !== undefined) onValueChange?.(next);
    },
    [onValueChange],
  );
  const [value, setValue] = useControllableState<string | undefined>({
    value: valueProp,
    defaultValue,
    onChange: reportChange,
  });

  const ctxValue = React.useMemo(
    () => ({ name, value, setValue, size, disabled, invalid: ids.invalid, required }),
    [name, value, setValue, size, disabled, ids.invalid, required],
  );

  return (
    <RadioGroupProvider value={ctxValue}>
      <ControlSizeProvider value={size}>
        <FieldFrame
          {...rest}
          size={size}
          ids={ids}
          label={label}
          required={required}
          optional={optional}
          hint={hint}
          error={error}
          disabled={disabled}
          optionalLabel={labelsProp?.optional ?? RADIO_GROUP_LABELS.optional}
          group
          className={className}
        >
          <div
            id={ids.controlId}
            role="radiogroup"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy ?? ids.labelledBy}
            aria-describedby={ids.describedBy}
            aria-invalid={ids.invalid || undefined}
            aria-required={required || undefined}
            aria-orientation={orientation}
            className={styles.group}
            {...toDataAttributes({ size, orientation })}
          >
            {children}
          </div>
        </FieldFrame>
      </ControlSizeProvider>
    </RadioGroupProvider>
  );
}
RadioGroup.displayName = "Radio.Group";

// ─── Item ────────────────────────────────────────────────────────────────────

export type RadioRootProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "checked" | "defaultChecked" | "onChange" | "name" | "value"
> & {
  /** Value reported to `Radio.Group` when this option is chosen. */
  value: string;
  /** Description under the option text. */
  hint?: React.ReactNode;
  /** `Radio.Label`; without it only the circle renders (give it an `aria-label`). */
  children?: React.ReactNode;
  /** The native radio input. */
  ref?: React.Ref<HTMLInputElement>;
};

function RadioRoot({
  id,
  value,
  hint,
  disabled: disabledProp = false,
  className,
  "aria-describedby": ariaDescribedBy,
  children,
  ref,
  ...inputRest
}: RadioRootProps) {
  const group = useRadioGroupContext();
  const ids = useFieldFrame(id, { hint, invalid: group.invalid }, ariaDescribedBy);
  const disabled = group.disabled || disabledProp;
  const checked = group.value === value;

  return (
    <ChoiceField
      ids={ids}
      size={group.size}
      state={checked ? "checked" : "unchecked"}
      disabled={disabled}
      hint={hint}
      className={cx(styles.root, className)}
      control={
        <>
          <input
            {...inputRest}
            ref={ref}
            id={ids.controlId}
            type="radio"
            name={group.name}
            value={value}
            checked={checked}
            onChange={() => group.setValue(value)}
            required={group.required || undefined}
            className={choiceInputClass}
            disabled={disabled}
            aria-invalid={ids.invalid || undefined}
            aria-describedby={ids.describedBy}
          />
          <span className={cx(choiceVisualClass, styles.control)} aria-hidden="true">
            <span className={styles.dot} />
          </span>
        </>
      }
    >
      {children}
    </ChoiceField>
  );
}
RadioRoot.displayName = "Radio.Root";

export type RadioLabelProps = ChoiceLabelProps;

function RadioLabel(props: RadioLabelProps) {
  return <ChoiceLabel {...props} />;
}
RadioLabel.displayName = "Radio.Label";

export const Radio = {
  Group: RadioGroup,
  Root: RadioRoot,
  Label: RadioLabel,
};
