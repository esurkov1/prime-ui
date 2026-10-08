import { defineGlyph } from "../glyph";

/** Lucide `gallery-thumbnails`: indicator dots pop, staggered. */
export const GalleryThumbnails = /* @__PURE__ */ defineGlyph(
  "GalleryThumbnails",
  <>
    <rect width="18" height="14" x="3" y="3" rx="2" />
    <g data-motion="pop">
      <path d="M4 21h1" />
    </g>
    <g data-motion="pop" data-delay="1">
      <path d="M9 21h1" />
    </g>
    <g data-motion="pop" data-delay="2">
      <path d="M14 21h1" />
    </g>
    <g data-motion="pop" data-delay="3">
      <path d="M19 21h1" />
    </g>
  </>,
);
