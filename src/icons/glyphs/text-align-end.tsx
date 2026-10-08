import { defineGlyph } from "../glyph";

/** Lucide `text-align-end`: the lines grow from the right one after another. */
export const TextAlignEnd = /* @__PURE__ */ defineGlyph(
  "TextAlignEnd",
  <>
    <path d="M21 5H3" data-motion="grow" data-axis="x" data-origin="right" />
    <path d="M21 12H9" data-motion="grow" data-axis="x" data-origin="right" data-delay="1" />
    <path d="M21 19H7" data-motion="grow" data-axis="x" data-origin="right" data-delay="2" />
  </>,
);
