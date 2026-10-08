import { defineGlyph } from "../glyph";

/** Lucide `align-vertical-space-around`: outer lines nudge outward. */
export const AlignVerticalSpaceAround = /* @__PURE__ */ defineGlyph(
  "AlignVerticalSpaceAround",
  <>
    <rect width="10" height="6" x="7" y="9" rx="2" />
    <g data-motion="nudge" data-dir="down">
      <path d="M22 20H2" />
    </g>
    <g data-motion="nudge" data-dir="up">
      <path d="M22 4H2" />
    </g>
  </>,
);
