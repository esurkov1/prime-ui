import { defineGlyph } from "@/icons/glyph";

/** Lucide `focus`: the corner brackets tighten around the dot. */
export const Focus = /* @__PURE__ */ defineGlyph(
  "Focus",
  <>
    <circle cx="12" cy="12" r="3" />
    <g data-motion="squeeze">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    </g>
  </>,
);
