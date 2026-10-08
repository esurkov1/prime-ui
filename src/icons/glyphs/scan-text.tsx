import { defineGlyph } from "../glyph";

/** Lucide `scan-text`: the text lines scan into view one by one. */
export const ScanText = /* @__PURE__ */ defineGlyph(
  "ScanText",
  <>
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <path d="M7 8h8" data-motion="grow" data-delay="1" />
    <path d="M7 12h10" data-motion="grow" data-delay="2" />
    <path d="M7 16h6" data-motion="grow" data-delay="3" />
  </>,
);
