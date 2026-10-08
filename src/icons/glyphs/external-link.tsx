import { defineGlyph } from "../glyph";

/** Lucide `external-link`: the arrow steps out up-right; the box stays. */
export const ExternalLink = /* @__PURE__ */ defineGlyph(
  "ExternalLink",
  <>
    <g data-motion="nudge" data-dir="up-right">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </g>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </>,
);
