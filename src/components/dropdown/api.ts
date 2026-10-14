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
          name: "anchorPoint",
          type: "{ x: number; y: number } | null",
          default: "null",
          en: "A point inside the trigger or `Dropdown.Anchor` (px from its top-left corner) the menu opens at: a context menu at the pointer. It moves with the element on scroll.",
          ru: "Точка внутри триггера или `Dropdown.Anchor` (px от левого верхнего угла), у которой открывается меню: контекстное меню у указателя. Двигается вместе с элементом при прокрутке.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Trigger (or Anchor) and Content.",
          ru: "Trigger (или Anchor) и Content.",
        },
      ],
    },
    {
      name: "Dropdown.Trigger · Dropdown.Anchor",
      en: "No DOM: clone the single child and merge `ref`. Trigger toggles the menu on a click, opens it on the arrow keys and sets its ARIA; Anchor only places the menu (a context menu with `anchorPoint`, opened through `open`) and names it.",
      ru: "Без DOM: клонируют единственный элемент и сливают `ref`. Trigger открывает и закрывает меню по клику, открывает стрелками и ставит ARIA; Anchor только задаёт место меню (контекстное меню с `anchorPoint`, открытие через `open`) и даёт ему имя.",
      props: [
        {
          name: "children",
          type: "ReactElement",
          required: true,
          en: "One element: usually a Button (Anchor: the row or list the context menu belongs to).",
          ru: "Один элемент: обычно Button (у Anchor — строка или список, к которым относится контекстное меню).",
        },
      ],
    },
    {
      name: "Dropdown.Content",
      en: '`ref` → `HTMLDivElement`. Portal + `role="menu"` floating panel that scrolls inside, named by the control it opened from; focus moves to the first enabled item. Below 640px of viewport it is a bottom sheet.',
      ru: 'Портал и плавающая панель `role="menu"` с прокруткой внутри; имя — контрол, из которого её открыли; фокус встаёт на первый доступный пункт. Уже 640px экрана меню становится шторкой снизу.',
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
          en: "Row tier: item height, text and icon; key hints one tier down. The menu's own: it does not follow the trigger's size.",
          ru: "Ярус строк: высота пункта, текст и иконка; подсказки клавиш на ярус меньше. Свой у меню: размер триггера на него не влияет.",
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
      en: '`ref` → `HTMLButtonElement` (or the `asChild` element). A `<button role="menuitem">`, no tab stop of its own (`tabIndex -1`, the arrow keys move between items); a click, Enter or Space runs `onSelect` and closes the menu.',
      ru: 'Пункт меню `<button role="menuitem">`, сам не точка Tab (`tabIndex -1`, между пунктами ходят стрелки); клик, Enter или Space выполняют `onSelect` и закрывают меню.',
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
          en: "Muted and `disabled` (a link item: `aria-disabled`), skipped by the arrow keys; no handler runs, the item's own `onClick` included.",
          ru: "Приглушён и `disabled` (пункт-ссылка — `aria-disabled`), стрелки его пропускают; не срабатывает ни один обработчик, включая собственный `onClick` пункта.",
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
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "role" | "onSelect">',
          en: "`className`, `onClick` (runs before `onSelect`; `preventDefault()` keeps the menu open) and the other attributes of the item.",
          ru: "`className`, `onClick` (до `onSelect`; `preventDefault()` оставляет меню открытым) и остальные атрибуты пункта.",
        },
      ],
    },
    {
      name: "Dropdown.CheckboxItem",
      en: '`ref` → `HTMLButtonElement`. A `<button role="menuitemcheckbox">` with `aria-checked` and a check mark at the end while checked; a click, Enter or Space toggles it and the menu stays open.',
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
          en: "Muted and `disabled`, skipped by the arrow keys; no handler runs, the item's own `onClick` included.",
          ru: "Приглушён и `disabled`, стрелки его пропускают; не срабатывает ни один обработчик, включая собственный `onClick` пункта.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "The label (optionally after a `Dropdown.ItemIcon`).",
          ru: "Подпись (можно после `Dropdown.ItemIcon`).",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "role" | "onSelect" | "onChange" | "defaultChecked">',
          en: "`className`, `onClick` (runs before the toggle; `preventDefault()` skips it) and the other attributes of the item.",
          ru: "`className`, `onClick` (до переключения; `preventDefault()` его отменяет) и остальные атрибуты пункта.",
        },
      ],
    },
    {
      name: "Dropdown.ItemDescription",
      en: "`ref` → `HTMLSpanElement`. A muted second line under the item label: what the action does, or why a disabled item is unavailable. Describes the item for assistive tech.",
      ru: "Приглушённая вторая строка пункта под подписью: что делает действие или почему пункт недоступен. Описывает пункт для скринридера.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The sentence; it wraps inside the menu's width.",
          ru: "Фраза; переносится в пределах ширины меню.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "id">',
          en: "`className` and the other attributes except `id` (the item points at it).",
          ru: "`className` и остальные атрибуты, кроме `id` (на него ссылается пункт).",
        },
      ],
    },
    {
      name: "Dropdown.ItemIcon",
      en: "`ref` → `HTMLSpanElement`. The `aria-hidden` leading glyph of an item at the menu icon size.",
      ru: "Иконка в начале пункта (`aria-hidden`) по размеру яруса меню.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`className`, `children` (the glyph) and the other attributes.",
          ru: "`className`, `children` (глиф) и остальные атрибуты.",
        },
      ],
    },
    {
      name: "Dropdown.ItemShortcut",
      en: "`ref` → `HTMLElement` (the `<kbd>`). A `Kbd` key hint at the end of the item, one tier below the menu — a hint, not a handler.",
      ru: "Подсказка клавиш (`Kbd`) в конце пункта, на ярус меньше меню — подсказка, не обработчик.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The keys («⌘D»).",
          ru: "Клавиши («⌘D»).",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLElement>, "children">',
          en: "`className` and the other attributes of the `<kbd>`.",
          ru: "`className` и остальные атрибуты `<kbd>`.",
        },
      ],
    },
    {
      name: "Dropdown.Group",
      en: '`ref` → `HTMLDivElement`. `<div role="group">` named by its visible `label`.',
      ru: 'Группа пунктов `<div role="group">` с видимой подписью `label`; подпись даёт группе имя.',
      props: [
        {
          name: "label",
          type: "ReactNode",
          en: "Heading of the group (caption, muted); also its accessible name.",
          ru: "Подпись группы (caption, приглушённая) и её доступное имя.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className`, `children` (the items) and the other attributes of the group.",
          ru: "`className`, `children` (пункты) и остальные атрибуты группы.",
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
      en: "`ref` → `HTMLDivElement`. A non-interactive row at the top (who is signed in, the plan): an avatar, Title + Description in one column, a trailing badge or button.",
      ru: "Неинтерактивная строка сверху (кто вошёл, тариф): аватар, заголовок и описание одной колонкой, бейдж или кнопка в конце.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className`, `children` and the other attributes of the `<div>`.",
          ru: "`className`, `children` и остальные атрибуты `<div>`.",
        },
      ],
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
        en: "On the trigger open the menu at its first item; in the menu move focus to the next / previous enabled item, wrapping.",
        ru: "На триггере открывают меню с фокусом на первом пункте; в меню переводят фокус на следующий / предыдущий доступный пункт по кругу.",
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
        en: 'The menu is `role="menu"` named by the control it opened from (the trigger, or the control inside `Dropdown.Anchor`), read from the page; items are `role="menuitem"`, checkbox items `role="menuitemcheckbox"` with `aria-checked`, disabled ones `disabled`. Items are no tab stops: one Tab leaves the menu.',
        ru: 'Меню — `role="menu"` с именем от контрола, из которого его открыли (триггер или контрол внутри `Dropdown.Anchor`), взятым со страницы; пункты — `role="menuitem"`, переключатели — `role="menuitemcheckbox"` с `aria-checked`, неактивные — `disabled`. Пункты — не точки Tab: один Tab выходит из меню.',
      },
      {
        en: 'The trigger gets `aria-haspopup="menu"`, `aria-expanded`, `data-state` and, while open, `aria-controls`; the child\'s own `id` wins. Other props given to `Dropdown.Trigger` (handlers, ARIA, `ref`) reach the child, so a wrapping `Tooltip.Trigger` keeps working.',
        ru: 'Триггер получает `aria-haspopup="menu"`, `aria-expanded`, `data-state`, а пока меню открыто — `aria-controls`; собственный `id` ребёнка сохраняется. Остальные пропсы `Dropdown.Trigger` (обработчики, ARIA, `ref`) доходят до ребёнка, поэтому обёртка `Tooltip.Trigger` продолжает работать.',
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
        ru: "Клик снаружи закрывает меню без возврата фокуса на триггер: фокус остаётся там, куда нажали (foundation §8).",
      },
    ],
  },
};
