import * as React from "react";
import { Hint } from "@/components/hint/Hint";
import { useFieldIds } from "@/hooks/useFieldIds";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { HintSize, InputSize } from "@/internal/states";

import composableStyles from "./Input.module.css";

// ─── Composable API ──────────────────────────────────────────────────────────

type InputContextValue = {
  size: InputSize;
  hasError: boolean;
  inputId: string;
  describedBy: string | undefined;
};

const [InputProvider, useInputContext] = createComponentContext<InputContextValue>("Input");

// ---- InputRoot ----

export type InputRootProps = {
  size?: InputSize;
  /** Mark the field as invalid visually and propagate aria-invalid to the input. */
  hasError?: boolean;
  label?: React.ReactNode;
  optionalLabel?: React.ReactNode;
  hint?: React.ReactNode;
  /** Error message rendered below the field; also sets hasError=true. */
  error?: React.ReactNode;
  /** Explicit id for the underlying <input>; auto-generated if omitted. */
  id?: string;
  children: React.ReactNode;
  className?: string;
};

function InputRoot({
  size = "m",
  hasError: hasErrorProp = false,
  label,
  optionalLabel,
  hint,
  error,
  id,
  children,
  className,
}: InputRootProps) {
  const hasError = hasErrorProp || Boolean(error);
  const { inputId, hintId, errorId, describedBy } = useFieldIds(id, {
    hasHint: Boolean(hint),
    hasError: Boolean(error),
  });

  return (
    <InputProvider value={{ size, hasError, inputId, describedBy }}>
      <ControlSizeProvider value={size}>
        <div className={cx(composableStyles.root, className)} {...toDataAttributes({ size })}>
          {(label != null || optionalLabel != null) && (
            <div className={composableStyles.header}>
              {label != null ? (
                <label htmlFor={inputId} className={composableStyles.label}>
                  {label}
                </label>
              ) : (
                <span />
              )}
              {optionalLabel != null && (
                <span className={composableStyles.optionalLabel}>{optionalLabel}</span>
              )}
            </div>
          )}
          {children}
          {(hint != null || error != null) && (
            <div className={composableStyles.meta}>
              {hint != null && (
                <Hint.Root
                  id={hintId}
                  size={size as HintSize}
                  className={composableStyles.metaHint}
                >
                  {hint}
                </Hint.Root>
              )}
              {error != null && (
                <Hint.Root
                  id={errorId}
                  size={size as HintSize}
                  variant="error"
                  className={composableStyles.metaHint}
                >
                  {error}
                </Hint.Root>
              )}
            </div>
          )}
        </div>
      </ControlSizeProvider>
    </InputProvider>
  );
}
InputRoot.displayName = "Input.Root";

// ---- InputWrapper ----

export type InputWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

function InputWrapper({ children, className }: InputWrapperProps) {
  const { size, hasError } = useInputContext();

  return (
    <div
      className={cx(composableStyles.wrapper, className)}
      {...toDataAttributes({ size, "has-error": hasError })}
    >
      {children}
    </div>
  );
}
InputWrapper.displayName = "Input.Wrapper";

// ---- InputField ----

export type InputFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">;

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, "aria-describedby": ariaDescribedBy, ...rest }, ref) => {
    const { inputId, hasError, describedBy } = useInputContext();

    const resolvedDescribedBy =
      [ariaDescribedBy, describedBy].filter(Boolean).join(" ") || undefined;

    return (
      <input
        ref={ref}
        id={inputId}
        className={cx(composableStyles.field, className)}
        aria-invalid={hasError || undefined}
        aria-describedby={resolvedDescribedBy}
        {...rest}
      />
    );
  },
);
InputField.displayName = "Input.Field";

// ---- InputIcon ----

export type InputIconProps = {
  side: "start" | "end";
  children: React.ReactNode;
  className?: string;
};

function InputIcon({ side, children, className }: InputIconProps) {
  return (
    <span className={cx(composableStyles.icon, className)} data-side={side} aria-hidden="true">
      {children}
    </span>
  );
}
InputIcon.displayName = "Input.Icon";

// ---- InputAffix ----

export type InputAffixProps = {
  side: "start" | "end";
  children: React.ReactNode;
  className?: string;
};

function InputAffix({ side, children, className }: InputAffixProps) {
  return (
    <div className={cx(composableStyles.affix, className)} data-side={side} aria-hidden="true">
      {children}
    </div>
  );
}
InputAffix.displayName = "Input.Affix";

// ---- InputInlineAffix ----

export type InputInlineAffixProps = {
  side: "start" | "end";
  children: React.ReactNode;
  className?: string;
};

function InputInlineAffix({ side, children, className }: InputInlineAffixProps) {
  return (
    <span
      className={cx(composableStyles.inlineAffix, className)}
      data-side={side}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
InputInlineAffix.displayName = "Input.InlineAffix";

// ---- Namespace export ----

export const Input = {
  Root: InputRoot,
  Wrapper: InputWrapper,
  Field: InputField,
  Icon: InputIcon,
  Affix: InputAffix,
  InlineAffix: InputInlineAffix,
};

// Export context hook for advanced consumers (e.g. custom sub-components)
export { useInputContext };
