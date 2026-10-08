import { defineGlyph } from "../glyph";

/** Lucide `file-stack`: files pop, staggered. */
export const FileStack = /* @__PURE__ */ defineGlyph(
  "FileStack",
  <>
    <g data-motion="pop">
      <path d="M11 21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1" />
    </g>
    <g data-motion="pop" data-delay="1">
      <path d="M16 16a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1" />
    </g>
    <g data-motion="pop" data-delay="2">
      <path d="M21 6a2 2 0 0 0-.586-1.414l-2-2A2 2 0 0 0 17 2h-3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1z" />
    </g>
  </>,
);
