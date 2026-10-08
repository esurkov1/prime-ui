import { defineGlyph } from "../glyph";

/** Lucide `cloud-snow`: snowflakes fall and rise, staggered. */
export const CloudSnow = /* @__PURE__ */ defineGlyph(
  "CloudSnow",
  <>
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M8 15h.01" data-motion="nudge" data-dir="down" />
    <path d="M8 19h.01" data-motion="nudge" data-dir="down" data-delay="1" />
    <path d="M12 17h.01" data-motion="nudge" data-dir="down" data-delay="2" />
    <path d="M12 21h.01" data-motion="nudge" data-dir="down" data-delay="3" />
    <path d="M16 15h.01" data-motion="nudge" data-dir="down" data-delay="1" />
    <path d="M16 19h.01" data-motion="nudge" data-dir="down" data-delay="2" />
  </>,
);
