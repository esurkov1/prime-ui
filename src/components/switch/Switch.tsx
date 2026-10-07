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

import styles from "./Switch.module.css";

/** True when `type` appears among `children` (fragments are looked into). */
function hasChildOfType(children: React.ReactNode, type: unknown): boolean {
  let found = false;
  React.Children.forEach(children, (child) => {
    if (found || !React.isValidElement(child)) return;
    if (child.type === type) found = true;
    else if (child.type === React.Fragment)
      found = hasChildOfType((child.props as { children?: React.ReactNode }).children, type);
  });
  return found;
}

type InputPassthrough = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "checked" | "defaultChecked" | "onChange" | "children"
>;

type SwitchContextValue = FieldDescriptions & {
  inputId: string;
  size: ControlSize;
  inputRef: React.Ref<HTMLInputElement>;
  checked: boolean;
  invalid: boolean;
  disabled: boolean;
  readOnly: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputPropsRef: React.MutableRefObject<InputPassthrough>;
};

const [SwitchProvider, useSwitchContext] = createComponentContext<SwitchContextValue>("Switch");

export type SwitchRootProps = InputPassthrough & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Invalid state; also set while a `Switch.Error` is mounted. */
  invalid?: boolean;
  size?: ControlSize;
  /** Stretch to the container width. By default the field is as wide as its content. */
  fullWidth?: boolean;
  children?: React.ReactNode;
};

const SwitchRoot = React.forwardRef<HTMLInputElement, SwitchRootProps>(
  (
    {
      id,
      checked: checkedProp,
      defaultChecked = false,
      onCheckedChange,
      invalid: invalidProp = false,
      size = "m",
      fullWidth = false,
      disabled = false,
      readOnly = false,
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

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (readOnly) return;
        setChecked(event.target.checked);
      },
      [readOnly, setChecked],
    );

    const inputPropsRef = React.useRef<InputPassthrough>(inputRest);
    inputPropsRef.current = inputRest;

    const ctxValue = React.useMemo(
      () => ({
        ...descriptions,
        inputId,
        size,
        inputRef: ref,
        checked,
        invalid,
        disabled,
        readOnly,
        handleChange,
        inputPropsRef,
      }),
      [descriptions, inputId, size, ref, checked, invalid, disabled, readOnly, handleChange],
    );

    return (
      <SwitchProvider value={ctxValue}>
        <ControlSizeProvider value={size}>
          <div
            className={cx(styles.field, className)}
            {...toDataAttributes({
              size,
              state: checked ? "checked" : "unchecked",
              invalid: invalid || undefined,
              disabled: disabled || undefined,
              "full-width": fullWidth || undefined,
            })}
          >
            {/* The native input lives in Label; a Root without one still renders the bare control. */}
            {hasChildOfType(children, SwitchLabel) ? null : <SwitchLabel />}
            {children}
          </div>
        </ControlSizeProvider>
      </SwitchProvider>
    );
  },
);

SwitchRoot.displayName = "SwitchRoot";

// ─── Label ───────────────────────────────────────────────────────────────────

export type SwitchLabelProps = {
  children?: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLLabelElement>, "htmlFor" | "size">;

const SwitchLabel = React.forwardRef<HTMLLabelElement, SwitchLabelProps>(function SwitchLabel(
  { children, className, ...rest },
  ref,
) {
  const {
    inputId,
    inputRef,
    checked,
    invalid,
    disabled,
    readOnly,
    describedBy,
    handleChange,
    inputPropsRef,
    size,
  } = useSwitchContext();

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
          className={styles.input}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          aria-checked={checked}
          aria-invalid={invalid || undefined}
          aria-readonly={readOnly || undefined}
          aria-describedby={describedBy}
          onChange={handleChange}
        />
        <span className={styles.track} aria-hidden="true" />
      </span>
      {children != null ? <span className={styles.text}>{children}</span> : null}
    </Label.Root>
  );
});

SwitchLabel.displayName = "SwitchLabel";

// ─── Hint / Error ────────────────────────────────────────────────────────────

export type SwitchHintProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">;

function SwitchHint({ children, className, ...rest }: SwitchHintProps) {
  const { hintId, registerHint, size, disabled } = useSwitchContext();
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

SwitchHint.displayName = "SwitchHint";

export type SwitchErrorProps = SwitchHintProps;

function SwitchError({ children, className, ...rest }: SwitchErrorProps) {
  const { errorId, registerError, size } = useSwitchContext();
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

SwitchError.displayName = "SwitchError";

export const Switch = {
  Root: SwitchRoot,
  Label: SwitchLabel,
  Hint: SwitchHint,
  Error: SwitchError,
};
