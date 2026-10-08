import { defineGlyph } from "../glyph";

/** Lucide `square-stack`: the outer layers spread apart from the middle one. */
export const SquareStack = /* @__PURE__ */ defineGlyph(
  "SquareStack",
  <>
    <path
      d="M4 10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2"
      data-motion="nudge"
      data-dir="up-left"
    />
    <path d="M10 16c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" />
    <rect width="8" height="8" x="14" y="14" rx="2" data-motion="nudge" data-dir="down-right" />
  </>,
);
