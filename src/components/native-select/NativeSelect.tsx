import * as React from "react";
import { Spinner } from "@/components/spinner/Spinner";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { ChevronDown } from "@/icons/glyphs/chevron-down";

import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useDisabledControl, useInheritedDisabled } from "@/internal/disabledContext";
import { FieldFrame, type FieldFrameProps, useFieldFrame } from "@/internal/FieldFrame";
import { fieldInputTextClass, fieldSurfaceClass, fieldTierClass } from "@/internal/fieldClasses";
import { GlyphSwap } from "@/internal/glyphSwap";
import { useLabels } from "@/internal/labels";
import type { ControlSize } from "@/internal/states";
import { isPromiseLike, usePendingChanges } from "@/internal/usePendingChanges";

import styles from "./NativeSelect.module.css";

export type NativeSelectLabels = {
  /** Muted marker after the label when `optional`. */
  optional: string;
};

export const NATIVE_SELECT_LABELS: NativeSelectLabels = { optional: "необязательно" };

export type NativeSelectProps = FieldFrameProps &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size" | "multiple" | "children"> & {
    size?: ControlSize;
    invalid?: boolean;
    placeholder?: string;
    onValueChange?: (value: string) => void | Promise<void>;
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
  hintTone,
  error,
  invalid,
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
  ref,
  ...rest
}: NativeSelectProps) {
  const tier = useHostTier(sizeProp);
  const { size } = tier;
  const disabled = useInheritedDisabled(disabledProp);
  const off = useDisabledControl(disabled);
  const labels = useLabels(NATIVE_SELECT_LABELS, labelsProp);
  const ids = useFieldFrame(id, { label, hint, error, invalid, required }, ariaDescribedBy);
  // With a placeholder and no value, the empty option is the one shown.
  const initial = defaultValue ?? (value === undefined && placeholder ? "" : undefined);
  // A value the owner is still saving is drawn ahead of its answer: the select is held at it
  // (controlled) until the promise settles, then `value` — or the select's own state — shows again.
  const changes = usePendingChanges<string | undefined, string>(
    value === undefined ? undefined : String(value),
    takeNext,
  );
  const busy = changes.pending.length > 0;
  const selectRef = React.useRef<HTMLSelectElement>(null);
  const mergedRef = useMergedRefs(selectRef, ref);
  // The last answered value of an uncontrolled select: a refused save puts it back.
  const settled = React.useRef("");
  React.useLayoutEffect(() => {
    if (!busy && selectRef.current) settled.current = selectRef.current.value;
  });

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // While a change is saving, picks wait for its answer: the held value stands.
    if (busy) return;
    onChange?.(event);
    const next = event.target.value;
    const outcome = onValueChange?.(next);
    if (!isPromiseLike(outcome)) return;
    const uncontrolled = value === undefined;
    changes.track(next, outcome, {
      onReject: () => {
        if (uncontrolled && selectRef.current) selectRef.current.value = settled.current;
      },
    });
  };

  return tier.provide(
    <FieldFrame
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
      className={className}
    >
      <span className={cx(fieldTierClass, styles.root)} {...toDataAttributes({ size })}>
        <select
          {...rest}
          ref={mergedRef}
          id={ids.controlId}
          name={off.reachable ? undefined : rest.name}
          required={(!off.reachable && ids.required) || undefined}
          disabled={off.native}
          aria-disabled={off.ariaDisabled}
          // A reachable disabled select (under a tooltip's trigger) opens no picker and takes no
          // key that would change it; Tab still moves on.
          onMouseDown={off.reachable ? preventDefault : rest.onMouseDown}
          onKeyDown={off.reachable ? holdKeys : rest.onKeyDown}
          aria-describedby={ids.describedBy}
          aria-invalid={ids.invalid || undefined}
          aria-busy={busy || undefined}
          value={changes.shown}
          defaultValue={changes.shown === undefined ? initial : undefined}
          className={cx(fieldSurfaceClass, fieldInputTextClass, styles.select)}
          onChange={onSelectChange}
          {...toDataAttributes({
            size,
            invalid: ids.invalid || undefined,
            disabled: disabled || undefined,
            loading: busy || undefined,
          })}
        >
          {placeholder ? (
            <option value="" className={styles.placeholder}>
              {placeholder}
            </option>
          ) : null}
          {children}
        </select>
        {/* A value saving looks as in Select: a Spinner in place of the chevron. */}
        <span className={styles.chevron} aria-hidden="true">
          <GlyphSwap>{busy ? <Spinner aria-hidden="true" /> : <ChevronDown />}</GlyphSwap>
        </span>
      </span>
    </FieldFrame>,
  );
}
NativeSelect.displayName = "NativeSelect";

const takeNext = (_current: string | undefined, next: string) => next;

const preventDefault = (event: React.SyntheticEvent) => event.preventDefault();

const holdKeys = (event: React.KeyboardEvent) => {
  if (event.key !== "Tab") event.preventDefault();
};
