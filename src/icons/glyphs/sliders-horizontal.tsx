import { defineGlyph } from "../glyph";

/** Lucide `sliders-horizontal`: the knobs slide along their tracks in alternating directions. */
export const SlidersHorizontal = /* @__PURE__ */ defineGlyph(
  "SlidersHorizontal",
  <>
    <path d="M10 5H3" />
    <path d="M12 19H3" />
    <path d="M14 3v4" data-motion="nudge" data-dir="left" />
    <path d="M16 17v4" data-motion="nudge" data-dir="right" />
    <path d="M21 12h-9" />
    <path d="M21 19h-5" />
    <path d="M21 5h-7" />
    <path d="M8 10v4" data-motion="nudge" data-dir="right" />
    <path d="M8 12H3" />
  </>,
);
