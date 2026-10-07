import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "CodeBlock",
      en: "`ref` → `HTMLPreElement`. Renders `<pre><code>`; the markup comes from the escaped, highlighted `code`.",
      ru: "Рендерит `<pre><code>`; разметка — экранированный и подсвеченный `code`.",
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
          en: "`soft` — sunken panel with padding and the `code` text role; `ghost` — bare `pre` that inherits type and background from its host.",
          ru: "`soft` — утопленная панель с отступами и ролью текста `code`; `ghost` — голый `pre`, шрифт и фон от хоста.",
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
          type: 'Omit<HTMLAttributes<HTMLPreElement>, "children" | "dangerouslySetInnerHTML">',
          en: "`className`, `aria-label` and the other `<pre>` attributes.",
          ru: "`className`, `aria-label` и остальные атрибуты `<pre>`.",
        },
      ],
    },
  ],
  labels: [],
};
