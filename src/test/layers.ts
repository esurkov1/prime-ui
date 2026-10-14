/**
 * The surface ladder as tests read it: the colors the token trees hold (`color.layer`, computed by
 * `tokens/layers.ts`) and an independent OKLab lightness to measure them with.
 */
import { semanticTokens } from "../../tokens/semantic";
import { darkThemeOverrides } from "../../tokens/themes/dark";

/** ΔL in OKLab between neighbouring layers (foundation §4). */
export const LAYER_STEP = 0.03;

type LayerColors = { bg: string; fill: string; fillHover: string; selected: string };

/** The page, layers 1–4 and the floating layer of a theme, in that order. */
export function surfaceLadder(theme: "light" | "dark"): LayerColors[] {
  const layers = theme === "light" ? semanticTokens.color.layer : darkThemeOverrides.color.layer;
  return ["0", "1", "2", "3", "4", "floating"].map((depth) => layers[depth]);
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

/** OKLab lightness of a `#rrggbb` color. */
export function lightness(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => toLinear(Number.parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
}
