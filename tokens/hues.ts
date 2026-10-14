/**
 * Palette hues (`color` props of Badge, Avatar, Tag…) and the primitive ramp each one is drawn
 * from. One list for both themes: `semantic.ts` and `themes/dark.ts` build their palette from it.
 */
export const hues = [
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

export type Hue = (typeof hues)[number];

/** Hue → primitive ramp (`color.<ramp>.<step>`): blue is the brand cobalt. */
export const hueRef: Record<Hue, string> = {
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
