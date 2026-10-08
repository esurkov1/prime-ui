import { defineGlyph } from "../glyph";

/** Lucide `circle-x`: the cross shakes. */
export const CircleX = /* @__PURE__ */ defineGlyph(
  "CircleX",
  <>
    <circle cx="12" cy="12" r="10" />
    <g data-motion="shake" data-dir="left">
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </g>
  </>,
);
