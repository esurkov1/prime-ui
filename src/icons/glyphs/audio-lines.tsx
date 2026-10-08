import { defineGlyph } from "../glyph";

/** Lucide `audio-lines`: bars pulse with delayed grow. */
export const AudioLines = /* @__PURE__ */ defineGlyph(
  "AudioLines",
  <>
    <path d="M2 10v3" data-motion="grow" data-delay="1" />
    <path d="M6 6v11" data-motion="grow" data-delay="2" />
    <path d="M10 3v18" data-motion="grow" />
    <path d="M14 8v7" data-motion="grow" data-delay="2" />
    <path d="M18 5v13" data-motion="grow" data-delay="1" />
    <path d="M22 10v3" data-motion="grow" />
  </>,
);
