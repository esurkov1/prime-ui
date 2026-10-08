import * as React from "react";

import { Hint } from "@/components/hint/Hint";
import { Label } from "@/components/label/Label";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { formatLabel } from "@/internal/formatLabel";
import { RollingNumber } from "@/internal/RollingNumber";
import type { ControlSize } from "@/internal/states";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./FieldFrame.module.css";

/** Field props shared by every framed field (the same contract as `Input.Root`). */
export type FieldFrameProps = {
  label?: React.ReactNode;
  /** Red `*` after the label; the control gets native `required` / `aria-required`. */
  required?: boolean;
  /** Muted `labels.optional` marker after the label. */
  optional?: boolean;
  hint?: React.ReactNode;
  /** Error message; replaces the hint in the same slot and implies `invalid`. */
  error?: React.ReactNode;
  /**
   * Draws the focus ring on the field (default). `false` sets `data-focus-ring="false"` on it and
   * hides only the visual ring — focus, keyboard and ARIA are unchanged, the error ring still shows.
   * Turn it off only where focus is otherwise obvious; WCAG 2.4.7.
   */
  focusRing?: boolean;
};

/**
 * Native attributes and `ref` of a framed field's root. One rule for every field root:
 * `className`, `ref` and the rest land on the frame `<div>`, `id` on the control (the value props
 * belong to the field). Leaf fields whose root wraps a native control and has no `Field` part
 * (Textarea, Checkbox, Switch, Radio) keep `className` on the frame and send `ref` and the native
 * attributes to that control instead.
 */
export type FieldRootDomProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "id" | "children" | "defaultValue" | "defaultChecked" | "onChange"
> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** Whether a label / hint / error slot has something to render (`false` and `""` do not). */
function hasContent(node: React.ReactNode): boolean {
  return node != null && node !== false && node !== "";
}

export type FieldIds = {
  controlId: string;
  /** Id of the label element (rendered only when `label` is set). */
  labelId: string;
  hintId: string;
  errorId: string;
  /** `aria-describedby` of the control: caller ids + hint or error. */
  describedBy: string | undefined;
  /** `aria-labelledby` for a group control: the label id when a label renders, else `undefined`. */
  labelledBy: string | undefined;
  showHint: boolean;
  showError: boolean;
  invalid: boolean;
};

/** Ids, visible slots and validation state of a framed field. */
export function useFieldFrame(
  explicitId: string | undefined,
  {
    label,
    hint,
    error,
    invalid,
  }: {
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    invalid?: boolean;
  },
  ariaDescribedBy?: string,
): FieldIds {
  const generated = React.useId();
  const controlId = explicitId ?? generated;
  const labelId = `${controlId}-label`;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;
  const showError = hasContent(error);
  const showHint = !showError && hasContent(hint);
  const describedBy =
    [ariaDescribedBy, showHint ? hintId : undefined, showError ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
  return {
    controlId,
    labelId,
    hintId,
    errorId,
    describedBy,
    labelledBy: hasContent(label) ? labelId : undefined,
    showHint,
    showError,
    invalid: Boolean(invalid) || showError,
  };
}

type FieldFrameRenderProps = Omit<FieldFrameProps, "focusRing"> & {
  size: ControlSize;
  ids: FieldIds;
  disabled?: boolean;
  optionalLabel: string;
  /**
   * The control is a group (radiogroup, fieldset), not a labelable element: the label gets no
   * `htmlFor`; the group names itself with `aria-labelledby={ids.labelId}`.
   */
  group?: boolean;
  /** Right side of the label row (Slider's current value); the row renders even without a label. */
  labelEnd?: React.ReactNode;
  /** Right side of the support row (a character counter, `FieldCounter`). */
  counter?: React.ReactNode;
  /** Always render the support row so an appearing error does not shift the layout. */
  reserveSupportRow?: boolean;
  className?: string;
  children: React.ReactNode;
  /** The outer `<div>`: the host part's ref and native attributes land here. */
  ref?: React.Ref<HTMLDivElement>;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "className">;

/**
 * Label row · control · support row (hint | error on the left, an optional counter on the right),
 * spaced by the tier's `label-gap` / `hint-gap`.
 */
export function FieldFrame({
  size,
  ids,
  label,
  required,
  optional,
  hint,
  error,
  disabled,
  optionalLabel,
  group = false,
  labelEnd,
  counter,
  reserveSupportRow = false,
  className,
  children,
  ...rest
}: FieldFrameRenderProps) {
  const { showError, showHint } = ids;
  const showSupport = showError || showHint || counter != null || reserveSupportRow;
  const labelNode = hasContent(label) ? (
    <Label.Root
      id={ids.labelId}
      htmlFor={group ? undefined : ids.controlId}
      size={size}
      required={required}
      optional={optional}
      disabled={disabled}
      labels={{ optional: optionalLabel }}
      className={styles.label}
    >
      {label}
    </Label.Root>
  ) : null;

  return (
    <div
      {...rest}
      className={cx(styles.root, className)}
      {...toDataAttributes({
        size,
        invalid: ids.invalid || undefined,
        disabled: disabled || undefined,
      })}
    >
      {labelEnd != null ? (
        <div className={styles.labelRow}>
          {labelNode}
          <span className={styles.labelEnd}>{labelEnd}</span>
        </div>
      ) : (
        labelNode
      )}
      <div className={styles.body}>
        {children}
        {showSupport ? (
          <div
            className={styles.support}
            {...toDataAttributes({ size, reserve: reserveSupportRow || undefined })}
          >
            {showError ? (
              <Hint.Root id={ids.errorId} size={size} invalid className={styles.supportText}>
                {error}
              </Hint.Root>
            ) : showHint ? (
              <Hint.Root
                id={ids.hintId}
                size={size}
                disabled={disabled}
                className={styles.supportText}
              >
                {hint}
              </Hint.Root>
            ) : (
              <span className={styles.supportText} />
            )}
            {counter}
          </div>
        ) : null}
      </div>
    </div>
  );
}

type FieldCounterProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  current: number;
  max: number;
  size: ControlSize;
  /** Spoken text, a `{current}` / `{max}` template. */
  label: string;
  ref?: React.Ref<HTMLSpanElement>;
};

/** `14/40` for the eye, `labels.counter` for screen readers; danger when `current > max`. */
export function FieldCounter({ current, max, size, label, className, ...rest }: FieldCounterProps) {
  return (
    <span
      {...rest}
      className={cx(styles.counter, className)}
      data-size={size}
      data-invalid={current > max || undefined}
      aria-live="polite"
    >
      <span aria-hidden="true">
        <RollingNumber>{current}</RollingNumber>/{max}
      </span>
      <VisuallyHidden>{formatLabel(label, { current, max })}</VisuallyHidden>
    </span>
  );
}
