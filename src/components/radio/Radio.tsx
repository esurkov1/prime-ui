import * as React from "react";
import type { HintTone } from "@/components/hint/Hint";

import { useControllableState } from "@/hooks/useControllableState";
import {
  ChoiceField,
  ChoiceLabel,
  type ChoiceLabelProps,
  choiceBoxClass,
  choiceInputClass,
  choiceVisualClass,
} from "@/internal/ChoiceField";
import { useControlSize, useHostTier } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useDisabledControl, useInheritedDisabled } from "@/internal/disabledContext";
import { FieldFrame, type FieldRootDomProps, useFieldFrame } from "@/internal/FieldFrame";
import { fieldTierClass } from "@/internal/fieldClasses";
import { useLabels } from "@/internal/labels";
import type { ControlSize } from "@/internal/states";
import { isPromiseLike, usePendingChanges } from "@/internal/usePendingChanges";

import styles from "./Radio.module.css";

export type RadioGroupLabels = {
  /** Muted marker after the group label when `optional`. */
  optional: string;
};

export const RADIO_GROUP_LABELS: RadioGroupLabels = { optional: "необязательно" };

// ─── Group ───────────────────────────────────────────────────────────────────

type RadioGroupContextValue = {
  name: string;
  value: string | undefined;
  setValue: (value: string) => void;
  size: ControlSize;
  disabled: boolean;
  /** A pick is saving (a promise from `onValueChange`): the options take no press. */
  busy: boolean;
  invalid: boolean;
  required: boolean;
};

const [RadioGroupProvider, useRadioGroupContext] =
  createComponentContext<RadioGroupContextValue>("Radio.Group");

export type RadioGroupProps = Omit<FieldRootDomProps, "dir"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void | Promise<void>;
  name?: string;
  size?: ControlSize;
  disabled?: boolean;
  label?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  hint?: React.ReactNode;
  hintTone?: HintTone;
  error?: React.ReactNode;
  invalid?: boolean;
  orientation?: "vertical" | "horizontal";
  id?: string;
  labels?: Partial<RadioGroupLabels>;
  children?: React.ReactNode;
};

/**
 * The field: label · radiogroup · hint or error. `className`, `ref` and the rest go to the frame,
 * `id` and the `aria-label*` / `aria-describedby` names to the radiogroup.
 */
function RadioGroup({
  id,
  value: valueProp,
  defaultValue,
  onValueChange,
  name: nameProp,
  size: sizeProp,
  disabled: disabledProp = false,
  label,
  required = false,
  optional = false,
  hint,
  hintTone,
  error,
  invalid,
  orientation = "vertical",
  labels: labelsProp,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
  children,
  ...rest
}: RadioGroupProps) {
  const tier = useHostTier(sizeProp);
  const size = tier.size;
  const labels = useLabels(RADIO_GROUP_LABELS, labelsProp);
  const disabled = useInheritedDisabled(disabledProp);
  const ids = useFieldFrame(id, { label, hint, error, invalid }, ariaDescribedBy);
  const name = nameProp ?? ids.controlId;
  const [stored, setStored] = useControllableState<string | undefined>({
    value: valueProp,
    defaultValue,
  });
  // A value the owner is still saving is drawn ahead of its answer.
  const changes = usePendingChanges(stored, takeNext);
  const value = changes.shown;
  const busy = changes.pending.length > 0;

  /** Hands the pick to the owner; a promise holds it pending, picks wait until it settles. */
  const commit = (next: string) => {
    if (busy || next === value) return;
    const outcome = onValueChange?.(next);
    if (!isPromiseLike(outcome)) {
      setStored(next);
      return;
    }
    changes.track(next, outcome, { onResolve: () => setStored(next) });
  };
  const commitRef = React.useRef(commit);
  commitRef.current = commit;
  const setValue = React.useCallback((next: string) => commitRef.current(next), []);

  const ctxValue = React.useMemo(
    () => ({ name, value, setValue, size, disabled, busy, invalid: ids.invalid, required }),
    [name, value, setValue, size, disabled, busy, ids.invalid, required],
  );

  return (
    <RadioGroupProvider value={ctxValue}>
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
          disabled={disabled}
          optionalLabel={labels.optional}
          group
          className={className}
        >
          <div
            id={ids.controlId}
            role="radiogroup"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy ?? ids.labelledBy}
            aria-describedby={ids.describedBy}
            aria-invalid={ids.invalid || undefined}
            aria-required={required || undefined}
            aria-busy={busy || undefined}
            aria-orientation={orientation}
            className={styles.group}
            // While a pick is saving the focus stays with it: the native arrows wait.
            onKeyDown={busy ? holdArrows : undefined}
            {...toDataAttributes({ size, orientation })}
          >
            {children}
          </div>
        </FieldFrame>,
      )}
    </RadioGroupProvider>
  );
}
RadioGroup.displayName = "Radio.Group";

const takeNext = (_current: string | undefined, next: string | undefined) => next;

const holdArrows = (event: React.KeyboardEvent) => {
  if (event.key.startsWith("Arrow")) event.preventDefault();
};

// ─── Item ────────────────────────────────────────────────────────────────────

export type RadioRootProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "checked" | "defaultChecked" | "onChange" | "name" | "value"
> & {
  value: string;
  hint?: React.ReactNode;
  hintTone?: HintTone;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
};

function RadioRoot({
  id,
  value,
  hint,
  hintTone,
  disabled: disabledProp = false,
  className,
  "aria-describedby": ariaDescribedBy,
  children,
  ref,
  ...inputRest
}: RadioRootProps) {
  const group = useRadioGroupContext();
  const ids = useFieldFrame(id, { hint, invalid: group.invalid }, ariaDescribedBy);
  const disabled = group.disabled || disabledProp;
  const off = useDisabledControl(disabled);
  const checked = group.value === value;

  return (
    <ChoiceField
      ids={ids}
      size={group.size}
      state={checked ? "checked" : "unchecked"}
      disabled={disabled}
      busy={group.busy}
      groupOption
      hint={hint}
      hintTone={hintTone}
      className={cx(styles.root, className)}
      control={
        <>
          <input
            {...inputRest}
            ref={ref}
            id={ids.controlId}
            type="radio"
            // A reachable disabled option leaves the named group: the arrows skip it and the
            // form neither submits nor validates it.
            name={off.reachable ? undefined : group.name}
            value={value}
            checked={checked}
            onChange={() => {
              if (!disabled) group.setValue(value);
            }}
            required={(!off.reachable && group.required) || undefined}
            className={choiceInputClass}
            disabled={off.native}
            aria-disabled={off.ariaDisabled}
            aria-invalid={ids.invalid || undefined}
            aria-describedby={ids.describedBy}
          />
          <span
            className={cx(choiceVisualClass, choiceBoxClass, styles.control)}
            aria-hidden="true"
          >
            <span className={styles.dot} />
          </span>
        </>
      }
    >
      {children}
    </ChoiceField>
  );
}
RadioRoot.displayName = "Radio.Root";

export type RadioLabelProps = ChoiceLabelProps;

function RadioLabel(props: RadioLabelProps) {
  return <ChoiceLabel {...props} />;
}
RadioLabel.displayName = "Radio.Label";

export type RadioIndicatorProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  checked?: boolean;
  disabled?: boolean;
  size?: ControlSize;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * The radio circle alone, without an input: a decorative mark for an element that carries the
 * state itself (`role="radio"` with `aria-checked`, a choice card). It is `aria-hidden` and takes
 * no focus or clicks.
 */
function RadioIndicator({
  checked = false,
  disabled = false,
  size: sizeProp,
  className,
  ...rest
}: RadioIndicatorProps) {
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
        state: checked ? "checked" : "unchecked",
        disabled: disabled || undefined,
      })}
      {...rest}
    >
      <span className={styles.dot} />
    </span>
  );
}
RadioIndicator.displayName = "Radio.Indicator";

export const Radio = {
  Group: RadioGroup,
  Root: RadioRoot,
  Label: RadioLabel,
  Indicator: RadioIndicator,
};
