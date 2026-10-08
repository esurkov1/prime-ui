import { defineGlyph } from "../glyph";

/** Lucide `circle-chevron-up`: the chevron nudges up for scroll navigation. */
export const CircleChevronUp = /* @__PURE__ */ defineGlyph(
  "CircleChevronUp",
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m8 14 4-4 4 4" data-motion="nudge" data-dir="up" />
  </>,
);
