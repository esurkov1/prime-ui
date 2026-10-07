import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "AppShell.Root",
      en: "`forwardRef` → `HTMLDivElement`. Grid of the nav column (canvas) and the content panel (surface); every child that is not `AppShell.Nav` goes into the panel.",
      ru: "Сетка: колонка навигации на холсте и панель содержимого на поверхности; всё, кроме `AppShell.Nav`, попадает в панель.",
      props: [
        {
          name: "fillViewport",
          type: "boolean",
          default: "false",
          en: "The shell is exactly the viewport high and only `AppShell.Main` scrolls; otherwise the document scrolls and the nav is sticky.",
          ru: "Оболочка ровно в высоту окна, прокручивается только `AppShell.Main`; иначе прокручивается документ, а навигация липкая.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (Nav, Header, Main), `className` and the other div attributes.",
          ru: "`children` (Nav, Header, Main), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "AppShell.Nav",
      en: "`ref` → `HTMLDivElement`. The navigation column slot (not a landmark: Sidebar renders the `<nav>`).",
      ru: "Слот колонки навигации (не ориентир: `<nav>` рендерит Sidebar).",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (usually `Sidebar.Root`), `className` and the other div attributes.",
          ru: "`children` (обычно `Sidebar.Root`), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "AppShell.Header",
      en: "`forwardRef` → `HTMLElement`. Sticky `<header>` row of the panel for breadcrumbs, search and actions.",
      ru: "Липкая строка `<header>` панели для хлебных крошек, поиска и действий.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `className` and the other attributes.",
          ru: "`children`, `className` и остальные атрибуты.",
        },
      ],
    },
    {
      name: "AppShell.Main",
      en: "`forwardRef` → `HTMLElement`. The `<main>` with the canonical gutters: a vertical `ScrollContainer`.",
      ru: "`<main>` с отступами кита — вертикальный `ScrollContainer`.",
      props: [
        {
          name: "contentWidth",
          type: '"contained" | "full"',
          default: '"full"',
          en: "`full` — the whole panel with gutters; `contained` — a centred column up to `--prime-layout-content-max-width`.",
          ru: "`full` — вся панель с отступами; `contained` — колонка по центру до ширины контента.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `className` and the other attributes.",
          ru: "`children`, `className` и остальные атрибуты.",
        },
      ],
    },
    {
      name: "AppShell.Template",
      en: "`forwardRef` → the `<main>`. Root + Nav + Header + Main in one; inside a router main scrolls to the top on route change.",
      ru: "Root, Nav, Header и Main одним компонентом; внутри роутера main прокручивается наверх при смене маршрута.",
      props: [
        {
          name: "nav",
          type: "ReactNode",
          en: "Navigation column content; without it the panel takes the full width.",
          ru: "Содержимое колонки навигации; без него панель на всю ширину.",
        },
        {
          name: "header",
          type: "ReactNode",
          en: "Header content; no header row when omitted.",
          ru: "Содержимое шапки; без него строки шапки нет.",
        },
        {
          name: "mainProps",
          type: 'Omit<AppShellMainProps, "children">',
          en: "Props for Main (e.g. `contentWidth`).",
          ru: "Пропсы Main (например `contentWidth`).",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Page content inside Main.",
          ru: "Содержимое страницы внутри Main.",
        },
        {
          name: "…rest",
          type: 'Omit<AppShellRootProps, "children">',
          en: "Root props: `fillViewport`, `className` and the div attributes.",
          ru: "Пропсы Root: `fillViewport`, `className` и атрибуты div.",
        },
      ],
    },
  ],
  labels: [],
};
