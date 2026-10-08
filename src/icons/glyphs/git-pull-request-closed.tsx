import { defineGlyph } from "../glyph";

/** Lucide `git-pull-request-closed`: crossed arrows shake. */
export const GitPullRequestClosed = /* @__PURE__ */ defineGlyph(
  "GitPullRequestClosed",
  <>
    <circle cx="6" cy="6" r="3" />
    <path d="M6 9v12" />
    <g data-motion="shake">
      <path d="m21 3-6 6" />
      <path d="m21 9-6-6" />
    </g>
    <path d="M18 11.5V15" />
    <circle cx="18" cy="18" r="3" />
  </>,
);
