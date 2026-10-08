import { defineGlyph } from "../glyph";

/** Lucide `keyboard`: the key rows pop one after another. */
export const Keyboard = /* @__PURE__ */ defineGlyph(
  "Keyboard",
  <>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <g data-motion="pop">
      <path d="M6 8h.01" />
      <path d="M10 8h.01" />
      <path d="M14 8h.01" />
      <path d="M18 8h.01" />
    </g>
    <g data-motion="pop" data-delay="1">
      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
    </g>
    <path d="M7 16h10" data-motion="pop" data-delay="2" />
  </>,
);
