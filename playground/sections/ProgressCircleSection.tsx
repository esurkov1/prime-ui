import { api } from "@/components/progress-circle/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { CircleGauge } from "../icons";

export const page: ComponentPageConfig = {
  category: "status",
  nav: {
    segment: "progress-circle",
    label: "Progress Circle",
    summary: "Круговой индикатор прогресса",
    keywords: ["прогресс", "круг", "кольцо", "штрихи", "value"],
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
      description:
        "Все виды кольца и все цвета дуги; тон говорит об исходе, а не о прогрессе, цвет палитры — о статусе, бледная дорожка — `variant`, `tone`, `color`, `track`.",
    },
    {
      slot: "sizes",
      description:
        "Диаметр от 24 до 96 px: шкала меток и `2xl` над ней; текст в центре — четверть диаметра, на `xs` не рендерится; штрихов тем больше, чем больше кольцо — `size`, `variant`.",
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
        "Части целого по часовой стрелке от верха: замкнутое кольцо, свободный остаток до `max`, отдельные дуги и пустой список со своим текстом для скринридеров — `segments`, `segmentGap`, `labels`.",
    },
    {
      scenario: "legend",
      title: "Легенда и цвета категорий",
      description:
        "Кольцо долей категорий с легендой рядом, в цветах категорий на графиках — `color`, `legend`, `formatValue`.",
    },
    {
      scenario: "ticks",
      title: "Штрихи",
      description:
        "Кольцо штрихами: доля плана в центре и доли каналов рядом с легендой — `variant`, `segments`, `legend`.",
    },
    {
      scenario: "on-color",
      title: "На цветной подложке",
      description: "Кольцо на цветной подложке берёт цвет её текста — `tone`.",
    },
  ],
  api,
};
