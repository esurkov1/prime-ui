import { defineGlyph } from "@/icons/glyph";

/** Lucide `shapes`: the triangle leans, the square turns a quarter, the circle pops. */
export const Shapes = /* @__PURE__ */ defineGlyph(
  "Shapes",
  <>
    <path
      d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"
      data-motion="tilt"
      data-origin="bottom"
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="1"
      data-motion="spin"
      data-turn="quarter"
      data-delay="1"
    />
    <circle cx="17.5" cy="17.5" r="3.5" data-motion="pop" data-delay="2" />
  </>,
);
