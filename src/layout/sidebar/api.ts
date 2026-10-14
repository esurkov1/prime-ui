import type { ComponentApi } from "../../../scripts/docs/componentApi";

const MODE = '"expanded" | "compact" | "hidden"';

const OPEN_TRIAD = (what: { en: string; ru: string }) => [
  {
    name: "open",
    type: "boolean",
    en: `${what.en} shown (controlled).`,
    ru: `${what.ru} показаны (управляемый режим).`,
  },
  {
    name: "onOpenChange",
    type: "(open: boolean) => void",
    en: "Called with the new open state (click, keyboard, a current page moving inside).",
    ru: "Вызывается с новым состоянием (клик, клавиатура, текущая страница внутри).",
  },
];

export const api: ComponentApi = {
  parts: [
    {
      name: "Sidebar.Root",
      en: "`forwardRef` → `HTMLDivElement`. The rail wrapper with the `<nav>` inside; owns the mode and the off-canvas panel and passes the tier to items.",
      ru: "Обёртка рельса с `<nav>` внутри: хранит режим и выезжающую панель, передаёт ярус пунктам.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Item tier: height 28 · 32 · 36 · 40 · 48, text, icon; counters and row actions one tier down. The rail width does not change.",
          ru: "Ярус пунктов: высота 28 · 32 · 36 · 40 · 48, кегль, иконка; счётчики и действия в строке на ярус меньше. Ширина рельса не меняется.",
        },
        {
          name: "mode",
          type: MODE,
          en: "Desktop mode (controlled): full rail, icon rail with tooltips and flyouts, or hidden.",
          ru: "Режим на десктопе (управляемый): полный рельс, рельс из иконок с подсказками и всплывающими панелями или скрыт.",
        },
        {
          name: "defaultMode",
          type: MODE,
          default: '"expanded"',
          en: "Initial mode (uncontrolled).",
          ru: "Начальный режим (неуправляемый).",
        },
        {
          name: "onModeChange",
          type: "(mode: SidebarMode) => void",
          en: "Called with the new mode (Toggle, `useSidebar().setMode`).",
          ru: "Вызывается с новым режимом (Toggle, `useSidebar().setMode`).",
        },
        {
          name: "open",
          type: "boolean",
          en: "Off-canvas panel on narrow viewports (controlled).",
          ru: "Выезжающая панель на узких экранах (управляемый режим).",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          en: "Initial off-canvas state (uncontrolled).",
          ru: "Начальное состояние панели (неуправляемый режим).",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          en: "Off-canvas open / close: Toggle, scrim, Escape, navigation, leaving the narrow viewport.",
          ru: "Открытие и закрытие панели: Toggle, подложка, Escape, переход, выход из узкого экрана.",
        },
        {
          name: "offCanvas",
          type: '"auto" | "always" | "never"',
          default: '"auto"',
          en: "When the rail becomes an off-canvas panel opened by `open`: `auto` — below 768px (viewport); `always` — at any width; `never` — always a rail.",
          ru: "Когда рельс становится выезжающей панелью, которую открывает `open`: `auto` — уже 768px (окно браузера); `always` — на любой ширине; `never` — всегда рельс.",
        },
        {
          name: "persistKey",
          type: "string",
          en: "`localStorage` key that keeps the mode and the open groups and sub-lists across reloads (keyed by `id`, else label text). Wins over `defaultMode` / `defaultOpen`.",
          ru: "Ключ `localStorage`, под которым режим и открытые группы и вложенные списки переживают перезагрузку (по `id`, иначе по тексту подписи). Главнее `defaultMode` / `defaultOpen`.",
        },
        {
          name: "labels",
          type: "Partial<SidebarLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Sidebar.Header · Sidebar.Footer",
      en: "`ref` → `HTMLDivElement`. Header: one fixed-height row for `Sidebar.Brand` and the header Toggle. Footer: items, the item Toggle and `Sidebar.Account` (set apart by air) at the bottom.",
      ru: "Header — строка фиксированной высоты для `Sidebar.Brand` и Toggle в шапке. Footer — пункты, Toggle-пункт и `Sidebar.Account` (отделён воздухом) внизу.",
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
      name: "Sidebar.Brand",
      en: "`forwardRef` → the rendered element. Product block: `Sidebar.BrandLogo`, the name and a muted line; an `<a>` with `href`, the single child with `asChild`, else a `<div>`. In compact mode only the logo stays.",
      ru: "Блок продукта: `Sidebar.BrandLogo`, название и приглушённая строка; ссылка при `href`, единственный дочерний элемент при `asChild`, иначе `<div>`. В компактном режиме остаётся логотип.",
      props: [
        {
          name: "description",
          type: "ReactNode",
          en: "Muted second line under the name (workspace, plan).",
          ru: "Приглушённая вторая строка под названием (пространство, тариф).",
        },
        {
          name: "href",
          type: "string",
          en: "Renders an `<a>` (usually home); navigating closes the off-canvas panel.",
          ru: "Рендерит `<a>` (обычно на главную); переход закрывает выезжающую панель.",
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          en: "Renders the single child (e.g. a router `Link`) as the brand; its children are the logo and the name.",
          ru: "Рендерит единственный дочерний элемент (например `Link`) как бренд; его дети — логотип и название.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`Sidebar.BrandLogo` and the product name.",
          ru: "`Sidebar.BrandLogo` и название продукта.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`onClick`, `aria-*`, `className` and the other attributes.",
          ru: "`onClick`, `aria-*`, `className` и остальные атрибуты.",
        },
      ],
    },
    {
      name: "Sidebar.BrandLogo",
      en: "`ref` → `HTMLSpanElement`. The product mark (`aria-hidden`): a square of the item height − 8 (at most 32) on the icon axis in every mode; its child fills it.",
      ru: "Знак продукта: квадрат высотой пункта − 8 (не больше 32) на оси иконок в любом режиме; дочерний элемент заполняет его.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The mark: `<img>`, `<svg>` or a styled element.",
          ru: "Знак: `<img>`, `<svg>` или свой элемент.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Sidebar.Content",
      en: "`forwardRef` → `HTMLElement`. The scrolling middle: a `ScrollContainer` with edge fades and no scrollbar; rows scrolled into view stop clear of the fades.",
      ru: "Прокручиваемая середина: `ScrollContainer` с затуханием краёв и без скроллбара; прокрученные в зону видимости пункты не уходят под затухание.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children` (Groups, Items, Subs), `className` and the other attributes.",
          ru: "`children` (группы, пункты, вложенные списки), `className` и остальные атрибуты.",
        },
      ],
    },
    {
      name: "Sidebar.Group",
      en: '`ref` → `HTMLDivElement`. `<div role="group">` named by its label. With `collapsible` the heading is a disclosure button that folds the items away; on the compact rail a folded group becomes one `…` row whose items open in a flyout.',
      ru: '`<div role="group">`, названная своей подписью. С `collapsible` заголовок — кнопка-раскрывашка, сворачивающая пункты; в компактном рельсе свёрнутая группа становится строкой `…`, пункты которой открываются во всплывающей панели.',
      props: [
        {
          name: "label",
          type: "ReactNode",
          en: "Group heading (`aria-labelledby`). Keep it to one short word: on the compact rail only its first letters show.",
          ru: "Заголовок группы (`aria-labelledby`). Одно короткое слово: в компактном рельсе видны только первые буквы.",
        },
        {
          name: "collapsible",
          type: "boolean",
          default: "false",
          en: "The heading shows and hides the items. Needs `label`.",
          ru: "Заголовок показывает и прячет пункты. Нужен `label`.",
        },
        ...OPEN_TRIAD({ en: "Items", ru: "Пункты" }),
        {
          name: "defaultOpen",
          type: "boolean",
          default: "true",
          en: "Initial state (uncontrolled). Off the compact rail a closed group opens by itself when the current page moves into it; on the rail it stays folded and its `…` row marks the page.",
          ru: "Начальное состояние (неуправляемый режим). Вне компактного рельса свёрнутая группа раскрывается сама, когда в неё попадает текущая страница; на рельсе остаётся свёрнутой, а страницу отмечает её строка `…`.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "role">',
          en: "`children` (Items, Subs), `className` and the other div attributes.",
          ru: "`children` (пункты, вложенные списки), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Sidebar.Item",
      en: '`forwardRef` → the rendered element. `<button type="button">`, `<a>` with `href`, or the single child with `asChild`; a tooltip with its label in compact mode. With `Sidebar.ItemAction` the element and the action sit side by side in a row `<div>`.',
      ru: "Кнопка, ссылка при `href` или единственный дочерний элемент при `asChild`; в компактном режиме — подсказка с подписью. С `Sidebar.ItemAction` элемент и действие стоят рядом в строке `<div>`.",
      props: [
        {
          name: "current",
          type: "boolean",
          default: "false",
          en: 'Current page: `aria-current="page"`, `data-state="active"`; a muted fill and primary text and icon colour.',
          ru: 'Текущая страница: `aria-current="page"`, `data-state="active"`; приглушённая заливка и основной цвет текста и иконки.',
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Not interactive: `disabled` / `aria-disabled`, `data-disabled`; a link loses its `href`.",
          ru: "Неактивный пункт: `disabled` / `aria-disabled`; ссылка теряет `href`.",
        },
        {
          name: "href",
          type: "string",
          en: "Renders an `<a>` (with `target`, `rel`).",
          ru: "Рендерит `<a>` (с `target`, `rel`).",
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          en: "Renders the single child (e.g. a router `NavLink`) as the item; its children are the label and parts.",
          ru: "Рендерит единственный дочерний элемент (например `NavLink`) как пункт; его дети — подпись и части.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Label (also the compact tooltip) and parts: `Sidebar.ItemIcon` (before the label — leading, after it — trailing), `Sidebar.ItemCount`, `Sidebar.ItemShortcut`, `Sidebar.ItemAction`.",
          ru: "Подпись (она же подсказка в компактном режиме) и части: `Sidebar.ItemIcon` (до подписи — ведущая, после — в конце), `Sidebar.ItemCount`, `Sidebar.ItemShortcut`, `Sidebar.ItemAction`.",
        },
        {
          name: "…rest",
          type: "ButtonHTMLAttributes<HTMLButtonElement>",
          en: "`onClick`, `aria-*`, `className` and the other attributes.",
          ru: "`onClick`, `aria-*`, `className` и остальные атрибуты.",
        },
      ],
    },
    {
      name: "Sidebar.ItemIcon",
      en: '`ref` → `HTMLSpanElement`. An icon (`aria-hidden`). Before the label it leads and stays on the icon axis in every mode; after the label it is a quiet trailing glyph (`data-edge="end"`, 14, muted), e.g. ↗ for an external link, hidden in compact mode.',
      ru: "Иконка. До подписи — ведущая, на оси иконок в любом режиме; после подписи — тихий знак в конце (14, приглушённый), например ↗ у внешней ссылки; в компактном режиме скрыт.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: 'The icon, e.g. `<Icon name="nav.home" />`; takes the item tier.',
          ru: 'Иконка, например `<Icon name="nav.home" />`; берёт ярус пункта.',
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Sidebar.ItemCount",
      en: "`ref` → `HTMLSpanElement` (the number or the Badge). A count after the label: a plain muted number by default; a `Badge` (one tier down) when `color` or `variant` is set — on the compact rail it becomes a dot of its hue.",
      ru: "Счётчик после подписи: по умолчанию простое приглушённое число; `Badge` (на ярус меньше), когда задан `color` или `variant`, — в компактном рельсе он становится точкой своего цвета.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The number (or a short status such as «!»).",
          ru: "Число (или короткий статус, например «!»).",
        },
        {
          name: "color",
          type: '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"',
          en: "Badge hue: the count needs attention.",
          ru: "Цвет бейджа: счётчик требует внимания.",
        },
        {
          name: "variant",
          type: '"solid" | "soft" | "outline"',
          en: "Badge treatment; `soft` once `color` is set.",
          ru: "Подача бейджа; `soft`, если задан только `color`.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children" | "color">',
          en: "`className` and the other attributes of the number or the Badge.",
          ru: "`className` и остальные атрибуты числа или Badge.",
        },
      ],
    },
    {
      name: "Sidebar.ItemShortcut",
      en: "`ref` → `HTMLSpanElement`. Key hint at the end (`aria-hidden`); hidden in compact mode.",
      ru: "Подсказка клавиш в конце; скрыта в компактном режиме.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "A key hint, e.g. `<Kbd>⌘K</Kbd>`.",
          ru: "Подсказка клавиш, например `<Kbd>⌘K</Kbd>`.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Sidebar.ItemAction",
      en: "`ref` → `HTMLButtonElement`. A row action (create, add): a ghost icon `Button` one tier down with a tooltip, next to the item element — never inside it. Shows on hover and focus of the row (always on touch); hidden on the compact rail.",
      ru: "Действие в строке (создать, добавить): призрачная кнопка-иконка `Button` на ярус меньше с подсказкой, рядом с элементом пункта — не внутри. Видно при наведении и фокусе строки (на сенсорных — всегда); в компактном рельсе скрыто.",
      props: [
        {
          name: "label",
          type: "string",
          required: true,
          en: "Accessible name and tooltip («Создать задачу»).",
          ru: "Доступное имя и подсказка («Создать задачу»).",
        },
        {
          name: "onClick",
          type: "(event: MouseEvent<HTMLButtonElement>) => void",
          required: true,
          en: "The action.",
          ru: "Действие.",
        },
        {
          name: "disabled",
          type: "boolean",
          en: "Not available.",
          ru: "Недоступно.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: 'The glyph; `<Icon name="action.add" />` by default.',
          ru: 'Знак; по умолчанию `<Icon name="action.add" />`.',
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick" | "aria-label">',
          en: "`className` and the other attributes of the Button.",
          ru: "`className` и остальные атрибуты Button.",
        },
      ],
    },
    {
      name: "Sidebar.Sub",
      en: "`ref` → `HTMLDivElement`. A parent item with child items: `Sidebar.SubTrigger` + `Sidebar.SubContent` in a `<div>`. Children unfold on a guide line, or in a flyout on the compact rail. A current child opens the sub-list and marks the parent (`data-active-path`).",
      ru: "Родительский пункт с дочерними: `Sidebar.SubTrigger` + `Sidebar.SubContent` в `<div>`. Дочерние раскрываются под родителем на направляющей линии, в компактном рельсе — во всплывающей панели. Текущий дочерний раскрывает список и отмечает родителя (`data-active-path`).",
      props: [
        ...OPEN_TRIAD({ en: "Children", ru: "Дочерние пункты" }),
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          en: "Initial state (uncontrolled). Opens by itself when a child becomes the current page.",
          ru: "Начальное состояние (неуправляемый режим). Раскрывается сам, когда дочерний пункт становится текущим.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Sidebar.SubTrigger",
      en: '`forwardRef` → `HTMLButtonElement`. The parent row: a disclosure `<button>` (`aria-expanded`, `aria-controls`) with a chevron at the end of the row. On the compact rail it opens the flyout (`aria-haspopup="dialog"`).',
      ru: 'Строка родителя: кнопка-раскрывашка (`aria-expanded`, `aria-controls`) с шевроном в конце строки. В компактном рельсе открывает всплывающую панель (`aria-haspopup="dialog"`).',
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "Label (it also names the flyout) and parts as in `Sidebar.Item`: `Sidebar.ItemIcon`, `Sidebar.ItemCount`.",
          ru: "Подпись (она же имя всплывающей панели) и части, как у `Sidebar.Item`: `Sidebar.ItemIcon`, `Sidebar.ItemCount`.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-expanded" | "aria-controls">',
          en: "`onClick` (runs first; `preventDefault()` stops the toggle), `disabled`, `className` and the other button attributes.",
          ru: "`onClick` (выполняется первым; `preventDefault()` отменяет раскрытие), `disabled`, `className` и остальные атрибуты кнопки.",
        },
      ],
    },
    {
      name: "Sidebar.SubContent",
      en: '`ref` → `HTMLDivElement`. `<div role="group">` named by the trigger: the child `Sidebar.Item`s on a faint guide line under the parent icon, labels aligned with the parent label. Height animates; closed content is inert. On the compact rail the same children render in the flyout.',
      ru: '`<div role="group">`, названная родителем: дочерние `Sidebar.Item` на тонкой направляющей под иконкой родителя, подписи выровнены по подписи родителя. Высота анимируется; свёрнутое содержимое inert. В компактном рельсе те же пункты рендерятся во всплывающей панели.',
      props: [
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "role">',
          en: "`children` (Items), `className` (on the list) and the other div attributes.",
          ru: "`children` (пункты), `className` (на списке) и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Sidebar.Account",
      en: "`forwardRef` → `HTMLButtonElement`. The signed-in person at the bottom of `Sidebar.Footer`: avatar, name, a muted line and a ↕ chevron. A button, so it is a `Dropdown.Trigger` child; in compact mode only the avatar stays, with the name as a tooltip.",
      ru: "Пользователь внизу `Sidebar.Footer`: аватар, имя, приглушённая строка и шеврон ↕. Это кнопка, поэтому её можно положить в `Dropdown.Trigger`; в компактном режиме остаётся аватар, имя — в подсказке.",
      props: [
        {
          name: "description",
          type: "ReactNode",
          en: "Muted second line under the name (email, role).",
          ru: "Приглушённая строка под именем (почта, роль).",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "An `Avatar.Root` (sized to the tier by the slot, hidden from screen readers) and the person's name.",
          ru: "`Avatar.Root` (размер задаёт слот по ярусу, скрыт от скринридеров) и имя.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">',
          en: "`onClick`, `aria-*`, `className` and the other button attributes.",
          ru: "`onClick`, `aria-*`, `className` и остальные атрибуты кнопки.",
        },
      ],
    },
    {
      name: "Sidebar.Toggle",
      en: "`forwardRef` → `HTMLButtonElement`. Toggle: expanded ↔ compact on desktop (hidden → expanded), closes the off-canvas panel; label, icon, `aria-expanded` and `aria-controls` come from state and `labels`.",
      ru: "Переключатель: развернуть ↔ компактный на десктопе, закрыть выезжающую панель; подпись и иконка — из состояния и `labels`.",
      props: [
        {
          name: "variant",
          type: '"item" | "header"',
          default: '"item"',
          en: "`item` — a row in the rail. `header` — an icon button «‹‹» at the end of `Sidebar.Header` that moves onto the rail edge in compact mode.",
          ru: "`item` — пункт в рельсе. `header` — кнопка-иконка «‹‹» в конце `Sidebar.Header`, в компактном режиме переезжает на кромку рельса.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label" | "aria-expanded" | "aria-controls">',
          en: "`onClick` (runs first; `preventDefault()` stops the toggle), `className` and the other button attributes.",
          ru: "`onClick` (выполняется первым; `preventDefault()` отменяет переключение), `className` и остальные атрибуты кнопки.",
        },
      ],
    },
    {
      name: "useSidebar()",
      en: "Hook for custom parts inside `Sidebar.Root` (throws outside). Returns the fields below.",
      ru: "Хук для своих частей внутри `Sidebar.Root` (вне него — ошибка). Возвращает поля ниже.",
      props: [
        {
          name: "mode · setMode",
          type: "SidebarMode · (mode: SidebarMode) => void",
          en: "Desktop mode.",
          ru: "Режим на десктопе.",
        },
        {
          name: "open · setOpen",
          type: "boolean · (open: boolean) => void",
          en: "Off-canvas panel.",
          ru: "Выезжающая панель.",
        },
        {
          name: "toggle",
          type: "() => void",
          en: "The action of `Sidebar.Toggle`.",
          ru: "Действие `Sidebar.Toggle`.",
        },
        {
          name: "offCanvas",
          type: "boolean",
          en: 'The sidebar is an off-canvas panel now (`offCanvas="always"`, or `"auto"` under 768px).',
          ru: 'Сейчас панель выезжающая (`offCanvas="always"` или `"auto"` уже 768px).',
        },
        {
          name: "size · navId · labels",
          type: "ControlSize · string · SidebarLabels",
          en: "Tier, id of the `<nav>` (for `aria-controls` on your own menu button), resolved strings.",
          ru: "Ярус, id `<nav>` (для `aria-controls` своей кнопки меню), строки.",
        },
      ],
    },
  ],
  labels: [
    {
      key: "navigation",
      default: "Навигация",
      en: "`aria-label` of the `<nav>`.",
      ru: "`aria-label` у `<nav>`.",
    },
    {
      key: "collapse",
      default: "Свернуть панель",
      en: "Toggle label while expanded.",
      ru: "Подпись Toggle в развёрнутом режиме.",
    },
    {
      key: "expand",
      default: "Развернуть панель",
      en: "Toggle label while compact or hidden.",
      ru: "Подпись Toggle в компактном или скрытом режиме.",
    },
    {
      key: "close",
      default: "Закрыть навигацию",
      en: "Toggle label off-canvas and the scrim label.",
      ru: "Подпись Toggle на узком экране и подложки.",
    },
  ],
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Moves focus through the items; a disabled or folded one is skipped.",
        ru: "Переводит фокус по пунктам; недоступный и свёрнутый пропускаются.",
      },
      {
        keys: "Enter · Space",
        en: "Opens the section, presses the item, opens or closes a group or a sub-list; on the compact rail opens the flyout (of a sub-list or a folded group) and focuses the first child.",
        ru: "Открывает раздел, нажимает кнопку пункта, сворачивает или разворачивает группу и вложенный список; в компактном рельсе открывает всплывающую панель (вложенного списка или свёрнутой группы) и ставит фокус на первый дочерний пункт.",
      },
      {
        keys: "ArrowRight · ArrowLeft",
        en: "On a parent item opens / closes the sub-list; on the compact rail → opens the flyout, ← in it returns focus to the parent.",
        ru: "На родительском пункте раскрывает и сворачивает вложенный список; в компактном рельсе → открывает панель, ← в панели возвращает фокус на родителя.",
      },
      {
        keys: "ArrowDown · ArrowUp · Home · End",
        en: "Move focus between the items of a compact flyout.",
        ru: "Переводят фокус по пунктам во всплывающей панели компактного рельса.",
      },
      {
        keys: "Escape",
        en: "Closes the flyout (focus returns to the parent) and the off-canvas panel on a narrow screen.",
        ru: "Закрывает всплывающую панель (фокус возвращается на родителя) и выезжающую панель на узком экране.",
      },
    ],
    aria: [
      {
        en: 'The panel is a `<nav>` named by `labels.navigation`; groups are `role="group"` named by their label.',
        ru: 'Панель — `<nav>` с именем из `labels.navigation`; группы — `role="group"` с подписью.',
      },
      {
        en: 'The current item has `aria-current="page"`; in compact mode the label shows as a tooltip, so icon-only items keep a visible name.',
        ru: 'Текущий пункт — `aria-current="page"`; в компактном режиме подпись видна как подсказка.',
      },
      {
        en: "A collapsible group heading and a SubTrigger are buttons with `aria-expanded` and `aria-controls`; folded content is `inert`.",
        ru: "Сворачиваемая группа и родительский пункт — кнопки с `aria-expanded` и `aria-controls`; свёрнутое содержимое `inert`.",
      },
      {
        en: 'On the compact rail a SubTrigger and the `…` row of a folded group have `aria-haspopup="dialog"`; the flyout is a non-modal dialog named by the parent (the `…` row by the group label).',
        ru: 'В компактном рельсе родительский пункт и строка `…` свёрнутой группы — `aria-haspopup="dialog"`; всплывающая панель названа ими.',
      },
      {
        en: "On the rail a collapsible group heading stays the same disclosure button (folding it there brings the `…` row); hovering it shows the whole name in a tooltip.",
        ru: "На рельсе заголовок сворачиваемой группы остаётся той же кнопкой-раскрывашкой (свёрнутая группа даёт строку `…`); при наведении подсказка показывает полное название.",
      },
      {
        en: "An attention dot is decorative: the count it stands for is read inside. On the compact rail a plain count leaves the row visually but stays readable by screen readers.",
        ru: "Точка внимания декоративна: счётчик, который она обозначает, читается внутри. На компактной полосе обычный счётчик уходит из строки визуально, но остаётся доступным скринридеру.",
      },
      {
        en: "In compact mode the brand's name fades out but still names the link.",
        ru: "В компактном режиме название бренда гаснет, но по-прежнему даёт имя ссылке.",
      },
      {
        en: "A row action is its own button next to the item (never nested), named by `label` with a tooltip.",
        ru: "Действие в строке — отдельная кнопка рядом с пунктом, с именем и подсказкой из `label`.",
      },
      {
        en: "The account avatar is hidden from screen readers; the name and the muted line name the button.",
        ru: "Аватар аккаунта скрыт от скринридеров; кнопку называют имя и приглушённая строка.",
      },
      {
        en: "Off-canvas: scrim, focus trap and Escape; the scrim is a button labelled `labels.close`.",
        ru: "Выезжающая панель: подложка, ловушка фокуса и Escape; подложка — кнопка с `labels.close`.",
      },
      {
        en: "Toggle: `aria-expanded`, `aria-controls` → nav, label from `labels`.",
        ru: "Toggle: `aria-expanded`, `aria-controls` на `<nav>`, подпись из `labels`.",
      },
    ],
  },
};
