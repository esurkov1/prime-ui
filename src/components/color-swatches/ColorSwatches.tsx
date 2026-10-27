import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import {
  FieldFrame,
  type FieldFrameProps,
  type FieldRootDomProps,
  useFieldFrame,
} from "@/internal/FieldFrame";
import { useLabels } from "@/internal/labels";
import paletteStyles from "@/internal/palette.module.css";
import type { ControlSize, PaletteColor } from "@/internal/states";
import {
  COLOR_PRESETS,
  type ColorPreset,
  PALETTE_COLOR_NAMES,
  PALETTE_ORDER,
  SwatchContent,
  sameColor,
  swatchClass,
  swatchGridClass,
  swatchTierClass,
  useBalancedColumns,
  usePaletteOptions,
  useSwatchGrid,
  useSwatchOptions,
} from "@/internal/swatch";
import { isPromiseLike, usePendingChanges } from "@/internal/usePendingChanges";

import styles from "./ColorSwatches.module.css";

export type ColorSwatchesLabels = {
  /** Accessible name of the group when there is no visible `label` and no `aria-label`. */
  group: string;
  /** The "no color" swatch (`allowEmpty`). */
  empty: string;
  /** Muted marker after the label for `optional`. */
  optional: string;
  /** Names of the palette hues (`mode="palette"`): each swatch's accessible name. */
  colorNames: Record<PaletteColor, string>;
};

export const COLOR_SWATCHES_LABELS: ColorSwatchesLabels = {
  group: "Цвет",
  empty: "Без цвета",
  optional: "необязательно",
  colorNames: PALETTE_COLOR_NAMES,
};

type ColorSwatchesBaseProps = FieldRootDomProps &
  FieldFrameProps & {
    size?: ControlSize;
    disabled?: boolean;
    invalid?: boolean;
    allowEmpty?: boolean;
    name?: string;
    id?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    labels?: Partial<ColorSwatchesLabels>;
  };

/** Any CSS color from a preset list (the default mode). */
export type ColorSwatchesColorProps = ColorSwatchesBaseProps & {
  mode?: "color";
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void | Promise<void>;
  presets?: readonly ColorPreset[];
  palette?: never;
};

/** A kit palette hue: the value is its name, the swatches its solid step in both themes. */
type ColorSwatchesPaletteProps = ColorSwatchesBaseProps & {
  mode: "palette";
  value?: PaletteColor | null;
  defaultValue?: PaletteColor | null;
  onValueChange?: (value: PaletteColor | null) => void | Promise<void>;
  presets?: never;
  palette?: readonly PaletteColor[];
};

export type ColorSwatchesProps = ColorSwatchesColorProps | ColorSwatchesPaletteProps;

/**
 * Inline color choice: a wrapping grid of swatches, one selected (`role="radiogroup"`).
 * Fits forms and dialogs where opening a palette popover would be one step too many.
 */
export function ColorSwatches(props: ColorSwatchesProps) {
  const {
    mode,
    value,
    defaultValue,
    onValueChange,
    presets = COLOR_PRESETS,
    palette = PALETTE_ORDER,
    ...rest
  } = props;
  return (
    <SwatchGrid
      {...rest}
      hues={mode === "palette"}
      presets={presets}
      palette={palette}
      value={value}
      defaultValue={defaultValue ?? null}
      onValueChange={onValueChange as ((value: string | null) => void | Promise<void>) | undefined}
    />
  );
}

const takeNext = (_current: string | null, next: string | null) => next;

/** The keys the swatch grid walks with (`useSwatchGrid`). */
const GRID_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"]);

function SwatchGrid({
  hues,
  presets,
  palette,
  value: valueProp,
  defaultValue,
  onValueChange,
  size: sizeProp,
  disabled: disabledProp = false,
  invalid,
  allowEmpty = false,
  name,
  id,
  className,
  label,
  required,
  optional,
  hint,
  hintTone,
  error,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  labels: labelsProp,
  ...rest
}: ColorSwatchesBaseProps & {
  hues: boolean;
  presets: readonly ColorPreset[];
  palette: readonly PaletteColor[];
  value: string | null | undefined;
  defaultValue: string | null;
  onValueChange: ((value: string | null) => void | Promise<void>) | undefined;
}) {
  const size = useControlSize(sizeProp);
  const disabled = useInheritedDisabled(disabledProp);
  // The label and the support row follow the form around (its tier, else `m`), not the swatches.
  const frameSize = useControlSize(undefined);
  const merged = useLabels(COLOR_SWATCHES_LABELS, labelsProp);
  // The hue names merge one level deeper: a partial `colorNames` keeps the other hues.
  const labels = React.useMemo(
    () => ({
      ...merged,
      colorNames: { ...COLOR_SWATCHES_LABELS.colorNames, ...labelsProp?.colorNames },
    }),
    [merged, labelsProp?.colorNames],
  );
  const [stored, setStored] = useControllableState<string | null>({
    value: valueProp,
    defaultValue,
  });
  // A color the owner is still saving is drawn ahead of its answer.
  const changes = usePendingChanges(stored, takeNext);
  const value = changes.shown;
  const busy = changes.pending.length > 0;

  /** Hands the pick to the owner; a promise holds it pending, picks wait until it settles. */
  const setValue = (next: string | null) => {
    if (busy || Object.is(next, value)) return;
    const outcome = onValueChange?.(next);
    if (!isPromiseLike(outcome)) {
      setStored(next);
      return;
    }
    changes.track(next, outcome, { onResolve: () => setStored(next) });
  };
  const ids = useFieldFrame(id, { label, hint, error, invalid }, ariaDescribedBy);
  const colorOptions = useSwatchOptions(presets, allowEmpty, labels.empty);
  const hueOptions = usePaletteOptions(palette, allowEmpty, labels.empty, labels.colorNames);
  const options = hues ? hueOptions : colorOptions;

  const selectedIndex = options.findIndex((option) => sameColor(option.value, value));
  const focusIndex = Math.max(0, selectedIndex);
  const grid = useSwatchGrid(options.length);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const columns = useBalancedColumns(gridRef, options.length, "[role='radio']");
  const labelledBy = ariaLabelledBy ?? ids.labelledBy;

  // A radio group: the arrows move the selection with the focus (by the visual rows).
  // While a pick is saving the focus stays with it: the keys wait, the page does not scroll.
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (busy) {
      if (GRID_KEYS.has(event.key)) event.preventDefault();
      return;
    }
    const next = grid.move(event, focusIndex);
    if (next !== null) setValue(options[next]?.value ?? null);
  };

  return (
    <FieldFrame
      {...rest}
      size={frameSize}
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
        ref={gridRef}
        id={ids.controlId}
        role="radiogroup"
        aria-label={labelledBy ? undefined : (ariaLabel ?? labels.group)}
        aria-labelledby={labelledBy}
        aria-describedby={ids.describedBy}
        aria-required={required || undefined}
        aria-invalid={ids.invalid || undefined}
        aria-busy={busy || undefined}
        className={cx(swatchTierClass, swatchGridClass, styles.grid)}
        data-base="control"
        data-stretch="true"
        style={
          {
            "--swatch-count": options.length,
            "--swatch-columns": columns,
          } as React.CSSProperties
        }
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
              ref={grid.itemRef(index)}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={option.label}
              title={option.label}
              tabIndex={index === focusIndex ? 0 : -1}
              disabled={disabled}
              className={cx(swatchClass, hues && option.value && paletteStyles.hue)}
              {...toDataAttributes({
                state: selected ? "checked" : "unchecked",
                loading: busy || undefined,
                contrast: option.contrast,
                color: hues ? (option.value ?? undefined) : undefined,
              })}
              onClick={() => setValue(option.value)}
            >
              <SwatchContent value={option.value} selected={selected} hue={hues} />
            </button>
          );
        })}
        {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      </div>
    </FieldFrame>
  );
}
