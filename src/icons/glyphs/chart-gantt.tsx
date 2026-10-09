import { defineGlyph } from "../glyph";

/** Lucide `chart-gantt`: the task bars grow along the time axis, one after another. */
export const ChartGantt = /* @__PURE__ */ defineGlyph(
  "ChartGantt",
  <>
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="M10 6h8" data-motion="grow" data-origin="left" />
    <path d="M8 11h7" data-motion="grow" data-origin="left" data-delay="1" />
    <path d="M12 16h6" data-motion="grow" data-origin="left" data-delay="2" />
  </>,
);
