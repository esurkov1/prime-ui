import { defineGlyph } from "../glyph";

/** Lucide `circle-chevron-down`: the chevron steps down and back. */
export const CircleChevronDown = /* @__PURE__ */ defineGlyph(
  "CircleChevronDown",
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m16 10-4 4-4-4" data-motion="nudge" data-dir="down" />
  </>,
);
