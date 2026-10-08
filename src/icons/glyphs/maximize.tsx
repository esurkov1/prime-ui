import { defineGlyph } from "../glyph";

/** Lucide `maximize`: the corners nudge outward. */
export const Maximize = /* @__PURE__ */ defineGlyph(
  "Maximize",
  <>
    <g data-motion="nudge" data-dir="up-left">
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
    </g>
    <g data-motion="nudge" data-dir="up-right">
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
    </g>
    <g data-motion="nudge" data-dir="down-left">
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
    </g>
    <g data-motion="nudge" data-dir="down-right">
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </g>
  </>,
);
