/**
 * A palette chip's text on its soft fill (Badge, a status Select and its options) reads at 4.5:1 in
 * both themes for every `PaletteColor`, standing on a card (layer 1) — at rest, and on the status
 * Select's hover / press step: the fill a `--prime-tint-faint` of the ink deeper, the ink a `--prime-tint-hover` of
 * the way to the primary text, so the step keeps its contrast.
 */
import { describe, expect, it } from "vitest";

import { hueRef, hues } from "../../tokens/hues";
import { primitiveTokens } from "../../tokens/primitives";
import { semanticTokens } from "../../tokens/semantic";
import { darkThemeOverrides } from "../../tokens/themes/dark";
import { surfaceLadder } from "../test/layers";

function primitive(path: string): string {
  let node: unknown = primitiveTokens;
  for (const key of path.split(".")) node = (node as Record<string, unknown>)[key];
  if (typeof node !== "string") throw new Error(`not a primitive color: ${path}`);
  return node;
}
const ref = (value: string) => primitive(/^\{(.+)\}$/.exec(value)?.[1] ?? value);

const rgb = (hex: string) => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
const hex = (c: number[]) =>
  `#${c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
/** `color-mix(in srgb, a p, b)`. */
const mix = (a: string, p: number, b: string) => {
  const [x, y] = [rgb(a), rgb(b)];
  return hex(x.map((v, i) => v * p + y[i] * (1 - p)));
};
const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminance = (color: string) => {
  const [r, g, b] = rgb(color).map((v) => toLinear(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const percent = (value: string) => Number.parseFloat(value) / 100;

describe("palette chip contrast", () => {
  const faint = percent(semanticTokens.tint.faint);
  const soft = percent(semanticTokens.tint.soft);
  const hover = percent(semanticTokens.tint.hover);

  for (const theme of ["light", "dark"] as const) {
    it(`${theme}: every hue's text reads 4.5:1 on its soft fill and its hover step`, () => {
      const card = surfaceLadder(theme)[1].bg;
      const textPrimary =
        theme === "light"
          ? ref(semanticTokens.color.text.primary)
          : ref(darkThemeOverrides.color.text.primary);
      const rows: [string, string, string][] = [];
      // Gray: a wash of the primary ink over the card, its text the gray ink.
      const grayText =
        theme === "light" ? primitive("color.gray.700") : primitive("color.gray.300");
      rows.push(["gray", grayText, mix(textPrimary, soft, card)]);
      for (const hue of hues) {
        const ramp = hueRef[hue];
        const text =
          theme === "light"
            ? primitive(`color.${ramp}.${hue === "yellow" ? 800 : 700}`)
            : primitive(`color.${ramp}.300`);
        const fill =
          theme === "light"
            ? primitive(`color.${ramp}.100`)
            : mix(primitive(`color.${ramp}.500`), 0.16, card);
        rows.push([hue, text, fill]);
      }
      for (const [hue, text, fill] of rows) {
        expect(contrast(text, fill), `${hue} at rest`).toBeGreaterThanOrEqual(4.5);
        const hoverInk = mix(textPrimary, hover, text);
        expect(contrast(hoverInk, mix(text, faint, fill)), `${hue} hover`).toBeGreaterThanOrEqual(
          4.5,
        );
      }
    });
  }
});
