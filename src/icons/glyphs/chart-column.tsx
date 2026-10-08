import { defineGlyph } from "../glyph";

/** Lucide `chart-column`: the bars dip and grow back one after another; the axes stay. */
export const ChartColumn = /* @__PURE__ */ defineGlyph(
  "ChartColumn",
  <>
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="M8 17v-3" data-motion="grow" data-origin="bottom" />
    <path d="M13 17V5" data-motion="grow" data-origin="bottom" data-delay="1" />
    <path d="M18 17V9" data-motion="grow" data-origin="bottom" data-delay="2" />
  </>,
);
