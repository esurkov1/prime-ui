import type * as React from "react";

import { Spinner } from "@/components/spinner/Spinner";
import { useControllableState } from "@/hooks/useControllableState";
import {
  ChoiceField,
  ChoiceLabel,
  type ChoiceLabelProps,
  choiceInputClass,
  choiceVisualClass,
} from "@/internal/ChoiceField";
import { useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { useInheritedDisabled } from "@/internal/disabledContext";
import { useFieldFrame } from "@/internal/FieldFrame";
import { useLabels } from "@/internal/labels";
import type { ControlSize } from "@/internal/states";
import { isPromiseLike, usePendingChanges } from "@/internal/usePendingChanges";

import styles from "./Switch.module.css";

export type SwitchLabels = {
  /** Muted marker after the label text when `optional`. */
  optional: string;
};

export const SWITCH_LABELS: SwitchLabels = { optional: "необязательно" };

export type SwitchRootProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "checked" | "defaultChecked" | "onChange"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  /**
   * The new state. Return the save's promise to apply it on a server: the thumb waits in the new
   * position with a spinner (`aria-busy`) and presses do nothing; resolve keeps it, reject glides
   * it back.
   */
  onCheckedChange?: (checked: boolean) => void | Promise<void>;
  /**
   * Saving: a spinner in the thumb, `aria-busy`, presses do nothing. For an owner that tracks the
   * request itself; a promise from `onCheckedChange` does this on its own.
   */
  loading?: boolean;
  /** Invalid state; a non-empty `error` implies it. */
  invalid?: boolean;
  /** Help text under the label text. Hidden while `error` is shown. */
  hint?: React.ReactNode;
  /** Error message in the hint slot; implies `invalid`. */
  error?: React.ReactNode;
  /** Tier. Default: the tier of the surrounding control (a form, a panel), else `m`. */
  size?: ControlSize;
  optional?: boolean;
  labels?: Partial<SwitchLabels>;
  /** `Switch.Label`; without it only the track renders (give it an `aria-label`). */
  children?: React.ReactNode;
  /** The native `role="switch"` input. */
  ref?: React.Ref<HTMLInputElement>;
};

function SwitchRoot({
  id,
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  loading = false,
  invalid,
  hint,
  error,
  size: sizeProp,
  optional = false,
  labels: labelsProp,
  disabled: disabledProp = false,
  readOnly = false,
  className,
  "aria-describedby": ariaDescribedBy,
  children,
  ref,
  ...inputRest
}: SwitchRootProps) {
  const size = useControlSize(sizeProp);
  const labels = useLabels(SWITCH_LABELS, labelsProp);
  const disabled = useInheritedDisabled(disabledProp);
  const ids = useFieldFrame(id, { hint, error, invalid }, ariaDescribedBy);
  const [stored, setStored] = useControllableState<boolean>({
    value: checkedProp,
    defaultValue: defaultChecked,
  });
  // A state the owner is still saving is drawn ahead of its answer.
  const changes = usePendingChanges(stored, takeNext);
  const checked = changes.shown;
  const busy = loading || changes.pending.length > 0;

  const toggle = (next: boolean) => {
    const outcome = onCheckedChange?.(next);
    if (!isPromiseLike(outcome)) {
      setStored(next);
      return;
    }
    changes.track(next, outcome, { onResolve: () => setStored(next) });
  };

  return (
    <ChoiceField
      ids={ids}
      size={size}
      state={checked ? "checked" : "unchecked"}
      disabled={disabled}
      readOnly={readOnly}
      busy={busy}
      required={inputRest.required}
      optional={optional}
      optionalLabel={labels.optional}
      hint={hint}
      error={error}
      className={cx(styles.root, className)}
      control={
        <>
          <input
            {...inputRest}
            ref={ref}
            id={ids.controlId}
            className={choiceInputClass}
            type="checkbox"
            // biome-ignore lint/a11y/useAriaPropsForRole: a native checkbox exposes its checked state to role="switch"; an aria-checked copy could drift
            role="switch"
            checked={checked}
            disabled={disabled}
            aria-invalid={ids.invalid || undefined}
            aria-readonly={readOnly || undefined}
            aria-busy={busy || undefined}
            aria-describedby={ids.describedBy}
            onChange={(event) => {
              if (!readOnly && !busy) toggle(event.target.checked);
            }}
          />
          <span
            className={cx(choiceVisualClass, styles.track)}
            data-loading={busy || undefined}
            aria-hidden="true"
          >
            <span className={styles.thumb}>
              {busy ? <Spinner aria-hidden="true" className={styles.spinner} /> : null}
            </span>
          </span>
        </>
      }
    >
      {children}
    </ChoiceField>
  );
}
SwitchRoot.displayName = "Switch.Root";

const takeNext = (_current: boolean, next: boolean) => next;

export type SwitchLabelProps = ChoiceLabelProps;

function SwitchLabel(props: SwitchLabelProps) {
  return <ChoiceLabel {...props} />;
}
SwitchLabel.displayName = "Switch.Label";

export const Switch = {
  Root: SwitchRoot,
  Label: SwitchLabel,
};
