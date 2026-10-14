import * as React from "react";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { ControlSizeProvider, useControlSize } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import {
  FieldActionButton,
  type FieldActionButtonProps,
  FieldActionSegment,
  FieldCopyButton,
} from "@/internal/FieldAction";
import {
  type FieldCommit,
  type FieldCommitHandler,
  FieldCommitStatus,
  useFieldCommit,
} from "@/internal/FieldCommit";
import {
  FieldCounter,
  FieldFrame,
  type FieldRootDomProps,
  useFieldFrame,
} from "@/internal/FieldFrame";
import { fieldSurfaceClass, fieldTierClass } from "@/internal/fieldClasses";
import { MorphText } from "@/internal/MorphText";
import type { ControlSize, Tone } from "@/internal/states";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import { ProgressBar } from "../progress-bar/ProgressBar";
import styles from "./Input.module.css";
import { getPasswordStrength, type PasswordStrength } from "./passwordStrength";

export type InputLabels = {
  /** Muted marker after the label when `optional`. */
  optional: string;
  /** Accessible name of `Input.ClearButton`. */
  clear: string;
  /** Name and tooltip of `Input.CopyButton`. */
  copy: string;
  /** Name, tooltip and announcement of `Input.CopyButton` once the value is copied. */
  copied: string;
  /** Name, tooltip and announcement of `Input.CopyButton` when the clipboard refuses. */
  copyError: string;
  /** Accessible name of `Input.RevealButton` (a toggle: `aria-pressed` says whether it is shown). */
  reveal: string;
  /** Announced while an `onCommit` save is pending. */
  saving: string;
  /** Announced once an `onCommit` save succeeds. */
  saved: string;
  /** Screen-reader text of `Input.Counter`; `{current}` and `{max}` are replaced. */
  counter: string;
  /** Accessible name of the `strength` meter. */
  strength: string;
  /** Visible words of the four `strength` levels. */
  strengthWeak: string;
  strengthEasy: string;
  strengthMedium: string;
  strengthHard: string;
};

export const INPUT_LABELS: InputLabels = {
  optional: "необязательно",
  clear: "Очистить",
  copy: "Копировать",
  copied: "Скопировано",
  copyError: "Не удалось скопировать",
  reveal: "Показать пароль",
  saving: "Сохранение",
  saved: "Сохранено",
  counter: "{current} из {max} символов",
  strength: "Надёжность пароля",
  strengthWeak: "Слабый",
  strengthEasy: "Лёгкий",
  strengthMedium: "Средний",
  strengthHard: "Сложный",
};

/** Tone of each strength level: the meaning is also in the word, never in the color alone. */
const STRENGTH_TONES: Record<Exclude<PasswordStrength, 0>, Tone> = {
  1: "danger",
  2: "warning",
  3: "accent",
  4: "success",
};

type InputContextValue = {
  size: ControlSize;
  invalid: boolean;
  focusRing: boolean;
  required: boolean;
  inputId: string;
  /** `Input.Field` attaches it; `Input.ClearButton` returns focus through it. */
  inputRef: React.RefObject<HTMLInputElement | null>;
  describedBy: string | undefined;
  labels: InputLabels;
  /** `Input.Field` reports its value here when the root shows a `strength` meter. */
  reportValue: ((value: string) => void) | null;
  /** Inline save cycle; inert without `onCommit`. */
  commit: FieldCommit;
  hasCommit: boolean;
  /** `Input.RevealButton` shows a password field as text. */
  revealed: boolean;
  setRevealed: React.Dispatch<React.SetStateAction<boolean>>;
  /** The caret and selection kept across a reveal (changing `type` resets them). */
  selectionRef: React.RefObject<[number, number] | null>;
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
  /**
   * A password strength meter under the field: four steps that fill as the value grows stronger,
   * with the level word on the right of the support row. Use on new-password fields.
   */
  strength?: boolean;
  /** Replaces the kit's estimate (`getPasswordStrength`): return 0 (empty) … 4 (hard). */
  getStrength?: (value: string) => PasswordStrength;
  /**
   * Saves the field on its own (inline editing): fires with the value on blur and Enter when it
   * differs from the last committed one; Escape reverts to it. Return a Promise to show a spinner
   * at the field's edge while it runs (the field stays editable, Tab moves on); a rejection puts
   * the committed value back — show why through `error`. Success shows a brief check.
   */
  onCommit?: FieldCommitHandler;
  labels?: Partial<InputLabels>;
  children: React.ReactNode;
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
  strength = false,
  getStrength = getPasswordStrength,
  onCommit,
  labels: labelsProp,
  children,
  className,
  ...rest
}: InputRootProps) {
  const [strengthValue, setStrengthValue] = React.useState("");
  const size = useControlSize(sizeProp);
  const ids = useFieldFrame(id, { label, hint, error, invalid });
  const labels = React.useMemo(() => ({ ...INPUT_LABELS, ...labelsProp }), [labelsProp]);
  const { invalid: isInvalid, controlId: inputId, describedBy } = ids;
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const commit = useFieldCommit(inputRef, onCommit);
  const hasCommit = onCommit !== undefined;
  const [revealed, setRevealed] = React.useState(false);
  const selectionRef = React.useRef<[number, number] | null>(null);

  const contextValue = React.useMemo(
    () => ({
      size,
      invalid: isInvalid,
      focusRing,
      required,
      inputId,
      inputRef,
      describedBy,
      labels,
      reportValue: strength ? setStrengthValue : null,
      commit,
      hasCommit,
      revealed,
      setRevealed,
      selectionRef,
    }),
    [
      size,
      isInvalid,
      focusRing,
      required,
      inputId,
      describedBy,
      labels,
      strength,
      commit,
      hasCommit,
      revealed,
    ],
  );
  const level = strength ? getStrength(strengthValue) : 0;
  const levelWord = level
    ? [labels.strengthWeak, labels.strengthEasy, labels.strengthMedium, labels.strengthHard][
        level - 1
      ]
    : "";

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
          counter={
            strength ? (
              <>
                <span
                  className={styles.strengthWord}
                  data-tone={level ? STRENGTH_TONES[level] : undefined}
                  aria-live="polite"
                >
                  {levelWord ? (
                    <>
                      <VisuallyHidden>{`${labels.strength}: `}</VisuallyHidden>
                      <MorphText>{levelWord}</MorphText>
                    </>
                  ) : null}
                </span>
                {counter}
              </>
            ) : (
              counter
            )
          }
          reserveSupportRow={reserveSupportRow || strength}
          optionalLabel={labels.optional}
          className={cx(fieldTierClass, styles.root, className)}
        >
          {children}
          {strength ? (
            <ProgressBar
              steps
              value={level}
              max={4}
              tone={level ? STRENGTH_TONES[level] : "neutral"}
              size="xs"
              aria-label={labels.strength}
            />
          ) : null}
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
  const { size, invalid, focusRing, commit, hasCommit, labels } = useInputContext();

  return (
    <div
      {...rest}
      className={cx(fieldSurfaceClass, styles.wrapper, className)}
      {...toDataAttributes({
        size,
        invalid: invalid || undefined,
        "focus-ring": focusRing ? undefined : false,
      })}
    >
      {children}
      {hasCommit ? (
        <FieldCommitStatus state={commit.state} labels={labels} className={styles.status} />
      ) : null}
    </div>
  );
}
InputWrapper.displayName = "Input.Wrapper";

// ---- InputField ----

export type InputFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "id"> & {
  /** Called with the new string value; native `onChange` still fires. */
  onValueChange?: (value: string) => void;
  ref?: React.Ref<HTMLInputElement>;
};

/** The `<input>`; its id comes from `Input.Root` so the label, hint and error stay linked. */
function InputField({
  className,
  "aria-describedby": ariaDescribedBy,
  required,
  disabled: disabledProp,
  type,
  onChange,
  onValueChange,
  onFocus,
  onBlur,
  onKeyDown,
  ref,
  ...rest
}: InputFieldProps) {
  const {
    inputId,
    inputRef,
    invalid,
    required: requiredCtx,
    describedBy,
    reportValue,
    commit,
    hasCommit,
    revealed,
    selectionRef,
  } = useInputContext();
  const setRefs = useMergedRefs(inputRef, ref);
  const disabled = useInheritedDisabled(disabledProp);

  // A reveal swaps `type`, which resets the caret: put the kept selection back.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs after each reveal toggle
  React.useLayoutEffect(() => {
    const selection = selectionRef.current;
    const input = inputRef.current;
    if (!selection || !input) return;
    selectionRef.current = null;
    input.setSelectionRange(selection[0], selection[1]);
  }, [revealed, selectionRef, inputRef]);

  // A strength meter on the root follows the value: controlled, default, then every edit.
  const controlled = rest.value;
  React.useEffect(() => {
    if (!reportValue) return;
    if (controlled !== undefined) reportValue(String(controlled));
    else if (inputRef.current) reportValue(inputRef.current.value);
  }, [reportValue, controlled, inputRef]);

  const resolvedDescribedBy = [ariaDescribedBy, describedBy].filter(Boolean).join(" ") || undefined;

  return (
    <input
      {...rest}
      ref={setRefs}
      id={inputId}
      className={cx(styles.field, className)}
      aria-invalid={invalid || undefined}
      aria-describedby={resolvedDescribedBy}
      disabled={disabled || undefined}
      required={required ?? (requiredCtx || undefined)}
      type={type === "password" && revealed ? "text" : type}
      aria-busy={commit.state === "pending" || undefined}
      onChange={(event) => {
        onChange?.(event);
        onValueChange?.(event.target.value);
        reportValue?.(event.target.value);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (hasCommit) commit.sync();
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (hasCommit) commit.commit();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!hasCommit || event.defaultPrevented || event.nativeEvent.isComposing) return;
        if (event.key === "Enter") commit.commit();
        // A reverted Escape is consumed: it does not also close the drawer the field sits in.
        else if (event.key === "Escape" && commit.revert()) event.preventDefault();
      }}
    />
  );
}
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
> & {
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * Trailing clear action. Render it only when the field has a value; clicking returns focus
 * to the input after `onClick` runs (clear the value in `onClick`).
 */
function InputClearButton({ onClick, ref, ...rest }: InputClearButtonProps) {
  const { inputId, inputRef, labels } = useInputContext();
  return (
    <FieldActionSegment
      {...rest}
      ref={ref}
      label={labels.clear}
      aria-controls={inputId}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) inputRef.current?.focus();
      }}
    >
      <Icon name="action.close" />
    </FieldActionSegment>
  );
}
InputClearButton.displayName = "Input.ClearButton";

// ---- InputAction ----

export type InputActionProps = FieldActionButtonProps;

/**
 * The consumer's icon action at the field's end («Позвонить», «Открыть профиль»): a named button
 * segment with a tooltip; `asChild` renders a link.
 */
function InputAction(props: InputActionProps) {
  return <FieldActionButton {...props} />;
}
InputAction.displayName = "Input.Action";

// ---- InputCopyButton ----

export type InputCopyButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children" | "aria-label"
> & {
  /** Text to copy; the field's current value when omitted. */
  value?: string;
  ref?: React.Ref<HTMLButtonElement>;
};

/** Copies the field's value; the glyph morphs into a check and the name says «copied». */
function InputCopyButton({ value, ...rest }: InputCopyButtonProps) {
  const { inputRef, labels } = useInputContext();
  return (
    <FieldCopyButton
      {...rest}
      labels={labels}
      getText={() => value ?? inputRef.current?.value ?? ""}
    />
  );
}
InputCopyButton.displayName = "Input.CopyButton";

// ---- InputRevealButton ----

export type InputRevealButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children" | "aria-label" | "aria-pressed"
> & {
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * Shows a `type="password"` field as text and back (`aria-pressed`). A pointer press keeps the focus
 * in the field; the caret and selection survive the switch.
 */
function InputRevealButton({ onClick, onMouseDown, ref, ...rest }: InputRevealButtonProps) {
  const { inputId, inputRef, labels, revealed, setRevealed, selectionRef } = useInputContext();
  return (
    <FieldActionSegment
      {...rest}
      ref={ref}
      label={labels.reveal}
      aria-pressed={revealed}
      aria-controls={inputId}
      onMouseDown={(event) => {
        onMouseDown?.(event);
        // Keep the caret in the field: the press does not take focus.
        if (!event.defaultPrevented && document.activeElement === inputRef.current) {
          event.preventDefault();
        }
      }}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        const input = inputRef.current;
        if (input && input.selectionStart !== null && input.selectionEnd !== null) {
          selectionRef.current = [input.selectionStart, input.selectionEnd];
        }
        setRevealed((shown) => !shown);
      }}
    >
      <Icon name={revealed ? "field.password.hide" : "field.password.show"} />
    </FieldActionSegment>
  );
}
InputRevealButton.displayName = "Input.RevealButton";

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
  CopyButton: InputCopyButton,
  RevealButton: InputRevealButton,
  Action: InputAction,
  Counter: InputCounter,
};
