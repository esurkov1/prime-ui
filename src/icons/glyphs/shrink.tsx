import { defineGlyph } from "../glyph";

/** Lucide `shrink`: arrows nudge inward. */
export const Shrink = /* @__PURE__ */ defineGlyph(
  "Shrink",
  <>
    <path d="m15 15 6 6m-6-6v4.8m0-4.8h4.8" data-motion="nudge" data-dir="up-left" />
    <path d="M9 19.8V15m0 0H4.2M9 15l-6 6" data-motion="nudge" data-dir="down-right" />
    <path d="M15 4.2V9m0 0h4.8M15 9l6-6" data-motion="nudge" data-dir="up-left" />
    <path d="M9 4.2V9m0 0H4.2M9 9 3 3" data-motion="nudge" data-dir="down-right" />
  </>,
);
