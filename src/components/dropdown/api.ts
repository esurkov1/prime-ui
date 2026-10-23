import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { DROPDOWN_LABELS } from "./Dropdown";

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
          name: "labels",
          type: "Partial<DropdownLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
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
      en: '`ref` → `HTMLDivElement`. Portal + `role="menu"` floating panel that scrolls inside, named by the control it opened from; focus moves to the first enabled item (or to a `Dropdown.Search`, the menu then under it). Below 640px of viewport it is a bottom sheet.',
      ru: 'Портал и плавающая панель `role="menu"` с прокруткой внутри; имя — контрол, из которого её открыли; фокус встаёт на первый доступный пункт (или в `Dropdown.Search`, меню тогда под ним). Уже 640px экрана меню становится шторкой снизу.',
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
          en: "Menu tier: the rows stand a tier below it (an `m` menu has `s` rows, 32). The menu's own: it does not follow the trigger's size.",
          ru: "Ярус меню: строки стоят на ярус ниже (у меню `m` строки `s`, 32). Свой у меню: размер триггера на него не влияет.",
        },
        {
          name: "width",
          type: '"auto" | "s" | "m" | "l"',
          default: '"auto"',
          en: "`auto`: the content's width between `--prime-panel-min-width` and twice that. `s`, `m`, `l`: a fixed 1.5, 2 or 2.5 panel minimums within the viewport, labels truncate (threads, projects).",
          ru: "`auto` — ширина содержимого от `--prime-panel-min-width` до двойной. `s`, `m`, `l` — постоянные 1,5, 2 или 2,5 минимума панели в пределах экрана, подписи обрезаются (чаты, проекты).",
        },
        {
          name: "maxRows",
          type: "number",
          en: "The height of about this many item rows (a search row on top), then the list scrolls; without it `--prime-panel-max-height`. Never more than the room at the trigger; a bottom sheet uses its own.",
          ru: "Высота примерно в столько строк пунктов (строка поиска — сверх них), дальше прокрутка; без него — `--prime-panel-max-height`. Не больше места у триггера; шторка снизу — своя высота.",
        },
        {
          name: "matchTriggerWidth",
          type: "boolean",
          default: "false",
          en: "The menu is at least as wide as the trigger (with `width`, too).",
          ru: "Меню не уже триггера (и с `width`).",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLElement>, "role">',
          en: "`className`, `onKeyDown` (runs before the arrow-key navigation) and the other attributes of the menu (with a search: of the panel).",
          ru: "`className`, `onKeyDown` (до навигации стрелками) и остальные атрибуты меню (с поиском — панели).",
        },
      ],
    },
    {
      name: "Dropdown.Search",
      en: '`ref` → `HTMLInputElement`. The search row, first in `Dropdown.Content`: `<input type="search">` controlling the menu. Focus stays in it while the arrows move the highlight; items filter by label, description and `keywords`, empty groups hide; the query clears on opening.',
      ru: 'Строка поиска, первая в `Dropdown.Content`: `<input type="search">`, управляющее меню. Фокус остаётся в поле, стрелки двигают подсветку; пункты фильтруются по подписи, описанию и `keywords`, пустые группы скрываются; запрос сбрасывается при открытии.',
      props: [
        {
          name: "placeholder",
          type: "string",
          default: "labels.search",
          en: "Placeholder; the default accessible name comes from `labels.search` too.",
          ru: "Плейсхолдер; имя поля по умолчанию — тоже `labels.search`.",
        },
        {
          name: "…rest",
          type: 'Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "role" | "value" | "defaultValue">',
          en: "`className`, `onChange`, `onKeyDown` (runs before the highlight moves) and the other input attributes except `value` / `defaultValue`.",
          ru: "`className`, `onChange`, `onKeyDown` (до перемещения подсветки) и остальные атрибуты input, кроме `value` / `defaultValue`.",
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
          name: "selected",
          type: "boolean",
          en: 'A choice of one (a person, a status): the item becomes `role="menuitemradio"` with `aria-checked`, the chosen one gets a check at the end. Set it on every item of the choice.',
          ru: 'Выбор одного (человек, статус): пункт становится `role="menuitemradio"` с `aria-checked`, у выбранного — галочка в конце. Ставится на все пункты выбора.',
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
          name: "keywords",
          type: "string",
          en: "With `Dropdown.Search`: extra words the query also matches (a client's name, an English title).",
          ru: "С `Dropdown.Search`: дополнительные слова, по которым тоже ищет запрос (имя клиента, английское название).",
        },
        {
          name: "persistent",
          type: "boolean",
          default: "false",
          en: "With `Dropdown.Search`: shown whatever the query and never counted as a match (the empty state still shows) — an action above the list («Новый чат»). The highlight goes to it only when nothing matches.",
          ru: "С `Dropdown.Search`: виден при любом запросе и не считается совпадением (пустое состояние всё равно показывается) — действие над списком («Новый чат»). Подсветка встаёт на него, только если ничего не найдено.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`Dropdown.ItemIcon`, the label, `Dropdown.ItemDescription`, `Dropdown.ItemMeta`, `Dropdown.ItemShortcut`; with `asChild` one link element holding them.",
          ru: "`Dropdown.ItemIcon`, подпись, `Dropdown.ItemDescription`, `Dropdown.ItemMeta`, `Dropdown.ItemShortcut`; с `asChild` — одна ссылка с ними внутри.",
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
      en: '`ref` → `HTMLButtonElement`. A `<button role="menuitemcheckbox">` with `aria-checked`, a `Checkbox.Indicator` before the label and the accent\'s soft tone while checked; a click, Enter or Space toggles it and the menu stays open.',
      ru: 'Пункт-переключатель `<button role="menuitemcheckbox">` с `aria-checked`, `Checkbox.Indicator` перед подписью и мягким тоном акцента, пока он выбран; клик, Enter или Space переключают его, меню остаётся открытым.',
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
          name: "keywords",
          type: "string",
          en: "With `Dropdown.Search`: extra words the query also matches (a client's name, an English title).",
          ru: "С `Dropdown.Search`: дополнительные слова, по которым тоже ищет запрос (имя клиента, английское название).",
        },
        {
          name: "persistent",
          type: "boolean",
          default: "false",
          en: "With `Dropdown.Search`: shown whatever the query and never counted as a match (the empty state still shows) — an action above the list («Новый чат»). The highlight goes to it only when nothing matches.",
          ru: "С `Dropdown.Search`: виден при любом запросе и не считается совпадением (пустое состояние всё равно показывается) — действие над списком («Новый чат»). Подсветка встаёт на него, только если ничего не найдено.",
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
          en: "The sentence: one line cut with an ellipsis; a `StatusDot` first.",
          ru: "Фраза: одна строка с многоточием; `StatusDot` — первым.",
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
      en: "`ref` → `HTMLSpanElement`. The `aria-hidden` leading mark of an item: the glyph of the row's tier, bare beside one line, on a tile beside a `Dropdown.ItemDescription`.",
      ru: "Метка в начале пункта (`aria-hidden`): глиф яруса строки, голый в одну строку, на плитке рядом с `Dropdown.ItemDescription`.",
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
      name: "Dropdown.ItemMeta",
      en: "`ref` → `HTMLSpanElement`. A muted meta at the end of the item, on the label's line (the time of a thread, a count): one line that never shrinks — the label truncates first. Describes the item for assistive tech; the label alone names it.",
      ru: "Приглушённая метка в конце пункта, на строке подписи (время чата, счётчик): одна строка, которая не сжимается — первой обрезается подпись. Описывает пункт для скринридера; имя пункта — только подпись.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The meta («14:32», «вчера»).",
          ru: "Метка («14:32», «вчера»).",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other attributes of the `<span>`.",
          ru: "`className` и остальные атрибуты `<span>`.",
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
  labels: labelRows(DROPDOWN_LABELS, {
    search: {
      en: "Default placeholder and accessible name of `Dropdown.Search`.",
      ru: "Плейсхолдер и имя `Dropdown.Search` по умолчанию.",
      part: "Dropdown.Search",
    },
    empty: {
      en: "Shown under the search while no item matches the query (a compact EmptyPage).",
      ru: "Показывается под поиском, пока ни один пункт не подходит под запрос (компактный EmptyPage).",
      part: "Dropdown.Search",
    },
  }),
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
        keys: "ArrowDown · ArrowUp · Enter",
        en: "In `Dropdown.Search` the arrows move the highlight over the shown enabled items, wrapping, while focus stays in the field; Enter runs the highlighted item. Space, Home and End edit the query.",
        ru: "В `Dropdown.Search` стрелки двигают подсветку по видимым доступным пунктам по кругу, фокус остаётся в поле; Enter выполняет подсвеченный пункт. Пробел, Home и End редактируют запрос.",
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
        en: "With a `Dropdown.ItemDescription` or a `Dropdown.ItemMeta` the label names the item (`aria-labelledby`) and they describe it (`aria-describedby`).",
        ru: "С `Dropdown.ItemDescription` или `Dropdown.ItemMeta` подпись называет пункт (`aria-labelledby`), а они описывают его (`aria-describedby`).",
      },
      {
        en: "An `asChild` item merges its props onto the link; the link's children are the item content. A disabled link item gets `aria-disabled` and its click is stopped.",
        ru: "Пункт с `asChild` переносит свои пропсы на ссылку; дети ссылки — содержимое пункта. Неактивный пункт-ссылка получает `aria-disabled`, его клик останавливается.",
      },
      {
        en: 'With `Dropdown.Search` the field is `<input type="search">` named by `labels.search`, with `aria-controls` pointing at the menu and `aria-activedescendant` at the highlighted item; items that do not match are `hidden`; the empty state is `role="status"`.',
        ru: 'С `Dropdown.Search` поле — `<input type="search">` с именем из `labels.search`, `aria-controls` указывает на меню, `aria-activedescendant` — на подсвеченный пункт; неподходящие пункты `hidden`; пустое состояние — `role="status"`.',
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
