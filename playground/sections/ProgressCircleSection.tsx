import { api } from "@/components/progress-circle/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "progress-circle",
  title: "ProgressCircle",
  kind: "primitive",
  description:
    "Круговой прогресс — кольцевая версия ProgressBar: одно значение или сегменты целого, цвет статуса и содержимое в центре. Для компактных метрик и узких мест.",
  examples: [
    {
      slot: "overview",
      description:
        "Кольцо плана с процентом в центре и именем для скринридеров — `value`, `aria-label`.",
    },
    {
      slot: "variants",
      description: "Все цвета дуги; тон говорит об исходе, а не о прогрессе — `tone`.",
    },
    {
      slot: "sizes",
      description: "Диаметр от 24 до 80 px; на `xs` и `s` текст в центре не рендерится — `size`.",
    },
    {
      scenario: "inner-content",
      title: "Содержимое в центре",
      description: "В центре процент, счёт по своей шкале или иконка — `children`, `max`.",
    },
    {
      scenario: "segments",
      title: "Сегменты",
      description:
        "Части целого по часовой стрелке от верха: замкнутое кольцо, свободный остаток до `max`, отдельные дуги и пустой список — `segments`, `segmentGap`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      'Режим значения: svg с `role="progressbar"` и `aria-valuenow` / `-min` / `-max`; строка или число в центре — `aria-valuetext`.',
      'Режим сегментов: svg с `role="group"`; с `aria-label` доли — описание, без него доли — имя.',
      "Всегда передавайте `aria-label`: подпись рядом с кольцом с ним не связана.",
    ],
  },
};

export default function ProgressCircleSection() {
  return <ComponentPage page={page} />;
}
