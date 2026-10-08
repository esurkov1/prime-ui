import { defineGlyph } from "../glyph";

/** Lucide `grip`: dots pop, staggered. */
export const Grip = /* @__PURE__ */ defineGlyph(
  "Grip",
  <>
    <g data-motion="pop">
      <circle cx="12" cy="5" r="1" />
    </g>
    <g data-motion="pop" data-delay="1">
      <circle cx="19" cy="5" r="1" />
    </g>
    <g data-motion="pop" data-delay="2">
      <circle cx="5" cy="5" r="1" />
    </g>
    <g data-motion="pop" data-delay="1">
      <circle cx="12" cy="12" r="1" />
    </g>
    <g data-motion="pop" data-delay="2">
      <circle cx="19" cy="12" r="1" />
    </g>
    <g data-motion="pop" data-delay="3">
      <circle cx="5" cy="12" r="1" />
    </g>
    <g data-motion="pop" data-delay="2">
      <circle cx="12" cy="19" r="1" />
    </g>
    <g data-motion="pop" data-delay="3">
      <circle cx="19" cy="19" r="1" />
    </g>
    <g data-motion="pop">
      <circle cx="5" cy="19" r="1" />
    </g>
  </>,
);
