import { defineGlyph } from "../glyph";

/** Lucide `git-merge`: the nodes pop in sequence. */
export const GitMerge = /* @__PURE__ */ defineGlyph(
  "GitMerge",
  <>
    <g data-motion="pop" data-delay="1">
      <circle cx="18" cy="18" r="3" />
    </g>
    <g data-motion="pop">
      <circle cx="6" cy="6" r="3" />
    </g>
    <path d="M6 21V9a9 9 0 0 0 9 9" />
  </>,
);
