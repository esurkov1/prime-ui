import { defineGlyph } from "../glyph";

/** Lucide `align-horizontal-space-around`: outer lines nudge outward. */
export const AlignHorizontalSpaceAround = /* @__PURE__ */ defineGlyph(
  "AlignHorizontalSpaceAround",
  <>
    <rect width="6" height="10" x="9" y="7" rx="2" />
    <g data-motion="nudge" data-dir="left">
      <path d="M4 22V2" />
    </g>
    <g data-motion="nudge" data-dir="right">
      <path d="M20 22V2" />
    </g>
  </>,
);
