import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "LinkButton",
      en: "`forwardRef` → `HTMLAnchorElement` (the `<span>` when `disabled`, the child with `asChild`). A native `<a>` styled as a text action; passes its tier to nested icons.",
      ru: "Нативная ссылка `<a>` в виде текстового действия; передаёт ярус вложенным иконкам.",
      props: [
        {
          name: "tone",
          type: '"accent" | "neutral"',
          default: '"accent"',
          en: "`accent` — a regular link; `neutral` — secondary text, primary on hover, for footers and metadata.",
          ru: "`accent` — обычная ссылка; `neutral` — вторичный текст, на наведении основной: футеры и метаданные.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Control tier: text 12 · 13 · 14 · 16 · 18, line height and icon size.",
          ru: "Ярус контрола: кегль 12 · 13 · 14 · 16 · 18, межстрочный интервал и размер иконки.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: 'Renders `<span role="link" aria-disabled="true" tabIndex={-1}>` without `href`; the native anchor props are not passed.',
          ru: 'Рендерит `<span role="link">` без `href` и вне порядка Tab; атрибуты ссылки не передаются.',
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          en: 'Merges the link look onto its single child instead of rendering `<a>`: a router link, or a `<button type="button">` for an inline action that is not navigation. `disabled` becomes `aria-disabled` and swallows the click.',
          ru: 'Переносит вид ссылки на единственный дочерний элемент вместо `<a>`: ссылку роутера или `<button type="button">` для действия в тексте. `disabled` становится `aria-disabled` и гасит клик.',
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Text and optional `Icon`s before or after it; the text is the accessible name.",
          ru: "Текст и необязательные `Icon` до или после него; текст — доступное имя.",
        },
        {
          name: "…rest",
          type: "AnchorHTMLAttributes<HTMLAnchorElement>",
          en: "`href`, `target`, `rel`, `download`, `onClick`, `className`, `aria-*` and the other anchor attributes.",
          ru: "`href`, `target`, `rel`, `download`, `onClick`, `className`, `aria-*` и остальные атрибуты ссылки.",
        },
      ],
    },
  ],
  labels: [],
};
