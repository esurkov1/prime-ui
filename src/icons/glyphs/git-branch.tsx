import { defineGlyph } from "../glyph";

/** Lucide `git-branch`: the branch line draws itself. */
export const GitBranch = /* @__PURE__ */ defineGlyph(
  "GitBranch",
  <>
    <path d="M15 6a9 9 0 0 0-9 9V3" pathLength="1" data-motion="draw" />
    <circle cx="18" cy="6" r="3" data-motion="pop" />
    <circle cx="6" cy="18" r="3" data-motion="pop" data-delay="1" />
  </>,
);
