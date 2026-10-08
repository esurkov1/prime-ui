import { defineGlyph } from "../glyph";

/** Lucide `menu`: the three lines retract to the left and return, staggered. */
export const Menu = /* @__PURE__ */ defineGlyph(
  "Menu",
  <>
    <path d="M4 5h16" data-motion="grow" data-axis="x" data-origin="left" />
    <path d="M4 12h16" data-motion="grow" data-axis="x" data-origin="left" data-delay="1" />
    <path d="M4 19h16" data-motion="grow" data-axis="x" data-origin="left" data-delay="2" />
  </>,
);
