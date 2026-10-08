import { defineGlyph } from "../glyph";

/** Lucide `battery`: the charge level indicator grows and shrinks. */
export const Battery = /* @__PURE__ */ defineGlyph(
  "Battery",
  <>
    <path d="M 22 14 L 22 10" data-motion="grow" data-origin="bottom" />
    <rect x="2" y="6" width="16" height="12" rx="2" />
  </>,
);
