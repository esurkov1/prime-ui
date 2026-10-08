import { defineGlyph } from "../glyph";

/** Lucide `terminal`: the prompt arrow nudges right. */
export const Terminal = /* @__PURE__ */ defineGlyph(
  "Terminal",
  <>
    <path d="M12 19h8" />
    <path d="m4 17 6-6-6-6" data-motion="nudge" data-dir="right" />
  </>,
);
