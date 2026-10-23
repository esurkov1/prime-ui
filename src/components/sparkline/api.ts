import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { SPARKLINE_LABELS } from "./Sparkline";

const GRAIN_TYPE = '"auto" | "day" | "week" | "month" | "quarter"';

export const api: ComponentApi = {
  parts: [
    {
      name: "Sparkline",
      en: '`ref` → `HTMLDivElement` (the root). A plot with no headline: an area, a line or bars and the lines of `series`; a `role="slider"` that picks a point. A headline beside it reads the point through `useSparkline`.',
      ru: 'График без заголовка: заливка, линия или столбики и линии `series`; `role="slider"`, выбирающий точку. Заголовок рядом читает точку через `useSparkline`.',
      props: [
        {
          name: "data",
          type: "SparklinePoint[]",
          required: true,
          en: "Points oldest first: `{ label, value }` as it is, or days `{ date, value }` folded by `grain`. `value: null` — no data: the line breaks, no bar. A new array cross-fades in.",
          ru: "Точки от старой к новой: `{ label, value }` как есть или дни `{ date, value }`, сложенные по `grain`. `value: null` — нет данных: линия прерывается, столбика нет. Новый массив проявляется.",
        },
        {
          name: "series",
          type: "SparklineSeries[]",
          en: "More lines on the same scale, `{ id, label, data, color?, variant? }`: last year, a plan. Each has a chart `color` and a line `variant`; a legend under the plot names them.",
          ru: "Ещё линии на той же шкале, `{ id, label, data, color?, variant? }`: прошлый год, план. У каждой свой `color` из палитры и `variant` линии; легенда под графиком их называет.",
        },
        {
          name: "label",
          type: "string",
          required: true,
          en: "The name of the main series: the slider's accessible name and its entry in the legend of `series`.",
          ru: "Имя основного ряда: доступное имя слайдера и его пункт в легенде `series`.",
        },
        {
          name: "variant",
          type: '"area" | "line" | "dashed" | "dotted" | "bars"',
          default: '"area"',
          en: "The main series: `area` — a line over a fading gradient; `line` — the line alone; `dashed`, `dotted` — a broken line; `bars` — a bar per point from zero, down (danger) when negative.",
          ru: "Основной ряд: `area` — линия над тающим градиентом; `line` — только линия; `dashed`, `dotted` — пунктир и точки; `bars` — столбик на точку от нуля, вниз (danger) при минусе.",
        },
        {
          name: "curve",
          type: '"smooth" | "linear" | "step"',
          default: '"smooth"',
          en: "Shape of the lines: `smooth` — a monotone cubic that never overshoots a peak or a trough; `linear` — straight segments; `step` — a level per point, changing halfway.",
          ru: "Форма линий: `smooth` — монотонная кривая, не выходящая за пики и впадины; `linear` — прямые отрезки; `step` — уровень на точку со сменой посередине.",
        },
        {
          name: "layout",
          type: '"default" | "compact"',
          default: '"default"',
          en: "`default` — the plot of its `size` with the legend of `series`; `compact` — an `xs` control height for a DataTable cell, the point in a tooltip.",
          ru: "`default` — график высоты `size` с легендой `series`; `compact` — высота контрола `xs` для ячейки DataTable, точка — в подсказке.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Plot height 40 · 48 · 80 · 96 · 128 px, the Skeleton the same. In `Kpi.Media` the card sets it (M `xs` · L `s` · XL `m`); `compact` keeps the `xs` height.",
          ru: "Высота графика 40 · 48 · 80 · 96 · 128 px, Skeleton той же высоты. В `Kpi.Media` её задаёт карточка (M `xs` · L `s` · XL `m`); `compact` держит высоту `xs`.",
        },
        {
          name: "point",
          type: "number | null",
          en: "Index of the scrubbed point, `null` at rest. One `point` on sparklines of one axis moves the cursor of all; `useSparkline` passes its own.",
          ru: "Индекс выбранной точки, `null` в покое. Один `point` на графики одной оси двигает курсор у всех; `useSparkline` передаёт свой.",
        },
        {
          name: "defaultPoint",
          type: "number | null",
          default: "null",
          en: "The scrubbed point at mount (uncontrolled).",
          ru: "Выбранная точка при монтировании (неуправляемое значение).",
        },
        {
          name: "onPointChange",
          type: "(point: number | null) => void",
          en: "Called with the point index while scrubbing (pointer, touch, arrow keys) and with `null` when the chart returns to rest.",
          ru: "Вызывается с индексом точки при ведении (указатель, касание, стрелки) и с `null`, когда график возвращается в покой.",
        },
        {
          name: "highlight",
          type: "number | null",
          defaultNote: { en: "the latest point with a value", ru: "последняя точка со значением" },
          en: "The point marked at rest (the current month; `bars` draw the others quieter); `null` — none, the reading rests on the whole period.",
          ru: "Точка, отмеченная в покое (текущий месяц; в `bars` остальные тише); `null` — никакой, показание стоит на всём периоде.",
        },
        {
          name: "grain",
          type: GRAIN_TYPE,
          en: "Step of a dated series: day, ISO week, month, quarter; `auto` — the finest with at most 31 points (16 in `compact`). A cut period is dashed.",
          ru: "Шаг ряда с датами: день, ISO-неделя, месяц, квартал; `auto` — самый мелкий, где точек не больше 31 (16 в `compact`). Неполный период пунктирный.",
        },
        {
          name: "defaultGrain",
          type: GRAIN_TYPE,
          default: '"auto"',
          en: "The step at mount (uncontrolled).",
          ru: "Шаг при монтировании (неуправляемое значение).",
        },
        {
          name: "onGrainChange",
          type: `(grain: ${GRAIN_TYPE}) => void`,
          en: "Called with a new step; a switcher of the card (`useSparkline` `setGrain`) or of the page sets it.",
          ru: "Вызывается с новым шагом; его задаёт переключатель карточки (`setGrain` из `useSparkline`) или страницы.",
        },
        {
          name: "aggregate",
          type: '"sum" | "average" | "latest"',
          default: '"latest"',
          en: "How the days of a dated point make its value: `sum` — a flow; `average` — their mean; `latest` — the last day, a level (MRR).",
          ru: "Как дни точки с датами дают её значение: `sum` — поток; `average` — их среднее; `latest` — последний день, уровень (MRR).",
        },
        {
          name: "locale",
          type: "Locale",
          defaultNote: { en: "`ru` from date-fns", ru: "`ru` из date-fns" },
          en: "date-fns locale of the month names in the point labels of a dated series.",
          ru: "Локаль date-fns для названий месяцев в подписях точек ряда с датами.",
        },
        {
          name: "min",
          type: "number",
          en: "The value axis reaches down to at least this value: a floor of zero, or one scale for several sparklines (a table column). Data below widens the scale.",
          ru: "Ось значений опускается как минимум до этого значения: пол от нуля или одна шкала для нескольких графиков (колонка таблицы). Данные ниже расширяют шкалу.",
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
          ru: "Пунктирная горизонтальная линия на этом значении — план, цель, среднее; шкала вмещает её, график описан через `labels.reference`.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "The series is on its way: a Skeleton of the plot that cross-fades into the data; the root is `aria-busy` and the chart is not focusable yet.",
          ru: "Ряд загружается: Skeleton графика, который плавно сменяется данными; корень `aria-busy`, график пока не в фокусе.",
        },
        {
          name: "formatValue",
          type: "(value: number) => string",
          defaultNote: { en: "Russian digit groups", ru: "русские группы разрядов" },
          en: "Display of a value in the legend, the compact tooltip, the reference description and the spoken point («312 400 ₽»).",
          ru: "Вид значения в легенде, подсказке компактного графика, описании ориентира и в озвучке точки («312 400 ₽»).",
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
  types: [
    {
      name: "SparklineReading",
      en: "What `useSparkline` returns: the reading of the headline and the props of its plot.",
      ru: "Что возвращает `useSparkline`: показание заголовка и пропсы его графика.",
      fields: [
        {
          name: "value · valueText",
          type: "number | null · string",
          en: "The headline value and its display (`formatValue`; `labels.empty` for no data).",
          ru: "Значение заголовка и его вид (`formatValue`; `labels.empty`, если данных нет).",
        },
        {
          name: "date",
          type: "string",
          en: "The shown point's label, or the period at rest with `sum` / `average` / `value` («1 сен – 22 окт»).",
          ru: "Подпись показанной точки или период в покое при `sum` / `average` / `value` («1 сен – 22 окт»).",
        },
        {
          name: "change · changeText · changeTone",
          type: 'number | null · string · "success" | "danger" | "neutral"',
          en: "The change rounded to one decimal (`null` — none to show), its text («+12%», «+0,5 п. п.») and its tone by `better`; a zero change is `neutral`.",
          ru: "Изменение с одним знаком (`null` — нечего показать), его текст («+12%», «+0,5 п. п.») и тон по `better`; нулевое — `neutral`.",
        },
        {
          name: "atRest",
          type: "boolean",
          en: "No point is scrubbed: the reading is the one at rest.",
          ru: "Точка не выбрана: показание — то, что в покое.",
        },
        {
          name: "grain · grains · setGrain",
          type: "Grain · Grain[] · (grain: SparklineGrain) => void",
          en: "The step shown, the steps that make two points or more (a switcher's items) and the setter.",
          ru: "Показанный шаг, шаги, дающие две точки и больше (пункты переключателя), и сеттер.",
        },
        {
          name: "plot",
          type: "SparklinePlotProps",
          en: "Spread onto `<Sparkline>`: the series, the step, the point and `highlight` of this reading.",
          ru: "Разворачивается в `<Sparkline>`: ряд, шаг, точка и `highlight` этого показания.",
        },
      ],
    },
  ],
  functions: [
    {
      name: "useSparkline(options)",
      type: "(options: UseSparklineOptions) => SparklineReading",
      en: "The reading for a headline you lay out (a KPI card): `data`, `series`, the `grain` and `point` triads, `aggregate`, `summary` (`latest` · `sum` · `average`), `highlight` or an own `value`, `compareTo`, `change` (`previous` · `first` · `none`), `changeUnit`, `better`, `formatValue`, `labels`.",
      ru: "Показание для заголовка, который вы раскладываете сами (KPI-карточка): `data`, `series`, триады `grain` и `point`, `aggregate`, `summary` (`latest` · `sum` · `average`), `highlight` или своё `value`, `compareTo`, `change` (`previous` · `first` · `none`), `changeUnit`, `better`, `formatValue`, `labels`.",
    },
  ],
  labels: labelRows(SPARKLINE_LABELS, {
    point: {
      en: "Spoken value of the chosen point (`aria-valuetext`); `{label}` and `{value}` are replaced.",
      ru: "Озвучка выбранной точки (`aria-valuetext`); `{label}` и `{value}` подставляются.",
    },
    period: {
      en: "The `date` of a `useSparkline` reading at rest with `sum` / `average` / `value`; `{first}` and `{last}` are the first and last day or point.",
      ru: "`date` показания `useSparkline` в покое при `sum` / `average` / `value`; `{first}` и `{last}` — первый и последний день или точка.",
    },
    empty: {
      en: "Shown and spoken in place of the value of a point with no data.",
      ru: "Показывается и озвучивается вместо значения точки без данных.",
    },
    reference: {
      en: "Description of the chart with a `reference` line (`aria-describedby`); `{value}` is replaced.",
      ru: "Описание графика с линией `reference` (`aria-describedby`); `{value}` подставляется.",
    },
    points: {
      en: 'The `changeText` of `useSparkline` with `changeUnit="points"`; `{value}` is the signed difference.',
      ru: '`changeText` из `useSparkline` при `changeUnit="points"`; `{value}` — разница со знаком.',
    },
    quarter: {
      en: "The name of a quarter point of a dated series; `{quarter}` is its Roman number («III кв.»).",
      ru: "Имя точки-квартала ряда с датами; `{quarter}` — римский номер («III кв.»).",
    },
    series: {
      en: "One line of `series` in the spoken point and its value; `{label}` and `{value}` are replaced.",
      ru: "Линия `series` в озвучке точки; `{label}` и `{value}` подставляются.",
    },
    legend: {
      en: "The accessible name of the legend of `series`.",
      ru: "Доступное имя легенды `series`.",
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
        en: "Focuses the chart; leaving focus returns it to the point at rest (`highlight`).",
        ru: "Фокус на график; уход фокуса возвращает его к точке покоя (`highlight`).",
      },
      {
        keys: "Escape",
        en: "Returns the chart to rest (and hides the compact tooltip).",
        ru: "Возвращает график в покой (и прячет подсказку компактного графика).",
      },
    ],
    aria: [
      {
        en: 'The plot is `role="slider"` named by `label`; `aria-valuetext` speaks the point («8 окт: 312 400 ₽», `labels.point`) and, with `series`, every line («; 2025: 280 000 ₽», `labels.series`); a point with no data speaks `labels.empty`. With `reference` the slider is described by `labels.reference` (`aria-describedby`).',
        ru: 'График — `role="slider"` с именем из `label`; `aria-valuetext` озвучивает точку («8 окт: 312 400 ₽», `labels.point`) и, с `series`, каждую линию («; 2025: 280 000 ₽», `labels.series`); точка без данных — `labels.empty`. С `reference` слайдер описан `labels.reference` (`aria-describedby`).',
      },
      {
        en: "A headline laid out from `useSparkline` is plain text beside the plot and follows the point; its change carries a sign (`changeText`), never color alone; a negative bar goes down, not only red.",
        ru: "Заголовок из `useSparkline` — обычный текст рядом с графиком, следует за точкой; изменение несёт знак (`changeText`), а не только цвет; отрицательный столбик уходит вниз, а не только краснеет.",
      },
      {
        en: 'The legend of `series` is a list named `labels.legend` (`role="list"`); each line has a swatch drawn like it and its name, so no line is told by color alone.',
        ru: 'Легенда `series` — список с именем `labels.legend` (`role="list"`); у каждой линии образец того же вида и имя, линии не различаются только цветом.',
      },
      {
        en: "While `loading` the root is `aria-busy` and the chart is not in the tab order yet.",
        ru: "Во время `loading` корень помечен `aria-busy`, графика в порядке фокуса ещё нет.",
      },
      {
        en: "The compact tooltip is `aria-hidden`: it repeats `aria-valuetext` for sighted users. The plot carries `data-row-click-ignore` (and is a slider), so its pointer and keys never open a DataTable row.",
        ru: "Подсказка компактного графика — `aria-hidden`: она повторяет `aria-valuetext` для зрячих. График несёт `data-row-click-ignore` (и он слайдер), поэтому указатель и клавиши на нём не открывают строку DataTable.",
      },
    ],
  },
};
