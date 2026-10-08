import { defineGlyph } from "../glyph";

/** Lucide `switch-camera`: the arrows nudge back and forth. */
export const SwitchCamera = /* @__PURE__ */ defineGlyph(
  "SwitchCamera",
  <>
    <path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
    <path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5" />
    <circle cx="12" cy="12" r="3" />
    <g data-motion="nudge" data-dir="right">
      <path d="m18 22-3-3 3-3" />
    </g>
    <g data-motion="nudge" data-dir="left">
      <path d="m6 2 3 3-3 3" />
    </g>
  </>,
);
