import { defineGlyph } from "../glyph";

/** Lucide `grip-vertical`: the two columns of dots slide past each other, up and down. */
export const GripVertical = /* @__PURE__ */ defineGlyph(
  "GripVertical",
  <>
    <g data-motion="nudge" data-dir="up">
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="5" r="1" />
      <circle cx="9" cy="19" r="1" />
    </g>
    <g data-motion="nudge" data-dir="down">
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="15" cy="19" r="1" />
    </g>
  </>,
);
