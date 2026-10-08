import { defineGlyph } from "@/icons/glyph";

/** Lucide `panels-top-left`: the sidebar divider slides left; the header line stays. */
export const PanelsTopLeft = /* @__PURE__ */ defineGlyph(
  "PanelsTopLeft",
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" data-motion="nudge" data-dir="left" />
  </>,
);
