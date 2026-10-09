import { api } from "@/components/progress-circle/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { CircleGauge } from "../icons";

export const page: ComponentPageConfig = {
  category: "status",
  nav: {
    segment: "progress-circle",
    label: "Progress Circle",
    summary: "Круговой индикатор прогресса",
    keywords: ["прогресс", "круг", "кольцо", "value"],
    icon: CircleGauge,
    order: 4,
  },
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
      slot: "states",
      description:
        "Загрузка — Skeleton-кольцо того же диаметра и толщины; число в центре ждёт данных — `loading`.",
    },
    {
      scenario: "inner-content",
      title: "Содержимое в центре",
      description: "В центре процент, счёт по своей шкале или иконка — `children`, `max`.",
    },
    {
      scenario: "under-way",
      title: "Доля неизвестна и вращение",
      description:
        "Импорт, доля которого ещё неизвестна, крутит четверть дуги, потом заполняется и меняет иконку; синхронизация вращается, пока её доля растёт — `value`, `spin`, `children`.",
    },
    {
      scenario: "segments",
      title: "Сегменты",
      description:
        "Части целого по часовой стрелке от верха: замкнутое кольцо, свободный остаток до `max`, отдельные дуги и пустой список — `segments`, `segmentGap`.",
    },
    {
      scenario: "legend",
      title: "Легенда и цвета категорий",
      description:
        "Кольцо долей категорий с легендой рядом, в цветах категорий на графиках — `color`, `legend`, `formatValue`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      'Режим значения: svg с `role="progressbar"` и `aria-valuenow` / `-min` / `-max`; строка или число в центре — `aria-valuetext`. С `value={null}` `aria-valuenow` нет — доля неизвестна.',
      "Вращение не останавливается и при reduced motion (оборот вдвое медленнее): это единственный знак, что работа идёт.",
      'Режим сегментов: svg с `role="group"`; с `aria-label` доли — описание (с `legend` — сама легенда), без него доли — имя.',
      "Цвет категории всегда стоит рядом с её названием в легенде — смысл не передаётся только цветом.",
      "Во время `loading` корень помечен `aria-busy`, заглушки скрыты от скринридеров.",
      "Всегда передавайте `aria-label`: подпись рядом с кольцом с ним не связана.",
    ],
  },
};
