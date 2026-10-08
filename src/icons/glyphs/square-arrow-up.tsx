import { defineGlyph } from "../glyph";

/** Lucide `square-arrow-up`: the arrow nudges up. */
export const SquareArrowUp = /* @__PURE__ */ defineGlyph(
  "SquareArrowUp",
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <g data-motion="nudge" data-dir="up">
      <path d="m16 12-4-4-4 4" />
      <path d="M12 16V8" />
    </g>
  </>,
);
