import { defineGlyph } from "../glyph";

/** Lucide `corner-up-left`: the arrow steps up and left, and returns. */
export const CornerUpLeft = /* @__PURE__ */ defineGlyph(
  "CornerUpLeft",
  <>
    <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
    <path d="M9 14 4 9l5-5" data-motion="nudge" data-dir="up-left" />
  </>,
);
