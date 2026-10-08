import { defineGlyph } from "../glyph";

/** Lucide `square-arrow-down`: the arrow nudges downward. */
export const SquareArrowDown = /* @__PURE__ */ defineGlyph(
  "SquareArrowDown",
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <g data-motion="nudge" data-dir="down">
      <path d="M12 8v8" />
      <path d="m8 12 4 4 4-4" />
    </g>
  </>,
);
