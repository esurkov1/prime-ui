import { defineGlyph } from "@/icons/glyph";

/** Lucide `hash`: the crossbars shrink and grow one after another. */
export const Hash = /* @__PURE__ */ defineGlyph(
  "Hash",
  <>
    <line x1="4" x2="20" y1="9" y2="9" data-motion="grow" data-axis="x" />
    <line x1="4" x2="20" y1="15" y2="15" data-motion="grow" data-axis="x" data-delay="1" />
    <line x1="10" x2="8" y1="3" y2="21" />
    <line x1="16" x2="14" y1="3" y2="21" />
  </>,
);
