import { defineGlyph } from "../glyph";

/** Lucide `pause`: the bars squeeze staggered. */
export const Pause = /* @__PURE__ */ defineGlyph(
  "Pause",
  <>
    <g data-motion="squeeze" data-delay="1">
      <rect x="14" y="3" width="5" height="18" rx="1" />
    </g>
    <g data-motion="squeeze">
      <rect x="5" y="3" width="5" height="18" rx="1" />
    </g>
  </>,
);
