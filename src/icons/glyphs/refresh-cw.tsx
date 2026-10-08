import { defineGlyph } from "../glyph";

/** Lucide `refresh-cw`: the two arrows turn half a turn (the glyph is symmetric under it). */
export const RefreshCw = /* @__PURE__ */ defineGlyph(
  "RefreshCw",
  <g data-motion="spin" data-turn="half">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </g>,
);
