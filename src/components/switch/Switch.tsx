import * as React from "react";
import { Hint } from "@/components/hint/Hint";
import { Label } from "@/components/label/Label";
import { useControllableState } from "@/hooks/useControllableState";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { HintSize, LabelSize, SwitchSize, SwitchVariant } from "@/internal/states";

import styles from "./Switch.module.css";

type SwitchContextValue = {
  inputId: string;
  hintId: string;
  errorId: string;
  size: SwitchSize;
  inputRef: React.Ref<HTMLInputElement>;
  invalid: boolean;
  disabled: boolean;
  readOnly: boolean;
  isChecked: boolean;
  describedBy: string | undefined;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  restInputPropsRef: React.MutableRefObject<
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "type" | "checked" | "defaultChecked" | "onChange"
    >
  >;
  registerHint: () => void;
  unregisterHint: () => void;
  registerError: () => void;
  unregisterError: () => void;
};

const [SwitchProvider, useSwitchContext] = createComponentContext<SwitchContextValue>("Switch");

export type SwitchRootProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "checked" | "defaultChecked" | "onChange"
> & {
  label?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  variant?: SwitchVariant;
  size?: SwitchSize;
};

const SwitchRoot = React.forwardRef<HTMLInputElement, SwitchRootProps>(
  (
    {
      id,
      checked,
      defaultChecked = false,
      onCheckedChange,
      variant = "default",
      size = "m",
      disabled,
      readOnly,
      className,
      "aria-describedby": ariaDescribedBy,
      children,
      ...inputRest
    },
    ref,
  ) => {
    const rawId = React.useId();
    const inputId = id ?? rawId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    const [hasHint, setHasHint] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);

    const invalid = variant === "error" || hasError;

    const [isChecked, setChecked] = useControllableState<boolean>({
      value: checked,
      defaultValue: defaultChecked,
      onChange: onCheckedChange,
    });

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (readOnly) {
          e.preventDefault();
          return;
        }
        setChecked(e.target.checked);
      },
      [readOnly, setChecked],
    );

    const restInputPropsRef = React.useRef(inputRest);
    restInputPropsRef.current = inputRest;

    const parts = [
      ariaDescribedBy,
      hasHint ? hintId : undefined,
      hasError ? errorId : undefined,
    ].filter(Boolean);
    const describedBy = parts.length > 0 ? parts.join(" ") : undefined;

    const registerHint = React.useCallback(() => setHasHint(true), []);
    const unregisterHint = React.useCallback(() => setHasHint(false), []);
    const registerError = React.useCallback(() => setHasError(true), []);
    const unregisterError = React.useCallback(() => setHasError(false), []);

    const ctxValue = React.useMemo(
      () => ({
        inputId,
        hintId,
        errorId,
        size,
        inputRef: ref,
        invalid,
        disabled: Boolean(disabled),
        readOnly: Boolean(readOnly),
        isChecked,
        describedBy,
        handleChange,
        restInputPropsRef,
        registerHint,
        unregisterHint,
        registerError,
        unregisterError,
      }),
      [
        inputId,
        hintId,
        errorId,
        size,
        ref,
        invalid,
        disabled,
        readOnly,
        isChecked,
        describedBy,
        handleChange,
        registerHint,
        unregisterHint,
        registerError,
        unregisterError,
      ],
    );

    return (
      <SwitchProvider value={ctxValue}>
        <ControlSizeProvider value={size}>
          <div
            className={cx(styles.field, className)}
            {...toDataAttributes({
              size,
              variant,
              disabled: Boolean(disabled),
              invalid,
              checked: isChecked,
              readonly: Boolean(readOnly),
            })}
          >
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
    invalid,
    disabled,
    readOnly,
    isChecked,
    describedBy,
    handleChange,
    restInputPropsRef,
    size,
  } = useSwitchContext();

  return (
    <Label.Root
      ref={ref}
      htmlFor={inputId}
      size={size as LabelSize}
      disabled={disabled}
      className={cx(styles.labelRow, className)}
      {...rest}
    >
      <span className={styles.controlCell}>
        <input
          ref={inputRef}
          id={inputId}
          className={styles.input}
          type="checkbox"
          role="switch"
          checked={isChecked}
          disabled={disabled}
          aria-checked={isChecked}
          aria-invalid={invalid || undefined}
          aria-readonly={readOnly || undefined}
          aria-describedby={describedBy}
          onChange={handleChange}
          {...restInputPropsRef.current}
        />
        <span className={styles.track} aria-hidden="true" />
      </span>
      {children !== undefined && children !== null ? (
        <span className={styles.text}>{children}</span>
      ) : null}
    </Label.Root>
  );
});

SwitchLabel.displayName = "SwitchLabel";

// ─── Hint ────────────────────────────────────────────────────────────────────

export type SwitchHintProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">;

function SwitchHint({ children, className, ...rest }: SwitchHintProps) {
  const { hintId, registerHint, unregisterHint, size, disabled } = useSwitchContext();

  React.useLayoutEffect(() => {
    registerHint();
    return () => {
      unregisterHint();
    };
  }, [registerHint, unregisterHint]);

  return (
    <Hint.Root
      id={hintId}
      size={size as HintSize}
      variant={disabled ? "disabled" : "default"}
      className={cx(styles.hintSlot, className)}
      {...rest}
    >
      {children}
    </Hint.Root>
  );
}

SwitchHint.displayName = "SwitchHint";

// ─── Error ───────────────────────────────────────────────────────────────────

export type SwitchErrorProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">;

function SwitchError({ children, className, ...rest }: SwitchErrorProps) {
  const { errorId, registerError, unregisterError, size } = useSwitchContext();

  React.useLayoutEffect(() => {
    registerError();
    return () => {
      unregisterError();
    };
  }, [registerError, unregisterError]);

  return (
    <Hint.Root
      id={errorId}
      size={size as HintSize}
      variant="error"
      className={cx(styles.hintSlot, className)}
      {...rest}
    >
      {children}
    </Hint.Root>
  );
}

SwitchError.displayName = "SwitchError";

// ─── Namespace ───────────────────────────────────────────────────────────────

export const Switch = {
  Root: SwitchRoot,
  Label: SwitchLabel,
  Hint: SwitchHint,
  Error: SwitchError,
};
