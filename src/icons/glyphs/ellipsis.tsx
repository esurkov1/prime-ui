import { defineGlyph } from "../glyph";

/** Lucide `ellipsis`: the dots swell in a wave from left to right. */
export const Ellipsis = /* @__PURE__ */ defineGlyph(
  "Ellipsis",
  <>
    <circle cx="12" cy="12" r="1" data-motion="pop" data-delay="1" />
    <circle cx="19" cy="12" r="1" data-motion="pop" data-delay="2" />
    <circle cx="5" cy="12" r="1" data-motion="pop" />
  </>,
);
