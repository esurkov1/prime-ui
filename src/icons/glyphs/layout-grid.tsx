import { defineGlyph } from "../glyph";

/** Lucide `layout-grid`: the four cells swell one after another, clockwise. */
export const LayoutGrid = /* @__PURE__ */ defineGlyph(
  "LayoutGrid",
  <>
    <rect width="7" height="7" x="3" y="3" rx="1" data-motion="pop" />
    <rect width="7" height="7" x="14" y="3" rx="1" data-motion="pop" data-delay="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" data-motion="pop" data-delay="2" />
    <rect width="7" height="7" x="3" y="14" rx="1" data-motion="pop" data-delay="3" />
  </>,
);
