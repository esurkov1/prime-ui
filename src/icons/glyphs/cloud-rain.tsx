import { defineGlyph } from "../glyph";

/** Lucide `cloud-rain`: the raindrops fall and rise, staggered. */
export const CloudRain = /* @__PURE__ */ defineGlyph(
  "CloudRain",
  <>
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M16 14v6" data-motion="nudge" data-dir="down" />
    <path d="M8 14v6" data-motion="nudge" data-dir="down" data-delay="1" />
    <path d="M12 16v6" data-motion="nudge" data-dir="down" data-delay="2" />
  </>,
);
