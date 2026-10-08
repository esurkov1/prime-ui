import { defineGlyph } from "../glyph";

/** Lucide `maximize-2`: the corner arrows push outward. */
export const Maximize2 = /* @__PURE__ */ defineGlyph(
  "Maximize2",
  <>
    <g data-motion="nudge" data-dir="up-right">
      <path d="M15 3h6v6" />
      <path d="m21 3-7 7" />
    </g>
    <g data-motion="nudge" data-dir="down-left">
      <path d="m3 21 7-7" />
      <path d="M9 21H3v-6" />
    </g>
  </>,
);
