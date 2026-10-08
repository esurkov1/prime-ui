import { defineGlyph } from "../glyph";

/** Lucide `map-pin-plus`: the plus pops and the circle pops staggered. */
export const MapPinPlus = /* @__PURE__ */ defineGlyph(
  "MapPinPlus",
  <>
    <path d="M19.914 11.105A7.298 7.298 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32 32 0 0 0 .824-.738" />
    <g data-motion="pop">
      <circle cx="12" cy="10" r="3" />
    </g>
    <g data-motion="pop" data-delay="1">
      <path d="M16 18h6" />
      <path d="M19 15v6" />
    </g>
  </>,
);
