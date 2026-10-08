import { defineGlyph } from "../glyph";

/** Lucide `chevrons-left-right`: the chevrons move apart. */
export const ChevronsLeftRight = /* @__PURE__ */ defineGlyph(
  "ChevronsLeftRight",
  <>
    <path d="m9 7-5 5 5 5" data-motion="nudge" data-dir="left" />
    <path d="m15 7 5 5-5 5" data-motion="nudge" data-dir="right" />
  </>,
);
