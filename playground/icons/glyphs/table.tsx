import { defineGlyph } from "@/icons/glyph";

/** Lucide `table`: the column divider slides right, like a resized column. */
export const Table = /* @__PURE__ */ defineGlyph(
  "Table",
  <>
    <path d="M12 3v18" data-motion="nudge" data-dir="right" />
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
  </>,
);
