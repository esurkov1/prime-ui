import { type PaletteColor, paletteColors } from "./states";

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
