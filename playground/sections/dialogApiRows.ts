import type { PlaygroundApiPropRow } from "../components/PlaygroundApiTable";

/** API rows shared by Modal and Drawer: both are built from the same header / body / footer parts. */

const row = (
  prop: string,
  type: string,
  defaultValue: string,
  description: string,
  required = "Нет",
): PlaygroundApiPropRow => ({ prop, type, defaultValue, required, description });

export function dialogRootApiRows(name: "Modal" | "Drawer"): PlaygroundApiPropRow[] {
  return [
    row("open", "boolean", "—", "Контролируемое открытие; вместе с onOpenChange."),
    row("defaultOpen", "boolean", "false", "Начальное состояние в неконтролируемом режиме."),
    row(
      "onOpenChange",
      "(open: boolean) => void",
      "—",
      "Вызывается при каждом открытии и закрытии (триггер, крестик, Escape, подложка, код).",
    ),
    row("closeOnEscape", "boolean", "true", "Escape закрывает окно."),
    row(
      "closeOnOutsideClick",
      "boolean",
      "true",
      "Клик по подложке (в любом месте вне окна) закрывает его. false — для подтверждений удаления.",
    ),
    row(
      "labels",
      `Partial<${name}Labels>`,
      '{ close: "Закрыть" }',
      "Встроенные строки: aria-label кнопки закрытия в шапке.",
    ),
  ];
}

export const dialogSlotApiRows: PlaygroundApiPropRow[] = [
  row(
    "children",
    "React.ReactElement",
    "—",
    "Ровно один элемент; к его onClick добавляется действие (если обработчик не вызвал preventDefault).",
    "Да",
  ),
];

export const dialogHeaderApiRows: PlaygroundApiPropRow[] = [
  row("showClose", "boolean", "true", "Встроенная кнопка закрытия: квадратная ghost s."),
  row(
    "children",
    "React.ReactNode",
    "—",
    "Icon (уходит в левый слот), Title, Description. Иконка 40 px центрируется по блоку текста.",
  ),
];

export const dialogIconApiRows: PlaygroundApiPropRow[] = [
  row(
    "tone",
    '"neutral" | "accent" | "success" | "warning" | "danger" | "info"',
    '"neutral"',
    "Мягкая заливка плашки и цвет иконки (data-tone).",
  ),
  row("children", "React.ReactNode", "—", "Иконка 20 px.", "Да"),
  row("className", "string", "—", "Дополнительный класс плашки."),
];

export const dialogTextApiRows: PlaygroundApiPropRow[] = [
  row(
    "…rest",
    "HTMLAttributes",
    "—",
    "Title — h2 (title-m), Description — p (body-s, приглушённый). Их id подписывают диалог.",
  ),
];

export const dialogBodyApiRows: PlaygroundApiPropRow[] = [
  row(
    "…rest",
    "React.HTMLAttributes<HTMLDivElement>",
    "—",
    "Единственная прокручиваемая зона (ScrollContainer): отступы 20 сверху и снизу, шаг 16 между блоками.",
  ),
];

export function dialogFooterApiRows(defaultLayout: string): PlaygroundApiPropRow[] {
  return [
    row(
      "layout",
      '"fill" | "end"',
      defaultLayout,
      "fill — кнопки равной ширины в один ряд (зазор 12); end — по содержимому, справа (зазор 8). Уже 360 px — столбиком.",
    ),
    row(
      "children",
      "React.ReactNode",
      "—",
      "Действия в порядке DOM: вторичное, основное последним.",
    ),
  ];
}

export const dialogAriaApiRows: PlaygroundApiPropRow[] = [
  row(
    "aria-label / aria-labelledby / aria-describedby",
    "string",
    "—",
    "Имя диалога без Title или переопределение id заголовка и описания.",
  ),
  row("overlayClassName", "string", "—", "Класс на подложке."),
  row("…rest", "React.HTMLAttributes<HTMLDivElement>", "—", "Атрибуты элемента role=dialog."),
];
