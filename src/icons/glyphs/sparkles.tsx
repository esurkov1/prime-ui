import { defineGlyph } from "../glyph";

/** Lucide `sparkles`: the sparkles twinkle one after another. */
export const Sparkles = /* @__PURE__ */ defineGlyph(
  "Sparkles",
  <>
    <path
      d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
      data-motion="pop"
    />
    <g data-motion="pop" data-delay="1">
      <path d="M20 2v4" />
      <path d="M22 4h-4" />
    </g>
    <circle cx="4" cy="20" r="2" data-motion="pop" data-delay="2" />
  </>,
);
