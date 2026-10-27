import { defineGlyph } from "../glyph";

/** Lucide `flip-vertical-2`: both halves nudge toward the mirror line. */
export const FlipVertical2 = /* @__PURE__ */ defineGlyph(
  "FlipVertical2",
  <>
    <path d="m17 3-5 5-5-5h10" data-motion="nudge" data-dir="down" />
    <path d="m17 21-5-5-5 5h10" data-motion="nudge" data-dir="up" />
    <path d="M4 12H2" />
    <path d="M10 12H8" />
    <path d="M16 12h-2" />
    <path d="M22 12h-2" />
  </>,
);
