import { defineGlyph } from "../glyph";

/** Lucide `chart-no-axes-column-increasing`: the bars dip and grow back one after another. */
export const ChartNoAxesColumnIncreasing = /* @__PURE__ */ defineGlyph(
  "ChartNoAxesColumnIncreasing",
  <>
    <path d="M5 21v-6" data-motion="grow" data-origin="bottom" />
    <path d="M12 21V9" data-motion="grow" data-origin="bottom" data-delay="1" />
    <path d="M19 21V3" data-motion="grow" data-origin="bottom" data-delay="2" />
  </>,
);
