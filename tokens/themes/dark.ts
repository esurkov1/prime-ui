/**
 * Dark theme. Not an inversion: the surface ladder rises in lightness from a near-black page
 * (`layers.ts`), accent and status colors move to lighter steps so text keeps WCAG AA on dark fills.
 */
import { hueRef, hues } from "../hues";
import { DARK_LAYERS, layerTokens } from "../layers";
import type { PaletteRoles } from "../semantic";

/** Gray soft is mixed into the surface by `internal/palette.module.css` in both themes. */
function darkPalette() {
  const out: Record<string, PaletteRoles> = {
    gray: {
      text: "{color.gray.300}",
      solid: "{color.gray.300}",
      solidFg: "{color.gray.950}",
    },
  };
  for (const hue of hues) {
    const r = hueRef[hue];
    out[hue] = {
      soft: `color-mix(in srgb, {color.${r}.500} 16%, transparent)`,
      text: `{color.${r}.300}`,
      solid: `{color.${r}.400}`,
      solidFg: "{color.gray.950}",
    };
  }
  return out;
}

export const darkThemeOverrides = {
  color: {
    layer: layerTokens(DARK_LAYERS),
    bg: {
      inverse: "{color.gray.100}",
      scrim: "color-mix(in srgb, {color.black} 60%, transparent)",
      /** Darker than the scrim's share: a shade on a 900 surface needs more ink to read. */
      edgeShadow: "color-mix(in srgb, {color.black} 28%, transparent)",
      glass: "color-mix(in srgb, {color.gray.875} 76%, transparent)",
      glassEdge: "color-mix(in srgb, {color.white} 28%, transparent)",
    },
    fill: {
      subtle: "color-mix(in srgb, {color.gray.100} 5%, transparent)",
      subtleActive: "color-mix(in srgb, {color.gray.100} 9%, transparent)",
      faint: "color-mix(in srgb, {color.gray.100} 2%, transparent)",
      strong: "color-mix(in srgb, {color.gray.100} 16%, transparent)",
      strongHover: "color-mix(in srgb, {color.gray.100} 22%, transparent)",
    },
    text: {
      primary: "{color.gray.100}",
      secondary: "{color.gray.300}",
      /** gray.350: AA on every layer, its fill and the fill's hover (a hovered field, row, chip). */
      muted: "{color.gray.350}",
      placeholder: "{color.gray.350}",
      disabled: "{color.gray.600}",
      inverse: "{color.gray.925}",
    },
    border: {
      faint: "{color.gray.850}",
      /** One step above raised (875) so hairlines stay visible on floating layers too. */
      subtle: "{color.gray.800}",
      default: "{color.gray.750}",
      control: "transparent",
    },
    accent: {
      default: "{color.cobalt.600}",
      hover: "{color.cobalt.500}",
      fg: "{color.white}",
      soft: "{color.cobalt.950}",
      softHover: "color-mix(in srgb, {color.cobalt.500} 28%, transparent)",
      text: "{color.cobalt.400}",
    },
    danger: {
      default: "{color.red.600}",
      hover: "{color.red.500}",
      fg: "{color.white}",
      soft: "color-mix(in srgb, {color.red.500} 16%, transparent)",
      text: "{color.red.300}",
      border: "{color.red.400}",
    },
    success: {
      default: "{color.green.400}",
      hover: "{color.green.300}",
      fg: "{color.gray.950}",
      soft: "color-mix(in srgb, {color.green.500} 16%, transparent)",
      text: "{color.green.300}",
      border: "{color.green.400}",
    },
    warning: {
      default: "{color.orange.400}",
      fg: "{color.gray.950}",
      soft: "color-mix(in srgb, {color.orange.500} 16%, transparent)",
      text: "{color.orange.300}",
    },
    info: {
      default: "{color.sky.400}",
      fg: "{color.gray.950}",
      soft: "color-mix(in srgb, {color.sky.500} 16%, transparent)",
      text: "{color.sky.300}",
    },
    field: {
      bgDisabled: "color-mix(in srgb, {color.gray.100} 4%, transparent)",
    },
    focus: {
      ring: "{color.cobalt.400}",
    },
    control: {
      thumb: "{color.gray.100}",
      thumbDisabled: "{color.gray.600}",
    },
    skeleton: {
      fill: "color-mix(in srgb, {color.gray.100} 10%, transparent)",
    },
    /** A light chip over the dark UI: inverse like in light, so it reads over any layer. */
    tooltip: {
      bg: "{color.gray.100}",
      text: "{color.gray.925}",
      muted: "{color.gray.600}",
      fill: "color-mix(in srgb, {color.gray.925} 8%, transparent)",
    },
    palette: darkPalette(),
    /** The outgoing bubble is the accent itself in dark, as messengers do; text on it is light. */
    message: {
      outgoing: {
        bg: "{color.cobalt.700}",
        text: "{color.white}",
        muted: "{color.cobalt.200}",
        accent: "{color.white}",
        accentFg: "{color.cobalt.700}",
        danger: "{color.red.100}",
        fill: "color-mix(in srgb, {color.white} 14%, transparent)",
        fillHover: "color-mix(in srgb, {color.white} 20%, transparent)",
        track: "color-mix(in srgb, {color.white} 36%, transparent)",
        /** A light wash over `bg`, precomposed (opaque) for the avatar ring. */
        chip: "color-mix(in srgb, {color.white} 14%, {color.cobalt.700})",
        chipHover: "color-mix(in srgb, {color.white} 20%, {color.cobalt.700})",
      },
    },
    /** Own steps for the dark grounds, validated as a set; the scale rises from the ground. */
    chart: {
      1: "{color.cobalt.500}",
      2: "{color.chart.dark.orange}",
      3: "{color.chart.dark.teal}",
      4: "{color.chart.dark.yellow}",
      5: "{color.chart.dark.pink}",
      6: "{color.chart.dark.green}",
      7: "{color.chart.dark.purple}",
      8: "{color.chart.dark.red}",
      other: "{color.gray.500}",
      grid: "{color.gray.800}",
      axis: "{color.gray.700}",
      scale: {
        1: "{color.cobalt.950}",
        2: "{color.cobalt.900}",
        3: "{color.cobalt.600}",
        4: "{color.cobalt.400}",
        5: "{color.cobalt.200}",
      },
      scaleFg: "{color.gray.950}",
    },
  },
  shadow: {
    raised: "none",
    overlay:
      "0 0 0 1px color-mix(in srgb, {color.white} 6%, transparent), 0 16px 40px -8px color-mix(in srgb, {color.black} 60%, transparent)",
    modal:
      "0 0 0 1px color-mix(in srgb, {color.white} 6%, transparent), 0 32px 72px -16px color-mix(in srgb, {color.black} 75%, transparent)",
    thumb: "0 1px 3px color-mix(in srgb, {color.black} 50%, transparent)",
  },
} as const;
