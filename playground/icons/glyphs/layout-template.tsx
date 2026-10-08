import { defineGlyph } from "@/icons/glyph";

/** Lucide `layout-template`: the wide bottom block narrows and widens. */
export const LayoutTemplate = /* @__PURE__ */ defineGlyph(
  "LayoutTemplate",
  <>
    <rect width="18" height="7" x="3" y="3" rx="1" />
    <rect
      width="9"
      height="7"
      x="3"
      y="14"
      rx="1"
      data-motion="grow"
      data-axis="x"
      data-origin="left"
    />
    <rect width="5" height="7" x="16" y="14" rx="1" />
  </>,
);
