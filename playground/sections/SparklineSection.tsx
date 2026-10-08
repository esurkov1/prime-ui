import { api } from "@/components/sparkline/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { ChartSpline } from "../icons";

export const page: ComponentPageConfig = {
  category: "data-display",
  nav: {
    segment: "sparkline",
    label: "Sparkline",
    summary: "Маленький график с заголовком и выбором точки",
    keywords: ["график", "тренд", "выручка", "метрика", "chart", "скраббинг"],
    icon: ChartSpline,
    order: 11,
  },
  dir: "sparkline",
  title: "Sparkline",
  kind: "primitive",
  description:
    "Маленький линейный график с заголовком: последнее значение, изменение к предыдущей точке и дата. Ведите по графику, чтобы увидеть любую точку.",
  examples: [
    {
      slot: "overview",
      description:
        "Выручка за 30 дней в карточке дашборда: ведите по графику, заголовок следует за курсором, а стрелка тренда поворачивается — `data`, `label`, `formatValue`.",
    },
    {
      scenario: "period",
      title: "Смена периода",
      description:
        "Другой период меняет ряд: линия проявляется заново, цифры заголовка докручиваются до новой суммы — `data`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "← · →", action: "Предыдущая или следующая точка." },
      { keys: "Home · End", action: "Первая или последняя точка." },
      { keys: "Tab", action: "Фокус на график; уход фокуса возвращает последнюю точку." },
    ],
    aria: [
      'График — `role="slider"` с именем из `label`; `aria-valuetext` озвучивает точку: «8 окт: 312 400 ₽».',
      "Заголовок с последним значением и изменением читается как обычный текст.",
      "Изменение показано знаком и стрелкой, а не только цветом.",
    ],
  },
};
