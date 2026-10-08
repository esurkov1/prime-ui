import { defineGlyph } from "../glyph";

/** Lucide `git-graph`: the nodes pop in sequence. */
export const GitGraph = /* @__PURE__ */ defineGlyph(
  "GitGraph",
  <>
    <g data-motion="pop">
      <circle cx="5" cy="6" r="3" />
    </g>
    <path d="M5 9v6" />
    <g data-motion="pop" data-delay="1">
      <circle cx="5" cy="18" r="3" />
    </g>
    <path d="M12 3v18" />
    <g data-motion="pop" data-delay="2">
      <circle cx="19" cy="6" r="3" />
    </g>
    <path d="M16 15.7A9 9 0 0 0 19 9" />
  </>,
);
