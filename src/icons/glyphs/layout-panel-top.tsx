import { defineGlyph } from "../glyph";

/** Lucide `layout-panel-top`: panels pop, staggered. */
export const LayoutPanelTop = /* @__PURE__ */ defineGlyph(
  "LayoutPanelTop",
  <>
    <g data-motion="pop">
      <rect width="18" height="7" x="3" y="3" rx="1" />
    </g>
    <g data-motion="pop" data-delay="1">
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </g>
    <g data-motion="pop" data-delay="2">
      <rect width="7" height="7" x="14" y="14" rx="1" />
    </g>
  </>,
);
