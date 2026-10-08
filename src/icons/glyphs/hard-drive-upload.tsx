import { defineGlyph } from "../glyph";

/** Lucide `hard-drive-upload`: the upload arrow nudges up and back. */
export const HardDriveUpload = /* @__PURE__ */ defineGlyph(
  "HardDriveUpload",
  <>
    <g data-motion="nudge" data-dir="up">
      <path d="m16 6-4-4-4 4" />
      <path d="M12 2v8" />
    </g>
    <rect width="20" height="8" x="2" y="14" rx="2" />
    <path d="M6 18h.01" />
    <path d="M10 18h.01" />
  </>,
);
