/**
 * Surface ladder: the page (layer 0) and four nested layers, plus the control fills that sit on each.
 * Computed at build time in OKLab, so the CSS gets plain colors.
 *
 * The rule (see docs/foundation.md §4):
 * - A nested layer is one step (ΔL) lighter than its parent.
 * - Reflect: with less than half a step of room before the edge, the step goes the other way.
 *   Light theme: the white ceiling makes layers alternate white / page tone. Dark: they keep rising.
 * - Snap: if less than half a step would be left after a move, the color lands on the edge, so the
 *   card on the light page is pure white.
 * - Controls (field, chip, track, neutral button) step from their host: darker in light, lighter in
 *   dark, with the same reflect. The selected segment is two steps lighter than its track.
 * - Every color keeps the hue and chroma of the page, so Graphite's cool bias survives on every layer.
 */
import { primitiveTokens } from "./primitives";

/** ΔL in OKLab between neighbouring layers. */
export const LAYER_STEP = 0.03;
/** Layers 0…4: the page and four nested surfaces. */
export const LAYER_DEPTH = 4;

export type LayerTheme = {
  /** The page color (layer 0). */
  page: string;
  /** Lightness window: no color goes outside it. */
  lo: number;
  hi: number;
  /** Direction of control fills from their host: −1 darker, +1 lighter. */
  control: 1 | -1;
};

export const LIGHT_LAYERS: LayerTheme = {
  page: primitiveTokens.color.gray[50],
  lo: 0.06,
  hi: 1,
  control: -1,
};

export const DARK_LAYERS: LayerTheme = {
  page: primitiveTokens.color.gray[950],
  lo: 0.06,
  hi: 0.95,
  control: 1,
};

type Lab = [number, number, number];

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function hexToOklab(hex: string): Lab {
  const [r, g, b] = [1, 3, 5].map((i) => toLinear(Number.parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToHex([L, a, b]: Lab): string {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return `#${rgb
    .map((v) =>
      Math.round(Math.min(1, Math.max(0, toGamma(v))) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

export const lightnessOf = (hex: string) => hexToOklab(hex)[0];

/** Lightness L with the page's hue and chroma; the white ceiling is pure white. */
function paint(theme: LayerTheme, L: number): string {
  if (L >= 0.9995) return "#ffffff";
  const [, a, b] = hexToOklab(theme.page);
  return oklabToHex([L, a, b]);
}

/**
 * `steps` steps from L towards `dir`. Reflects when less than half a step of room is left (unless
 * `reflect` is off), snaps to the edge when less than half a step would remain after the move.
 */
export function move(theme: LayerTheme, L: number, dir: 1 | -1, steps = 1, reflect = true) {
  const room = dir > 0 ? theme.hi - L : L - theme.lo;
  const d = reflect && room < LAYER_STEP / 2 ? -dir : dir;
  let next = L + d * steps * LAYER_STEP;
  if (d > 0 && theme.hi - next < LAYER_STEP / 2) next = theme.hi;
  if (d < 0 && next - theme.lo < LAYER_STEP / 2) next = theme.lo;
  return Math.min(theme.hi, Math.max(theme.lo, next));
}

export type LayerColors = {
  /** The layer itself. */
  bg: string;
  /** Fields, chips, segmented tracks, neutral buttons on this layer. */
  fill: string;
  /** Hover of that fill. */
  fillHover: string;
  /** The selected segment (thumb) on a track of this layer. */
  selected: string;
};

function colorsAt(theme: LayerTheme, L: number): LayerColors {
  const fill = move(theme, L, theme.control);
  return {
    bg: paint(theme, L),
    fill: paint(theme, fill),
    fillHover: paint(theme, move(theme, L, theme.control, 2)),
    selected: paint(theme, move(theme, fill, 1, 2, false)),
  };
}

/** Layers 0…LAYER_DEPTH of a theme, each one step from its parent. */
export function layerLadder(theme: LayerTheme): LayerColors[] {
  const out: LayerColors[] = [];
  let L = lightnessOf(theme.page);
  for (let depth = 0; depth <= LAYER_DEPTH; depth++) {
    if (depth > 0) L = move(theme, L, 1);
    out.push(colorsAt(theme, L));
  }
  return out;
}

/** Floating layers (popovers, menus, modals, drawers) sit one step above a card and never reflect. */
export function floatingLayer(theme: LayerTheme): LayerColors {
  const card = move(theme, lightnessOf(theme.page), 1);
  return colorsAt(theme, move(theme, card, 1, 1, false));
}

/** Token tree for `color.layer`: `0`…`4` plus `floating` and the two layers nested in it. */
export function layerTokens(theme: LayerTheme) {
  const ladder = layerLadder(theme);
  const floating = floatingLayer(theme);
  // A layer nested in a floating one: the same rule, from the floating lightness.
  let L = lightnessOf(floating.bg);
  const nested: LayerColors[] = [];
  for (let i = 0; i < 2; i++) {
    L = move(theme, L, 1);
    nested.push(colorsAt(theme, L));
  }
  return {
    ...Object.fromEntries(ladder.map((colors, depth) => [depth, colors])),
    floating,
    floating1: nested[0],
    floating2: nested[1],
  } as Record<string, LayerColors>;
}
