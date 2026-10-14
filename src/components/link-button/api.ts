import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "LinkButton",
      en: "`ref` → `HTMLAnchorElement` (the child with `asChild`). A native `<a>` styled as a text action; passes its tier to nested icons.",
      ru: "Нативная ссылка `<a>` в виде текстового действия; передаёт ярус вложенным иконкам.",
      props: [
        {
          name: "href",
          type: "string",
          en: "The destination. Required without `asChild`; with `asChild` the child carries its own target.",
          ru: "Адрес перехода. Обязателен без `asChild`; с `asChild` цель задаёт сам вложенный элемент.",
        },
        {
          name: "tone",
          type: '"accent" | "neutral" | "muted"',
          default: '"accent"',
          en: "`accent` — a regular link; `neutral` — secondary text for footers and metadata; `muted` — muted text with no underline, for trails such as a breadcrumb.",
          ru: "`accent` — обычная ссылка; `neutral` — вторичный текст для футеров и метаданных; `muted` — приглушённый текст без подчёркивания, для цепочек вроде хлебных крошек.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Control tier: text 12 · 13 · 14 · 16 · 18, line height and icon size. Without it the tier of its host (a form, a panel, a hint), else `m`.",
          ru: "Ярус контрола: кегль 12 · 13 · 14 · 16 · 18, межстрочный интервал и размер иконки. Без него — ярус хоста, иначе `m`.",
        },
        {
          name: "inline",
          type: "boolean",
          default: "false",
          en: "A link inside running text: it takes the text's type, wraps with it and keeps its underline drawn.",
          ru: "Ссылка внутри текста: берёт его шрифт, переносится вместе с ним и всегда подчёркнута.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: 'Renders `<a role="link" aria-disabled="true">` without `href`, out of the Tab order, and swallows the click; `id`, `aria-*` and the other native props stay.',
          ru: 'Рендерит `<a role="link" aria-disabled="true">` без `href`, вне порядка Tab, и гасит клик; `id`, `aria-*` и прочие атрибуты сохраняются.',
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          en: 'Merges the link look onto its single child instead of rendering `<a>`: a router link, or a `<button type="button">` for an inline action that is not navigation.',
          ru: 'Переносит вид ссылки на единственный дочерний элемент вместо `<a>`: ссылку роутера или `<button type="button">` для действия в тексте.',
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Text and optional `Icon`s before or after it; the text is the accessible name. With `asChild`, the one child element.",
          ru: "Текст и необязательные `Icon` до или после него; текст — доступное имя. С `asChild` — единственный дочерний элемент.",
        },
        {
          name: "…rest",
          type: 'Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">',
          en: "`target`, `rel`, `download`, `onClick`, `className`, `aria-*` and the other anchor attributes.",
          ru: "`target`, `rel`, `download`, `onClick`, `className`, `aria-*` и остальные атрибуты ссылки.",
        },
      ],
    },
  ],
  labels: [],
  accessibility: {
    keyboard: [
      {
        keys: "Enter",
        native: true,
        en: "Follows the link (native `<a>`). With `asChild` on a `<button>`, `Enter` and `Space` run its action.",
        ru: "Переходит по ссылке (нативное поведение `<a>`). С `asChild` на `<button>` действие запускают `Enter` и `Space`.",
      },
      {
        keys: "Tab",
        native: true,
        en: "Moves focus; a disabled link is skipped, the `asChild` child too (`tabIndex=-1`).",
        ru: "Переводит фокус; неактивная ссылка пропускается, вложенный элемент `asChild` тоже (`tabIndex=-1`).",
      },
    ],
    aria: [
      {
        en: "A native `<a>`: announced as a link, named by its text.",
        ru: "Нативный `<a>`: объявляется как ссылка, имя — её текст.",
      },
      {
        en: 'The disabled state is a non-focusable `<a role="link" aria-disabled="true">` without `href`; it keeps `id` and `aria-*`.',
        ru: 'Неактивная ссылка — нефокусируемая `<a role="link" aria-disabled="true">` без `href`; она сохраняет `id` и `aria-*`.',
      },
      {
        en: "With `asChild` the child gives the role and name: a router link, or a `<button>` for an action.",
        ru: "С `asChild` роль и имя даёт вложенный элемент: ссылка роутера или `<button>` для действия.",
      },
      {
        en: "Icons are decorative; say «новая вкладка» in the text or `aria-label` for external links.",
        ru: "Иконки декоративные; о новой вкладке скажите в тексте или в `aria-label`.",
      },
      {
        en: "`inline` keeps the underline drawn, so a link in text never rests on color alone.",
        ru: "`inline` всегда рисует подчёркивание: ссылка в тексте не держится только на цвете.",
      },
    ],
  },
};
