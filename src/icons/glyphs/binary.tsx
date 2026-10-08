import { defineGlyph } from "../glyph";

/** Lucide `binary`: the bits pop one after another. */
export const Binary = /* @__PURE__ */ defineGlyph(
  "Binary",
  <>
    <rect x="14" y="14" width="4" height="6" rx="2" data-motion="pop" />
    <rect x="6" y="4" width="4" height="6" rx="2" data-motion="pop" data-delay="1" />
    <path d="M6 20h4" />
    <path d="M14 10h4" />
    <path d="M6 14h2v6" />
    <path d="M14 4h2v6" />
  </>,
);
