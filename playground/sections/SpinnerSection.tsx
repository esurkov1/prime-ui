import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "spinner",
  title: "Spinner",
  kind: "primitive",
  description:
    "Индикатор загрузки без известного прогресса: кольцо с разрывом вращается, пока идёт запрос. Когда прогресс известен — ProgressBar или ProgressCircle.",
  examples: [
    {
      slot: "overview",
      description: "Статус загрузки рядом с коротким пояснением; спиннер берёт цвет текста.",
    },
    {
      slot: "variants",
      description: "Все цвета кольца; `default` следует за текстом вокруг — `tone`.",
    },
    { slot: "sizes", description: "Все размеры по шкале иконок, от 14 до 32 px — `size`." },
    {
      scenario: "loading-region",
      title: "Загрузка блока",
      description:
        "Карточка грузит содержимое: область сообщает о загрузке, а спиннер скрыт от скринридеров — `aria-hidden`.",
    },
  ],
  api: [
    {
      name: "Spinner",
      description: 'Вращающееся кольцо в области `role="status"` с текстом для скринридеров.',
      rows: [
        {
          prop: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultValue: "—",
          required: "Нет",
          description:
            "Размер по шкале иконок: 14 · 16 · 20 · 24 · 32. Без него — как у `Icon`: размер иконки хоста, иначе ярус ближайшего контрола, иначе 16.",
        },
        {
          prop: "tone",
          type: '"default" | "secondary" | "muted" | "accent" | "success" | "warning" | "danger"',
          defaultValue: '"default"',
          required: "Нет",
          description: "Цвет кольца; `default` берёт `currentColor`.",
        },
        {
          prop: "labels",
          type: "Partial<SpinnerLabels>",
          defaultValue: '{ loading: "Загрузка" }',
          required: "Нет",
          description: "Текст для скринридеров.",
        },
        {
          prop: "…rest",
          type: 'Omit<React.HTMLAttributes<HTMLSpanElement>, "children">',
          defaultValue: "—",
          required: "Нет",
          description: "`className`, `aria-hidden`, `data-*` и остальные атрибуты span; `ref`.",
        },
      ],
    },
  ],
  accessibility: {
    keyboard: [],
    aria: [
      '`role="status"` со скрытым текстом `labels.loading`: скринридер узнаёт о загрузке.',
      'Внутри хоста, который уже сообщает о загрузке (`aria-busy` на кнопке или области), передайте `aria-hidden="true"`.',
      "Под `prefers-reduced-motion` кольцо не вращается и остаётся видимым.",
    ],
    labels: [
      {
        key: "loading",
        defaultValue: "Загрузка",
        description: 'Текст для скринридеров внутри `role="status"`.',
      },
    ],
  },
};

export default function SpinnerSection() {
  return <ComponentPage page={page} />;
}
