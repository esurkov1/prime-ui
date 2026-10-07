import * as React from "react";
import { Hint } from "@/components/hint/Hint";
import { Label } from "@/components/label/Label";
import { useFieldIds } from "@/hooks/useFieldIds";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
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

const [TextareaProvider, useTextareaContext] = createComponentContext<{ labels: TextareaLabels }>(
  "Textarea",
);

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
   * otherwise obvious (a single search field with a caret, e.g. a command palette); WCAG 2.4.7.
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
      invalid: invalidProp = false,
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
    const showError = error != null && error !== false && error !== "";
    const invalid = invalidProp || showError;
    const showHint = !showError && hint != null && hint !== false;
    const { inputId, hintId, errorId, describedBy } = useFieldIds(id, {
      hasHint: showHint,
      hasError: showError,
      extraDescribedBy: ariaDescribedBy,
    });
    const labels = React.useMemo(() => ({ ...TEXTAREA_LABELS, ...labelsProp }), [labelsProp]);
    const showSupport = showHint || showError || counter != null || reserveSupportRow;

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
    const handleControlMouseDown = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const textarea = innerRef.current;
      if (!textarea || e.target === textarea || textarea.disabled) return;
      e.preventDefault();
      textarea.focus();
    }, []);

    const textarea = (
      <textarea
        ref={setRefs}
        id={inputId}
        className={cx(styles.textarea, autoResize && styles.textareaAutoResize)}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
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
        {...rest}
      />
    );

    const contextValue = React.useMemo(() => ({ labels }), [labels]);

    return (
      <TextareaProvider value={contextValue}>
        <ControlSizeProvider value={size}>
          <div
            className={styles.field}
            {...toDataAttributes({ size, invalid: invalid || undefined })}
          >
            {label != null ? (
              <div className={styles.header}>
                <Label.Root
                  htmlFor={inputId}
                  size={size}
                  disabled={disabled}
                  required={required}
                  optional={optional}
                  labels={{ optional: labels.optional }}
                >
                  {label}
                </Label.Root>
              </div>
            ) : null}
            <div className={styles.body}>
              {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer convenience only; the textarea itself is the focus target */}
              <div
                className={cx(styles.control, className)}
                onMouseDown={handleControlMouseDown}
                {...toDataAttributes({
                  size,
                  invalid: invalid || undefined,
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
              {showSupport ? (
                <div className={styles.support} data-reserve={reserveSupportRow || undefined}>
                  {showError ? (
                    <Hint.Root id={errorId} size={size} invalid className={styles.supportText}>
                      {error}
                    </Hint.Root>
                  ) : showHint ? (
                    <Hint.Root
                      id={hintId}
                      size={size}
                      disabled={disabled}
                      className={styles.supportText}
                    >
                      {hint}
                    </Hint.Root>
                  ) : (
                    <span className={styles.supportText} />
                  )}
                  {counter != null ? <div className={styles.supportCounter}>{counter}</div> : null}
                </div>
              ) : null}
            </div>
          </div>
        </ControlSizeProvider>
      </TextareaProvider>
    );
  },
);

TextareaRoot.displayName = "Textarea.Root";

// ─── Counter ─────────────────────────────────────────────────────────────────

export type TextareaCounterProps = {
  current: number;
  max: number;
  className?: string;
};

/** Character counter for the `counter` slot; turns danger when `current > max`. */
function TextareaCounter({ current, max, className }: TextareaCounterProps) {
  const { labels } = useTextareaContext();
  const spoken = labels.counter.replace("{current}", String(current)).replace("{max}", String(max));
  return (
    <span
      className={cx(styles.counter, className)}
      data-invalid={current > max ? "true" : undefined}
      aria-live="polite"
    >
      <span aria-hidden="true">
        {current}/{max}
      </span>
      <span className={styles.srOnly}>{spoken}</span>
    </span>
  );
}

TextareaCounter.displayName = "Textarea.Counter";

export const Textarea = {
  Root: TextareaRoot,
  Counter: TextareaCounter,
};
