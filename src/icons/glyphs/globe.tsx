import { defineGlyph } from "../glyph";

/** Lucide `globe`: turns a half turn. */
export const Globe = /* @__PURE__ */ defineGlyph(
  "Globe",
  <g data-motion="spin" data-turn="half">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </g>,
);
