# FieldList

**Category:** inputs
**Kind:** composite

> An editable list of records of one shape — invoice lines, specs, contacts, prices by period: one row per record, the column headings once above the rows, a remove button per row and an add button under them.

## When to use
- A form part where a person adds, edits and removes several records of the same fields: invoice lines, contacts of a client, specs of a plan, recipients.
- A base value with overrides (a price and its changes by month): the base is the first row, pinned with `getLocked`, each override is a row.
- A list of short texts in the order a person sets (selling points, checklist items): one column, `reorderable`.
- Small attributes of a record beside its text (an icon, a color): `width="compact"` columns with an icon-only `Select` (`Select.TriggerIcon` and no `Select.Value`) and a `ColorPresets` swatch.

## When not to use
- Records that are only read, sorted or filtered → [DataTable](../data-table/COMPONENT.md); its rows are data, not form fields.
- One value in several units or currencies (a deposit in ₽, $, ฿) → fields side by side in one row of the form, each unit in `Input.InlineAffix`, under one heading; not a list a person grows.
- A set of tags or values picked from options → [TagSelect](../tag-select/COMPONENT.md).
- Reordering items that are not form rows (menu sections, cards) → [Dnd](../dnd/COMPONENT.md) or [List](../list/COMPONENT.md) `onReorder`.
- A record with many fields or long texts per row → a list of records that opens each one in a [Drawer](../drawer/COMPONENT.md); a row holds up to four short fields.

## Import
```tsx
import { FieldList, type FieldListColumn } from "prime-ui-kit";
```

## Anatomy
```
FieldList                    field frame: label · the list · hint / error
├─ heading row               the column headings, once (aria-hidden; each field carries its heading as its label)
├─ <ol>                      the rows (Dnd.Sortable with `reorderable`)
│  └─ <li> row               [lead: handle | lock] [a cell per column] [end: remove]
│     └─ cell                one kit field without `label`, named by its column heading
└─ add row                   Button «addLabel» (+ `labels.maxReached` at `max`)
```
A leaf: rows come from `value` through `renderItem`, which returns one element per column (a fragment). Every framed kit field (Input, Select, Datepicker, NativeSelect, ColorField…) in a cell takes its column heading as its label: read by screen readers, not shown while the heading row is on screen, shown above the field once the rows stack in a narrow container. `ColorPresets` takes it as the name of its trigger.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### FieldList
Generic `FieldList<T>`; `ref` → `HTMLDivElement` (the field frame). An editable list of records of one shape: column headings once, a row of fields per record (`<ol>`), remove per row, add under the rows; rows stack under 480 px.

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `readonly FieldListColumn[]` | — (required) | The columns in cell order: `label` (the heading; it names the field of the column in every row), `width` (`fill` \| `compact` \| `s` \| `m`), `required` (a `*` after the heading). |
| `renderItem` | `(item: T, row: FieldListRow<T>) => ReactNode` | — (required) | The cells of a row, one element per column (a fragment): kit fields without `label`. `row` has `index`, `update(patch)` and `remove()`. |
| `getId` | `(item: T) => string` | — (required) | Stable unique id of an item: the row key and the drag id. |
| `value` | `readonly T[]` | — | The rows (controlled). |
| `defaultValue` | `readonly T[]` | `[]` | The first rows (uncontrolled). |
| `onValueChange` | `(value: T[]) => void` | — | The new list after an edit (`row.update`), an added, removed or moved row. |
| `createItem` | `() => T` | — | A new empty item; with it the add button shows under the rows and focus goes to the new row's first field. |
| `addLabel` | `string` | — | Text of the add button: what is added («Добавить позицию»). |
| `getLabel` | `(item: T) => string` | — | The row's own text (its title field) for the remove button, the handle and drag announcements; else the row number. |
| `getLocked` | `(item: T) => boolean` | — | Pinned rows: a lock in the lead column, no remove button, they hold their place while others move. |
| `reorderable` | `boolean` | `false` | Rows move by a leading handle: drag, a touch hold, Alt + ↑ / ↓. |
| `min` | `number` | `0` | The fewest rows: at this count the remove buttons are disabled. |
| `max` | `number` | — | The most rows: at this count the add button is disabled with `labels.maxReached` beside it. |
| `label` | `ReactNode` | — | Heading of the list; names the `<ol>`. Omit it inside a `Fieldset` whose legend names the list. |
| `aria-label` | `string` | — | Name of the `<ol>` when no visible `label` names it (a section heading above the list). |
| `hint` | `ReactNode` | — | Help text under the list; hidden while `error` shows. |
| `error` | `ReactNode` | — | A problem of the list as a whole («Добавьте хотя бы одну позицию»); a field's own error goes on that field. |
| `disabled` | `boolean` | `false` | Disables every field, handle and button; a disabled `Fieldset` around it sets it too. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of the headings, buttons and the kit fields that read the host tier. Without it the host tier, else `m`. |
| `labels` | `Partial<FieldListLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "id" \| "children" \| "defaultValue" \| "defaultChecked" \| "onChange">` | — | `className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control). |

## Variants

### width (column)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fill` | shares the free width with the other `fill` columns | names, descriptions, any text | yes |
| `compact` | two control heights wide | an icon-only `Select`, a `ColorPresets` swatch, a checkbox | |
| `s` | 144 px | a quantity, a code, a number of days | |
| `m` | 192 px | an amount with its unit, a date, a phone | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `reorderable` | a grip before every row; Alt + ↑ / ↓ on it | the order of the records matters (a pricing page, a checklist) | `false` |
| `getLocked` | a lock where the grip is, no remove button; the row holds its place | a base value, system records a person cannot drop | — |
| `createItem` | the add button under the rows, aligned with the first column | the person grows the list | — |
| `min` · `max` | remove buttons off at `min`; the add button off with «Не больше {max}» at `max` | the record count is bounded | `0` · — |

**Combinations**
- Recommended: `label` on the list (or a `Fieldset` legend around it), one heading per column, a `getLabel` from the title field, an `addLabel` that says what is added.
- Allowed but rare: one column — the heading row is not drawn, the list label names the rows.
- Pointless: `getLocked` on every row with `createItem` — nothing can be removed or moved.
- Forbidden: a `label` on every field of a row, a numbered label («Пункт 1», «Пункт 2»), a unit in a heading when the field shows it.

## States
| State | Driven by | DOM |
|---|---|---|
| empty | `value` with no items | no heading row; only the add button (with `createItem`) |
| at min | `value.length <= min` | remove buttons `disabled` |
| at max | `value.length >= max` | add button `disabled`, `labels.maxReached` beside it |
| pinned row | `getLocked(item)` | `data-locked="true"` on the `<li>`; a lock, no remove button |
| invalid | `error` (the list), a field's own `error` | the list's message under the add row; a field's under the field in its row |
| disabled | `disabled` (or a disabled Fieldset) | `data-disabled="true"` on the frame; fields, handles and buttons disabled through the kit's disabled context |
| stacked | container narrower than 480 px | heading row hidden, each row's fields in one column with their labels shown |

## Layout & spacing
- Rows 12 apart (`--prime-space-3`); columns 12 apart; the heading row sits at the tier's label gap above the first row.
- Every row and the heading row share one track list: `[lead] [columns] [end]`; the lead fits the grip, the end fits a remove button of the tier.
- The handle, the lock and the remove button stand on the middle of the first line of fields, so a field's error under it grows the row downwards only.
- The add button lines up with the first column of fields, 12 under the last row.
- Under 480 px of its own width (a container query): rows stack, fields 16 apart inside a row, rows 24 apart.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves through the fields of a row, then to its remove button and on. |
| `Enter` · `Space` | On the add button adds a row and focuses its first field; on a remove button removes the row and focuses the next row's remove button. |
| `Alt + ↑` · `Alt + ↓` | With `reorderable`, moves the row up or down (from its handle). |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The rows are an `<ol>` named by the list `label` (`aria-labelledby`); the list gives each row its position.
- The heading row is `aria-hidden`: each field in a cell carries its column heading as its own label, read but not shown on wide rows.
- In a narrow container the heading row goes and each field's label shows above it.
- The remove button is «Удалить {row}», the handle «Переместить {row}»: the row's name from `getLabel`, else its number.
- A pinned row has a lock in place of the handle and no remove button; without `reorderable` the lock is an image named «Закреплена».

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `remove` | `"Удалить {row}"` | `aria-label` of a row's remove button; `{row}` is the row's name. |
| `reorder` | `"Переместить {row}"` | `aria-label` of a row's handle (`reorderable`); `{row}` is the row's name. |
| `row` | `"строку {index}"` | Name of a row without `getLabel` text; `{index}` counts from 1. |
| `namedRow` | `"«{label}»"` | Name of a row with `getLabel` text; `{label}` is that text. |
| `locked` | `"Закреплена"` | Spoken name of the lock of a pinned row in a list without `reorderable`. |
| `maxReached` | `"Не больше {max}"` | Text beside the disabled add button once the list holds `max` rows. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Lines of an invoice: the column headings stand once above the rows, each row has a remove button and the add button sits under them — `columns`, `renderItem`, `createItem`, `addLabel`. |
| [sizes.tsx](examples/sizes.tsx) | Every tier: the headings, the fields, the handle and the buttons follow the list's size — `size`. |
| [reorder.tsx](examples/reorder.tsx) | Selling points of a plan in the order of the pricing page: a one-column list has no headings and no numbers, a point moves by its handle or Alt+arrows — `reorderable`, `getLabel`. |
| [locked.tsx](examples/locked.tsx) | Specs of a plan on one line each: an icon picker and a color swatch take compact columns, the first three specs are pinned with a lock and the rest reorder below them — `getLocked`, `width`, `reorderable`. |
| [base-row.tsx](examples/base-row.tsx) | A plan price and its changes by month in one table: the base price is the first, pinned row, each change is a row with its month and its price, and the unit sits in the field, not in a heading — `getLocked`, `width`. |
| [limits.tsx](examples/limits.tsx) | Recipients of invoice reminders, from one to three: the last row cannot be removed and the add button says why it is off once the list is full — `min`, `max`, `hint`. |
| [errors.tsx](examples/errors.tsx) | Contacts of a client checked on save: a field's problem shows under that field in its row, a problem of the whole list under the list, and focus goes to the first wrong field; a `*` after a heading marks a required column — `error`, `required`. |
| [states.tsx](examples/states.tsx) | The same list editable and disabled while the request saves it: fields, handles and buttons turn off together — `disabled`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the lines: it sums them under the list and puts the saved lines back on reset — `value`, `onValueChange`. |
| [narrow.tsx](examples/narrow.tsx) | The invoice lines in a 320 px column: the headings give way, each row stacks its fields with their own labels and rows stand a group apart — `columns`. |
| [screen.tsx](examples/screen.tsx) | A record editor as a document page, a long form whose title, description and save stand in the content header: a plan's name, its specs and prices in one form; repeating records as FieldList rows with the headings once, a base price pinned above its changes, one value in three currencies in one row — `getLocked`, `compact`. |

## Mistakes
- A `label` above every field of every row («Иконка», «Параметр», «Значение» four times) → a FieldList: the headings stand once, the fields take them as hidden labels.
- Numbered labels («Преимущество 1», «Преимущество 2») → none: the list label names the rows and the order is visible.
- One record split over two lines of half-width fields → one row; small attributes go to `compact` columns (icon-only `Select`, `ColorPresets`).
- A base value as a separate field above its overrides, in another geometry → the first row, pinned with `getLocked`.
- The unit in every heading («Цена, ₽ / день») and again in the field → the unit once, in `Input.InlineAffix`.
- A hint that explains what the lock already shows («Первые три всегда первыми») → no hint; the lock says it.
- `aria-label` written on every field in a cell → none: the column heading names the field.
- A grip, a remove button and an add button drawn by hand around a `.map()` of fields → FieldList.

## Related
- **Built from:** [Button](../button/COMPONENT.md) (add, remove), [Dnd](../dnd/COMPONENT.md) (`reorderable`: `Dnd.Sortable`, `Dnd.Handle`), [Label](../label/COMPONENT.md) (headings), `Icon` (lock), the field frame (label, hint, error)
- **See also:** [Input](../input/COMPONENT.md), [Select](../select/COMPONENT.md) (icon-only trigger), [ColorPicker](../color-picker/COMPONENT.md) (`ColorPresets`), [Fieldset](../fieldset/COMPONENT.md), [DataTable](../data-table/COMPONENT.md)
