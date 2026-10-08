/**
 * Dark theme. Not an inversion: surfaces step up in lightness (canvas → surface → raised),
 * accent and status colors move to lighter steps so text keeps WCAG AA on dark fills.
 */
const hues = ["blue", "green", "orange", "red", "yellow", "purple", "sky", "pink", "teal"] as const;
type Hue = (typeof hues)[number];
const hueRef: Record<Hue, string> = {
  blue: "cobalt",
  green: "green",
  orange: "orange",
  red: "red",
  yellow: "yellow",
  purple: "purple",
  sky: "sky",
  pink: "pink",
  teal: "teal",
};

function darkPalette() {
  const out: Record<string, { soft: string; text: string; solid: string; solidFg: string }> = {
    gray: {
      soft: "color-mix(in srgb, var(--prime-ref-color-gray-100) 12%, transparent)",
      text: "{color.gray.300}",
      solid: "{color.gray.300}",
      solidFg: "{color.gray.950}",
    },
  };
  for (const hue of hues) {
    const r = hueRef[hue];
    out[hue] = {
      soft: `color-mix(in srgb, var(--prime-ref-color-${r}-500) 16%, transparent)`,
      text: `{color.${r}.300}`,
      solid: `{color.${r}.400}`,
      solidFg: "{color.gray.950}",
    };
  }
  return out;
}

export const darkThemeOverrides = {
  color: {
    bg: {
      canvas: "{color.gray.950}",
      surface: "{color.gray.900}",
      raised: "{color.gray.875}",
      /** = canvas: nested tiles on the 900 surface need a clear step (925 read as 1.03:1). */
      sunken: "{color.gray.950}",
      inverse: "{color.gray.100}",
      scrim: "rgba(0, 0, 0, 0.6)",
    },
    fill: {
      subtle: "rgba(233, 235, 240, 0.05)",
      subtleActive: "rgba(233, 235, 240, 0.09)",
      muted: "color-mix(in srgb, var(--prime-ref-color-gray-100) 7%, transparent)",
      mutedHover: "color-mix(in srgb, var(--prime-ref-color-gray-100) 10%, transparent)",
      strong: "color-mix(in srgb, var(--prime-ref-color-gray-100) 16%, transparent)",
      strongHover: "color-mix(in srgb, var(--prime-ref-color-gray-100) 22%, transparent)",
    },
    text: {
      primary: "{color.gray.100}",
      secondary: "{color.gray.300}",
      muted: "{color.gray.400}",
      placeholder: "{color.gray.400}",
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
      softHover: "color-mix(in srgb, var(--prime-ref-color-cobalt-500) 28%, transparent)",
      text: "{color.cobalt.400}",
    },
    danger: {
      default: "{color.red.600}",
      hover: "{color.red.500}",
      fg: "{color.white}",
      soft: "color-mix(in srgb, var(--prime-ref-color-red-500) 16%, transparent)",
      text: "{color.red.300}",
      border: "{color.red.400}",
    },
    success: {
      default: "{color.green.400}",
      fg: "{color.gray.950}",
      soft: "color-mix(in srgb, var(--prime-ref-color-green-500) 16%, transparent)",
      text: "{color.green.300}",
    },
    warning: {
      default: "{color.orange.400}",
      fg: "{color.gray.950}",
      soft: "color-mix(in srgb, var(--prime-ref-color-orange-500) 16%, transparent)",
      text: "{color.orange.300}",
    },
    info: {
      default: "{color.sky.400}",
      fg: "{color.gray.950}",
      soft: "color-mix(in srgb, var(--prime-ref-color-sky-500) 16%, transparent)",
      text: "{color.sky.300}",
    },
    field: {
      bg: "color-mix(in srgb, var(--prime-ref-color-gray-100) 6%, transparent)",
      bgSurface: "color-mix(in srgb, var(--prime-ref-color-gray-100) 6%, transparent)",
      bgHover: "color-mix(in srgb, var(--prime-ref-color-gray-100) 12%, transparent)",
      bgFocus: "{color.gray.925}",
      bgDisabled: "color-mix(in srgb, var(--prime-ref-color-gray-100) 4%, transparent)",
    },
    focus: {
      ring: "{color.cobalt.400}",
    },
    control: {
      thumb: "{color.gray.100}",
      selected: "{color.gray.750}",
    },
    tooltip: {
      bg: "{color.gray.750}",
      text: "{color.gray.100}",
    },
    palette: darkPalette(),
  },
  shadow: {
    raised: "none",
    overlay: "0 0 0 1px rgba(255, 255, 255, 0.06), 0 16px 40px -8px rgba(0, 0, 0, 0.6)",
    modal: "0 0 0 1px rgba(255, 255, 255, 0.06), 0 32px 72px -16px rgba(0, 0, 0, 0.75)",
    thumb: "0 1px 3px rgba(0, 0, 0, 0.5)",
  },
} as const;
