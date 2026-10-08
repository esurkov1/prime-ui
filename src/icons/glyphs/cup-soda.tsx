import { defineGlyph } from "../glyph";

/** Lucide `cup-soda`: pops into view; the straw and bubbles. */
export const CupSoda = /* @__PURE__ */ defineGlyph(
  "CupSoda",
  <>
    <path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8" />
    <path d="M5 8h14" />
    <path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0" data-motion="pop" />
    <path d="m12 8 1-6h2" data-motion="pop" data-delay="1" />
  </>,
);
