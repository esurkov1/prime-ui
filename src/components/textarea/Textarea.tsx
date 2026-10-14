import * as React from "react";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { ControlSizeProvider, useControlSize } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
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
    /**
     * Saves the field on its own (inline editing): fires with the value on blur and Mod+Enter when it
     * differs from the last committed one; Escape reverts to it. Return a Promise to show a spinner
     * in the field's corner while it runs (the field stays editable, Tab moves on); a rejection puts
     * the committed value back — show why through `error`. Success shows a brief check.
     */
    onCommit?: FieldCommitHandler;
    /** Actions in the field's top end corner: `Textarea.CopyButton`, `Textarea.Action`. */
    children?: React.ReactNode;
    /** Tier. Default: the tier of the surrounding control (a form, a panel), else `m`. */
    size?: ControlSize;
    /** Invalid state: danger ring and `aria-invalid`. A non-empty `error` implies it. */
    invalid?: boolean;
    label?: React.ReactNode;
    /** Shows the muted optional marker after the label text (`labels.optional`). */
    optional?: boolean;
    hint?: React.ReactNode;
    /** Error message; replaces the hint in the same slot and implies `invalid`. */
    error?: React.ReactNode;
    /** Right-aligned slot of the support row, e.g. `<Textarea.Counter current={n} max={500} />`. */
    counter?: React.ReactNode;
    /** Always render the support row so an appearing error does not shift the layout. */
    reserveSupportRow?: boolean;
    /** Height follows the content. `false` → fixed height with native vertical resize. */
    autoResize?: boolean;
    /** Minimum height in lines (default 3); with `autoResize={false}` the fixed height. */
    rows?: number;
    /**
     * With `autoResize`: the field grows up to this many lines, then scrolls inside (a chat
     * composer: `rows={1} maxRows={8}`). Without it the field grows without a limit.
     */
    maxRows?: number;
    /** Called with the new string value; native `onChange` still fires. */
    onValueChange?: (value: string) => void;
    /**
     * Markdown formatting, as in Composer: selecting text shows a floating toolbar (bold, italic,
     * strikethrough, code, spoiler, link, quote) and enables the hotkeys; each writes Markdown around
     * the selection.
     */
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
  error,
  counter,
  reserveSupportRow = false,
  autoResize = true,
  rows = 3,
  maxRows,
  disabled: disabledProp,
  readOnly,
  value,
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
  const size = useControlSize(sizeProp);
  const disabled = useInheritedDisabled(disabledProp);
  const ids = useFieldFrame(id, { label, hint, error, invalid }, ariaDescribedBy);
  const labels = useLabels(TEXTAREA_LABELS, labelsProp);

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

  // Clicking the padding of the field focuses the textarea (the box is a div, not a label,
  // so the counter and hints never leak into the accessible name).
  const focusFromPadding = (event: React.MouseEvent<HTMLDivElement>) => {
    const textarea = innerRef.current;
    if (!textarea || event.target === textarea || textarea.disabled) return;
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
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      aria-invalid={ids.invalid || undefined}
      aria-describedby={ids.describedBy}
      aria-busy={commit.state === "pending" || undefined}
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
      <ControlSizeProvider value={size}>
        <FieldFrame
          size={size}
          ids={ids}
          label={label}
          required={required}
          optional={optional}
          disabled={disabled}
          hint={hint}
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
        </FieldFrame>
      </ControlSizeProvider>
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
  /** Text to copy; the field's current value when omitted. */
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
