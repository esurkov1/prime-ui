import { defineGlyph } from "@/icons/glyph";

/** Lucide `panel-right`: the divider slides toward the right panel. */
export const PanelRight = /* @__PURE__ */ defineGlyph(
  "PanelRight",
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M15 3v18" data-motion="nudge" data-dir="right" />
  </>,
);
