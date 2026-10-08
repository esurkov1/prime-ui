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
      en: "Generic `Kanban.Root<T>`; `ref` → `HTMLDivElement`. The board: a strip of columns that scrolls sideways inside itself, each column a labelled `<ul>` of cards under a header with the title, a count `Badge` and actions. Mounts its own `Dnd.Root` unless one is already above it. Sets `aria-busy` while loading, `data-loading`, `data-disabled`.",
      ru: "Обобщённый `Kanban.Root<T>`. Доска: полоса колонок с собственной горизонтальной прокруткой; колонка — подписанный `<ul>` карточек под шапкой с названием, счётчиком `Badge` и действиями. Сама монтирует `Dnd.Root`, если его нет выше. Пока идёт загрузка — `aria-busy`, `data-loading`; `data-disabled`.",
      props: [
        {
          name: "columns",
          type: "readonly KanbanColumn[]",
          required: true,
          en: "Columns in their order: `{ id, title, limit? }`; `limit` is a WIP limit — a full column refuses cards from other columns and its count turns orange (`count / limit`).",
          ru: "Колонки по порядку: `{ id, title, limit? }`; `limit` — лимит работы: заполненная колонка не принимает карточки из других, счётчик становится оранжевым (`count / limit`).",
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
          type: "(value: KanbanValue, move: KanbanMove) => void",
          en: "A card moved by pointer, touch or keyboard: the new placement, then `{ id, from, to, index }` to save.",
          ru: "Карточку перенесли мышью, касанием или с клавиатуры: новая раскладка, затем `{ id, from, to, index }` для сохранения.",
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
          name: "canDrop",
          type: "(id: string, columnId: string) => boolean",
          en: "A workflow rule: refuses card `id` in column `columnId`; the column turns `danger` before the release and a keyboard move is announced as refused.",
          ru: "Правило процесса: колонка `columnId` не принимает карточку `id`; колонка краснеет до отпускания, а перенос с клавиатуры объявляется как отказ.",
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
          en: "Read-only board: no drag, no keyboard moves; clicks on cards still work.",
          ru: "Доска только для чтения: без перетаскивания и переноса с клавиатуры; клики по карточкам работают.",
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
      en: "`ref` → `HTMLLIElement`. One card: an `<li>` on the raised fill (`bg-raised`) with the card shadow; return it from `renderItem` (it takes its id from there). Draggable by the whole card, focusable, `aria-keyshortcuts` for Alt + arrows. Presses on buttons, fields and links inside never start a drag.",
      ru: "Одна карточка: `<li>` на приподнятой заливке (`bg-raised`) с тенью карточки; возвращается из `renderItem` (id берёт оттуда). Перетаскивается целиком, фокусируется, `aria-keyshortcuts` для Alt + стрелок. Нажатия на кнопки, поля и ссылки внутри не начинают перетаскивание.",
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
          en: "`children` (the card parts), `className`, `onClick` and the other attributes; `onKeyDown` runs first, `preventDefault()` keeps the move from happening.",
          ru: "`children` (части карточки), `className`, `onClick` и остальные атрибуты; `onKeyDown` срабатывает первым, `preventDefault()` отменяет перенос.",
        },
      ],
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
      key: "moved",
      default: "{label}: «{column}», позиция {position} из {total}",
      en: "Live region: a card moved to another column with the keyboard.",
      ru: "Live-область: карточка перенесена в другую колонку с клавиатуры.",
    },
    {
      key: "refused",
      default: "{label}: колонка «{column}» не принимает карточку",
      en: "Live region: the next column refused the card (full or `canDrop`).",
      ru: "Live-область: соседняя колонка не приняла карточку (заполнена или `canDrop`).",
    },
  ],
};
