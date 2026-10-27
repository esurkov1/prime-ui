import * as React from "react";
import type { HintTone } from "@/components/hint/Hint";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { useAutofill } from "@/internal/autofill";
import { useHostTier } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useDisabledControl, useInheritedDisabled } from "@/internal/disabledContext";
import {
  FieldActionButton,
  type FieldActionButtonProps,
  FieldCopyButton,
} from "@/internal/FieldAction";
import { type FieldCommitHandler, FieldCommitStatus, useFieldCommit } from "@/internal/FieldCommit";
import {
  FieldCounter,
  type FieldFocusRingProps,
  FieldFrame,
  useFieldFrame,
} from "@/internal/FieldFrame";
import { fieldSurfaceClass, fieldTierClass } from "@/internal/fieldClasses";
import { useLabels } from "@/internal/labels";
import type { ControlSize } from "@/internal/states";
import { TEXT_FORMATTING_LABELS, type TextFormattingLabels } from "@/internal/textFormatting";
import { useTextFormatting } from "@/internal/textFormattingToolbar";

import styles from "./Textarea.module.css";

export type { TextFormat } from "@/internal/textFormatting";

/** Every built-in string; the formatting toolbar's names are shared with Composer. */
export type TextareaLabels = TextFormattingLabels & {
  /** Muted marker after the label when `optional`. */
  optional: string;
  /** Screen-reader text of `Textarea.Counter`; `{current}` and `{max}` are replaced. */
  counter: string;
  /** Name and tooltip of `Textarea.CopyButton`. */
  copy: string;
  /** Name, tooltip and announcement of `Textarea.CopyButton` once the text is copied. */
  copied: string;
  /** Name, tooltip and announcement of `Textarea.CopyButton` when the clipboard refuses. */
  copyError: string;
  /** Announced while an `onCommit` save is pending. */
  saving: string;
  /** Announced once an `onCommit` save succeeds. */
  saved: string;
};

export const TEXTAREA_LABELS: TextareaLabels = {
  optional: "необязательно",
  counter: "{current} из {max} символов",
  copy: "Копировать",
  copied: "Скопировано",
  copyError: "Не удалось скопировать",
  saving: "Сохранение",
  saved: "Сохранено",
  ...TEXT_FORMATTING_LABELS,
};

const [TextareaProvider, useTextareaContext] = createComponentContext<{
  size: ControlSize;
  labels: TextareaLabels;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}>("Textarea");

// ─── Root ────────────────────────────────────────────────────────────────────

export type TextareaRootProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size" | "children"
> &
  FieldFocusRingProps & {
    onCommit?: FieldCommitHandler;
    children?: React.ReactNode;
    size?: ControlSize;
    invalid?: boolean;
    label?: React.ReactNode;
    optional?: boolean;
    hint?: React.ReactNode;
    hintTone?: HintTone;
    error?: React.ReactNode;
    counter?: React.ReactNode;
    reserveSupportRow?: boolean;
    autoResize?: boolean;
    rows?: number;
    maxRows?: number;
    onValueChange?: (value: string) => void;
    formatting?: boolean;
    labels?: Partial<TextareaLabels>;
    /** The native `<textarea>`. */
    ref?: React.Ref<HTMLTextAreaElement>;
  };

/**
 * A multi-line field. `className` goes to the field frame, `id`, `ref` and the native attributes
 * to the `<textarea>` (it has no `Field` part).
 */
function TextareaRoot({
  id,
  className,
  size: sizeProp,
  invalid,
  focusRing,
  label,
  required,
  optional = false,
  hint,
  hintTone,
  error,
  counter,
  reserveSupportRow = false,
  autoResize = true,
  rows = 3,
  maxRows,
  disabled: disabledProp,
  readOnly,
  value,
  autoComplete,
  onInput,
  onChange,
  onValueChange,
  onFocus,
  onBlur,
  onKeyDown,
  onSelect,
  onCommit,
  formatting = false,
  labels: labelsProp,
  "aria-describedby": ariaDescribedBy,
  children,
  ref,
  ...rest
}: TextareaRootProps) {
  const tier = useHostTier(sizeProp);
  const { size } = tier;
  const disabled = useInheritedDisabled(disabledProp);
  // Under a tooltip's trigger a disabled field stays reachable: read-only, out of the form.
  const off = useDisabledControl(disabled);
  const ids = useFieldFrame(id, { label, hint, error, invalid, required }, ariaDescribedBy);
  const labels = useLabels(TEXTAREA_LABELS, labelsProp);
  const autofill = useAutofill(autoComplete);

  const innerRef = React.useRef<HTMLTextAreaElement | null>(null);
  const setRefs = useMergedRefs(innerRef, ref);
  const mirrorRef = React.useRef<HTMLDivElement>(null);
  const contextValue = React.useMemo(
    () => ({ size, labels, textareaRef: innerRef }),
    [size, labels],
  );
  const hasCommit = onCommit !== undefined;
  const commit = useFieldCommit(innerRef, onCommit);
  const hasEdge = hasCommit || React.Children.count(children) > 0;
  const format = useTextFormatting({
    textareaRef: innerRef,
    enabled: formatting,
    toolbar: !disabled && !readOnly,
    labels,
    size,
    controlsId: ids.controlId,
  });

  // The auto-resize mirror copies the text; sync it on mount and on controlled value changes.
  React.useLayoutEffect(() => {
    if (!autoResize || !mirrorRef.current || !innerRef.current) return;
    mirrorRef.current.dataset.value = typeof value === "string" ? value : innerRef.current.value;
  }, [autoResize, value]);

  // A form reset puts the default text back without an input event: the mirror and the
  // consumer's value (a counter) follow it once the reset has run.
  const onValueChangeRef = React.useRef(onValueChange);
  onValueChangeRef.current = onValueChange;
  React.useEffect(() => {
    const form = innerRef.current?.form;
    if (!form) return;
    const onFormReset = () => {
      queueMicrotask(() => {
        const textarea = innerRef.current;
        if (!textarea) return;
        if (mirrorRef.current) mirrorRef.current.dataset.value = textarea.value;
        onValueChangeRef.current?.(textarea.value);
      });
    };
    form.addEventListener("reset", onFormReset);
    return () => form.removeEventListener("reset", onFormReset);
  }, []);

  // Clicking the padding of the field focuses the textarea (the box is a div, not a label,
  // so the counter and hints never leak into the accessible name).
  const focusFromPadding = (event: React.MouseEvent<HTMLDivElement>) => {
    const textarea = innerRef.current;
    if (!textarea || event.target === textarea || disabled) return;
    if ((event.target as Element).closest("[data-field-action]")) return;
    event.preventDefault();
    textarea.focus();
  };

  const textarea = (
    <textarea
      {...rest}
      ref={setRefs}
      id={ids.controlId}
      rows={rows}
      className={cx(styles.textarea, autoResize && styles.textareaAutoResize)}
      disabled={off.native}
      aria-disabled={off.ariaDisabled}
      readOnly={off.reachable || readOnly}
      name={off.reachable ? undefined : rest.name}
      required={(!off.reachable && ids.required) || undefined}
      aria-invalid={ids.invalid || undefined}
      aria-describedby={ids.describedBy}
      aria-busy={commit.state === "pending" || undefined}
      {...autofill}
      value={value}
      onInput={(event) => {
        if (autoResize && mirrorRef.current) {
          mirrorRef.current.dataset.value = event.currentTarget.value;
        }
        onInput?.(event);
      }}
      onChange={(event) => {
        onChange?.(event);
        onValueChange?.(event.target.value);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (hasCommit) commit.sync();
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (hasCommit) commit.commit();
      }}
      onSelect={(event) => {
        onSelect?.(event);
        format.onSelect();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || format.onKeyDown(event)) return;
        if (!hasCommit || event.nativeEvent.isComposing) return;
        if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          commit.commit();
        }
        // A reverted Escape is consumed: it does not also close the drawer the field sits in.
        else if (event.key === "Escape" && commit.revert()) event.preventDefault();
      }}
    />
  );
  const body = autoResize ? (
    <div ref={mirrorRef} className={styles.autoResize} data-value="">
      {textarea}
    </div>
  ) : (
    textarea
  );

  const control = (
    // biome-ignore lint/a11y/noStaticElementInteractions: pointer convenience only; the textarea itself is the focus target
    <div
      className={cx(fieldSurfaceClass, styles.control)}
      onMouseDown={focusFromPadding}
      style={
        {
          "--textarea-rows": rows,
          "--textarea-max-rows": maxRows,
        } as React.CSSProperties
      }
      {...toDataAttributes({
        size,
        invalid: ids.invalid || undefined,
        disabled: disabled || undefined,
        readonly: readOnly || undefined,
        "focus-ring": focusRing,
        capped: (autoResize && maxRows !== undefined) || undefined,
      })}
    >
      {hasEdge ? (
        <>
          <div className={styles.body}>{body}</div>
          <div className={styles.edge}>
            {hasCommit ? <FieldCommitStatus state={commit.state} labels={labels} /> : null}
            {children}
          </div>
        </>
      ) : (
        body
      )}
    </div>
  );

  return (
    <TextareaProvider value={contextValue}>
      {tier.provide(
        <FieldFrame
          size={size}
          ids={ids}
          label={label}
          required={required}
          optional={optional}
          disabled={disabled}
          hint={hint}
          hintTone={hintTone}
          error={error}
          counter={counter}
          reserveSupportRow={reserveSupportRow}
          optionalLabel={labels.optional}
          className={cx(fieldTierClass, styles.root, className)}
        >
          {formatting ? (
            // The toolbar floats over the box; the box clips its corner actions, so it cannot hold it.
            <div className={styles.anchor} {...format.anchorProps}>
              {control}
              {format.toolbar}
            </div>
          ) : (
            control
          )}
        </FieldFrame>,
      )}
    </TextareaProvider>
  );
}

TextareaRoot.displayName = "Textarea.Root";

// ─── Counter ─────────────────────────────────────────────────────────────────

export type TextareaCounterProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  current: number;
  max: number;
  ref?: React.Ref<HTMLSpanElement>;
};

/** Character counter for the `counter` slot; turns danger when `current > max`. */
function TextareaCounter(props: TextareaCounterProps) {
  const { size, labels } = useTextareaContext();
  return <FieldCounter {...props} size={size} label={labels.counter} />;
}

TextareaCounter.displayName = "Textarea.Counter";

// ─── Action ──────────────────────────────────────────────────────────────────

export type TextareaActionProps = FieldActionButtonProps;

/** The consumer's icon action in the field's corner: a named button with a tooltip; `asChild` renders a link. */
function TextareaAction(props: TextareaActionProps) {
  return <FieldActionButton {...props} />;
}

TextareaAction.displayName = "Textarea.Action";

// ─── CopyButton ──────────────────────────────────────────────────────────────

export type TextareaCopyButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children" | "aria-label"
> & {
  value?: string;
  ref?: React.Ref<HTMLButtonElement>;
};

/** Copies the field's text (a read-only result); the glyph morphs into a check. */
function TextareaCopyButton({ value, ...rest }: TextareaCopyButtonProps) {
  const { textareaRef, labels } = useTextareaContext();
  return (
    <FieldCopyButton
      {...rest}
      labels={labels}
      getText={() => value ?? textareaRef.current?.value ?? ""}
    />
  );
}

TextareaCopyButton.displayName = "Textarea.CopyButton";

export const Textarea = {
  Root: TextareaRoot,
  Counter: TextareaCounter,
  CopyButton: TextareaCopyButton,
  Action: TextareaAction,
};
