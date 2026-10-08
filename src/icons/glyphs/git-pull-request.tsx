import { defineGlyph } from "../glyph";

/** Lucide `git-pull-request`: the nodes pop in sequence. */
export const GitPullRequest = /* @__PURE__ */ defineGlyph(
  "GitPullRequest",
  <>
    <g data-motion="pop" data-delay="1">
      <circle cx="18" cy="18" r="3" />
    </g>
    <g data-motion="pop">
      <circle cx="6" cy="6" r="3" />
    </g>
    <path d="M13 6h3a2 2 0 0 1 2 2v7" />
    <line x1="6" x2="6" y1="9" y2="21" />
  </>,
);
