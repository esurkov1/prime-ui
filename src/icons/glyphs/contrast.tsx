import { defineGlyph } from "../glyph";

/** Lucide `contrast`: the circle pops to toggle. */
export const Contrast = /* @__PURE__ */ defineGlyph(
  "Contrast",
  <>
    <circle cx="12" cy="12" r="10" data-motion="pop" />
    <path d="M12 18a6 6 0 0 0 0-12v12z" data-motion="pop" />
  </>,
);
