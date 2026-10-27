import * as React from "react";
import type { HintTone } from "@/components/hint/Hint";

import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { CheckMark } from "@/internal/CheckMark";
import {
  ChoiceField,
  ChoiceLabel,
  type ChoiceLabelProps,
  choiceBoxClass,
  choiceInputClass,
  choiceVisualClass,
} from "@/internal/ChoiceField";
import { useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useDisabledControl, useInheritedDisabled } from "@/internal/disabledContext";
import { useFieldFrame } from "@/internal/FieldFrame";
import { fieldTierClass } from "@/internal/fieldClasses";
import { useLabels } from "@/internal/labels";
import type { ControlSize } from "@/internal/states";
import { isPromiseLike, usePendingChanges } from "@/internal/usePendingChanges";

import styles from "./Checkbox.module.css";

export type CheckboxShape = "square" | "circle";

export type CheckboxLabels = {
  /** Muted marker after the label text when `optional`. */
  optional: string;
};

export const CHECKBOX_LABELS: CheckboxLabels = { optional: "необязательно" };

export type CheckboxRootProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "checked" | "defaultChecked" | "onChange"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void | Promise<void>;
  indeterminate?: boolean;
  invalid?: boolean;
  hint?: React.ReactNode;
  hintTone?: HintTone;
  error?: React.ReactNode;
  size?: ControlSize;
  shape?: CheckboxShape;
  optional?: boolean;
  labels?: Partial<CheckboxLabels>;
  children?: React.ReactNode;
  /** The native checkbox input. */
  ref?: React.Ref<HTMLInputElement>;
};

function CheckboxRoot({
  id,
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  indeterminate = false,
  invalid,
  hint,
  hintTone,
  error,
  size: sizeProp,
  shape = "square",
  optional = false,
  labels: labelsProp,
  disabled: disabledProp = false,
  readOnly = false,
  className,
  "aria-describedby": ariaDescribedBy,
  children,
  ref,
  ...inputRest
}: CheckboxRootProps) {
  const size = useControlSize(sizeProp);
  const disabled = useInheritedDisabled(disabledProp);
  const off = useDisabledControl(disabled);
  const labels = useLabels(CHECKBOX_LABELS, labelsProp);
  const ids = useFieldFrame(id, { hint, error, invalid }, ariaDescribedBy);
  const [stored, setStored] = useControllableState<boolean>({
    value: checkedProp,
    defaultValue: defaultChecked,
  });
  // A state the owner is still saving is drawn ahead of its answer.
  const changes = usePendingChanges(stored, takeNext);
  const checked = changes.shown;
  const busy = changes.pending.length > 0;

  const toggle = (next: boolean) => {
    const outcome = onCheckedChange?.(next);
    if (!isPromiseLike(outcome)) {
      setStored(next);
      return;
    }
    changes.track(next, outcome, { onResolve: () => setStored(next) });
  };

  const internalRef = React.useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRefs(internalRef, ref);

  // The native flag follows the prop after every render: a click clears it in the browser, and a
  // controlled owner that keeps the mixed state does not re-render with a new prop.
  React.useLayoutEffect(() => {
    if (internalRef.current) internalRef.current.indeterminate = indeterminate;
  });

  return (
    <ChoiceField
      ids={ids}
      size={size}
      state={indeterminate ? "indeterminate" : checked ? "checked" : "unchecked"}
      disabled={disabled}
      readOnly={readOnly}
      busy={busy}
      required={inputRest.required}
      optional={optional}
      optionalLabel={labels.optional}
      hint={hint}
      hintTone={hintTone}
      error={error}
      className={cx(styles.root, className)}
      control={
        <>
          <input
            {...inputRest}
            ref={mergedRef}
            id={ids.controlId}
            type="checkbox"
            className={choiceInputClass}
            name={off.reachable ? undefined : inputRest.name}
            required={off.reachable ? undefined : inputRest.required}
            disabled={off.native}
            aria-disabled={off.ariaDisabled}
            checked={checked}
            onChange={(event) => {
              // The click cleared the native mixed flag; the prop decides it.
              event.target.indeterminate = indeterminate;
              // A native checkbox ignores `readOnly`: the state stays, focus and the value submit.
              // While a change is saving, presses wait for its answer; a reachable disabled box
              // takes none.
              if (!readOnly && !busy && !disabled) toggle(event.target.checked);
            }}
            aria-invalid={ids.invalid || undefined}
            aria-readonly={readOnly || undefined}
            aria-busy={busy || undefined}
            aria-describedby={ids.describedBy}
          />
          <span
            className={cx(choiceVisualClass, choiceBoxClass, styles.control)}
            data-shape={shape}
            aria-hidden="true"
          >
            <CheckMark
              state={indeterminate ? "indeterminate" : checked ? "checked" : "unchecked"}
            />
          </span>
        </>
      }
    >
      {children}
    </ChoiceField>
  );
}
CheckboxRoot.displayName = "Checkbox.Root";

const takeNext = (_current: boolean, next: boolean) => next;

export type CheckboxLabelProps = ChoiceLabelProps;

function CheckboxLabel(props: CheckboxLabelProps) {
  return <ChoiceLabel {...props} />;
}
CheckboxLabel.displayName = "Checkbox.Label";

export type CheckboxIndicatorProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  shape?: CheckboxShape;
  size?: ControlSize;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * The checkbox box alone, without an input: a decorative mark for rows whose own element carries
 * the state (`role="option"` with `aria-selected`, `role="menuitemcheckbox"` with `aria-checked`,
 * a toggle `<button>` with `aria-pressed`).
 * Used outside `Checkbox.Root`; it is `aria-hidden` and takes no focus or clicks.
 */
function CheckboxIndicator({
  checked = false,
  indeterminate = false,
  disabled = false,
  size: sizeProp,
  shape = "square",
  className,
  ...rest
}: CheckboxIndicatorProps) {
  const size = useControlSize(sizeProp);
  return (
    <span
      aria-hidden="true"
      className={cx(
        fieldTierClass,
        choiceVisualClass,
        choiceBoxClass,
        styles.control,
        styles.indicator,
        className,
      )}
      {...toDataAttributes({
        size,
        shape,
        state: indeterminate ? "indeterminate" : checked ? "checked" : "unchecked",
        disabled: disabled || undefined,
      })}
      {...rest}
    >
      <CheckMark state={indeterminate ? "indeterminate" : checked ? "checked" : "unchecked"} />
    </span>
  );
}
CheckboxIndicator.displayName = "Checkbox.Indicator";

export const Checkbox = {
  Root: CheckboxRoot,
  Label: CheckboxLabel,
  Indicator: CheckboxIndicator,
};
