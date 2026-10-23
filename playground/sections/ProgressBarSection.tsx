import { api } from "@/components/progress-bar/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { StretchHorizontal } from "../icons";

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
      "штрихи",
      "шаги",
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
    "Линейный прогресс: одно значение на нативном `<progress>`, сегменты, которые делят целое (место по типам файлов, лиды по источникам), или рейтинг строками. Когда прогресс неизвестен — Spinner.",
  examples: [
    {
      slot: "overview",
      description: "Импорт в процессе с названием и процентом — `value`, `label`, `showValue`.",
    },
    {
      slot: "variants",
      description:
        "Все виды шкалы и все цвета заливки; тон говорит об исходе, а не о прогрессе — `variant`, `tone`.",
    },
    {
      slot: "sizes",
      description:
        "Все ярусы: линия растёт от 4 до 8 px, как дорожка Slider, штрихи — от 16 до 40 px в высоту — `size`, `variant`.",
    },
    {
      slot: "states",
      description:
        "Загрузка занимает геометрию самой полосы, поэтому данные встают без скачка — `loading`.",
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
        "Части целого в одной полосе: слитно или отдельными капсулами, свободный остаток до `max` и пустой список со своим текстом для скринридеров — `segments`, `segmentGap`, `max`, `labels`.",
    },
    {
      scenario: "legend",
      title: "Легенда и цвета категорий",
      description:
        "Доли категорий в цветах графиков с легендой «цвет · название · число · доля» — `color`, `legend`, `formatValue`.",
    },
    {
      scenario: "ranking",
      title: "Рейтинг",
      description:
        "Рейтинг строками «подпись · число · доля» над полосой: города от лидера и воронка от первого шага, каждый шаг — ссылка — `layout`, `scale`, `href`.",
    },
    {
      scenario: "own-scale",
      title: "Своя шкала у строки",
      description:
        "Рейтинг, где у каждой строки своя шкала: загрузка парка по моделям, каждая модель от своего парка, строка — ссылка — `layout`, `scale`, `max`, `href`.",
    },
    {
      scenario: "percent-rows",
      title: "Значения в процентах",
      description:
        "Рейтинг, где значение уже процент: загрузка по моделям, строка показывает только его — `layout`, `scale`, `showShare`, `formatValue`.",
    },
    {
      scenario: "steps",
      title: "Ступени",
      description:
        "Шкала целыми ячейками, которые заполняет один фронт: 2 из 5 шагов настройки, вперёд и назад — `variant`, `max`.",
    },
    {
      scenario: "ticks",
      title: "Штрихи",
      description:
        "Штрихов столько, сколько помещается по ширине: совпадение с запросом и индекс, по которому ещё нет данных — `variant`, `size`, `tone`.",
    },
    {
      scenario: "ticks-legend",
      title: "Штрихи с легендой",
      description:
        "Лиды по каналам штрихами с легендой; другой период двигает один фронт и перекрашивает штрихи — `variant`, `segments`, `legend`.",
    },
    {
      scenario: "milestone",
      title: "Редкое событие",
      description:
        "Последний счёт квартала заполняет полосу, тон становится успехом, короткое конфетти отмечает событие — `value`, `tone`, `celebrate()`.",
    },
  ],
  api,
};
