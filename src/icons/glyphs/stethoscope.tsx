import { defineGlyph } from "../glyph";

/** Lucide `stethoscope`: the earpieces tilt in and out. */
export const Stethoscope = /* @__PURE__ */ defineGlyph(
  "Stethoscope",
  <>
    <g data-motion="tilt" data-dir="left" data-origin="top">
      <path d="M11 2v2" />
      <path d="M5 2v2" />
    </g>
    <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
    <path d="M8 15a6 6 0 0 0 12 0v-3" />
    <circle cx="20" cy="10" r="2" />
  </>,
);
