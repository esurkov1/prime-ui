import { defineGlyph } from "../glyph";

/** Lucide `shower-head`: nudges down — water falling. */
export const ShowerHead = /* @__PURE__ */ defineGlyph(
  "ShowerHead",
  <>
    <path d="m4 4 2.5 2.5" />
    <path d="M13.5 6.5a4.95 4.95 0 0 0-7 7" />
    <path d="M15 5 5 15" />
    <path data-motion="nudge" data-dir="down" d="M14 17v.01" />
    <path data-motion="nudge" data-dir="down" data-delay="1" d="M10 16v.01" />
    <path data-motion="nudge" data-dir="down" data-delay="2" d="M13 13v.01" />
    <path data-motion="nudge" data-dir="down" data-delay="1" d="M16 10v.01" />
    <path data-motion="nudge" data-dir="down" data-delay="3" d="M11 20v.01" />
    <path data-motion="nudge" data-dir="down" data-delay="2" d="M17 14v.01" />
    <path d="M20 11v.01" />
  </>,
);
