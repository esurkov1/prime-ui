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
      slot: "states",
      description:
        "Загрузка, пустое состояние, ошибка и данные сменяются на месте графика, не сдвигая панель; ошибка повторяет загрузку — `state`, `onRetry`.",
    },
    {
      slot: "controlled",
      description:
        "Источники лидов с итогами в легенде; скрытые ряды живут в состоянии страницы, одна кнопка возвращает все — `hiddenSeries`, `onHiddenSeriesChange`.",
    },
    {
      slot: "narrow",
      description:
        "Колонка 320px: действия уходят под заголовок, график ниже, SVG с viewBox растягивается по области — `children`, `height`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        action:
          "Действия заголовка, затем легенда одной остановкой (запись, на которой был фокус), затем элементы графика, если они фокусируемы.",
      },
      {
        keys: "← · → · ↑ · ↓",
        action: "Предыдущая или следующая запись легенды, по кругу.",
      },
      { keys: "Home · End", action: "Первая или последняя запись легенды." },
      { keys: "Enter · Space", action: "Показать или скрыть ряд записи." },
    ],
    aria: [
      "Корень — `<figure>` с именем из `ChartFrame.Title` и описанием из `ChartFrame.Description`; во время загрузки `aria-busy`.",
      "Запись легенды — кнопка с `aria-pressed`: нажата, когда ряд показан. Скрытый ряд отличается формой образца (кольцо) и приглушённым названием, а не только цветом.",
      "`ChartFrame.Table` — визуально скрытая таблица с теми же данными, что и график, с именем из заголовка: строка на точку, столбец на показанный ряд.",
      'Пустое состояние — `role="status"`, ошибка — `role="alert"` с кнопкой «Повторить».',
      "`ChartFrame.Tooltip` с `point` скрыт от вспомогательных технологий и пассивен (без фокуса, `Escape` прячет его до следующей точки): он повторяет то, что озвучивает сам график.",
      "Сам рисунок графика — забота библиотеки: скрывайте декоративный SVG (`aria-hidden`), когда данные есть в `ChartFrame.Table`.",
    ],
  },
};
