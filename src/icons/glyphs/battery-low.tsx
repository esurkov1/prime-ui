import { defineGlyph } from "../glyph";

/** Lucide `battery-low`: charge indicators grow. */
export const BatteryLow = /* @__PURE__ */ defineGlyph(
  "BatteryLow",
  <>
    <path d="M22 14v-4" data-motion="grow" />
    <path d="M6 14v-4" data-motion="grow" />
    <rect x="2" y="6" width="16" height="12" rx="2" />
  </>,
);
