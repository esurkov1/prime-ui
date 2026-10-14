import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "AppHeader.Root",
      en: "`ref` → `HTMLElement`. The page's sticky `<header>` bar at the top of the content panel: only what the current page needs — its title, tools and own buttons. As high as the Sidebar brand row, lined up with the page. Icon buttons inside are `soft`, not `ghost`.",
      ru: "Липкая полоса `<header>` страницы вверху панели содержимого: только то, что нужно текущей странице, — её заголовок, инструменты и кнопки. Высотой со строку бренда Sidebar, выровнена со страницей. Иконочные кнопки — `soft`, не `ghost`.",
      props: [
        {
          name: "labels",
          type: "Partial<AppHeaderLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Встроенные строки, см. Labels.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children` (`AppHeader.Start`, `AppHeader.Actions`, `AppHeader.Tools`), `className` and the other attributes.",
          ru: "`children` (`AppHeader.Start`, `AppHeader.Actions`, `AppHeader.Tools`), `className` и остальные атрибуты.",
        },
      ],
    },
    {
      name: "AppHeader.Start",
      en: "`ref` → `HTMLDivElement`. The leading zone that takes the free width: the menu button, the path up (a Breadcrumb) and the title.",
      ru: "Начальная зона, забирает свободную ширину: кнопка меню, путь наверх (Breadcrumb) и заголовок.",
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
      name: "AppHeader.Title",
      en: "`ref` → `HTMLDivElement`. The page title: an optional `AppHeader.Icon`, the name (title-s, truncates) and an optional `AppHeader.Description` under it. The name is the page heading `<h1>`; the description stays outside its accessible name.",
      ru: "Заголовок страницы: необязательная `AppHeader.Icon`, название (title-s, обрезается) и под ним необязательное `AppHeader.Description`. Название — `<h1>` страницы; описание вне его доступного имени.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (the name, `AppHeader.Icon`, `AppHeader.Description` in any order), `className` and the other div attributes.",
          ru: "`children` (название, `AppHeader.Icon`, `AppHeader.Description` в любом порядке), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "AppHeader.Icon",
      en: "`ref` → `HTMLSpanElement`. Decorative glyph before the title (`aria-hidden`) on a tile shaped like the bar's soft buttons: control m square (36), its radius and the subtle fill.",
      ru: "Декоративная иконка перед названием (`aria-hidden`) на плитке в форме мягких кнопок шапки: квадрат контрола m (36), его радиус и мягкая заливка.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children` (an `Icon`), `className` and the other span attributes.",
          ru: "`children` (`Icon`), `className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "AppHeader.Description",
      en: "`ref` → `HTMLSpanElement`. Muted line under the title that carries data («128 в работе · 6 ждут оплаты», a status and a date); truncates on a narrow header, never hides.",
      ru: "Приглушённая строка под названием, которая несёт данные («128 в работе · 6 ждут оплаты», статус и срок); в узкой шапке обрезается, но не скрывается.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children`, `className` and the other span attributes.",
          ru: "`children`, `className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "AppHeader.Separator",
      en: "`ref` → `HTMLDivElement`. A short vertical `Divider` (20) between groups in a zone — the path and the title — with 16 of air on each side.",
      ru: "Короткий вертикальный `Divider` (20) между группами в зоне — путём и заголовком — с воздухом 16 с каждой стороны.",
      props: [
        {
          name: "…rest",
          type: 'Omit<DividerProps, "orientation" | "children">',
          en: "`className` and the other div attributes.",
          ru: "`className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "AppHeader.Tools",
      en: "`ref` → `HTMLDivElement`. The page's tools in the header (a `PageToolbar.Root`): the header's second row, full width under the title row, wherever it is written.",
      ru: "Инструменты страницы в шапке (`PageToolbar.Root`): вторая строка шапки во всю ширину под строкой заголовка, где бы она ни была написана.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (a `PageToolbar.Root`), `className` and the other div attributes.",
          ru: "`children` (`PageToolbar.Root`), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "AppHeader.Actions",
      en: "`ref` → `HTMLDivElement`. The trailing row of the page's own buttons in the title row (export, a more menu); the page's primary action goes into the PageToolbar in `AppHeader.Tools` when the page has tools. Never wraps.",
      ru: "Ряд собственных кнопок страницы в конце строки заголовка (экспорт, меню «ещё»); главное действие страницы с инструментами — в PageToolbar в `AppHeader.Tools`. Не переносится.",
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
      name: "AppHeader.MenuButton",
      en: "`ref` → `HTMLButtonElement`. A soft neutral icon `Button` named by `labels.menu` that opens the off-canvas Sidebar; wire `onClick` and `aria-expanded`.",
      ru: "Иконочная `Button` (soft, neutral) с именем из `labels.menu`, открывает Sidebar поверх страницы; передайте `onClick` и `aria-expanded`.",
      props: [
        {
          name: "show",
          type: '"narrow" | "always"',
          default: '"narrow"',
          en: '`narrow` — only below 768px, where a Sidebar with `offCanvas="auto"` leaves the layout; `always` — on every width (`offCanvas="always"`).',
          ru: '`narrow` — только уже 768px, где Sidebar с `offCanvas="auto"` уходит из раскладки; `always` — на любой ширине (`offCanvas="always"`).',
        },
        {
          name: "…rest",
          type: "ButtonHTMLAttributes<HTMLButtonElement>",
          en: "`onClick`, `aria-expanded`, `aria-label` (replaces `labels.menu`), `className` and the other button attributes.",
          ru: "`onClick`, `aria-expanded`, `aria-label` (заменяет `labels.menu`), `className` и остальные атрибуты кнопки.",
        },
      ],
    },
  ],
  labels: [
    {
      key: "menu",
      default: "Открыть меню",
      en: "Name of `AppHeader.MenuButton`.",
      ru: "Имя `AppHeader.MenuButton`.",
    },
  ],
};
