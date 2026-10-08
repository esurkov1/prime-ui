import { defineGlyph } from "../glyph";

/** Lucide `panel-right-open`: the chevron steps in the opening direction. */
export const PanelRightOpen = /* @__PURE__ */ defineGlyph(
  "PanelRightOpen",
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M15 3v18" />
    <path d="m10 15-3-3 3-3" data-motion="nudge" data-dir="left" />
  </>,
);
