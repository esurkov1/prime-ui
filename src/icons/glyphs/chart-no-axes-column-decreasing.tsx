import { defineGlyph } from "../glyph";

/** Lucide `chart-no-axes-column-decreasing`: the bars dip and grow back one after another. */
export const ChartNoAxesColumnDecreasing = /* @__PURE__ */ defineGlyph(
  "ChartNoAxesColumnDecreasing",
  <>
    <path d="M5 21V3" data-motion="grow" data-origin="bottom" />
    <path d="M12 21V9" data-motion="grow" data-origin="bottom" data-delay="1" />
    <path d="M19 21v-6" data-motion="grow" data-origin="bottom" data-delay="2" />
  </>,
);
