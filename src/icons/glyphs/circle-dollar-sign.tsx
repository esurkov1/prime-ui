import { defineGlyph } from "../glyph";

/** Lucide `circle-dollar-sign`: pops into place. */
export const CircleDollarSign = /* @__PURE__ */ defineGlyph(
  "CircleDollarSign",
  <>
    <circle cx="12" cy="12" r="10" />
    <g data-motion="pop">
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 18V6" />
    </g>
  </>,
);
