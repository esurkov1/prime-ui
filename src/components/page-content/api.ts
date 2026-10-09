import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "PageContent.Root",
      en: "`ref` → `HTMLDivElement`. The page column inside `main`: header → body 32 apart, centred under its cap.",
      ru: "Колонка страницы внутри `main`: шапка и тело с ритмом 32, по центру под своим ограничением.",
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
          en: 'The page takes the height of the panel\'s main (`AppShell.Root fillViewport`) and the body takes what the header leaves: for a full-height table (`scrollHeight="fill"`), board (Crossfade `fill`), chat or `PageContent.Split`. Main keeps only gutter-high air below it.',
          ru: 'Страница занимает высоту main панели (`AppShell.Root fillViewport`), тело — всё, что оставила шапка: для таблицы на всю высоту (`scrollHeight="fill"`), доски (Crossfade `fill`), чата или `PageContent.Split`. Под ней в main остаётся только отступ, равный боковому.',
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
      name: "PageContent.Section",
      en: "`ref` → `HTMLElement`. The same column as a `<section>`, without a cap; name it with `aria-labelledby` → the Title `id`.",
      ru: "Та же колонка как `<section>` без ограничения ширины; назовите её через `aria-labelledby` на `id` заголовка.",
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
      en: "`ref` → `HTMLDivElement`. The page content; blocks 40 apart.",
      ru: "Содержимое страницы; блоки с отступом 40.",
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
      name: "PageContent.Split",
      en: "`ref` → `HTMLDivElement`. List + detail (mail, a messenger, a ticket queue), a container (`prime-split`): from 48rem of its own width the list stands in a 16–20rem column with the detail beside it, 24 apart; below that one pane at a time — the list, or the open detail. The pane that comes into view enters (`enterMotion`, base) and focus follows it: into the detail, back to the list control it left. Takes the free height of a filling page.",
      ru: "Список + детали (почта, мессенджер, очередь обращений), контейнер (`prime-split`): от 48rem своей ширины список стоит колонкой 16–20rem, детали рядом, зазор 24; уже — одна панель: список или открытые детали. Появившаяся панель входит (`enterMotion`, base), фокус следует за ней: в детали и обратно к элементу списка. Занимает свободную высоту заполняющей страницы.",
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
