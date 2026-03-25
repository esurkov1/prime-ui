import * as React from "react";
import { Hint } from "@/components/hint/Hint";
import { Label } from "@/components/label/Label";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { CheckboxSize, CheckboxVariant, HintSize, LabelSize } from "@/internal/states";

import styles from "./Checkbox.module.css";

type CheckboxContextValue = {
  inputId: string;
  hintId: string;
  errorId: string;
  size: CheckboxSize;
  inputRef: React.Ref<HTMLInputElement>;
  isChecked: boolean;
  invalid: boolean;
  disabled: boolean;
  indeterminate: boolean;
  describedBy: string | undefined;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  restInputPropsRef: React.MutableRefObject<React.InputHTMLAttributes<HTMLInputElement>>;
  registerHint: () => void;
  unregisterHint: () => void;
  registerError: () => void;
  unregisterError: () => void;
};

const [CheckboxProvider, useCheckboxContext] =
  createComponentContext<CheckboxContextValue>("Checkbox");

export type CheckboxRootProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> & {
  variant?: CheckboxVariant;
  size?: CheckboxSize;
  indeterminate?: boolean;
};

const CheckboxRoot = React.forwardRef<HTMLInputElement, CheckboxRootProps>(
  (
    {
      id,
      variant = "default",
      size = "m",
      disabled,
      className,
      checked,
      defaultChecked,
      onChange,
      indeterminate = false,
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

    const [isChecked, setIsChecked] = useControllableState<boolean>({
      value: checked as boolean | undefined,
      defaultValue: Boolean(defaultChecked),
      onChange: undefined,
    });

    const internalRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRefs(internalRef, ref);

    React.useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
        onChange?.(e);
      },
      [onChange, setIsChecked],
    );

    const restInputPropsRef = React.useRef<React.InputHTMLAttributes<HTMLInputElement>>(inputRest);
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

    const showChecked = isChecked && !indeterminate;

    const ctxValue = React.useMemo(
      () => ({
        inputId,
        hintId,
        errorId,
        size,
        inputRef: mergedRef,
        isChecked,
        invalid,
        disabled: Boolean(disabled),
        indeterminate,
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
        mergedRef,
        isChecked,
        invalid,
        disabled,
        indeterminate,
        describedBy,
        handleChange,
        registerHint,
        unregisterHint,
        registerError,
        unregisterError,
      ],
    );

    return (
      <CheckboxProvider value={ctxValue}>
        <ControlSizeProvider value={size}>
          <div
            className={cx(styles.field, className)}
            {...toDataAttributes({
              size,
              variant,
              disabled: Boolean(disabled),
              invalid,
              checked: showChecked,
              indeterminate,
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
    isChecked,
    invalid,
    disabled,
    describedBy,
    handleChange,
    restInputPropsRef,
    size,
  } = useCheckboxContext();

  const filterId = React.useId();
  const svgFilterId = `es-cb-${filterId.replace(/:/g, "")}`;

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
          type="checkbox"
          className={styles.input}
          disabled={disabled}
          checked={isChecked}
          onChange={handleChange}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy || undefined}
          {...restInputPropsRef.current}
        />
        <span className={styles.control} aria-hidden="true">
          <svg viewBox="0 0 16 16" className={styles.svg} aria-hidden="true">
            <defs>
              <filter id={svgFilterId}>
                <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodOpacity="0.12" />
              </filter>
            </defs>
            <rect
              x="0.5"
              y="0.5"
              width="15"
              height="15"
              rx="3.5"
              className={styles.rect}
              filter={`url(#${svgFilterId})`}
            />
            <path d="M4 8l2.5 2.5L12 5" className={styles.checkPath} />
            <line x1="4.5" y1="8" x2="11.5" y2="8" className={styles.indeterminateLine} />
          </svg>
        </span>
      </span>
      {children !== undefined && children !== null ? (
        <span className={styles.text}>{children}</span>
      ) : null}
    </Label.Root>
  );
});

CheckboxLabel.displayName = "CheckboxLabel";

// ─── Hint ────────────────────────────────────────────────────────────────────

export type CheckboxHintProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">;

function CheckboxHint({ children, className, ...rest }: CheckboxHintProps) {
  const { hintId, registerHint, unregisterHint, size, disabled } = useCheckboxContext();

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

CheckboxHint.displayName = "CheckboxHint";

// ─── Error ───────────────────────────────────────────────────────────────────

export type CheckboxErrorProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">;

function CheckboxError({ children, className, ...rest }: CheckboxErrorProps) {
  const { errorId, registerError, unregisterError, size } = useCheckboxContext();

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

CheckboxError.displayName = "CheckboxError";

// ─── Namespace ───────────────────────────────────────────────────────────────

export const Checkbox = {
  Root: CheckboxRoot,
  Label: CheckboxLabel,
  Hint: CheckboxHint,
  Error: CheckboxError,
};
