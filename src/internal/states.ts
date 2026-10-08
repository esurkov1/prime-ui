/**
 * Shared API vocabulary (docs/foundation.md §10). One name per concept; components import
 * these types instead of declaring their own aliases.
 */

/** Control size tiers: xs 28 · s 32 · m 36 · l 40 · xl 48. Default is always `m`. */
export const controlSizes = ["xs", "s", "m", "l", "xl"] as const;
export type ControlSize = (typeof controlSizes)[number];

/** The tier `n` steps smaller, never below `xs`: a control nested in another (foundation §6 pairing). */
export function stepDown(size: ControlSize, n = 1): ControlSize {
  return controlSizes[Math.max(0, controlSizes.indexOf(size) - n)] ?? "xs";
}

/** Visual treatment. */
export const variants = ["solid", "soft", "outline", "ghost"] as const;
export type Variant = (typeof variants)[number];

/** Semantic color. Destructive is `danger`. */
export const tones = ["neutral", "accent", "success", "warning", "danger", "info"] as const;
export type Tone = (typeof tones)[number];

/** Decorative palette color (Badge, Avatar). */
export const paletteColors = [
  "gray",
  "blue",
  "green",
  "orange",
  "red",
  "yellow",
  "purple",
  "sky",
  "pink",
  "teal",
] as const;
export type PaletteColor = (typeof paletteColors)[number];

/** Values of `data-state`. */
export const dataStates = [
  "open",
  "closed",
  "checked",
  "unchecked",
  "indeterminate",
  "active",
  "inactive",
] as const;
export type DataState = (typeof dataStates)[number];

/**
 * Text color (Typography, Icon). `default` is primary text, `secondary` and `muted` are the
 * two quieter steps; the rest map to the semantic `*-text` colors.
 */
export const textTones = [
  "default",
  "secondary",
  "muted",
  "accent",
  "success",
  "warning",
  "danger",
] as const;
export type TextTone = (typeof textTones)[number];
