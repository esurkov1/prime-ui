import { chartColors } from "@/theme/chartColors";

import { type PaletteColor, paletteColors } from "./states";

/**
 * A palette hue as a data mark: its step of the categorical chart palette, so a category has one
 * color in charts and in shares. The one source of `--hue-chart` in `palette.module.css` (kept equal
 * by `palette.test.ts`); as strings here, because a chart library takes its colors in JS. Gray is
 * `chart-other`; sky has no chart step (it sits too close to blue) and keeps its solid.
 */
export const HUE_CHART: Record<PaletteColor, string> = {
  blue: chartColors.series[0],
  orange: chartColors.series[1],
  teal: chartColors.series[2],
  yellow: chartColors.series[3],
  pink: chartColors.series[4],
  green: chartColors.series[5],
  purple: chartColors.series[6],
  red: chartColors.series[7],
  gray: chartColors.other,
  sky: "var(--prime-color-palette-sky-solid)",
};

/** The hues a person may get: every palette color but the neutral gray. */
const PERSON_HUES = paletteColors.filter((color) => color !== "gray");

/**
 * A palette hue for a person, stable per `id`: the same id always gets the same hue, on every
 * render and every device (a string hash, no state). For names in a group chat and initials of
 * avatars that carry no meaning of their own.
 */
export function hueOf(id: string): PaletteColor {
  // FNV-1a: short ids that differ in one letter still land on different hues.
  let hash = 0x811c9dc5;
  for (let index = 0; index < id.length; index++) {
    hash ^= id.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return PERSON_HUES[(hash >>> 0) % PERSON_HUES.length] as PaletteColor;
}
