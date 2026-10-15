import * as React from "react";
import type { HintTone } from "@/components/hint/Hint";

import { useControllableState } from "@/hooks/useControllableState";
import {
  ChoiceField,
  ChoiceLabel,
  type ChoiceLabelProps,
  choiceBoxClass,
  choiceInputClass,
  choiceVisualClass,
} from "@/internal/ChoiceField";
import { useHostTier } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import { FieldFrame, type FieldRootDomProps, useFieldFrame } from "@/internal/FieldFrame";
import { useLabels } from "@/internal/labels";
import type { ControlSize } from "@/internal/states";

import styles from "./Radio.module.css";

export type RadioGroupLabels = {
  /** Muted marker after the group label when `optional`. */
  optional: string;
};

export const RADIO_GROUP_LABELS: RadioGroupLabels = { optional: "необязательно" };

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
  name?: string;
  size?: ControlSize;
  disabled?: boolean;
  label?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  hint?: React.ReactNode;
  hintTone?: HintTone;
  error?: React.ReactNode;
  invalid?: boolean;
  orientation?: "vertical" | "horizontal";
  id?: string;
  labels?: Partial<RadioGroupLabels>;
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
  disabled: disabledProp = false,
  label,
  required = false,
  optional = false,
  hint,
  hintTone,
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
  const tier = useHostTier(sizeProp);
  const size = tier.size;
  const labels = useLabels(RADIO_GROUP_LABELS, labelsProp);
  const disabled = useInheritedDisabled(disabledProp);
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
      {tier.provide(
        <FieldFrame
          {...rest}
          size={size}
          ids={ids}
          label={label}
          required={required}
          optional={optional}
          hint={hint}
          hintTone={hintTone}
          error={error}
          disabled={disabled}
          optionalLabel={labels.optional}
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
        </FieldFrame>,
      )}
    </RadioGroupProvider>
  );
}
RadioGroup.displayName = "Radio.Group";

// ─── Item ────────────────────────────────────────────────────────────────────

export type RadioRootProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "checked" | "defaultChecked" | "onChange" | "name" | "value"
> & {
  value: string;
  hint?: React.ReactNode;
  hintTone?: HintTone;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
};

function RadioRoot({
  id,
  value,
  hint,
  hintTone,
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
      groupOption
      hint={hint}
      hintTone={hintTone}
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
          <span
            className={cx(choiceVisualClass, choiceBoxClass, styles.control)}
            aria-hidden="true"
          >
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
