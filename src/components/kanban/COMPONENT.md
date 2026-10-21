# Kanban

**Category:** data-display
**Kind:** composite

> A board of status columns: cards reorder within a column and move between columns by pointer, touch hold and keyboard, with announcements, WIP limits, loading and empty states and a layout that scrolls inside itself at any width.

## When to use
- Work items that flow through statuses and are moved by hand: tasks, tickets, orders, invoices, deals.
- A team needs to see the load of every status at once (counts, WIP limits).
- The status change is the main action on the screen, and its order inside a status matters.

## When not to use
- Records with many attributes to compare, sort or filter → use [DataTable](../data-table/COMPONENT.md).
- One list to reorder, or items carried onto folders or assignees → use [Dnd](../dnd/COMPONENT.md) directly.
- A linear process the user walks through once → use [Stepper](../stepper/COMPONENT.md).
- A history of events → use [Timeline](../timeline/COMPONENT.md).
- Work planned on dates, where duration and overlap matter → use [Gantt](../gantt/COMPONENT.md).

## Import
```tsx
import {
  Kanban,
  type KanbanColumn,
  type KanbanColumnGroup,
  type KanbanColumnMove,
  type KanbanField,
  KanbanFieldsMenu,
  type KanbanMove,
  type KanbanValue,
} from "prime-ui-kit";
```

## Anatomy
```
Kanban.Root                          board: horizontal strip of columns, its own Dnd.Root if none above
├─ placeholder columns               while `loading` and `columns` is empty: `loadingColumns` columns of Skeleton title and cards
├─ <div role="group"> per group      with `columnGroups`: the group heading over its own <ul>; columns stay inside their group
└─ <ul> (Dnd.Sortable, axis x)       the columns in `columnOrder`
   └─ <li> column (from `columns`)   no well with a header plate (`plain`) or a header line (`line`), or a `fill-muted` well (`well`)
      ├─ header                      title (`columnTitleAs`, h3) · count Badge (the stage color) · renderColumnActions(column) · [grip Dnd.Handle, a lock when `locked`]
      │  ├─ description              muted line under the title (`column.description`)
      │  └─ meta                     the stage's figures (`renderColumnMeta(column)`), a line per array entry
      └─ <ul> (Dnd.Sortable)         own vertical scroll; Skeleton cards while loading; EmptyPage (Dnd `empty`) when empty
         └─ Kanban.Item              <li> card from renderItem(item); with getItemHref an <a> covers it
            ├─ Kanban.ItemSection    optional zone of parts; zones stand apart over a faint line, an empty one is not drawn
            ├─ Kanban.ItemHeader     optional top row over a faint hairline: key · priority (or a full-width Thumbnail cover)
            ├─ Kanban.ItemTitle      title, up to three lines; with `number` / an owner Avatar.Root one cut row
            ├─ Kanban.ItemDescription  muted meta line: id, due date
            ├─ Kanban.ItemResource   a unit of the record: a mark (ProgressCircle s) · name over a caption
            ├─ Kanban.ItemFact       a 14 px icon + a secondary caption line
            ├─ Kanban.ItemBadges     wrapping row of Badge (a Badge.Group)
            └─ Kanban.ItemFooter     row: Kanban.ItemCount … at the start, text cut, the last child (assignee, date) at the end
               └─ Kanban.ItemCount   icon + number (an icon alone: the channel)
KanbanFieldsMenu                     the kit's view trigger (columns icon · «Вид» · count Badge) + Dropdown: «На карточке» (or `group`) check items, a grip each with `fieldOrder` · «По умолчанию» once changed; in Page.Tools beside the filter
```
Columns and cards are application data (`columns`, `items`); the board state is where each card stands: `value` maps a column id to its card ids in order, and `columnOrder` is the order of the columns. A card in flight is drawn by Dnd as a lifted clone; the column under it opens a gap where it lands.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Kanban.Root
Generic `Kanban.Root<T>`; `ref` → `HTMLDivElement`. The board: a strip of columns that scrolls sideways inside itself, each a labelled list of cards under a header. Mounts its own `Dnd.Root` unless one is above it. Give it a height.

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `readonly KanbanColumn[]` | — (required) | Every column: `{ id, title, description?, color?, limit?, locked? }`, drawn in `columnOrder`. `color` is a `PaletteColor` for the count badge, `limit` a WIP limit, `locked` keeps a system stage in place. |
| `columnGroups` | `readonly KanbanColumnGroup[]` | — | Phases of the board: `{ id, title, columnIds }`, a heading over each group's columns. A column moves only within its group; a move past the edge is refused and announced. Unnamed columns follow, headless. |
| `items` | `readonly T[]` | — (required) | Every card the board can show; `value` decides where each one stands. |
| `getId` | `(item: T) => string` | — (required) | Stable unique id of a card, the one used in `value`. |
| `getLabel` | `(item: T) => string` | the `id` | Spoken by the live region. |
| `value` | `KanbanValue` | — | Card ids per column (controlled): `{ [columnId]: id[] }`. Ids missing from `items` are skipped. |
| `defaultValue` | `KanbanValue` | `{}` | Initial card ids per column (uncontrolled). |
| `onValueChange` | `(value: KanbanValue, move: KanbanMove) => void \| Promise<void>` | — | A card moved: the new placement, then `{ id, from, to, index }` to save. Return the save's promise: the card waits busy in its new place; a rejection glides it back. |
| `reorderableColumns` | `boolean` | `false` | A grip (`Dnd.Handle`) at the end of every column header moves the column by pointer, touch hold and Alt + ← / →; the cards travel with it. |
| `columnOrder` | `readonly string[]` | — | Column ids in their order (controlled). Columns it does not name follow in `columns` order. |
| `defaultColumnOrder` | `readonly string[]` | the order of `columns` | Initial column ids in their order (uncontrolled). |
| `onColumnOrderChange` | `(order: readonly string[], move: KanbanColumnMove) => void \| Promise<void>` | — | A column moved: the new order, then `{ id, index }` to save. Return the save's promise: the column waits busy in its new place; a rejection glides it back. |
| `renderItem` | `(item: T) => ReactNode` | — (required) | Renders one card; return a `Kanban.Item`. |
| `getItemHref` | `(item: T) => string` | — | The card is a link: a real `<a>` named by `getLabel` covers it and is its tab stop — a click, ⌘/Ctrl-click, a middle click, a new tab. A press on it still drags the card; a drag never follows it. |
| `onItemOpen` | `(item: T, event: KanbanItemOpenEvent) => void` | — | Opens a card in place (a Drawer): a click, Enter or Space; never from a control inside it or after a drag. With `getItemHref` it gets plain clicks: `event.preventDefault()` routes in the app. |
| `columnTitleAs` | `"h2" \| "h3" \| "h4"` | `"h3"` | Heading level of the column titles in the page outline; the look does not change. |
| `renderColumnActions` | `(column: KanbanColumn) => ReactNode` | — | Trailing actions of a column header (add a card, a menu); kit controls inside take the `s` tier. |
| `renderColumnMeta` | `(column: KanbanColumn) => ReactNode \| readonly ReactNode[]` | — | The meta under a column's title and description: the stage's figures («12 сделок · 4,8 млн ₽»); an array is a line per entry, in order. Describes the column's list. |
| `canDrop` | `(id: string, columnId: string) => boolean \| string` | — | A workflow rule: refuses card `id` in column `columnId` — `false`, or a string that says why (spoken and shown under the carried card). The column turns `danger` before the release. |
| `variant` | `"plain" \| "line" \| "well"` | `"plain"` | No wells: `plain` — a filled header plate over the cards, `line` — a bare header over a faint line; cards stand on the host. `well`: every column is a filled well holding its cards (bounded queues). |
| `loading` | `boolean` | `false` | Columns show skeleton cards in the card geometry; the cards cross-fade in when it turns off. |
| `loadingColumns` | `number` | `3` | Placeholder columns a `loading` board draws while `columns` is empty (the stages are still loading); the columns fade in where they stood. |
| `disabled` | `boolean` | `false` | Read-only board: no drag, no keyboard moves, no column grips; `onItemOpen` and `getItemHref` still open cards. |
| `labels` | `Partial<KanbanLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children" \| "defaultValue">` | — | `className` (the board height), `aria-label` and the other div attributes. |

### Kanban.Item
`ref` → `HTMLLIElement`. One card; return it from `renderItem` (it takes its id from there). Dragged by the whole card and focusable; presses on buttons, fields and links inside never start a drag.

| Prop | Type | Default | Description |
|---|---|---|---|
| `disabled` | `boolean` | `false` | This card cannot be dragged or moved. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "id">` | — | `children` (the card parts), `className` and the other attributes; `onClick` / `onKeyDown` run before `onItemOpen` opens the card — `preventDefault()` keeps it closed. |

### Kanban.ItemHeader
`ref` → `HTMLDivElement`. Optional top row of a card: the key or project at the start, cut with an ellipsis; the last child (a priority `Badge`, an assignee) at the end, never shrunk.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Kanban.ItemTitle
`ref` → `HTMLSpanElement`. The card title: medium body text, up to three lines. With a tail — `number`, an `Avatar.Root` child (the owner, also inside a fragment) — one row: the name cut with an ellipsis, then the number, the owner last; the tail never shrinks.

| Prop | Type | Default | Description |
|---|---|---|---|
| `number` | `ReactNode` | — | The record's number («#866»): a small muted caption in tabular digits at the end of the row, before the owner. |
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children` (the name, an owner `Avatar.Root`), `className` and the other span attributes. |

### Kanban.ItemDescription
`ref` → `HTMLSpanElement`. The muted meta line under the title: id, due date; one line, tabular numbers.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

### Kanban.ItemBadges
`ref` → `HTMLDivElement`. A wrapping row of `Badge`s (a `Badge.Group`): labels, priority.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Kanban.ItemFooter
`ref` → `HTMLDivElement`. The bottom row: `Kanban.ItemCount`s at the start (an icon alone marks a channel); text cut with an ellipsis; the last child, unless a count, at the end, never shrunk (an `Avatar`, a date).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Kanban.ItemCount
`ref` → `HTMLSpanElement`. A small muted counter with a 14 px icon: comments, attachments, subtasks.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

### Kanban.ItemSection
`ref` → `HTMLDivElement`. A zone of a card, a group of its parts: zones stand `space-3` off a faint line between them, parts inside one `space-2` apart. A zone with nothing in it is not drawn and leaves no line.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Kanban.ItemResource
`ref` → `HTMLDivElement`. One unit a record holds (a vehicle, a room): a mark at the start (a `ProgressCircle` of its term; kit marks take the `s` tier), then its name and a caption line, each cut with an ellipsis.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — (required) | The unit's name: body-s, medium, one line. |
| `description` | `ReactNode` | — | The caption line under the name: muted, tabular digits; a span inside may carry a tone (an overdue term in `danger`). |
| `children` | `ReactNode` | — | The mark at the start: a `ProgressCircle` of the unit's term (a short text in it: «18 д»), an `Avatar`, a `Thumbnail`. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other div attributes. |

### Kanban.ItemFact
`ref` → `HTMLDivElement`. One fact of a record: an `Icon` (14 px) and a secondary caption line cut with an ellipsis; a part of the text may carry its own tone (a `Typography` span). Facts in a row stand `space-1` apart.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### KanbanFieldsMenu
`ref` → `HTMLButtonElement`. The view of a board's cards, for the page's tools: the kit's one view trigger (the columns icon, «Вид», the count of shown fields), a check item per card field and «По умолчанию» once changed. The cards read the same `hiddenFields`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `fields` | `readonly KanbanField[]` | — (required) | The card fields a person may hide or move: `{ id, label, group? }`, in default order; fields with a `group` stand under that heading instead of `labels.fields`. |
| `hiddenFields` | `readonly string[]` | — | Ids of the hidden fields (controlled). |
| `defaultHiddenFields` | `readonly string[]` | `[]` | The default view: the initial hidden fields (uncontrolled) and what «По умолчанию» puts back. |
| `onHiddenFieldsChange` | `(hiddenFields: readonly string[]) => void` | — | A field was shown or hidden, or the default view put back. |
| `fieldOrder` | `readonly string[]` | — | Ids of the fields in the order the cards draw them (controlled). Any of the triad turns the items into sortable lists: a grip, Alt + ↑ / ↓, a field moves within its group. |
| `defaultFieldOrder` | `readonly string[]` | — | The initial order (uncontrolled); `[]` starts in the order of `fields`, which «По умолчанию» puts back. |
| `onFieldOrderChange` | `(fieldOrder: readonly string[]) => void` | — | A field was moved, or «По умолчанию» put the order of `fields` back: the new order of every field. Render the card parts in it. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Tier of the trigger and the menu. |
| `labels` | `Partial<KanbanFieldsMenuLabels>` | — | The menu's strings: `view`, `fields`, `reset`. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" \| "type">` | — | `className` and the other attributes of the trigger button. |

## Variants

| Value | Looks like | Use when | Default |
|---|---|---|---|
| `plain` | no wells: the column is its header — a filled plate as wide as the cards (title, count) — and its cards, which stand on the board's host, each a surface one ladder step off it (white on the light page), as a Card on the page | the board is the page's main region (a pipeline, a task board, a queue screen) or sits in a Card or Drawer — one level of nesting, cards are the only boxes | yes |
| `line` | no wells, like `plain`, but the header is bare: title and count over a faint inset hairline as wide as the cards | the same places as `plain` when the headers should stay quiet — many columns, a calm board, the column headers are not the focus | |
| `well` | every column is a filled well (`fill-muted`, radius `l`) holding its cards (the selected step of the well) | columns must read as bounded queues: WIP limits and capacity, many sparse or empty columns whose drop area must show, a dense board of many narrow columns | |

Do not wrap a `plain` board's columns in your own boxes, and do not put a `well` board inside a filled box of your own — both are the double nesting the variants exist to avoid.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `limit` (column) | count reads `count / limit`, orange when full; a full column refuses cards from others with the reason `labels.full` | a WIP limit per status | — |
| `description` (column) | a muted caption line under the column title, one line with an ellipsis | the column's rule or meaning («Ответить в течение дня») | — |
| `renderColumnMeta` | caption lines in tabular digits under the description: one, or a line per entry of an array, in order | the stage's figures («2 сделки · 576 000 ₽», «Средний чек 288 000 ₽») | — |
| `color` (column) | the count Badge in the stage's hue (soft) | telling stages apart, matching their color elsewhere; the title still names the column | — |
| `locked` (column) | a lock where the grip would be; the column holds its place, no column moves past it | system stages: the first «Новые», the last «Закрыто» | — |
| `reorderableColumns` | a ghost grip at the end of every column header, after the actions; the column is carried by it | the user arranges the stages | `false` |
| `canDrop` | the column turns `danger` under a refused card; a string reason is spoken and shown under the carried card; a keyboard move is announced as refused | workflow rules (a blocked ticket cannot be closed) | — |
| `loading` | skeleton cards in the card geometry, no counts | the first load or a refresh | `false` |
| `loadingColumns` | placeholder columns (a Skeleton title, Skeleton cards) while `loading` and `columns` is empty | the stages themselves come from the server | `3` |
| `disabled` | cards do not drag, Alt + arrows do nothing | read-only boards, no permission | `false` |
| `number` (`Kanban.ItemTitle`) | the title is one row: the name cut with an ellipsis first, then the muted number, an owner `Avatar.Root` child (also inside a fragment) last | a record's card: a deal, an order, a booking | — |

## States
| State | Driven by | DOM |
|---|---|---|
| idle | — | cards show `cursor: grab`; under a mouse the card lifts to `--prime-shadow-overlay` (`@media (hover: hover)` only) — no wash: a wash is one ladder step, the column's own color |
| carried | a drag | Dnd: the clone lifts on Dnd's carry shadow, a dashed accent gap opens where the card lands, cards glide aside |
| column carried | a drag by the column grip | the same for the whole column: its clone lifts with its cards, a column-sized gap opens in the strip, the columns glide aside; `plain` / `line` columns fly as they stand (no fill, no lift shadow) and leave bare room (no tint, no dashed line), a `well` column flies with its rounded fill and leaves the tinted dashed gap in its shape |
| over a column | pointer over another column | the gap opens there; an empty column's slot fades out |
| refused | `limit` reached, `canDrop` returns `false` or a reason | `data-dnd-reject` on the `<ul>`: `danger-soft` fill; the reason in a chip under the carried card |
| locked column | `locked` | `data-locked` on the column; the grip is a lock named «Закреплено» |
| full | count ≥ `limit` | `data-full` on the column, orange count `count / limit` |
| empty | no cards | a compact `EmptyPage` in Dnd's dashed drop slot at the top (`fill-strong` dashed line, no fill): «Нет карточек»; the whole column stays a drop area |
| loading | `loading` | `aria-busy` and `data-loading` on the root; `Skeleton` cards; `Crossfade` swaps them for the cards |
| loading, no columns yet | `loading` with empty `columns` | an `aria-hidden` row of `loadingColumns` placeholder columns; the columns fade in where they stood (`enterMotion`) |
| disabled | `disabled` / `Kanban.Item disabled` | `data-disabled` on the root / card; no `aria-roledescription`, no shortcuts, no column grips |
| saving | `onValueChange` / `onColumnOrderChange` returned a pending promise | the card (column) stays in its new place with `aria-busy` and `data-pending`; a card's content quiets to 0.6 under a centred `Spinner`, a column's heading quiets and its grip is busy (Dnd); it does not move again until the answer |
| opens | `onItemOpen` / `getItemHref` | `data-clickable` (in place) or `data-link` (a link over the card, its focus ring drawn on the card); a card that opens lifts on hover on a read-only board too |
| refused save | the promise rejected | the card glides back to its old column and place (every card it pushed aside glides too), a column glides back in the strip; `labels.moveFailed` / `labels.columnMoveFailed` is announced |

Motion: the hover lift (shadow, the card rises above its neighbours) and the empty slot fade (`fast`, `standard`); a card dropped under the mouse lands straight into its hover lift (`data-dnd-hover`); the swap from skeletons is `Crossfade`, the columns that replace placeholder columns fade in; drag motion is Dnd's (lift, gap, glide, landing); a saving card or column quiets (`fast`, both ways) and its spinner fades in by itself; a refused save glides back (`base`, the list's FLIP glide), never jumps. Under `prefers-reduced-motion` all of it is off.

A card's own `onKeyDown` runs before the board's: `preventDefault()` in it keeps the move from happening. A controlled owner applies the new `value` (or `columnOrder`) once the request succeeds — in the promise chain, before the returned promise resolves — never before the answer.

## Layout & spacing
- Give the root a height (`className`): columns span it and every column body scrolls on its own; without one the columns take the height of the tallest.
- The board is a size container. From 40rem of its own width columns keep a fixed 18rem; below it a column takes 85% of the board, so the next column peeks. The strip snaps to the start of a column (ScrollContainer `snap="mandatory"`); snapping is off while a drag carries a card.
- Every column draws only the cards around its view (Dnd.Sortable `virtual`): a column of thousands scrolls and drags as fast as one of ten. Pass every card in `items` and `value` — never slice a column by hand; the carried, the focused and a card arriving by Alt + ← / → stay drawn.
- The strip scrolls sideways inside the board, never the page. Cards sit at the top of their column; the drop area runs to the bottom of the column, so a card can be released anywhere in it.
- `plain` / `line`: column gap `--prime-space-3`, cards inset `--prime-space-1` (room for the focus ring); a card sets `data-depth` one above the board's host and paints `--prime-color-layer-current`, so it keeps its color in flight too. `well`: column gap `--prime-space-3`, cards inset `--prime-space-2` from the column edge, column radius `l`. Card gap `--prime-space-2`, card padding `--prime-space-3`, card radius `m`.
- The column title is `title-m`; the header is at least a control `m` tall, its text starts where the card text does.
- `well` and `line`: a faint inset hairline (`--prime-color-border-faint`, as in a dialog header) separates the header from the cards. `plain`: the header is a filled plate (`--prime-color-fill-muted`, `--prime-radius-l`) as wide as the cards, in place of the hairline.
- Every header of the board is as tall as the tallest one (the board's rows are shared by its columns, subgrid; with `columnGroups` across the phases too): a column with figures under its title and one without start their cards on one line. Never pad a header with an empty `renderColumnMeta` line to line them up.
- The header is a grid: the title, the count, the actions and the grip at the end on the first row; the description under the title on the second, the meta line under it (`--prime-space-1` above, caption, `text-secondary`).
- A card is on `--prime-shadow-raised`: in `plain` / `line` the next layer of the board's host (`--prime-color-layer-current` of its own depth), in `well` `--prime-color-control-selected` (two ladder steps off its well; white in light).
- `Kanban.ItemHeader` is a muted caption row over a faint hairline (`--prime-color-border-faint`); a card without it starts with its title or a full-width `Thumbnail` cover.
- Rich cards group their parts in `Kanban.ItemSection` zones: parts inside a zone stand `--prime-space-2` apart, zones `--prime-space-3` off a faint line between them (`hairline.between`, `--prime-color-border-faint`); a zone with nothing in it is not drawn and leaves no line. A `Badge fullWidth` plate (the next step) goes first in its zone; facts in a row stand `--prime-space-1` apart.
- `Kanban.ItemResource`: its mark (kit marks take the `s` tier: a `ProgressCircle` 32 with a short text «18 д») `--prime-space-3` from a body-s medium name over a muted caption, both cut with an ellipsis.
- `Kanban.ItemHeader` and `Kanban.ItemFooter` cut text with an ellipsis and never shrink their last child, so a long source never pushes the date onto a second line.
- `KanbanFieldsMenu` holds only the view of the board's cards (not a table's columns): the page decides which parts each card renders from `hiddenFields`. Its trigger is the kit's one view trigger — the same soft neutral Button with the `view.columns` icon, «Вид» and the count of shown items as `DataTableColumnsMenu` and `GanttCategoriesMenu` — so a page that switches board ↔ list ↔ schedule keeps one «Вид» in one place, each view's own menu behind it. «По умолчанию» appears (with its separator) only while the view differs from the default (`defaultHiddenFields`, the order of `fields`) and puts both back. With any of the `fieldOrder` triad the items are a `Dnd.Sortable` list per group, a grip ending each item (a held press drags on touch), Alt + ↑ / ↓ on the focused item moves it; a field with a `group` stands under that heading and moves only within it. The cards are yours, so the page renders their parts in `fieldOrder` (`[]` is the order of `fields`) and skips `hiddenFields`.
- Header actions get the `s` tier; inside a card, kit controls take the `m` host tier (a `Badge` is `s`). Pick a small `Avatar` (`size="s"`).

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves through the cards, column by column. |
| `Enter` · `Space` | Opens the focused card (`onItemOpen`) or follows its link (`getItemHref`). |
| `Alt + ↑` · `Alt + ↓` | Moves the card one place inside its column. In `KanbanFieldsMenu` with `fieldOrder`: moves the focused field one place within its group, the focus staying on it. |
| `Alt + ←` · `Alt + →` | On a card: moves it to the neighbouring column at the same row (or its end). On a column grip: moves the column one place. Focus follows. The direction follows the writing direction (`dir="rtl"`: ← goes forward). |
| `Escape` | Cancels a drag in flight. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- Every column is a `<ul>` labelled by its heading (`aria-labelledby`) and described by its description and meta (`aria-describedby`); cards are `<li>` with `aria-roledescription` and `aria-keyshortcuts`, and `aria-posinset` / `aria-setsize`, since a column draws only the cards around its view. The columns are Dnd lists of one kind: Alt + ← / → across them is Dnd's.
- With `columnGroups` every named group is a `role="group"` labelled by its heading; a keyboard move past the edge of a group is announced with `labels.columnGroupLocked`.
- The column grip is a button named «Переместить колонку «…»» with `aria-keyshortcuts`; a keyboard column move is announced with its position («Колонка «…»: позиция 2 из 4», `labels.column`). A locked column has a lock named «Закреплено» instead.
- A live region (`role="status"`) announces grabbed, dropped, «position N of M», a move to another column by its title and a refusal with its reason (`labels`, Dnd's labels).
- The count is spoken as text («Карточек: 3 из 5»), not only by colour; a full column also reads `count / limit`.
- With `getItemHref` a real `<a>` named by `getLabel` covers the card and is its tab stop: a click, ⌘/Ctrl-click, a middle click and «open in new tab» work anywhere on the card, Space follows it like Enter, Alt + arrows move the card from it and a press on it drags the card; the release of a drag never follows it. Controls inside the card stand above the link. With `onItemOpen` alone the card opens by a click, Enter or Space; a control inside the card never opens it, and a card that opens stays a tab stop on a `disabled` board.
- Touch: a drag starts after a hold; a finger that moves first scrolls the board.
- A board named by `aria-label` or `aria-labelledby` is a `group` with that name; an unnamed one has no role.
- `KanbanFieldsMenu` is a menu button named by its text and count («Вид 4»); its items are a group named `labels.fields` of `menuitemcheckbox` with `aria-checked`.
- While loading the root has `aria-busy`; skeletons are hidden from assistive tech.
- While a move is saved the card or column has `aria-busy` (its spinner is hidden from assistive tech, a column's busy grip says so itself); a refused save is announced (`labels.moveFailed`, `labels.columnMoveFailed`).

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

#### Kanban.Root

| Key | Default | Used for |
|---|---|---|
| `count` | `"Карточек: {count}"` | Spoken name of the count badge. |
| `countLimit` | `"Карточек: {count} из {limit}"` | Spoken name of the count badge of a column with a `limit`. |
| `empty` | `"Нет карточек"` | Text of an empty column. |
| `full` | `"Колонка «{column}» заполнена ({limit})"` | Why a full column refuses a card: spoken, and shown under the carried card. |
| `moveColumn` | `"Переместить колонку «{column}»"` | Name of the column grip (`reorderableColumns`). |
| `column` | `"Колонка «{column}»"` | A column as the live region names it when it is carried or moved («Колонка «Демо»: позиция 2 из 4»). |
| `moveFailed` | `"Не удалось переместить «{label}», карточка вернулась на место"` | Spoken when the `onValueChange` promise rejects; `{label}` is `getLabel(item)`. |
| `columnMoveFailed` | `"Не удалось переместить колонку «{column}», она вернулась на место"` | Spoken when the `onColumnOrderChange` promise rejects. |
| `columnGroupLocked` | `"Колонка «{column}» остаётся в группе «{group}»"` | Why a column cannot leave its group (`columnGroups`), spoken and shown under the carried column; `{column}`, `{group}`. |

#### KanbanFieldsMenu

| Key | Default | Used for |
|---|---|---|
| `view` | `"Вид"` | Text of the trigger. |
| `fields` | `"На карточке"` | Heading of the group of card fields. |
| `reset` | `"По умолчанию"` | The item that puts `defaultHiddenFields` and the order of `fields` back. |
| `reorderField` | `"Переместить поле {label}"` | Name of a field's grip (`fieldOrder`); `{label}` is the field's label. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A release board: cards move within and between columns by drag, a touch hold or Alt + arrows; a card shows its meta line, labels, comments and assignee — `Kanban.Root`, `Kanban.Item`, `renderItem`, `renderColumnActions`. |
| [variants.tsx](examples/variants.tsx) | The same release board in three looks: no wells with a header plate, no wells with a header over a line, and columns as filled wells holding their cards — `variant`. |
| [structure.tsx](examples/structure.tsx) | Cards take only the parts they need: a title alone, a meta line, labels, a footer with counts and an assignee — `Kanban.ItemTitle`, `Kanban.ItemDescription`, `Kanban.ItemBadges`, `Kanban.ItemFooter`, `Kanban.ItemCount`. |
| [cards.tsx](examples/cards.tsx) | Three kinds of cards on one board: a plain note, a ticket with a header row of key and priority, a design task with a cover — `Kanban.ItemHeader`, `Thumbnail`, `Kanban.ItemFooter`. |
| [deal-cards.tsx](examples/deal-cards.tsx) | Rental deals as rich cards: a title row with the number and the owner, the vehicles with their terms, the next step as a plate, the facts, the source; the view menu hides card fields — `Kanban.ItemSection`, `Kanban.ItemTitle`, `Kanban.ItemResource`, `Kanban.ItemFact`, `KanbanFieldsMenu`. |
| [field-order.tsx](examples/field-order.tsx) | Project tasks whose view menu shows, hides and reorders the card fields: a grip drags a field (a held press on touch), Alt + ↑ / ↓ moves the focused one, and every card draws its parts in that order — `KanbanFieldsMenu`, `fieldOrder`, `onFieldOrderChange`, `hiddenFields`. |
| [field-groups.tsx](examples/field-groups.tsx) | Rental deals whose view menu groups the card fields by zone of the card: each group has its heading, a field moves only within its group, and each zone of a card draws its shown fields in their order — `KanbanFieldsMenu`, `fields`, `fieldOrder`, `Kanban.ItemSection`. |
| [limits.tsx](examples/limits.tsx) | A support queue with a work-in-progress limit and a workflow rule, its columns drawn as wells so each reads as a bounded queue: a full column and a blocked ticket are refused before the release with the reason under the card, from the keyboard too — `limit`, `canDrop`, `variant`. |
| [columns.tsx](examples/columns.tsx) | A sales pipeline whose stages move by the grip in their header while the first and the last stay locked; each stage carries its color on the count, a rule and its figures in two lines under the title, and is edited in a popover; the page keeps the order — `reorderableColumns`, `columnOrder`, `onColumnOrderChange`, `locked`, `color`, `description`, `renderColumnMeta`, `renderColumnActions`. |
| [column-groups.tsx](examples/column-groups.tsx) | A deal board whose stages stand in phases, each phase titled over its columns, and a stage moves only within its phase — `columnGroups`, `reorderableColumns`, `columnOrder`, `onColumnOrderChange`. |
| [saving.tsx](examples/saving.tsx) | Every move is saved on the server: the card waits busy in its new place, and an invoice the server refuses to close glides back to its column — `onValueChange`. |
| [item-link.tsx](examples/item-link.tsx) | Tickets that open: each card is a link to its page, so ⌘-click or a middle click opens a new tab, a plain click, Enter or Space opens it in place, and a drag only moves it — `getItemHref`, `onItemOpen`. |
| [large.tsx](examples/large.tsx) | Three thousand orders on one board stay fast: each column draws only the cards in view, a card dragged near an edge scrolls its column, and Alt + arrows reach any card — `items`, `defaultValue`, `getLabel`. |
| [states.tsx](examples/states.tsx) | Loading draws skeleton cards in the card geometry, and placeholder columns before the columns arrive; an empty column keeps its drop area and a closed order stays in place while the rest move; a read-only board drags nothing — `loading`, `loadingColumns`, `disabled`. |
| [controlled.tsx](examples/controlled.tsx) | The placement lives in the parent: every move arrives with its source, target and position to save, and a button resets the board — `value`, `onValueChange`. |
| [narrow.tsx](examples/narrow.tsx) | On a phone-width screen a column takes 85% of the board and snaps into place, so the next one peeks; the strip scrolls inside the board, never the page — `Kanban.Root`, `columns`. |
| [screen.tsx](examples/screen.tsx) | A sales pipeline as a work screen: the title with the open deals and their sum, search, filter, one view menu for the view shown, the board / list switch and the one primary action in its top bar, a full-height Kanban of deals by stage with totals, moves saved on the server that can be refused, and the deal in a Drawer — `value`, `onValueChange`, `renderColumnMeta`, `onItemOpen`, `KanbanFieldsMenu`, `DataTableColumnsMenu`. |

## Mistakes
- Returning something other than `Kanban.Item` from `renderItem` → the card does not drag and Alt + arrows do nothing.
- Using the array index as the card id → ids must survive a move.
- Keeping the status only on the item and no `value` → the board draws nothing; build `defaultValue` (or `value`) from your data: `{ [status]: ids }`.
- No height on the root inside a fixed region → the page scrolls instead of the column.
- A hover-only action on a card → touch has no hover; put the action in the card or open the card on click (`onItemOpen`).
- `onClick` / `onKeyDown` on `Kanban.Item` to open a card → `onItemOpen` (click, Enter, Space, never after a drag) or `getItemHref` for a page of its own.
- `getItemHref` without `getLabel` → the link is named by the card id; pass a human name.
- Drawing your own box (a Card, a filled `div`) around each column, or around a `well` board → pick the `variant`: `plain` or `line` for one level of nesting, `well` when columns must read as bounded queues.
- Styling a card from an ancestor (`.board .card`) → the flying clone is portalled to `<body>` and loses it; put the class on `Kanban.Item`.
- Keeping the column order in `columns` and reordering that array → pass `columnOrder` / `onColumnOrderChange`; `columns` stays the data.
- Putting a system stage back first after every move → `locked: true` on that column.
- Stats squeezed into the column `title` → `renderColumnMeta`.
- `canDrop` returning `false` for a rule a person cannot guess → return the reason as a string.
- Applying a move in `onValueChange` and then undoing it yourself when the request fails → return the request's promise and apply `value` only after it succeeds; the board keeps the card in place meanwhile and glides it back on a rejection.
- A hand-drawn `Divider` and gaps between groups of card parts → `Kanban.ItemSection`; it drops an empty zone and its line by itself.
- The record number or the owner in `Kanban.ItemHeader` above a one-line title → `Kanban.ItemTitle number` with an `Avatar.Root` child.
- A hand-made row of a truncated name, a number caption and the owner inside `Kanban.ItemTitle` → `Kanban.ItemTitle number` with the `Avatar.Root` as a child (a fragment around it is fine).
- Your own row of a ring and two text lines for a vehicle or a room → `Kanban.ItemResource`.
- The board's view in `DataTableColumnsMenu` or a hand-made Dropdown → `KanbanFieldsMenu`.
- Drag as the only way to change a status → keep a status field or a menu in the card details too.

## Related
- **Built from:** [Dnd](../dnd/COMPONENT.md), [Badge](../badge/COMPONENT.md) (the column count, the view trigger's count), [Avatar](../avatar/COMPONENT.md), [Button](../button/COMPONENT.md), [Dropdown](../dropdown/COMPONENT.md), [ScrollContainer](../scroll-container/COMPONENT.md), [Skeleton](../skeleton/COMPONENT.md), [Crossfade](../crossfade/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md), [Spinner](../spinner/COMPONENT.md), [VisuallyHidden](../visually-hidden/COMPONENT.md); `ViewMenu` (`KanbanFieldsMenu`: the kit's one view trigger and menu)
- **See also:** [DataTable](../data-table/COMPONENT.md), [Card](../card/COMPONENT.md), [ProgressCircle](../progress-circle/COMPONENT.md), [Thumbnail](../thumbnail/COMPONENT.md), [Timeline](../timeline/COMPONENT.md), [Gantt](../gantt/COMPONENT.md)
