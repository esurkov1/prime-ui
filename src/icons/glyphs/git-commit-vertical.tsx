import { defineGlyph } from "../glyph";

/** Lucide `git-commit-vertical`: the commit node pops. */
export const GitCommitVertical = /* @__PURE__ */ defineGlyph(
  "GitCommitVertical",
  <>
    <path d="M12 3v6" />
    <g data-motion="pop">
      <circle cx="12" cy="12" r="3" />
    </g>
    <path d="M12 15v6" />
  </>,
);
