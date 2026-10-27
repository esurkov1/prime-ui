import { defineGlyph } from "../glyph";

/** Lucide `flip-horizontal-2`: both halves nudge toward the mirror line. */
export const FlipHorizontal2 = /* @__PURE__ */ defineGlyph(
  "FlipHorizontal2",
  <>
    <path d="m3 7 5 5-5 5V7" data-motion="nudge" data-dir="right" />
    <path d="m21 7-5 5 5 5V7" data-motion="nudge" data-dir="left" />
    <path d="M12 20v2" />
    <path d="M12 14v2" />
    <path d="M12 8v2" />
    <path d="M12 2v2" />
  </>,
);
