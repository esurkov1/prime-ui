import type { PlaygroundApiPropRow } from "../components/PlaygroundApiTable";

const htmlDiv = "React.HTMLAttributes<HTMLDivElement>";
const htmlNav = "React.HTMLAttributes<HTMLElement>";
const htmlSpan = "React.HTMLAttributes<HTMLSpanElement>";
const htmlUl = "React.HTMLAttributes<HTMLUListElement>";
const htmlLi = "React.HTMLAttributes<HTMLLIElement>";
const htmlH2 = "React.HTMLAttributes<HTMLHeadingElement>";

function wrapRows(
  element: string,
  extra: PlaygroundApiPropRow[],
  notes?: string,
): PlaygroundApiPropRow[] {
  const base: PlaygroundApiPropRow[] = [
    {
      prop: "className",
      type: "string",
      defaultValue: "—",
      required: "Нет",
      description: "Дополнительный CSS-класс.",
    },
    {
      prop: "children",
      type: "React.ReactNode",
      defaultValue: "—",
      required: "Нет",
      description: notes ?? "Содержимое узла.",
    },
    {
      prop: "…rest",
      type: element,
      defaultValue: "—",
      required: "Нет",
      description: `Прочие атрибуты нативного элемента (${element}).`,
    },
  ];
  if (extra.length === 0) {
    return base;
  }
  return [base[0], ...extra, ...base.slice(1)];
}

export const sidebarRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Единый масштаб сайдбара: кнопки, текст, отступы, ширина панели.",
  },
  {
    prop: "state",
    type: '"expanded" | "compact" | "hidden"',
    defaultValue: "—",
    required: "Нет",
    description: "Контролируемое состояние панели (полная/компакт/скрыта).",
  },
  {
    prop: "defaultState",
    type: '"expanded" | "compact" | "hidden"',
    defaultValue: '"expanded" (на широком окне при responsive)',
    required: "Нет",
    description: "Начальное состояние; при responsive на узком окне стартует hidden.",
  },
  {
    prop: "onStateChange",
    type: "(state: SidebarLayoutMode) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается при переключении состояния панели.",
  },
  {
    prop: "open / defaultOpen / onOpenChange",
    type: "deprecated",
    defaultValue: "—",
    required: "Нет",
    description: "Legacy API для совместимости; рекомендуется state/defaultState/onStateChange.",
  },
  {
    prop: "responsive",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "При true — поведение для max-width 64rem: оверлей и плавающая кнопка.",
  },
  {
    prop: "sidebarSlot",
    type: '"page-nav"',
    defaultValue: "—",
    required: "Нет",
    description: "Режим вставки в колонку навигации рядом с контентом страницы.",
  },
  {
    prop: "aria-label",
    type: "string",
    defaultValue: '"Sidebar"',
    required: "Нет",
    description: "Подпись корневого aside для вспомогательных технологий.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс корня.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Обычно NavPanel и вложенные части.",
  },
  {
    prop: "…rest",
    type: "Omit<React.ComponentPropsWithoutRef<'aside'>, keyof SidebarRootProps>",
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты aside (id, role при необходимости и т.д.).",
  },
];

export const sidebarFooterApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "variant",
    type: '"plain" | "inset"',
    defaultValue: '"plain"',
    required: "Нет",
    description: "inset добавляет визуальный внутренний отступ (data-variant).",
  },
  ...wrapRows(htmlDiv, []),
];

export const sidebarIdentityButtonApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "leading",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Аватар, монограмма или иконка слева.",
  },
  {
    prop: "title",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Основная строка (рабочее пространство, пользователь).",
  },
  {
    prop: "subtitle",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Вторичная строка под title.",
  },
  {
    prop: "trailing",
    type: "React.ReactNode",
    defaultValue: "иконка ChevronsUpDown",
    required: "Нет",
    description: "Слот справа; по умолчанию стрелка раскрытия.",
  },
  {
    prop: "type",
    type: '"button" | "submit" | "reset"',
    defaultValue: '"button"',
    required: "Нет",
    description: "Тип кнопки.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Неактивное состояние.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс.",
  },
  {
    prop: "…rest",
    type: "Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>",
    defaultValue: "—",
    required: "Нет",
    description: "onClick, aria-label и прочие атрибуты (children не используется).",
  },
];

export const sidebarToggleButtonApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "placement",
    type: '"inline" | "edge"',
    defaultValue: '"inline"',
    required: "Нет",
    description:
      "В `NavPanel` кнопка уже встроена как `edge`. Компонент нужен для редкого `inline` или кастомного экземпляра.",
  },
  {
    prop: "openLabel",
    type: "string",
    defaultValue: '"Скрыть сайдбар"',
    required: "Нет",
    description: "aria-label при открытой панели.",
  },
  {
    prop: "closedLabel",
    type: "string",
    defaultValue: '"Открыть сайдбар"',
    required: "Нет",
    description: "aria-label при закрытой панели.",
  },
  {
    prop: "type",
    type: '"button" | "submit" | "reset"',
    defaultValue: '"button"',
    required: "Нет",
    description: "Тип кнопки.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс.",
  },
  {
    prop: "onClick",
    type: "React.MouseEventHandler<HTMLButtonElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается до toggleOpen, если не preventDefault.",
  },
  {
    prop: "…rest",
    type: "Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'>",
    defaultValue: "—",
    required: "Нет",
    description: "Прочие атрибуты кнопки; дочерние элементы не рендерятся.",
  },
];

export const sidebarMenuButtonApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "active",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Локально активный пункт (data-active).",
  },
  {
    prop: "asChild",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Слить стили меню с одним ребёнком (ссылка и т.п.).",
  },
  {
    prop: "type",
    type: '"button" | "submit" | "reset"',
    defaultValue: '"button"',
    required: "Нет",
    description: "Тип кнопки; при asChild не используется.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Неактивное состояние.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "MenuIcon, MenuLabel, MenuTrailing.",
  },
  {
    prop: "…rest",
    type: "React.ButtonHTMLAttributes<HTMLButtonElement>",
    defaultValue: "—",
    required: "Нет",
    description: "onClick и прочие атрибуты.",
  },
];

export const sidebarMenuLinkApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "active",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Передаётся в обёртку MenuButton как data-active.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс якоря.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Содержимое ссылки.",
  },
  {
    prop: "…rest",
    type: "React.AnchorHTMLAttributes<HTMLAnchorElement>",
    defaultValue: "—",
    required: "Нет",
    description: "href, target, rel и остальные атрибуты a.",
  },
];

export const sidebarMenuRouterLinkApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "to",
    type: "To (react-router-dom)",
    defaultValue: "—",
    required: "Да",
    description: "Путь маршрута; активное состояние по совпадению с URL.",
  },
  {
    prop: "className",
    type: "string | ((props: { isActive: boolean; isPending: boolean }) => string)",
    defaultValue: "—",
    required: "Нет",
    description: "Классы NavLink; базовые стили пункта меню добавляются всегда.",
  },
  {
    prop: "end",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Точное совпадение для активного класса (как у NavLink).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Подпись и при необходимости иконки внутри ссылки.",
  },
  {
    prop: "…rest",
    type: "Прочие пропсы NavLink (react-router-dom)",
    defaultValue: "—",
    required: "Нет",
    description: "replace, state и остальное из NavLink.",
  },
];

export const sidebarMenuActionApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "type",
    type: '"button" | "submit" | "reset"',
    defaultValue: '"button"',
    required: "Нет",
    description: "Тип компактной кнопки действия в строке меню.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Обычно иконка (три точки, звезда).",
  },
  {
    prop: "…rest",
    type: "React.ButtonHTMLAttributes<HTMLButtonElement>",
    defaultValue: "—",
    required: "Нет",
    description: "aria-label, onClick и прочие атрибуты.",
  },
];

export const sidebarMenuIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс span.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Иконка; корень с aria-hidden.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLSpanElement>, "children">',
    defaultValue: "—",
    required: "Нет",
    description: "Прочие атрибуты span.",
  },
];

export const sidebarTextApiRows: PlaygroundApiPropRow[] = wrapRows(
  htmlSpan,
  [],
  "Вторичный текст в панели.",
);

export const sidebarNavPanelApiRows: PlaygroundApiPropRow[] = wrapRows(
  htmlNav,
  [
    {
      prop: "showToggle",
      type: "boolean",
      defaultValue: "true",
      required: "Нет",
      description:
        'Встроенная кнопка на грани (`data-placement="edge"`). Состояние — через `Sidebar.Root` или `useSidebarContext`.',
    },
  ],
  "Основная панель навигации (nav).",
);

export const sidebarNavPanelBodyApiRows: PlaygroundApiPropRow[] = wrapRows(
  htmlDiv,
  [],
  "Прокручиваемое тело панели.",
);

export const sidebarNavDocTreeApiRows: PlaygroundApiPropRow[] = wrapRows(
  htmlDiv,
  [],
  "Дерево документации или вложенные оглавления.",
);

export const sidebarNavPanelHeadingApiRows: PlaygroundApiPropRow[] = wrapRows(
  htmlH2,
  [],
  "Заголовок панели.",
);

export const sidebarNavCategoryApiRows: PlaygroundApiPropRow[] = wrapRows(
  htmlDiv,
  [],
  "Группа сворачиваемого меню.",
);

export const sidebarNavCategoryTriggerApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "type",
    type: '"button" | "submit" | "reset"',
    defaultValue: '"button"',
    required: "Нет",
    description: "Тип кнопки раскрытия группы.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Обычно NavCategoryLabel и NavCategoryCount.",
  },
  {
    prop: "…rest",
    type: "React.ButtonHTMLAttributes<HTMLButtonElement>",
    defaultValue: "—",
    required: "Нет",
    description: "aria-expanded, onClick и прочие атрибуты кнопки.",
  },
];

export const sidebarNavCategoryLabelApiRows: PlaygroundApiPropRow[] = wrapRows(
  htmlSpan,
  [],
  "Текст заголовка группы.",
);

export const sidebarNavCategoryCountApiRows: PlaygroundApiPropRow[] = wrapRows(
  htmlSpan,
  [],
  "Счётчик или бейдж в группе.",
);

export const sidebarNavCategoryPanelApiRows: PlaygroundApiPropRow[] = wrapRows(
  htmlDiv,
  [],
  "Содержимое раскрытой группы.",
);

export const sidebarHeaderApiRows: PlaygroundApiPropRow[] = wrapRows(
  htmlDiv,
  [],
  "Верхняя хром панели.",
);

export const sidebarHeaderRowApiRows: PlaygroundApiPropRow[] = wrapRows(
  htmlDiv,
  [],
  "Строка шапки: основной блок и опционально дополнительные действия (переключатель встроен в NavPanel).",
);

export const sidebarHeaderMainApiRows: PlaygroundApiPropRow[] = wrapRows(
  htmlDiv,
  [],
  "Левая часть шапки (логотип, заголовок).",
);

export const sidebarContentApiRows: PlaygroundApiPropRow[] = wrapRows(
  htmlDiv,
  [],
  "Средняя зона между шапкой и подвалом.",
);

export const sidebarGroupApiRows: PlaygroundApiPropRow[] = wrapRows(
  htmlDiv,
  [],
  "Секция меню с подписью.",
);

export const sidebarGroupLabelApiRows: PlaygroundApiPropRow[] = wrapRows(
  htmlDiv,
  [],
  "Подпись группы пунктов.",
);

export const sidebarMenuApiRows: PlaygroundApiPropRow[] = wrapRows(
  htmlUl,
  [],
  "Список пунктов меню.",
);

export const sidebarMenuItemApiRows: PlaygroundApiPropRow[] = wrapRows(
  htmlLi,
  [],
  "Строка: MenuButton и опционально MenuAction.",
);

export const sidebarMenuLabelApiRows: PlaygroundApiPropRow[] = wrapRows(
  htmlSpan,
  [],
  "Текст пункта меню.",
);

export const sidebarMenuTrailingApiRows: PlaygroundApiPropRow[] = wrapRows(
  htmlSpan,
  [],
  "Контрастный хвост строки (счётчик); aria-hidden на корне.",
);

export const sidebarUseSidebarContextApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: "SidebarSize",
    defaultValue: "—",
    required: "—",
    description: "Текущий размер с Root.",
  },
  {
    prop: "side",
    type: '"left" | "right"',
    defaultValue: "—",
    required: "—",
    description: "Сторона размещения панели.",
  },
  {
    prop: "state / mode",
    type: "SidebarLayoutMode",
    defaultValue: "—",
    required: "—",
    description: "Текущее состояние панели.",
  },
  {
    prop: "setState / setMode",
    type: "(state: SidebarLayoutMode) => void",
    defaultValue: "—",
    required: "—",
    description: "Явно установить состояние панели.",
  },
  {
    prop: "open",
    type: "boolean",
    defaultValue: "—",
    required: "—",
    description: "Упрощённый флаг: state !== hidden.",
  },
  {
    prop: "setOpen",
    type: "(open: boolean) => void",
    defaultValue: "—",
    required: "—",
    description: "Преобразует boolean в expanded/hidden.",
  },
  {
    prop: "toggleOpen",
    type: "() => void",
    defaultValue: "—",
    required: "—",
    description: "Переключить open.",
  },
  {
    prop: "isMobile",
    type: "boolean",
    defaultValue: "—",
    required: "—",
    description: "Признак мобильного режима по media query.",
  },
  {
    prop: "navPanelId",
    type: "string",
    defaultValue: "—",
    required: "—",
    description: "Стабильный id панели для aria-controls у кнопок открытия.",
  },
];
