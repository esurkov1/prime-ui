import { defineGlyph } from "@/icons/glyph";

/** Lucide `panel-top-dashed`: the dashes stretch in a wave, like a skeleton loading. */
export const PanelTopDashed = /* @__PURE__ */ defineGlyph(
  "PanelTopDashed",
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M14 9h1" data-motion="grow" data-axis="x" data-origin="left" data-delay="2" />
    <path d="M19 9h2" data-motion="grow" data-axis="x" data-origin="left" data-delay="3" />
    <path d="M3 9h2" data-motion="grow" data-axis="x" data-origin="left" />
    <path d="M9 9h1" data-motion="grow" data-axis="x" data-origin="left" data-delay="1" />
  </>,
);
