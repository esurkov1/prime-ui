import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { FIELD_HINT_TONE_PROP } from "../../internal/field.api";
import { FIELD_LIST_LABELS } from "./FieldList";

export const api: ComponentApi = {
  parts: [
    {
      name: "FieldList",
      en: "Generic `FieldList<T>`; `ref` → `HTMLDivElement` (the field frame). An editable list of records of one shape: column headings once, a row of fields per record (`<ol>`) on one grid, the row's actions at its end, add under the rows; rows stack in a container under 30rem.",
      ru: "Редактируемый список однотипных записей: заголовки столбцов один раз над строками, строка полей на запись (`<ol>`) на общей сетке, действия строки в её конце, кнопка добавления под строками; в контейнере уже 30rem строки складываются.",
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
          en: "The cells of a row, one element per column (a fragment): kit fields without `label`. `row` has `index`, `update(patch)` and `remove()`.",
          ru: "Ячейки строки, по элементу на столбец (фрагмент): поля кита без `label`. `row` — `index`, `update(patch)` и `remove()`.",
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
          type: "() => T | Promise<T>",
          en: "A new empty item: the add button shows under the rows (until `max`), focus goes to the new row. A promise (the server makes the item): a placeholder row holds its place; a reject removes it.",
          ru: "Новая пустая запись: под строками кнопка добавления (пока меньше `max`), фокус уходит в новую строку. Промис (запись создаёт сервер): место держит строка-заглушка; reject её убирает.",
        },
        {
          name: "addLabel",
          type: "string",
          en: "Text of the add button: the object it adds, without the verb its «+» already says («Позиция»).",
          ru: "Текст кнопки добавления: что добавляется, без глагола — его уже говорит «+» («Позиция»).",
        },
        {
          name: "getLabel",
          type: "(item: T) => string",
          en: "The row's own text (its title field) for the remove button, the handle, the menu button and move announcements; else the row number.",
          ru: "Текст строки (её поле-название) для кнопки удаления, ручки, кнопки меню и объявлений о переносе; иначе — номер строки.",
        },
        {
          name: "getLocked",
          type: "(item: T) => boolean",
          en: "Pinned rows: the remove stays in its place, off, and says why (`labels.lockedReason`); with `reorderable` a lock takes the handle's place and the row holds it. In the menu every item is off.",
          ru: "Закреплённые строки: удаление на своём месте, выключено и объясняет почему (`labels.lockedReason`); с `reorderable` на месте ручки — замок, строка держит место. В меню все пункты выключены.",
        },
        {
          name: "getLockedReason",
          type: "(item: T) => string | undefined",
          en: "Why this pinned row (`getLocked`) cannot be removed, when the reason is the row's own; `undefined` or an empty string falls back to `labels.lockedReason`.",
          ru: "Почему нельзя удалить эту закреплённую строку (`getLocked`), если причина у строки своя; `undefined` или пустая строка — `labels.lockedReason`.",
        },
        {
          name: "reorderable",
          type: "boolean",
          default: "false",
          en: 'Rows move: with `rowActions="buttons"` by a handle that ends the row, after the remove button (drag, a touch hold, Alt + ↑ / ↓); with `"menu"` by its items «Выше» and «Ниже» and Alt + ↑ / ↓ on the menu button.',
          ru: 'Строки переносятся: при `rowActions="buttons"` за ручку в самом конце строки, после кнопки удаления (перетаскивание, удержание, Alt + ↑ / ↓); при `"menu"` пунктами «Выше» и «Ниже» и Alt + ↑ / ↓ на кнопке меню.',
        },
        {
          name: "stackedLabels",
          type: "boolean",
          default: "true",
          en: "Stacked rows (under 30rem) show each field's column heading as its label. `false` for values that name themselves («Аренда: 20 окт → 2 нояб»): no labels, the headings stay the fields' names.",
          ru: "Сложенные строки (уже 30rem) показывают заголовок столбца подписью поля. `false` — для значений, что называют себя сами («Аренда: 20 окт → 2 нояб»): без подписей, заголовки остаются именами полей.",
        },
        {
          name: "hideHeadings",
          type: "boolean",
          default: "false",
          en: "No heading row above the rows, for fields that name themselves (a placeholder, a value); each field keeps its column heading as its accessible name.",
          ru: "Без строки заголовков над строками — для полей, что называют себя сами (плейсхолдер, значение); имя поля для доступности — по-прежнему заголовок столбца.",
        },
        {
          name: "rowActions",
          type: '"buttons" | "menu"',
          default: '"buttons"',
          en: "How a row offers its actions: `buttons` — a remove button (trash) and, with `reorderable`, the handle after it; `menu` — one «⋯» button whose menu moves the row up or down and removes it.",
          ru: "Как строка даёт свои действия: `buttons` — кнопка удаления (корзина) и, с `reorderable`, ручка после неё; `menu` — одна кнопка «⋯», в её меню перенос выше или ниже и удаление.",
        },
        {
          name: "variant",
          type: '"plain" | "surface"',
          default: '"plain"',
          en: "Look of the list: `plain` — the rows on the host surface; `surface` — the rows on a fill of their own, one step up the surface ladder, with side padding.",
          ru: "Вид списка: `plain` — строки на поверхности хозяина; `surface` — строки на собственной подложке на ступень выше по лестнице поверхностей, с боковыми отступами.",
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
          en: "The most rows: at this count the add button closes up in place and comes back once a row is removed. The list says no limit text of its own; a limit the person should know goes in `hint`.",
          ru: "Наибольшее число строк: при нём кнопка добавления схлопывается на месте и возвращается, когда строку удалят. Своего текста о пределе список не пишет; предел, о котором человеку нужно знать, — в `hint`.",
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
          en: "Disables every field, handle, button and menu button; a disabled `Fieldset` around it sets it too.",
          ru: "Выключает все поля, ручки, кнопки и кнопки меню; выключенный `Fieldset` вокруг делает то же.",
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
    actions: {
      en: "`aria-label` of a row's menu button (`rowActions=\"menu\"`); `{row}` is the row's name.",
      ru: '`aria-label` кнопки меню строки (`rowActions="menu"`); `{row}` — имя строки.',
    },
    moveUp: {
      en: "Menu item that moves the row one place up.",
      ru: "Пункт меню, переносящий строку на место выше.",
    },
    moveDown: {
      en: "Menu item that moves the row one place down.",
      ru: "Пункт меню, переносящий строку на место ниже.",
    },
    removeItem: {
      en: "Menu item that removes the row.",
      ru: "Пункт меню, удаляющий строку.",
    },
    moved: {
      en: "Announced after a move from the menu or its keys; `{row}` is the row's name, `{position}` its new place, `{total}` the row count.",
      ru: "Объявление после переноса из меню или клавишами; `{row}` — имя строки, `{position}` — её новое место, `{total}` — число строк.",
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
      en: "Why a pinned row (`getLocked`) cannot be removed, unless `getLockedReason` gives its own: the tooltip of its remove button, the description of its menu's remove item.",
      ru: "Почему закреплённую строку (`getLocked`) нельзя удалить, если `getLockedReason` не назвал свою: подсказка её кнопки удаления, описание пункта удаления в меню.",
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
        en: "Moves through the fields of a row, then to its remove button and its handle (or its menu button) and on; a pinned row's remove takes focus to show why it is off.",
        ru: "Переводит фокус по полям строки, затем к её кнопке удаления и ручке (или кнопке меню) и дальше; выключенная кнопка закреплённой строки принимает фокус, чтобы показать причину.",
      },
      {
        keys: "Enter · Space",
        en: "On the add button adds a row and focuses its first field; on a remove button removes the row and focuses the next row's remove button; on a menu button opens the row's menu.",
        ru: "На кнопке добавления добавляет строку и ставит фокус в её первое поле; на кнопке удаления удаляет строку, фокус переходит к соседней; на кнопке меню открывает меню строки.",
      },
      {
        keys: "Alt + ↑ · Alt + ↓",
        en: 'With `reorderable`, moves the row up or down (from its handle, or from its menu button with `rowActions="menu"`); focus stays on it.',
        ru: 'С `reorderable` переносит строку выше или ниже (с ручки или, при `rowActions="menu"`, с кнопки меню); фокус остаётся на ней.',
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
        en: "In a narrow container the heading row goes and each field's label shows above it; with `stackedLabels={false}` the labels stay hidden and still name the fields.",
        ru: "В узком контейнере заголовки уходят, и подпись каждого поля показывается над ним; при `stackedLabels={false}` подписи остаются скрытыми и по-прежнему называют поля.",
      },
      {
        en: 'With `rowActions="menu"` the row\'s «⋯» button opens a `role="menu"` (Dropdown) named «Действия: {row}»; it lists Alt + ↑ / ↓ in `aria-keyshortcuts`, and a move says the row\'s new place in a polite live region.',
        ru: 'При `rowActions="menu"` кнопка «⋯» строки открывает `role="menu"` (Dropdown) с именем «Действия: {row}»; Alt + ↑ / ↓ перечислены в её `aria-keyshortcuts`, а новое место строки после переноса звучит в вежливой живой области.',
      },
      {
        en: "The totals row (`renderTotals`) is a `group` named by `labels.totals`; each total is read after its column heading.",
        ru: "Строка итогов (`renderTotals`) — `group` с именем `labels.totals`; каждый итог читается после заголовка своего столбца.",
      },
      {
        en: "The remove button is «Удалить: {row}», the handle «Переместить: {row}»: the row's name from `getLabel`, else its number.",
        ru: "Кнопка удаления — «Удалить: {row}», ручка — «Переместить: {row}»: имя строки из `getLabel` или её номер.",
      },
      {
        en: "While `onValueChange` or `createItem` is saving, the list has `aria-busy`; the placeholder row of a pending `createItem` is `aria-hidden`.",
        ru: "Пока `onValueChange` или `createItem` сохраняют, у списка `aria-busy`; строка-заглушка ожидающего `createItem` — `aria-hidden`.",
      },
      {
        en: "A pinned row keeps its remove button: `aria-disabled`, described by `labels.lockedReason` (a tooltip on hover and focus); with `reorderable` Dnd's lock stands in place of the handle. In the menu its items are `disabled` and the remove item is described by `labels.lockedReason`.",
        ru: "У закреплённой строки кнопка удаления остаётся: `aria-disabled`, описана `labels.lockedReason` (подсказка при наведении и фокусе); с `reorderable` на месте ручки — замок Dnd. В меню её пункты `disabled`, а пункт удаления описан `labels.lockedReason`.",
      },
    ],
  },
};
