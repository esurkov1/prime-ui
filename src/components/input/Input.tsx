import * as React from "react";

import { Icon } from "@/icons";
import { ControlSizeProvider, useOptionalControlSize } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import {
  FieldCounter,
  FieldFrame,
  type FieldRootDomProps,
  useFieldFrame,
} from "@/internal/FieldFrame";
import type { ControlSize } from "@/internal/states";

import styles from "./Input.module.css";

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

export type InputRootProps = FieldRootDomProps & {
  /** Tier. Default: the tier of the surrounding control (a form, a panel), else `m`. */
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
  size: sizeProp,
  invalid,
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
  ...rest
}: InputRootProps) {
  // Without an explicit size the field takes the tier of its host (a form, a panel).
  const hostSize = useOptionalControlSize();
  const size = sizeProp ?? hostSize ?? "m";
  const ids = useFieldFrame(id, { hint, error, invalid });
  const labels = React.useMemo(() => ({ ...INPUT_LABELS, ...labelsProp }), [labelsProp]);
  const { invalid: isInvalid, controlId: inputId, describedBy } = ids;

  const contextValue = React.useMemo(
    () => ({ size, invalid: isInvalid, focusRing, required, inputId, describedBy, labels }),
    [size, isInvalid, focusRing, required, inputId, describedBy, labels],
  );

  return (
    <InputProvider value={contextValue}>
      <ControlSizeProvider value={size}>
        <FieldFrame
          {...rest}
          size={size}
          ids={ids}
          label={label}
          required={required}
          optional={optional}
          hint={hint}
          error={error}
          counter={counter}
          reserveSupportRow={reserveSupportRow}
          optionalLabel={labels.optional}
          className={cx(styles.root, className)}
        >
          {children}
        </FieldFrame>
      </ControlSizeProvider>
    </InputProvider>
  );
}
InputRoot.displayName = "Input.Root";

// ---- InputWrapper ----

export type InputWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

function InputWrapper({ children, className, ...rest }: InputWrapperProps) {
  const { size, invalid, focusRing } = useInputContext();

  return (
    <div
      {...rest}
      className={cx(styles.wrapper, className)}
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
        className={cx(styles.field, className)}
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

export type InputIconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  side: "start" | "end";
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

function InputIcon({ side, children, className, ...rest }: InputIconProps) {
  return (
    <span {...rest} className={cx(styles.icon, className)} data-side={side} aria-hidden="true">
      {children}
    </span>
  );
}
InputIcon.displayName = "Input.Icon";

// ---- InputAffix ----

export type InputAffixProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  side: "start" | "end";
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

function InputAffix({ side, children, className, ...rest }: InputAffixProps) {
  return (
    <div {...rest} className={cx(styles.affix, className)} data-side={side} aria-hidden="true">
      {children}
    </div>
  );
}
InputAffix.displayName = "Input.Affix";

// ---- InputInlineAffix ----

export type InputInlineAffixProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  side: "start" | "end";
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

function InputInlineAffix({ side, children, className, ...rest }: InputInlineAffixProps) {
  return (
    <span
      {...rest}
      className={cx(styles.inlineAffix, className)}
      data-side={side}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
InputInlineAffix.displayName = "Input.InlineAffix";

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
        className={cx(styles.action, className)}
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

export type InputCounterProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  current: number;
  max: number;
  ref?: React.Ref<HTMLSpanElement>;
};

/** Character counter for the support row; turns danger when `current > max`. */
function InputCounter(props: InputCounterProps) {
  const { size, labels } = useInputContext();
  return <FieldCounter {...props} size={size} label={labels.counter} />;
}
InputCounter.displayName = "Input.Counter";

export const Input = {
  Root: InputRoot,
  Wrapper: InputWrapper,
  Field: InputField,
  Icon: InputIcon,
  Affix: InputAffix,
  InlineAffix: InputInlineAffix,
  ClearButton: InputClearButton,
  Counter: InputCounter,
};
