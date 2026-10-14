import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "PageContent.Root",
      en: "`ref` → `HTMLDivElement`. The page column inside `main`: header → body 24 apart, centred under its cap.",
      ru: "Колонка страницы внутри `main`: шапка и тело с ритмом 24, по центру под своим ограничением.",
      props: [
        {
          name: "maxWidth",
          type: '"full" | "readable" | "wide"',
          default: '"full"',
          en: "Cap of the column, centred: `full` — the whole main; `readable` — the reading measure `--prime-layout-reading-max-width` (42rem); `wide` — the content width `--prime-layout-content-max-width` (75rem).",
          ru: "Ограничение колонки по центру: `full` — весь main; `readable` — колонка для чтения `--prime-layout-reading-max-width` (42rem); `wide` — ширина контента `--prime-layout-content-max-width` (75rem).",
        },
        {
          name: "fill",
          type: "boolean",
          default: "false",
          en: "The page takes the height of main (`AppShell.Root fillViewport`) and the body takes what the header leaves: for a full-height table, board, chat or `PageContent.Split`.",
          ru: "Страница занимает высоту main (`AppShell.Root fillViewport`), тело — всё, что оставила шапка: для таблицы, доски или чата на всю высоту и `PageContent.Split`.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (Header, Body), `className` and the other div attributes.",
          ru: "`children` (Header, Body), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "PageContent.Page",
      en: "`ref` → `HTMLElement`. The whole app page as a `<section>` (the same column, the full panel width); name it with `aria-labelledby` → the Title `id`.",
      ru: "Вся страница приложения как `<section>` (та же колонка во всю ширину панели); назовите её через `aria-labelledby` на `id` заголовка.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `aria-labelledby`, `className` and the other section attributes.",
          ru: "`children`, `aria-labelledby`, `className` и остальные атрибуты section.",
        },
      ],
    },
    {
      name: "PageContent.Header",
      en: "`ref` → `HTMLDivElement`. Heading column and page actions in one wrapping row; `PageContent.Actions` children move to the end.",
      ru: "Колонка заголовка и действия страницы в одном переносимом ряду; `PageContent.Actions` уходят в конец.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (Title, Description, Actions), `className` and the other div attributes.",
          ru: "`children` (Title, Description, Actions), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "PageContent.Title",
      en: "`ref` → `HTMLHeadingElement`. The page `<h1>` in heading-m.",
      ru: "Заголовок страницы `<h1>` стилем heading-m.",
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
      name: "PageContent.Description",
      en: "`ref` → `HTMLParagraphElement`. Intro `<p>` in secondary body-m.",
      ru: "Вводный абзац `<p>` вторичным body-m.",
      props: [
        {
          name: "measure",
          type: '"readable" | "full"',
          default: '"readable"',
          en: "`readable` — no wider than the reading measure `--prime-layout-reading-max-width` (42rem); `full` — the full width of the parent.",
          ru: "`readable` — не шире колонки для чтения `--prime-layout-reading-max-width` (42rem); `full` — во всю ширину родителя.",
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
      name: "PageContent.Actions",
      en: "`ref` → `HTMLDivElement`. Page-level buttons next to the title; they wrap under the heading on narrow columns.",
      ru: "Кнопки страницы рядом с заголовком; в узкой колонке переносятся под него.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (Buttons), `className` and the other div attributes.",
          ru: "`children` (кнопки), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "PageContent.Body",
      en: "`ref` → `HTMLDivElement`. The page content: blocks of one screen 24 apart, a `PageContent.Section` 40 from its neighbours.",
      ru: "Содержимое страницы: блоки одного экрана через 24, `PageContent.Section` — через 40 от соседей.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "PageContent.Section",
      en: "`ref` → `HTMLElement`. A titled section of the page — a `<section>` named by its `h2` (title-m): the heading with an optional description and `PageContent.Actions` at its end, then the content 16 below. Stands 40 from its neighbours in Body.",
      ru: "Раздел страницы с заголовком — `<section>`, названный своим `h2` (title-m): заголовок с необязательным описанием и `PageContent.Actions` в конце, под ним через 16 — содержимое. Стоит через 40 от соседей в Body.",
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
          en: "`children` (the content; `PageContent.Actions` goes to the heading row), `className` and the other section attributes.",
          ru: "`children` (содержимое; `PageContent.Actions` уходит в строку заголовка), `className` и остальные атрибуты section.",
        },
      ],
    },
    {
      name: "PageContent.Grid",
      en: "`ref` → `HTMLDivElement`. The grid of the page's tiles (KPI cards, charts, panels): 12 columns, 16 apart on both axes, so its rows read as one board. A size container: cells fold by its own width (see Grid columns).",
      ru: "Сетка плиток страницы (KPI, графики, панели): 12 колонок, 16 по обеим осям, так что её ряды читаются как одна доска. Контейнер размера: ячейки складываются по её собственной ширине.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (`PageContent.Cell`), `className` and the other div attributes.",
          ru: "`children` (`PageContent.Cell`), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "PageContent.Cell",
      en: "`ref` → `HTMLDivElement`. One tile place in `PageContent.Grid`; its child (a Card, a ChartFrame) stretches to it, so the tiles of a row share one height.",
      ru: "Место одной плитки в `PageContent.Grid`; её ребёнок (Card, ChartFrame) растягивается на неё, так что плитки ряда одной высоты.",
      props: [
        {
          name: "span",
          type: "1 | 2 | … | 12",
          default: "12",
          en: "Columns of 12 on a wide grid (64rem+). Narrower grids round it: see Grid columns in COMPONENT.md.",
          ru: "Колонок из 12 в широкой сетке (от 64rem). В более узкой сетке округляется: малые плитки — по две в ряд от 30rem, `span` 4 — треть от 40rem, широкие — на весь ряд.",
        },
        {
          name: "rows",
          type: "1 | 2 | 3 | 4",
          default: "1",
          en: 'Rows the cell spans from 40rem: a chart beside two stacked tiles (`ChartFrame.Plot height="fill"` fills the height).',
          ru: 'Сколько рядов занимает ячейка от 40rem: график рядом с двумя плитками друг под другом (`ChartFrame.Plot height="fill"` заполняет высоту).',
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (one tile), `className` and the other div attributes.",
          ru: "`children` (одна плитка), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "PageContent.Split",
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
          en: "`PageContent.BackButton` closes the detail (`false`); clear the chosen record there.",
          ru: "`PageContent.BackButton` закрывает детали (`false`); сбросьте выбранную запись здесь.",
        },
        {
          name: "labels",
          type: "Partial<PageContentLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Встроенные строки, см. Labels.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (`PageContent.List`, `PageContent.Detail`), `className` and the other div attributes.",
          ru: "`children` (`PageContent.List`, `PageContent.Detail`), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "PageContent.List",
      en: "`ref` → `HTMLDivElement`. The list pane: a column whose last child takes the free height (a Card with its own ScrollContainer). Focusable from code (`tabindex=-1`, no ring): going back lands on the control that had focus, else here.",
      ru: "Панель списка: колонка, последний ребёнок которой занимает свободную высоту (Card со своим ScrollContainer). Фокусируется из кода (`tabindex=-1`, без обводки): при возврате фокус попадает на элемент, где был, иначе сюда.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `aria-label`, `className` and the other div attributes.",
          ru: "`children`, `aria-label`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "PageContent.Detail",
      en: "`ref` → `HTMLDivElement`. The detail pane, built like the list pane; focus lands here when it opens on a narrow split. Show a hint («Выберите диалог») while nothing is chosen: a wide split always shows this pane.",
      ru: "Панель деталей, устроена как панель списка; в узком сплите при открытии фокус попадает сюда. Пока ничего не выбрано, покажите подсказку («Выберите диалог»): в широком сплите панель видна всегда.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `aria-label`, `className` and the other div attributes.",
          ru: "`children`, `aria-label`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "PageContent.BackButton",
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
  labels: [
    {
      key: "back",
      default: "Назад к списку",
      en: "Name of `PageContent.BackButton` (on `PageContent.Split`).",
      ru: "Имя `PageContent.BackButton` (у `PageContent.Split`).",
    },
  ],
};
