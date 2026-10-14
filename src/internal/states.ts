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

/**
 * The tier of a fixed small control inside a host (a corner close, a row toggle, a tile check, a
 * close on a tab): `xs` up to `m`, `s` for `l` and `xl`. Not a step down: in an `m` host a step
 * down would give `s`, and the control would read as one of the host's own actions.
 */
export function compactTier(size: ControlSize): ControlSize {
  return size === "l" || size === "xl" ? "s" : "xs";
}

/**
 * Named tier mappings: one per metric a host must match, each with the reason it is not a step.
 * A component never declares its own `Record<ControlSize, ControlSize>`.
 */
export const tierMappings = {
  /** An Avatar or Thumbnail leading a Select row: the media stays inside the row height. */
  rowMedia: { xs: "xs", s: "xs", m: "s", l: "s", xl: "m" },
  /**
   * The Skeleton tier whose line height equals the legend row of a label tier
   * (16 · 16 · 20 · 20 · 20), so a loading legend keeps the height of the loaded one.
   */
  legendSkeleton: { xs: "xs", s: "xs", m: "m", l: "m", xl: "m" },
  /**
   * The label tier of a legend's text (ProgressBar, ProgressCircle): a legend is secondary to its
   * indicator, so s and xl read the label of the tier below (xs · xs · m · l · l).
   */
  legendText: { xs: "xs", s: "xs", m: "m", l: "l", xl: "l" },
  /**
   * The account Avatar of a Sidebar row: the avatar of the tier, capped so it still fits the
   * compact rail with even air around it (32 at `l`, 40 at `xl`).
   */
  railAvatar: { xs: "xs", s: "s", m: "m", l: "m", xl: "l" },
} as const satisfies Record<string, Record<ControlSize, ControlSize>>;

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

/** The state of a check: a checkbox box, a check mark, a choice row. */
export type CheckState = Extract<DataState, "checked" | "unchecked" | "indeterminate">;

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
