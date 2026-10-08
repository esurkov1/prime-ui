import { defineGlyph } from "../glyph";

/** Lucide `text-align-start`: the lines shorten and grow back from the left, one after another. */
export const TextAlignStart = /* @__PURE__ */ defineGlyph(
  "TextAlignStart",
  <>
    <path d="M21 5H3" data-motion="grow" data-axis="x" data-origin="left" />
    <path d="M15 12H3" data-motion="grow" data-axis="x" data-origin="left" data-delay="1" />
    <path d="M17 19H3" data-motion="grow" data-axis="x" data-origin="left" data-delay="2" />
  </>,
);
