import { defineGlyph } from "../glyph";

/** Lucide `expand`: the arrows nudge outward from center. */
export const Expand = /* @__PURE__ */ defineGlyph(
  "Expand",
  <>
    <path d="m15 15 6 6" data-motion="nudge" data-dir="down-right" />
    <path d="M21 16v5h-5" data-motion="nudge" data-dir="down-right" />
    <path d="m15 9 6-6" data-motion="nudge" data-dir="up-right" />
    <path d="M21 8V3h-5" data-motion="nudge" data-dir="up-right" />
    <path d="M3 16v5h5" data-motion="nudge" data-dir="down-left" />
    <path d="m3 21 6-6" data-motion="nudge" data-dir="down-left" />
    <path d="M3 8V3h5" data-motion="nudge" data-dir="up-left" />
    <path d="M9 9 3 3" data-motion="nudge" data-dir="up-left" />
  </>,
);
