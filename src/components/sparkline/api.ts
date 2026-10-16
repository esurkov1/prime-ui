import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { SPARKLINE_LABELS } from "./Sparkline";

export const api: ComponentApi = {
  parts: [
    {
      name: "Sparkline",
      en: '`ref` → `HTMLDivElement` (the root). A headline (title · date, value · change) over an area, line or bar chart; the chart is a `role="slider"` that picks a point, a tooltip beside the pointer shows the value and date. The change hides when a percentage means nothing.',
      ru: 'Заголовок (название · дата, значение · изменение) над заливкой, линией или столбиками; график — `role="slider"`, выбирающий точку, подсказка у курсора показывает значение и дату. Изменение скрыто, когда процент бессмысленен.',
      props: [
        {
          name: "data",
          type: "SparklinePoint[]",
          required: true,
          en: "Points oldest first, `{ label, value }`; `label` names the point («8 окт»), `value: null` is a point with no data — the line breaks, the bar is absent. A new array cross-fades the chart in.",
          ru: "Точки от старой к новой, `{ label, value }`; `label` — имя точки («8 окт»), `value: null` — точка без данных: линия прерывается, столбика нет. Новый массив проявляет график заново.",
        },
        {
          name: "label",
          type: "string",
          required: true,
          en: 'Visible title above the value and the accessible name of the chart; with `layout="compact"` only the accessible name.',
          ru: 'Видимое название над значением и доступное имя графика; при `layout="compact"` — только доступное имя.',
        },
        {
          name: "variant",
          type: '"area" | "line" | "bars"',
          default: '"area"',
          en: "`area` — a line over an accent gradient that fades to the bottom; `line` — the line alone, for many trends side by side; `bars` — a bar per point standing on a zero line: up when positive, down (danger) when negative.",
          ru: "`area` — линия над градиентом акцента, тающим книзу; `line` — только линия, для многих трендов рядом; `bars` — столбик на точку от нулевой линии: вверх при плюсе, вниз (danger) при минусе.",
        },
        {
          name: "curve",
          type: '"smooth" | "linear" | "step"',
          default: '"smooth"',
          en: "Shape of the line (`area`, `line`): `smooth` — a monotone cubic through every point that never overshoots a peak or a trough; `linear` — straight segments; `step` — a level per point, changing halfway between points.",
          ru: "Форма линии (`area`, `line`): `smooth` — монотонная кубическая кривая через каждую точку, не выходящая за пики и впадины; `linear` — прямые отрезки; `step` — уровень на точку со сменой посередине между точками.",
        },
        {
          name: "layout",
          type: '"default" | "compact"',
          default: '"default"',
          en: "`default` — the headline over an 80 px plot; `compact` — the plot alone at an `xs` control height with the dot at rest, for a DataTable cell; the scrubbed point shows in the tooltip and `aria-valuetext`.",
          ru: "`default` — заголовок над графиком 80 px; `compact` — только график высотой с контрол `xs` и точкой покоя, для ячейки DataTable; выбранная точка — в подсказке и `aria-valuetext`.",
        },
        {
          name: "change",
          type: '"previous" | "first" | "none"',
          default: '"none"',
          en: "What the change badge of a shown point compares it with: `previous` — the point before it; `first` — the first point with a value (the change over the period); `none` — no badge (`compareTo` still badges the rest).",
          ru: "С чем бейдж изменения показанной точки её сравнивает: `previous` — с предыдущей; `first` — с первой точкой со значением (изменение за период); `none` — без бейджа (`compareTo` всё равно даёт бейдж в покое).",
        },
        {
          name: "changeUnit",
          type: '"percent" | "points"',
          default: '"percent"',
          en: "How the change badge measures: `percent` — the relative change («+12%»); `points` — the difference, for a share in percent (`labels.points`, «+0,5 п. п.»). A zero change is neutral, no arrow.",
          ru: "Как бейдж изменения считает: `percent` — относительное изменение («+12%»); `points` — разница, для доли в процентах (`labels.points`, «+0,5 п. п.»). Нулевое — нейтрально, без стрелки.",
        },
        {
          name: "better",
          type: '"higher" | "lower"',
          default: '"higher"',
          en: "Which way of the change is good: `higher` — growth is `success`, a fall `danger` (revenue, orders); `lower` — a fall is `success`, growth `danger` (response time, costs, bounce rate). The arrow always follows the sign.",
          ru: "Какое направление изменения хорошее: `higher` — рост `success`, падение `danger` (выручка, заказы); `lower` — падение `success`, рост `danger` (время ответа, расходы, отказы). Стрелка всегда следует знаку.",
        },
        {
          name: "summary",
          type: '"latest" | "sum" | "average"',
          default: '"latest"',
          en: "What the headline shows at rest: `latest` — the latest point (or `highlight`), for a level (MRR, conversion); `sum` — the period total, for a flow (revenue per day); `average` — the period mean.",
          ru: "Что заголовок показывает в покое: `latest` — последнюю точку (или `highlight`), для уровня (MRR, конверсия); `sum` — сумму за период, для потока (выручка в день); `average` — среднее за период.",
        },
        {
          name: "highlight",
          type: "number",
          defaultNote: { en: "the latest point with a value", ru: "последняя точка со значением" },
          en: 'Index of the point at rest with `summary="latest"` (the current month): the headline returns to it; `bars` draw the other bars quieter. Not allowed with `sum` / `average` / `value`.',
          ru: 'Индекс точки в покое при `summary="latest"` (текущий месяц): заголовок возвращается к ней; в `bars` остальные столбики тише. Не сочетается с `sum` / `average` / `value`.',
        },
        {
          name: "value",
          type: "number | null",
          en: "The period's own value at rest, neither a sum nor a mean of the points (a median, unique clients), with the period as the date; `compareTo` is its previous period. Not with `summary` / `highlight`.",
          ru: "Своё значение периода в покое — не сумма и не среднее точек (медиана, уникальные клиенты), с периодом вместо даты; `compareTo` — его прошлый период. Не с `summary` / `highlight`.",
        },
        {
          name: "compareTo",
          type: "number",
          en: "The same summary (or `value`) for the previous period («прошлые 30 дней»): the badge at rest compares the headline with it. Without it a `sum` / `average` / `value` headline shows no change at rest.",
          ru: "То же значение (или `value`) за прошлый период («прошлые 30 дней»): бейдж в покое сравнивает заголовок с ним. Без него у `sum` / `average` / `value` в покое изменения нет.",
        },
        {
          name: "min",
          type: "number",
          en: "The value axis reaches down to at least this value: a floor of zero, or one scale for several sparklines (a table column). Data below widens the scale, never gets cut.",
          ru: "Ось значений опускается как минимум до этого значения: пол от нуля или одна шкала для нескольких графиков (колонка таблицы). Данные ниже расширяют шкалу, а не обрезаются.",
        },
        {
          name: "max",
          type: "number",
          en: "The value axis reaches up to at least this value; data above widens the scale.",
          ru: "Ось значений поднимается как минимум до этого значения; данные выше расширяют шкалу.",
        },
        {
          name: "reference",
          type: "number",
          en: "A dashed horizontal line at this value — a plan, a target, an average; the scale holds it and the chart is described by `labels.reference`.",
          ru: "Пунктирная горизонтальная линия на этом значении — план, цель, среднее; шкала вмещает её, а график описан через `labels.reference`.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "The series is on its way: Skeletons of the date, the value and the plot that cross-fade into the data; the title stays, the root is `aria-busy` and the chart is not focusable yet.",
          ru: "Ряд загружается: Skeleton даты, значения и графика, которые плавно сменяются данными; название остаётся, корень `aria-busy`, график пока не в фокусе.",
        },
        {
          name: "formatValue",
          type: "(value: number) => string",
          defaultNote: { en: "Russian digit groups", ru: "русские группы разрядов" },
          en: "Display of a value in the headline, the tooltip, the reference description and the spoken point («312 400 ₽»).",
          ru: "Вид значения в заголовке, подсказке, описании ориентира и в озвучке точки («312 400 ₽»).",
        },
        {
          name: "labels",
          type: "Partial<SparklineLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className`, `data-*` and the other div attributes on the root.",
          ru: "`className`, `data-*` и остальные атрибуты div на корне.",
        },
      ],
    },
  ],
  labels: labelRows(SPARKLINE_LABELS, {
    point: {
      en: "Spoken value of the chosen point (`aria-valuetext`); `{label}` and `{value}` are replaced.",
      ru: "Озвучка выбранной точки (`aria-valuetext`); `{label}` и `{value}` подставляются.",
    },
    period: {
      en: "The date line of a `sum` / `average` / `value` headline at rest; `{first}` and `{last}` are the labels of the first and the last point.",
      ru: "Дата заголовка `sum` / `average` / `value` в покое; `{first}` и `{last}` — подписи первой и последней точки.",
    },
    empty: {
      en: "Shown and spoken in place of the value of a point with `value: null`.",
      ru: "Показывается и озвучивается вместо значения точки с `value: null`.",
    },
    points: {
      en: 'The change badge with `changeUnit="points"`; `{value}` is the signed difference.',
      ru: 'Бейдж изменения при `changeUnit="points"`; `{value}` — разница со знаком.',
    },
    reference: {
      en: "Description of the chart with a `reference` line (`aria-describedby`); `{value}` is replaced.",
      ru: "Описание графика с линией `reference` (`aria-describedby`); `{value}` подставляется.",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "← · → · ↓ · ↑",
        en: "Previous or next point: `←` / `↓` back, `→` / `↑` forward, as on a slider.",
        ru: "Предыдущая или следующая точка: `←` / `↓` назад, `→` / `↑` вперёд, как у слайдера.",
      },
      { keys: "Home · End", en: "First or last point.", ru: "Первая или последняя точка." },
      {
        keys: "Tab",
        en: "Focuses the chart; leaving focus returns the headline to rest (`summary`, `highlight`).",
        ru: "Фокус на график; уход фокуса возвращает заголовок в покой (`summary`, `highlight`).",
      },
      {
        keys: "Escape",
        en: "Hides the tooltip and returns the headline to rest.",
        ru: "Прячет подсказку и возвращает заголовок в покой.",
      },
    ],
    aria: [
      {
        en: 'The plot is `role="slider"` named by `label`; `aria-valuetext` speaks the point («8 окт: 312 400 ₽», `labels.point`); a point with no data speaks `labels.empty` («8 окт: Нет данных»). At rest with `sum` / `average` / `value` it speaks the period and the summary («9 сен – 8 окт: 8 914 000 ₽»). With `reference` the slider is described by `labels.reference` («Ориентир: 3%», `aria-describedby`). The headline follows the point under the pointer or the arrows, in text.',
        ru: 'График — `role="slider"` с именем из `label`; `aria-valuetext` озвучивает точку: «8 окт: 312 400 ₽»; точка без данных — `labels.empty` («8 окт: Нет данных»); `labels.point` задаёт формат точки. В покое с `sum` / `average` / `value` — период и итог: «9 сен – 8 окт: 8 914 000 ₽». С `reference` слайдер описан `labels.reference` («Ориентир: 3%», `aria-describedby`). Заголовок следует за точкой под указателем или стрелками, текстом.',
      },
      {
        en: "The headline with the value and change reads as plain text.",
        ru: "Заголовок с последним значением и изменением читается как обычный текст.",
      },
      {
        en: "The change carries a sign and an arrow, never color alone (a zero change is a neutral badge with no arrow); a negative bar goes down, not only red.",
        ru: "Изменение показано знаком и стрелкой, а не только цветом (нулевое изменение — нейтральный бейдж без стрелки); отрицательный столбик уходит вниз, а не только краснеет.",
      },
      {
        en: "While `loading` the root is `aria-busy` and the chart is not in the tab order yet.",
        ru: "Во время `loading` корень помечен `aria-busy`, графика в порядке фокуса ещё нет.",
      },
      {
        en: '`layout="compact"`: no visible title; `label` is only the slider\'s name, the point still goes to `aria-valuetext`.',
        ru: '`layout="compact"`: видимого заголовка нет, `label` — только имя слайдера, значение точки — в `aria-valuetext`.',
      },
      {
        en: "The tooltip is `aria-hidden`: it repeats `aria-valuetext` for sighted users. The plot carries `data-row-click-ignore` (and is a slider), so its pointer and keys never open a DataTable row.",
        ru: "Подсказка — `aria-hidden`: она повторяет `aria-valuetext` для зрячих. График несёт `data-row-click-ignore` (и он слайдер), поэтому указатель и клавиши на нём не открывают строку DataTable.",
      },
    ],
  },
};
