import type { ComponentApi } from "../../../scripts/docs/componentApi";

const rest = (element: string, tag: string) => ({
  name: "…rest",
  type: `HTMLAttributes<${element}>`,
  en: `\`className\` and the other ${tag} attributes.`,
  ru: `\`className\` и остальные атрибуты ${tag}.`,
});

export const api: ComponentApi = {
  parts: [
    {
      name: "ChartFrame.Root",
      en: "`ref` → `HTMLElement` (`<figure>`). The panel: a surface of the depth ladder, a figure named by `ChartFrame.Title` and described by `ChartFrame.Description`, `aria-busy` while loading. Owns the state, the series and which of them are hidden; every part reads them.",
      ru: "Панель: поверхность лестницы глубины, фигура с именем из `ChartFrame.Title` и описанием из `ChartFrame.Description`, `aria-busy` во время загрузки. Хранит состояние, ряды и какие из них скрыты; все части читают их отсюда.",
      props: [
        {
          name: "state",
          type: '"ready" | "loading" | "empty" | "error"',
          default: '"ready"',
          en: "What the chart region shows: the plot, Skeletons while `loading`, the empty state, or the load error with a retry (`onRetry`). Changes cross-fade at the same height.",
          ru: "Что показывает область графика: график, Skeleton при `loading`, пустое состояние или ошибку загрузки с повтором (`onRetry`). Смены плавно перетекают без изменения высоты.",
        },
        {
          name: "series",
          type: "ChartFrameSeries[]",
          default: "[]",
          en: "The series in drawing order, `{ id, label, color?, value? }`: legend entries, tooltip rows, table columns and `renderPlot` colors. `color` is a palette hue; `value` is the legend summary.",
          ru: "Ряды в порядке отрисовки, `{ id, label, color?, value? }`: записи легенды, строки подсказки, столбцы таблицы и цвета для `renderPlot`. `color` — оттенок палитры; `value` — итог в легенде.",
        },
        {
          name: "hiddenSeries",
          type: "string[]",
          en: "Ids of the series turned off in the legend (controlled).",
          ru: "Id рядов, выключенных в легенде (управляемое).",
        },
        {
          name: "defaultHiddenSeries",
          type: "string[]",
          default: "[]",
          en: "Initially hidden series (uncontrolled).",
          ru: "Ряды, скрытые изначально (неуправляемое).",
        },
        {
          name: "onHiddenSeriesChange",
          type: "(hiddenSeries: string[]) => void",
          en: "The legend turned a series on or off; gets the new list of hidden ids.",
          ru: "Легенда включила или выключила ряд; получает новый список скрытых id.",
        },
        {
          name: "formatValue",
          type: "(value: number) => string",
          default: "Russian digit groups",
          en: "Display of a value in the legend, the tooltip and the table («8,4 млн ₽»).",
          ru: "Вид значения в легенде, подсказке и таблице («8,4 млн ₽»).",
        },
        {
          name: "onRetry",
          type: "() => void | Promise<void>",
          en: "Loads the data again from the `error` state and shows the retry button; a returned Promise keeps the button loading until it settles.",
          ru: "Повторяет загрузку из состояния `error` и показывает кнопку повтора; пока возвращённый Promise не завершится, кнопка в загрузке.",
        },
        {
          name: "labels",
          type: "Partial<ChartFrameLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Встроенные строки, см. Labels.",
        },
        rest("HTMLElement", "figure"),
      ],
    },
    {
      name: "ChartFrame.Header",
      en: "`ref` → `HTMLDivElement`. The top zone: title and description in the first column, `ChartFrame.Actions` at the end, under them when the panel is narrower than 24rem.",
      ru: "Верхняя зона: название и описание в первой колонке, `ChartFrame.Actions` в конце, под ними, когда панель уже 24rem.",
      props: [rest("HTMLDivElement", "div")],
    },
    {
      name: "ChartFrame.Title",
      en: "`ref` → `HTMLHeadingElement`. The name of the chart; names the figure and the data table.",
      ru: "Название графика; даёт имя фигуре и таблице данных.",
      props: [
        {
          name: "as",
          type: '"h2" | "h3" | "h4"',
          default: '"h3"',
          en: "Heading level that fits the page outline; the look does not change.",
          ru: "Уровень заголовка по структуре страницы; вид не меняется.",
        },
        rest("HTMLHeadingElement", "heading"),
      ],
    },
    {
      name: "ChartFrame.Description",
      en: "`ref` → `HTMLParagraphElement`. What the chart measures and over which period; describes the figure.",
      ru: "Что измеряет график и за какой период; описание фигуры.",
      props: [rest("HTMLParagraphElement", "p")],
    },
    {
      name: "ChartFrame.Actions",
      en: "`ref` → `HTMLDivElement`. Controls of the chart in the header: a period switch, an export button.",
      ru: "Управление графиком в заголовке: переключатель периода, кнопка выгрузки.",
      props: [rest("HTMLDivElement", "div")],
    },
    {
      name: "ChartFrame.Value",
      en: "`ref` → `HTMLDivElement`. The headline number (heading-m, tabular) with an optional `ChartFrame.Delta` beside it; a Skeleton of its geometry while loading, a muted dash after a load error (the number is unknown).",
      ru: "Главное число (heading-m, моноширинные цифры) с `ChartFrame.Delta` рядом; во время загрузки — Skeleton своей геометрии, после ошибки загрузки — приглушённое тире (число неизвестно).",
      props: [rest("HTMLDivElement", "div")],
    },
    {
      name: "ChartFrame.Delta",
      en: "`ref` → `HTMLSpanElement`. The change of the headline value («+12% к сентябрю»); the sign is in the text.",
      ru: "Изменение главного значения («+12% к сентябрю»); знак — в тексте.",
      props: [
        {
          name: "tone",
          type: '"neutral" | "success" | "warning" | "danger"',
          default: '"neutral"',
          en: "Color of the change: `success` — good, `danger` — bad; independent of the sign.",
          ru: "Цвет изменения: `success` — хорошо, `danger` — плохо; не зависит от знака.",
        },
        rest("HTMLSpanElement", "span"),
      ],
    },
    {
      name: "ChartFrame.Plot",
      en: '`ref` → `HTMLDivElement`. The plot area of a fixed height that measures itself (ResizeObserver). Loading, empty and error cross-fade in its place. SVG text inside takes the caption type in the muted color; a mark with `data-hidden="true"` fades out.',
      ru: 'Область графика фиксированной высоты, которая измеряет себя (ResizeObserver). Загрузка, пустое состояние и ошибка плавно сменяют друг друга на её месте. Текст SVG внутри получает шрифт caption приглушённого цвета; элемент с `data-hidden="true"` растворяется.',
      props: [
        {
          name: "height",
          type: 'number | "fill"',
          default: "240, 160 under 30rem",
          en: "Height of the plot area in px. `fill` takes the free height of a stretched panel (a `PageContent.Cell` with `rows`), the default height at least.",
          ru: "Высота области графика в px. `fill` занимает свободную высоту растянутой панели (`PageContent.Cell` с `rows`), но не меньше высоты по умолчанию.",
        },
        {
          name: "renderPlot",
          type: "(area: ChartFramePlotArea) => ReactNode",
          en: "Renders the chart at the measured `{ width, height }` with every series `{ id, label, color, hidden }` — for libraries that need explicit sizes (Chart.js, visx).",
          ru: "Рисует график по измеренным `{ width, height }` со всеми рядами `{ id, label, color, hidden }` — для библиотек, которым нужны явные размеры (Chart.js, visx).",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "A chart that sizes itself to its container (an SVG with a `viewBox`, `ResponsiveContainer`); it fills the area.",
          ru: "График, который сам подстраивается под контейнер (SVG с `viewBox`, `ResponsiveContainer`); заполняет область.",
        },
        rest("HTMLDivElement", "div"),
      ],
    },
    {
      name: "ChartFrame.Legend",
      en: "`ref` → `HTMLUListElement`. The root's series as entries — swatch, name, summary value — each a toggle button that shows or hides its series. Renders nothing without series.",
      ru: "Ряды корня записями — образец цвета, название, итог; каждая — кнопка-переключатель, показывающая или скрывающая свой ряд. Без рядов ничего не рисует.",
      props: [
        {
          name: "readOnly",
          type: "boolean",
          default: "false",
          en: "Entries only name the series and do not toggle them.",
          ru: "Записи только называют ряды и не переключают их.",
        },
        rest("HTMLUListElement", "ul"),
      ],
    },
    {
      name: "ChartFrame.Tooltip",
      en: "`ref` → `HTMLDivElement`. The kit's chart tooltip: with `point` it floats beside that point of the plot; without it it is the body for a library's tooltip hook (Recharts `content`). Inside `ChartFrame.Root`.",
      ru: "Подсказка графика кита: с `point` парит рядом с этой точкой графика; без него — тело для подсказки библиотеки (Recharts `content`). Внутри `ChartFrame.Root`.",
      props: [
        {
          name: "label",
          type: "string",
          en: "The point the rows belong to («Неделя 41»).",
          ru: "Точка, к которой относятся строки («Неделя 41»).",
        },
        {
          name: "items",
          type: "ChartFrameTooltipItem[]",
          required: true,
          en: "`{ id, value }` per series at that point; name and color come from the root's series, rows of hidden series are left out, values go through `formatValue`.",
          ru: "`{ id, value }` для каждого ряда в точке; название и цвет берутся из рядов корня, строки скрытых рядов пропускаются, значения проходят через `formatValue`.",
        },
        {
          name: "point",
          type: "{ x: number; y: number } | null",
          en: "A point in `renderPlot` coordinates (the pointer, or the point the arrows reached): the tooltip floats right of it, left only without room; `null` hides it. Floating, it is `aria-hidden`.",
          ru: "Точка в координатах `renderPlot` (курсор или точка стрелок): подсказка справа от неё, слева — только без места; `null` скрывает. Парящая подсказка `aria-hidden`.",
        },
        rest("HTMLDivElement", "div"),
      ],
    },
    {
      name: "ChartFrame.Table",
      en: "`ref` → `HTMLTableElement`. The chart's data as a visually hidden table for screen readers, named by the title: a row per point, a column per shown series. Present only in the `ready` state. A visible table is a `DataTable`.",
      ru: "Данные графика визуально скрытой таблицей для скринридеров с именем из заголовка: строка на точку, столбец на показанный ряд. Есть только в состоянии `ready`. Видимая таблица — `DataTable`.",
      props: [
        {
          name: "rows",
          type: "ChartFrameTableRow[]",
          required: true,
          en: "`{ label, values }` per point; `values` by series id, a missing one reads as «—».",
          ru: "`{ label, values }` на точку; `values` по id ряда, отсутствующее читается как «—».",
        },
        rest("HTMLTableElement", "table"),
      ],
    },
  ],
  labels: [
    {
      key: "empty",
      default: "Нет данных за период",
      en: "Title of the empty state.",
      ru: "Заголовок пустого состояния.",
    },
    {
      key: "error",
      default: "Не удалось загрузить график",
      en: "Title of the error state.",
      ru: "Заголовок состояния ошибки.",
    },
    {
      key: "retry",
      default: "Повторить",
      en: "Text of the retry button in the error state.",
      ru: "Текст кнопки повтора в состоянии ошибки.",
    },
    {
      key: "legend",
      default: "Ряды графика",
      en: "Accessible name of the legend.",
      ru: "Доступное имя легенды.",
    },
    {
      key: "category",
      default: "Период",
      en: "Header of the first column of `ChartFrame.Table` (what a row is).",
      ru: "Заголовок первого столбца `ChartFrame.Table` (что такое строка).",
    },
  ],
};
