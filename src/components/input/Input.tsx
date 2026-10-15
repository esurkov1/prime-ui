import * as React from "react";
import type { HintTone } from "@/components/hint/Hint";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { useHostTier } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import enterMotion from "@/internal/enterMotion.module.css";
import {
  FieldActionButton,
  type FieldActionButtonProps,
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
  type FieldFocusRingProps,
  FieldFrame,
  type FieldRootDomProps,
  useFieldFrame,
} from "@/internal/FieldFrame";
import { FieldCellContext, useFieldCell } from "@/internal/fieldCell";
import { fieldSurfaceClass, fieldTierClass } from "@/internal/fieldClasses";
import { iconSlotClass } from "@/internal/iconBox";
import { useLabels } from "@/internal/labels";
import { createStore, optionDomId, useStoreSlice } from "@/internal/listbox";
import { MorphText } from "@/internal/MorphText";
import { usePartPresence } from "@/internal/partPresence";
import type { ControlSize, Tone } from "@/internal/states";
import textTone from "@/internal/textTone.module.css";

import { ProgressBar } from "../progress-bar/ProgressBar";
import styles from "./Input.module.css";
import {
  InputSuggestionList,
  type InputSuggestions,
  useInputSuggestions,
} from "./inputSuggestions";
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
  focusRing: boolean | undefined;
  required: boolean;
  inputId: string;
  /** `Input.Field` attaches it; `Input.ClearButton` returns focus through it. */
  inputRef: React.RefObject<HTMLInputElement | null>;
  describedBy: string | undefined;
  /** The ids of the affixes: their text describes the input. */
  affixIds: string | undefined;
  /** An affix registers its id while mounted. */
  addAffix: (affixId: string) => () => void;
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
  /** The root has rendered once: a part mounted after that arrived (it enters). */
  mountedRef: React.RefObject<boolean>;
  /** `suggestions`: the field is a combobox with a list under the box. */
  suggest: InputSuggestions | null;
  /** The row's action of a FieldList cell (`fieldCell`): the box ends with it. */
  cellAction: React.ReactNode;
};

const [InputProvider, useInputContext] = createComponentContext<InputContextValue>("Input");

/**
 * Inside `Input.Wrapper`: a Select there drops its own frame and draws its trigger as the box's
 * start segment, so the pick and the text read as one field.
 */
export const InputSegmentContext = React.createContext(false);

/** The highlight of a field without suggestions: never set. */
const NO_HIGHLIGHT = createStore<string | undefined>(undefined);

// ---- InputRoot ----

export type InputRootProps = FieldRootDomProps &
  FieldFocusRingProps & {
    size?: ControlSize;
    invalid?: boolean;
    label?: React.ReactNode;
    required?: boolean;
    optional?: boolean;
    hint?: React.ReactNode;
    hintTone?: HintTone;
    error?: React.ReactNode;
    counter?: React.ReactNode;
    reserveSupportRow?: boolean;
    id?: string;
    strength?: boolean;
    getStrength?: (value: string) => PasswordStrength;
    onCommit?: FieldCommitHandler;
    suggestions?: readonly string[];
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    labels?: Partial<InputLabels>;
    children: React.ReactNode;
  };

function InputRoot({
  size: sizeProp,
  invalid,
  focusRing,
  label,
  required = false,
  optional = false,
  hint,
  hintTone,
  error,
  counter,
  reserveSupportRow = false,
  id,
  strength = false,
  getStrength = getPasswordStrength,
  onCommit,
  suggestions,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  labels: labelsProp,
  children,
  className,
  ...rest
}: InputRootProps) {
  const [strengthValue, setStrengthValue] = React.useState("");
  const tier = useHostTier(sizeProp);
  const { size } = tier;
  const ids = useFieldFrame(id, { label, hint, error, invalid, required });
  const labels = useLabels(INPUT_LABELS, labelsProp);
  const { invalid: isInvalid, controlId: inputId, describedBy, required: isRequired } = ids;
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const suggest = useInputSuggestions(
    suggestions,
    inputRef,
    `${ids.controlId}-suggestions`,
    ids.labelledBy,
    { closeOnEscape, closeOnOutsideClick },
  );
  const commit = useFieldCommit(inputRef, onCommit);
  const hasCommit = onCommit !== undefined;
  const [revealed, setRevealed] = React.useState(false);
  const selectionRef = React.useRef<[number, number] | null>(null);
  const mountedRef = React.useRef(false);
  React.useEffect(() => {
    mountedRef.current = true;
  }, []);
  const [affixes, setAffixes] = React.useState<string[]>([]);
  const addAffix = React.useCallback((affixId: string) => {
    setAffixes((current) => [...current, affixId]);
    return () => setAffixes((current) => current.filter((item) => item !== affixId));
  }, []);
  const affixIds = affixes.join(" ") || undefined;
  // The row's action of a FieldList cell is this field's: a field nested inside (a popover's)
  // reads the cell without it.
  const cell = useFieldCell();
  const cellAction = cell?.action;
  const innerCell = React.useMemo(() => (cell ? { ...cell, action: undefined } : null), [cell]);

  const contextValue = React.useMemo(
    () => ({
      size,
      invalid: isInvalid,
      focusRing,
      required: isRequired,
      inputId,
      inputRef,
      describedBy,
      affixIds,
      addAffix,
      labels,
      reportValue: strength ? setStrengthValue : null,
      commit,
      hasCommit,
      revealed,
      setRevealed,
      selectionRef,
      mountedRef,
      suggest,
      cellAction,
    }),
    [
      size,
      isInvalid,
      focusRing,
      isRequired,
      inputId,
      describedBy,
      affixIds,
      addAffix,
      labels,
      strength,
      commit,
      hasCommit,
      revealed,
      suggest,
      cellAction,
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
      {tier.provide(
        <FieldFrame
          {...rest}
          size={size}
          ids={ids}
          label={label}
          required={required}
          optional={optional}
          hint={hint}
          hintTone={hintTone}
          error={error}
          counter={
            strength ? (
              <>
                <span
                  className={cx(textTone.tone, styles.strengthWord)}
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
          {cellAction ? (
            <FieldCellContext value={innerCell}>{children}</FieldCellContext>
          ) : (
            children
          )}
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
        </FieldFrame>,
      )}
    </InputProvider>
  );
}
InputRoot.displayName = "Input.Root";

// ---- InputWrapper ----

export type InputWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

function InputWrapper({ children, className, ref, ...rest }: InputWrapperProps) {
  const { size, invalid, focusRing, commit, hasCommit, labels, suggest, cellAction } =
    useInputContext();
  // The box anchors the suggestion list (as wide as the box).
  const setRefs = useMergedRefs(suggest?.anchorRef, ref);

  return (
    <div
      {...rest}
      ref={setRefs}
      className={cx(fieldSurfaceClass, styles.wrapper, className)}
      {...toDataAttributes({
        size,
        invalid: invalid || undefined,
        "focus-ring": focusRing,
      })}
    >
      {/* A Select among the children becomes the box's start segment. */}
      <InputSegmentContext value>{children}</InputSegmentContext>
      {hasCommit ? (
        <FieldCommitStatus state={commit.state} labels={labels} className={styles.status} />
      ) : null}
      {cellAction}
      {suggest ? <InputSuggestionList suggest={suggest} size={size} /> : null}
    </div>
  );
}
InputWrapper.displayName = "Input.Wrapper";

// ---- InputField ----

export type InputFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "id"> & {
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
  onClick,
  ref,
  ...rest
}: InputFieldProps) {
  const {
    inputId,
    inputRef,
    invalid,
    required: requiredCtx,
    describedBy,
    affixIds,
    reportValue,
    commit,
    hasCommit,
    revealed,
    selectionRef,
    suggest,
  } = useInputContext();
  const setRefs = useMergedRefs(inputRef, ref);
  const highlighted = useStoreSlice(suggest?.highlight ?? NO_HIGHLIGHT, (value) => value);
  const disabled = useInheritedDisabled(disabledProp);

  const fieldType = type === "password" && revealed ? "text" : type;

  // A reveal swaps `type`, which resets the caret: once the input carries the new type, put the
  // kept selection back.
  React.useLayoutEffect(() => {
    const selection = selectionRef.current;
    const input = inputRef.current;
    if (!selection || !input || input.type !== (fieldType ?? "text")) return;
    selectionRef.current = null;
    input.setSelectionRange(selection[0], selection[1]);
  }, [fieldType, selectionRef, inputRef]);

  // A strength meter on the root follows the value: controlled, default, then every edit.
  const controlled = rest.value;
  React.useEffect(() => {
    if (!reportValue) return;
    if (controlled !== undefined) reportValue(String(controlled));
    else if (inputRef.current) reportValue(inputRef.current.value);
  }, [reportValue, controlled, inputRef]);

  const resolvedDescribedBy =
    [ariaDescribedBy, affixIds, describedBy].filter(Boolean).join(" ") || undefined;

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
      type={fieldType}
      aria-busy={commit.state === "pending" || undefined}
      {...(suggest
        ? {
            role: "combobox",
            autoComplete: "off",
            "aria-autocomplete": "list" as const,
            "aria-expanded": suggest.shown,
            "aria-controls": suggest.shown ? suggest.listboxId : undefined,
            "aria-activedescendant":
              suggest.shown && highlighted !== undefined
                ? optionDomId(suggest.listboxId, highlighted)
                : undefined,
          }
        : null)}
      onChange={(event) => {
        onChange?.(event);
        onValueChange?.(event.target.value);
        reportValue?.(event.target.value);
        suggest?.onInput(event.target.value);
      }}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) suggest?.onClick();
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (hasCommit) commit.sync();
      }}
      onBlur={(event) => {
        onBlur?.(event);
        suggest?.onBlur();
        if (hasCommit) commit.commit();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        // The suggestion list takes its keys first: an Enter that picks is no commit.
        suggest?.onKeyDown(event);
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
    <span
      {...rest}
      className={cx(iconSlotClass, styles.icon, className)}
      data-side={side}
      aria-hidden="true"
    >
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

/**
 * An affix is drawing in the reading order (`aria-hidden`) yet its text describes the input: it
 * joins the input's `aria-describedby`, so a screen reader hears the unit or the prefix with the
 * field. An `aria-label` on the affix replaces its text there («рублей» for `₽`): a generic
 * element takes no name of its own, so the words go into a `hidden` node the input points at.
 */
function useAffixDescription(
  id: string | undefined,
  spokenText: string | undefined,
): { id: string | undefined; spoken: React.ReactNode } {
  const { addAffix } = useInputContext();
  const generated = React.useId();
  const target = spokenText ? generated : (id ?? generated);
  React.useLayoutEffect(() => addAffix(target), [addAffix, target]);
  return spokenText
    ? {
        id,
        spoken: (
          <span id={generated} hidden>
            {spokenText}
          </span>
        ),
      }
    : { id: target, spoken: null };
}

function InputAffix({
  side,
  children,
  className,
  id,
  "aria-label": spokenText,
  ...rest
}: InputAffixProps) {
  const description = useAffixDescription(id, spokenText);
  return (
    <div
      {...rest}
      id={description.id}
      className={cx(styles.affix, className)}
      data-side={side}
      aria-hidden="true"
    >
      {children}
      {description.spoken}
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

function InputInlineAffix({
  side,
  children,
  className,
  id,
  "aria-label": spokenText,
  ...rest
}: InputInlineAffixProps) {
  const description = useAffixDescription(id, spokenText);
  return (
    <span
      {...rest}
      id={description.id}
      className={cx(styles.inlineAffix, className)}
      data-side={side}
      aria-hidden="true"
    >
      {children}
      {description.spoken}
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
 * to the input after `onClick` runs (clear the value in `onClick`). It rises in when it appears
 * after the field and closes up in place when it goes (`partPresence`).
 */
function InputClearButton({ onClick, className, ref, ...rest }: InputClearButtonProps) {
  const { inputId, inputRef, labels, mountedRef } = useInputContext();
  // Mounted after the field: the consumer rendered it for a value that just appeared.
  const [arrived] = React.useState(() => mountedRef.current);
  const presence = usePartPresence<HTMLButtonElement>({ axis: "inline" });
  const setRefs = useMergedRefs(presence.ref, ref);
  return (
    <FieldActionButton
      tooltip={false}
      {...rest}
      ref={setRefs}
      className={cx(arrived && enterMotion.enter, className)}
      label={labels.clear}
      aria-controls={inputId}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) inputRef.current?.focus();
      }}
    >
      <Icon name="action.close" />
    </FieldActionButton>
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
  const glyph = revealed ? "field.password.hide" : "field.password.show";
  return (
    <FieldActionButton
      tooltip={false}
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
      <Icon name={glyph} />
    </FieldActionButton>
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
