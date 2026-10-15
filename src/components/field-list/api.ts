import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { FIELD_HINT_TONE_PROP } from "../../internal/field.api";
import { FIELD_LIST_LABELS } from "./FieldList";

export const api: ComponentApi = {
  parts: [
    {
      name: "FieldList",
      en: "Generic `FieldList<T>`; `ref` → `HTMLDivElement` (the field frame). An editable list of records of one shape: column headings once, a row of fields per record (`<ol>`), remove per row, add under the rows; rows stack in a container under 30rem.",
      ru: "Редактируемый список однотипных записей: заголовки столбцов один раз над строками, строка полей на запись (`<ol>`), кнопка удаления у строки и кнопка добавления под строками; в контейнере уже 30rem строки складываются в блоки.",
      props: [
        {
          name: "columns",
          type: "readonly FieldListColumn[]",
          required: true,
          en: "The columns in cell order: `label` (the heading; it names the field of the column in every row), `width` (`fill` | `compact` | `xs` | `s` | `m`), `required` (a `*` after the heading).",
          ru: "Столбцы в порядке ячеек: `label` (заголовок; он же имя поля столбца в каждой строке), `width` (`fill` | `compact` | `xs` | `s` | `m`), `required` (`*` после заголовка).",
        },
        {
          name: "renderItem",
          type: "(item: T, row: FieldListRow<T>) => ReactNode",
          required: true,
          en: "The cells of a row, one element per column (a fragment): kit fields without `label`. `row` has `index`, `update(patch)` and `remove()`. In one column the remove is the field's last segment.",
          ru: "Ячейки строки, по элементу на столбец (фрагмент): поля кита без `label`. `row` — `index`, `update(patch)` и `remove()`. В одном столбце кнопка удаления — последний сегмент поля.",
        },
        {
          name: "renderTotals",
          type: "(items: readonly T[]) => ReactNode",
          en: "The totals row under the rows: one node per column (a fragment), `null` where none; each aligned as its column's field text. The first cell without a total reads `labels.totals`.",
          ru: "Строка итогов под строками: по узлу на столбец (фрагмент), `null` — итога нет; каждый выровнен как текст поля своего столбца. Первая ячейка без итога — `labels.totals`.",
        },
        {
          name: "getId",
          type: "(item: T) => string",
          required: true,
          en: "Stable unique id of an item: the row key and the drag id.",
          ru: "Стабильный уникальный id записи: ключ строки и id перетаскивания.",
        },
        {
          name: "value",
          type: "readonly T[]",
          en: "The rows (controlled).",
          ru: "Строки (управляемо).",
        },
        {
          name: "defaultValue",
          type: "readonly T[]",
          default: "[]",
          en: "The first rows (uncontrolled).",
          ru: "Начальные строки (неуправляемо).",
        },
        {
          name: "onValueChange",
          type: "(value: T[]) => void | Promise<void>",
          en: "The new list after an edit (`row.update`), an add, a remove or a move. Return the save's promise: the new list shows while it is pending, the owner's again on a reject (say why with `error`).",
          ru: "Новый список после правки (`row.update`), добавления, удаления или переноса. Верните промис сохранения: пока он идёт, виден новый список, при reject — снова список владельца (причина — в `error`).",
        },
        {
          name: "createItem",
          type: "() => T",
          en: "A new empty item; with it the add button shows under the rows and focus goes to the new row's first field.",
          ru: "Новая пустая запись; с ней под строками есть кнопка добавления, а фокус уходит в первое поле новой строки.",
        },
        {
          name: "addLabel",
          type: "string",
          en: "Text of the add button: what is added («Добавить позицию»).",
          ru: "Текст кнопки добавления: что добавляется («Добавить позицию»).",
        },
        {
          name: "getLabel",
          type: "(item: T) => string",
          en: "The row's own text (its title field) for the remove button, the handle and drag announcements; else the row number.",
          ru: "Текст строки (её поле-название) для кнопки удаления, ручки и объявлений перетаскивания; иначе — номер строки.",
        },
        {
          name: "getLocked",
          type: "(item: T) => boolean",
          en: "Pinned rows: the remove button stays in its place, off, its tooltip says why (`labels.lockedReason`); with `reorderable` a lock takes the handle's place and the row holds it while others move.",
          ru: "Закреплённые строки: кнопка удаления на своём месте, выключена, подсказка объясняет почему (`labels.lockedReason`); с `reorderable` на месте ручки — замок, и строка держит место при перестановке.",
        },
        {
          name: "reorderable",
          type: "boolean",
          default: "false",
          en: "Rows move by a handle at the row's end, after the remove button: drag, a touch hold, Alt + ↑ / ↓.",
          ru: "Строки переносятся за ручку в конце строки, после кнопки удаления: перетаскивание, удержание, Alt + ↑ / ↓.",
        },
        {
          name: "min",
          type: "number",
          default: "0",
          en: "The fewest rows: at this count the remove buttons are disabled.",
          ru: "Наименьшее число строк: при нём кнопки удаления выключены.",
        },
        {
          name: "max",
          type: "number",
          en: "The most rows: at this count the add button is disabled with `labels.maxReached` beside it.",
          ru: "Наибольшее число строк: при нём кнопка добавления выключена, рядом — `labels.maxReached`.",
        },
        {
          name: "label",
          type: "ReactNode",
          en: "Heading of the list; names the `<ol>`. Omit it inside a `Fieldset` whose legend names the list.",
          ru: "Подпись списка, имя `<ol>`. Не нужна внутри `Fieldset`, чья легенда уже называет список.",
        },
        {
          name: "aria-label",
          type: "string",
          en: "Name of the `<ol>` when no visible `label` names it (a section heading above the list).",
          ru: "Имя `<ol>`, если его не называет видимый `label` (заголовок раздела над списком).",
        },
        {
          name: "hint",
          type: "ReactNode",
          en: "Help text under the list; hidden while `error` shows.",
          ru: "Подсказка под списком; скрыта, пока показан `error`.",
        },
        FIELD_HINT_TONE_PROP,
        {
          name: "error",
          type: "ReactNode",
          en: "A problem of the list as a whole («Добавьте хотя бы одну позицию»); a field's own error goes on that field.",
          ru: "Ошибка списка целиком («Добавьте хотя бы одну позицию»); ошибка поля — на самом поле.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disables every field, handle and button; a disabled `Fieldset` around it sets it too.",
          ru: "Выключает все поля, ручки и кнопки; выключенный `Fieldset` вокруг делает то же.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Tier of the headings, buttons and the kit fields that read the host tier. Without it the host tier, else `m`.",
          ru: "Ярус заголовков, кнопок и полей кита, читающих ярус хозяина. Без него — ярус хозяина, иначе `m`.",
        },
        {
          name: "labels",
          type: "Partial<FieldListLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "id" | "children" | "defaultValue" | "defaultChecked" | "onChange">',
          en: "`className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control).",
          ru: "`className`, `data-*` и остальные атрибуты `<div>` рамки поля (правило корня поля: `className`, `ref` и остальное → рамка, `id` → контрол).",
        },
      ],
    },
  ],
  labels: labelRows(FIELD_LIST_LABELS, {
    remove: {
      en: "`aria-label` of a row's remove button; `{row}` is the row's name.",
      ru: "`aria-label` кнопки удаления строки; `{row}` — имя строки.",
    },
    reorder: {
      en: "`aria-label` of a row's handle (`reorderable`); `{row}` is the row's name.",
      ru: "`aria-label` ручки строки (`reorderable`); `{row}` — имя строки.",
    },
    row: {
      en: "Name of a row without `getLabel` text; `{index}` counts from 1.",
      ru: "Имя строки без текста `getLabel`; `{index}` — номер с 1.",
    },
    namedRow: {
      en: "Name of a row with `getLabel` text; `{label}` is that text.",
      ru: "Имя строки с текстом `getLabel`; `{label}` — этот текст.",
    },
    lockedReason: {
      en: "Why the remove button of a pinned row (`getLocked`) is off: its tooltip and description.",
      ru: "Почему кнопка удаления закреплённой строки (`getLocked`) выключена: её подсказка и описание.",
    },
    maxReached: {
      en: "Text beside the disabled add button once the list holds `max` rows.",
      ru: "Текст у выключенной кнопки добавления, когда строк уже `max`.",
    },
    totals: {
      en: "Name of the totals row (`renderTotals`), shown in its first cell when that has no total.",
      ru: "Имя строки итогов (`renderTotals`), видно в её первой ячейке, если там нет итога.",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Moves through the fields of a row, then to its remove button (inside the field in a one-column list), its handle and on; a pinned row's remove takes focus to show why it is off.",
        ru: "Переводит фокус по полям строки, затем к её кнопке удаления (в списке из одного столбца — внутри поля), ручке и дальше; выключенная кнопка закреплённой строки принимает фокус, чтобы показать причину.",
      },
      {
        keys: "Enter · Space",
        en: "On the add button adds a row and focuses its first field; on a remove button removes the row and focuses the next row's remove button.",
        ru: "На кнопке добавления добавляет строку и ставит фокус в её первое поле; на кнопке удаления удаляет строку, фокус переходит к соседней.",
      },
      {
        keys: "Alt + ↑ · Alt + ↓",
        en: "With `reorderable`, moves the row up or down (from its handle).",
        ru: "С `reorderable` переносит строку выше или ниже (с ручки).",
      },
    ],
    aria: [
      {
        en: 'The rows are an `<ol role="list">` named by the list `label` (`aria-labelledby`); the list gives each row its position, and the role keeps it under `list-style: none` in WebKit.',
        ru: 'Строки — `<ol role="list">`, названный подписью списка `label` (`aria-labelledby`); номер строки даёт сам список, а роль сохраняет его при `list-style: none` в WebKit.',
      },
      {
        en: "The heading row is `aria-hidden`: each field in a cell carries its column heading as its own label, read but not shown on wide rows.",
        ru: "Заголовки столбцов видны один раз и скрыты от скринридеров (`aria-hidden`): каждое поле в ячейке получает подпись своего столбца как собственную, читаемую, но не видимую на широких строках.",
      },
      {
        en: "The `<ol>` is described by the list's `hint` and `error` (`aria-describedby`), which speak for every row.",
        ru: "`<ol>` описан `hint` и `error` списка (`aria-describedby`): они относятся ко всем строкам.",
      },
      {
        en: "In a narrow container the heading row goes and each field's label shows above it.",
        ru: "В узком контейнере заголовки уходят, и подпись каждого поля показывается над ним.",
      },
      {
        en: "The totals row (`renderTotals`) is a `group` named by `labels.totals`; each total is read after its column heading.",
        ru: "Строка итогов (`renderTotals`) — `group` с именем `labels.totals`; каждый итог читается после заголовка своего столбца.",
      },
      {
        en: "The remove button is «Удалить {row}», the handle «Переместить {row}»: the row's name from `getLabel`, else its number.",
        ru: "Кнопка удаления — «Удалить {row}», ручка — «Переместить {row}»: имя строки из `getLabel` или её номер.",
      },
      {
        en: "A pinned row keeps its remove button: `aria-disabled`, described by `labels.lockedReason` (a tooltip on hover and focus); with `reorderable` Dnd's lock stands in place of the handle.",
        ru: "У закреплённой строки кнопка удаления остаётся: `aria-disabled`, описана `labels.lockedReason` (подсказка при наведении и фокусе); с `reorderable` на месте ручки — замок Dnd.",
      },
    ],
  },
};
