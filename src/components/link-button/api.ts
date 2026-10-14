import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "LinkButton",
      en: "`ref` → `HTMLAnchorElement` (the child with `asChild`). A native `<a>` styled as a text action; passes its tier to nested icons.",
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
          default: 'host tier, else "m"',
          en: "Control tier: text 12 · 13 · 14 · 16 · 18, line height and icon size. Without it the tier of its host (a form, a panel, a hint), else `m`.",
          ru: "Ярус контрола: кегль 12 · 13 · 14 · 16 · 18, межстрочный интервал и размер иконки.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: 'Renders `<a role="link" aria-disabled="true" tabIndex={-1}>` without `href` and swallows the click; `id`, `aria-*` and the other native props stay.',
          ru: 'Рендерит `<a role="link" aria-disabled="true">` без `href`, вне порядка Tab и без клика; `id`, `aria-*` и прочие атрибуты сохраняются.',
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
  accessibility: {
    keyboard: [
      {
        keys: "Enter",
        en: "Follows the link (native `<a>`).",
        ru: "Переходит по ссылке (нативное поведение `<a>`).",
      },
      {
        keys: "Tab",
        en: "Moves focus; a disabled link is skipped.",
        ru: "Переводит фокус; неактивная ссылка пропускается.",
      },
    ],
    aria: [
      {
        en: "A native `<a>`: announced as a link, named by its text.",
        ru: "Нативный `<a>`: объявляется как ссылка, имя — её текст.",
      },
      {
        en: 'The disabled state is a non-focusable `<a role="link" aria-disabled="true">` without `href`; it keeps `id` and `aria-*`.',
        ru: 'Неактивная ссылка — `<a role="link" aria-disabled="true">` без `href`, вне порядка фокуса.',
      },
      {
        en: "With `asChild` the child gives the role and name: a router link, or a `<button>` for an action.",
        ru: "С `asChild` роль и имя даёт вложенный элемент: ссылка роутера или `<button>` для действия.",
      },
      {
        en: "Icons are decorative; say «новая вкладка» in the text or `aria-label` for external links.",
        ru: "Иконки декоративные; о новой вкладке скажите в тексте или в `aria-label`.",
      },
    ],
  },
};
