import type { PlaygroundApiPropRow } from "../components/PlaygroundApiTable";

function row(
  prop: string,
  type: string,
  defaultValue: string,
  description: string,
): PlaygroundApiPropRow {
  return { prop, type, defaultValue, required: "Нет", description };
}

const rest = (element: string, withRef = true) =>
  row(
    "…rest",
    element,
    "—",
    withRef ? "Атрибуты нативного элемента; `ref` пробрасывается." : "Атрибуты нативного элемента.",
  );

export const sidebarRootApiRows: PlaygroundApiPropRow[] = [
  row(
    "size",
    '"xs" | "s" | "m" | "l" | "xl"',
    '"m"',
    "Ярус пунктов: высота `--prime-control-<size>-height` (28–48), иконка и текст того же яруса.",
  ),
  row(
    "mode / defaultMode",
    '"expanded" | "compact" | "hidden"',
    '"expanded"',
    "Режим рельса на десктопе: 248 px, 56 px с подсказками, 0. Все переходы анимируют ширину.",
  ),
  row("onModeChange", "(mode: SidebarMode) => void", "—", "Смена режима (Toggle, `useSidebar`)."),
  row(
    "open / defaultOpen",
    "boolean",
    "false",
    "Выезжающая панель на узком экране (< 768 px). На десктопе не действует.",
  ),
  row("onOpenChange", "(open: boolean) => void", "—", "Открытие/закрытие выезжающей панели."),
  row(
    "responsive",
    "boolean",
    "true",
    "Ниже 768 px рельс уходит из раскладки в выезжающую панель: затемнение, ловушка фокуса, Escape.",
  ),
  row(
    "labels",
    "Partial<SidebarLabels>",
    '{ navigation: "Навигация", collapse: "Свернуть панель", expand: "Развернуть панель", close: "Закрыть навигацию" }',
    "Системные строки: имя `<nav>`, подписи Toggle, подпись затемнения.",
  ),
  rest("React.HTMLAttributes<HTMLDivElement>"),
];

export const sidebarRegionApiRows: PlaygroundApiPropRow[] = [
  row(
    "children",
    "React.ReactNode",
    "—",
    "`Header` — бренд; `Content` — прокручиваемая середина; `Footer` — нижние пункты и Toggle.",
  ),
  row(
    "…rest",
    "React.HTMLAttributes<HTMLDivElement>",
    "—",
    "Атрибуты нативного div; `ref` пробрасывается только у `Content`.",
  ),
];

export const sidebarGroupApiRows: PlaygroundApiPropRow[] = [
  row(
    "label",
    "React.ReactNode",
    "—",
    "Заголовок группы (`role=group` + `aria-labelledby`). В компактном режиме гаснет, остаётся отступ.",
  ),
  rest("React.HTMLAttributes<HTMLDivElement>", false),
];

export const sidebarItemApiRows: PlaygroundApiPropRow[] = [
  row(
    "children",
    "React.ReactNode",
    "—",
    "Подпись пункта; её текст — подсказка в компактном режиме.",
  ),
  row("icon", "React.ReactNode", "—", "Иконка слева; не сдвигается между режимами."),
  row(
    "badge",
    "React.ReactNode",
    "—",
    "Счётчик или статус; в компактном режиме — точка на иконке.",
  ),
  row("shortcut", "React.ReactNode", "—", "Подсказка клавиш (`Kbd`); в компактном режиме скрыта."),
  row(
    "active",
    "boolean",
    "false",
    'Текущая страница: `aria-current="page"`, `data-state="active"`. Ссылки роутера ставят `aria-current` сами.',
  ),
  row("disabled", "boolean", "false", "Недоступен: `disabled` / `aria-disabled`, `data-disabled`."),
  row("href", "string", "—", "Рендерит `<a>` вместо `<button>`."),
  row("target / rel", "string", "—", "Атрибуты ссылки при `href`."),
  row(
    "asChild",
    "boolean",
    "false",
    "Рендерит единственного ребёнка (например `NavLink`) как пункт; его дети становятся подписью.",
  ),
  rest("React.ButtonHTMLAttributes<HTMLButtonElement>"),
];

export const sidebarToggleApiRows: PlaygroundApiPropRow[] = [
  rest("React.ButtonHTMLAttributes<HTMLButtonElement>"),
];

export const sidebarUseSidebarApiRows: PlaygroundApiPropRow[] = [
  row("mode / setMode", "SidebarMode / (mode) => void", "—", "Режим рельса."),
  row("open / setOpen", "boolean / (open) => void", "—", "Выезжающая панель."),
  row("toggle", "() => void", "—", "То же, что делает `Sidebar.Toggle`."),
  row("isMobile", "boolean", "—", "Сайдбар сейчас выезжающий (responsive и < 768 px)."),
  row("size", "ControlSize", "—", "Ярус из Root."),
  row("navId", "string", "—", "id элемента `<nav>` (для `aria-controls` своей кнопки меню)."),
  row("labels", "SidebarLabels", "—", "Итоговые системные строки."),
];
