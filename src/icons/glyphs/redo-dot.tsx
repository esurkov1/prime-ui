import { defineGlyph } from "../glyph";

/** Lucide `redo-dot`: the arrow steps forward. */
export const RedoDot = /* @__PURE__ */ defineGlyph(
  "RedoDot",
  <>
    <circle cx="12" cy="17" r="1" />
    <g data-motion="nudge" data-dir="right">
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
    </g>
  </>,
);
