import { defineGlyph } from "../glyph";

/** Lucide `battery-medium`: the charge levels grow one after another. */
export const BatteryMedium = /* @__PURE__ */ defineGlyph(
  "BatteryMedium",
  <>
    <path d="M10 14v-4" data-motion="grow" data-origin="bottom" />
    <path d="M22 14v-4" data-motion="grow" data-origin="bottom" data-delay="1" />
    <path d="M6 14v-4" data-motion="grow" data-origin="bottom" data-delay="2" />
    <rect x="2" y="6" width="16" height="12" rx="2" />
  </>,
);
