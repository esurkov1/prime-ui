import * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { FieldCounter, FieldFrame, useFieldFrame } from "@/internal/FieldFrame";
import { mergeRefs } from "@/internal/mergeRefs";
import type { ControlSize } from "@/internal/states";

import styles from "./Textarea.module.css";

export type TextareaLabels = {
  /** Muted marker after the label when `optional`. */
  optional: string;
  /** Screen-reader text of `Textarea.Counter`; `{current}` and `{max}` are replaced. */
  counter: string;
};

const TEXTAREA_LABELS: TextareaLabels = {
  optional: "необязательно",
  counter: "{current} из {max} символов",
};

const [TextareaProvider, useTextareaContext] = createComponentContext<{
  size: ControlSize;
  labels: TextareaLabels;
}>("Textarea");

// ─── Root ────────────────────────────────────────────────────────────────────

export type TextareaRootProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size" | "children"
> & {
  size?: ControlSize;
  /** Invalid state: danger ring and `aria-invalid`. A non-empty `error` implies it. */
  invalid?: boolean;
  /**
   * Draws the focus ring on the field box (default). `false` hides only the visual ring — focus,
   * keyboard and ARIA are unchanged, the error ring still shows. Turn it off only where focus is
   * otherwise obvious (a single composer field with a caret); WCAG 2.4.7.
   */
  focusRing?: boolean;
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
  /** Called with the new string value; native `onChange` still fires. */
  onValueChange?: (value: string) => void;
  labels?: Partial<TextareaLabels>;
};

const TextareaRoot = React.forwardRef<HTMLTextAreaElement, TextareaRootProps>(
  (
    {
      id,
      className,
      size = "m",
      invalid,
      focusRing = true,
      label,
      required,
      optional = false,
      hint,
      error,
      counter,
      reserveSupportRow = false,
      autoResize = true,
      disabled,
      readOnly,
      value,
      onInput,
      onChange,
      onValueChange,
      labels: labelsProp,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const ids = useFieldFrame(id, { hint, error, invalid }, ariaDescribedBy);
    const labels = React.useMemo(() => ({ ...TEXTAREA_LABELS, ...labelsProp }), [labelsProp]);
    const contextValue = React.useMemo(() => ({ size, labels }), [size, labels]);

    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);
    const setRefs = React.useMemo(() => mergeRefs(innerRef, ref), [ref]);
    const mirrorRef = React.useRef<HTMLDivElement>(null);

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
      event.preventDefault();
      textarea.focus();
    };

    const textarea = (
      <textarea
        {...rest}
        ref={setRefs}
        id={ids.controlId}
        className={cx(styles.textarea, autoResize && styles.textareaAutoResize)}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        aria-invalid={ids.invalid || undefined}
        aria-describedby={ids.describedBy}
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
      />
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
            className={styles.root}
          >
            {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer convenience only; the textarea itself is the focus target */}
            <div
              className={cx(styles.control, className)}
              onMouseDown={focusFromPadding}
              {...toDataAttributes({
                size,
                invalid: ids.invalid || undefined,
                disabled: disabled || undefined,
                readonly: readOnly || undefined,
                "focus-ring": focusRing ? undefined : false,
              })}
            >
              {autoResize ? (
                <div ref={mirrorRef} className={styles.autoResize} data-value="">
                  {textarea}
                </div>
              ) : (
                textarea
              )}
            </div>
          </FieldFrame>
        </ControlSizeProvider>
      </TextareaProvider>
    );
  },
);

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

export const Textarea = {
  Root: TextareaRoot,
  Counter: TextareaCounter,
};
