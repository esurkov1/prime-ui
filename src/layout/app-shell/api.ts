import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "AppShell.Root",
      en: "`ref` → `HTMLDivElement`. Grid of the nav column (canvas) and the content panel (surface); every child that is not `AppShell.Nav` goes into the panel.",
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
      name: "AppShell.Footer",
      en: "`ref` → `HTMLDivElement`. Sticky bottom bar of the panel for `BottomNav`; no padding of its own. A container (`prime-shell-footer`): BottomNav inside shows only while the panel is narrower than 640px.",
      ru: "Липкая нижняя полоса панели для `BottomNav`, без своих отступов. Контейнер: BottomNav внутри виден, пока панель уже 640px.",
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
          name: "nav",
          type: "ReactNode",
          en: "Navigation column content; without it the panel takes the full width.",
          ru: "Содержимое колонки навигации; без него панель на всю ширину.",
        },
        {
          name: "header",
          type: "ReactNode",
          en: "The top bar of the panel, an `AppHeader.Root`; no header when omitted.",
          ru: "Верхняя полоса панели — `AppHeader.Root`; без него шапки нет.",
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
  labels: [],
};
