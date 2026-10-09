import { defineGlyph } from "../glyph";

/** Lucide `columns-3`: the column lines squeeze together and spread back. */
export const Columns3 = /* @__PURE__ */ defineGlyph(
  "Columns3",
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <g data-motion="squeeze">
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </g>
  </>,
);
