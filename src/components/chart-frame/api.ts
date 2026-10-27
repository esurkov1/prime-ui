import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { CHART_FRAME_LABELS } from "./ChartFrame";

export const api: ComponentApi = {
  parts: [
    {
      name: "ChartFrame.Root",
      en: "`ref` → `HTMLElement` (`<figure>`). The panel: a surface of the depth ladder, a figure named by `ChartFrame.Title` and described by `ChartFrame.Description`, `aria-busy` while loading. Owns the state, the series, the hidden ones and the data (`rows`); every part reads them.",
      ru: "Панель: поверхность лестницы глубины, фигура с именем из `ChartFrame.Title` и описанием из `ChartFrame.Description`, `aria-busy` во время загрузки. Хранит состояние, ряды, скрытые из них и данные (`rows`); все части читают их отсюда.",
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
          en: "The series in drawing order, `{ id, label, color?, value?, formatValue? }`: legend entries, tooltip rows, table columns. `color` is a palette hue, `value` the legend summary, `formatValue` its own value display.",
          ru: "Ряды в порядке отрисовки, `{ id, label, color?, value?, formatValue? }`: записи легенды, строки подсказки, столбцы таблицы. `color` — оттенок палитры, `value` — итог в легенде, `formatValue` — свой вид значений.",
        },
        {
          name: "rows",
          type: "ChartFrameRow[]",
          required: true,
          en: "The chart's data, `{ label, values }` per point (`values` by series id, a missing one reads as «—»): a visually hidden table for screen readers in the `ready` state.",
          ru: "Данные графика, `{ label, values }` на точку (`values` по id ряда, отсутствующее — «—»): визуально скрытая таблица для скринридеров в состоянии `ready`.",
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
          defaultNote: { en: "Russian digit groups", ru: "русские группы разрядов" },
          en: "Display of a value in the legend, the tooltip and the table («8,4 млн ₽») for every series without its own `formatValue`.",
          ru: "Вид значения в легенде, подсказке и таблице («8,4 млн ₽») для каждого ряда без своего `formatValue`.",
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
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`className` and the other figure attributes.",
          ru: "`className` и остальные атрибуты figure.",
        },
      ],
    },
    {
      name: "ChartFrame.Header",
      en: "`ref` → `HTMLDivElement`. The top zone, the kit's header row: the title with the description under it, `ChartFrame.Actions` at the end, whatever order they are written in. One line each, nothing wraps; without a description the actions share the title's line.",
      ru: "Верхняя зона — строка заголовка кита: название, под ним описание, `ChartFrame.Actions` в конце, в каком бы порядке они ни были записаны. Каждая строка одна, ничто не переносится; без описания действия стоят на строке названия.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className` and the other div attributes.",
          ru: "`className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "ChartFrame.Title",
      en: "`ref` → `HTMLHeadingElement`. The name of the chart on one line cut with an ellipsis, set in the title role of the panel's frame; names the figure and the data table.",
      ru: "Название графика в одну строку с многоточием, в роли заголовка рамки панели; даёт имя фигуре и таблице данных.",
      props: [
        {
          name: "as",
          type: '"h2" | "h3" | "h4"',
          default: '"h3"',
          en: "Heading level that fits the page outline; the look does not change.",
          ru: "Уровень заголовка по структуре страницы; вид не меняется.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLHeadingElement>",
          en: "`className` and the other heading attributes.",
          ru: "`className` и остальные атрибуты heading.",
        },
      ],
    },
    {
      name: "ChartFrame.Description",
      en: "`ref` → `HTMLParagraphElement`. What the chart measures and over which period, plain text on one line cut with an ellipsis; a `StatusDot` first is allowed. Describes the figure.",
      ru: "Что измеряет график и за какой период: простой текст в одну строку с многоточием; первым может стоять `StatusDot`. Описание фигуры.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLParagraphElement>",
          en: "`className` and the other p attributes.",
          ru: "`className` и остальные атрибуты p.",
        },
      ],
    },
    {
      name: "ChartFrame.Actions",
      en: "`ref` → `HTMLDivElement`. Controls of the chart at the end of the header: a period switch, an export button. They take the tier of the panel's frame (its own tier) and never wrap.",
      ru: "Управление графиком в конце заголовка: переключатель периода, кнопка выгрузки. Берут ярус рамки панели (её собственный) и не переносятся.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className` and the other div attributes.",
          ru: "`className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "ChartFrame.Value",
      en: "`ref` → `HTMLDivElement`. The headline number (heading-m, tabular) with an optional `ChartFrame.Delta` beside it; a Skeleton of its geometry while loading, a muted dash after a load error (the number is unknown).",
      ru: "Главное число (heading-m, моноширинные цифры) с `ChartFrame.Delta` рядом; во время загрузки — Skeleton своей геометрии, после ошибки загрузки — приглушённое тире (число неизвестно).",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className` and the other div attributes.",
          ru: "`className` и остальные атрибуты div.",
        },
      ],
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
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
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
          defaultNote: { en: "`240`, `160` under `30rem`", ru: "`240`, `160` уже `30rem`" },
          en: "Height of the plot area in px. `fill` takes the free height of a stretched panel (a `Page.Cell` with `rows`), the default height at least.",
          ru: "Высота области графика в px. `fill` занимает свободную высоту растянутой панели (`Page.Cell` с `rows`), но не меньше высоты по умолчанию.",
        },
        {
          name: "renderPlot",
          type: "(area: ChartFramePlotArea) => ReactNode",
          en: "Renders the chart at the measured `{ width, height }` with every series `{ id, label, color, hidden, formatValue }` (its axis ticks) — for libraries that need explicit sizes (Chart.js, visx).",
          ru: "Рисует график по измеренным `{ width, height }` со всеми рядами `{ id, label, color, hidden, formatValue }` (подписи его оси) — для библиотек с явными размерами (Chart.js, visx).",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "A chart that sizes itself to its container (an SVG with a `viewBox`, `ResponsiveContainer`); it fills the area.",
          ru: "График, который сам подстраивается под контейнер (SVG с `viewBox`, `ResponsiveContainer`); заполняет область.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className` and the other div attributes.",
          ru: "`className` и остальные атрибуты div.",
        },
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
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLUListElement>",
          en: "`className` and the other ul attributes.",
          ru: "`className` и остальные атрибуты ul.",
        },
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
          en: "`{ id, value }` per series at that point; name and color come from the root's series, rows of hidden series are left out, values go through the series' `formatValue`.",
          ru: "`{ id, value }` для каждого ряда в точке; название и цвет берутся из рядов корня, строки скрытых рядов пропускаются, значения проходят через `formatValue` ряда.",
        },
        {
          name: "point",
          type: "{ x: number; y: number } | null",
          en: "A point in `renderPlot` coordinates (the pointer, or the point the arrows reached): the tooltip floats right of it, left only without room; `null` hides it. Floating, it is `aria-hidden`.",
          ru: "Точка в координатах `renderPlot` (курсор или точка стрелок): подсказка справа от неё, слева — только без места; `null` скрывает. Парящая подсказка `aria-hidden`.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className` and the other div attributes.",
          ru: "`className` и остальные атрибуты div.",
        },
      ],
    },
  ],
  labels: labelRows(CHART_FRAME_LABELS, {
    empty: { en: "Title of the empty state.", ru: "Заголовок пустого состояния." },
    error: { en: "Title of the error state.", ru: "Заголовок состояния ошибки." },
    retry: {
      en: "Text of the retry button in the error state.",
      ru: "Текст кнопки повтора в состоянии ошибки.",
    },
    legend: { en: "Accessible name of the legend.", ru: "Доступное имя легенды." },
    category: {
      en: "Header of the first column of the data table (what a row is).",
      ru: "Заголовок первого столбца таблицы данных (что такое строка).",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "The header actions, then the legend as one stop (the entry focused last), then the chart's own focusable marks.",
        ru: "Действия заголовка, затем легенда одной остановкой (запись, на которой был фокус), затем элементы графика, если они фокусируемы.",
      },
      {
        keys: "← · → · ↑ · ↓",
        en: "Previous or next legend entry, wrapping.",
        ru: "Предыдущая или следующая запись легенды, по кругу.",
      },
      {
        keys: "Home · End",
        en: "First or last legend entry.",
        ru: "Первая или последняя запись легенды.",
      },
      {
        keys: "Enter · Space",
        en: "Shows or hides the entry's series.",
        ru: "Показать или скрыть ряд записи.",
      },
    ],
    aria: [
      {
        en: "The root is a `<figure>` named by `ChartFrame.Title` and described by `ChartFrame.Description`; `aria-busy` while loading.",
        ru: "Корень — `<figure>` с именем из `ChartFrame.Title` и описанием из `ChartFrame.Description`; во время загрузки `aria-busy`.",
      },
      {
        en: 'A legend entry is a `role="button"` with `aria-pressed` — pressed while its series is shown; `readOnly` takes the role away in place; the legend list is named by `labels.legend`. A hidden series differs by the swatch\'s shape (a ring) and a quiet name, never by color alone.',
        ru: 'Запись легенды — `role="button"` с `aria-pressed`: нажата, когда ряд показан; `readOnly` снимает роль на месте; список легенды назван `labels.legend`. Скрытый ряд отличается формой образца (кольцо) и приглушённым названием, а не только цветом.',
      },
      {
        en: "The root renders `rows` as a visually hidden table with the chart's data, named by the title: a row header per point, a column per shown series, values through each series' `formatValue`.",
        ru: "Корень выводит `rows` визуально скрытой таблицей с теми же данными, что и график, с именем из заголовка: строка на точку, столбец на показанный ряд, значения через `formatValue` своего ряда.",
      },
      {
        en: "A `ChartFrame.Tooltip` with `point` is `aria-hidden` and passive (no focus, no presses; `Escape` hides it until the point moves): it repeats what the plot speaks — give a focusable plot an `aria-valuetext`, like the slider in the tooltip example.",
        ru: "`ChartFrame.Tooltip` с `point` — `aria-hidden` и пассивен (без фокуса и нажатий; `Escape` прячет его до следующей точки): он повторяет то, что озвучивает сам график, — дайте фокусируемому графику `aria-valuetext`, как ползунку в примере с подсказкой.",
      },
      {
        en: 'The empty state is `role="status"`, the error `role="alert"` with the retry button.',
        ru: 'Пустое состояние — `role="status"`, ошибка — `role="alert"` с кнопкой «Повторить».',
      },
      {
        en: "The drawing is the library's: hide a decorative SVG (`aria-hidden`), the data table carries the data; marks you make focusable need their own `aria-label`.",
        ru: "Сам рисунок графика — забота библиотеки: скрывайте декоративный SVG (`aria-hidden`), данные несёт таблица данных; фокусируемым меткам нужен свой `aria-label`.",
      },
    ],
  },
};
