import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "AppHeader.Root",
      en: "`ref` → `HTMLElement`. The `<header>` bar at the top of the content panel: one row as high as the Sidebar brand row, on the panel surface with no divider, sticky with the top safe-area inset (static below 480px of viewport height); inline padding is the shell gutter, so it lines up with the page in main (16 outside a shell). Its controls are size `m`; icon buttons inside are `soft` (a light fill), not `ghost`. A container (`prime-app-header`): below 36rem the icon tile and the description go and the search folds into an icon.",
      ru: "Полоса `<header>` вверху панели содержимого: одна строка высотой со строку бренда Sidebar, на поверхности панели без разделителя, липкая с верхним безопасным отступом (не липнет при высоте экрана меньше 480px); боковые отступы — как у оболочки, шапка выровнена со страницей в main (16 вне оболочки). Контролы внутри — размера `m`; иконочные кнопки — `soft` (лёгкая заливка), не `ghost`. Контейнер: уже 36rem плитка иконки и описание скрываются, а поиск сворачивается в иконку.",
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
          en: "`children` (`AppHeader.Start`, `AppHeader.Search`, `AppHeader.Actions`, `AppHeader.Tools`), `className` and the other attributes.",
          ru: "`children` (`AppHeader.Start`, `AppHeader.Search`, `AppHeader.Actions`, `AppHeader.Tools`), `className` и остальные атрибуты.",
        },
      ],
    },
    {
      name: "AppHeader.Start",
      en: "`ref` → `HTMLDivElement`. The leading zone that takes the free width: the menu button, a back button, the title or a Breadcrumb.",
      ru: "Начальная зона, забирает свободную ширину: кнопка меню, кнопка «назад», заголовок или Breadcrumb.",
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
      en: '`ref` → `HTMLDivElement`. Where you are: an optional `AppHeader.Icon`, the name (title-s, truncates) and an optional `AppHeader.Description` under it — the anatomy of the Sidebar brand. By default not a heading (the page `<h1>` is PageContent.Title); `as="h1"` makes it the page heading when the page has no `PageContent.Header`.',
      ru: 'Где вы находитесь: необязательная `AppHeader.Icon`, название (title-s, обрезается) и под ним необязательное `AppHeader.Description` — как бренд в Sidebar. По умолчанию не заголовок (`<h1>` страницы — PageContent.Title); `as="h1"` делает его заголовком страницы, если у страницы нет `PageContent.Header`.',
      props: [
        {
          name: "as",
          type: '"span" | "h1"',
          default: '"span"',
          en: "Tag of the name. `h1`: the header carries the page title — only the name is the heading, the description stays outside its accessible name; the look does not change.",
          ru: "Тег названия. `h1`: шапка несёт заголовок страницы — заголовок только название, описание вне его доступного имени; вид не меняется.",
        },
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
      en: "`ref` → `HTMLSpanElement`. Muted caption under the title (a workspace, a period); hidden on a narrow header.",
      ru: "Приглушённая подпись под названием (рабочее пространство, период); скрыта в узкой шапке.",
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
      en: "`ref` → `HTMLDivElement`. A short vertical `Divider` (20) between groups in a zone — a back button and the path — with 16 of air on each side.",
      ru: "Короткий вертикальный `Divider` (20) между группами в зоне — кнопкой «назад» и путём — с воздухом 16 с каждой стороны.",
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
      name: "AppHeader.Search",
      en: '`ref` → `HTMLButtonElement`. The global search entry: a `<button type="button">` drawn as a field (search icon, placeholder text, key hint) that opens your CommandMenu. Below 36rem of header width it folds into a square button named by its text.',
      ru: "Вход в глобальный поиск: кнопка в виде поля (иконка поиска, текст-подсказка, клавиша), которая открывает ваш CommandMenu. Уже 36rem сворачивается в квадратную кнопку, названную своим текстом.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The placeholder text; also the accessible name.",
          ru: "Текст-подсказка; он же доступное имя.",
        },
        {
          name: "shortcut",
          type: "ReactNode",
          default: '"⌘K"',
          en: "The key hint at the end (a `Kbd`, hidden from assistive tech); `null` hides it. Bind the key yourself.",
          ru: "Подсказка клавиши в конце (`Kbd`, скрыт от скринридеров); `null` убирает её. Сочетание назначаете сами.",
        },
        {
          name: "…rest",
          type: "ButtonHTMLAttributes<HTMLButtonElement>",
          en: "`onClick`, `className` and the other button attributes.",
          ru: "`onClick`, `className` и остальные атрибуты кнопки.",
        },
      ],
    },
    {
      name: "AppHeader.Tools",
      en: "`ref` → `HTMLDivElement`. The page's tools in the header — a `PageToolbar.Root` with sections, the period, filters and the page's primary action: the header's second row, the full width under the title row (12 apart), sticky with it. Root moves it there wherever it is written, so the Tab order follows the rows; the toolbar lays itself out from this width (one row when wide, two when narrow).",
      ru: "Инструменты страницы в шапке — `PageToolbar.Root` с разделами, периодом, фильтрами и главным действием страницы: вторая строка шапки во всю ширину под строкой заголовка (зазор 12), липкая вместе с ней. Root ставит её туда, где бы она ни была написана, так что Tab идёт по строкам; панель раскладывается по этой ширине (одна строка на широкой, две на узкой).",
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
      en: "`ref` → `HTMLDivElement`. The trailing row of buttons: notifications, the account, one primary action. Never wraps.",
      ru: "Ряд кнопок в конце: уведомления, аккаунт, одно главное действие. Не переносится.",
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
