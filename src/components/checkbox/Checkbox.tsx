import * as React from "react";
import { Hint } from "@/components/hint/Hint";
import { Label } from "@/components/label/Label";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";
import { type FieldDescriptions, useFieldDescriptions } from "@/internal/useFieldDescriptions";

import styles from "./Checkbox.module.css";

type InputPassthrough = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "checked" | "defaultChecked" | "onChange" | "children"
>;

type CheckboxContextValue = FieldDescriptions & {
  inputId: string;
  size: ControlSize;
  inputRef: React.Ref<HTMLInputElement>;
  checked: boolean;
  invalid: boolean;
  disabled: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputPropsRef: React.MutableRefObject<InputPassthrough>;
};

const [CheckboxProvider, useCheckboxContext] =
  createComponentContext<CheckboxContextValue>("Checkbox");

export type CheckboxRootProps = InputPassthrough & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Mixed state (e.g. «select all» with a partial selection); wins over `checked` visually. */
  indeterminate?: boolean;
  /** Invalid state; also set while a `Checkbox.Error` is mounted. */
  invalid?: boolean;
  size?: ControlSize;
  /** Stretch to the container width. By default the field is as wide as its content. */
  fullWidth?: boolean;
  children?: React.ReactNode;
};

const CheckboxRoot = React.forwardRef<HTMLInputElement, CheckboxRootProps>(
  (
    {
      id,
      checked: checkedProp,
      defaultChecked = false,
      onCheckedChange,
      indeterminate = false,
      invalid: invalidProp = false,
      size = "m",
      fullWidth = false,
      disabled = false,
      className,
      "aria-describedby": ariaDescribedBy,
      children,
      ...inputRest
    },
    ref,
  ) => {
    const rawId = React.useId();
    const inputId = id ?? rawId;
    const descriptions = useFieldDescriptions(inputId, ariaDescribedBy);
    const invalid = invalidProp || descriptions.hasError;

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

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => setChecked(event.target.checked),
      [setChecked],
    );

    const inputPropsRef = React.useRef<InputPassthrough>(inputRest);
    inputPropsRef.current = inputRest;

    const ctxValue = React.useMemo(
      () => ({
        ...descriptions,
        inputId,
        size,
        inputRef: mergedRef,
        checked,
        invalid,
        disabled,
        handleChange,
        inputPropsRef,
      }),
      [descriptions, inputId, size, mergedRef, checked, invalid, disabled, handleChange],
    );

    return (
      <CheckboxProvider value={ctxValue}>
        <ControlSizeProvider value={size}>
          <div
            className={cx(styles.field, className)}
            {...toDataAttributes({
              size,
              state: indeterminate ? "indeterminate" : checked ? "checked" : "unchecked",
              invalid: invalid || undefined,
              disabled: disabled || undefined,
              "full-width": fullWidth || undefined,
            })}
          >
            {children}
          </div>
        </ControlSizeProvider>
      </CheckboxProvider>
    );
  },
);

CheckboxRoot.displayName = "CheckboxRoot";

// ─── Label ───────────────────────────────────────────────────────────────────

export type CheckboxLabelProps = {
  children?: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLLabelElement>, "htmlFor" | "size">;

const CheckboxLabel = React.forwardRef<HTMLLabelElement, CheckboxLabelProps>(function CheckboxLabel(
  { children, className, ...rest },
  ref,
) {
  const {
    inputId,
    inputRef,
    checked,
    invalid,
    disabled,
    describedBy,
    handleChange,
    inputPropsRef,
    size,
  } = useCheckboxContext();

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
          type="checkbox"
          className={styles.input}
          disabled={disabled}
          checked={checked}
          onChange={handleChange}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />
        <span className={styles.control} aria-hidden="true">
          <svg viewBox="0 0 24 24" className={styles.svg} aria-hidden="true" focusable="false">
            <path d="M5.5 12.5l4.25 4.25L18.5 8" pathLength={1} className={styles.checkPath} />
            <path d="M7 12h10" pathLength={1} className={styles.indeterminateLine} />
          </svg>
        </span>
      </span>
      {children != null ? <span className={styles.text}>{children}</span> : null}
    </Label.Root>
  );
});

CheckboxLabel.displayName = "CheckboxLabel";

// ─── Hint / Error ────────────────────────────────────────────────────────────

export type CheckboxHintProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">;

function CheckboxHint({ children, className, ...rest }: CheckboxHintProps) {
  const { hintId, registerHint, size, disabled } = useCheckboxContext();
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

CheckboxHint.displayName = "CheckboxHint";

export type CheckboxErrorProps = CheckboxHintProps;

function CheckboxError({ children, className, ...rest }: CheckboxErrorProps) {
  const { errorId, registerError, size } = useCheckboxContext();
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

CheckboxError.displayName = "CheckboxError";

export const Checkbox = {
  Root: CheckboxRoot,
  Label: CheckboxLabel,
  Hint: CheckboxHint,
  Error: CheckboxError,
};
