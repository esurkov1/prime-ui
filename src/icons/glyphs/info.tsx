import { defineGlyph } from "../glyph";

/** Lucide `info`: the mark swells. */
export const Info = /* @__PURE__ */ defineGlyph(
  "Info",
  <>
    <circle cx="12" cy="12" r="10" />
    <g data-motion="pop">
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </g>
  </>,
);
