import { defineGlyph } from "../glyph";

/** Lucide `git-fork`: fork prongs nudge, staggered. */
export const GitFork = /* @__PURE__ */ defineGlyph(
  "GitFork",
  <>
    <circle cx="12" cy="18" r="3" />
    <g data-motion="nudge" data-dir="up">
      <circle cx="6" cy="6" r="3" />
    </g>
    <g data-motion="nudge" data-dir="up" data-delay="1">
      <circle cx="18" cy="6" r="3" />
    </g>
    <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" />
    <path d="M12 12v3" />
  </>,
);
