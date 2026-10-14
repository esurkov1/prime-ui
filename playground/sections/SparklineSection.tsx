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
    "Маленький график линией или столбиками с заголовком: значение, изменение к предыдущей точке и дата. Ведите по графику, чтобы увидеть любую точку.",
  examples: [
    {
      slot: "overview",
      description:
        "Выручка за 30 дней в карточке дашборда: ведите по графику, заголовок следует за курсором, а стрелка тренда поворачивается — `data`, `label`, `formatValue`.",
    },
    {
      slot: "variants",
      description: "Одна неделя линией и столбиками от нуля — `variant`.",
    },
    {
      slot: "states",
      description:
        "Пока ряд загружается, дата, значение и график — Skeleton на своих местах; название остаётся — `loading`.",
    },
    {
      scenario: "compact",
      title: "Компактный",
      description:
        "Выручка клиентов по месяцам в списке: только график высотой со строку и точкой на текущем месяце, название — доступное имя графика — `layout`, `label`.",
    },
    {
      scenario: "signed-bars",
      title: "Столбики со знаком",
      description:
        "Прибыль по месяцам со знаком: убытки уходят под нулевую линию, текущий месяц выделен в покое, любой столбик показывает значение под курсором и стрелками — `variant`, `highlight`.",
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
      {
        keys: "← · → · ↓ · ↑",
        action:
          "Предыдущая или следующая точка: `←` / `↓` назад, `→` / `↑` вперёд, как у слайдера.",
      },
      { keys: "Home · End", action: "Первая или последняя точка." },
      {
        keys: "Tab",
        action: "Фокус на график; уход фокуса возвращает точку покоя (последнюю или `highlight`).",
      },
    ],
    aria: [
      'График — `role="slider"` с именем из `label`; `aria-valuetext` озвучивает точку: «8 окт: 312 400 ₽».',
      "Заголовок с последним значением и изменением читается как обычный текст.",
      "Изменение показано знаком и стрелкой, а не только цветом; отрицательный столбик уходит вниз, а не только краснеет.",
      "Во время `loading` корень помечен `aria-busy`, графика в порядке фокуса ещё нет.",
      '`layout="compact"`: видимого заголовка нет, `label` — только имя слайдера, значение точки — в `aria-valuetext`. Указатель и клавиши на графике не открывают строку DataTable (`role="slider"`, `data-row-click-ignore`).',
    ],
  },
};
