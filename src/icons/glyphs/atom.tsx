import { defineGlyph } from "../glyph";

/** Lucide `atom`: orbits spin around the nucleus. */
export const Atom = /* @__PURE__ */ defineGlyph(
  "Atom",
  <>
    <circle cx="12" cy="12" r="1" />
    <g data-motion="spin" data-turn="half">
      <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
      <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
    </g>
  </>,
);
