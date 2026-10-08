import { defineGlyph } from "../glyph";

/** Lucide `gallery-vertical-end`: the lines grow staggered. */
export const GalleryVerticalEnd = /* @__PURE__ */ defineGlyph(
  "GalleryVerticalEnd",
  <>
    <g data-motion="grow">
      <path d="M7 2h10" />
    </g>
    <g data-motion="grow" data-delay="1">
      <path d="M5 6h14" />
    </g>
    <rect width="18" height="12" x="3" y="10" rx="2" />
  </>,
);
