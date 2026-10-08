import { defineGlyph } from "../glyph";

/** Lucide `square-arrow-left`: the arrow nudges left. */
export const SquareArrowLeft = /* @__PURE__ */ defineGlyph(
  "SquareArrowLeft",
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <g data-motion="nudge" data-dir="left">
      <path d="m12 8-4 4 4 4" />
      <path d="M16 12H8" />
    </g>
  </>,
);
