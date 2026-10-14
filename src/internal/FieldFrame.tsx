import * as React from "react";

import { Hint } from "@/components/hint/Hint";
import { Label } from "@/components/label/Label";
import { VisuallyHidden, visuallyHiddenClass } from "@/components/visually-hidden/VisuallyHidden";
import { usePresence } from "@/hooks/usePresence";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { useFieldCell } from "@/internal/fieldCell";
import { fieldHintTextClass, fieldTierClass } from "@/internal/fieldClasses";
import { formatLabel } from "@/internal/formatLabel";
import { hasContent } from "@/internal/hasContent";
import { RollingNumber } from "@/internal/RollingNumber";
import type { ControlSize } from "@/internal/states";

import styles from "./FieldFrame.module.css";

/** Field props shared by every framed field (the same contract as `Input.Root`). */
export type FieldFrameProps = {
  label?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  hint?: React.ReactNode;
  error?: React.ReactNode;
};

/**
 * `focusRing` of a field whose box draws the focus ring (Input, Select, Datepicker…): `false`
 * hides only the visual ring — focus, keyboard and ARIA are unchanged, the error ring still shows
 * (WCAG 2.4.7: only where focus is otherwise obvious). The host passes it as `data-focus-ring` on
 * the box (`fieldSurface` reads `"false"`). Group controls (SegmentedControl, Slider…) have none.
 */
export type FieldFocusRingProps = {
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

/** Roles that take `aria-required` (ARIA 1.2); any other control is described as required. */
const REQUIRED_ROLES = new Set([
  "checkbox",
  "combobox",
  "gridcell",
  "listbox",
  "radiogroup",
  "spinbutton",
  "textbox",
  "tree",
  "treegrid",
]);

type ControlAriaOptions = {
  /** The control's role (default `textbox`). */
  role?: string;
  /** Id of the element that shows the value, read after the field name (a picker's text). */
  textId?: string;
  /** The value as text, appended to a consumer `aria-label` («Дата: 12.03.2026»). */
  text?: string;
  /** The consumer's `aria-label`: replaces the label as the name. */
  ariaLabel?: string;
  /** The consumer's `aria-labelledby`: replaces the label as the name. */
  ariaLabelledBy?: string;
};

type ControlAria = {
  "aria-label": string | undefined;
  "aria-labelledby": string | undefined;
  "aria-describedby": string | undefined;
  "aria-invalid": true | undefined;
  "aria-required": true | undefined;
};

export type FieldIds = {
  controlId: string;
  /** Id of the label element (rendered only when `label` is set). */
  labelId: string;
  hintId: string;
  errorId: string;
  /** Id of the frame's required word (`requiredLabel`) for a control without `aria-required`. */
  requiredId: string;
  /** `aria-describedby` of the control: caller ids + hint or error. */
  describedBy: string | undefined;
  /** `aria-labelledby` for a group control: the label id when a label renders, else `undefined`. */
  labelledBy: string | undefined;
  showHint: boolean;
  showError: boolean;
  invalid: boolean;
  /** The field's own `required`, or a required FieldList column around it. */
  required: boolean;
  /**
   * The name, description, invalid and required attributes of the control, in one place: the
   * label (or a FieldList column heading) names it with the value text after it; a consumer
   * `aria-label` / `aria-labelledby` replaces the label; a role without `aria-required` (a
   * `button` trigger) is described by the frame's required word instead.
   */
  controlAria: (options?: ControlAriaOptions) => ControlAria;
};

/** Ids, visible slots and validation state of a framed field. */
export function useFieldFrame(
  explicitId: string | undefined,
  {
    label,
    hint,
    error,
    invalid,
    required,
  }: {
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    invalid?: boolean;
    required?: boolean;
  },
  ariaDescribedBy?: string,
): FieldIds {
  const generated = React.useId();
  const cell = useFieldCell();
  const controlId = explicitId ?? generated;
  const labelId = `${controlId}-label`;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;
  const requiredId = `${controlId}-required`;
  const showError = hasContent(error);
  const showHint = !showError && hasContent(hint);
  const describedBy =
    [ariaDescribedBy, showHint ? hintId : undefined, showError ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
  // In a FieldList cell the frame renders the column heading as the label when there is none.
  const labelledBy = hasContent(label) || cell ? labelId : undefined;
  const isInvalid = Boolean(invalid) || showError;
  const isRequired = Boolean(required) || Boolean(cell?.required);
  return {
    controlId,
    labelId,
    hintId,
    errorId,
    requiredId,
    describedBy,
    labelledBy,
    showHint,
    showError,
    invalid: isInvalid,
    required: isRequired,
    controlAria: ({ role = "textbox", textId, text, ariaLabel, ariaLabelledBy } = {}) => {
      const takesRequired = REQUIRED_ROLES.has(role);
      const named = ariaLabel ? undefined : (ariaLabelledBy ?? labelledBy);
      return {
        "aria-label": ariaLabel ? (text ? `${ariaLabel}: ${text}` : ariaLabel) : undefined,
        "aria-labelledby":
          named && textId && !ariaLabelledBy ? `${named} ${textId}` : named || undefined,
        "aria-describedby":
          isRequired && !takesRequired
            ? [describedBy, requiredId].filter(Boolean).join(" ")
            : describedBy,
        "aria-invalid": isInvalid || undefined,
        "aria-required": (isRequired && takesRequired) || undefined,
      };
    },
  };
}

/**
 * `data-shake` of a frame: the control shakes once when the field turns invalid or its error
 * message changes (foundation §7, rule 14) — never for an error it mounts with. The value
 * alternates between `odd` and `even` so a new error restarts the keyframes.
 */
export function useErrorShake(
  invalid: boolean,
  error: React.ReactNode,
): "odd" | "even" | undefined {
  const key = !invalid
    ? null
    : typeof error === "string" || typeof error === "number"
      ? String(error)
      : "invalid";
  const previous = React.useRef(key);
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (key !== null && key !== previous.current) setCount((n) => n + 1);
    previous.current = key;
  }, [key]);
  if (count === 0) return undefined;
  return count % 2 ? "odd" : "even";
}

/** An error leaving the support slot (`useLeavingError`). */
type FieldLeavingError = {
  node: React.ReactNode;
  onExitEnd: (event: React.SyntheticEvent<Element>) => void;
};

/**
 * The error that has just been fixed, kept on screen while it leaves (`enterMotion.exit`) so the
 * message goes as smoothly as it arrived; the hint takes the slot after it. `null` when nothing is
 * leaving. Reduced motion drops it at once.
 */
export function useLeavingError(
  showError: boolean,
  error: React.ReactNode,
): FieldLeavingError | null {
  const last = React.useRef(error);
  if (showError) last.current = error;
  const presence = usePresence(showError, { exitDuration: "fast" });
  if (showError || !presence.mounted) return null;
  return { node: last.current, onExitEnd: presence.onExitEnd };
}

/**
 * The text slot of a support row, shared by every frame (FieldFrame, the choice rows): the error
 * (it replaces the hint), the error that has just been fixed while it leaves, or the hint. The slot
 * stays mounted while the field is, so it is a polite live region: an error that arrives or
 * changes is read, an error the field mounts with is read with the field (`aria-describedby`).
 * An option of a group (`live={false}`) leaves the announcement to the group.
 */
export function FieldSupport({
  ids,
  size,
  hint,
  error,
  leaving,
  disabled,
  live = true,
  className,
  textClassName,
}: {
  ids: FieldIds;
  size: ControlSize;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  /** The error leaving the slot: the frame's `useLeavingError`. */
  leaving: FieldLeavingError | null;
  disabled?: boolean;
  live?: boolean;
  /** The slot element. */
  className?: string;
  /** The hint or error text inside it. */
  textClassName?: string;
}) {
  let text: React.ReactNode = null;
  if (ids.showError) {
    text = (
      <Hint.Root id={ids.errorId} size={size} invalid className={textClassName}>
        {error}
      </Hint.Root>
    );
  } else if (leaving) {
    text = (
      <Hint.Root
        size={size}
        invalid
        aria-hidden="true"
        onAnimationEnd={leaving.onExitEnd}
        className={cx(textClassName, enterMotion.exit)}
      >
        {leaving.node}
      </Hint.Root>
    );
  } else if (ids.showHint) {
    text = (
      <Hint.Root id={ids.hintId} size={size} disabled={disabled} className={textClassName}>
        {hint}
      </Hint.Root>
    );
  }
  return (
    <div className={className} aria-live={live ? "polite" : undefined}>
      {text}
    </div>
  );
}

type FieldFrameRenderProps = FieldFrameProps & {
  size: ControlSize;
  ids: FieldIds;
  disabled?: boolean;
  optionalLabel: string;
  /**
   * The word a control without `aria-required` (a `button` trigger) is described by when required
   * (`ids.controlAria`); rendered visually hidden as `ids.requiredId`.
   */
  requiredLabel?: string;
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
 * spaced by the tier's `--field-label-gap` / `--field-hint-gap`. The support row stays mounted
 * (empty and without room when it shows nothing), so its text slot is a polite live region.
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
  requiredLabel,
  group = false,
  labelEnd,
  counter,
  reserveSupportRow = false,
  className,
  children,
  ...rest
}: FieldFrameRenderProps) {
  const leaving = useLeavingError(ids.showError, error);
  const showSupport =
    ids.showError || ids.showHint || leaving != null || counter != null || reserveSupportRow;
  const shake = useErrorShake(ids.invalid, error);
  // In a FieldList cell: the column heading is the label when the field has none, read but not
  // shown while the heading is on screen (`fieldCell`).
  const cell = useFieldCell();
  const shownLabel = hasContent(label) ? label : cell?.label;
  const labelNode = hasContent(shownLabel) ? (
    <Label.Root
      id={ids.labelId}
      htmlFor={group ? undefined : ids.controlId}
      size={size}
      required={required || ids.required}
      optional={optional}
      disabled={disabled}
      labels={{ optional: optionalLabel }}
      className={cx(
        styles.label,
        cell && visuallyHiddenClass,
        cell?.hidden === "wide" && styles.cellLabel,
      )}
    >
      {shownLabel}
    </Label.Root>
  ) : null;

  return (
    <div
      {...rest}
      className={cx(fieldTierClass, styles.root, className)}
      {...toDataAttributes({
        size,
        invalid: ids.invalid || undefined,
        disabled: disabled || undefined,
        group: group || undefined,
        shake,
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
        <div
          className={styles.support}
          {...toDataAttributes({
            size,
            reserve: reserveSupportRow || undefined,
            empty: !showSupport || undefined,
          })}
        >
          <FieldSupport
            ids={ids}
            size={size}
            hint={hint}
            error={error}
            leaving={leaving}
            disabled={disabled}
            className={styles.supportSlot}
            textClassName={styles.supportText}
          />
          {counter}
        </div>
      </div>
      {requiredLabel && ids.required ? (
        <VisuallyHidden id={ids.requiredId}>{requiredLabel}</VisuallyHidden>
      ) : null}
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

/**
 * `14/40` for the eye (hidden from assistive tech), `labels.counter` for screen readers through a
 * polite live region; danger when `current > max`.
 */
export function FieldCounter({ current, max, size, label, className, ...rest }: FieldCounterProps) {
  return (
    <span
      {...rest}
      className={cx(fieldHintTextClass, styles.counter, className)}
      data-size={size}
      data-invalid={current > max || undefined}
    >
      <span aria-hidden="true">
        <RollingNumber>{current}</RollingNumber>/{max}
      </span>
      <VisuallyHidden live="polite">{formatLabel(label, { current, max })}</VisuallyHidden>
    </span>
  );
}
