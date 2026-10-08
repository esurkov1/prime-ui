import { defineGlyph } from "../glyph";

/** Lucide `cloud-rain-wind`: rain nudges down, wind nudges left. */
export const CloudRainWind = /* @__PURE__ */ defineGlyph(
  "CloudRainWind",
  <>
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="m9.2 22 3-7" data-motion="nudge" data-dir="down" />
    <path d="m9 13-3 7" data-motion="nudge" data-dir="left" data-delay="1" />
    <path d="m17 13-3 7" data-motion="nudge" data-dir="down" data-delay="2" />
  </>,
);
