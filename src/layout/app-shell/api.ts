import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "AppShell.Root",
      en: "`ref` → `HTMLDivElement`. Grid of the nav column and the content panel (the page itself); every child but `AppShell.Nav` goes into the panel. Owns the navigation its Sidebar publishes (`useAppShellNav`).",
      ru: "Сетка: колонка навигации и панель содержимого (сама страница); всё, кроме `AppShell.Nav`, попадает в панель. Хранит навигацию, которую публикует Sidebar (`useAppShellNav`).",
      props: [
        {
          name: "fillViewport",
          type: "boolean",
          default: "true",
          en: "The app frame: fixed to the viewport, only `AppShell.Main` scrolls; the document stays still (no rubber band, no pull-to-refresh). A nested shell is a box. `false`: a document page, the document scrolls.",
          ru: "Каркас приложения: закреплён в окне, прокручивается только `AppShell.Main`; документ неподвижен (без оттяжки и pull-to-refresh). Вложенный — блок. `false`: страница-документ, листается документ.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (Nav, Main, Footer), `className` and the other div attributes.",
          ru: "`children` (Nav, Main, Footer), `className` и остальные атрибуты div.",
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
      en: "`ref` → `HTMLElement`. The `<main>` where the page renders: a vertical `ScrollContainer` that hands `Page.Root` the gutters and top air (`--page-gutter`, `--page-top`) and keeps room under a floating `BottomNav`.",
      ru: "`<main>`, где рендерится страница: вертикальный `ScrollContainer`, который передаёт `Page.Root` поля и верхний воздух (`--page-gutter`, `--page-top`) и оставляет место под плавающей `BottomNav`.",
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
      name: "AppShell.Fab",
      en: "`ref` → `HTMLButtonElement`. The app's floating main action: a `Button shape=\"circle\"` (`xl`, solid neutral) in the panel's bottom end corner, above the footer bar or the capsule, inside `--prime-safe-area-*`, under every overlay. Rendered from anywhere inside `AppShell.Root`.",
      ru: 'Плавающее главное действие приложения: `Button shape="circle"` (`xl`, solid neutral) в нижнем конечном углу панели, над нижней полосой или плавающей капсулой, внутри `--prime-safe-area-*`, под любым оверлеем. Рендерится из любого места внутри `AppShell.Root`.',
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The glyph (`<Icon>`), placed in `Button.Icon`.",
          ru: "Глиф (`<Icon>`), кладётся в `Button.Icon`.",
        },
        {
          name: "aria-label",
          type: "string",
          required: true,
          en: "The action the button performs; it has no visible text.",
          ru: "Действие кнопки; видимого текста у неё нет.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">',
          en: "`onClick`, `aria-expanded`, `aria-keyshortcuts`, `className` and the other button attributes (a `Tooltip.Trigger` or `Drawer.Trigger` slot wraps it).",
          ru: "`onClick`, `aria-expanded`, `aria-keyshortcuts`, `className` и остальные атрибуты кнопки (её оборачивает слот `Tooltip.Trigger` или `Drawer.Trigger`).",
        },
      ],
    },
    {
      name: "AppShell.Template",
      en: "`ref` → the `<main>`. Root + Nav + Main + Footer in one; main scrolls to the top when `scrollResetKey` changes.",
      ru: "Root, Nav, Main и Footer одним компонентом; main прокручивается наверх при смене `scrollResetKey`.",
      props: [
        {
          name: "fillViewport",
          type: "boolean",
          default: "true",
          en: "As on `AppShell.Root`: the app frame, only `<main>` scrolls.",
          ru: "Как у `AppShell.Root`: каркас приложения, прокручивается только `<main>`.",
        },
        {
          name: "nav",
          type: "ReactNode",
          en: "Navigation column content; without it the panel takes the full width.",
          ru: "Содержимое колонки навигации; без него панель на всю ширину.",
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
          en: "Props for Main (`id`, `tabIndex` for a skip link).",
          ru: "Пропсы Main (`id`, `tabIndex` для ссылки пропуска).",
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
          en: "The page inside Main (`Page.Root`).",
          ru: "Страница внутри Main (`Page.Root`).",
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
    keyboard: [
      {
        keys: "Tab · Shift+Tab",
        native: true,
        en: "Reaches `AppShell.Fab` after the page and before the phone navigation, wherever it is rendered.",
        ru: "Доводит фокус до `AppShell.Fab` после страницы и перед навигацией телефона, где бы она ни была отрендерена.",
      },
      {
        keys: "Enter · Space",
        native: true,
        en: "Runs the floating action (`AppShell.Fab`).",
        ru: "Выполняет плавающее действие (`AppShell.Fab`).",
      },
    ],
    aria: [
      {
        en: "Main is the `<main>` landmark; the navigation landmarks come from Sidebar and BottomNav (`<nav>`). The page's top bar is a `<header>` inside main, not a banner.",
        ru: "Main — ориентир `<main>`; ориентиры навигации — Sidebar и BottomNav (`<nav>`). Верхняя полоса страницы — `<header>` внутри main, не ориентир banner.",
      },
      {
        en: "One `<h1>` per page: its `Page.Title`, in the top bar or in the flow.",
        ru: "Один `<h1>` на странице — её `Page.Title`, в верхней полосе или в потоке.",
      },
      {
        en: "`AppShell.Fab` is a `<button>` named by its required `aria-label`; under a modal overlay it is inert with the rest of the page.",
        ru: "`AppShell.Fab` — `<button>` с обязательным `aria-label`; под модальным оверлеем она инертна вместе со всей страницей.",
      },
    ],
  },
};
