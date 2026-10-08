import { defineGlyph } from "../glyph";

/** Lucide `underline`: the rule shrinks and grows back; the letter stays. */
export const Underline = /* @__PURE__ */ defineGlyph(
  "Underline",
  <>
    <path d="M6 4v6a6 6 0 0 0 12 0V4" />
    <line x1="4" x2="20" y1="20" y2="20" data-motion="grow" data-axis="x" />
  </>,
);
