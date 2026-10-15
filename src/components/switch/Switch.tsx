import type * as React from "react";
import type { HintTone } from "@/components/hint/Hint";

import { Spinner } from "@/components/spinner/Spinner";
import { useControllableState } from "@/hooks/useControllableState";
import {
  ChoiceField,
  ChoiceLabel,
  type ChoiceLabelProps,
  choiceInputClass,
  choiceTrackClass,
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
  onCheckedChange?: (checked: boolean) => void | Promise<void>;
  loading?: boolean;
  invalid?: boolean;
  hint?: React.ReactNode;
  hintTone?: HintTone;
  error?: React.ReactNode;
  size?: ControlSize;
  optional?: boolean;
  labels?: Partial<SwitchLabels>;
  children?: React.ReactNode;
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
  hintTone,
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
      hintTone={hintTone}
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
            className={cx(choiceVisualClass, choiceTrackClass, styles.track)}
            data-loading={busy || undefined}
            aria-hidden="true"
          >
            <span className={styles.thumb}>{busy ? <Spinner aria-hidden="true" /> : null}</span>
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
