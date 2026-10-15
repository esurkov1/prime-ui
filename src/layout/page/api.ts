import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { PAGE_LABELS } from "./Page";

const divRest = (children: { en: string; ru: string }) => ({
  name: "…rest",
  type: "HTMLAttributes<HTMLDivElement>",
  en: `${children.en}, \`className\` and the other div attributes.`,
  ru: `${children.ru}, \`className\` и остальные атрибуты div.`,
});

const CHILDREN = { en: "`children`", ru: "`children`" };

export const api: ComponentApi = {
  parts: [
    {
      name: "Page.Root",
      en: "`ref` → `HTMLDivElement`. The page column inside `AppShell.Main`: top bar, header and body 24 apart; takes the shell's gutters and top air (`--page-gutter`, `--page-top`). Named, it is a `region`.",
      ru: "Колонка страницы внутри `AppShell.Main`: полоса, заголовок и тело через 24; берёт поля и верхний воздух каркаса (`--page-gutter`, `--page-top`). С именем — `region`.",
      props: [
        {
          name: "maxWidth",
          type: '"full" | "readable" | "wide"',
          default: '"full"',
          en: "Cap of everything but the top bar, centred: `full` — the whole main; `readable` — 42rem (`--prime-layout-reading-max-width`); `wide` — 75rem (`--prime-layout-content-max-width`).",
          ru: "Ограничение всего, кроме верхней полосы, по центру: `full` — весь main; `readable` — 42rem (`--prime-layout-reading-max-width`); `wide` — 75rem (`--prime-layout-content-max-width`).",
        },
        {
          name: "fill",
          type: "boolean",
          default: "false",
          en: "The page takes the height of main (`AppShell.Root fillViewport`) and the body takes what the bar and the header leave: for a full-height table, board, chat or `Page.Split`.",
          ru: "Страница занимает высоту main (`AppShell.Root fillViewport`), тело — всё, что оставили полоса и заголовок: для таблицы, доски или чата на всю высоту и `Page.Split`.",
        },
        {
          name: "labels",
          type: "Partial<PageLabels>",
          en: "Built-in strings of every part, see Labels.",
          ru: "Системные строки всех частей, см. «Доступность».",
        },
        divRest({
          en: "`children` (TopBar, Header, Body)",
          ru: "`children` (TopBar, Header, Body)",
        }),
      ],
    },
    {
      name: "Page.TopBar",
      en: "`ref` → `HTMLElement` (`<header>`). The strip at the page's top edge across the panel: `Page.Header` and / or `Page.Toolbar` 12 under it. Starts with the menu button while the shell's Sidebar is off-canvas.",
      ru: "Полоса у верхнего края страницы во всю ширину панели: `Page.Header` и / или `Page.Toolbar` через 12 под ним. Начинается с кнопки меню, пока Sidebar каркаса выезжающий.",
      props: [
        {
          name: "sticky",
          type: "boolean",
          default: "true",
          en: "Sticks to the top of the page's scroller (`AppShell.Main`); `false` — scrolls away with the page. On a screen lower than 480px it scrolls anyway.",
          ru: "Прилипает к верху прокрутки страницы (`AppShell.Main`); `false` — уезжает вместе со страницей. На экране ниже 480px уезжает всегда.",
        },
        {
          name: "collapse",
          type: "boolean",
          default: "false",
          en: "Once the flow `Page.Title` scrolls out under the bar, the bar repeats it (with its description) in its title row; it leaves when the title returns.",
          ru: "Когда `Page.Title` в потоке уходит под полосу, полоса повторяет его (с описанием) в своей строке заголовка; уходит, когда заголовок возвращается.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children` (Header, Toolbar — direct children), `className` and the other attributes.",
          ru: "`children` (Header, Toolbar — прямые дети), `className` и остальные атрибуты.",
        },
      ],
    },
    {
      name: "Page.Header",
      en: "`ref` → `HTMLDivElement`. An optional `Breadcrumb.Root` path, `Page.Title`, `Page.Description` and `Page.Actions` in one row (direct children). Compact in `Page.TopBar`, the large document header in the flow.",
      ru: "Необязательный путь `Breadcrumb.Root`, `Page.Title`, `Page.Description` и `Page.Actions` в одном ряду (прямые дети). Компактный в `Page.TopBar`, большой заголовок документа в потоке.",
      props: [divRest({ en: "`children`", ru: "`children`" })],
    },
    {
      name: "Page.Title",
      en: "`ref` → `HTMLHeadingElement`. The page's `<h1>`, one per page: title-m in the top bar (truncates), heading-m in the flow (wraps). A flow title is what a `collapse` top bar repeats.",
      ru: "`<h1>` страницы, один на страницу: title-m в верхней полосе (обрезается), heading-m в потоке (переносится). Заголовок в потоке повторяет полоса с `collapse`.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLHeadingElement>",
          en: "`children`, `id`, `className` and the other heading attributes.",
          ru: "`children`, `id`, `className` и остальные атрибуты заголовка.",
        },
      ],
    },
    {
      name: "Page.Description",
      en: "`ref` → `HTMLParagraphElement`. One line of context that carries data (a period, a count): muted caption that truncates in the top bar, secondary body-m that wraps (up to the reading measure) in the flow.",
      ru: "Строка контекста с данными (период, количество): приглушённый caption с обрезкой в верхней полосе, вторичный body-m с переносом (не шире колонки для чтения) в потоке.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLParagraphElement>",
          en: "`children`, `className` and the other paragraph attributes.",
          ru: "`children`, `className` и остальные атрибуты абзаца.",
        },
      ],
    },
    {
      name: "Page.Actions",
      en: "`ref` → `HTMLDivElement`. The page's buttons at the end of a header or a section heading. In the flow they wrap; in the top bar trailing secondary `Button.Root`s fold into «⋯» by measured width, the primary stays.",
      ru: "Кнопки страницы в конце заголовка или заголовка раздела. В потоке переносятся; в верхней полосе последние второстепенные `Button.Root` по измеренной ширине уходят в «⋯», главная остаётся.",
      props: [divRest({ en: "`children` (Buttons)", ru: "`children` (кнопки)" })],
    },
    {
      name: "Page.Toolbar",
      en: "`ref` → `HTMLDivElement`. The page's tools: one row from 56rem of its own width, stacked rows below. DOM and Tab order: Tools, Sections, View, Actions, Chips. Named, a `group`.",
      ru: "Инструменты страницы: одна строка от 56rem своей ширины, уже — строки друг под другом. Порядок в DOM и Tab: Tools, Sections, View, Actions, Chips. С именем — `group`.",
      props: [divRest(CHILDREN)],
    },
    {
      name: "Page.ToolbarTools",
      en: "`ref` → `HTMLDivElement`. Search and filter button (`SmartFilter.Toolbar`): always the first slot and the stretchy one; it gives way first when the row runs short.",
      ru: "Поиск и кнопка фильтра (`SmartFilter.Toolbar`): всегда первый слот и резиновый; уступает место первым, когда строке тесно.",
      props: [divRest(CHILDREN)],
    },
    {
      name: "Page.ToolbarSections",
      en: "`ref` → `HTMLDivElement`. Sections of the page — a `fullWidth` SegmentedControl with counts; scrolls inside when it does not fit.",
      ru: "Разделы страницы — SegmentedControl с `fullWidth` и счётчиками; не помещается — прокрутка внутри.",
      props: [divRest(CHILDREN)],
    },
    {
      name: "Page.ToolbarView",
      en: "`ref` → `HTMLDivElement`. How the data is shown: period, table / cards, columns. Sized by content when wide; its own full row when narrow, its controls sharing it equally.",
      ru: "Как показаны данные: период, таблица / карточки, колонки. Широко — по содержимому; узко — своя строка во всю ширину, контролы делят её поровну.",
      props: [divRest(CHILDREN)],
    },
    {
      name: "Page.ToolbarActions",
      en: "`ref` → `HTMLDivElement`. The primary action of the toolbar: at the end of the top row; on a phone, when the search would get less than 18rem beside it, its own full row right under the search.",
      ru: "Главное действие панели: в конце верхней строки; на телефоне, когда поиску рядом осталось бы меньше 18rem, — своя строка во всю ширину прямо под поиском.",
      props: [divRest(CHILDREN)],
    },
    {
      name: "Page.ToolbarChips",
      en: "`ref` → `HTMLDivElement`. Active filters (`SmartFilter.Chips`) in their own row under the top row; the row takes no space while it is empty.",
      ru: "Активные фильтры (`SmartFilter.Chips`) отдельной строкой под верхней строкой; пока пусто, строка не занимает места.",
      props: [divRest(CHILDREN)],
    },
    {
      name: "Page.Body",
      en: "`ref` → `HTMLDivElement`. The page content: blocks of one screen 24 apart, a `Page.Section` 40 from its neighbours.",
      ru: "Содержимое страницы: блоки одного экрана через 24, `Page.Section` — через 40 от соседей.",
      props: [divRest(CHILDREN)],
    },
    {
      name: "Page.Section",
      en: "`ref` → `HTMLElement`. A titled section of the page — a `<section>` named by its `h2` (title-m): the heading with an optional description and `Page.Actions` at its end, then the content 16 below. Stands 40 from its neighbours in Body.",
      ru: "Раздел страницы с заголовком — `<section>`, названный своим `h2` (title-m): заголовок с необязательным описанием и `Page.Actions` в конце, под ним через 16 — содержимое. Стоит через 40 от соседей в Body.",
      props: [
        {
          name: "label",
          type: "ReactNode",
          required: true,
          en: "The visible heading (`h2`); it also names the section.",
          ru: "Видимый заголовок (`h2`); он же называет раздел.",
        },
        {
          name: "description",
          type: "ReactNode",
          en: "One line of context under the heading, in secondary body-s.",
          ru: "Строка пояснения под заголовком, вторичным body-s.",
        },
        {
          name: "layout",
          type: '"stack" | "aside"',
          default: '"stack"',
          en: "`stack` — the heading over the content; `aside` — a ~16rem heading column beside it (a settings page), above it once the content would get narrower than 30rem.",
          ru: "`stack` — заголовок над содержимым; `aside` — колонка заголовка ~16rem рядом с ним (страница настроек), над ним, когда содержимому осталось бы меньше 30rem.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLElement>, "title">',
          en: "`children` (the content; `Page.Actions` goes to the heading row), `className` and the other section attributes.",
          ru: "`children` (содержимое; `Page.Actions` уходит в строку заголовка), `className` и остальные атрибуты section.",
        },
      ],
    },
    {
      name: "Page.Grid",
      en: "`ref` → `HTMLDivElement`. The grid of the page's tiles (KPI cards, charts, panels): 12 columns, 16 apart on both axes, so its rows read as one board. A size container: cells fold by its own width (see Grid columns).",
      ru: "Сетка плиток страницы (KPI, графики, панели): 12 колонок, 16 по обеим осям, так что её ряды читаются как одна доска. Контейнер размера: ячейки складываются по её собственной ширине.",
      props: [divRest({ en: "`children` (`Page.Cell`)", ru: "`children` (`Page.Cell`)" })],
    },
    {
      name: "Page.Cell",
      en: "`ref` → `HTMLDivElement`. One tile place in `Page.Grid`; its child (a Card, a ChartFrame) stretches to it, so the tiles of a row share one height.",
      ru: "Место одной плитки в `Page.Grid`; её ребёнок (Card, ChartFrame) растягивается на неё, так что плитки ряда одной высоты.",
      props: [
        {
          name: "span",
          type: "1 | 2 | … | 12",
          default: "12",
          en: "Columns of 12 on a wide grid (64rem+). Narrower grids round it: see Grid columns in COMPONENT.md.",
          ru: "Колонок из 12 в широкой сетке (от 64rem). В более узкой сетке округляется: см. Grid columns в COMPONENT.md.",
        },
        {
          name: "rows",
          type: "1 | 2 | 3 | 4",
          default: "1",
          en: 'Rows the cell spans from 40rem: a chart beside two stacked tiles (`ChartFrame.Plot height="fill"` fills the height).',
          ru: 'Сколько рядов занимает ячейка от 40rem: график рядом с двумя плитками друг под другом (`ChartFrame.Plot height="fill"` заполняет высоту).',
        },
        divRest({ en: "`children` (one tile)", ru: "`children` (одна плитка)" }),
      ],
    },
    {
      name: "Page.Split",
      en: "`ref` → `HTMLDivElement`. List + detail (mail, a messenger, a ticket queue): side by side from 48rem of its own width, one pane at a time below it, focus following the pane that comes into view.",
      ru: "Список + детали (почта, мессенджер, очередь обращений): рядом от 48rem своей ширины, уже — по одной панели; фокус следует за появившейся панелью.",
      props: [
        {
          name: "open",
          type: "boolean",
          en: "The detail is open (a record is chosen), controlled. On a narrow split it takes the place of the list; on a wide one both panes stay.",
          ru: "Детали открыты (запись выбрана), управляемо. В узком сплите они занимают место списка; в широком видны обе панели.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          en: "Initial open state, uncontrolled.",
          ru: "Начальное состояние без контроля.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          en: "`Page.BackButton` closes the detail (`false`); clear the chosen record there.",
          ru: "`Page.BackButton` закрывает детали (`false`); сбросьте выбранную запись здесь.",
        },
        divRest({
          en: "`children` (`Page.List`, then `Page.Detail`)",
          ru: "`children` (`Page.List`, затем `Page.Detail`)",
        }),
      ],
    },
    {
      name: "Page.List",
      en: "`ref` → `HTMLDivElement`. The list pane: the 16–20rem column, or the whole split while the detail is closed; going back refocuses its last control. A column whose last child takes the free height (a Card with its own ScrollContainer). Focusable from code (`tabindex=-1`, no ring).",
      ru: "Панель списка: колонка 16–20rem или весь сплит, пока детали закрыты; при возврате фокус — на её последний элемент. Колонка, последний ребёнок которой занимает свободную высоту (Card со своим ScrollContainer). Фокусируется из кода (`tabindex=-1`, без обводки).",
      props: [divRest({ en: "`children`, `aria-label`", ru: "`children`, `aria-label`" })],
    },
    {
      name: "Page.Detail",
      en: "`ref` → `HTMLDivElement`. The detail pane: the rest of a wide split, or the whole split while open; focus lands here when it opens. A column whose last child takes the free height. Focusable from code (`tabindex=-1`, no ring).",
      ru: "Панель деталей: остальная часть широкого сплита или весь сплит, пока открыты; при открытии фокус здесь. Колонка, последний ребёнок которой занимает свободную высоту. Фокусируется из кода (`tabindex=-1`, без обводки).",
      props: [divRest({ en: "`children`, `aria-label`", ru: "`children`, `aria-label`" })],
    },
    {
      name: "Page.BackButton",
      en: "`ref` → `HTMLButtonElement`. Back from the detail to the list: a soft neutral icon Button (`nav.chevronLeft`) named by `labels.back`, shown only while the split shows one pane. Put it first in the detail's header; `event.preventDefault()` in `onClick` keeps the detail open.",
      ru: "Назад из деталей к списку: иконочная Button (soft, neutral, `nav.chevronLeft`) с именем из `labels.back`, видна, только пока сплит показывает одну панель. Ставьте первой в шапке деталей; `event.preventDefault()` в `onClick` оставляет детали открытыми.",
      props: [
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children">',
          en: "`onClick`, `aria-label` (replaces `labels.back`), `className` and the other button attributes.",
          ru: "`onClick`, `aria-label` (заменяет `labels.back`), `className` и остальные атрибуты кнопки.",
        },
      ],
    },
  ],
  labels: labelRows(PAGE_LABELS, {
    menu: {
      en: "Name of the menu button `Page.TopBar` draws while the shell's Sidebar is off-canvas.",
      ru: "Имя кнопки меню, которую рисует `Page.TopBar`, пока Sidebar каркаса выезжающий.",
    },
    more: {
      en: "Name of the «⋯» button the top bar's `Page.Actions` fold into.",
      ru: "Имя кнопки «⋯», в которую сворачиваются `Page.Actions` верхней полосы.",
    },
    back: {
      en: "Name of `Page.BackButton`.",
      ru: "Имя `Page.BackButton`.",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Enter · Space",
        en: "On the top bar's menu button: opens or closes the off-canvas Sidebar. On «⋯»: opens the menu of folded actions (arrows move, Escape closes). On `Page.BackButton`: back from the detail to the list; focus returns to the list control that opened it.",
        ru: "На кнопке меню полосы — открывает и закрывает выезжающий Sidebar. На «⋯» — открывает меню свёрнутых действий (стрелки двигают, Escape закрывает). На `Page.BackButton` — возвращает из деталей к списку; фокус встаёт на элемент списка, с которого их открыли.",
      },
    ],
    aria: [
      {
        en: "`AppShell.Main` is the `<main>` landmark; the page inside it is a plain column (a `region` only when named). `Page.TopBar` is a `<header>` inside main — no banner landmark.",
        ru: "`AppShell.Main` — ориентир `<main>`; страница внутри — обычная колонка (`region`, только если названа). `Page.TopBar` — `<header>` внутри main, не ориентир banner.",
      },
      {
        en: "`Page.Title` is the page's `<h1>`, one per page, in the bar or in the flow. The title a `collapse` bar repeats is `aria-hidden` and `inert`: the heading is read once.",
        ru: "`Page.Title` — `<h1>` страницы, один на страницу, в полосе или в потоке. Повтор заголовка в полосе с `collapse` — `aria-hidden` и `inert`: заголовок читается один раз.",
      },
      {
        en: "The menu button carries `aria-expanded` and `aria-controls` → the Sidebar's `<nav>`. Folded actions are `display: none` in the bar and `menuitem`s in the «⋯» menu, named by the Button's `aria-label` or its text; their `onClick` runs from the menu.",
        ru: "Кнопка меню несёт `aria-expanded` и `aria-controls` на `<nav>` Sidebar. Свёрнутые действия в полосе — `display: none`, в меню «⋯» — `menuitem` с именем из `aria-label` кнопки или её текста; их `onClick` срабатывает из меню.",
      },
      {
        en: "`Page.Toolbar` renders the slots in the wide layout's reading order — Tools, Sections, View, Actions, Chips — whatever the JSX order; the narrow layout moves them only visually (`order`). Named, it is a `group`.",
        ru: "`Page.Toolbar` выводит слоты в порядке чтения широкой раскладки — инструменты, разделы, вид, действие, чипы — независимо от JSX; узкая раскладка двигает их только визуально (`order`). С именем — `group`.",
      },
      {
        en: "`Page.Section` is a `<section>` named by its own `<h2>` (`label`) through `aria-labelledby`; the heading levels go h1 (page) → h2 (section) → h3 (a card title inside it).",
        ru: "`Page.Section` — `<section>`, названный своим `<h2>` (`label`) через `aria-labelledby`; уровни заголовков: h1 (страница) → h2 (раздел) → h3 (заголовок карточки в нём).",
      },
      {
        en: 'Name both panes of `Page.Split` with `aria-label`: a named pane is `role="region"`. On a narrow split opening the detail moves focus into it and going back returns focus to the list control; the hidden pane is `display: none`. `Page.BackButton` is named by `labels.back` and shown only while the split shows one pane.',
        ru: 'Назовите обе панели `Page.Split` через `aria-label`: названная панель — `role="region"`. В узком сплите при открытии деталей фокус переходит в них, при возврате — к элементу списка; скрытая панель — `display: none`. `Page.BackButton` названа `labels.back` и видна, только пока сплит показывает одну панель.',
      },
    ],
  },
};
