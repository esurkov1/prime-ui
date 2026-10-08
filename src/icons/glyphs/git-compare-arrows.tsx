import { defineGlyph } from "../glyph";

/** Lucide `git-compare-arrows`: the arrows nudge outward. */
export const GitCompareArrows = /* @__PURE__ */ defineGlyph(
  "GitCompareArrows",
  <>
    <circle cx="5" cy="6" r="3" />
    <path d="M12 6h5a2 2 0 0 1 2 2v7" />
    <g data-motion="nudge" data-dir="up">
      <path d="m15 9-3-3 3-3" />
    </g>
    <circle cx="19" cy="18" r="3" />
    <path d="M12 18H7a2 2 0 0 1-2-2V9" />
    <g data-motion="nudge" data-dir="down">
      <path d="m9 15 3 3-3 3" />
    </g>
  </>,
);
