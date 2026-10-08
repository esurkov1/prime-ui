import { defineGlyph } from "../glyph";

/** Lucide `circle-chevron-left`: the chevron steps left and back. */
export const CircleChevronLeft = /* @__PURE__ */ defineGlyph(
  "CircleChevronLeft",
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m14 16-4-4 4-4" data-motion="nudge" data-dir="left" />
  </>,
);
