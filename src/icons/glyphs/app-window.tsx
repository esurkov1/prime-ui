import { defineGlyph } from "../glyph";

/** Lucide `app-window`: the window's title bar lights up, one control after another; the frame stays. */
export const AppWindow = /* @__PURE__ */ defineGlyph(
  "AppWindow",
  <>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 8h20" />
    <path d="M6 4v4" data-motion="pop" />
    <path d="M10 4v4" data-motion="pop" data-delay="1" />
  </>,
);
