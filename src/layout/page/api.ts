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
          en: "`children` (`Page.TopBar`, `Page.Header`, `Page.Body`)",
          ru: "`children` (`Page.TopBar`, `Page.Header`, `Page.Body`)",
        }),
      ],
    },
    {
      name: "Page.TopBar",
      en: "`ref` → `HTMLElement` (`<header>`). The strip at the page's top edge: `Page.Heading`, `Page.Tools`, `Page.Actions`, `Page.Chips` in this DOM order, laid out by one plan from their natural widths — one line, tools below, icon-only buttons, «⋯», then a stacked or truncated heading.",
      ru: "Полоса у верхнего края страницы: `Page.Heading`, `Page.Tools`, `Page.Actions`, `Page.Chips` в этом порядке DOM; их раскладывает один план по естественной ширине — одна строка, инструменты ниже, кнопки-иконки, «⋯», затем заголовок в столбик или с обрезкой.",
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
          en: "Once the flow `Page.Title` scrolls out under the bar, the bar repeats it as the last level of its heading (of its `Breadcrumb` path, which folds for it), unless the path ends at it; it leaves when the title returns.",
          ru: "Когда `Page.Title` в потоке уходит под полосу, полоса повторяет его последним уровнем заголовка (пути `Breadcrumb`, который ради него сворачивается), если путь им не кончается; уходит, когда заголовок возвращается.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children` (`Page.Heading`, `Page.Tools`, `Page.Actions`, `Page.Chips` — direct children), `className` and the other attributes.",
          ru: "`children` (`Page.Heading`, `Page.Tools`, `Page.Actions`, `Page.Chips` — прямые дети), `className` и остальные атрибуты.",
        },
      ],
    },
    {
      name: "Page.Header",
      en: "`ref` → `HTMLDivElement`. The document header in the page flow (settings, long forms): a `Page.Heading` and its `Page.Actions` in one row; the actions wrap under it on a narrow column.",
      ru: "Заголовок документа в потоке страницы (настройки, длинные формы): `Page.Heading` и его `Page.Actions` в одном ряду; на узкой колонке действия переносятся под него.",
      props: [
        divRest({
          en: "`children` (`Page.Heading`, `Page.Actions`)",
          ru: "`children` (`Page.Heading`, `Page.Actions`)",
        }),
      ],
    },
    {
      name: "Page.Heading",
      en: "`ref` → `HTMLDivElement`. The title group: a `Breadcrumb.Root` path, `Page.Title`, `Page.Description`. In the bar the title is the path's last level (path › title on one line, both truncate); in the flow the path stands over a large title.",
      ru: "Группа заголовка: путь `Breadcrumb.Root`, `Page.Title`, `Page.Description`. В полосе заголовок — последний уровень пути (путь › заголовок в одну строку, оба обрезаются); в потоке путь стоит над большим заголовком.",
      props: [
        divRest({
          en: "`children` (`Breadcrumb.Root`, `Page.Title`, `Page.Description`)",
          ru: "`children` (`Breadcrumb.Root`, `Page.Title`, `Page.Description`)",
        }),
      ],
    },
    {
      name: "Page.Title",
      en: "`ref` → `HTMLHeadingElement`. The page's `<h1>`, one per page: the path's last level in the bar (title-m, truncates), a large title in the flow (heading-m, wraps). A flow title is what a `collapse` bar repeats.",
      ru: "`<h1>` страницы, один на страницу: последний уровень пути в полосе (title-m, обрезается), большой заголовок в потоке (heading-m, переносится). Заголовок в потоке повторяет полоса с `collapse`.",
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
      en: "`ref` → `HTMLParagraphElement`. One line of context that carries data (a period, a count): a muted caption under the whole heading line that truncates in the bar, secondary body-m that wraps (up to the reading measure) in the flow.",
      ru: "Строка контекста с данными (период, количество): приглушённый caption под всей строкой заголовка с обрезкой в полосе, вторичный body-m с переносом (не шире колонки для чтения) в потоке.",
      props: [
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "Its data is loading: a Skeleton keeps the line's place, so the title never moves; the data then fades in. Sets `aria-busy`.",
          ru: "Данные строки загружаются: Skeleton держит её место, заголовок не сдвигается; затем данные проявляются. Ставит `aria-busy`.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLParagraphElement>",
          en: "`children`, `className` and the other paragraph attributes.",
          ru: "`children`, `className` и остальные атрибуты абзаца.",
        },
      ],
    },
    {
      name: "Page.Tools",
      en: "`ref` → `HTMLDivElement`. What acts on the whole page: sub-page links, view, a shared period, a filter over views, a section page's table tools (a table block: its `toolbar`). In the heading row before the buttons while they fit, else on a line of their own. Named, a `group`.",
      ru: "То, что действует на всю страницу: ссылки подстраниц, вид, общий период, фильтр над видами, инструменты таблицы страницы раздела (таблица-блок — в своём `toolbar`). В строке заголовка перед кнопками, пока помещаются, иначе своей строкой. С именем — `group`.",
      props: [divRest({ en: "`children` (kit controls)", ru: "`children` (контролы кита)" })],
    },
    {
      name: "Page.Actions",
      en: "`ref` → `HTMLDivElement`. All the page's buttons. In the flow they wrap; in the bar a `Button.Root` with a `Button.Icon` gives way to its icon (secondary first, then the primary), then the secondary ones fold into «⋯».",
      ru: "Все кнопки страницы. В потоке переносятся; в полосе `Button.Root` с `Button.Icon` уступает до иконки (сначала второстепенные, затем главная), затем второстепенные сворачиваются в «⋯».",
      props: [divRest({ en: "`children` (Buttons)", ru: "`children` (кнопки)" })],
    },
    {
      name: "Page.Chips",
      en: "`ref` → `HTMLDivElement`. Active filters (`SmartFilter.Chips`) on a line of their own under everything in the bar; it takes no space while empty.",
      ru: "Активные фильтры (`SmartFilter.Chips`) своей строкой под всем в полосе; пока пусто, места не занимает.",
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
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLElement>, "title">',
          en: "`children` (the content; `Page.Actions` goes to the heading row), `className` and the other section attributes.",
          ru: "`children` (содержимое; `Page.Actions` уходит в строку заголовка), `className` и остальные атрибуты section.",
        },
      ],
    },
    {
      name: "Page.Grid",
      en: "`ref` → `HTMLDivElement`. The grid of the page's tiles (KPI cards, charts, panels): 12 columns, 16 apart on both axes, so its rows read as one board. A size container: cells fold by its own width, a wide cell next to a narrow one pairs up (see Grid columns).",
      ru: "Сетка плиток страницы (KPI, графики, панели): 12 колонок, 16 по обеим осям, так что её ряды читаются как одна доска. Контейнер размера: ячейки складываются по её ширине, широкая рядом с узкой встаёт парой.",
      props: [divRest({ en: "`children` (`Page.Cell`)", ru: "`children` (`Page.Cell`)" })],
    },
    {
      name: "Page.Cell",
      en: "`ref` → `HTMLDivElement`. One tile place in `Page.Grid`; its child (a Card, a ChartFrame) stretches to it, so the tiles of a row share one height; a `Crossfade` child gets `fill` unless it sets it.",
      ru: "Место одной плитки в `Page.Grid`; её ребёнок (Card, ChartFrame) растягивается на неё, так что плитки ряда одной высоты; ребёнок `Crossfade` получает `fill`, если не задал его сам.",
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
      name: "Page.Guard",
      en: "No DOM, no ref. Holds the page from anywhere inside it: a press on a `Sidebar.Item`, `BottomNav.Item` or `Breadcrumb.Item` link (a router link too) stops before it navigates, and the browser asks before the tab closes. Renders only its `ConfirmDialog`.",
      ru: "Удерживает страницу изнутри: нажатие на `Sidebar.Item`, `BottomNav.Item` или ссылку `Breadcrumb.Item` (и ссылку роутера) останавливается до перехода, а браузер спрашивает перед закрытием вкладки. Своего DOM нет, кроме `ConfirmDialog`.",
      props: [
        {
          name: "busy",
          type: "boolean",
          default: "false",
          en: "A request runs (a save): a press on those items does nothing until it ends; the browser asks before the tab closes.",
          ru: "Идёт запрос (сохранение): нажатие на эти пункты ничего не делает, пока он не закончится; браузер спрашивает перед закрытием вкладки.",
        },
        {
          name: "dirty",
          type: "boolean",
          default: "false",
          en: "Changes are not saved: a press on those items asks «leave without saving?»; its confirm (`labels.leaveConfirm`) repeats the press, its cancel keeps the page. The browser asks before the tab closes.",
          ru: "Изменения не сохранены: нажатие на эти пункты спрашивает «уйти без сохранения?»; кнопка действия (`labels.leaveConfirm`) повторяет нажатие, отмена оставляет страницу. Браузер спрашивает перед закрытием вкладки.",
        },
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
      en: "Name of the «⋯» button the secondary Buttons of the top bar's `Page.Actions` fold into.",
      ru: "Имя кнопки «⋯», в которую сворачиваются второстепенные кнопки `Page.Actions` верхней полосы.",
    },
    back: {
      en: "Name of `Page.BackButton`.",
      ru: "Имя `Page.BackButton`.",
    },
    leaveTitle: {
      en: "Title of the confirm `Page.Guard` opens when a person leaves a `dirty` page.",
      ru: "Заголовок подтверждения, которое открывает `Page.Guard`, когда со страницы с `dirty` уходят.",
    },
    leaveDescription: {
      en: "Its description.",
      ru: "Его описание.",
    },
    leaveConfirm: {
      en: "Its confirm button: leave and lose the changes.",
      ru: "Его кнопка действия: уйти и потерять изменения.",
    },
    leaveCancel: {
      en: "Its cancel button: stay on the page.",
      ru: "Его кнопка отмены: остаться на странице.",
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
        en: "The menu button carries `aria-expanded` and `aria-controls` → the Sidebar's `<nav>`. A Button that shows only its icon keeps its label as its accessible name; its tooltip repeats it. Folded Buttons are `hidden` in the bar and `menuitem`s in the «⋯» menu (named by `labels.more`), named by the Button's `aria-label` or its text, disabled with it; their `onClick` runs from the menu.",
        ru: "Кнопка меню несёт `aria-expanded` и `aria-controls` на `<nav>` Sidebar. Кнопка, показывающая только иконку, сохраняет подпись как доступное имя; подсказка её повторяет. Свёрнутые кнопки в полосе — `hidden`, в меню «⋯» (имя из `labels.more`) — `menuitem` с именем из `aria-label` кнопки или её текста, недоступные вместе с ней; их `onClick` срабатывает из меню.",
      },
      {
        en: "`Page.TopBar` renders its groups in reading order — `Page.Heading`, `Page.Tools`, `Page.Actions`, `Page.Chips` — whatever the JSX order; the plan moves them only visually. A named `Page.Tools` is a `group`. The chevron between the path and the title is decorative (`aria-hidden`): the title is the `<h1>`, outside the path's `<nav>`.",
        ru: "`Page.TopBar` выводит группы в порядке чтения — `Page.Heading`, `Page.Tools`, `Page.Actions`, `Page.Chips` — независимо от JSX; план двигает их только визуально. Названный `Page.Tools` — `group`. Шеврон между путём и заголовком декоративный (`aria-hidden`): заголовок — `<h1>` вне `<nav>` пути.",
      },
      {
        en: "`Page.Section` is a `<section>` named by its own `<h2>` (`label`) through `aria-labelledby`; the heading levels go h1 (page) → h2 (section) → h3 (a card title inside it).",
        ru: "`Page.Section` — `<section>`, названный своим `<h2>` (`label`) через `aria-labelledby`; уровни заголовков: h1 (страница) → h2 (раздел) → h3 (заголовок карточки в нём).",
      },
      {
        en: "`Page.Guard` holds a press made by pointer or keyboard alike (Enter on a link is a click). Its confirm is a `ConfirmDialog` (`alertdialog`): focus moves into it and, on «stay», returns to the item that was pressed.",
        ru: "`Page.Guard` удерживает нажатие и мышью, и с клавиатуры (Enter на ссылке — это клик). Его подтверждение — `ConfirmDialog` (`alertdialog`): фокус переходит в него и после «остаться» возвращается на нажатый пункт.",
      },
      {
        en: 'Name both panes of `Page.Split` with `aria-label`: a named pane is `role="region"`. On a narrow split opening the detail moves focus into it and going back returns focus to the list control; the hidden pane is `display: none`. `Page.BackButton` is named by `labels.back` and shown only while the split shows one pane.',
        ru: 'Назовите обе панели `Page.Split` через `aria-label`: названная панель — `role="region"`. В узком сплите при открытии деталей фокус переходит в них, при возврате — к элементу списка; скрытая панель — `display: none`. `Page.BackButton` названа `labels.back` и видна, только пока сплит показывает одну панель.',
      },
    ],
  },
};
