import { defineGlyph } from "../glyph";

/** Lucide `clock`: the hands spin around once. */
export const Clock = /* @__PURE__ */ defineGlyph(
  "Clock",
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" data-motion="spin" />
  </>,
);
