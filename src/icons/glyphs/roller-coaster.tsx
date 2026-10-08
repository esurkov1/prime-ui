import { defineGlyph } from "../glyph";

/** Lucide `roller-coaster`: the tracks dip and grow staggered. */
export const RollerCoaster = /* @__PURE__ */ defineGlyph(
  "RollerCoaster",
  <>
    <path d="M6 19V5" data-motion="grow" data-origin="bottom" />
    <path d="M10 19V6.8" data-motion="grow" data-origin="bottom" data-delay="1" />
    <path d="M14 19v-7.8" data-motion="grow" data-origin="bottom" data-delay="2" />
    <path d="M18 5v4" />
    <path d="M18 19v-6" data-motion="grow" data-origin="bottom" data-delay="3" />
    <path d="M22 19V9" data-motion="grow" data-origin="bottom" data-delay="1" />
    <path d="M2 19V9a4 4 0 0 1 4-4c2 0 4 1.33 6 4s4 4 6 4a4 4 0 1 0-3-6.65" />
  </>,
);
