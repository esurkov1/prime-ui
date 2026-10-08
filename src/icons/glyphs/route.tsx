import { defineGlyph } from "../glyph";

/** Lucide `route`: draws the path from start to end. */
export const Route = /* @__PURE__ */ defineGlyph(
  "Route",
  <>
    <circle cx="6" cy="19" r="3" />
    <path
      d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"
      pathLength="1"
      data-motion="draw"
    />
    <circle cx="18" cy="5" r="3" />
  </>,
);
