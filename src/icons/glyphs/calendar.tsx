import { defineGlyph } from "../glyph";

/** Lucide `calendar`: the binder rings dip into the page. */
export const Calendar = /* @__PURE__ */ defineGlyph(
  "Calendar",
  <>
    <g data-motion="nudge" data-dir="down">
      <path d="M8 2v4" />
      <path d="M16 2v4" />
    </g>
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </>,
);
