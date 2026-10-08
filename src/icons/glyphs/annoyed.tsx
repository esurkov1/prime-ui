import { defineGlyph } from "../glyph";

/** Lucide `annoyed`: eyes blink closed. */
export const Annoyed = /* @__PURE__ */ defineGlyph(
  "Annoyed",
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 15h8" />
    <g data-motion="blink">
      <path d="M8 9h2" />
      <path d="M14 9h2" />
    </g>
  </>,
);
