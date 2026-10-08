import { defineGlyph } from "../glyph";

/** Lucide `gallery-horizontal-end`: the thumbnails grow. */
export const GalleryHorizontalEnd = /* @__PURE__ */ defineGlyph(
  "GalleryHorizontalEnd",
  <>
    <path d="M2 7v10" data-motion="grow" data-delay="1" />
    <path d="M6 5v14" data-motion="grow" />
    <rect width="12" height="18" x="10" y="3" rx="2" data-motion="grow" data-delay="2" />
  </>,
);
