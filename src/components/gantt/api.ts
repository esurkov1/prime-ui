import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { GANTT_LABELS } from "./Gantt";
import { GANTT_CATEGORIES_MENU_LABELS } from "./GanttCategoriesMenu";

const ZOOM = '"day" | "week" | "month" | number';

export const api: ComponentApi = {
  parts: [
    {
      name: "Gantt",
      en: '`ref` → `HTMLDivElement` (the surface). A schedule: rows with bars on a time axis in a `role="grid"`, under one head row — the zoom selector, then the dates. A pinch, the wheel and `+` / `−` zoom; a swipe slides. `aria-label` names the grid; other attributes go to the surface.',
      ru: 'График: строки с полосами на шкале времени в `role="grid"` под одной строкой шапки — селектор масштаба и даты. Щипок, колесо и `+` / `−` меняют масштаб вокруг руки; жест вбок сдвигает шкалу. `aria-label` называет сетку; остальные атрибуты уходят на поверхность.',
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
          name: "categories",
          type: "readonly GanttCategory[]",
          en: "Kinds of bars (rentals, bookings, service), in legend order: a bar with a `category` takes its hue, and the toolbar shows the legend — a Badge with the dot of each shown category, after your `toolbar` content.",
          ru: "Виды полос (аренды, брони, сервис) в порядке легенды: полоса с `category` берёт их оттенок, а панель показывает легенду — Badge с точкой каждой показанной категории, после содержимого `toolbar`.",
        },
        {
          name: "hiddenCategories",
          type: "readonly string[]",
          en: "Ids of the hidden categories (`GanttCategoriesMenu` changes them): their bars are not drawn and their legend entries close up; the time axis keeps its span.",
          ru: "Id скрытых категорий (их меняет `GanttCategoriesMenu`): их полосы не рисуются, а пункты легенды схлопываются; шкала времени сохраняет свой охват.",
        },
        {
          name: "zoom",
          type: ZOOM,
          en: "Zoom, controlled: a preset of the selector (`day`, `week`, `month`), or the length of a day in px a gesture or a key left between them (the selector reads «Свой»), held between the whole axis in view and the top step.",
          ru: "Масштаб, управляемый: пресет селектора (`day`, `week`, `month`) или длина дня в px, оставленная жестом или клавишей между ними (селектор пишет «Свой»), — между всей шкалой в поле зрения и верхним шагом.",
        },
        {
          name: "defaultZoom",
          type: ZOOM,
          default: '"week"',
          en: "Initial zoom, uncontrolled.",
          ru: "Начальный масштаб, неуправляемый.",
        },
        {
          name: "onZoomChange",
          type: "(zoom: GanttZoom) => void",
          en: "The zoom changed: a preset from the selector (the day in the middle stays in the middle), or where a gesture or a key left it (the day under the hand stays under it) — a preset when it ended within 8% of one.",
          ru: "Масштаб изменился: пресет из селектора (день в середине остаётся в середине) или там, где его оставили жест или клавиша (день под рукой остаётся под ней), — пресет, если закончили в пределах 8% от него.",
        },
        {
          name: "range",
          type: "{ start: Date; end: Date }",
          en: "The time axis, in whole days. Default: every bar and today with a month of room on both sides, from the 1st of a month, at least 12 months — one axis for every zoom.",
          ru: "Шкала времени в целых днях. По умолчанию — все полосы и сегодня с месяцем запаса по краям, от 1-го числа, не меньше 12 месяцев — одна шкала для любого масштаба.",
        },
        {
          name: "today",
          type: "Date",
          defaultNote: { en: "today", ru: "сегодня" },
          en: "The day of the today line and of today's flag in the head; the chart opens with it a third into the view, and once the view slides away «Сегодня» at that edge of the head glides back to it.",
          ru: "День линии «сегодня» и её флажка с датой в шапке; график открывается с ним на трети ширины, а когда шкалу сдвинули, «Сегодня» у того края шапки плавно возвращает к нему.",
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
          en: "Tier of rows, bars and the head: one-lane rows 28 · 32 · 44 · 48 · 52 px, the zoom presets of the tier; bar text, the selector and «Сегодня» one tier down. Without it the host's tier, else `m`.",
          ru: "Ярус строк, полос и шапки: строка в одну дорожку 28 · 32 · 44 · 48 · 52 px, пресеты масштаба яруса; текст полос, селектор и «Сегодня» на ярус меньше. Без него — ярус контейнера, иначе `m`.",
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
          en: "Your tools (search, «Вид», a filter) on a row above the chart, before the legend of `categories`; the row is there only when it has something to show.",
          ru: "Ваши инструменты (поиск, «Вид», фильтр) в строке над графиком, перед легендой `categories`; строка есть, только когда ей есть что показать.",
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
    {
      name: "GanttCategoriesMenu",
      en: "`ref` → `HTMLButtonElement`. The view of a chart, for the page's tools: the kit's one view trigger (the columns icon, «Вид», the count of shown categories), a check item per category and «По умолчанию» once changed. The chart reads the same `hiddenCategories`.",
      ru: "Вид графика, для инструментов страницы: единая кнопка вида кита (иконка колонок, «Вид», число показанных категорий), пункт-флажок на каждую категорию и «По умолчанию» после изменения. График читает те же `hiddenCategories`.",
      props: [
        {
          name: "categories",
          type: "readonly GanttCategory[]",
          required: true,
          en: "The chart's `categories`, in menu order.",
          ru: "`categories` графика, в порядке меню.",
        },
        {
          name: "hiddenCategories",
          type: "readonly string[]",
          en: "Ids of the hidden categories (controlled).",
          ru: "Id скрытых категорий (управляемо).",
        },
        {
          name: "defaultHiddenCategories",
          type: "readonly string[]",
          default: "[]",
          en: "The default view: the initial hidden categories (uncontrolled) and what «По умолчанию» puts back.",
          ru: "Вид по умолчанию: скрытые категории в начале (неуправляемо) и то, что возвращает «По умолчанию».",
        },
        {
          name: "onHiddenCategoriesChange",
          type: "(hiddenCategories: readonly string[]) => void",
          en: "A category was shown or hidden, or the default view put back.",
          ru: "Категорию показали или скрыли, или вернули вид по умолчанию.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус хоста, иначе `"m"`' },
          en: "Tier of the trigger and the menu.",
          ru: "Ярус кнопки и меню.",
        },
        {
          name: "labels",
          type: "Partial<GanttCategoriesMenuLabels>",
          en: "The menu's strings: `view`, `categories`, `reset`.",
          ru: "Строки меню: `view`, `categories`, `reset`.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type">',
          en: "`className` and the other attributes of the trigger button.",
          ru: "`className` и остальные атрибуты кнопки.",
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
          defaultNote: {
            en: 'the hue of its `category`, else `"blue"`',
            ru: 'оттенок её `category`, иначе `"blue"`',
          },
          en: "Palette hue of the bar (a project, a team, a kind of absence).",
          ru: "Оттенок палитры полосы (проект, команда, вид отсутствия).",
        },
        {
          name: "category",
          type: "string",
          en: "Id of its `GanttCategory`: the bar takes its hue and leaves with it (`hiddenCategories`).",
          ru: "Id её `GanttCategory`: полоса берёт её оттенок и скрывается вместе с ней (`hiddenCategories`).",
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
          name: "edit",
          type: '"all" | "end" | "none"',
          default: '"all"',
          en: "Which dates a person may change: `all` — move and both edges; `end` — only the end (a rental already issued): no move, no start grip, only Ctrl + Shift + arrows, and a milestone stays put; `none` — nothing (a public holiday, a closed phase).",
          ru: "Какие даты можно менять: `all` — перенос и оба края; `end` — только окончание (уже выданная аренда): без переноса и ручки начала, только Ctrl + Shift + стрелки, а веха стоит на месте; `none` — ничего (праздник, закрытый этап).",
        },
      ],
    },
    {
      name: "GanttCategory",
      en: "One entry of `categories`: a kind of bar, a legend entry and an item of `GanttCategoriesMenu`.",
      ru: "Одна запись `categories`: вид полосы, пункт легенды и пункт `GanttCategoriesMenu`.",
      fields: [
        {
          name: "id",
          type: "string",
          required: true,
          en: "Stable id: `GanttBar.category` and `hiddenCategories` refer to it.",
          ru: "Стабильный id: на него ссылаются `GanttBar.category` и `hiddenCategories`.",
        },
        {
          name: "label",
          type: "string",
          required: true,
          en: "Text of its legend entry and of its menu item.",
          ru: "Текст пункта легенды и пункта меню.",
        },
        {
          name: "color",
          type: '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"',
          default: '"blue"',
          en: "Palette hue of its bars and its legend dot.",
          ru: "Оттенок палитры её полос и точки в легенде.",
        },
      ],
    },
  ],
  labels: [
    ...labelRows(GANTT_LABELS, {
      rowsHeader: {
        en: "Accessible name of the first column; its head holds the zoom selector.",
        ru: "Доступное имя первой колонки; в её шапке стоит селектор масштаба.",
      },
      timeline: {
        en: "Accessible name of the time axis column.",
        ru: "Доступное имя колонки шкалы.",
      },
      zoom: {
        en: "Accessible name of the zoom selector.",
        ru: "Доступное имя селектора масштаба.",
      },
      day: { en: "Zoom preset: a day a column.", ru: "Пресет масштаба: колонка на день." },
      week: { en: "Zoom preset: weeks.", ru: "Пресет масштаба: недели." },
      month: { en: "Zoom preset: months.", ru: "Пресет масштаба: месяцы." },
      customZoom: {
        en: "The selector's text for a zoom between the presets.",
        ru: "Текст селектора для масштаба между пресетами.",
      },
      zoomChanged: {
        en: "Announced when a gesture or a key changes the zoom; `{zoom}` is the selector's text.",
        ru: "Озвучивается, когда жест или клавиша меняют масштаб; `{zoom}` — текст селектора.",
      },
      today: {
        en: "Text of the button that brings today back into view.",
        ru: "Текст кнопки, которая возвращает к сегодняшнему дню.",
      },
      toToday: {
        en: "Accessible name of that button.",
        ru: "Доступное имя этой кнопки.",
      },
      todayIs: {
        en: "Description of the time axis: today's date, spoken in full (the flag on the today line is `aria-hidden`).",
        ru: "Описание шкалы времени: сегодняшняя дата полностью (флажок на линии «сегодня» скрыт, `aria-hidden`).",
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
      editEndHint: {
        en: "Description of a bar with `edit` `end`: the keys that change its end.",
        ru: "Описание полосы с `edit` `end`: клавиши, меняющие окончание.",
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
      legend: {
        en: "Accessible name of the legend of `categories`.",
        ru: "Доступное имя легенды `categories`.",
      },
    }),
    ...labelRows(GANTT_CATEGORIES_MENU_LABELS, {
      view: { en: "Text of the trigger.", ru: "Текст кнопки.", part: "GanttCategoriesMenu" },
      categories: {
        en: "Heading of the group of categories.",
        ru: "Заголовок группы категорий.",
        part: "GanttCategoriesMenu",
      },
      reset: {
        en: "The item that puts `defaultHiddenCategories` back.",
        ru: "Пункт, который возвращает `defaultHiddenCategories`.",
        part: "GanttCategoriesMenu",
      },
    }),
  ],
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "The chart is one tab stop: the last active cell (a bar or a row header).",
        ru: "Весь график — одна точка табуляции: последняя активная ячейка (полоса или заголовок строки).",
      },
      {
        keys: "← · →",
        en: "Along the row: its header, then its bars in time order. A row or a bar off screen is rendered and brought into view.",
        ru: "По строке: заголовок строки, затем полосы по времени. Строки и полосы вне экрана дорисовываются и попадают в поле зрения.",
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
        en: "Moves the bar by one day, at every zoom; a bar with `edit` `end` does not move.",
        ru: "Сдвигает полосу на один день при любом масштабе; полоса с `edit` `end` не сдвигается.",
      },
      {
        keys: "Shift + Alt + ← · Shift + Alt + →",
        en: "Moves the bar to the next / previous tick of the head's step (1, 8, 15… of a month; a month) — as a drag with Alt lands on it.",
        ru: "Сдвигает полосу к следующей / предыдущей отметке шага шапки (1, 8, 15… число месяца; месяц), как перетаскивание с Alt.",
      },
      {
        keys: "Ctrl + Shift + ← · Ctrl + Shift + →",
        en: "Shortens / lengthens the bar by one day (⌘ on macOS); it stops at one day.",
        ru: "Укорачивает / удлиняет полосу на день (⌘ на macOS); короче одного дня не становится.",
      },
      {
        keys: "Ctrl + Shift + Alt + ← · Ctrl + Shift + Alt + →",
        en: "Shortens / lengthens the bar to a tick of the head's step.",
        ru: "Укорачивает / удлиняет полосу до отметки шага шапки.",
      },
      {
        keys: "N",
        en: "Creates a bar of one cell of the phantom — a cell of the grid, a day whenever days are drawn (`onBarCreate`): at today on a row header — its phantom shows there while the header has focus — right after the bar on a bar.",
        ru: "Создаёт полосу в одну клетку фантома — клетку сетки, день, когда дни видны (`onBarCreate`): на заголовке строки — на сегодня, там же виден её фантом, пока заголовок в фокусе, — на полосе — сразу после неё.",
      },
      {
        keys: "+ · -",
        en: "Zooms in / out around the middle of the view, a step a press; the selector reads «Свой» between the presets.",
        ru: "Приближает / отдаляет вокруг середины видимой части, шаг за нажатие; между пресетами селектор пишет «Свой».",
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
        en: "A bar is a `<button>` named «Задача: 6 июля 2026 — 10 июля 2026» (with «выполнено 50%» when it has progress); a milestone «Релиз: 20 июля 2026». The Tooltip with the dates opens on hover and on focus and closes as soon as the chart moves (a slide, a zoom, the scrollbar, a touch); the next hover or focus opens it again. It points at the visible part of the bar and stays inside the timeline, never over the label column or the header; a bar with less than `--prime-space-6` in view shows none.",
        ru: "Полоса — `<button>` с именем «Задача: 6 июля 2026 — 10 июля 2026» (с «выполнено 50%», если есть прогресс); веха — «Релиз: 20 июля 2026». Подсказка с датами открывается при наведении и при фокусе и закрывается, как только график сдвигается (сдвиг, масштаб, полоса прокрутки, касание); следующее наведение или фокус открывают её снова. Она указывает на видимую часть полосы и остаётся внутри шкалы времени, не заходя на колонку подписей и шапку; полоса, видимая меньше чем на `--prime-space-6`, подсказки не показывает.",
      },
      {
        en: "An editable bar has `aria-keyshortcuts` and is described by `labels.editHint`; a bar with `edit` `end` lists only the end keys and is described by `labels.editEndHint`. The new dates after an editing key are announced in a polite status, a refused change with `labels.changeFailed`.",
        ru: "Редактируемая полоса описана `labels.editHint` и `aria-keyshortcuts`; полоса с `edit` `end` перечисляет только клавиши окончания и описана `labels.editEndHint`. Новые даты после клавиш объявляются вежливым статусом, отказ — `labels.changeFailed`.",
      },
      {
        en: "While `onBarChange` runs the bar and the grid are `aria-busy`. Loading without rows hides the skeletons and announces `labels.loading`.",
        ru: "Пока `onBarChange` выполняется, полоса и сетка `aria-busy`; при загрузке без строк скелетоны скрыты, а статус `labels.loading` объявляется.",
      },
      {
        en: "The dates of the head, weekends, the grid lines and the today line are `aria-hidden`: the dates live in the bar names.",
        ru: "Даты шапки, выходные, линии сетки и линия «сегодня» скрыты (`aria-hidden`): даты есть в именах полос.",
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
        en: "The legend of `categories` is a `group` named `labels.legend`; each entry says its category in words beside the dot. `GanttCategoriesMenu` is a menu button named by its text and count («Вид 4»); its items are a group named `labels.categories` of `menuitemcheckbox` with `aria-checked`.",
        ru: "Легенда `categories` — `group` с именем `labels.legend`; каждый пункт называет категорию словами рядом с точкой. `GanttCategoriesMenu` — кнопка меню с именем из текста и числа («Вид 4»); пункты — группа `labels.categories` из `menuitemcheckbox` с `aria-checked`.",
      },
      {
        en: "The zoom selector is a `Select` named `labels.zoom` in the head of the first column (a `columnheader` named `labels.rowsHeader`). A gesture or `+` / `−` that changes the zoom announces the selector's text with `labels.zoomChanged` in the polite status. Once today is slid out of view, a `Button` named `labels.toToday` («‹ Сегодня» / «Сегодня ›», pointing at it) at that edge of the head brings it back.",
        ru: "Селектор масштаба — `Select` с именем `labels.zoom` в шапке первой колонки (`columnheader` с именем `labels.rowsHeader`). Жест или `+` / `−`, изменившие масштаб, объявляют текст селектора вежливым статусом `labels.zoomChanged`. Когда сегодняшний день сдвинут из вида, `Button` с именем `labels.toToday` («‹ Сегодня» / «Сегодня ›», указывая на него) у того края шапки возвращает к нему.",
      },
      {
        en: "Rows are virtualized: only the rows in view are in the DOM, while `aria-rowcount` on the grid and `aria-rowindex` on each row keep the full count.",
        ru: "Строки виртуализированы: в DOM только видимые, но `aria-rowcount` на сетке и `aria-rowindex` на строках сохраняют полный счёт.",
      },
    ],
  },
};
