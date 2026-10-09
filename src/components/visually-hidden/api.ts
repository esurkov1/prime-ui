import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "VisuallyHidden",
      en: "`ref` → `HTMLSpanElement`. A `<span>` that is out of sight and still read by screen readers (the sr-only recipe, pinned so it never stretches a scrolling column).",
      ru: "Текст только для скринридеров: не виден, но зачитывается.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "The text to read.",
          ru: "Текст, который зачитывается.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: '`id` (to point `aria-describedby` at it), `role="status"` with `aria-live` for an announcement, `className` and the other span attributes.',
          ru: '`id` (для `aria-describedby`), `role="status"` с `aria-live` для объявления, `className` и остальные атрибуты.',
        },
      ],
    },
  ],
  labels: [],
};
