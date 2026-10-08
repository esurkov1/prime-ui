import { defineGlyph } from "../glyph";

/** Lucide `triangle-alert`: the exclamation mark shakes. */
export const TriangleAlert = /* @__PURE__ */ defineGlyph(
  "TriangleAlert",
  <>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
    <g data-motion="shake" data-dir="left">
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </g>
  </>,
);
