import { StretchHorizontal } from "lucide-react";
import { api } from "@/components/progress-bar/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "status",
  nav: {
    segment: "progress-bar",
    label: "Progress Bar",
    summary: "Линейный прогресс: одно значение или части целого",
    keywords: [
      "прогресс",
      "загрузка",
      "сегменты",
      "распределение",
      "квоты",
      "value",
      "max",
      "segments",
    ],
    icon: StretchHorizontal,
    order: 3,
  },
  dir: "progress-bar",
  title: "ProgressBar",
  kind: "primitive",
  description:
    "Линейный прогресс: одно значение на нативном `<progress>` или сегменты, которые делят целое (место по типам файлов, задачи по статусам). Когда прогресс неизвестен — Spinner.",
  examples: [
    {
      slot: "overview",
      description: "Импорт в процессе с названием и процентом — `value`, `label`, `showValue`.",
    },
    {
      slot: "variants",
      description: "Все цвета заливки; тон говорит об исходе, а не о прогрессе — `tone`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы: линия растёт от 4 до 8 px, как дорожка Slider — `size`.",
    },
    {
      scenario: "custom-max",
      title: "Своя шкала",
      description: "Шкала шагов вместо процентов: 3 из 5 шагов профиля — `max`.",
    },
    {
      scenario: "segments",
      title: "Сегменты",
      description:
        "Части целого в одной полосе: слитно или отдельными капсулами, свободный остаток до `max` и пустой список — `segments`, `segmentGap`, `max`.",
    },
    {
      scenario: "steps",
      title: "Ступени",
      description:
        "Шкала целыми ячейками, которые заполняются друг за другом: 2 из 5 шагов настройки, вперёд и назад — `steps`, `max`.",
    },
    {
      scenario: "milestone",
      title: "Редкое событие",
      description:
        "Последний счёт квартала заполняет полосу, тон становится успехом, короткое конфетти отмечает событие — `value`, `tone`, `celebrate()`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      "Режим значения: нативный `<progress>` — роль `progressbar` со значением и максимумом.",
      'Режим сегментов: `role="group"`; доли читаются текстом «Видео: 38%, Документы: 21%». С `label` полоса названа подписью, а доли — описание.',
      "Без `label` задайте `aria-label`, иначе у полосы значения нет имени.",
      "Процент `showValue` скрыт от скринридеров (`aria-hidden`).",
    ],
  },
};
