import * as React from "react";
import { Hint } from "@/components/hint/Hint";
import { Label } from "@/components/label/Label";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { HintSize, LabelSize, RadioSize, RadioVariant } from "@/internal/states";

import styles from "./Radio.module.css";

type RadioContextValue = {
  inputId: string;
  hintId: string;
  errorId: string;
  size: RadioSize;
  inputRef: React.Ref<HTMLInputElement>;
  invalid: boolean;
  disabled: boolean;
  describedBy: string | undefined;
  restInputPropsRef: React.MutableRefObject<React.InputHTMLAttributes<HTMLInputElement>>;
  registerHint: () => void;
  unregisterHint: () => void;
  registerError: () => void;
  unregisterError: () => void;
};

const [RadioProvider, useRadioContext] = createComponentContext<RadioContextValue>("Radio");

export type RadioRootProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
  variant?: RadioVariant;
  size?: RadioSize;
};

const RadioRoot = React.forwardRef<HTMLInputElement, RadioRootProps>(
  (
    {
      id,
      variant = "default",
      size = "m",
      disabled,
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

    const ctxValue = React.useMemo(
      () => ({
        inputId,
        hintId,
        errorId,
        size,
        inputRef: ref,
        invalid,
        disabled: Boolean(disabled),
        describedBy,
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
        describedBy,
        registerHint,
        unregisterHint,
        registerError,
        unregisterError,
      ],
    );

    return (
      <RadioProvider value={ctxValue}>
        <ControlSizeProvider value={size}>
          <div
            className={cx(styles.field, className)}
            {...toDataAttributes({
              size,
              variant,
              disabled: Boolean(disabled),
              invalid,
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
  const { inputId, inputRef, invalid, disabled, describedBy, restInputPropsRef, size } =
    useRadioContext();

  const filterId = React.useId();
  const svgFilterId = `es-radio-${filterId.replace(/:/g, "")}`;

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
          type="radio"
          className={styles.input}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy || undefined}
          {...restInputPropsRef.current}
        />
        <svg viewBox="0 0 18 18" className={styles.svg} aria-hidden="true">
          <defs>
            <filter id={svgFilterId}>
              <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodOpacity="0.10" />
            </filter>
          </defs>
          <circle
            cx="9"
            cy="9"
            r="8"
            className={styles.outerCircle}
            filter={`url(#${svgFilterId})`}
          />
          <circle cx="9" cy="9" r="4" className={styles.innerCircle} />
        </svg>
      </span>
      {children !== undefined && children !== null ? (
        <span className={styles.text}>{children}</span>
      ) : null}
    </Label.Root>
  );
});

RadioLabel.displayName = "RadioLabel";

// ─── Hint ────────────────────────────────────────────────────────────────────

export type RadioHintProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">;

function RadioHint({ children, className, ...rest }: RadioHintProps) {
  const { hintId, registerHint, unregisterHint, size, disabled } = useRadioContext();

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

RadioHint.displayName = "RadioHint";

// ─── Error ───────────────────────────────────────────────────────────────────

export type RadioErrorProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">;

function RadioError({ children, className, ...rest }: RadioErrorProps) {
  const { errorId, registerError, unregisterError, size } = useRadioContext();

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

RadioError.displayName = "RadioError";

// ─── Namespace ───────────────────────────────────────────────────────────────

export const Radio = {
  Root: RadioRoot,
  Label: RadioLabel,
  Hint: RadioHint,
  Error: RadioError,
};
