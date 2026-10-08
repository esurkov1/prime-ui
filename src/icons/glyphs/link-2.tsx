import { defineGlyph } from "../glyph";

/** Lucide `link-2`: the two halves close in on the bar and part again. */
export const Link2 = /* @__PURE__ */ defineGlyph(
  "Link2",
  <>
    <path d="M9 17H7A5 5 0 0 1 7 7h2" data-motion="nudge" data-dir="right" />
    <path d="M15 7h2a5 5 0 1 1 0 10h-2" data-motion="nudge" data-dir="left" />
    <line x1="8" x2="16" y1="12" y2="12" />
  </>,
);
