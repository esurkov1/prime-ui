import { defineGlyph } from "@/icons/glyph";

/** Lucide `panel-top`: the divider lifts toward the header. */
export const PanelTop = /* @__PURE__ */ defineGlyph(
  "PanelTop",
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" data-motion="nudge" data-dir="up" />
  </>,
);
