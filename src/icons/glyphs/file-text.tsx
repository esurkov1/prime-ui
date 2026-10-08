import { defineGlyph } from "../glyph";

/** Lucide `file-text`: the text lines shorten and grow back one after another; the sheet stays. */
export const FileText = /* @__PURE__ */ defineGlyph(
  "FileText",
  <>
    <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
    <path d="M14 2v5a1 1 0 0 0 1 1h5" />
    <path d="M10 9H8" data-motion="grow" data-axis="x" data-origin="left" />
    <path d="M16 13H8" data-motion="grow" data-axis="x" data-origin="left" data-delay="1" />
    <path d="M16 17H8" data-motion="grow" data-axis="x" data-origin="left" data-delay="2" />
  </>,
);
