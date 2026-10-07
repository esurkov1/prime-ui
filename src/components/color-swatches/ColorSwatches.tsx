import * as React from "react";

import { COLOR_PRESETS, type ColorPreset } from "@/components/color-picker/ColorPresets";
import { useControllableState } from "@/hooks/useControllableState";
import { toDataAttributes } from "@/internal/data-attributes";
import { FieldFrame, type FieldFrameProps, useFieldFrame } from "@/internal/FieldFrame";
import { gridIndex } from "@/internal/rovingFocus";
import type { ControlSize } from "@/internal/states";
import { markContrast, SwatchCheck, SwatchFill, sameColor, swatchClass } from "@/internal/swatch";

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

export type ColorSwatchesProps = Omit<FieldFrameProps, "focusRing"> & {
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

/** Number of swatches in the first visual row (the swatches wrap to the container width). */
function columnsOf(items: Array<HTMLElement | null>): number {
  const top = items[0]?.offsetTop;
  const count = items.findIndex((item) => !item || item.offsetTop !== top);
  return Math.max(1, count === -1 ? items.length : count);
}

/**
 * Inline color choice: a wrapping grid of swatches, one selected (`role="radiogroup"`).
 * Fits forms and dialogs where opening a palette popover would be one step too many.
 */
export function ColorSwatches({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  presets = COLOR_PRESETS,
  size = "m",
  disabled = false,
  invalid,
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
}: ColorSwatchesProps) {
  const labels = { ...COLOR_SWATCHES_LABELS, ...labelsProp };
  const [value, setValue] = useControllableState<string | null>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const ids = useFieldFrame(id, { hint, error, invalid }, ariaDescribedBy);
  const hasLabel = label != null && label !== false;

  const options = React.useMemo(
    () => [
      ...presets.map((preset) => ({ ...preset, contrast: markContrast(preset.value) })),
      ...(allowEmpty ? [{ value: null, label: labels.empty, contrast: "dark" as const }] : []),
    ],
    [allowEmpty, presets, labels.empty],
  );

  const selectedIndex = options.findIndex((option) => sameColor(option.value, value));
  const focusIndex = Math.max(0, selectedIndex);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current = itemRefs.current.indexOf(document.activeElement as HTMLButtonElement);
    const next = gridIndex(
      event.key,
      current === -1 ? focusIndex : current,
      options.length,
      columnsOf(itemRefs.current),
    );
    if (next === null) return;
    event.preventDefault();
    setValue(options[next].value);
    itemRefs.current[next]?.focus();
  };

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
      group
      className={className}
    >
      <div
        id={ids.controlId}
        role="radiogroup"
        aria-label={hasLabel || ariaLabelledBy ? undefined : (ariaLabel ?? labels.group)}
        aria-labelledby={ariaLabelledBy ?? (hasLabel ? ids.labelId : undefined)}
        aria-describedby={ids.describedBy}
        aria-required={required || undefined}
        aria-invalid={ids.invalid || undefined}
        aria-disabled={disabled || undefined}
        className={styles.grid}
        {...toDataAttributes({
          size,
          invalid: ids.invalid || undefined,
          disabled: disabled || undefined,
        })}
        onKeyDown={disabled ? undefined : onKeyDown}
      >
        {options.map((option, index) => {
          const selected = index === selectedIndex;
          return (
            // biome-ignore lint/a11y/useSemanticElements: a swatch is a styled button in a roving radiogroup; a native radio cannot carry the color fill and check mark
            <button
              key={option.value ?? "empty"}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={option.label}
              title={option.label}
              tabIndex={index === focusIndex ? 0 : -1}
              disabled={disabled}
              className={swatchClass}
              {...toDataAttributes({
                state: selected ? "checked" : "unchecked",
                contrast: option.contrast,
              })}
              onClick={() => setValue(option.value)}
            >
              <SwatchFill value={option.value} />
              {selected ? <SwatchCheck /> : null}
            </button>
          );
        })}
        {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      </div>
    </FieldFrame>
  );
}
