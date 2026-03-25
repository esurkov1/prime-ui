import * as React from "react";
import { Hint } from "@/components/hint/Hint";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { HintSize, TextareaSize, TextareaVariant } from "@/internal/states";

import styles from "./Textarea.module.css";

// ─── Context ──────────────────────────────────────────────────────────────────

type TextareaContextValue = {
  hintId: string;
  errorId: string;
  size: TextareaSize;
  disabled: boolean;
  readOnly: boolean;
  registerHint: () => void;
  unregisterHint: () => void;
  registerError: () => void;
  unregisterError: () => void;
};

const [TextareaProvider, useTextareaContext] =
  createComponentContext<TextareaContextValue>("Textarea");

// ─── Char counter (объявлен до Root для partition по child.type) ──────────────

export type TextareaCharCounterProps = {
  current: number;
  max: number;
};

function TextareaCharCounter({ current, max }: TextareaCharCounterProps) {
  const overflow = current > max;
  return (
    <span
      className={styles.charCounter}
      data-overflow={overflow ? "true" : undefined}
      aria-live="polite"
    >
      {current}/{max}
    </span>
  );
}

TextareaCharCounter.displayName = "Textarea.CharCounter";

function partitionTextareaChildren(children: React.ReactNode) {
  const counters: React.ReactElement[] = [];
  const rest: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === TextareaCharCounter) {
      counters.push(child);
    } else if (child != null && child !== false) {
      rest.push(child);
    }
  });

  return { counters, rest };
}

// ─── Root ────────────────────────────────────────────────────────────────────

export type TextareaRootProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> & {
  variant?: TextareaVariant;
  size?: TextareaSize;
  autoResize?: boolean;
};

const TextareaRoot = React.forwardRef<HTMLTextAreaElement, TextareaRootProps>(
  (
    {
      id,
      className,
      variant = "default",
      size = "m",
      disabled,
      readOnly,
      autoResize = true,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      defaultValue,
      value,
      onInput,
      children,
      ...rest
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
    const resolvedAriaInvalid = ariaInvalid ?? (invalid || undefined);

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

    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const { counters: counterChildren, rest: otherChildren } = partitionTextareaChildren(children);
    const showFooter = counterChildren.length > 0;

    // Sync initial value from DOM — handles both controlled and uncontrolled
    React.useLayoutEffect(() => {
      if (!autoResize || !wrapperRef.current) return;
      const textarea = wrapperRef.current.querySelector("textarea");
      if (textarea) {
        wrapperRef.current.dataset.value = textarea.value;
      }
    }, [autoResize]);

    // Sync controlled value changes that happen outside of user input
    React.useEffect(() => {
      if (!autoResize || !wrapperRef.current || typeof value !== "string") return;
      wrapperRef.current.dataset.value = value;
    }, [autoResize, value]);

    const handleInput = React.useCallback<
      NonNullable<React.TextareaHTMLAttributes<HTMLTextAreaElement>["onInput"]>
    >(
      (e) => {
        if (autoResize && wrapperRef.current) {
          wrapperRef.current.dataset.value = (e.currentTarget as HTMLTextAreaElement).value;
        }
        onInput?.(e);
      },
      [autoResize, onInput],
    );

    const ctxValue = React.useMemo(
      () => ({
        hintId,
        errorId,
        size,
        disabled: Boolean(disabled),
        readOnly: Boolean(readOnly),
        registerHint,
        unregisterHint,
        registerError,
        unregisterError,
      }),
      [
        hintId,
        errorId,
        size,
        disabled,
        readOnly,
        registerHint,
        unregisterHint,
        registerError,
        unregisterError,
      ],
    );

    const textareaEl = (
      <textarea
        ref={ref}
        id={inputId}
        className={cx(styles.textarea, autoResize && styles.textareaAutoResize)}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={resolvedAriaInvalid}
        aria-describedby={describedBy}
        defaultValue={defaultValue}
        value={value}
        onInput={handleInput}
        {...rest}
      />
    );

    const textareaBlock = autoResize ? (
      <div ref={wrapperRef} className={styles.autoResize}>
        {textareaEl}
      </div>
    ) : (
      textareaEl
    );

    return (
      <TextareaProvider value={ctxValue}>
        <ControlSizeProvider value={size}>
          <div className={styles.field} {...toDataAttributes({ size })}>
            <label
              htmlFor={inputId}
              className={cx(styles.control, className)}
              {...toDataAttributes({
                invalid,
                disabled: Boolean(disabled),
                readonly: Boolean(readOnly),
                size,
              })}
            >
              <div className={styles.controlStack}>
                <div className={styles.textareaRegion}>{textareaBlock}</div>
                {showFooter ? <div className={styles.controlFooter}>{counterChildren}</div> : null}
              </div>
            </label>
            {otherChildren}
          </div>
        </ControlSizeProvider>
      </TextareaProvider>
    );
  },
);

TextareaRoot.displayName = "Textarea.Root";

// ─── Hint ────────────────────────────────────────────────────────────────────

export type TextareaHintProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">;

function TextareaHint({ children, className, ...rest }: TextareaHintProps) {
  const { hintId, registerHint, unregisterHint, size, disabled, readOnly } = useTextareaContext();

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
      variant={disabled || readOnly ? "disabled" : "default"}
      className={cx(styles.hintSlot, className)}
      {...rest}
    >
      {children}
    </Hint.Root>
  );
}

TextareaHint.displayName = "Textarea.Hint";

// ─── Error ───────────────────────────────────────────────────────────────────

export type TextareaErrorProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">;

function TextareaError({ children, className, ...rest }: TextareaErrorProps) {
  const { errorId, registerError, unregisterError, size } = useTextareaContext();

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

TextareaError.displayName = "Textarea.Error";

// ─── Namespace ───────────────────────────────────────────────────────────────

export const Textarea = {
  Root: TextareaRoot,
  CharCounter: TextareaCharCounter,
  Hint: TextareaHint,
  Error: TextareaError,
};
