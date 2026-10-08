import { defineGlyph } from "../glyph";

/** Lucide `circle-chevron-right`: the chevron steps right and back. */
export const CircleChevronRight = /* @__PURE__ */ defineGlyph(
  "CircleChevronRight",
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m10 8 4 4-4 4" data-motion="nudge" data-dir="right" />
  </>,
);
