import { defineGlyph } from "../glyph";

/** Lucide `plus`: turns a quarter (the glyph is 4-fold symmetric). */
export const Plus = /* @__PURE__ */ defineGlyph(
  "Plus",
  <g data-motion="spin" data-turn="quarter">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </g>,
);
