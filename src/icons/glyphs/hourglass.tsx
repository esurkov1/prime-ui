import { defineGlyph } from "../glyph";

/** Lucide `hourglass`: hourglasses spin (sand flows). */
export const Hourglass = /* @__PURE__ */ defineGlyph(
  "Hourglass",
  <g data-motion="spin" data-turn="half">
    <path d="M5 22h14" />
    <path d="M5 2h14" />
    <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
    <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
  </g>,
);
