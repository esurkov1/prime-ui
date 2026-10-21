# FieldList

**Category:** inputs
**Kind:** composite

> An editable list of records of one shape — invoice lines, specs, contacts, prices by period: one row per record on one grid, the column headings once above the rows, the row's actions at its end and an add button under them.

## When to use
- A form part where a person adds, edits and removes several records of the same fields: invoice lines, contacts of a client, specs of a plan, recipients.
- A base value with overrides (a price and its changes by month): the base is the first row, pinned with `getLocked`, each override is a row.
- A list of short texts in the order a person sets (selling points, checklist items): one column, `reorderable`; each row ends with its remove button and its handle.
- Every row shows its actions in sight — the remove «×» and, with `reorderable`, the grip after it — however many columns it has (the default `rowActions="buttons"`). `rowActions="menu"` only for a `reorderable` list on a touch-first screen, where «Выше» / «Ниже» in one «⋯» replace a drag; never for a list without `reorderable`, whose menu would hold one item.
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
├─ sheet                     the rows on one grid (`variant="surface"`: a fill one step up the ladder)
│  ├─ heading row            the column headings, once (aria-hidden; each field carries its heading as its label)
│  ├─ <ol>                   the rows (Dnd.Sortable with `reorderable` and the buttons)
│  │  └─ <li> row            [a cell per column] [end: × | ⋯] [grip: handle | lock]
│  │     └─ cell             one kit field without `label`, named by its column heading
│  └─ totals row             `renderTotals`: a group «Итого», a total per column on the same tracks
└─ add row                   Button «addLabel» (leaves at `max`)
```
A leaf: rows come from `value` through `renderItem`, which returns one element per column (a fragment). Every framed kit field (Input, Select, Datepicker, NativeSelect, ColorField…) in a cell takes its column heading as its label: read by screen readers, not shown while the heading row is on screen, shown above the field once the rows stack in a narrow container. `ColorPresets` takes it as the name of its trigger. Every row, a one-column row too, ends with the same slots: the remove «×» (or the «⋯» menu) and, with `reorderable` buttons, the grip after it — never a segment inside a field, where a «×» would read as «clear the text».

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### FieldList
Generic `FieldList<T>`; `ref` → `HTMLDivElement` (the field frame). An editable list of records of one shape: column headings once, a row of fields per record (`<ol>`) on one grid, the row's actions at its end, add under the rows; rows stack in a container under 30rem.

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `readonly FieldListColumn[]` | — (required) | The columns in cell order: `label` (the heading; it names the field of the column in every row), `width` (`fill` \| `compact` \| `xs` \| `s` \| `m`), `required` (a `*` after the heading). |
| `renderItem` | `(item: T, row: FieldListRow<T>) => ReactNode` | — (required) | The cells of a row, one element per column (a fragment): kit fields without `label`. `row` has `index`, `update(patch)` and `remove()`. |
| `renderTotals` | `(items: readonly T[]) => ReactNode` | — | The totals row under the rows: one node per column (a fragment), `null` where none; each aligned as its column's field text. The first cell without a total reads `labels.totals`. |
| `getId` | `(item: T) => string` | — (required) | Stable unique id of an item: the row key and the drag id. |
| `value` | `readonly T[]` | — | The rows (controlled). |
| `defaultValue` | `readonly T[]` | `[]` | The first rows (uncontrolled). |
| `onValueChange` | `(value: T[]) => void \| Promise<void>` | — | The new list after an edit (`row.update`), an add, a remove or a move. Return the save's promise: the new list shows while it is pending, the owner's again on a reject (say why with `error`). |
| `createItem` | `() => T` | — | A new empty item; with it the add button shows under the rows (until `max`) and focus goes to the new row's first field. |
| `addLabel` | `string` | — | Text of the add button: the object it adds, without the verb its «+» already says («Позиция»). |
| `getLabel` | `(item: T) => string` | — | The row's own text (its title field) for the remove button, the handle, the menu button and move announcements; else the row number. |
| `getLocked` | `(item: T) => boolean` | — | Pinned rows: the remove stays in its place, off, and says why (`labels.lockedReason`); with `reorderable` a lock takes the handle's place and the row holds it. In the menu every item is off. |
| `reorderable` | `boolean` | `false` | Rows move: with `rowActions="buttons"` by a handle that ends the row, after the remove button (drag, a touch hold, Alt + ↑ / ↓); with `"menu"` by its items «Выше» and «Ниже» and Alt + ↑ / ↓ on the menu button. |
| `stackedLabels` | `boolean` | `true` | Stacked rows (under 30rem) show each field's column heading as its label. `false` for values that name themselves («Аренда: 20 окт → 2 нояб»): no labels, the headings stay the fields' names. |
| `rowActions` | `"buttons" \| "menu"` | `"buttons"` | How a row offers its actions: `buttons` — a remove button «×» and, with `reorderable`, the handle after it; `menu` — one «⋯» button whose menu moves the row up or down and removes it. |
| `variant` | `"plain" \| "surface"` | `"plain"` | Look of the list: `plain` — the rows on the host surface; `surface` — the rows on a fill of their own, one step up the surface ladder, with side padding. |
| `min` | `number` | `0` | The fewest rows: at this count the remove buttons are disabled. |
| `max` | `number` | — | The most rows: at this count the add button closes up in place and comes back once a row is removed. The list says no limit text of its own; a limit the person should know goes in `hint`. |
| `label` | `ReactNode` | — | Heading of the list; names the `<ol>`. Omit it inside a `Fieldset` whose legend names the list. |
| `aria-label` | `string` | — | Name of the `<ol>` when no visible `label` names it (a section heading above the list). |
| `hint` | `ReactNode` | — | Help text under the list; hidden while `error` shows. |
| `hintTone` | `"neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Status color of `hint` («Осталось 12 дней» in `warning`). The words carry the status, the color repeats it; an `error` replaces the hint and its tone. A validation error is `error`, never a `danger` hint. |
| `error` | `ReactNode` | — | A problem of the list as a whole («Добавьте хотя бы одну позицию»); a field's own error goes on that field. |
| `disabled` | `boolean` | `false` | Disables every field, handle, button and menu button; a disabled `Fieldset` around it sets it too. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Tier of the headings, buttons and the kit fields that read the host tier. Without it the host tier, else `m`. |
| `labels` | `Partial<FieldListLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "id" \| "children" \| "defaultValue" \| "defaultChecked" \| "onChange">` | — | `className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control). |

## Variants

### variant
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `plain` | the rows on the host surface, no side padding, 8 apart with no lines on one line per record; lines between stacked records | the list is the content of its card or section | yes |
| `surface` | the rows on a fill one step up the surface ladder, radius `--prime-radius-l`, 12 of side padding and 12 of air under the last row | the list stands among other fields of a form or card and must read as one block | |

### rowActions
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `buttons` | a soft «×» at the row's end, as tall as the fields and, with `reorderable`, the grip after it; a pinned row: «×» off, then the lock | every list: one action (remove) or remove and move, any number of columns | yes |
| `menu` | one soft «⋯» per row, as tall as the fields; its Dropdown holds «Выше», «Ниже» (with `reorderable`), a separator and «Удалить» (danger) | a `reorderable` list on a touch-first screen, where moving by the menu replaces a drag; never without `reorderable` | |

### width (column)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fill` | shares the free width with the other `fill` columns | names, descriptions, any text | yes |
| `compact` | as wide as the widest of its controls, heading and total — the gap after it is the column gap like every other | an icon-only `Select`, a `ColorPresets` swatch, a checkbox | |
| `xs` | 96 px | a number of a few digits: a share, a percent, a count | |
| `s` | 144 px | a quantity, a code, a number of days | |
| `m` | 192 px | an amount with its unit, a date, a phone | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `reorderable` | buttons: a grip at the very end of every row, after the remove button, Alt + ↑ / ↓ on it; menu: «Выше» and «Ниже» in the menu, Alt + ↑ / ↓ on «⋯» | the order of the records matters (a pricing page, a checklist, payment stages) | `false` |
| `getLocked` | the remove button in its place, off, with a tooltip saying why (`labels.lockedReason`); with `reorderable` a lock where the grip is and the row holds its place; in the menu every item off, «Удалить» says why | a base value, system records a person cannot drop | — |
| `createItem` | the add button under the rows, aligned with the first column | the person grows the list | — |
| `min` · `max` | remove buttons off at `min`; the add button closes up at `max` and comes back when a row leaves — no limit text of its own, a limit the person should know goes in `hint` | the record count is bounded | `0` · — |
| `renderTotals` | a row of totals under the rows over a faint line, each on its column, aligned as the column's field text; «Итого» in the first cell without a total | the rows add up (shares, amounts, hours) | — |
| `stackedLabels` | `true`: once the rows stack, each field shows its column heading above it; `false`: the stacked rows show no labels, the headings stay the fields' hidden names | `false` when the values name themselves («Аренда: 20 окт → 2 нояб», «1 200 ₽»); keep `true` for generic fields («Параметр», «Значение») | `true` |

**Combinations**
- Recommended: `label` on the list (or a `Fieldset` legend around it), one heading per column, a `getLabel` from the title field, an `addLabel` that says what is added.
- Allowed but rare: one column — the heading row is not drawn, the list label names the rows.
- Pointless: `getLocked` on every row with `createItem` — nothing can be removed or moved; `variant="surface"` on a list that is alone in its card — a fill inside a fill.
- Forbidden: a `label` on every field of a row, a numbered label («Пункт 1», «Пункт 2»), a unit in a heading when the field shows it.

## States
| State | Driven by | DOM |
|---|---|---|
| empty | `value` with no items | no heading row; only the add button (with `createItem`) |
| at min | `value.length <= min` | remove buttons (or «Удалить» items) `disabled` |
| at max | `value.length >= max` | no add button: it closes up in place (`partPresence`) and rises in again when a row leaves |
| pinned row | `getLocked(item)` | `data-locked="true"` on the `<li>`; the remove button stays in its slot, `disabled` behind a focusable Tooltip host, its tooltip `labels.lockedReason`; with `reorderable` Dnd's lock in the grip box; in the menu every item `disabled`, «Удалить» described by `labels.lockedReason` |
| hover | the pointer over a row of a `surface` list (`(hover: hover)` only; a `plain` row has no fill of its own) | the whole row takes the field fill (`--prime-color-fill-muted`) and its fields the surface fill (`--prime-color-layer-current`) |
| invalid | `error` (the list), a field's own `error` | the list's message under the add row; a field's under the field in its row |
| disabled | `disabled` (or a disabled Fieldset) | `data-disabled="true"` on the frame; fields, handles, buttons and menu buttons disabled through the kit's disabled context |
| stacked | container narrower than 30rem | heading row hidden; the compact columns, the first field and the actions on the first line, every other field on a line of its own with its label shown (none with `stackedLabels={false}`, and the lines stand 12 apart); `data-stack` on the body keeps the first field at least 160 wide: `actions` when it is too narrow beside the actions (they end the second line, after the next field), `main` when it is too narrow even without them (it takes the full width under the compact columns and the actions); each total on its own line after its column name |
| saving | a promise from `onValueChange` | the rows show the new list, `aria-busy="true"` on the `<ol>`; a reject brings the owner's list back |
| rows come and go | the add button, a remove, a menu move, a new `value` | a row the data adds rises in once (`enterMotion`), a removed one closes up in place and the rows below glide up (`listPresence`); any other change of the rows' set or order (a row added in the middle, a menu move, a new order in `value`) glides every row from where it stood (`useFlipList`), a drag leaves the glide to Dnd; still under reduced motion; the heading row rises in with the first row and closes up with the last (`partPresence`); the first render stays still |

## Layout & spacing
- One grid for the list: every row, the heading row and the totals row share one track list `[columns] [end] [grip]`, so the columns line up like a table's; the end fits the row's «×» or «⋯» of the tier, the grip (with `reorderable` buttons) is one `xs` control wide (the handle or the lock) and ends the row on the inline-end side (on the left in RTL). Every row fills the same slots: a pinned row shows its remove off, never a hole.
- On `surface` rows stand edge to edge, 8 of padding above and below their fields, and a faint line parts two rows (`hairline`), inset by the side padding, none above the first row. A `plain` list on one line per record draws no lines: its rows stand one gap apart (8, `--prime-space-2`: 4 of padding above and below each), the air between the fields parts them, and its headings keep 8 above the first row's fields. Columns 12 apart (`--prime-space-3`).
- `plain`: side padding 0. `surface`: the sheet's fill (`--prime-color-layer-current` at its `data-depth`), radius `--prime-radius-l`, 12 of side padding on every row and 12 above the headings and under the last row.
- A `compact` column is measured: its track is the widest of its controls, its heading and its total, so the gaps between columns are all 12.
- The «×» and the «⋯» are `soft` neutral icon buttons of the row's tier: a square as tall as the fields, one column gap (12) after the last field, so the row starts on a field's fill and ends on the button's — one block, its end edge as far from the host's end as its start is from the host's start. The handle and the lock are a grip, not a press target: they stay without a fill.
- The remove button, the menu button, the handle and the lock stand on the middle of the first line of fields, so a field's error under it grows the row downwards only.
- The totals row stands under the last row over a faint line; a total's text sits where its column's field text does: at the start, or at the end for a field that ends its number there (an `Input` with `inputMode="decimal"` and an end `Input.InlineAffix`). Stacked, every total ends its line.
- The add button lines up with the sheet's start, 12 under it.
- Under 30rem of its own width (a container query): rows stack — the first line holds the compact columns, the first field and the actions; the other fields take the full width under it, 16 apart; rows 12 of padding above and below, and a faint line parts two records in both variants (edge to edge on `plain`), since one record spans several lines; a one-column `plain` list stays on one line per record and keeps its 8 apart with no lines. The first field keeps at least 160 (measured, so a name such as «Вход через SSO» stays whole at 320 and 360): too narrow beside the actions, they end the second line after the next field; too narrow even without them (a narrow card), the field takes the full width under the compact columns and the actions.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves through the fields of a row, then to its remove button and its handle (or its menu button) and on; a pinned row's remove takes focus to show why it is off. |
| `Enter` · `Space` | On the add button adds a row and focuses its first field; on a remove button removes the row and focuses the next row's remove button; on a menu button opens the row's menu. |
| `Alt + ↑` · `Alt + ↓` | With `reorderable`, moves the row up or down (from its handle, or from its menu button with `rowActions="menu"`); focus stays on it. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The rows are an `<ol role="list">` named by the list `label` (`aria-labelledby`); the list gives each row its position, and the role keeps it under `list-style: none` in WebKit.
- The heading row is `aria-hidden`: each field in a cell carries its column heading as its own label, read but not shown on wide rows.
- The `<ol>` is described by the list's `hint` and `error` (`aria-describedby`), which speak for every row.
- In a narrow container the heading row goes and each field's label shows above it; with `stackedLabels={false}` the labels stay hidden and still name the fields.
- With `rowActions="menu"` the row's «⋯» button opens a `role="menu"` (Dropdown) named «Действия: {row}»; it lists Alt + ↑ / ↓ in `aria-keyshortcuts`, and a move says the row's new place in a polite live region.
- The totals row (`renderTotals`) is a `group` named by `labels.totals`; each total is read after its column heading.
- The remove button is «Удалить: {row}», the handle «Переместить: {row}»: the row's name from `getLabel`, else its number.
- A pinned row keeps its remove button: `aria-disabled`, described by `labels.lockedReason` (a tooltip on hover and focus); with `reorderable` Dnd's lock stands in place of the handle. In the menu its items are `disabled` and the remove item is described by `labels.lockedReason`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `remove` | `"Удалить: {row}"` | `aria-label` of a row's remove button; `{row}` is the row's name. |
| `reorder` | `"Переместить: {row}"` | `aria-label` of a row's handle (`reorderable`); `{row}` is the row's name. |
| `actions` | `"Действия: {row}"` | `aria-label` of a row's menu button (`rowActions="menu"`); `{row}` is the row's name. |
| `moveUp` | `"Выше"` | Menu item that moves the row one place up. |
| `moveDown` | `"Ниже"` | Menu item that moves the row one place down. |
| `removeItem` | `"Удалить"` | Menu item that removes the row. |
| `moved` | `"{row}: позиция {position} из {total}"` | Announced after a move from the menu or its keys; `{row}` is the row's name, `{position}` its new place, `{total}` the row count. |
| `row` | `"строка {index}"` | Name of a row without `getLabel` text; `{index}` counts from 1. |
| `namedRow` | `"«{label}»"` | Name of a row with `getLabel` text; `{label}` is that text. |
| `lockedReason` | `"Закреплённую строку нельзя удалить"` | Why a pinned row (`getLocked`) cannot be removed: the tooltip of its remove button, the description of its menu's remove item. |
| `totals` | `"Итого"` | Name of the totals row (`renderTotals`), shown in its first cell when that has no total. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Lines of an invoice: the column headings stand once above the rows, each row has a remove button and the add button sits under them — `columns`, `renderItem`, `createItem`, `addLabel`. |
| [variants.tsx](examples/variants.tsx) | The two looks of the same list: the rows on the host surface, or on a fill of their own with side padding — `variant`. |
| [sizes.tsx](examples/sizes.tsx) | Every tier: the headings, the fields, the handle and the buttons follow the list's size — `size`. |
| [reorder.tsx](examples/reorder.tsx) | Selling points of a plan in the order of the pricing page: a one-column list has no headings and no numbers, each row ends with its remove button and then its handle, a point moves by the handle or Alt+arrows — `reorderable`, `getLabel`. |
| [row-menu.tsx](examples/row-menu.tsx) | Payment stages of a project on a touch-first screen, where a drag is awkward: one more-button per row holds move up, move down and remove, the moves are off at the ends and next to the pinned advance, and Alt+arrows on the button move the row too — `rowActions`, `reorderable`, `getLocked`. |
| [locked.tsx](examples/locked.tsx) | Specs of a plan on one line each: an icon picker and its color side by side in compact columns, the first three specs are pinned with a lock in the handle's place and a remove button that is off and says why, the rest reorder below them — `getLocked`, `width`, `reorderable`. |
| [base-row.tsx](examples/base-row.tsx) | A plan price and its changes by month in one table: the base price is the first, pinned row whose remove button is off and says why, each change is a row with its month and its price, and the unit sits in the field, not in a heading — `getLocked`, `labels`, `width`. |
| [limits.tsx](examples/limits.tsx) | Recipients of invoice reminders, from one to three: the last row cannot be removed, the add button leaves once the list is full and the hint names the limit — `min`, `max`, `hint`. |
| [errors.tsx](examples/errors.tsx) | Contacts of a client checked on save: a field's problem shows under that field in its row, a problem of the whole list under the list, and focus goes to the first wrong field; a `*` after a heading marks a required column — `error`, `required`. |
| [totals.tsx](examples/totals.tsx) | A deal bonus split between the team: the share takes a narrow column, and the totals row under the lines sums the shares and the amounts, each ending where its fields end their numbers — `renderTotals`, `width`. |
| [saving.tsx](examples/saving.tsx) | Removing a recipient is saved on the server: the row leaves at once and comes back with the reason if the server refuses — `onValueChange`, `error`. |
| [named-rows.tsx](examples/named-rows.tsx) | A rental bill in a 320 px column whose lines name themselves: each line keeps its item and its remove button on the first line and its amount under it, with no labels, while every field is still named by its column — `stackedLabels`. |
| [grouped.tsx](examples/grouped.tsx) | A rental bill kept in groups by type: a new line and a line whose type changes take their place in their group, and the rows below glide aside to make room — `value`, `onValueChange`, `createItem`. |
| [states.tsx](examples/states.tsx) | The same list editable and disabled while the request saves it: fields, handles and buttons turn off together — `disabled`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the lines: it sums them under the list and puts the saved lines back on reset — `value`, `onValueChange`. |
| [narrow.tsx](examples/narrow.tsx) | Specs of a plan in a 320 px column: the headings give way, the icon, its color and the name keep the first line, and the value takes the line under it with the remove button and the handle, each field with its own label — `columns`, `width`. |
| [screen.tsx](examples/screen.tsx) | A record editor as a document page, a long form whose title, description and save stand in the content header and whose blocks are titled cards one under another: a plan's name, its specs and prices; repeating records as FieldList rows with the headings once, an icon and its color side by side, a base price pinned above its changes, the price list on its own fill among the fields of its card, one value in three currencies in one row — `getLocked`, `compact`, `variant`. |

## Mistakes
- A `label` above every field of every row («Иконка», «Параметр», «Значение» four times) → a FieldList: the headings stand once, the fields take them as hidden labels.
- Numbered labels («Преимущество 1», «Преимущество 2») → none: the list label names the rows and the order is visible.
- One record split over two lines of half-width fields → one row; small attributes go to `compact` columns (icon-only `Select`, `ColorPresets`).
- A base value as a separate field above its overrides, in another geometry → the first row, pinned with `getLocked`.
- The unit in every heading («Цена, ₽ / день») and again in the field → the unit once, in `Input.InlineAffix`.
- A hint that explains what the lock already shows («Первые три всегда первыми») → no hint; the lock and the remove button's reason say it.
- A pinned row with an empty place where the others have a remove button → none to fix by hand: FieldList draws it off with `labels.lockedReason`; say the domain reason there («Базовую цену нельзя удалить»).
- A remove «×» as an `Input.Action` inside a one-field row → none: a «×» in a field reads as «clear the text»; FieldList ends every row with its own remove.
- A «⋯» menu or a «−» drawn by hand next to the rows → `rowActions`; a Card drawn around the list to set it apart from the form → `variant="surface"`.
- `rowActions="menu"` on a two-column list a person reorders all day → the buttons: the handle and «×» in sight are one gesture, the menu is three.
- `aria-label` written on every field in a cell → none: the column heading names the field.
- «Позиция» / «Сумма» above every field of every stacked row when the values already say what they are («Аренда: 20 окт → 2 нояб», «1 200 ₽») → `stackedLabels={false}`; never an empty column `label` to hide them, which leaves the fields unnamed.
- `createItem` dropped by hand once nothing is left to add (every section picked) → `max`: the add button leaves at the limit by itself; a limit the person should know is a `hint` («Не больше трёх получателей»), never a count beside the button.
- A grip, a remove button and an add button drawn by hand around a `.map()` of fields → FieldList.
- A total under the list typed by hand in a line of text, or a DataTable of fields to get a totals row → `renderTotals`.

## Related
- **Built from:** [Button](../button/COMPONENT.md) (add, remove, the menu button), [Dnd](../dnd/COMPONENT.md) (`reorderable`: `Dnd.Sortable`, `Dnd.Handle`; the lock of a pinned row), [Dropdown](../dropdown/COMPONENT.md) (`rowActions="menu"`), [Label](../label/COMPONENT.md) (headings), [Tooltip](../tooltip/COMPONENT.md) (why a pinned row's remove is off), the field frame (label, [Hint](../hint/COMPONENT.md) for the hint and error), [VisuallyHidden](../visually-hidden/COMPONENT.md)
- **See also:** [Input](../input/COMPONENT.md), [Select](../select/COMPONENT.md) (icon-only trigger), [ColorPicker](../color-picker/COMPONENT.md) (`ColorPresets`), [Fieldset](../fieldset/COMPONENT.md), [DataTable](../data-table/COMPONENT.md)
