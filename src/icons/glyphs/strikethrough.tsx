import { defineGlyph } from "../glyph";

/** Lucide `strikethrough`: the strike line is drawn again. */
export const Strikethrough = /* @__PURE__ */ defineGlyph(
  "Strikethrough",
  <>
    <path d="M16 4H9a3 3 0 0 0-2.83 4" />
    <path d="M14 12a4 4 0 0 1 0 8H6" />
    <line x1="4" x2="20" y1="12" y2="12" data-motion="draw" pathLength="1" />
  </>,
);
