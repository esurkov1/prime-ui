import { defineGlyph } from "../glyph";

/** Lucide `mic`: the microphone nudges up and back. */
export const Mic = /* @__PURE__ */ defineGlyph(
  "Mic",
  <>
    <path d="M12 19v3" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <g data-motion="nudge" data-dir="up">
      <rect x="9" y="2" width="6" height="13" rx="3" />
    </g>
  </>,
);
