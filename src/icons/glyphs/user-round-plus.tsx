import { defineGlyph } from "../glyph";

/** Lucide `user-round-plus`: the plus sign pops. */
export const UserRoundPlus = /* @__PURE__ */ defineGlyph(
  "UserRoundPlus",
  <>
    <path d="M2 21a8 8 0 0 1 13.292-6" />
    <circle cx="10" cy="8" r="5" />
    <g data-motion="pop">
      <path d="M19 16v6" />
      <path d="M22 19h-6" />
    </g>
  </>,
);
