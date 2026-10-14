import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "AppShell.Root",
      en: "`ref` → `HTMLDivElement`. Grid of the nav column and the content panel (the page itself); every child but `AppShell.Nav` goes into the panel. Owns the navigation its Sidebar publishes (`useAppShellNav`) and the header row an `AppHeader.Root` anywhere in it renders in.",
      ru: "Сетка: колонка навигации и панель содержимого (сама страница); всё, кроме `AppShell.Nav`, попадает в панель. Хранит навигацию, которую публикует Sidebar (`useAppShellNav`), и строку шапки, где рендерится `AppHeader.Root` из любого места каркаса.",
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
          en: "`children` (Nav, `AppHeader.Root`, Main, Footer), `className` and the other div attributes.",
          ru: "`children` (Nav, `AppHeader.Root`, Main, Footer), `className` и остальные атрибуты div.",
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
      name: "AppShell.Main",
      en: "`ref` → `HTMLElement`. The `<main>` with the canonical gutters: a vertical `ScrollContainer`.",
      ru: "`<main>` с отступами кита — вертикальный `ScrollContainer`.",
      props: [
        {
          name: "contentWidth",
          type: '"contained" | "full"',
          default: '"full"',
          en: "`full` — the whole panel with gutters; `contained` — a centred column up to `--prime-layout-content-max-width`.",
          ru: "`full` — вся панель с отступами; `contained` — колонка по центру до `--prime-layout-content-max-width`.",
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
      name: "AppShell.Footer",
      en: "`ref` → `HTMLDivElement`. Sticky bottom bar of the panel for `BottomNav`; no padding of its own. Shows only while the shell has no navigation column on screen (no `AppShell.Nav`, or the Sidebar is off-canvas); with the rail on screen the footer leaves.",
      ru: "Липкая нижняя полоса панели для `BottomNav`, без своих отступов. Видна, только пока у каркаса нет колонки навигации на экране (нет `AppShell.Nav` или Sidebar выдвижной); с рейлом на экране нижняя зона уходит.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (usually `BottomNav.Root`), `className` and the other div attributes.",
          ru: "`children` (обычно `BottomNav.Root`), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "AppShell.Template",
      en: "`ref` → the `<main>`. Root + Nav + the header + Main + Footer in one; main scrolls to the top when `scrollResetKey` changes.",
      ru: "Root, Nav, шапка, Main и Footer одним компонентом; main прокручивается наверх при смене `scrollResetKey`.",
      props: [
        {
          name: "fillViewport",
          type: "boolean",
          default: "false",
          en: "As on `AppShell.Root`: only `<main>` scrolls.",
          ru: "Как у `AppShell.Root`: прокручивается только `<main>`.",
        },
        {
          name: "nav",
          type: "ReactNode",
          en: "Navigation column content; without it the panel takes the full width.",
          ru: "Содержимое колонки навигации; без него панель на всю ширину.",
        },
        {
          name: "header",
          type: "ReactNode",
          en: "The default header row, an `AppHeader.Root`: a page that renders its own header replaces it while that page is on screen.",
          ru: "Шапка по умолчанию — `AppHeader.Root`: страница со своей шапкой заменяет её, пока эта страница на экране.",
        },
        {
          name: "footer",
          type: "ReactNode",
          en: "Footer content (`BottomNav`); no footer when omitted.",
          ru: "Содержимое нижней полосы (`BottomNav`); без него полосы нет.",
        },
        {
          name: "mainProps",
          type: 'Omit<AppShellMainProps, "children">',
          en: "Props for Main (e.g. `contentWidth`).",
          ru: "Пропсы Main (например `contentWidth`).",
        },
        {
          name: "scrollResetKey",
          type: "unknown",
          en: "Main scrolls back to the top whenever this value changes; pass the router pathname.",
          ru: "Main прокручивается наверх при каждом изменении значения; передайте pathname роутера.",
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
  types: [
    {
      name: "AppShellNavState",
      en: "The navigation of the shell, as its Sidebar publishes it.",
      ru: "Навигация каркаса, как её публикует Sidebar.",
      fields: [
        {
          name: "navId",
          type: "string",
          en: "`id` of the navigation landmark, for `aria-controls`.",
          ru: "`id` ориентира навигации — для `aria-controls`.",
        },
        {
          name: "offCanvas",
          type: "boolean",
          en: 'The navigation is an off-canvas panel now (a phone, or `offCanvas="always"`).',
          ru: 'Навигация сейчас — выезжающая панель (телефон или `offCanvas="always"`).',
        },
        {
          name: "open",
          type: "boolean",
          en: "The off-canvas panel is open.",
          ru: "Выезжающая панель открыта.",
        },
        {
          name: "setOpen",
          type: "(open: boolean) => void",
          en: "Opens or closes the off-canvas panel.",
          ru: "Открывает или закрывает выезжающую панель.",
        },
        {
          name: "expanded",
          type: "boolean",
          en: "The navigation is in view: the off-canvas panel open, or the rail expanded.",
          ru: "Навигация видна: выезжающая панель открыта или рельс развёрнут.",
        },
        {
          name: "toggle",
          type: "() => void",
          en: "Opens or closes the off-canvas panel; on screen, expands or folds the rail.",
          ru: "Открывает или закрывает выезжающую панель; на экране разворачивает или сворачивает рельс.",
        },
      ],
    },
  ],
  functions: [
    {
      name: "useAppShellNav()",
      type: "() => AppShellNavState | null",
      en: "The navigation of the nearest `AppShell.Root` for a trigger outside the rail (a BottomNav «Ещё», an own menu button); `null` outside a shell or without a Sidebar in it.",
      ru: "Навигация ближайшего `AppShell.Root` для кнопки вне рельса («Ещё» в BottomNav, своя кнопка меню); `null` вне каркаса или без Sidebar в нём.",
    },
  ],
  labels: [],
  accessibility: {
    keyboard: [],
    aria: [
      {
        en: "Main is the `<main>` landmark; the banner comes from AppHeader (`<header>`), the navigation landmarks from Sidebar and BottomNav (`<nav>`).",
        ru: "Main — ориентир `<main>`; шапку `<header>` даёт AppHeader, ориентиры навигации — Sidebar и BottomNav (`<nav>`).",
      },
      {
        en: "One `<h1>` per page: `AppHeader.Title` on app pages, `PageContent.Title` on a document page (whose header then has no title).",
        ru: "Один `<h1>` на странице: `AppHeader.Title` на страницах приложения, `PageContent.Title` на странице-документе (тогда в шапке нет заголовка).",
      },
    ],
  },
};
