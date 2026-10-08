import { defineGlyph } from "../glyph";

/** Lucide `at-sign`: nudges up as a mention. */
export const AtSign = /* @__PURE__ */ defineGlyph(
  "AtSign",
  <g data-motion="nudge" data-dir="up">
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
  </g>,
);
