import { defineGlyph } from "../glyph";

/** Lucide `grip-horizontal`: the dots pop in sequence. */
export const GripHorizontal = /* @__PURE__ */ defineGlyph(
  "GripHorizontal",
  <>
    <g data-motion="pop">
      <circle cx="12" cy="9" r="1" />
    </g>
    <g data-motion="pop" data-delay="1">
      <circle cx="19" cy="9" r="1" />
    </g>
    <g data-motion="pop" data-delay="2">
      <circle cx="5" cy="9" r="1" />
    </g>
    <g data-motion="pop">
      <circle cx="12" cy="15" r="1" />
    </g>
    <g data-motion="pop" data-delay="1">
      <circle cx="19" cy="15" r="1" />
    </g>
    <g data-motion="pop" data-delay="2">
      <circle cx="5" cy="15" r="1" />
    </g>
  </>,
);
