import { defineGlyph } from "../glyph";

/** Lucide `chart-column-decreasing`: the bars dip and grow back one after another. */
export const ChartColumnDecreasing = /* @__PURE__ */ defineGlyph(
  "ChartColumnDecreasing",
  <>
    <path d="M13 17V9" data-motion="grow" data-origin="bottom" />
    <path d="M18 17v-3" data-motion="grow" data-origin="bottom" data-delay="1" />
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="M8 17V5" data-motion="grow" data-origin="bottom" data-delay="2" />
  </>,
);
