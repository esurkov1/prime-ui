import { defineGlyph } from "../glyph";

/** Lucide `calendar-check`: the checkmark draws itself. */
export const CalendarCheck = /* @__PURE__ */ defineGlyph(
  "CalendarCheck",
  <>
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
    <path d="m9 16 2 2 4-4" pathLength="1" data-motion="draw" />
  </>,
);
