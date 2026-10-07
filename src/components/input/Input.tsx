import * as React from "react";
import { Badge } from "@/components/badge/Badge";
import { Hint } from "@/components/hint/Hint";
import { Label } from "@/components/label/Label";
import { useFieldIds } from "@/hooks/useFieldIds";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize, PaletteColor } from "@/internal/states";

import composableStyles from "./Input.module.css";

// ─── Composable API ──────────────────────────────────────────────────────────

export type InputLabels = {
  /** Muted marker after the label when `optional`. */
  optional: string;
  /** Accessible name of `Input.ClearButton`. */
  clear: string;
  /** Screen-reader text of `Input.Counter`; `{current}` and `{max}` are replaced. */
  counter: string;
};

const INPUT_LABELS: InputLabels = {
  optional: "необязательно",
  clear: "Очистить",
  counter: "{current} из {max} символов",
};

type InputContextValue = {
  size: ControlSize;
  invalid: boolean;
  focusRing: boolean;
  required: boolean;
  inputId: string;
  describedBy: string | undefined;
  labels: InputLabels;
};

const [InputProvider, useInputContext] = createComponentContext<InputContextValue>("Input");

// ---- InputRoot ----

export type InputRootProps = {
  size?: ControlSize;
  /** Invalid state: danger ring on the field and `aria-invalid` on the input. A non-empty `error` implies it. */
  invalid?: boolean;
  /**
   * Draws the focus ring on `Input.Wrapper` (default). `false` hides only the visual ring — focus,
   * keyboard and ARIA are unchanged, the error ring still shows. Turn it off only where focus is
   * otherwise obvious (a single search field with a caret, e.g. a command palette); WCAG 2.4.7.
   */
  focusRing?: boolean;
  label?: React.ReactNode;
  /** Shows a red `*` after the label and sets native `required` on `Input.Field`. */
  required?: boolean;
  /** Shows the muted optional marker after the label text (`labels.optional`). */
  optional?: boolean;
  hint?: React.ReactNode;
  /** Error message; replaces the hint in the same slot and implies `invalid`. */
  error?: React.ReactNode;
  /** Right-aligned slot of the support row, e.g. `<Input.Counter current={n} max={50} />`. */
  counter?: React.ReactNode;
  /** Always render the support row so an appearing error does not shift the layout. */
  reserveSupportRow?: boolean;
  /** Explicit id for the underlying <input>; auto-generated if omitted. */
  id?: string;
  labels?: Partial<InputLabels>;
  children: React.ReactNode;
  className?: string;
};

function InputRoot({
  size = "m",
  invalid: invalidProp = false,
  focusRing = true,
  label,
  required = false,
  optional = false,
  hint,
  error,
  counter,
  reserveSupportRow = false,
  id,
  labels: labelsProp,
  children,
  className,
}: InputRootProps) {
  const showError = error != null && error !== false && error !== "";
  const invalid = invalidProp || showError;
  const showHint = !showError && hint != null && hint !== false;
  const { inputId, hintId, errorId, describedBy } = useFieldIds(id, {
    hasHint: showHint,
    hasError: showError,
  });

  const labels = React.useMemo(() => ({ ...INPUT_LABELS, ...labelsProp }), [labelsProp]);
  const showSupport = showHint || showError || counter != null || reserveSupportRow;

  const contextValue = React.useMemo(
    () => ({ size, invalid, focusRing, required, inputId, describedBy, labels }),
    [size, invalid, focusRing, required, inputId, describedBy, labels],
  );

  return (
    <InputProvider value={contextValue}>
      <ControlSizeProvider value={size}>
        <div
          className={cx(composableStyles.root, className)}
          {...toDataAttributes({ size, invalid: invalid || undefined })}
        >
          {label != null ? (
            <div className={composableStyles.header}>
              <Label.Root
                htmlFor={inputId}
                size={size}
                required={required}
                optional={optional}
                labels={{ optional: labels.optional }}
                className={composableStyles.label}
              >
                {label}
              </Label.Root>
            </div>
          ) : null}
          <div className={composableStyles.body}>
            {children}
            {showSupport && (
              <div className={composableStyles.meta} data-reserve={reserveSupportRow || undefined}>
                {showError ? (
                  <Hint.Root id={errorId} size={size} invalid className={composableStyles.metaHint}>
                    {error}
                  </Hint.Root>
                ) : showHint ? (
                  <Hint.Root id={hintId} size={size} className={composableStyles.metaHint}>
                    {hint}
                  </Hint.Root>
                ) : (
                  <span className={composableStyles.metaHint} />
                )}
                {counter != null && <div className={composableStyles.metaCounter}>{counter}</div>}
              </div>
            )}
          </div>
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
  const { size, invalid, focusRing } = useInputContext();

  return (
    <div
      className={cx(composableStyles.wrapper, className)}
      {...toDataAttributes({
        size,
        invalid: invalid || undefined,
        "focus-ring": focusRing ? undefined : false,
      })}
    >
      {children}
    </div>
  );
}
InputWrapper.displayName = "Input.Wrapper";

// ---- InputField ----

export type InputFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  /** Called with the new string value; native `onChange` still fires. */
  onValueChange?: (value: string) => void;
};

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { className, "aria-describedby": ariaDescribedBy, required, onChange, onValueChange, ...rest },
    ref,
  ) => {
    const { inputId, invalid, required: requiredCtx, describedBy } = useInputContext();

    const resolvedDescribedBy =
      [ariaDescribedBy, describedBy].filter(Boolean).join(" ") || undefined;

    return (
      <input
        ref={ref}
        id={inputId}
        className={cx(composableStyles.field, className)}
        aria-invalid={invalid || undefined}
        aria-describedby={resolvedDescribedBy}
        required={required ?? (requiredCtx || undefined)}
        onChange={(event) => {
          onChange?.(event);
          onValueChange?.(event.target.value);
        }}
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

// ---- InputBadge ----

export type InputBadgeProps = {
  /** Palette hue of the soft badge. Default `gray`. */
  color?: PaletteColor;
  children: React.ReactNode;
  className?: string;
};

/**
 * Status inside the field: a soft Badge one tier below the field, at the trailing edge before
 * the trailing icon / clear button. The value truncates before it; the field height is unchanged.
 */
function InputBadge({ color = "gray", children, className }: InputBadgeProps) {
  return (
    <Badge.Root color={color} variant="soft" className={cx(composableStyles.badge, className)}>
      {children}
    </Badge.Root>
  );
}
InputBadge.displayName = "Input.Badge";

// ---- InputClearButton ----

export type InputClearButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children" | "aria-label"
>;

/**
 * Trailing clear action. Render it only when the field has a value; clicking returns focus
 * to the input after `onClick` runs (clear the value in `onClick`).
 */
const InputClearButton = React.forwardRef<HTMLButtonElement, InputClearButtonProps>(
  ({ className, onClick, ...rest }, ref) => {
    const { inputId, labels } = useInputContext();
    return (
      <button
        ref={ref}
        type="button"
        className={cx(composableStyles.action, className)}
        aria-label={labels.clear}
        aria-controls={inputId}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            document.getElementById(inputId)?.focus();
          }
        }}
        {...rest}
      >
        <Icon name="action.close" />
      </button>
    );
  },
);
InputClearButton.displayName = "Input.ClearButton";

// ---- InputCounter ----

export type InputCounterProps = {
  current: number;
  max: number;
  className?: string;
};

/** Character counter for the support row; turns danger when `current > max`. */
function InputCounter({ current, max, className }: InputCounterProps) {
  const { labels } = useInputContext();
  const spoken = labels.counter.replace("{current}", String(current)).replace("{max}", String(max));
  return (
    <span
      className={cx(composableStyles.counter, className)}
      data-invalid={current > max ? "true" : undefined}
      aria-live="polite"
    >
      <span aria-hidden="true">
        {current}/{max}
      </span>
      <span className={composableStyles.srOnly}>{spoken}</span>
    </span>
  );
}
InputCounter.displayName = "Input.Counter";

// ---- Namespace export ----

export const Input = {
  Root: InputRoot,
  Wrapper: InputWrapper,
  Field: InputField,
  Icon: InputIcon,
  Affix: InputAffix,
  InlineAffix: InputInlineAffix,
  Badge: InputBadge,
  ClearButton: InputClearButton,
  Counter: InputCounter,
};
