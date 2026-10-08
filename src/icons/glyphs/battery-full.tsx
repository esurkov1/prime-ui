import { defineGlyph } from "../glyph";

/** Lucide `battery-full`: charge indicators grow staggered. */
export const BatteryFull = /* @__PURE__ */ defineGlyph(
  "BatteryFull",
  <>
    <path d="M10 10v4" data-motion="grow" data-delay="2" />
    <path d="M14 10v4" data-motion="grow" />
    <path d="M22 14v-4" />
    <path d="M6 10v4" data-motion="grow" data-delay="1" />
    <rect x="2" y="6" width="16" height="12" rx="2" />
  </>,
);
