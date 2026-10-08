import { defineGlyph } from "../glyph";

/** Lucide `text-align-center`: the lines pop one after another. */
export const TextAlignCenter = /* @__PURE__ */ defineGlyph(
  "TextAlignCenter",
  <>
    <path d="M21 5H3" data-motion="pop" />
    <path d="M17 12H7" data-motion="pop" data-delay="1" />
    <path d="M19 19H5" data-motion="pop" data-delay="2" />
  </>,
);
