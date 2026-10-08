import { defineGlyph } from "@/icons/glyph";

/** Lucide `blend`: the lower circle slides into the upper one. */
export const Blend = /* @__PURE__ */ defineGlyph(
  "Blend",
  <>
    <circle cx="9" cy="9" r="7" />
    <circle cx="15" cy="15" r="7" data-motion="nudge" data-dir="up-left" />
  </>,
);
