import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "VisuallyHidden",
      en: "`ref` → `HTMLSpanElement`. A `<span>` that is out of sight and still read by screen readers (the sr-only recipe, pinned so it never stretches a scrolling column).",
      ru: "`<span>` вне поля зрения, который всё равно читают скринридеры (рецепт sr-only, закреплён, чтобы не растягивать прокручиваемую колонку).",
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
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "role" | "aria-live" | "aria-atomic" | "aria-relevant">',
          en: "`id` (to point `aria-describedby` at it), `className` and the other span attributes; the region attributes come only from `live`.",
          ru: "`id` (для `aria-describedby`), `className` и остальные атрибуты; атрибуты области задаёт только `live`.",
        },
      ],
    },
  ],
  labels: [],
  accessibility: {
    keyboard: [],
    aria: [
      {
        en: "The text stays in the accessibility tree: it joins the accessible name of the element around it.",
        ru: "Текст остаётся в дереве доступности и входит в имя элемента вокруг.",
      },
      {
        en: 'With `live="polite"` it is a polite live region (`role="status"`), with `live="assertive"` an alert (`role="alert"`) for what cannot wait; keep it mounted and change its text — a region mounted together with its message is often not read.',
        ru: 'С `live="polite"` — вежливая живая область (`role="status"`), с `live="assertive"` — срочное объявление (`role="alert"`): держите её смонтированной и меняйте текст.',
      },
    ],
  },
};
