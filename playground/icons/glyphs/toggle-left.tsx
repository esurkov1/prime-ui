import { defineGlyph } from "@/icons/glyph";

/** Lucide `toggle-left`: the knob slides across the track and back. */
export const ToggleLeft = /* @__PURE__ */ defineGlyph(
  "ToggleLeft",
  <>
    <circle cx="9" cy="12" r="3" data-motion="nudge" data-dir="right" />
    <rect width="20" height="14" x="2" y="5" rx="7" />
  </>,
);
