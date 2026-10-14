import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "CodeBlock",
      en: "`ref` → `HTMLPreElement`. Renders `<pre><code>`: the tokens of `code` as text in coloured spans, never as HTML. A `soft` block scrolls sideways through ScrollContainer.",
      ru: "Рендерит `<pre><code>`: токены `code` — текст в цветных span, никогда не HTML. Блок `soft` прокручивается вбок через ScrollContainer.",
      props: [
        {
          name: "code",
          type: "string",
          required: true,
          en: "TS / TSX source; trailing whitespace is trimmed, then highlighted.",
          ru: "Исходный TS / TSX; хвостовые пробелы обрезаются, затем подсветка.",
        },
        {
          name: "variant",
          type: '"soft" | "ghost"',
          default: '"soft"',
          en: "`soft` — a filled panel (one ladder step off its host) with padding and the `code` text role; `ghost` — bare `pre` that inherits type and background from its host.",
          ru: "`soft` — залитая панель (на шаг лестницы от хоста) с отступами и ролью текста `code`; `ghost` — голый `pre`, шрифт и фон от хоста.",
        },
        {
          name: "colorScheme",
          type: '"light" | "dark"',
          en: "Fixes the theme for this block only (`data-theme`). Omit to follow the page theme.",
          ru: "Фиксирует тему только для блока (`data-theme`). Без него — тема страницы.",
        },
        {
          name: "tabIndex",
          type: "number",
          en: "Default `0` for `soft` (a scrolling block stays reachable from the keyboard), none for `ghost`; pass `-1` when it never overflows.",
          ru: "По умолчанию `0` для `soft` (прокручиваемый блок доступен с клавиатуры), нет для `ghost`; `-1`, если блок не переполняется.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLPreElement>, "children">',
          en: "`className`, `aria-label` and the other `<pre>` attributes.",
          ru: "`className`, `aria-label` и остальные атрибуты `<pre>`.",
        },
      ],
    },
  ],
  labels: [],
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Focuses a `soft` block so overflowing code can be scrolled.",
        ru: "Фокус на блоке `soft`, чтобы прокрутить длинный код.",
      },
      {
        keys: "← · →",
        native: true,
        en: "Scroll a focused block horizontally.",
        ru: "Горизонтальная прокрутка блока в фокусе.",
      },
    ],
    aria: [
      {
        en: "Native `<pre>` / `<code>`; screen readers read the text.",
        ru: "Нативные `<pre>` / `<code>`: скринридер читает текст.",
      },
      {
        en: "A `soft` block is a Tab stop (`tabIndex=0`); pass `tabIndex={-1}` when it never overflows.",
        ru: "Блок `soft` — точка табуляции (`tabIndex=0`); `tabIndex={-1}`, если он не переполняется.",
      },
      {
        en: "Give standalone blocks an `aria-label` («Команда установки»).",
        ru: "Самостоятельному блоку задайте `aria-label` («Команда установки»).",
      },
    ],
  },
};
