import type { ComponentApi } from "../../../scripts/docs/componentApi";

const SPAN_REST = {
  name: "…rest",
  type: "HTMLAttributes<HTMLSpanElement>",
  en: "`children`, `className` and the other span attributes.",
  ru: "`children`, `className` и остальные атрибуты span.",
};

const DIV_REST = {
  name: "…rest",
  type: "HTMLAttributes<HTMLDivElement>",
  en: "`children`, `className` and the other div attributes.",
  ru: "`children`, `className` и остальные атрибуты div.",
};

export const api: ComponentApi = {
  parts: [
    {
      name: "Kanban.Root",
      en: "Generic `Kanban.Root<T>`; `ref` → `HTMLDivElement`. The board: a strip of columns that scrolls sideways inside itself, each a labelled list of cards under a header. Mounts its own `Dnd.Root` unless one is above it. Give it a height.",
      ru: "Обобщённый `Kanban.Root<T>`; `ref` → `HTMLDivElement`. Доска: полоса колонок с собственной горизонтальной прокруткой, каждая — подписанный список карточек под шапкой. Сама монтирует `Dnd.Root`, если его нет выше. Задайте ей высоту.",
      props: [
        {
          name: "columns",
          type: "readonly KanbanColumn[]",
          required: true,
          en: "Every column: `{ id, title, description?, color?, limit?, locked? }`, drawn in `columnOrder`. `color` is a `PaletteColor` for the count badge, `limit` a WIP limit, `locked` keeps a system stage in place.",
          ru: "Все колонки: `{ id, title, description?, color?, limit?, locked? }`, в порядке `columnOrder`. `color` — `PaletteColor` счётчика, `limit` — лимит работы, `locked` держит системный этап на месте.",
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
          default: "the id",
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
          default: "the order of `columns`",
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
          name: "renderColumnActions",
          type: "(column: KanbanColumn) => ReactNode",
          en: "Trailing actions of a column header (add a card, a menu); kit controls inside take the `s` tier.",
          ru: "Действия справа в шапке колонки (добавить карточку, меню); контролы кита внутри берут ярус `s`.",
        },
        {
          name: "renderColumnMeta",
          type: "(column: KanbanColumn) => ReactNode",
          en: "The meta line under a column's title and description: the stage's figures («12 сделок · 4,8 млн ₽»).",
          ru: "Строка меты под названием и описанием колонки: цифры этапа («12 сделок · 4,8 млн ₽»).",
        },
        {
          name: "canDrop",
          type: "(id: string, columnId: string) => boolean | string",
          en: "A workflow rule: refuses card `id` in column `columnId` — `false`, or a string that says why (spoken and shown under the carried card).",
          ru: "Правило процесса: колонка `columnId` не принимает карточку `id` — `false` или строка с причиной (озвучивается и видна под переносимой карточкой).",
        },
        {
          name: "variant",
          type: '"well" | "plain"',
          default: '"well"',
          en: "`well`: every column is a filled well with its cards inside. `plain`: no wells — a filled header plate and wider cards carry the column.",
          ru: "`well`: каждая колонка — залитая подложка с карточками внутри. `plain`: без подложек — колонку держат залитая плашка шапки и более широкие карточки.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "Columns show skeleton cards in the card geometry; the cards cross-fade in when it turns off.",
          ru: "Колонки показывают скелетоны в форме карточек; по окончании карточки проявляются плавной сменой.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Read-only board: no drag, no keyboard moves, no column grips; clicks on cards still work.",
          ru: "Доска только для чтения: без перетаскивания, переноса с клавиатуры и ручек колонок; клики по карточкам работают.",
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
      ru: "`ref` → `HTMLLIElement`. Одна карточка; возвращается из `renderItem` (id берёт оттуда). Перетаскивается целиком и фокусируется; нажатия на кнопки, поля и ссылки внутри не начинают перетаскивание.",
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
          en: "`children` (the card parts), `className`, `onClick` and the other attributes.",
          ru: "`children` (части карточки), `className`, `onClick` и остальные атрибуты.",
        },
      ],
    },
    {
      name: "Kanban.ItemHeader",
      en: "`ref` → `HTMLDivElement`. Optional top row of a card: the key or project at the start, the last child (a priority `Badge`, an assignee) at the end.",
      ru: "`ref` → `HTMLDivElement`. Необязательная верхняя строка карточки: ключ или проект в начале, последний элемент (`Badge` приоритета, исполнитель) — в конце.",
      props: [DIV_REST],
    },
    {
      name: "Kanban.ItemTitle · Kanban.ItemDescription",
      en: "`ref` → `HTMLSpanElement`. The card title (medium body text, up to three lines) and the muted meta line under it (id, due date; one line, tabular numbers).",
      ru: "Заголовок карточки (средний текст, до трёх строк) и приглушённая строка меты под ним (id, срок; одна строка, моноширинные цифры).",
      props: [SPAN_REST],
    },
    {
      name: "Kanban.ItemBadges",
      en: "`ref` → `HTMLDivElement`. A wrapping row of `Badge`s: labels, priority.",
      ru: "Строка `Badge` с переносом: метки, приоритет.",
      props: [DIV_REST],
    },
    {
      name: "Kanban.ItemFooter",
      en: "`ref` → `HTMLDivElement`. The bottom row: `Kanban.ItemCount`s at the start; the last child, unless a count, sits at the end (the assignee `Avatar`).",
      ru: "Нижняя строка: `Kanban.ItemCount` в начале; последний элемент, если это не счётчик, — в конце (`Avatar` исполнителя).",
      props: [DIV_REST],
    },
    {
      name: "Kanban.ItemCount",
      en: "`ref` → `HTMLSpanElement`. A small muted counter with a 14 px icon: comments, attachments, subtasks.",
      ru: "Маленький приглушённый счётчик с иконкой 14 px: комментарии, вложения, подзадачи.",
      props: [SPAN_REST],
    },
  ],
  labels: [
    {
      key: "count",
      default: "Карточек: {count}",
      en: "Spoken name of the count badge.",
      ru: "Озвучиваемое имя счётчика.",
    },
    {
      key: "countLimit",
      default: "Карточек: {count} из {limit}",
      en: "Spoken name of the count badge of a column with a `limit`.",
      ru: "Озвучиваемое имя счётчика колонки с `limit`.",
    },
    {
      key: "empty",
      default: "Нет карточек",
      en: "Text of an empty column.",
      ru: "Текст пустой колонки.",
    },
    {
      key: "emptyHint",
      default: "Перетащите сюда карточку",
      en: "Hint under the empty-column text, while cards can be dropped (not on a `disabled` board).",
      ru: "Подсказка под текстом пустой колонки, пока в неё можно положить карточку (не на доске `disabled`).",
    },
    {
      key: "full",
      default: "Колонка «{column}» заполнена ({limit})",
      en: "Why a full column refuses a card: spoken, and shown under the carried card.",
      ru: "Почему заполненная колонка не принимает карточку: озвучивается и видна под переносимой карточкой.",
    },
    {
      key: "moveColumn",
      default: "Переместить колонку «{column}»",
      en: "Name of the column grip (`reorderableColumns`).",
      ru: "Имя ручки колонки (`reorderableColumns`).",
    },
    {
      key: "column",
      default: "Колонка «{column}»",
      en: "A column as the live region names it when it is carried or moved («Колонка «Демо»: позиция 2 из 4»).",
      ru: "Колонка в объявлениях live-области, когда её переносят («Колонка «Демо»: позиция 2 из 4»).",
    },
    {
      key: "moveFailed",
      default: "Не удалось переместить «{label}», карточка вернулась на место",
      en: "Spoken when the `onValueChange` promise rejects; `{label}` is `getLabel(item)`.",
      ru: "Озвучивается, когда промис `onValueChange` отклонён; `{label}` — `getLabel(item)`.",
    },
    {
      key: "columnMoveFailed",
      default: "Не удалось переместить колонку «{column}», она вернулась на место",
      en: "Spoken when the `onColumnOrderChange` promise rejects.",
      ru: "Озвучивается, когда промис `onColumnOrderChange` отклонён.",
    },
  ],
};
