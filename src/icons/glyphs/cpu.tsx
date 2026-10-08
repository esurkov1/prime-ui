import { defineGlyph } from "../glyph";

/** Lucide `cpu`: the chip pops. */
export const Cpu = /* @__PURE__ */ defineGlyph(
  "Cpu",
  <>
    <path d="M12 20v2" data-motion="nudge" data-dir="down" />
    <path d="M12 2v2" data-motion="nudge" data-dir="up" />
    <path d="M17 20v2" data-motion="nudge" data-dir="down" data-delay="1" />
    <path d="M17 2v2" data-motion="nudge" data-dir="up" data-delay="1" />
    <path d="M2 12h2" data-motion="nudge" data-dir="left" />
    <path d="M2 17h2" data-motion="nudge" data-dir="left" data-delay="1" />
    <path d="M2 7h2" data-motion="nudge" data-dir="left" data-delay="2" />
    <path d="M20 12h2" data-motion="nudge" data-dir="right" />
    <path d="M20 17h2" data-motion="nudge" data-dir="right" data-delay="1" />
    <path d="M20 7h2" data-motion="nudge" data-dir="right" data-delay="2" />
    <path d="M7 20v2" data-motion="nudge" data-dir="down" />
    <path d="M7 2v2" data-motion="nudge" data-dir="up" />
    <rect x="4" y="4" width="16" height="16" rx="2" data-motion="pop" />
    <rect x="8" y="8" width="8" height="8" rx="1" data-motion="pop" />
  </>,
);
