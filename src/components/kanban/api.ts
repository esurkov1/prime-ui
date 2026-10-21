import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { KANBAN_LABELS } from "./Kanban";
import { KANBAN_FIELDS_MENU_LABELS } from "./KanbanFieldsMenu";

export const api: ComponentApi = {
  parts: [
    {
      name: "Kanban.Root",
      en: "Generic `Kanban.Root<T>`; `ref` → `HTMLDivElement`. The board: a strip of columns that scrolls sideways inside itself, each a labelled list of cards under a header. Mounts its own `Dnd.Root` unless one is above it. Give it a height.",
      ru: "Доска: полоса колонок с собственной горизонтальной прокруткой, каждая — подписанный список карточек под шапкой. Сама монтирует `Dnd.Root`, если его нет выше. Задайте ей высоту.",
      props: [
        {
          name: "columns",
          type: "readonly KanbanColumn[]",
          required: true,
          en: "Every column: `{ id, title, description?, color?, limit?, locked? }`, drawn in `columnOrder`. `color` is a `PaletteColor` for the count badge, `limit` a WIP limit, `locked` keeps a system stage in place.",
          ru: "Все колонки: `{ id, title, description?, color?, limit?, locked? }`, в порядке `columnOrder`. `color` — `PaletteColor` счётчика, `limit` — лимит работы, `locked` держит системный этап на месте.",
        },
        {
          name: "columnGroups",
          type: "readonly KanbanColumnGroup[]",
          en: "Phases of the board: `{ id, title, columnIds }`, a heading over each group's columns. A column moves only within its group; a move past the edge is refused and announced. Unnamed columns follow, headless.",
          ru: "Фазы доски: `{ id, title, columnIds }`, заголовок над колонками группы. Колонка переставляется только внутри группы; выход за край отклоняется и озвучивается. Остальные колонки идут следом, без заголовка.",
        },
        {
          name: "items",
          type: "readonly T[]",
          required: true,
          en: "Every card the board can show; `value` decides where each one stands.",
          ru: "Все карточки доски; где какая стоит, решает `value`.",
        },
        {
          name: "getId",
          type: "(item: T) => string",
          required: true,
          en: "Stable unique id of a card, the one used in `value`.",
          ru: "Стабильный уникальный id карточки, тот же, что в `value`.",
        },
        {
          name: "getLabel",
          type: "(item: T) => string",
          defaultNote: { en: "the `id`", ru: "`id`" },
          en: "Spoken by the live region.",
          ru: "Что произносит live-область.",
        },
        {
          name: "value",
          type: "KanbanValue",
          en: "Card ids per column (controlled): `{ [columnId]: id[] }`. Ids missing from `items` are skipped.",
          ru: "Id карточек по колонкам (управляемое): `{ [columnId]: id[] }`. Id, которых нет в `items`, пропускаются.",
        },
        {
          name: "defaultValue",
          type: "KanbanValue",
          default: "{}",
          en: "Initial card ids per column (uncontrolled).",
          ru: "Начальные id карточек по колонкам (неуправляемое).",
        },
        {
          name: "onValueChange",
          type: "(value: KanbanValue, move: KanbanMove) => void | Promise<void>",
          en: "A card moved: the new placement, then `{ id, from, to, index }` to save. Return the save's promise: the card waits busy in its new place; a rejection glides it back.",
          ru: "Карточку перенесли: новая раскладка, затем `{ id, from, to, index }` для сохранения. Верните промис сохранения: карточка ждёт занятой на новом месте; reject плавно возвращает её.",
        },
        {
          name: "reorderableColumns",
          type: "boolean",
          default: "false",
          en: "A grip (`Dnd.Handle`) at the end of every column header moves the column by pointer, touch hold and Alt + ← / →; the cards travel with it.",
          ru: "Ручка (`Dnd.Handle`) в конце шапки каждой колонки переносит колонку мышью, удержанием пальца и Alt + ← / →; карточки едут вместе с ней.",
        },
        {
          name: "columnOrder",
          type: "readonly string[]",
          en: "Column ids in their order (controlled). Columns it does not name follow in `columns` order.",
          ru: "Id колонок по порядку (управляемое). Колонки, которых в нём нет, идут следом в порядке `columns`.",
        },
        {
          name: "defaultColumnOrder",
          type: "readonly string[]",
          defaultNote: { en: "the order of `columns`", ru: "порядок `columns`" },
          en: "Initial column ids in their order (uncontrolled).",
          ru: "Начальный порядок id колонок (неуправляемое).",
        },
        {
          name: "onColumnOrderChange",
          type: "(order: readonly string[], move: KanbanColumnMove) => void | Promise<void>",
          en: "A column moved: the new order, then `{ id, index }` to save. Return the save's promise: the column waits busy in its new place; a rejection glides it back.",
          ru: "Колонку переставили: новый порядок, затем `{ id, index }` для сохранения. Верните промис сохранения: колонка ждёт занятой на новом месте; reject плавно возвращает её.",
        },
        {
          name: "renderItem",
          type: "(item: T) => ReactNode",
          required: true,
          en: "Renders one card; return a `Kanban.Item`.",
          ru: "Рисует одну карточку; возвращает `Kanban.Item`.",
        },
        {
          name: "getItemHref",
          type: "(item: T) => string",
          en: "The card is a link: a real `<a>` named by `getLabel` covers it and is its tab stop — a click, ⌘/Ctrl-click, a middle click, a new tab. A press on it still drags the card; a drag never follows it.",
          ru: "Карточка — ссылка: настоящий `<a>` с именем из `getLabel` накрывает её и служит остановкой Tab — клик, ⌘/Ctrl-клик, средняя кнопка, новая вкладка. Нажатие по-прежнему тащит карточку; перетаскивание не ведёт по ссылке.",
        },
        {
          name: "onItemOpen",
          type: "(item: T, event: KanbanItemOpenEvent) => void",
          en: "Opens a card in place (a Drawer): a click, Enter or Space; never from a control inside it or after a drag. With `getItemHref` it gets plain clicks: `event.preventDefault()` routes in the app.",
          ru: "Открывает карточку на месте (Drawer): клик, Enter или Space; не от контрола внутри и не после перетаскивания. С `getItemHref` получает обычные клики: `event.preventDefault()` — переход роутером.",
        },
        {
          name: "columnTitleAs",
          type: '"h2" | "h3" | "h4"',
          default: '"h3"',
          en: "Heading level of the column titles in the page outline; the look does not change.",
          ru: "Уровень заголовков колонок в структуре страницы; вид не меняется.",
        },
        {
          name: "renderColumnActions",
          type: "(column: KanbanColumn) => ReactNode",
          en: "Trailing actions of a column header (add a card, a menu); kit controls inside take the `s` tier.",
          ru: "Действия справа в шапке колонки (добавить карточку, меню); контролы кита внутри берут ярус `s`.",
        },
        {
          name: "renderColumnMeta",
          type: "(column: KanbanColumn) => ReactNode | readonly ReactNode[]",
          en: "The meta under a column's title and description: the stage's figures («12 сделок · 4,8 млн ₽»); an array is a line per entry, in order. Describes the column's list.",
          ru: "Мета под названием и описанием колонки: цифры этапа («12 сделок · 4,8 млн ₽»); массив — строка на элемент, по порядку. Описывает список колонки.",
        },
        {
          name: "canDrop",
          type: "(id: string, columnId: string) => boolean | string",
          en: "A workflow rule: refuses card `id` in column `columnId` — `false`, or a string that says why (spoken and shown under the carried card). The column turns `danger` before the release.",
          ru: "Правило процесса: колонка `columnId` не принимает карточку `id` — `false` или строка с причиной (озвучивается и видна под переносимой карточкой). Колонка становится `danger` до отпускания.",
        },
        {
          name: "variant",
          type: '"plain" | "line" | "well"',
          default: '"plain"',
          en: "No wells: `plain` — a filled header plate over the cards, `line` — a bare header over a faint line; cards stand on the host. `well`: every column is a filled well holding its cards (bounded queues).",
          ru: "Без подложек: `plain` — шапка-плашка с фоном над карточками, `line` — шапка над тонкой линией; карточки стоят на фоне. `well`: каждая колонка — залитая подложка с карточками (ограниченные очереди).",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "Columns show skeleton cards in the card geometry; the cards cross-fade in when it turns off.",
          ru: "Колонки показывают скелетоны в форме карточек; по окончании карточки проявляются плавной сменой.",
        },
        {
          name: "loadingColumns",
          type: "number",
          default: "3",
          en: "Placeholder columns a `loading` board draws while `columns` is empty (the stages are still loading); the columns fade in where they stood.",
          ru: "Сколько колонок-заглушек рисует доска в `loading`, пока `columns` пуст (этапы ещё грузятся); колонки проявляются на их месте.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Read-only board: no drag, no keyboard moves, no column grips; `onItemOpen` and `getItemHref` still open cards.",
          ru: "Доска только для чтения: без перетаскивания, переноса с клавиатуры и ручек колонок; `onItemOpen` и `getItemHref` по-прежнему открывают карточки.",
        },
        {
          name: "labels",
          type: "Partial<KanbanLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue">',
          en: "`className` (the board height), `aria-label` and the other div attributes.",
          ru: "`className` (высота доски), `aria-label` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Kanban.Item",
      en: "`ref` → `HTMLLIElement`. One card; return it from `renderItem` (it takes its id from there). Dragged by the whole card and focusable; presses on buttons, fields and links inside never start a drag.",
      ru: "Одна карточка; возвращается из `renderItem` (id берёт оттуда). Перетаскивается целиком и фокусируется; нажатия на кнопки, поля и ссылки внутри не начинают перетаскивание.",
      props: [
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "This card cannot be dragged or moved.",
          ru: "Эту карточку нельзя перетащить или перенести.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLElement>, "id">',
          en: "`children` (the card parts), `className` and the other attributes; `onClick` / `onKeyDown` run before `onItemOpen` opens the card — `preventDefault()` keeps it closed.",
          ru: "`children` (части карточки), `className` и остальные атрибуты; `onClick` / `onKeyDown` выполняются раньше, чем `onItemOpen` открывает карточку, — `preventDefault()` оставляет её закрытой.",
        },
      ],
    },
    {
      name: "Kanban.ItemHeader",
      en: "`ref` → `HTMLDivElement`. Optional top row of a card: the key or project at the start, cut with an ellipsis; the last child (a priority `Badge`, an assignee) at the end, never shrunk.",
      ru: "Необязательная верхняя строка карточки: ключ или проект в начале, обрезается многоточием; последний элемент (`Badge` приоритета, исполнитель) — в конце, не сжимается.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Kanban.ItemTitle",
      en: "`ref` → `HTMLSpanElement`. The card title: medium body text, up to three lines. With a tail — `number`, an `Avatar.Root` child (the owner, also inside a fragment) — one row: the name cut with an ellipsis, then the number, the owner last; the tail never shrinks.",
      ru: "Заголовок карточки: средний текст, до трёх строк. С хвостом — `number`, дочерний `Avatar.Root` (ответственный, в том числе внутри фрагмента) — одна строка: имя обрезается многоточием, затем номер, ответственный последним; хвост не сжимается.",
      props: [
        {
          name: "number",
          type: "ReactNode",
          en: "The record's number («#866»): a small muted caption in tabular digits at the end of the row, before the owner.",
          ru: "Номер записи («#866»): мелкая приглушённая подпись с моноширинными цифрами в конце строки, перед ответственным.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children` (the name, an owner `Avatar.Root`), `className` and the other span attributes.",
          ru: "`children` (имя, `Avatar.Root` ответственного), `className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Kanban.ItemDescription",
      en: "`ref` → `HTMLSpanElement`. The muted meta line under the title: id, due date; one line, tabular numbers.",
      ru: "Приглушённая строка меты под заголовком: id, срок; одна строка, моноширинные цифры.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children`, `className` and the other span attributes.",
          ru: "`children`, `className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Kanban.ItemBadges",
      en: "`ref` → `HTMLDivElement`. A wrapping row of `Badge`s (a `Badge.Group`): labels, priority.",
      ru: "Строка `Badge` с переносом (`Badge.Group`): метки, приоритет.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Kanban.ItemFooter",
      en: "`ref` → `HTMLDivElement`. The bottom row: `Kanban.ItemCount`s at the start (an icon alone marks a channel); text cut with an ellipsis; the last child, unless a count, at the end, never shrunk (an `Avatar`, a date).",
      ru: "Нижняя строка: `Kanban.ItemCount` в начале (одна иконка — канал); текст обрезается многоточием; последний элемент, если не счётчик, — в конце и не сжимается (`Avatar`, дата).",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Kanban.ItemCount",
      en: "`ref` → `HTMLSpanElement`. A small muted counter with a 14 px icon: comments, attachments, subtasks.",
      ru: "Маленький приглушённый счётчик с иконкой 14 px: комментарии, вложения, подзадачи.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children`, `className` and the other span attributes.",
          ru: "`children`, `className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Kanban.ItemSection",
      en: "`ref` → `HTMLDivElement`. A zone of a card, a group of its parts: zones stand `space-3` off a faint line between them, parts inside one `space-2` apart. A zone with nothing in it is not drawn and leaves no line.",
      ru: "Зона карточки, группа её частей: зоны стоят на `space-3` от еле видимой линии между ними, части внутри — через `space-2`. Пустая зона не рисуется и не оставляет линию.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Kanban.ItemResource",
      en: "`ref` → `HTMLDivElement`. One unit a record holds (a vehicle, a room): a mark at the start (a `ProgressCircle` of its term; kit marks take the `s` tier), then its name and a caption line, each cut with an ellipsis.",
      ru: "Одна единица записи (машина, комната): отметка в начале (`ProgressCircle` срока; отметки кита берут ярус `s`), затем название и подпись, каждая обрезается многоточием.",
      props: [
        {
          name: "label",
          type: "ReactNode",
          required: true,
          en: "The unit's name: body-s, medium, one line.",
          ru: "Название единицы: body-s, medium, одна строка.",
        },
        {
          name: "description",
          type: "ReactNode",
          en: "The caption line under the name: muted, tabular digits; a span inside may carry a tone (an overdue term in `danger`).",
          ru: "Подпись под названием: приглушённая, моноширинные цифры; span внутри может нести свой тон (просрочка — `danger`).",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "The mark at the start: a `ProgressCircle` of the unit's term (a short text in it: «18 д»), an `Avatar`, a `Thumbnail`.",
          ru: "Отметка в начале: `ProgressCircle` срока единицы (короткий текст в нём: «18 д»), `Avatar`, `Thumbnail`.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other div attributes.",
          ru: "`className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Kanban.ItemFact",
      en: "`ref` → `HTMLDivElement`. One fact of a record: an `Icon` (14 px) and a secondary caption line cut with an ellipsis; a part of the text may carry its own tone (a `Typography` span). Facts in a row stand `space-1` apart.",
      ru: "Один факт записи: `Icon` (14 px) и вторичная подпись, обрезается многоточием; часть текста может нести свой тон (`Typography` span). Факты подряд стоят через `space-1`.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "KanbanFieldsMenu",
      en: "`ref` → `HTMLButtonElement`. The view of a board's cards, for the page's tools: the kit's one view trigger (the columns icon, «Вид», the count of shown fields), a check item per card field and «По умолчанию» once changed. The cards read the same `hiddenFields`.",
      ru: "Вид карточек доски, для инструментов страницы: единая кнопка вида кита (иконка колонок, «Вид», число показанных полей), пункт-флажок на каждое поле и «По умолчанию» после изменения. Карточки читают те же `hiddenFields`.",
      props: [
        {
          name: "fields",
          type: "readonly KanbanField[]",
          required: true,
          en: "The card fields a person may hide or move: `{ id, label, group? }`, in default order; fields with a `group` stand under that heading instead of `labels.fields`.",
          ru: "Поля карточки, которые можно скрыть или переставить: `{ id, label, group? }`, в порядке по умолчанию; поля с `group` стоят под этим заголовком вместо `labels.fields`.",
        },
        {
          name: "hiddenFields",
          type: "readonly string[]",
          en: "Ids of the hidden fields (controlled).",
          ru: "Id скрытых полей (управляемо).",
        },
        {
          name: "defaultHiddenFields",
          type: "readonly string[]",
          default: "[]",
          en: "The default view: the initial hidden fields (uncontrolled) and what «По умолчанию» puts back.",
          ru: "Вид по умолчанию: скрытые поля в начале (неуправляемо) и то, что возвращает «По умолчанию».",
        },
        {
          name: "onHiddenFieldsChange",
          type: "(hiddenFields: readonly string[]) => void",
          en: "A field was shown or hidden, or the default view put back.",
          ru: "Поле показали или скрыли, или вернули вид по умолчанию.",
        },
        {
          name: "fieldOrder",
          type: "readonly string[]",
          en: "Ids of the fields in the order the cards draw them (controlled). Any of the triad turns the items into sortable lists: a grip, Alt + ↑ / ↓, a field moves within its group.",
          ru: "Id полей в порядке, в котором их рисуют карточки (управляемо). Любой из тройки делает пункты сортируемыми: ручка, Alt + ↑ / ↓, поле движется внутри своей группы.",
        },
        {
          name: "defaultFieldOrder",
          type: "readonly string[]",
          en: "The initial order (uncontrolled); `[]` starts in the order of `fields`, which «По умолчанию» puts back.",
          ru: "Начальный порядок (неуправляемо); `[]` — в порядке `fields`, который возвращает «По умолчанию».",
        },
        {
          name: "onFieldOrderChange",
          type: "(fieldOrder: readonly string[]) => void",
          en: "A field was moved, or «По умолчанию» put the order of `fields` back: the new order of every field. Render the card parts in it.",
          ru: "Поле переставили или «По умолчанию» вернул порядок `fields`: новый порядок всех полей. Рисуйте части карточки в нём.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус хоста, иначе `"m"`' },
          en: "Tier of the trigger and the menu.",
          ru: "Ярус кнопки и меню.",
        },
        {
          name: "labels",
          type: "Partial<KanbanFieldsMenuLabels>",
          en: "The menu's strings: `view`, `fields`, `reset`.",
          ru: "Строки меню: `view`, `fields`, `reset`.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type">',
          en: "`className` and the other attributes of the trigger button.",
          ru: "`className` и остальные атрибуты кнопки.",
        },
      ],
    },
  ],
  labels: [
    ...labelRows(KANBAN_LABELS, {
      count: { en: "Spoken name of the count badge.", ru: "Озвучиваемое имя счётчика." },
      countLimit: {
        en: "Spoken name of the count badge of a column with a `limit`.",
        ru: "Озвучиваемое имя счётчика колонки с `limit`.",
      },
      empty: { en: "Text of an empty column.", ru: "Текст пустой колонки." },
      full: {
        en: "Why a full column refuses a card: spoken, and shown under the carried card.",
        ru: "Почему заполненная колонка не принимает карточку: озвучивается и видна под переносимой карточкой.",
      },
      moveColumn: {
        en: "Name of the column grip (`reorderableColumns`).",
        ru: "Имя ручки колонки (`reorderableColumns`).",
      },
      column: {
        en: "A column as the live region names it when it is carried or moved («Колонка «Демо»: позиция 2 из 4»).",
        ru: "Колонка в объявлениях live-области, когда её переносят («Колонка «Демо»: позиция 2 из 4»).",
      },
      moveFailed: {
        en: "Spoken when the `onValueChange` promise rejects; `{label}` is `getLabel(item)`.",
        ru: "Озвучивается, когда промис `onValueChange` отклонён; `{label}` — `getLabel(item)`.",
      },
      columnMoveFailed: {
        en: "Spoken when the `onColumnOrderChange` promise rejects.",
        ru: "Озвучивается, когда промис `onColumnOrderChange` отклонён.",
      },
      columnGroupLocked: {
        en: "Why a column cannot leave its group (`columnGroups`), spoken and shown under the carried column; `{column}`, `{group}`.",
        ru: "Почему колонка не может выйти из своей группы (`columnGroups`): озвучивается и показывается под переносимой колонкой; `{column}`, `{group}`.",
      },
    }),
    ...labelRows(KANBAN_FIELDS_MENU_LABELS, {
      view: { en: "Text of the trigger.", ru: "Текст кнопки.", part: "KanbanFieldsMenu" },
      fields: {
        en: "Heading of the group of card fields.",
        ru: "Заголовок группы полей карточки.",
        part: "KanbanFieldsMenu",
      },
      reset: {
        en: "The item that puts `defaultHiddenFields` and the order of `fields` back.",
        ru: "Пункт, который возвращает `defaultHiddenFields` и порядок `fields`.",
        part: "KanbanFieldsMenu",
      },
      reorderField: {
        en: "Name of a field's grip (`fieldOrder`); `{label}` is the field's label.",
        ru: "Имя ручки поля (`fieldOrder`); `{label}` — подпись поля.",
        part: "KanbanFieldsMenu",
      },
    }),
  ],
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Moves through the cards, column by column.",
        ru: "Переходит по карточкам колонка за колонкой.",
      },
      {
        keys: "Enter · Space",
        en: "Opens the focused card (`onItemOpen`) or follows its link (`getItemHref`).",
        ru: "Открывает карточку в фокусе (`onItemOpen`) или переходит по её ссылке (`getItemHref`).",
      },
      {
        keys: "Alt + ↑ · Alt + ↓",
        en: "Moves the card one place inside its column. In `KanbanFieldsMenu` with `fieldOrder`: moves the focused field one place within its group, the focus staying on it.",
        ru: "Сдвигает карточку на одно место внутри колонки. В `KanbanFieldsMenu` с `fieldOrder` — сдвигает поле в фокусе на одно место внутри группы, фокус остаётся на нём.",
      },
      {
        keys: "Alt + ← · Alt + →",
        en: 'On a card: moves it to the neighbouring column at the same row (or its end). On a column grip: moves the column one place. Focus follows. The direction follows the writing direction (`dir="rtl"`: ← goes forward).',
        ru: 'На карточке — переносит её в соседнюю колонку на ту же строку (или в конец); на ручке колонки — сдвигает колонку на одно место. Фокус идёт следом. Направление — по письму: при `dir="rtl"` ← ведёт вперёд.',
      },
      {
        keys: "Escape",
        en: "Cancels a drag in flight.",
        ru: "Отменяет перетаскивание в процессе.",
      },
    ],
    aria: [
      {
        en: "Every column is a `<ul>` labelled by its heading (`aria-labelledby`) and described by its description and meta (`aria-describedby`); cards are `<li>` with `aria-roledescription` and `aria-keyshortcuts`, and `aria-posinset` / `aria-setsize`, since a column draws only the cards around its view. The columns are Dnd lists of one kind: Alt + ← / → across them is Dnd's.",
        ru: "Каждая колонка — `<ul>`, подписанный заголовком колонки (`aria-labelledby`) и описанный подзаголовком (`aria-describedby`); карточки — `<li>` с `aria-roledescription`, `aria-keyshortcuts` и `aria-posinset` / `aria-setsize`, ведь колонка рисует только карточки около видимой зоны.",
      },
      {
        en: 'With `columnGroups` every named group is a `role="group"` labelled by its heading; a keyboard move past the edge of a group is announced with `labels.columnGroupLocked`.',
        ru: 'С `columnGroups` каждая именованная группа — `role="group"` с именем из её заголовка; перенос с клавиатуры за край группы озвучивается через `labels.columnGroupLocked`.',
      },
      {
        en: "The column grip is a button named «Переместить колонку «…»» with `aria-keyshortcuts`; a keyboard column move is announced with its position («Колонка «…»: позиция 2 из 4», `labels.column`). A locked column has a lock named «Закреплено» instead.",
        ru: "Ручка колонки — кнопка с именем «Переместить колонку «…»» и `aria-keyshortcuts`; перенос колонки с клавиатуры объявляется позицией («Колонка «…»: позиция 2 из 4», `labels.column`). У закреплённой колонки вместо ручки — замок с именем «Закреплено».",
      },
      {
        en: 'A live region (`role="status"`) announces grabbed, dropped, «position N of M», a move to another column by its title and a refusal with its reason (`labels`, Dnd\'s labels).',
        ru: 'Live-область (`role="status"`) объявляет: взята, перемещена, позиция N из M, перенос в колонку и отказ колонки с причиной (`labels`, подписи Dnd).',
      },
      {
        en: "The count is spoken as text («Карточек: 3 из 5»), not only by colour; a full column also reads `count / limit`.",
        ru: "Счётчик колонки озвучивается текстом («Карточек: 3 из 5»), а не только цветом; полная колонка ещё и показывает `count / limit`.",
      },
      {
        en: "With `getItemHref` a real `<a>` named by `getLabel` covers the card and is its tab stop: a click, ⌘/Ctrl-click, a middle click and «open in new tab» work anywhere on the card, Space follows it like Enter, Alt + arrows move the card from it and a press on it drags the card; the release of a drag never follows it. Controls inside the card stand above the link. With `onItemOpen` alone the card opens by a click, Enter or Space; a control inside the card never opens it, and a card that opens stays a tab stop on a `disabled` board.",
        ru: "С `getItemHref` карточку накрывает настоящая ссылка `<a>` с именем из `getLabel` — она и остановка Tab; Alt + стрелки с неё переносят карточку, нажатие тащит её, а отпускание после перетаскивания не переходит по ссылке. Клик, ⌘/Ctrl-клик, средний клик и «открыть в новой вкладке» работают по всей карточке, Space переходит по ссылке как Enter; контролы внутри карточки стоят над ссылкой. С одним `onItemOpen` карточка открывается кликом, Enter или Space; контрол внутри её не открывает, а открываемая карточка остаётся остановкой Tab на доске с `disabled`.",
      },
      {
        en: "Touch: a drag starts after a hold; a finger that moves first scrolls the board.",
        ru: "Касание: перенос начинается после удержания, движение пальца раньше — обычная прокрутка доски.",
      },
      {
        en: "A board named by `aria-label` or `aria-labelledby` is a `group` with that name; an unnamed one has no role.",
        ru: "Доска с `aria-label` или `aria-labelledby` — это `group` с этим именем; без имени роли нет.",
      },
      {
        en: "`KanbanFieldsMenu` is a menu button named by its text and count («Вид 4»); its items are a group named `labels.fields` of `menuitemcheckbox` with `aria-checked`.",
        ru: "`KanbanFieldsMenu` — кнопка меню с именем из текста и числа («Вид 4»); пункты — группа `labels.fields` из `menuitemcheckbox` с `aria-checked`.",
      },
      {
        en: "While loading the root has `aria-busy`; skeletons are hidden from assistive tech.",
        ru: "Пока идёт загрузка, у доски `aria-busy`; скелетоны скрыты от чтения с экрана.",
      },
      {
        en: "While a move is saved the card or column has `aria-busy` (its spinner is hidden from assistive tech, a column's busy grip says so itself); a refused save is announced (`labels.moveFailed`, `labels.columnMoveFailed`).",
        ru: "Пока перенос сохраняется, у карточки или колонки `aria-busy` (её спиннер скрыт от вспомогательных технологий, занятая ручка колонки сообщает о себе сама); отказ объявляется (`labels.moveFailed`, `labels.columnMoveFailed`).",
      },
    ],
  },
};
