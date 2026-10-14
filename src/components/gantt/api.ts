import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { GANTT_LABELS } from "./Gantt";

const SCALE = '"day" | "week" | "month"';

export const api: ComponentApi = {
  parts: [
    {
      name: "Gantt",
      en: '`ref` → `HTMLDivElement` (the surface). A schedule: a toolbar with the zoom and «Сегодня», then a `role="grid"` of rows with bars on a time axis. `aria-label` / `aria-labelledby` name the grid; the other attributes go to the surface.',
      ru: 'График: панель с масштабом и «Сегодня», под ней `role="grid"` строк с полосами на шкале времени. `aria-label` / `aria-labelledby` называют сетку, остальные атрибуты уходят на поверхность.',
      props: [
        {
          name: "rows",
          type: "Row[]",
          required: true,
          en: "Rows: people, rooms, vehicles, tasks. Virtualized, so thousands of rows stay fast.",
          ru: "Строки: люди, переговорные, машины, задачи. Виртуализированы, поэтому тысячи строк работают быстро.",
        },
        {
          name: "getRowKey",
          type: "(row: Row) => Key",
          required: true,
          en: "Stable row id.",
          ru: "Стабильный id строки.",
        },
        {
          name: "getRowLabel",
          type: "(row: Row) => string",
          required: true,
          en: "Row name: the first column text by default and the row header for assistive tech.",
          ru: "Имя строки: текст первой колонки по умолчанию и заголовок строки для вспомогательных технологий.",
        },
        {
          name: "getRowBars",
          type: "(row: Row) => Bar[]",
          required: true,
          en: "Bars of a row (`GanttBar`); bars that overlap in time stack into lanes and grow the row.",
          ru: "Полосы строки (`GanttBar`); пересекающиеся по времени встают в дорожки и увеличивают строку.",
        },
        {
          name: "renderRow",
          type: "(row: Row) => ReactNode",
          en: "First-column content instead of the label (a name with a role or a code).",
          ru: "Содержимое первой колонки вместо имени (имя с ролью или кодом).",
        },
        {
          name: "renderRowAvatar",
          type: "(row: Row) => ReactNode",
          en: "A picture before the row content (an `Avatar`). Below 36rem of chart width the column keeps only it; the row header is then named by `getRowLabel` (`aria-label`).",
          ru: "Картинка перед содержимым строки (`Avatar`). Уже 36rem ширины графика колонка оставляет только её; заголовок строки тогда назван `getRowLabel` (`aria-label`).",
        },
        {
          name: "getRowHref",
          type: "(row: Row) => string",
          en: "The row header is a link: a real `<a>` fills the first column and is the row's stop in the grid, so a click, ⌘/Ctrl-click, a middle click and «open in new tab» work on it; Space follows it like Enter.",
          ru: "Заголовок строки — ссылка: настоящий `<a>` заполняет первую колонку и служит её остановкой в сетке; работают клик, ⌘/Ctrl-клик, средняя кнопка и новая вкладка, Space — как Enter.",
        },
        {
          name: "onRowClick",
          type: "(row: Row, event: GanttRowClickEvent) => void",
          en: "Opens a row in place (a profile in a Drawer): a click on its header, Enter or Space; never from a control inside it. With `getRowHref` it gets plain clicks: `event.preventDefault()` routes in the app.",
          ru: "Открывает строку на месте (профиль в Drawer): клик по заголовку, Enter или Space; не от контрола внутри. С `getRowHref` получает обычные клики: `event.preventDefault()` — переход роутером приложения.",
        },
        {
          name: "renderBarTooltip",
          type: "(bar: Bar, row: Row) => ReactNode",
          en: "Extra lines of a bar's tooltip (a client, hours, an owner), under its title and the dates line — those always stay, the dates and the duration are what the bar means on the axis.",
          ru: "Дополнительные строки подсказки полосы (клиент, часы, ответственный) — под её названием и строкой дат; они остаются всегда: даты и длительность — то, что полоса значит на шкале.",
        },
        {
          name: "scale",
          type: SCALE,
          en: "Zoom, controlled: a column per day (months over days), per week (months over weeks) or per month (years over months).",
          ru: "Масштаб, управляемый: колонка на день (месяцы над днями), на неделю (месяцы над неделями) или на месяц (годы над месяцами).",
        },
        {
          name: "defaultScale",
          type: SCALE,
          default: '"week"',
          en: "Initial zoom, uncontrolled.",
          ru: "Начальный масштаб, неуправляемый.",
        },
        {
          name: "onScaleChange",
          type: "(scale: GanttScale) => void",
          en: "The zoom switch changed. The day in the middle of the view stays in the middle.",
          ru: "Переключили масштаб. День в середине видимой части остаётся в середине.",
        },
        {
          name: "range",
          type: "{ start: Date; end: Date }",
          en: "The time axis, snapped to whole units. Default: every bar and today with room on both sides (a week of days, two weeks, a month), at least 35 days / 14 weeks / 12 months.",
          ru: "Шкала времени, выровненная по целым единицам. По умолчанию — все полосы и сегодня с запасом по краям (неделя дней, две недели, месяц), не меньше 35 дней / 14 недель / 12 месяцев.",
        },
        {
          name: "today",
          type: "Date",
          defaultNote: { en: "today", ru: "сегодня" },
          en: "The day of the today line; the chart opens with it a third into the view and «Сегодня» scrolls back to it.",
          ru: "День линии «сегодня»; график открывается с ним на трети ширины, а «Сегодня» прокручивает к нему.",
        },
        {
          name: "locale",
          type: "Locale",
          default: "ru",
          en: "date-fns locale of the header, tooltips and spoken dates.",
          ru: "Локаль date-fns для шапки, подсказок и озвучиваемых дат.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Tier of rows, bars, header and toolbar controls: one-lane rows 28 · 32 · 44 · 48 · 52 px; a day is 32 · 40 · 48 px wide at `day`; bar text one tier down. Without it the tier of its host, else `m`.",
          ru: "Ярус строк, полос, шапки и контролов панели: строка в одну дорожку 28 · 32 · 44 · 48 · 52 px; день шириной 32 · 40 · 48 px при `day`; текст полос на ярус меньше. Без него — ярус контейнера, иначе `m`.",
        },
        {
          name: "readOnly",
          type: "boolean",
          default: "false",
          en: "No moving, resizing or creating; bars still select and show their dates.",
          ru: "Без переноса, растягивания и создания; полосы по-прежнему выбираются и показывают даты.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "Without rows — skeleton rows in the chart's geometry and a status for screen readers; with rows they stay and the grid is `aria-busy`.",
          ru: "Без строк — скелетоны в геометрии графика и статус для скринридера; со строками они остаются, а сетка `aria-busy`.",
        },
        {
          name: "empty",
          type: "ReactNode",
          en: "Empty-state content when `rows` is empty; a string goes into a compact `EmptyPage`. Defaults to `labels.empty`.",
          ru: "Пустое состояние при пустом `rows`; строка встаёт в компактный `EmptyPage`. По умолчанию `labels.empty`.",
        },
        {
          name: "toolbar",
          type: "ReactNode",
          en: "Content at the start of the toolbar (title, filters, a primary action); the zoom and «Сегодня» sit at its end.",
          ru: "Содержимое в начале панели (заголовок, фильтры, главное действие); масштаб и «Сегодня» стоят в её конце.",
        },
        {
          name: "scrollHeight",
          type: 'number | "fill"',
          en: 'Max height of the viewport in px, so the header sticks while rows scroll; `"fill"` — the chart takes its flex / grid parent\'s height.',
          ru: 'Максимальная высота области прокрутки в px, чтобы шапка держалась при прокрутке строк; `"fill"` — график берёт высоту flex / grid-родителя.',
        },
        {
          name: "onItemOpen",
          type: "(bar: Bar, row: Row) => void",
          en: "A bar was activated (click, Enter, Space): open its record. A drag never opens it.",
          ru: "Полосу активировали (клик, Enter, Space): откройте её запись. Перетаскивание её не открывает.",
        },
        {
          name: "onBarChange",
          type: "(dates: GanttDates, bar: Bar, row: Row) => void | Promise<void>",
          en: "New dates of a bar after a drag or an editing key — update your data. A returned Promise keeps the bar busy at the new dates; a rejection glides it back. Without it bars cannot be edited.",
          ru: "Новые даты полосы после перетаскивания или клавиш правки — обновите данные. Возвращённый Promise держит полосу занятой на новых датах; reject плавно возвращает её. Без него полосы не редактируются.",
        },
        {
          name: "onBarCreate",
          type: "(dates: GanttDates, row: Row) => void | Promise<void>",
          en: "A new bar in a row: drawn across empty space, a double-click, a touch long-press or `N`. Add it to your data; a returned Promise keeps a busy ghost in place. Without it nothing can be created.",
          ru: "Новая полоса в строке: протяжкой по пустому месту, двойным кликом, долгим нажатием или `N`. Добавьте её в данные; возвращённый Promise держит занятый призрак на месте. Без него создать ничего нельзя.",
        },
        {
          name: "labels",
          type: "Partial<GanttLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`aria-label` (the grid's name), `className` and the other div attributes.",
          ru: "`aria-label` (имя сетки), `className` и остальные атрибуты div.",
        },
      ],
    },
  ],
  types: [
    {
      name: "GanttBar",
      en: "One bar of `getRowBars`: data, not a part. Dates are calendar days with an exclusive `end`; `start` equal to `end` is a milestone. Extend the type with your own fields: callbacks get your object back.",
      ru: "Одна полоса из `getRowBars`: данные, а не часть разметки. Даты — календарные дни, `end` не включается; `start`, равный `end`, — веха. Расширяйте тип своими полями: колбэки получают ваш объект.",
      fields: [
        {
          name: "id",
          type: "string",
          required: true,
          en: "Unique across the chart.",
          ru: "Уникален во всём графике.",
        },
        {
          name: "start",
          type: "Date",
          required: true,
          en: "First day.",
          ru: "Первый день.",
        },
        {
          name: "end",
          type: "Date",
          required: true,
          en: "The day after the last one.",
          ru: "День после последнего.",
        },
        {
          name: "label",
          type: "string",
          required: true,
          en: "Text inside the bar — beside it when the bar is too short (measured) — in the tooltip and in the accessible name.",
          ru: "Текст в полосе — рядом с ней, если полоса коротка (по замеру), — в подсказке и в доступном имени.",
        },
        {
          name: "color",
          type: '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"',
          default: '"blue"',
          en: "Palette hue of a category (project, team, kind of absence).",
          ru: "Оттенок палитры для категории (проект, команда, вид отсутствия).",
        },
        {
          name: "tone",
          type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"',
          en: "Status color (done, at risk, overdue); wins over `color`.",
          ru: "Цвет статуса (готово, под угрозой, просрочено); важнее `color`.",
        },
        {
          name: "progress",
          type: "number",
          en: "Share done, `0…1`: a stronger fill from the start of the bar; the percentage joins the tooltip and the name.",
          ru: "Доля выполнения, `0…1`: более плотная заливка от начала полосы; процент попадает в подсказку и имя.",
        },
        {
          name: "readOnly",
          type: "boolean",
          default: "false",
          en: "This bar cannot be moved or resized (a public holiday, a closed phase).",
          ru: "Эту полосу нельзя сдвинуть или растянуть (праздник, закрытый этап).",
        },
      ],
    },
  ],
  labels: labelRows(GANTT_LABELS, {
    rowsHeader: { en: "Heading of the first column.", ru: "Заголовок первой колонки." },
    timeline: {
      en: "Accessible name of the time axis column.",
      ru: "Доступное имя колонки шкалы.",
    },
    scale: {
      en: "Accessible name of the zoom switch.",
      ru: "Доступное имя переключателя масштаба.",
    },
    day: { en: "Zoom segment: days.", ru: "Сегмент масштаба: дни." },
    week: { en: "Zoom segment: weeks.", ru: "Сегмент масштаба: недели." },
    month: { en: "Zoom segment: months.", ru: "Сегмент масштаба: месяцы." },
    today: {
      en: "The button that scrolls to today and the chip on the today line.",
      ru: "Кнопка прокрутки к сегодняшнему дню и метка на его линии.",
    },
    bar: {
      en: "Accessible name of a bar; `{start}` and `{end}` are its first and last day, spoken in full.",
      ru: "Доступное имя полосы; `{start}` и `{end}` — первый и последний день полностью.",
    },
    milestone: { en: "Accessible name of a milestone.", ru: "Доступное имя вехи." },
    progress: {
      en: "Added to a bar's name when it has `progress`.",
      ru: "Добавляется к имени полосы с `progress`.",
    },
    editHint: {
      en: "Description of an editable bar: the editing keys.",
      ru: "Описание редактируемой полосы: клавиши правки.",
    },
    duration: {
      en: "Duration of a bar in its tooltip («5 – 18 октября · 14 дн.»).",
      ru: "Длительность полосы в подсказке («5 – 18 октября · 14 дн.»).",
    },
    changeFailed: {
      en: "Announced when `onBarChange` rejects and the bar returns to its dates.",
      ru: "Озвучивается, когда `onBarChange` отклонён и полоса вернулась к своим датам.",
    },
    newBar: {
      en: "Label of the ghost of a bar being created and of its announcement.",
      ru: "Подпись призрака создаваемой полосы и её объявления.",
    },
    createHint: {
      en: "Description of a row header when bars can be created.",
      ru: "Описание заголовка строки, когда полосы можно создавать.",
    },
    createFailed: {
      en: "Announced when `onBarCreate` rejects and the ghost fades out.",
      ru: "Озвучивается, когда `onBarCreate` отклонён и призрак тает.",
    },
    loading: {
      en: "Screen-reader status while skeleton rows are shown.",
      ru: "Статус для скринридера, пока видны скелетоны.",
    },
    empty: { en: "Default empty-state text.", ru: "Текст пустого состояния по умолчанию." },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "The chart is one tab stop: the last active cell (a bar or a row header).",
        ru: "Весь график — одна точка табуляции: последняя активная ячейка (полоса или заголовок строки).",
      },
      {
        keys: "← · →",
        en: "Along the row: its header, then its bars in time order. A row off screen is rendered and scrolled into view.",
        ru: "По строке: заголовок строки, затем полосы по времени. Строки вне экрана дорисовываются и прокручиваются в поле зрения.",
      },
      {
        keys: "↑ · ↓",
        en: "From a bar, the bar nearest in time in the row above / below (rows without bars are skipped); from a row header, the next row's header, empty rows too.",
        ru: "С полосы — ближайшая по времени полоса в строке выше / ниже (строки без полос пропускаются); с заголовка — заголовок соседней строки, в том числе пустой.",
      },
      {
        keys: "Home · End",
        en: "First / last bar of the row; with Ctrl, of the chart.",
        ru: "Первая / последняя полоса строки; с Ctrl — всего графика.",
      },
      {
        keys: "Enter · Space",
        en: "On a bar: opens its record (`onItemOpen`). On a row header: opens the row (`onRowClick`) or follows its link (`getRowHref`).",
        ru: "На полосе — открывает её запись (`onItemOpen`); на заголовке строки — открывает строку (`onRowClick`) или переходит по её ссылке (`getRowHref`).",
      },
      {
        keys: "Shift + ← · Shift + →",
        en: "Moves the bar by one day, at every zoom.",
        ru: "Сдвигает полосу на один день при любом масштабе.",
      },
      {
        keys: "Shift + Alt + ← · Shift + Alt + →",
        en: "Moves the bar by the zoom's unit (a week, a month).",
        ru: "Сдвигает полосу на единицу масштаба (неделю, месяц).",
      },
      {
        keys: "Ctrl + Shift + ← · Ctrl + Shift + →",
        en: "Shortens / lengthens the bar by one day (⌘ on macOS); it stops at one day.",
        ru: "Укорачивает / удлиняет полосу на день (⌘ на macOS); короче одного дня не становится.",
      },
      {
        keys: "Ctrl + Shift + Alt + ← · Ctrl + Shift + Alt + →",
        en: "Shortens / lengthens the bar by the zoom's unit.",
        ru: "Укорачивает / удлиняет полосу на единицу масштаба.",
      },
      {
        keys: "N",
        en: "Creates a one-unit bar (`onBarCreate`): at today on a row header, right after the bar on a bar.",
        ru: "Создаёт полосу в одну единицу масштаба (`onBarCreate`): на заголовке строки — на сегодня, на полосе — сразу после неё.",
      },
      {
        keys: "Escape",
        en: "Cancels a drag or the drawing of a new bar; closes the tooltip.",
        ru: "Отменяет перетаскивание или рисование новой полосы; закрывает подсказку.",
      },
    ],
    aria: [
      {
        en: 'A `role="grid"` named by `aria-label`: a header row of `columnheader`s (the first column and the time axis named `labels.timeline`), then a row per record with a `rowheader` (the row name) and a `gridcell` holding its bars. A grid because the bars are navigated in two dimensions: moving between rows, a screen reader announces the row.',
        ru: '`role="grid"` с именем из `aria-label`: строка шапки с `columnheader` («Название» и шкала с именем `labels.timeline`), в каждой строке `rowheader` с именем строки и `gridcell` с полосами. Сетка выбрана ради двумерной навигации: при переходе между строками скринридер называет строку.',
      },
      {
        en: "A bar is a `<button>` named «Задача: 6 июля 2026 — 10 июля 2026» (with «выполнено 50%» when it has progress); a milestone «Релиз: 20 июля 2026». The Tooltip with the dates opens on hover and on focus and closes as soon as the chart scrolls (scrollbar, wheel, touch); the next hover or focus opens it again. It points at the visible part of the bar and stays inside the timeline, never over the label column or the header; a bar with less than `--prime-space-6` in view shows none.",
        ru: "Полоса — `<button>` с именем «Задача: 6 июля 2026 — 10 июля 2026» (с «выполнено 50%», если есть прогресс); веха — «Релиз: 20 июля 2026». Подсказка с датами открывается при наведении и при фокусе и закрывается, как только график прокручивается (полоса прокрутки, колесо, касание); следующее наведение или фокус открывают её снова. Она указывает на видимую часть полосы и остаётся внутри шкалы времени, не заходя на колонку подписей и шапку; полоса, видимая меньше чем на `--prime-space-6`, подсказки не показывает.",
      },
      {
        en: "An editable bar has `aria-keyshortcuts` and is described by `labels.editHint`; the new dates after an editing key are announced in a polite status, a refused change with `labels.changeFailed`.",
        ru: "Редактируемая полоса описана `labels.editHint` и `aria-keyshortcuts`; новые даты после клавиш объявляются вежливым статусом, отказ — `labels.changeFailed`.",
      },
      {
        en: "While `onBarChange` runs the bar and the grid are `aria-busy`. Loading without rows hides the skeletons and announces `labels.loading`.",
        ru: "Пока `onBarChange` выполняется, полоса и сетка `aria-busy`; при загрузке без строк скелетоны скрыты, а статус `labels.loading` объявляется.",
      },
      {
        en: "The axis tiers, weekends and the today line are `aria-hidden`: the dates live in the bar names.",
        ru: "Шапка шкалы, выходные и линия «сегодня» скрыты (`aria-hidden`): даты есть в именах полос.",
      },
      {
        en: 'A row header is a focusable cell; with `onBarCreate` it is described by `labels.createHint` and has `aria-keyshortcuts="N"`. A new bar is announced, a refused one with `labels.createFailed`; the ghost is `aria-hidden`.',
        ru: 'Заголовок строки — фокусируемая ячейка; при `onBarCreate` описан `labels.createHint` и `aria-keyshortcuts="N"`. Новая полоса объявляется, отказ — `labels.createFailed`; призрак новой полосы — `aria-hidden`.',
      },
      {
        en: "With `getRowHref` the header's stop in the grid is a real `<a>` named by the row's content inside the `rowheader`: a click, ⌘/Ctrl-click, a middle click and «open in new tab» work, Space follows it like Enter, and the arrows rove from it as from any cell. With `onRowClick` alone the header itself opens the row by a click, Enter or Space; a click on a control inside it never does.",
        ru: "С `getRowHref` остановка заголовка в сетке — настоящая ссылка `<a>` с именем строки внутри `rowheader`; с `onRowClick` сам заголовок открывает строку кликом, Enter и Space.",
      },
      {
        en: "Rows are virtualized: only the rows in view are in the DOM, while `aria-rowcount` on the grid and `aria-rowindex` on each row keep the full count.",
        ru: "Строки виртуализированы: в DOM только видимые, но `aria-rowcount` на сетке и `aria-rowindex` на строках сохраняют полный счёт.",
      },
    ],
  },
};
