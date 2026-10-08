import { defineGlyph } from "@/icons/glyph";

/** Lucide `list-ordered`: the lines shrink and grow in sequence, the numerals stay. */
export const ListOrdered = /* @__PURE__ */ defineGlyph(
  "ListOrdered",
  <>
    <path d="M11 5h10" data-motion="grow" data-axis="x" data-origin="left" />
    <path d="M11 12h10" data-motion="grow" data-axis="x" data-origin="left" data-delay="1" />
    <path d="M11 19h10" data-motion="grow" data-axis="x" data-origin="left" data-delay="2" />
    <path d="M4 4h1v5" />
    <path d="M4 9h2" />
    <path d="M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02" />
  </>,
);
