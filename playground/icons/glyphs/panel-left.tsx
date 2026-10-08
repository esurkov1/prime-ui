import { defineGlyph } from "@/icons/glyph";

/** Lucide `panel-left`: the divider slides toward the left panel. */
export const PanelLeft = /* @__PURE__ */ defineGlyph(
  "PanelLeft",
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M9 3v18" data-motion="nudge" data-dir="left" />
  </>,
);
