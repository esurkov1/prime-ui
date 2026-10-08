import { defineGlyph } from "../glyph";

/** Lucide `server`: the indicator lights blink. */
export const Server = /* @__PURE__ */ defineGlyph(
  "Server",
  <>
    <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
    <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
    <line x1="6" x2="6.01" y1="6" y2="6" data-motion="pop" />
    <line x1="6" x2="6.01" y1="18" y2="18" data-motion="pop" data-delay="1" />
  </>,
);
