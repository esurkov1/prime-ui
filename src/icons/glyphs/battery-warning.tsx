import { defineGlyph } from "../glyph";

/** Lucide `battery-warning`: the warning line pulses. */
export const BatteryWarning = /* @__PURE__ */ defineGlyph(
  "BatteryWarning",
  <>
    <path d="M10 17h.01" />
    <path d="M10 7v6" data-motion="grow" data-origin="top" />
    <path d="M14 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2" />
    <path d="M22 14v-4" />
    <path d="M6 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" />
  </>,
);
