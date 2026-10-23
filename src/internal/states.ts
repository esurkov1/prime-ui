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
   * The badges after a surface's title (16 · 16 · 20 · 24 · 24 for a frame xs · s · m · l · xl,
   * titles 13/16 · 13/16 · 14/20 · 16/24 · 18/24): a chip as tall as the title's line, so the
   * title row keeps its height.
   */
  cardBadges: { xs: "xs", s: "xs", m: "s", l: "m", xl: "m" },
} as const satisfies Record<string, Record<ControlSize, ControlSize>>;

/**
 * The leading mark of a list row (internal/listRow: List, Sidebar, menus, Timeline, the file queue)
 * without a `size` of its own, by row tier. It never grows the row. `line` — a row without a
 * description: a picture under the row's line, 16 · 20 · 24 · 24 · 32 (a ring or a thumbnail has no
 * size under 24). `two` — beside a description: every mark as tall as the two lines at most,
 * 32 · 32 · 40 · 40 · 40, a glyph on a tile.
 */
export const listMarkSize = {
  line: {
    avatar: { xs: "2xs", s: "xs", m: "s", l: "s", xl: "m" },
    ring: { xs: "xs", s: "xs", m: "xs", l: "xs", xl: "s" },
    thumbnail: { xs: "xs", s: "xs", m: "xs", l: "xs", xl: "s" },
  },
  two: {
    tile: { xs: "xs", s: "xs", m: "s", l: "s", xl: "s" },
    avatar: { xs: "m", s: "m", m: "l", l: "l", xl: "l" },
    ring: { xs: "s", s: "s", m: "m", l: "m", xl: "m" },
    thumbnail: { xs: "s", s: "s", m: "m", l: "m", xl: "m" },
  },
} as const satisfies {
  line: {
    avatar: Record<ControlSize, "2xs" | ControlSize>;
    ring: Record<ControlSize, ControlSize>;
    thumbnail: Record<ControlSize, ControlSize>;
  };
  two: Record<"tile" | "avatar" | "ring" | "thumbnail", Record<ControlSize, ControlSize>>;
};

/**
 * The tier of the controls in a list row (`List.ItemActions` and its kin). `line` — a row without a
 * description: buttons as tall as the row minus 8 (20 · 24 · 28 · 32 · 40; the row sets the height
 * through `--prime-control-height`), the tier whose text and icon fit that height. `two` — beside a
 * description: a tier down (`stepDown`, 28 · 28 · 32 · 36 · 40).
 */
export const listControlTier = {
  line: { xs: "xs", s: "xs", m: "xs", l: "s", xl: "l" },
  two: { xs: "xs", s: "xs", m: "s", l: "m", xl: "l" },
} as const satisfies Record<"line" | "two", Record<ControlSize, ControlSize>>;

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
