import * as React from "react";

import { CheckMark } from "@/internal/CheckMark";
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

/**
 * Inside a selectable swatch: the color layer and the contrasting check, which draws in when the
 * swatch is selected and retracts when it is not (`CheckMark`, the same mark as Checkbox).
 */
export function SwatchContent({ value, selected }: { value: string | null; selected: boolean }) {
  return (
    <>
      <SwatchFill value={value} />
      <CheckMark state={selected ? "checked" : "unchecked"} className={styles.check} />
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

/**
 * sRGB channels (0–255) of a hex, `rgb()` or `hsl()` color; `null` for anything else (named colors,
 * other spaces). Kept dependency-free so the swatches stay out of the ColorPicker entry.
 */
export function colorToRgb(value: string): [number, number, number] | null {
  const input = value.trim().toLowerCase();
  const hex = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(input)?.[1];
  if (hex) {
    const full = hex.length <= 4 ? [...hex].map((c) => c + c).join("") : hex;
    return [0, 2, 4].map((i) => Number.parseInt(full.slice(i, i + 2), 16)) as [
      number,
      number,
      number,
    ];
  }
  const fn = /^(rgba?|hsla?)\(([^)]+)\)$/.exec(input);
  if (!fn) return null;
  const parts = fn[2].split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3) return null;
  const num = (part: string, scale: number) =>
    part.endsWith("%") ? (Number.parseFloat(part) / 100) * scale : Number.parseFloat(part);
  if (fn[1].startsWith("rgb")) {
    const rgb = parts.slice(0, 3).map((part) => num(part, 255));
    return rgb.every(Number.isFinite) ? (rgb as [number, number, number]) : null;
  }
  const h = Number.parseFloat(parts[0]);
  const s = num(parts[1], 1);
  const l = num(parts[2], 1);
  if (![h, s, l].every(Number.isFinite)) return null;
  const a = s * Math.min(l, 1 - l);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    return 255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)));
  };
  return [channel(0), channel(8), channel(4)];
}

/** `dark` when a dark mark contrasts better with the color than a light one (WCAG luminance). */
export function markContrast(value: string): "light" | "dark" {
  const rgb = colorToRgb(value);
  if (!rgb) return "dark";
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const l = 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
  // Equal contrast against white (L=1) and black (L=0) at L ≈ 0.179.
  return l > 0.179 ? "dark" : "light";
}
