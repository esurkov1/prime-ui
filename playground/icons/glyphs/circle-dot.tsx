import { defineGlyph } from "@/icons/glyph";

/** Lucide `circle-dot`: the dot swells, as when selected. */
export const CircleDot = /* @__PURE__ */ defineGlyph(
  "CircleDot",
  <>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="1" data-motion="pop" />
  </>,
);
