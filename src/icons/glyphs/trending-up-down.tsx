import { defineGlyph } from "../glyph";

/** Lucide `trending-up-down`: the trends nudge in their directions. */
export const TrendingUpDown = /* @__PURE__ */ defineGlyph(
  "TrendingUpDown",
  <>
    <g data-motion="nudge" data-dir="down-right">
      <path d="M14.828 14.828 21 21" />
      <path d="M21 16v5h-5" />
    </g>
    <g data-motion="nudge" data-dir="up-left">
      <path d="m21 3-9 9-4-4-6 6" />
      <path d="M21 8V3h-5" />
    </g>
  </>,
);
