import type { ComponentApi } from "../../../scripts/docs/componentApi";

const MODE = '"expanded" | "compact" | "hidden"';

const DIV_REST = {
  name: "…rest",
  type: "HTMLAttributes<HTMLDivElement>",
  en: "`children`, `className` and the other div attributes.",
  ru: "`children`, `className` и остальные атрибуты div.",
};

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
          en: "Item tier: height 28 · 32 · 36 · 40 · 48, text, icon; counters one tier down. The rail width does not change.",
          ru: "Ярус пунктов: высота 28 · 32 · 36 · 40 · 48, кегль, иконка; счётчики на ярус меньше. Ширина рельса не меняется.",
        },
        {
          name: "mode",
          type: MODE,
          en: "Desktop mode (controlled): full rail, icon rail with tooltips, or hidden.",
          ru: "Режим на десктопе (управляемый): полный рельс, рельс из иконок с подсказками или скрыт.",
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
          en: "Below 768px the rail leaves the layout and becomes an off-canvas panel with a scrim and a focus trap.",
          ru: "Уже 768px рельс уходит из раскладки и становится выезжающей панелью с подложкой и ловушкой фокуса.",
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
      en: "No ref. Brand row at the top; items and the Toggle at the bottom.",
      ru: "Строка бренда сверху; пункты и Toggle снизу.",
      props: [DIV_REST],
    },
    {
      name: "Sidebar.Content",
      en: "`forwardRef` → `HTMLElement`. The scrolling middle: a `ScrollContainer` with edge fades and no scrollbar.",
      ru: "Прокручиваемая середина: `ScrollContainer` с затуханием краёв и без скроллбара.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children` (Groups, Items), `className` and the other attributes.",
          ru: "`children` (группы, пункты), `className` и остальные атрибуты.",
        },
      ],
    },
    {
      name: "Sidebar.Group",
      en: 'No ref. `<div role="group">` named by its label.',
      ru: '`<div role="group">`, названная своей подписью.',
      props: [
        {
          name: "label",
          type: "ReactNode",
          en: "Group heading (`aria-labelledby`); fades out in compact mode and keeps its space.",
          ru: "Заголовок группы (`aria-labelledby`); в компактном режиме гаснет и сохраняет место.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "role">',
          en: "`children` (Items), `className` and the other div attributes.",
          ru: "`children` (пункты), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Sidebar.Item",
      en: '`forwardRef` → the rendered element. `<button type="button">`, `<a>` with `href`, or the single child with `asChild`; a tooltip with its label in compact mode.',
      ru: "Кнопка, ссылка при `href` или единственный дочерний элемент при `asChild`; в компактном режиме — подсказка с подписью.",
      props: [
        {
          name: "current",
          type: "boolean",
          default: "false",
          en: 'Current page: `aria-current="page"`, `data-state="active"`; surface fill and a raised shadow.',
          ru: 'Текущая страница: `aria-current="page"`, поверхность и приподнятая тень.',
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
          en: "Label (also the compact tooltip) and parts: `Sidebar.ItemIcon`, `Sidebar.ItemCount`, `Sidebar.ItemShortcut`.",
          ru: "Подпись (она же подсказка в компактном режиме) и части: `Sidebar.ItemIcon`, `Sidebar.ItemCount`, `Sidebar.ItemShortcut`.",
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
      en: "No ref. Leading icon (`aria-hidden`); stays in place in every mode.",
      ru: "Иконка перед подписью; не двигается ни в одном режиме.",
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
      en: "No ref. Counter `Badge` after the label; in compact mode a dot on the icon, and the number stays for screen readers.",
      ru: "Счётчик `Badge` после подписи; в компактном режиме — точка на иконке, число остаётся для скринридеров.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The number.",
          ru: "Число.",
        },
        {
          name: "className",
          type: "string",
          en: "Extra class on the Badge.",
          ru: "Дополнительный класс на Badge.",
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
      name: "Sidebar.Toggle",
      en: "`forwardRef` → `HTMLButtonElement`. Item-shaped toggle: expanded ↔ compact on desktop (hidden → expanded), closes the off-canvas panel; label, icon, `aria-expanded` and `aria-controls` come from state and `labels`.",
      ru: "Переключатель в виде пункта: развернуть ↔ компактный на десктопе, закрыть выезжающую панель; подпись и иконка — из состояния и `labels`.",
      props: [
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
