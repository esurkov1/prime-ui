import { defineGlyph } from "@/icons/glyph";

/** Lucide `list-checks`: the ticks draw themselves one after another. */
export const ListChecks = /* @__PURE__ */ defineGlyph(
  "ListChecks",
  <>
    <path d="M13 5h8" />
    <path d="M13 12h8" />
    <path d="M13 19h8" />
    <path d="m3 17 2 2 4-4" pathLength="1" data-motion="draw" data-delay="1" />
    <path d="m3 7 2 2 4-4" pathLength="1" data-motion="draw" />
  </>,
);
