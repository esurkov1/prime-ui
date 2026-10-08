import { defineGlyph } from "../glyph";

/** Lucide `circle-question-mark`: the question mark sways. */
export const CircleQuestionMark = /* @__PURE__ */ defineGlyph(
  "CircleQuestionMark",
  <>
    <circle cx="12" cy="12" r="10" />
    <g data-motion="swing" data-origin="bottom">
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </g>
  </>,
);
