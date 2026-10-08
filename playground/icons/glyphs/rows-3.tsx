import { defineGlyph } from "@/icons/glyph";

/** Lucide `rows-3`: the row dividers settle down one after another. */
export const Rows3 = /* @__PURE__ */ defineGlyph(
  "Rows3",
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M21 9H3" data-motion="nudge" data-dir="down" />
    <path d="M21 15H3" data-motion="nudge" data-dir="down" data-delay="1" />
  </>,
);
