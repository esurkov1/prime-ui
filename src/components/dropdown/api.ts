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
          type: '"auto" | "start" | "center" | "end"',
          default: '"auto"',
          en: "Alignment along the trigger. `auto` (default) lines the panel up with the trigger edge that has more room beyond it: a trigger near the end of the screen lines up its end edge and the panel grows toward the start, and the other way near the start; `start`, `center` or `end` fix it (still flipping at the screen edge).",
          ru: "Выравнивание по триггеру. `auto` (по умолчанию) выравнивает панель по тому краю триггера, за которым больше места: у триггера ближе к концу экрана — по концу, и панель растёт к началу, ближе к началу — наоборот; `start`, `center` или `end` задают край явно (у края экрана он всё равно переворачивается).",
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
      en: '`ref` → `HTMLButtonElement` (or the `asChild` element). A `<button role="menuitem">`; a click, Enter or Space runs `onSelect` and closes the menu. With a `Dropdown.ItemDescription` the label names the item and the description describes it (`aria-labelledby` / `aria-describedby`). + native button props.',
      ru: "Пункт меню: клик, Enter или Space выполняют `onSelect` и закрывают меню. С `Dropdown.ItemDescription` подпись — имя пункта, вторая строка — его описание.",
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
          name: "asChild",
          type: "boolean",
          default: "false",
          en: "The item is its single child, a link (`<a href>`, a router `Link`): the item props merge onto it, so Cmd / Ctrl-click and «open in a new tab» work; the pick still closes the menu. The link's children are the item content. Disabled: `aria-disabled`, the click is stopped.",
          ru: "Пункт — его единственный дочерний элемент-ссылка (`<a href>`, `Link` роутера): работают Cmd/Ctrl-клик и «открыть в новой вкладке», выбор закрывает меню. Неактивная ссылка не переходит.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`Dropdown.ItemIcon`, the label, `Dropdown.ItemDescription`, `Dropdown.ItemShortcut`; with `asChild` one link element holding them.",
          ru: "`Dropdown.ItemIcon`, подпись, `Dropdown.ItemDescription`, `Dropdown.ItemShortcut`; с `asChild` — одна ссылка с ними внутри.",
        },
      ],
    },
    {
      name: "Dropdown.CheckboxItem",
      en: '`ref` → `HTMLButtonElement`. A `<button role="menuitemcheckbox">` with `aria-checked`: the label (and an `ItemIcon`) on the left like any item, an accent check mark at the end while checked and nothing while not; a click, Enter or Space toggles it and the menu stays open. + native button props.',
      ru: "Пункт-переключатель: подпись (и `ItemIcon`) слева, как у обычного пункта, акцентная галочка в конце, пока он выбран, и пусто, пока нет; клик, Enter или Space переключают его, меню остаётся открытым.",
      props: [
        {
          name: "checked",
          type: "boolean",
          en: "Checked state (controlled).",
          ru: "Отмечен ли пункт (управляемо).",
        },
        {
          name: "defaultChecked",
          type: "boolean",
          default: "false",
          en: "Initial state (uncontrolled).",
          ru: "Начальное состояние (неуправляемо).",
        },
        {
          name: "onCheckedChange",
          type: "(checked: boolean) => void",
          en: "Called with the new state.",
          ru: "Вызывается с новым состоянием.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Muted, `aria-disabled`, skipped by the arrow keys, does not toggle.",
          ru: "Приглушён, `aria-disabled`, стрелки его пропускают, не переключается.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "The label (optionally after a `Dropdown.ItemIcon`).",
          ru: "Подпись (можно после `Dropdown.ItemIcon`).",
        },
      ],
    },
    {
      name: "Dropdown.ItemDescription",
      en: "`ref` → `HTMLSpanElement`. A muted second line under the item label: what the action does, or why a disabled item is unavailable («Доступно владельцу проекта»). Wraps instead of widening the menu past its limit; describes the item for assistive tech. + native `<span>` props except `id`.",
      ru: "Вторая строка пункта под подписью: что делает действие или почему пункт недоступен («Доступно владельцу проекта»). Переносится, не расширяя меню; описывает пункт для скринридера.",
      props: [],
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
