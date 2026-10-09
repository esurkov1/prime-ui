import { defineGlyph } from "../glyph";

/** Lucide `scale`: the beam with its pans swings around the post. */
export const Scale = /* @__PURE__ */ defineGlyph(
  "Scale",
  <>
    <path d="M12 3v18" />
    <g data-motion="swing" data-origin="top">
      <path d="m19 8 3 8a5 5 0 0 1-6 0zV7" />
      <path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1" />
      <path d="m5 8 3 8a5 5 0 0 1-6 0zV7" />
    </g>
    <path d="M7 21h10" />
  </>,
);
