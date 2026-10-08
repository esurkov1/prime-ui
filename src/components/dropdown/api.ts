import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Dropdown.Root",
      en: "No DOM, no ref. Open state and dismiss policy.",
      ru: "Состояние открытия и политика закрытия; своего DOM нет.",
      props: [
        {
          name: "open",
          type: "boolean",
          en: "Controlled visibility; together with `onOpenChange`.",
          ru: "Управляемое открытие; вместе с `onOpenChange`.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          en: "Initial visibility, uncontrolled.",
          ru: "Начальное открытие без контроля.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          en: "Called on every open and close: trigger, item pick, Escape, outside press, code.",
          ru: "Вызывается при каждом открытии и закрытии: триггер, выбор пункта, Escape, клик снаружи, код.",
        },
        {
          name: "closeOnOutsideClick",
          type: "boolean",
          default: "true",
          en: "A pointerdown outside the menu and its trigger closes it; focus follows the pointer.",
          ru: "Нажатие вне меню и триггера закрывает его; фокус остаётся там, куда нажали.",
        },
        {
          name: "closeOnEscape",
          type: "boolean",
          default: "true",
          en: "Escape closes the menu and returns focus to the trigger.",
          ru: "Escape закрывает меню и возвращает фокус на триггер.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Trigger and Content.",
          ru: "Trigger и Content.",
        },
      ],
    },
    {
      name: "Dropdown.Trigger",
      en: 'No DOM: clones the single child, merges `ref` and `onClick` (toggles), sets `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`, `data-state`; the child\'s own `id` wins. Other props given to it (handlers, ARIA, `ref`) reach the child, so a wrapping `Tooltip.Trigger` keeps working.',
      ru: "Без DOM: клонирует дочерний элемент, открывает и закрывает меню, ставит ARIA.",
      props: [
        {
          name: "children",
          type: "ReactElement",
          required: true,
          en: "One element, usually a Button.",
          ru: "Один элемент, обычно Button.",
        },
      ],
    },
    {
      name: "Dropdown.Content",
      en: '`ref` → `HTMLDivElement`. Portal + `role="menu"` on the floating surface (a ScrollContainer), named by the trigger; renders while open and during its exit animation. Focus moves to the first item; Tab closes the menu and returns focus to the trigger. Below 640px of viewport the menu is a bottom sheet: a scrim, a grab handle, swipe down to close (with `closeOnOutsideClick`), page scroll locked.',
      ru: 'Портал и панель `role="menu"`; фокус на первом пункте, стрелки ходят по пунктам, Tab закрывает меню. Уже 640px экрана меню становится шторкой снизу: подложка, ручка, закрытие свайпом вниз (при `closeOnOutsideClick`), прокрутка страницы заблокирована.',
      props: [
        {
          name: "side",
          type: '"top" | "right" | "bottom" | "left"',
          default: '"bottom"',
          en: "Preferred side; flips to the opposite side when there is no room.",
          ru: "Желаемая сторона; при нехватке места меню переходит на противоположную.",
        },
        {
          name: "align",
          type: '"start" | "center" | "end"',
          default: '"start"',
          en: "Alignment along the trigger; shifts inside the viewport.",
          ru: "Выравнивание по триггеру; меню сдвигается в пределы экрана.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Row tier: item height, text and icon; key hints one tier down.",
          ru: "Ярус строк: высота пункта, текст и иконка; подсказки клавиш на ярус меньше.",
        },
        {
          name: "matchTriggerWidth",
          type: "boolean",
          default: "false",
          en: "The menu is at least as wide as the trigger.",
          ru: "Меню не уже триггера.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLElement>, "role">',
          en: "`className`, `onKeyDown` (runs before the arrow-key navigation) and the other attributes of the menu.",
          ru: "`className`, `onKeyDown` (до навигации стрелками) и остальные атрибуты меню.",
        },
      ],
    },
    {
      name: "Dropdown.Item",
      en: '`ref` → `HTMLButtonElement`. A `<button role="menuitem">`; a click, Enter or Space runs `onSelect` and closes the menu. + native button props.',
      ru: "Пункт меню: клик, Enter или Space выполняют `onSelect` и закрывают меню.",
      props: [
        {
          name: "onSelect",
          type: "() => void",
          en: "The action of the item.",
          ru: "Действие пункта.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Muted, `aria-disabled`, skipped by the arrow keys, does nothing on click.",
          ru: "Приглушён, `aria-disabled`, стрелки его пропускают, клик ничего не делает.",
        },
        {
          name: "tone",
          type: '"neutral" | "danger"',
          default: '"neutral"',
          en: "`danger`: destructive action — danger text, icon and hover fill.",
          ru: "`danger` — разрушительное действие: текст, иконка и подсветка в цвете опасности.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`Dropdown.ItemIcon`, the label, `Dropdown.ItemShortcut`.",
          ru: "`Dropdown.ItemIcon`, подпись, `Dropdown.ItemShortcut`.",
        },
      ],
    },
    {
      name: "Dropdown.ItemIcon · Dropdown.ItemShortcut",
      en: "`ref` → `HTMLSpanElement` / `HTMLElement` (the `<kbd>`). An `aria-hidden` `<span>` holding the leading glyph at the menu icon size (a kit `Icon` follows it) / a `Kbd` one tier below the menu, pushed to the end of the item — a hint, not a handler. + native props.",
      ru: "Иконка в начале пункта по размеру яруса меню / подсказка клавиш (Kbd) в конце пункта.",
      props: [],
    },
    {
      name: "Dropdown.Group",
      en: '`ref` → `HTMLDivElement`. `<div role="group">` named by its visible `label`. + native `<div>` props.',
      ru: "Группа пунктов с видимой подписью; подпись даёт группе имя.",
      props: [
        {
          name: "label",
          type: "ReactNode",
          en: "Heading of the group (caption, muted); also its accessible name.",
          ru: "Подпись группы (caption, приглушённая) и её доступное имя.",
        },
      ],
    },
    {
      name: "Dropdown.Separator",
      en: "`ref` → `HTMLDivElement`. A full-bleed Divider between items or groups.",
      ru: "Разделитель на всю ширину панели.",
      props: [
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other attributes of the divider.",
          ru: "`className` и остальные атрибуты разделителя.",
        },
      ],
    },
    {
      name: "Dropdown.Header · Dropdown.Title · Dropdown.Description",
      en: "`ref` → `HTMLDivElement`. A non-interactive row at the top (who is signed in, the plan): an avatar, Title + Description stacked in one column, a trailing badge or button — in the written order / the medium heading line / the muted line under it; both truncate. + native `<div>` props.",
      ru: "Неинтерактивная строка сверху: аватар, заголовок и описание одной колонкой, бейдж или кнопка в конце.",
      props: [],
    },
  ],
  labels: [],
};
