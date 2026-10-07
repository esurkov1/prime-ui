import type * as React from "react";

import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { toDataAttributes } from "@/internal/data-attributes";
import { FieldFrame, type FieldFrameProps, useFieldFrame } from "@/internal/FieldFrame";
import type { ControlSize } from "@/internal/states";

import styles from "./NativeSelect.module.css";

export type NativeSelectLabels = {
  /** Muted marker after the label when `optional`. */
  optional: string;
};

const NATIVE_SELECT_LABELS: NativeSelectLabels = { optional: "необязательно" };

export type NativeSelectProps = FieldFrameProps &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size" | "multiple" | "children"> & {
    size?: ControlSize;
    /** Danger ring and `aria-invalid`; a non-empty `error` implies it. */
    invalid?: boolean;
    /** First, empty option shown while nothing is picked. */
    placeholder?: string;
    /** Called with the picked value; native `onChange` still fires. */
    onValueChange?: (value: string) => void;
    labels?: Partial<NativeSelectLabels>;
    /** Native `<option>` and `<optgroup>` elements. */
    children: React.ReactNode;
    ref?: React.Ref<HTMLSelectElement>;
  };

/**
 * The system `<select>` in the field look: the OS picker opens on touch devices. Options are
 * plain `<option>` / `<optgroup>` elements.
 */
export function NativeSelect({
  size = "m",
  label,
  required = false,
  optional,
  hint,
  error,
  invalid,
  focusRing = true,
  disabled = false,
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
  const labels = { ...NATIVE_SELECT_LABELS, ...labelsProp };
  const ids = useFieldFrame(id, { hint, error, invalid }, ariaDescribedBy);
  // With a placeholder and no value, the empty option is the one shown.
  const initial = defaultValue ?? (value === undefined && placeholder ? "" : undefined);

  return (
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
      <ControlSizeProvider value={size}>
        <span className={styles.root} {...toDataAttributes({ size })}>
          <select
            {...rest}
            id={ids.controlId}
            required={required || undefined}
            disabled={disabled}
            aria-describedby={ids.describedBy}
            aria-invalid={ids.invalid || undefined}
            value={value}
            defaultValue={initial}
            className={styles.select}
            onChange={(event) => {
              onChange?.(event);
              onValueChange?.(event.target.value);
            }}
            {...toDataAttributes({
              size,
              invalid: ids.invalid || undefined,
              "focus-ring": focusRing ? undefined : false,
            })}
          >
            {placeholder ? <option value="">{placeholder}</option> : null}
            {children}
          </select>
          <span className={styles.chevron} aria-hidden="true">
            <Icon name="nav.chevronDown" />
          </span>
        </span>
      </ControlSizeProvider>
    </FieldFrame>
  );
}
NativeSelect.displayName = "NativeSelect";
