import { defineGlyph } from "../glyph";

/** Lucide `folder-clock`: the clock spins around the folder. */
export const FolderClock = /* @__PURE__ */ defineGlyph(
  "FolderClock",
  <>
    <path d="M7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2" />
    <g data-motion="spin">
      <path d="M16 14v2.2l1.6 1" />
      <circle cx="16" cy="16" r="6" />
    </g>
  </>,
);
