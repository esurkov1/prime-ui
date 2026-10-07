import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "PageContent.Root",
      en: "`forwardRef` → `HTMLDivElement`. The page column inside `main`: header → body 32 apart, centred under its cap.",
      ru: "Колонка страницы внутри `main`: шапка и тело с ритмом 32, по центру под своим ограничением.",
      props: [
        {
          name: "maxWidth",
          type: '"full" | "readable" | "wide"',
          default: '"full"',
          en: "Cap of the column: the whole main, `--prime-layout-content-max-width`, or a ~65ch reading measure.",
          ru: "Ограничение колонки: весь main, ширина контента или колонка для чтения (~65 знаков).",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (Header, Body), `className` and the other div attributes.",
          ru: "`children` (Header, Body), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "PageContent.Section",
      en: "`forwardRef` → `HTMLElement`. The same column as a `<section>`, without a cap; name it with `aria-labelledby` → the Title `id`.",
      ru: "Та же колонка как `<section>` без ограничения ширины; назовите её через `aria-labelledby` на `id` заголовка.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `aria-labelledby`, `className` and the other section attributes.",
          ru: "`children`, `aria-labelledby`, `className` и остальные атрибуты section.",
        },
      ],
    },
    {
      name: "PageContent.Header",
      en: "`ref` → `HTMLDivElement`. Heading column and page actions in one wrapping row; `PageContent.Actions` children move to the end.",
      ru: "Колонка заголовка и действия страницы в одном переносимом ряду; `PageContent.Actions` уходят в конец.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (Title, Description, Actions), `className` and the other div attributes.",
          ru: "`children` (Title, Description, Actions), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "PageContent.Title",
      en: "`forwardRef` → `HTMLHeadingElement`. The page `<h1>` in heading-m.",
      ru: "Заголовок страницы `<h1>` стилем heading-m.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLHeadingElement>",
          en: "`children`, `id`, `className` and the other heading attributes.",
          ru: "`children`, `id`, `className` и остальные атрибуты заголовка.",
        },
      ],
    },
    {
      name: "PageContent.Description",
      en: "`forwardRef` → `HTMLParagraphElement`. Intro `<p>` in secondary body-m.",
      ru: "Вводный абзац `<p>` вторичным body-m.",
      props: [
        {
          name: "measure",
          type: '"readable" | "full"',
          default: '"readable"',
          en: "`readable` — max ~65ch; `full` — the full width of the parent.",
          ru: "`readable` — не шире ~65 знаков; `full` — во всю ширину родителя.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLParagraphElement>",
          en: "`children`, `className` and the other paragraph attributes.",
          ru: "`children`, `className` и остальные атрибуты абзаца.",
        },
      ],
    },
    {
      name: "PageContent.Actions",
      en: "`ref` → `HTMLDivElement`. Page-level buttons next to the title; they wrap under the heading on narrow columns.",
      ru: "Кнопки страницы рядом с заголовком; в узкой колонке переносятся под него.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (Buttons), `className` and the other div attributes.",
          ru: "`children` (кнопки), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "PageContent.Body",
      en: "`ref` → `HTMLDivElement`. The page content; blocks 40 apart.",
      ru: "Содержимое страницы; блоки с отступом 40.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
  ],
  labels: [],
};
