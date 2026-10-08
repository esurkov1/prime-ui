import { defineGlyph } from "../glyph";

/** Lucide `wind`: the gusts nudge left one after another. */
export const Wind = /* @__PURE__ */ defineGlyph(
  "Wind",
  <>
    <path d="M12.8 19.6A2 2 0 1 0 14 16H2" data-motion="nudge" data-dir="left" />
    <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" data-motion="nudge" data-dir="left" data-delay="1" />
    <path d="M9.8 4.4A2 2 0 1 1 11 8H2" data-motion="nudge" data-dir="left" data-delay="2" />
  </>,
);
