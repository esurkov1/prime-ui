import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import {
  ChoiceField,
  ChoiceLabel,
  type ChoiceLabelProps,
  choiceInputClass,
} from "@/internal/ChoiceField";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { FieldFrame, useFieldFrame } from "@/internal/FieldFrame";
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

export type RadioGroupProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange" | "dir"
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Native `name` shared by the radios; generated when omitted. */
  name?: string;
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
  labels?: Partial<RadioGroupLabels>;
};

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      id,
      value: valueProp,
      defaultValue,
      onValueChange,
      name: nameProp,
      size = "m",
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
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": ariaLabelledBy,
      children,
      ...rest
    },
    ref,
  ) => {
    const ids = useFieldFrame(id, { hint, error, invalid }, ariaDescribedBy);
    const name = nameProp ?? ids.controlId;
    const [value, setValue] = useControllableState<string | undefined>({
      value: valueProp,
      defaultValue,
      onChange: onValueChange as ((value: string | undefined) => void) | undefined,
    });

    const ctxValue = React.useMemo(
      () => ({ name, value, setValue, size, disabled, invalid: ids.invalid, required }),
      [name, value, setValue, size, disabled, ids.invalid, required],
    );

    return (
      <RadioGroupProvider value={ctxValue}>
        <ControlSizeProvider value={size}>
          <FieldFrame
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
              ref={ref}
              id={ids.controlId}
              role="radiogroup"
              aria-labelledby={ariaLabelledBy ?? (label != null ? ids.labelId : undefined)}
              aria-describedby={ids.describedBy}
              aria-invalid={ids.invalid || undefined}
              aria-required={required || undefined}
              aria-disabled={disabled || undefined}
              aria-orientation={orientation}
              className={styles.group}
              {...toDataAttributes({ size, orientation })}
              {...rest}
            >
              {children}
            </div>
          </FieldFrame>
        </ControlSizeProvider>
      </RadioGroupProvider>
    );
  },
);
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
};

const RadioRoot = React.forwardRef<HTMLInputElement, RadioRootProps>(
  (
    {
      id,
      value,
      hint,
      disabled: disabledProp = false,
      className,
      "aria-describedby": ariaDescribedBy,
      children,
      ...inputRest
    },
    ref,
  ) => {
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
            <span className={styles.control} aria-hidden="true">
              <span className={styles.dot} />
            </span>
          </>
        }
      >
        {children}
      </ChoiceField>
    );
  },
);
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
