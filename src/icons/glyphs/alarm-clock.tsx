import { defineGlyph } from "../glyph";

/** Lucide `alarm-clock`: hands nudge upward. */
export const AlarmClock = /* @__PURE__ */ defineGlyph(
  "AlarmClock",
  <>
    <circle cx="12" cy="13" r="8" />
    <g data-motion="nudge" data-dir="up">
      <path d="M12 9v4l2 2" />
    </g>
    <path d="M5 3 2 6" />
    <path d="m22 6-3-3" />
    <path d="M6.38 18.7 4 21" />
    <path d="M17.64 18.67 20 21" />
  </>,
);
