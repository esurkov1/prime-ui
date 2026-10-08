import { defineGlyph } from "../glyph";

/** Lucide `panel-left-close`: the chevron steps left; the frame stays. */
export const PanelLeftClose = /* @__PURE__ */ defineGlyph(
  "PanelLeftClose",
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M9 3v18" />
    <path d="m16 15-3-3 3-3" data-motion="nudge" data-dir="left" />
  </>,
);
