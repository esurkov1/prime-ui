import { defineGlyph } from "../glyph";

/** Lucide `workflow`: the boxes pop in sequence. */
export const Workflow = /* @__PURE__ */ defineGlyph(
  "Workflow",
  <>
    <rect width="8" height="8" x="3" y="3" rx="2" data-motion="pop" />
    <path d="M7 11v4a2 2 0 0 0 2 2h4" />
    <rect width="8" height="8" x="13" y="13" rx="2" data-motion="pop" data-delay="1" />
  </>,
);
