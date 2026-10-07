import { api } from "@/components/spinner/api";

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
  api,
  accessibility: {
    keyboard: [],
    aria: [
      '`role="status"` со скрытым текстом `labels.loading`: скринридер узнаёт о загрузке.',
      'Внутри хоста, который уже сообщает о загрузке (`aria-busy` на кнопке или области), передайте `aria-hidden="true"`.',
      "Под `prefers-reduced-motion` кольцо не вращается и остаётся видимым.",
    ],
  },
};

export default function SpinnerSection() {
  return <ComponentPage page={page} />;
}
