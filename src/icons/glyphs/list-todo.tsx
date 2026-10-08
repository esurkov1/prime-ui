import { defineGlyph } from "../glyph";

/** Lucide `list-todo`: the lines dip one after another. */
export const ListTodo = /* @__PURE__ */ defineGlyph(
  "ListTodo",
  <>
    <path d="M13 5h8" data-motion="grow" data-axis="x" data-origin="left" />
    <path d="M13 12h8" data-motion="grow" data-axis="x" data-origin="left" data-delay="1" />
    <path d="M13 19h8" data-motion="grow" data-axis="x" data-origin="left" data-delay="2" />
    <path d="m3 17 2 2 4-4" />
    <rect x="3" y="4" width="6" height="6" rx="1" />
  </>,
);
