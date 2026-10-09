import { defineGlyph } from "../glyph";

/** Lucide `text-quote`: the quoted lines shrink and grow back from the left, one after another. */
export const TextQuote = /* @__PURE__ */ defineGlyph(
  "TextQuote",
  <>
    <path d="M17 5H3" />
    <path d="M21 12H8" data-motion="grow" data-axis="x" data-origin="left" />
    <path d="M21 19H8" data-motion="grow" data-axis="x" data-origin="left" data-delay="1" />
    <path d="M3 12v7" />
  </>,
);
