import { defineGlyph } from "../glyph";

/** Lucide `git-pull-request-create`: plus nudges right. */
export const GitPullRequestCreate = /* @__PURE__ */ defineGlyph(
  "GitPullRequestCreate",
  <>
    <circle cx="6" cy="6" r="3" />
    <path d="M6 9v12" />
    <path d="M13 6h3a2 2 0 0 1 2 2v3" />
    <g data-motion="nudge" data-dir="right">
      <path d="M18 15v6" />
      <path d="M21 18h-6" />
    </g>
  </>,
);
