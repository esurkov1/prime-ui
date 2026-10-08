import { defineGlyph } from "../glyph";

/** Lucide `circle-check`: the tick draws itself. */
export const CircleCheck = /* @__PURE__ */ defineGlyph(
  "CircleCheck",
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" pathLength="1" data-motion="draw" />
  </>,
);
