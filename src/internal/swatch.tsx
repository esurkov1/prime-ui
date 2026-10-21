import * as React from "react";

import { useResizeEffect } from "@/hooks/useElementSize";
import { CheckMark } from "@/internal/CheckMark";
import { cx } from "@/internal/cx";
import { fieldTierClass } from "@/internal/fieldClasses";
import { press } from "@/internal/press";
import { gridIndex } from "@/internal/rovingFocus";
import type { PaletteColor } from "@/internal/states";

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

/** Names of the palette hues, in the order a palette picker shows them. */
export const PALETTE_COLOR_NAMES: Record<PaletteColor, string> = {
  gray: "Серый",
  red: "Красный",
  orange: "Оранжевый",
  yellow: "Жёлтый",
  green: "Зелёный",
  teal: "Бирюзовый",
  sky: "Голубой",
  blue: "Синий",
  purple: "Фиолетовый",
  pink: "Розовый",
};

/** Every palette hue in the picker order (the keys of `PALETTE_COLOR_NAMES`). */
export const PALETTE_ORDER = Object.keys(PALETTE_COLOR_NAMES) as PaletteColor[];

/**
 * One selectable swatch: `null` is «no color». `contrast` picks the check mark: `light` / `dark`
 * by the color's luminance; `surface` (the «no color» checkerboard, drawn from the surface's own
 * fills) follows the theme with the primary text color; `hue` — a palette hue (`value` is its
 * name), drawn from its solid step with its own foreground.
 */
export type SwatchOption = {
  value: string | null;
  label: string;
  contrast: "light" | "dark" | "surface" | "hue";
};

/** The presets as swatch options, plus the «no color» option at the end when `allowEmpty`. */
export function useSwatchOptions(
  presets: readonly ColorPreset[],
  allowEmpty: boolean,
  emptyLabel: string,
): SwatchOption[] {
  return React.useMemo(
    () => [
      ...presets.map((preset) => ({ ...preset, contrast: markContrast(preset.value) })),
      ...(allowEmpty ? [{ value: null, label: emptyLabel, contrast: "surface" as const }] : []),
    ],
    [presets, allowEmpty, emptyLabel],
  );
}

/** The palette hues as swatch options (`value` is the hue), plus «no color» when `allowEmpty`. */
export function usePaletteOptions(
  palette: readonly PaletteColor[],
  allowEmpty: boolean,
  emptyLabel: string,
  names: Record<PaletteColor, string>,
): SwatchOption[] {
  return React.useMemo(
    () => [
      ...palette.map((hue) => ({ value: hue, label: names[hue], contrast: "hue" as const })),
      ...(allowEmpty ? [{ value: null, label: emptyLabel, contrast: "surface" as const }] : []),
    ],
    [palette, allowEmpty, emptyLabel, names],
  );
}

/**
 * Class of a selectable swatch (button or option) sized by `--swatch-size` / `--swatch-radius`,
 * with the press feedback; the donor owns its hover, focus and disabled look.
 */
export const swatchClass = cx(styles.swatch, press.press);

/**
 * The square swatch button of a trigger (ColorPresets): the field height of the tier on the same
 * element (`fieldTierClass` + `data-size`), the inner edge that darkens on hover and while open
 * (`data-state`), the press feedback and the shared disabled look.
 */
export const swatchTriggerClass = cx(styles.trigger, press.press);

/**
 * Tier of a swatch grid, on the grid element with `data-size`: the field tier plus
 * `--swatch-radius`, the gap between swatches and `--swatch-size` = base − 8, where the base is the
 * control height, or the menu item height with `data-base="item"`; on a coarse pointer at least the
 * touch target.
 */
export const swatchTierClass = cx(fieldTierClass, styles.tier);

/**
 * A grid of swatches, joined next to `swatchTierClass`: one row of `--swatch-count` swatches (the
 * host sets it) while the width allows, then `--swatch-columns` (`useBalancedColumns`) balanced
 * rows. `data-stretch` makes the swatches share the whole width, each across its column.
 */
export const swatchGridClass = styles.grid;

/**
 * Defines `--swatch-checker`, the kit's transparency checkerboard as a background layer, for a host
 * that lays a translucent color over it (ColorPicker's alpha track).
 */
export const checkerboardClass = styles.checkerboard;

/**
 * Color layer of a swatch; `null` draws the "no color" checkerboard; `hue` — the value is a palette
 * hue on a swatch that carries `palette.hue` + `data-color`.
 */
export function SwatchFill({ value, hue = false }: { value: string | null; hue?: boolean }) {
  if (value == null) return <span aria-hidden className={styles.checker} />;
  if (hue) return <span aria-hidden className={cx(styles.fill, styles.hueFill)} />;
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
export function SwatchContent({
  value,
  selected,
  hue = false,
}: {
  value: string | null;
  selected: boolean;
  hue?: boolean;
}) {
  return (
    <>
      <SwatchFill value={value} hue={hue} />
      <CheckMark state={selected ? "checked" : "unchecked"} className={styles.check} />
    </>
  );
}

type SwatchChipProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
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

/**
 * A typed hex color as `#rrggbb` (lowercase): `#` optional, 3 or 6 digits, spaces around ignored;
 * `null` for anything else.
 */
export function parseHexColor(text: string): string | null {
  const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text.trim())?.[1]?.toLowerCase();
  if (!hex) return null;
  return `#${hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex}`;
}

/** Case- and space-insensitive color comparison; `null` means "no color". */
export function sameColor(a: string | null, b: string | null): boolean {
  return (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();
}

/**
 * sRGB channels (0–255) of a hex, `rgb()` or `hsl()` color; `null` for anything else (named colors,
 * other spaces). Kept dependency-free so the swatches stay out of the ColorPicker entry.
 */
function colorToRgb(value: string): [number, number, number] | null {
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
function markContrast(value: string): "light" | "dark" {
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

/**
 * Columns of a grid of `count` swatches in `width`: as many tier-sized swatches as fit, then spread
 * evenly over the rows that needs (16 in a row of 14 → two rows of 8, not 14 + 2).
 */
function balancedColumns(count: number, width: number, cell: number, gap: number): number {
  if (count < 1 || width <= 0 || cell <= 0) return Math.max(1, count);
  const fit = Math.max(1, Math.floor((width + gap) / (cell + gap)));
  const rows = Math.ceil(count / Math.min(count, fit));
  return Math.ceil(count / rows);
}

/**
 * `--swatch-columns` of a swatch grid: balanced rows at its current width (none before the first
 * measure). `cellSelector` finds a swatch, whose height is the tier size (ColorSwatches, ColorPresets).
 */
export function useBalancedColumns(
  gridRef: React.RefObject<HTMLElement | null>,
  count: number,
  cellSelector: string,
): number | undefined {
  const [columns, setColumns] = React.useState<number>();
  const measure = React.useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    // The swatch height is the tier size; the width stretches with the column.
    const cell = grid.querySelector<HTMLElement>(cellSelector)?.offsetHeight ?? 0;
    const gap = Number.parseFloat(getComputedStyle(grid).columnGap) || 0;
    setColumns(cell > 0 ? balancedColumns(count, grid.clientWidth, cell, gap) : undefined);
  }, [gridRef, count, cellSelector]);
  React.useLayoutEffect(measure, [measure]);
  useResizeEffect(gridRef, measure);
  return columns;
}

/** Number of swatches in the first visual row (the swatches wrap to the container width). */
function firstRowLength(items: Array<HTMLElement | null>): number {
  const top = items[0]?.offsetTop;
  const count = items.findIndex((item) => !item || item.offsetTop !== top);
  return Math.max(1, count === -1 ? items.length : count);
}

/**
 * Roving focus over a grid of `count` swatches (ColorSwatches, ColorPresets): `itemRef(index)` on
 * each swatch; `move(event, from, columns?)` takes the arrows, Home and End from the focused swatch
 * (else `from`), focuses the swatch they reach and returns its index — `null` for any other key.
 * Without `columns` the rows are the visual ones (a grid that wraps to its width).
 */
export function useSwatchGrid(count: number) {
  const items = React.useRef<Array<HTMLElement | null>>([]);
  const itemRef = React.useCallback(
    (index: number) => (node: HTMLElement | null) => {
      items.current[index] = node;
    },
    [],
  );
  const move = React.useCallback(
    (event: React.KeyboardEvent, from: number, columns?: number): number | null => {
      const focused = document.activeElement;
      const current = focused instanceof HTMLElement ? items.current.indexOf(focused) : -1;
      const next = gridIndex(
        event.key,
        current === -1 ? from : current,
        count,
        columns ?? firstRowLength(items.current),
      );
      if (next === null) return null;
      event.preventDefault();
      items.current[next]?.focus();
      return next;
    },
    [count],
  );
  const focus = React.useCallback((index: number) => {
    items.current[index]?.focus({ preventScroll: true });
  }, []);
  return { itemRef, move, focus };
}
