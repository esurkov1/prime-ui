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
    "Маленький график — плавная линия с заливкой, линия или столбики — с заголовком: значение, изменение и дата. Ведите по графику, чтобы увидеть любую точку.",
  examples: [
    {
      slot: "overview",
      description:
        "Выручка за 30 дней в карточке дашборда: в покое — сумма за период против прошлых 30 дней, ведите по графику, чтобы увидеть день — `data`, `label`, `summary`, `compareTo`, `formatValue`.",
    },
    {
      slot: "variants",
      description: "Одна неделя заливкой, голой линией и столбиками от нуля — `variant`.",
    },
    {
      slot: "sizes",
      description: "Одна неделя заказов на каждом ярусе, от графика 40 px до 128 px — `size`.",
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
        "Выручка клиентов по месяцам в списке: только график высотой со строку и точкой на текущем месяце, при ведении месяц показывает подсказка, название — доступное имя графика — `layout`, `label`.",
    },
    {
      scenario: "signed-bars",
      title: "Столбики со знаком",
      description:
        "Прибыль по месяцам со знаком: убытки уходят под нулевую линию, текущий месяц выделен в покое, любой столбик показывает значение под курсором и стрелками — `variant`, `highlight`.",
    },
    {
      scenario: "curve",
      title: "Форма линии",
      description:
        "Один месяц активных пользователей плавной кривой, прямыми отрезками и ступенями — `curve`.",
    },
    {
      scenario: "reference",
      title: "Ориентир",
      description:
        "Конверсия оформления заказа против плана: пунктир ориентира, шкала от нуля до 5% и изменение за весь период в процентных пунктах — `reference`, `min`, `max`, `change`, `changeUnit`.",
    },
    {
      scenario: "lower-is-better",
      title: "Рост — плохо",
      description:
        "Время первого ответа по дням, где хорошо падение: рост красит изменение красным, падение — зелёным — `better`, `summary`, `compareTo`.",
    },
    {
      scenario: "own-value",
      title: "Своё значение периода",
      description:
        "Уникальные клиенты в диалогах: число за период — не сумма и не среднее дней, поэтому карточка передаёт его вместе с числом прошлого периода — `value`, `compareTo`.",
    },
    {
      scenario: "gaps",
      title: "Пропуски",
      description:
        "Запросы к API по дням с днями, когда сборщик не работал: линия прерывается на пропуске, а заголовок говорит, что данных нет — `data`, `labels`.",
    },
    {
      scenario: "period",
      title: "Смена периода",
      description:
        "Другой период меняет ряд: линия проявляется заново, цифры заголовка докручиваются до новой суммы — `data`, `summary`.",
    },
    {
      slot: "controlled",
      description:
        "KPI-плитки дашборда идут за одним курсором: ведение по любой двигает точку и заголовок у всех, подсказка не повторяет заголовки, а каждая плитка открывает свой раздел — `point`, `onPointChange`, `size`.",
    },
  ],
  api,
};
