import type * as React from "react";

import { Icon } from "@/icons";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import {
  type FieldFocusRingProps,
  FieldFrame,
  type FieldFrameProps,
  useFieldFrame,
} from "@/internal/FieldFrame";
import { fieldInputTextClass, fieldSurfaceClass, fieldTierClass } from "@/internal/fieldClasses";
import { useLabels } from "@/internal/labels";
import type { ControlSize } from "@/internal/states";

import styles from "./NativeSelect.module.css";

export type NativeSelectLabels = {
  /** Muted marker after the label when `optional`. */
  optional: string;
};

export const NATIVE_SELECT_LABELS: NativeSelectLabels = { optional: "необязательно" };

export type NativeSelectProps = FieldFrameProps &
  FieldFocusRingProps &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size" | "multiple" | "children"> & {
    size?: ControlSize;
    invalid?: boolean;
    placeholder?: string;
    onValueChange?: (value: string) => void;
    labels?: Partial<NativeSelectLabels>;
    children: React.ReactNode;
    ref?: React.Ref<HTMLSelectElement>;
  };

/**
 * The system `<select>` in the field look: the OS picker opens on touch devices. Options are
 * plain `<option>` / `<optgroup>` elements.
 */
export function NativeSelect({
  size: sizeProp,
  label,
  required = false,
  optional,
  hint,
  error,
  invalid,
  focusRing,
  disabled: disabledProp = false,
  placeholder,
  id,
  value,
  defaultValue,
  onChange,
  onValueChange,
  labels: labelsProp,
  className,
  children,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: NativeSelectProps) {
  const tier = useHostTier(sizeProp);
  const { size } = tier;
  const disabled = useInheritedDisabled(disabledProp);
  const labels = useLabels(NATIVE_SELECT_LABELS, labelsProp);
  const ids = useFieldFrame(id, { label, hint, error, invalid, required }, ariaDescribedBy);
  // With a placeholder and no value, the empty option is the one shown.
  const initial = defaultValue ?? (value === undefined && placeholder ? "" : undefined);

  return tier.provide(
    <FieldFrame
      size={size}
      ids={ids}
      label={label}
      required={required}
      optional={optional}
      hint={hint}
      error={error}
      disabled={disabled}
      optionalLabel={labels.optional}
      className={className}
    >
      <span className={cx(fieldTierClass, styles.root)} {...toDataAttributes({ size })}>
        <select
          {...rest}
          id={ids.controlId}
          required={ids.required || undefined}
          disabled={disabled}
          aria-describedby={ids.describedBy}
          aria-invalid={ids.invalid || undefined}
          value={value}
          defaultValue={initial}
          className={cx(fieldSurfaceClass, fieldInputTextClass, styles.select)}
          onChange={(event) => {
            onChange?.(event);
            onValueChange?.(event.target.value);
          }}
          {...toDataAttributes({
            size,
            invalid: ids.invalid || undefined,
            "focus-ring": focusRing,
          })}
        >
          {placeholder ? (
            <option value="" className={styles.placeholder}>
              {placeholder}
            </option>
          ) : null}
          {children}
        </select>
        <span className={styles.chevron} aria-hidden="true">
          <Icon name="nav.chevronDown" />
        </span>
      </span>
    </FieldFrame>,
  );
}
NativeSelect.displayName = "NativeSelect";
