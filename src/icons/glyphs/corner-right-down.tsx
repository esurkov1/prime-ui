import { defineGlyph } from "../glyph";

/** Lucide `corner-right-down`: the arrow nudges down-right. */
export const CornerRightDown = /* @__PURE__ */ defineGlyph(
  "CornerRightDown",
  <>
    <path d="m10 15 5 5 5-5" data-motion="nudge" data-dir="down-right" />
    <path d="M4 4h7a4 4 0 0 1 4 4v12" data-motion="nudge" data-dir="down-right" />
  </>,
);
