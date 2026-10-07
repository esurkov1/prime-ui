import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Spinner",
      en: '`ref` → `HTMLSpanElement`. A turning ring inside a `role="status"` region with text for screen readers.',
      ru: 'Вращающееся кольцо в области `role="status"` с текстом для скринридеров.',
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          en: "Explicit size on the icon scale: 14 · 16 · 20 · 24 · 32. Without it the spinner follows its host like `Icon`: the host's `--prime-icon-size`, else the nearest control tier, else 16.",
          ru: "Размер по шкале иконок: 14 · 16 · 20 · 24 · 32. Без него — как у `Icon`: размер иконки хоста, иначе ярус ближайшего контрола, иначе 16.",
        },
        {
          name: "tone",
          type: '"default" | "secondary" | "muted" | "accent" | "success" | "warning" | "danger"',
          default: '"default"',
          en: "Ring color; `default` inherits `currentColor`.",
          ru: "Цвет кольца; `default` берёт `currentColor`.",
        },
        {
          name: "labels",
          type: "Partial<SpinnerLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className`, `aria-hidden`, `data-*` and the other span attributes.",
          ru: "`className`, `aria-hidden`, `data-*` и остальные атрибуты span.",
        },
      ],
    },
  ],
  labels: [
    {
      key: "loading",
      default: "Загрузка",
      en: 'Visually hidden text inside `role="status"`.',
      ru: 'Текст для скринридеров внутри `role="status"`.',
    },
  ],
};
