import { defineGlyph } from "@/icons/glyph";

/** Lucide `panel-bottom`: the divider dips toward the bottom panel. */
export const PanelBottom = /* @__PURE__ */ defineGlyph(
  "PanelBottom",
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 15h18" data-motion="nudge" data-dir="down" />
  </>,
);
