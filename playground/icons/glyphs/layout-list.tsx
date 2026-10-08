import { defineGlyph } from "@/icons/glyph";

/** Lucide `layout-list`: the list lines shrink and grow in sequence. */
export const LayoutList = /* @__PURE__ */ defineGlyph(
  "LayoutList",
  <>
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
    <path d="M14 4h7" data-motion="grow" data-axis="x" data-origin="left" />
    <path d="M14 9h7" data-motion="grow" data-axis="x" data-origin="left" data-delay="1" />
    <path d="M14 15h7" data-motion="grow" data-axis="x" data-origin="left" data-delay="2" />
    <path d="M14 20h7" data-motion="grow" data-axis="x" data-origin="left" data-delay="3" />
  </>,
);
