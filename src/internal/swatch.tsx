import * as React from "react";
import { parseColor } from "react-aria-components";

import { Icon } from "@/icons";
import { cx } from "@/internal/cx";

import styles from "./swatch.module.css";

/*
 * Color swatches for ColorSwatches, ColorPresets and ColorPicker: the preset list, the option
 * model, the swatch button look and its tier, the swatch content (color layer + check) and the
 * small chip of the current color for triggers. Hosts only lay the swatches out.
 */

export type ColorPreset = {
  /** CSS color stored as the value (`onValueChange` returns it as is). */
  value: string;
  /** Human-readable name: the option's accessible name and the trigger's `aria-label` suffix. */
  label: string;
};

/**
 * Default quick colors: the kit palette primitives (`tokens/primitives.ts`).
 * Row 1 — step 500 of eight hues, row 2 — step 700 of the same hues.
 * Take `COLOR_PRESETS.slice(0, 8)` for a single row of eight.
 */
export const COLOR_PRESETS: readonly ColorPreset[] = [
  { value: "#ef4444", label: "Красный" },
  { value: "#f97316", label: "Оранжевый" },
  { value: "#eab308", label: "Жёлтый" },
  { value: "#22c55e", label: "Зелёный" },
  { value: "#14b8a6", label: "Бирюзовый" },
  { value: "#5068f5", label: "Синий" },
  { value: "#a855f7", label: "Фиолетовый" },
  { value: "#ec4899", label: "Розовый" },
  { value: "#b91c1c", label: "Тёмно-красный" },
  { value: "#c2410c", label: "Тёмно-оранжевый" },
  { value: "#a16207", label: "Горчичный" },
  { value: "#15803d", label: "Тёмно-зелёный" },
  { value: "#0f766e", label: "Тёмно-бирюзовый" },
  { value: "#2f4ae0", label: "Тёмно-синий" },
  { value: "#7e22ce", label: "Тёмно-фиолетовый" },
  { value: "#be185d", label: "Тёмно-розовый" },
];

/** One selectable swatch: `null` is «no color». */
export type SwatchOption = { value: string | null; label: string; contrast: "light" | "dark" };

/** The presets as swatch options, plus the «no color» option at the end when `allowEmpty`. */
export function useSwatchOptions(
  presets: readonly ColorPreset[],
  allowEmpty: boolean,
  emptyLabel: string,
): SwatchOption[] {
  return React.useMemo(
    () => [
      ...presets.map((preset) => ({ ...preset, contrast: markContrast(preset.value) })),
      ...(allowEmpty ? [{ value: null, label: emptyLabel, contrast: "dark" as const }] : []),
    ],
    [presets, allowEmpty, emptyLabel],
  );
}

/** Class of a selectable swatch (button or option) sized by `--swatch-size` / `--swatch-radius`. */
export const swatchClass = styles.swatch;

/**
 * Tier of a swatch grid, from `data-size` on the same element: `--swatch-radius`, `--swatch-gap`
 * and `--swatch-size` = `--swatch-base` − 8. The host picks the base: `--swatch-base-control`
 * (control height) or `--swatch-base-item` (menu item height).
 */
export const swatchTierClass = styles.tier;

/** Color layer of a swatch; `null` draws the "no color" checkerboard. */
export function SwatchFill({ value }: { value: string | null }) {
  if (value == null) return <span aria-hidden className={styles.checker} />;
  return (
    <svg className={styles.fill} aria-hidden="true" viewBox="0 0 1 1" preserveAspectRatio="none">
      <rect width="1" height="1" fill={value} />
    </svg>
  );
}

/** Inside a selectable swatch: the color layer and, when selected, the contrasting check. */
export function SwatchContent({ value, selected }: { value: string | null; selected: boolean }) {
  return (
    <>
      <SwatchFill value={value} />
      {selected ? <Icon name="action.check" strokeWidth={3} className={styles.check} /> : null}
    </>
  );
}

export type SwatchChipProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  value: string | null;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * The current color as a small square for a trigger (e.g. inside `Button.Root`): sized from the
 * host's `--prime-icon-size`, with the faint inner edge; `aria-hidden` — the trigger is named.
 */
export function SwatchChip({ value, className, ...rest }: SwatchChipProps) {
  return (
    <span {...rest} aria-hidden className={cx(styles.chip, className)}>
      <SwatchFill value={value} />
    </span>
  );
}

/** Case- and space-insensitive color comparison; `null` means "no color". */
export function sameColor(a: string | null, b: string | null): boolean {
  return (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();
}

/** `dark` when a dark mark contrasts better with the color than a light one (WCAG luminance). */
export function markContrast(value: string): "light" | "dark" {
  try {
    const rgb = parseColor(value).toFormat("rgb");
    const lin = (c: number) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    const l =
      0.2126 * lin(rgb.getChannelValue("red")) +
      0.7152 * lin(rgb.getChannelValue("green")) +
      0.0722 * lin(rgb.getChannelValue("blue"));
    // Equal contrast against white (L=1) and black (L=0) at L ≈ 0.179.
    return l > 0.179 ? "dark" : "light";
  } catch {
    return "dark";
  }
}
