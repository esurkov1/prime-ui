import { defineGlyph } from "../glyph";

/** Lucide `square-activity`: the chart line pulses with activity. */
export const SquareActivity = /* @__PURE__ */ defineGlyph(
  "SquareActivity",
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M17 12h-2l-2 5-2-10-2 5H7" data-motion="grow" data-origin="top" />
  </>,
);
