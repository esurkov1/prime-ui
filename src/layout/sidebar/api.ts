import type { ComponentApi } from "../../../scripts/docs/componentApi";

const MODE = '"expanded" | "compact" | "hidden"';

const DIV_REST = {
  name: "…rest",
  type: "HTMLAttributes<HTMLDivElement>",
  en: "`children`, `className` and the other div attributes.",
  ru: "`children`, `className` и остальные атрибуты div.",
};

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
          name: "responsive",
          type: "boolean",
          default: "true",
          en: "Below 768px (viewport) the rail leaves the layout and becomes an off-canvas panel with a scrim and a focus trap.",
          ru: "Уже 768px (окно браузера) рельс уходит из раскладки и становится выезжающей панелью с подложкой и ловушкой фокуса.",
        },
        {
          name: "labels",
          type: "Partial<SidebarLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        DIV_REST,
      ],
    },
    {
      name: "Sidebar.Header · Sidebar.Footer",
      en: "No ref. Header: one fixed-height row for `Sidebar.Brand` and the header Toggle. Footer: items, the item Toggle and `Sidebar.Account` (set apart by air) at the bottom.",
      ru: "Header — строка фиксированной высоты для `Sidebar.Brand` и Toggle в шапке. Footer — пункты, Toggle-пункт и `Sidebar.Account` (отделён воздухом) внизу.",
      props: [DIV_REST],
    },
    {
      name: "Sidebar.Brand",
      en: "`forwardRef` → the rendered element. Product block: `Sidebar.BrandLogo`, the name and a muted line; an `<a>` with `href`, the single child with `asChild`, else a `<div>`. In compact mode only the logo stays (a link shows its name as a tooltip).",
      ru: "Блок продукта: `Sidebar.BrandLogo`, название и приглушённая строка; ссылка при `href`, единственный дочерний элемент при `asChild`, иначе `<div>`. В компактном режиме остаётся логотип (у ссылки — подсказка с названием).",
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
      en: "No ref. The product mark (`aria-hidden`): a square of the item height − 8 (at most 32) on the icon axis in every mode; its child fills it.",
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
      en: 'No ref. `<div role="group">` named by its label. With `collapsible` the heading is a disclosure button (`aria-expanded`, `aria-controls`) with a chevron at its end; the items fold away (inert). On the compact rail headings fold and the items always show.',
      ru: '`<div role="group">`, названная своей подписью. С `collapsible` заголовок — кнопка-раскрывашка (`aria-expanded`, `aria-controls`) с шевроном в конце; пункты сворачиваются (inert). В компактном рельсе заголовков нет, пункты видны всегда.',
      props: [
        {
          name: "label",
          type: "ReactNode",
          en: "Group heading (`aria-labelledby`); folds away in compact mode.",
          ru: "Заголовок группы (`aria-labelledby`); в компактном режиме сворачивается.",
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
          en: "Initial state (uncontrolled). A closed group opens by itself when the current page moves into it.",
          ru: "Начальное состояние (неуправляемый режим). Свёрнутая группа раскрывается сама, когда в неё попадает текущая страница.",
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
          en: 'Current page: `aria-current="page"`, `data-state="active"`; surface fill and a raised shadow (a deeper wash in a flyout).',
          ru: 'Текущая страница: `aria-current="page"`, поверхность и приподнятая тень (во всплывающей панели — более плотная заливка).',
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
      en: 'No ref. An icon (`aria-hidden`). Before the label it leads and stays on the icon axis in every mode; after the label it is a quiet trailing glyph (`data-edge="end"`, 14, muted), e.g. ↗ for an external link, hidden in compact mode.',
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
      en: "No ref. A count after the label: a plain muted number by default; a `Badge` (one tier down) when `color` or `variant` is set. In compact mode the number leaves the row (still read by screen readers) and a badge leaves a dot of its hue on the icon.",
      ru: "Счётчик после подписи: по умолчанию простое приглушённое число; `Badge` (на ярус меньше), когда задан `color` или `variant`. В компактном режиме число уходит из строки (остаётся для скринридеров), а бейдж оставляет на иконке точку своего цвета.",
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
          name: "className",
          type: "string",
          en: "Extra class on the number or the Badge.",
          ru: "Дополнительный класс на числе или Badge.",
        },
      ],
    },
    {
      name: "Sidebar.ItemShortcut",
      en: "No ref. Key hint at the end (`aria-hidden`); hidden in compact mode.",
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
          name: "className",
          type: "string",
          en: "Extra class.",
          ru: "Дополнительный класс.",
        },
      ],
    },
    {
      name: "Sidebar.ItemAction",
      en: "No ref. A row action (create, add): a ghost icon `Button` one tier down with a tooltip, next to the item element — never inside it. It shows on hover and focus of the row while the trail (count, hint) steps aside; hidden on the compact rail.",
      ru: "Действие в строке (создать, добавить): призрачная кнопка-иконка `Button` на ярус меньше с подсказкой, рядом с элементом пункта — не внутри. Появляется при наведении и фокусе строки, счётчик отодвигается; в компактном рельсе скрыто.",
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
          name: "className",
          type: "string",
          en: "Extra class on the Button.",
          ru: "Дополнительный класс на Button.",
        },
      ],
    },
    {
      name: "Sidebar.Sub",
      en: "No ref. A parent item with child items: `Sidebar.SubTrigger` + `Sidebar.SubContent` in a `<div>`. Expanded, the children unfold under the parent on a guide line; on the compact rail they open in a flyout (the kit Popover, to the right). A current child opens the sub-list and marks the parent as on the active path (`data-active-path`).",
      ru: "Родительский пункт с дочерними: `Sidebar.SubTrigger` + `Sidebar.SubContent` в `<div>`. В развёрнутом режиме дочерние раскрываются под родителем на направляющей линии; в компактном рельсе — во всплывающей панели справа (Popover из кита). Текущий дочерний раскрывает список и отмечает родителя как путь к текущей странице (`data-active-path`).",
      props: [
        ...OPEN_TRIAD({ en: "Children", ru: "Дочерние пункты" }),
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          en: "Initial state (uncontrolled). Opens by itself when a child becomes the current page.",
          ru: "Начальное состояние (неуправляемый режим). Раскрывается сам, когда дочерний пункт становится текущим.",
        },
        DIV_REST,
      ],
    },
    {
      name: "Sidebar.SubTrigger",
      en: '`forwardRef` → `HTMLButtonElement`. The parent row: a disclosure `<button>` (`aria-expanded`, `aria-controls`) with a chevron at the end of the row. Expanded: click, `→` / `←` open and close. Compact: hover (after a short intent delay), click, `Enter` · `Space` · `→` open the flyout (`aria-haspopup="dialog"`); on the active path it takes the current lift.',
      ru: "Строка родителя: кнопка-раскрывашка (`aria-expanded`, `aria-controls`) с шевроном в конце строки. В развёрнутом режиме клик и `→` / `←` раскрывают и сворачивают. В компактном наведение (после короткой задержки), клик, `Enter` · `Space` · `→` открывают всплывающую панель; на пути к текущей странице пункт приподнят.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "Label (also the flyout title) and parts as in `Sidebar.Item`: `Sidebar.ItemIcon`, `Sidebar.ItemCount`.",
          ru: "Подпись (она же заголовок всплывающей панели) и части, как у `Sidebar.Item`: `Sidebar.ItemIcon`, `Sidebar.ItemCount`.",
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
      en: 'No ref. `<div role="group">` named by the trigger: the child `Sidebar.Item`s on a faint guide line under the parent icon, labels aligned with the parent label. Height animates; closed content is inert. On the compact rail the same children render in the flyout.',
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
          en: "`item` — a row in the rail. `header` — an icon button «‹‹» at the end of `Sidebar.Header`; in compact mode the same button moves onto the rail's outer edge, shrinks and turns round, and its chevrons turn to point out. Off-canvas it stays in the header and closes the panel.",
          ru: "`item` — пункт в рельсе. `header` — кнопка-иконка «‹‹» в конце `Sidebar.Header`; в компактном режиме та же кнопка переезжает на внешнюю кромку рельса, уменьшается и становится круглой, шевроны разворачиваются наружу. На узком экране остаётся в шапке и закрывает панель.",
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
          name: "isMobile",
          type: "boolean",
          en: "The sidebar is off-canvas now (responsive and under 768px).",
          ru: "Сейчас панель выезжающая (responsive и уже 768px).",
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
};
