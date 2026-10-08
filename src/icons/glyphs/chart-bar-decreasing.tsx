import { defineGlyph } from "../glyph";

/** Lucide `chart-bar-decreasing`: the bars dip and grow back, then the next one shorter. */
export const ChartBarDecreasing = /* @__PURE__ */ defineGlyph(
  "ChartBarDecreasing",
  <>
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="M7 11h8" data-motion="grow" data-origin="bottom" />
    <path d="M7 16h3" data-motion="grow" data-origin="bottom" data-delay="1" />
    <path d="M7 6h12" data-motion="grow" data-origin="bottom" data-delay="2" />
  </>,
);
