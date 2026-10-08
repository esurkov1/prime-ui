import { defineGlyph } from "../glyph";

/** Lucide `layout-dashboard`: the tiles dip and grow back clockwise, one after another. */
export const LayoutDashboard = /* @__PURE__ */ defineGlyph(
  "LayoutDashboard",
  <>
    <rect width="7" height="9" x="3" y="3" rx="1" data-motion="grow" data-origin="top" />
    <rect
      width="7"
      height="5"
      x="14"
      y="3"
      rx="1"
      data-motion="grow"
      data-origin="top"
      data-delay="1"
    />
    <rect
      width="7"
      height="9"
      x="14"
      y="12"
      rx="1"
      data-motion="grow"
      data-origin="top"
      data-delay="2"
    />
    <rect
      width="7"
      height="5"
      x="3"
      y="16"
      rx="1"
      data-motion="grow"
      data-origin="top"
      data-delay="3"
    />
  </>,
);
