/**
 * Shared API vocabulary (docs/foundation.md §10). One name per concept; components import
 * these types instead of declaring their own aliases.
 */

/** Control size tiers: xs 28 · s 32 · m 36 · l 40 · xl 48. Default is always `m`. */
export const controlSizes = ["xs", "s", "m", "l", "xl"] as const;
export type ControlSize = (typeof controlSizes)[number];

/**
 * The default `size` of an overlay's `Content` (Modal, Drawer, Popover, Dropdown, Tooltip): a width
 * tier of its own that never follows the host's tier (foundation §10), so it does not resolve
 * through `useHostTier`.
 */
export const OVERLAY_CONTENT_SIZE = "m" satisfies ControlSize;

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
  /**
   * The change badge of a KPI card beside its value (16 · 16 · 20 · 20 · 24): a chip a size under
   * the figure, kept at 20 on `l` so it does not outweigh the 30px value.
   */
  kpiDelta: { xs: "xs", s: "xs", m: "s", l: "s", xl: "m" },
  /**
   * The legend tier in a KPI card's footer: `m` reads the compact rows, `l` the rows of the card's
   * other footer text, `xl` the rows of the 2xl ring's legend beside it (xs · xs · xs · m · xl).
   */
  kpiLegend: { xs: "xs", s: "xs", m: "xs", l: "m", xl: "xl" },
  /**
   * The badges after a surface's title (16 · 16 · 16 · 20 · 20 for a frame xs · s · m · l · xl,
   * titles 13 · 13 · 14 · 16 · 18): chips a line of the title tall at most, so the title row keeps
   * its height.
   */
  cardBadges: { xs: "xs", s: "xs", m: "xs", l: "s", xl: "s" },
} as const satisfies Record<string, Record<ControlSize, ControlSize>>;

/**
 * The mark of a surface's header (`Card.Icon` and its kin), per kind of mark, for a frame
 * xs · s · m · l · xl. `header` — the frame mark, the title with its line tall (32 · 32 · 40 · 48 ·
 * 56; a picture has no 56, so at `xl` it stands at 48 in the 56 box); `row` — a one-line card with
 * a switch, one step down (24 · 24 · 32 · 40 · 48). Each kind names the tier that has that height.
 */
export const cardMarkSize = {
  header: {
    tile: { xs: "xs", s: "xs", m: "s", l: "m", xl: "l" },
    avatar: { xs: "m", s: "m", m: "l", l: "xl", xl: "xl" },
    thumbnail: { xs: "s", s: "s", m: "m", l: "l", xl: "l" },
    ring: { xs: "s", s: "s", m: "m", l: "l", xl: "l" },
  },
  row: {
    tile: { xs: "2xs", s: "2xs", m: "xs", l: "s", xl: "m" },
    avatar: { xs: "s", s: "s", m: "m", l: "l", xl: "xl" },
    thumbnail: { xs: "xs", s: "xs", m: "s", l: "m", xl: "l" },
    ring: { xs: "xs", s: "xs", m: "s", l: "m", xl: "l" },
  },
} as const satisfies Record<
  "header" | "row",
  {
    tile: Record<ControlSize, "2xs" | ControlSize>;
    avatar: Record<ControlSize, "2xs" | "2xl" | ControlSize>;
    thumbnail: Record<ControlSize, ControlSize>;
    ring: Record<ControlSize, ControlSize>;
  }
>;

/**
 * The Avatar of a chip (`Badge.Avatar`). `line` — a one-line chip: the circle 2 px inside the
 * chip's height, flush in the smallest (chip 16 · 20 · 24 · 28 · 32 → avatar 16 · 16 · 20 · 24 ·
 * 24); a chip is lower than any control, so the scale goes one size under `xs`. `stacked` — a chip
 * with `Badge.Description`: the circle spans its two text lines (16 + 16 up to `m`, 20 + 20 from
 * `l` → avatar 32 · 32 · 32 · 40 · 40), not a step of the chip tier.
 */
export const chipAvatarSize = {
  line: { xs: "2xs", s: "2xs", m: "xs", l: "s", xl: "s" },
  stacked: { xs: "m", s: "m", m: "m", l: "l", xl: "l" },
} as const satisfies Record<"line" | "stacked", Record<ControlSize, "2xs" | ControlSize>>;

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
