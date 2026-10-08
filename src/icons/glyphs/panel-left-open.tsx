import { defineGlyph } from "../glyph";

/** Lucide `panel-left-open`: the chevron steps right; the frame stays. */
export const PanelLeftOpen = /* @__PURE__ */ defineGlyph(
  "PanelLeftOpen",
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M9 3v18" />
    <path d="m14 9 3 3-3 3" data-motion="nudge" data-dir="right" />
  </>,
);
