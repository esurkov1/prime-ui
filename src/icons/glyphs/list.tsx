import { defineGlyph } from "../glyph";

/** Lucide `list`: the rows shorten and grow back one after another. */
export const List = /* @__PURE__ */ defineGlyph(
  "List",
  <>
    <g data-motion="grow" data-axis="x" data-origin="left">
      <path d="M3 5h.01" />
      <path d="M8 5h13" />
    </g>
    <g data-motion="grow" data-axis="x" data-origin="left" data-delay="1">
      <path d="M3 12h.01" />
      <path d="M8 12h13" />
    </g>
    <g data-motion="grow" data-axis="x" data-origin="left" data-delay="2">
      <path d="M3 19h.01" />
      <path d="M8 19h13" />
    </g>
  </>,
);
