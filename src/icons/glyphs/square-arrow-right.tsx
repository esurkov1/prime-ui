import { defineGlyph } from "../glyph";

/** Lucide `square-arrow-right`: the arrow nudges right. */
export const SquareArrowRight = /* @__PURE__ */ defineGlyph(
  "SquareArrowRight",
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <g data-motion="nudge" data-dir="right">
      <path d="M8 12h8" />
      <path d="m12 16 4-4-4-4" />
    </g>
  </>,
);
