import { Check } from "lucide-react";
import * as React from "react";

import { COLOR_PRESETS, type ColorPreset } from "@/components/color-picker/ColorPresets";
import { useControllableState } from "@/hooks/useControllableState";
import { markContrast, sameColor } from "@/internal/colorSwatch";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { FieldFrame, type FieldFrameProps, useFieldFrame } from "@/internal/FieldFrame";
import type { ControlSize } from "@/internal/states";

import styles from "./ColorSwatches.module.css";

export type ColorSwatchesLabels = {
  /** Accessible name of the group when there is no visible `label` and no `aria-label`. */
  group: string;
  /** The "no color" swatch (`allowEmpty`). */
  empty: string;
  /** Muted marker after the label for `optional`. */
  optional: string;
};

const COLOR_SWATCHES_LABELS: ColorSwatchesLabels = {
  group: "Цвет",
  empty: "Без цвета",
  optional: "необязательно",
};

export type ColorSwatchesRootProps = Omit<FieldFrameProps, "focusRing"> & {
  /** Controlled color; `null` — no color. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Swatches in order. Default: `COLOR_PRESETS` (16). */
  presets?: readonly ColorPreset[];
  /** Tier: swatch = control height − 8 (20 · 24 · 28 · 32 · 40), gap = tier gap. */
  size?: ControlSize;
  disabled?: boolean;
  invalid?: boolean;
  /** Adds the "no color" swatch after the presets (value `null`). */
  allowEmpty?: boolean;
  /** Form field name: a hidden input submits the selected color (empty string for no color). */
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  labels?: Partial<ColorSwatchesLabels>;
};

type Option = { value: string | null; label: string; contrast: "light" | "dark" };

/** Number of swatches in the first visual row (the grid wraps with `auto-fill`). */
function columnsOf(items: Array<HTMLElement | null>): number {
  const first = items[0];
  if (!first) return 1;
  let count = 0;
  for (const item of items) {
    if (!item || item.offsetTop !== first.offsetTop) break;
    count += 1;
  }
  return Math.max(1, count);
}

/**
 * Inline color choice: a wrapping grid of swatches, one selected (`role="radiogroup"`).
 * Fits forms and dialogs where opening a palette popover would be one step too many.
 */
function ColorSwatchesRoot({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  presets = COLOR_PRESETS,
  size = "m",
  disabled = false,
  invalid: invalidProp,
  allowEmpty = false,
  name,
  id,
  className,
  label,
  required,
  optional,
  hint,
  error,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  labels: labelsProp,
}: ColorSwatchesRootProps) {
  const labels = { ...COLOR_SWATCHES_LABELS, ...labelsProp };
  const [value, setValue] = useControllableState<string | null>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const ids = useFieldFrame(id, { hint, error, invalid: invalidProp }, ariaDescribedBy);
  const hasLabel = label != null && label !== false;

  const options = React.useMemo<Option[]>(
    () => [
      ...presets.map((p) => ({ ...p, contrast: markContrast(p.value) })),
      ...(allowEmpty ? [{ value: null, label: labels.empty, contrast: "dark" as const }] : []),
    ],
    [allowEmpty, presets, labels.empty],
  );

  const selectedIndex = options.findIndex((o) => sameColor(o.value, value));
  const focusIndex = Math.max(0, selectedIndex);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const pick = (index: number) => {
    const next = Math.min(options.length - 1, Math.max(0, index));
    const option = options[next];
    if (!option) return;
    setValue(option.value);
    itemRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const current = itemRefs.current.indexOf(document.activeElement as HTMLButtonElement);
    const from = current === -1 ? focusIndex : current;
    const columns = columnsOf(itemRefs.current);
    switch (event.key) {
      case "ArrowRight":
        pick(from + 1);
        break;
      case "ArrowLeft":
        pick(from - 1);
        break;
      case "ArrowDown":
        if (from + columns < options.length) pick(from + columns);
        break;
      case "ArrowUp":
        if (from - columns >= 0) pick(from - columns);
        break;
      case "Home":
        pick(0);
        break;
      case "End":
        pick(options.length - 1);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  const group = (
    <div
      id={ids.controlId}
      role="radiogroup"
      aria-label={hasLabel || ariaLabelledBy ? undefined : (ariaLabel ?? labels.group)}
      aria-labelledby={ariaLabelledBy ?? (hasLabel ? ids.labelId : undefined)}
      aria-describedby={ids.describedBy}
      aria-required={required || undefined}
      aria-invalid={ids.invalid || undefined}
      aria-disabled={disabled || undefined}
      className={cx(styles.grid, !hasLabel && className)}
      {...toDataAttributes({
        size,
        invalid: ids.invalid || undefined,
        disabled: disabled || undefined,
      })}
      onKeyDown={onKeyDown}
    >
      {options.map((option, i) => {
        const selected = i === selectedIndex;
        return (
          // biome-ignore lint/a11y/useSemanticElements: a swatch is a styled button in a roving radiogroup; a native radio cannot carry the color fill and check mark
          <button
            key={option.value ?? "empty"}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.label}
            title={option.label}
            tabIndex={i === focusIndex ? 0 : -1}
            disabled={disabled}
            className={styles.option}
            {...toDataAttributes({
              state: selected ? "checked" : "unchecked",
              empty: option.value == null || undefined,
              contrast: option.contrast,
            })}
            onClick={() => setValue(option.value)}
          >
            {option.value == null ? (
              <span aria-hidden className={styles.checker} />
            ) : (
              <svg
                className={styles.fill}
                aria-hidden="true"
                viewBox="0 0 1 1"
                preserveAspectRatio="none"
              >
                <rect width="1" height="1" fill={option.value} />
              </svg>
            )}
            {selected ? <Check aria-hidden className={styles.check} strokeWidth={3} /> : null}
          </button>
        );
      })}
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
    </div>
  );

  if (!hasLabel && hint == null && error == null) return group;

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
      {group}
    </FieldFrame>
  );
}
ColorSwatchesRoot.displayName = "ColorSwatches.Root";

export const ColorSwatches = { Root: ColorSwatchesRoot };
