import { api } from "@/components/chart-frame/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { ChartColumn } from "../icons";

export const page: ComponentPageConfig = {
  category: "data-display",
  nav: {
    segment: "chart-frame",
    label: "ChartFrame",
    summary: "Панель графика для любой библиотеки",
    keywords: [
      "график",
      "диаграмма",
      "легенда",
      "подсказка",
      "chart",
      "recharts",
      "echarts",
      "дашборд",
    ],
    icon: ChartColumn,
    order: 11.5,
  },
  dir: "chart-frame",
  title: "ChartFrame",
  kind: "composite",
  description:
    "Панель дашборда вокруг любого графика — Recharts, ECharts, visx, Chart.js или своего SVG: заголовок, главное число, область графика с размером, легенда, подсказка и таблица для скринридеров. Состояния загрузки, пустоты и ошибки сменяются на месте графика.",
  examples: [
    {
      slot: "overview",
      description:
        "Выручка по месяцам линиями на своём SVG в панели дашборда: главное число с изменением, переключатель периода, легенда выключает ряды, таблица для скринридеров — `series`, `formatValue`, `renderPlot`.",
    },
    {
      scenario: "tooltip",
      title: "Подсказка",
      description:
        "Счета по неделям сгруппированными столбиками: подсказка кита идёт за курсором со строкой на ряд, стрелки шагают по неделям — `ChartFrame.Tooltip`, `items`, `point`.",
    },
    {
      scenario: "fill-height",
      title: "Высота по соседям",
      description:
        "Выручка против плана рядом с двумя плитками KPI: график занимает высоту растянутой ячейки сетки, а линия плана скрыта, пока её не включит легенда — `height`, `defaultHiddenSeries`.",
    },
    {
      slot: "states",
      description:
        "Загрузка, пустое состояние, ошибка и данные сменяются на месте графика, не сдвигая панель; ошибка повторяет загрузку, а легенда единственного ряда только называет его — `state`, `onRetry`, `readOnly`.",
    },
    {
      slot: "controlled",
      description:
        "Источники лидов с итогами в легенде; скрытые ряды живут в состоянии страницы, одна кнопка возвращает все — `hiddenSeries`, `onHiddenSeriesChange`.",
    },
    {
      slot: "narrow",
      description:
        "Колонка 320px: действия уходят под заголовок, график ниже, SVG с viewBox растягивается по области — `height`, `rows`.",
    },
  ],
  api,
};
