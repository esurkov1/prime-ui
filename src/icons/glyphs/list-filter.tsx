import { defineGlyph } from "../glyph";

/** Lucide `list-filter`: the funnel lines narrow and widen again, top to bottom. */
export const ListFilter = /* @__PURE__ */ defineGlyph(
  "ListFilter",
  <>
    <path d="M2 5h20" data-motion="grow" data-axis="x" />
    <path d="M6 12h12" data-motion="grow" data-axis="x" data-delay="1" />
    <path d="M9 19h6" data-motion="grow" data-axis="x" data-delay="2" />
  </>,
);
