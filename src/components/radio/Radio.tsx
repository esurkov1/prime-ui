import * as React from "react";
import { Hint } from "@/components/hint/Hint";
import { Label } from "@/components/label/Label";
import { useControllableState } from "@/hooks/useControllableState";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";
import { type FieldDescriptions, useFieldDescriptions } from "@/internal/useFieldDescriptions";

import styles from "./Radio.module.css";

// ─── Group ───────────────────────────────────────────────────────────────────

type RadioGroupContextValue = {
  name: string;
  value: string | undefined;
  setValue: (value: string) => void;
  size: ControlSize;
  disabled: boolean;
  invalid: boolean;
  required: boolean;
  fullWidth: boolean;
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
  /** Invalid state for every radio in the group (`aria-invalid` on the group and inputs). */
  invalid?: boolean;
  /** Native `required` on the radios and `aria-required` on the group. */
  required?: boolean;
  /** `vertical` stacks the options, `horizontal` lays them out in a wrapping row. */
  orientation?: "vertical" | "horizontal";
  /** Stretch every option to the container width. */
  fullWidth?: boolean;
};

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      name: nameProp,
      size = "m",
      disabled = false,
      invalid = false,
      required = false,
      orientation = "vertical",
      fullWidth = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const generatedName = React.useId();
    const name = nameProp ?? generatedName;
    const [value, setValue] = useControllableState<string | undefined>({
      value: valueProp,
      defaultValue,
      onChange: onValueChange as ((value: string | undefined) => void) | undefined,
    });

    const ctxValue = React.useMemo(
      () => ({ name, value, setValue, size, disabled, invalid, required, fullWidth }),
      [name, value, setValue, size, disabled, invalid, required, fullWidth],
    );

    return (
      <RadioGroupProvider value={ctxValue}>
        <div
          ref={ref}
          role="radiogroup"
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          aria-disabled={disabled || undefined}
          aria-orientation={orientation}
          className={cx(styles.group, className)}
          {...toDataAttributes({
            size,
            orientation,
            invalid: invalid || undefined,
            disabled: disabled || undefined,
          })}
          {...rest}
        >
          {children}
        </div>
      </RadioGroupProvider>
    );
  },
);

RadioGroup.displayName = "RadioGroup";

// ─── Item ────────────────────────────────────────────────────────────────────

type InputPassthrough = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "checked" | "defaultChecked" | "onChange" | "name" | "value" | "children"
>;

type RadioContextValue = FieldDescriptions & {
  inputId: string;
  value: string;
  checked: boolean;
  size: ControlSize;
  inputRef: React.Ref<HTMLInputElement>;
  invalid: boolean;
  disabled: boolean;
  inputPropsRef: React.MutableRefObject<InputPassthrough>;
};

const [RadioProvider, useRadioContext] = createComponentContext<RadioContextValue>("Radio");

export type RadioRootProps = InputPassthrough & {
  /** Value reported to `Radio.Group` when this option is chosen. */
  value: string;
  /** Invalid state for this option; also set by the group or a mounted `Radio.Error`. */
  invalid?: boolean;
  children?: React.ReactNode;
};

const RadioRoot = React.forwardRef<HTMLInputElement, RadioRootProps>(
  (
    {
      id,
      value,
      invalid: invalidProp = false,
      disabled: disabledProp = false,
      className,
      "aria-describedby": ariaDescribedBy,
      children,
      ...inputRest
    },
    ref,
  ) => {
    const group = useRadioGroupContext();
    const rawId = React.useId();
    const inputId = id ?? rawId;
    const descriptions = useFieldDescriptions(inputId, ariaDescribedBy);

    const invalid = group.invalid || invalidProp || descriptions.hasError;
    const disabled = group.disabled || disabledProp;
    const checked = group.value === value;

    const inputPropsRef = React.useRef<InputPassthrough>(inputRest);
    inputPropsRef.current = inputRest;

    const ctxValue = React.useMemo(
      () => ({
        ...descriptions,
        inputId,
        value,
        checked,
        size: group.size,
        inputRef: ref,
        invalid,
        disabled,
        inputPropsRef,
      }),
      [descriptions, inputId, value, checked, group.size, ref, invalid, disabled],
    );

    return (
      <RadioProvider value={ctxValue}>
        <ControlSizeProvider value={group.size}>
          <div
            className={cx(styles.field, className)}
            {...toDataAttributes({
              size: group.size,
              state: checked ? "checked" : "unchecked",
              invalid: invalid || undefined,
              disabled: disabled || undefined,
              "full-width": group.fullWidth || undefined,
            })}
          >
            {children}
          </div>
        </ControlSizeProvider>
      </RadioProvider>
    );
  },
);

RadioRoot.displayName = "RadioRoot";

// ─── Label ───────────────────────────────────────────────────────────────────

export type RadioLabelProps = {
  children?: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLLabelElement>, "htmlFor" | "size">;

const RadioLabel = React.forwardRef<HTMLLabelElement, RadioLabelProps>(function RadioLabel(
  { children, className, ...rest },
  ref,
) {
  const group = useRadioGroupContext();
  const { inputId, inputRef, value, checked, invalid, disabled, describedBy, inputPropsRef, size } =
    useRadioContext();

  return (
    <Label.Root
      ref={ref}
      htmlFor={inputId}
      size={size}
      disabled={disabled}
      className={cx(styles.labelRow, className)}
      {...rest}
    >
      <span className={styles.controlCell}>
        <input
          {...inputPropsRef.current}
          ref={inputRef}
          id={inputId}
          type="radio"
          name={group.name}
          value={value}
          checked={checked}
          onChange={() => group.setValue(value)}
          required={group.required || undefined}
          className={styles.input}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />
        <span className={styles.control} aria-hidden="true">
          <span className={styles.dot} />
        </span>
      </span>
      {children != null ? <span className={styles.text}>{children}</span> : null}
    </Label.Root>
  );
});

RadioLabel.displayName = "RadioLabel";

// ─── Hint / Error ────────────────────────────────────────────────────────────

export type RadioHintProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">;

function RadioHint({ children, className, ...rest }: RadioHintProps) {
  const { hintId, registerHint, size, disabled } = useRadioContext();
  React.useLayoutEffect(registerHint, [registerHint]);

  return (
    <Hint.Root
      id={hintId}
      size={size}
      disabled={disabled}
      className={cx(styles.hintSlot, className)}
      {...rest}
    >
      {children}
    </Hint.Root>
  );
}

RadioHint.displayName = "RadioHint";

export type RadioErrorProps = RadioHintProps;

function RadioError({ children, className, ...rest }: RadioErrorProps) {
  const { errorId, registerError, size } = useRadioContext();
  React.useLayoutEffect(registerError, [registerError]);

  return (
    <Hint.Root
      id={errorId}
      size={size}
      invalid
      className={cx(styles.hintSlot, className)}
      {...rest}
    >
      {children}
    </Hint.Root>
  );
}

RadioError.displayName = "RadioError";

export const Radio = {
  Group: RadioGroup,
  Root: RadioRoot,
  Label: RadioLabel,
  Hint: RadioHint,
  Error: RadioError,
};
