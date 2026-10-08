import { defineGlyph } from "../glyph";

/** Lucide `trash-2`: the lid lifts off its left edge. */
export const Trash2 = /* @__PURE__ */ defineGlyph(
  "Trash2",
  <>
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <g data-motion="tilt" data-dir="left" data-origin="bottom-left">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </g>
  </>,
);
