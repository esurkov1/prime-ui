import { defineGlyph } from "../glyph";

/** Lucide `arrow-up-down`: the arrows pass each other in opposite directions. */
export const ArrowUpDown = /* @__PURE__ */ defineGlyph(
  "ArrowUpDown",
  <>
    <g data-motion="nudge" data-dir="down">
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
    </g>
    <g data-motion="nudge" data-dir="up">
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </g>
  </>,
);
