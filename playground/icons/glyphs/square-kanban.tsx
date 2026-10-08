import { defineGlyph } from "@/icons/glyph";

/** Lucide `square-kanban`: the column cards dip and grow back one after another. */
export const SquareKanban = /* @__PURE__ */ defineGlyph(
  "SquareKanban",
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M8 7v7" data-motion="grow" data-origin="top" />
    <path d="M12 7v4" data-motion="grow" data-origin="top" data-delay="1" />
    <path d="M16 7v9" data-motion="grow" data-origin="top" data-delay="2" />
  </>,
);
