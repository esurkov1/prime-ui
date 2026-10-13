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
          name: "live",
          type: '"polite" | "assertive"',
          en: 'An announcement region, read as a whole on every change: `polite` — `role="status"`, `assertive` — `role="alert"` (urgent only).',
          ru: 'Область объявлений, зачитывается целиком при каждом изменении: `polite` — `role="status"`, `assertive` — `role="alert"` (только срочное).',
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`id` (to point `aria-describedby` at it), `className` and the other span attributes.",
          ru: "`id` (для `aria-describedby`), `className` и остальные атрибуты.",
        },
      ],
    },
  ],
  labels: [],
};
