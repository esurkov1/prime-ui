import { defineGlyph } from "../glyph";

/** Lucide `cooking-pot`: the lid tilts up from the right edge. */
export const CookingPot = /* @__PURE__ */ defineGlyph(
  "CookingPot",
  <>
    <path d="M2 12h20" />
    <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
    <g data-motion="tilt" data-dir="right" data-origin="bottom-right">
      <path d="m4 8 16-4" />
      <path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8" />
    </g>
  </>,
);
