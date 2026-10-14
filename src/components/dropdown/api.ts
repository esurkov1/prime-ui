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
      en: "No DOM: clones the single child, merges `ref` and `onClick`; toggles the menu and sets its ARIA.",
      ru: "Без DOM: клонирует дочерний элемент, сливает `ref` и `onClick`; открывает и закрывает меню и ставит ARIA.",
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
      en: '`ref` → `HTMLDivElement`. Portal + `role="menu"` floating panel that scrolls inside, named by the trigger; focus moves to the first item. Below 640px of viewport it is a bottom sheet.',
      ru: 'Портал и плавающая панель `role="menu"` с прокруткой внутри, названная триггером; фокус встаёт на первый пункт. Уже 640px экрана меню становится шторкой снизу.',
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
          en: "Alignment along the trigger. `auto` lines the menu up with the trigger edge that has more room beyond it; `start`, `center` or `end` fix the edge.",
          ru: "Выравнивание по триггеру. `auto` выравнивает меню по краю триггера, за которым больше места; `start`, `center` или `end` задают край явно.",
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
      en: '`ref` → `HTMLButtonElement` (or the `asChild` element). A `<button role="menuitem">`; a click, Enter or Space runs `onSelect` and closes the menu. + native button props.',
      ru: 'Пункт меню `<button role="menuitem">`: клик, Enter или Space выполняют `onSelect` и закрывают меню.',
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
          en: "The item is its single child link (`<a href>`, a router `Link`), so Cmd / Ctrl-click and «open in a new tab» work; the pick still closes the menu.",
          ru: "Пункт — его единственный дочерний элемент-ссылка (`<a href>`, `Link` роутера): работают Cmd/Ctrl-клик и «открыть в новой вкладке»; выбор закрывает меню.",
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
      en: '`ref` → `HTMLButtonElement`. A `<button role="menuitemcheckbox">` with `aria-checked` and a check mark at the end while checked; a click, Enter or Space toggles it and the menu stays open. + native button props.',
      ru: 'Пункт-переключатель `<button role="menuitemcheckbox">` с `aria-checked` и галочкой в конце, пока он выбран; клик, Enter или Space переключают его, меню остаётся открытым.',
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
      en: "`ref` → `HTMLSpanElement`. A muted second line under the item label: what the action does, or why a disabled item is unavailable. Describes the item for assistive tech. + native `<span>` props except `id`.",
      ru: "Приглушённая вторая строка пункта под подписью: что делает действие или почему пункт недоступен. Описывает пункт для скринридера.",
      props: [],
    },
    {
      name: "Dropdown.ItemIcon · Dropdown.ItemShortcut",
      en: "`ref` → `HTMLSpanElement` / `HTMLElement` (the `<kbd>`). The `aria-hidden` leading glyph at the menu icon size / a `Kbd` key hint at the end of the item — a hint, not a handler. + native props.",
      ru: "Иконка в начале пункта (`aria-hidden`) по размеру яруса меню / подсказка клавиш (`Kbd`) в конце пункта — подсказка, не обработчик.",
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
      en: "`ref` → `HTMLDivElement`. A non-interactive row at the top (who is signed in, the plan): an avatar, Title + Description in one column, a trailing badge or button. + native `<div>` props.",
      ru: "Неинтерактивная строка сверху (кто вошёл, тариф): аватар, заголовок и описание одной колонкой, бейдж или кнопка в конце.",
      props: [],
    },
  ],
  labels: [],
  accessibility: {
    keyboard: [
      {
        keys: "Enter · Space",
        en: "On the trigger opens the menu (focus on the first item); on an item runs it and returns focus to the trigger; on a checkbox item toggles it and the menu stays open.",
        ru: "На триггере открывает меню (фокус на первом пункте); на пункте выполняет его и возвращает фокус на триггер; на пункте-переключателе переключает его, меню остаётся открытым.",
      },
      {
        keys: "ArrowDown · ArrowUp",
        en: "Move focus to the next / previous enabled item, wrapping.",
        ru: "Переводят фокус на следующий / предыдущий доступный пункт по кругу.",
      },
      {
        keys: "Home · End",
        en: "First / last enabled item.",
        ru: "Первый / последний доступный пункт.",
      },
      {
        keys: "Escape",
        en: "Closes the menu (`closeOnEscape`); focus returns to the trigger.",
        ru: "Закрывает меню (`closeOnEscape`); фокус возвращается на триггер.",
      },
      {
        keys: "Tab · Shift+Tab",
        en: "Closes the menu; focus returns to the trigger (Tab then goes on to the next stop).",
        ru: "Закрывает меню; фокус возвращается на триггер (Tab затем идёт дальше).",
      },
    ],
    aria: [
      {
        en: 'The menu is `role="menu"` named by the trigger; items are `role="menuitem"`, checkbox items `role="menuitemcheckbox"` with `aria-checked`, disabled ones `aria-disabled`.',
        ru: 'Меню — `role="menu"` с именем от триггера; пункты — `role="menuitem"`, переключатели — `role="menuitemcheckbox"` с `aria-checked`, неактивные — `aria-disabled`.',
      },
      {
        en: 'The trigger gets `aria-haspopup="menu"`, `aria-expanded`, `aria-controls` and `data-state`; the child\'s own `id` wins. Other props given to `Dropdown.Trigger` (handlers, ARIA, `ref`) reach the child, so a wrapping `Tooltip.Trigger` keeps working.',
        ru: 'Триггер получает `aria-haspopup="menu"`, `aria-expanded` и `aria-controls`.',
      },
      {
        en: "With a `Dropdown.ItemDescription` the label names the item (`aria-labelledby`) and the description describes it (`aria-describedby`).",
        ru: "С `Dropdown.ItemDescription` подпись называет пункт (`aria-labelledby`), а описание описывает его (`aria-describedby`).",
      },
      {
        en: "An `asChild` item merges its props onto the link; the link's children are the item content. A disabled link item gets `aria-disabled` and its click is stopped.",
        ru: "Пункт с `asChild` переносит свои пропсы на ссылку; дети ссылки — содержимое пункта. Неактивный пункт-ссылка получает `aria-disabled`, его клик останавливается.",
      },
      {
        en: '`Dropdown.Group` is `role="group"` named by its `label`.',
        ru: '`Dropdown.Group` — `role="group"` с именем из `label`.',
      },
      {
        en: "`Dropdown.ItemIcon` is hidden from screen readers; a key hint is text only — the app handles the shortcut.",
        ru: "`Dropdown.ItemIcon` скрыт от скринридеров; подсказка клавиш — только текст, обработчик пишет приложение.",
      },
      {
        en: "An outside press closes the menu without moving focus back to the trigger: focus follows the pointer (foundation §8).",
        ru: "Клик снаружи закрывает меню без возврата фокуса на триггер: фокус остаётся там, куда нажали.",
      },
    ],
  },
};
