import { defineGlyph } from "../glyph";

/** Lucide `undo-dot`: the arrow nudges left. */
export const UndoDot = /* @__PURE__ */ defineGlyph(
  "UndoDot",
  <>
    <g data-motion="nudge" data-dir="left">
      <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
      <path d="M3 7v6h6" />
    </g>
    <circle cx="12" cy="17" r="1" />
  </>,
);
