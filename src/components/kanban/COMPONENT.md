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

## Import
```tsx
import { Kanban, type KanbanColumn, type KanbanMove, type KanbanValue } from "prime-ui-kit";
```

## Anatomy
```
Kanban.Root                       board: horizontal strip of columns, its own Dnd.Root if none above
└─ column (from `columns`)        `fill-faint` well; header + own vertical scroll
   ├─ header                      title (h3) · count Badge · renderColumnActions(column)
   └─ <ul> (Dnd.Sortable)         drop area; Skeleton cards while loading; EmptyPage when empty
      └─ Kanban.Item              <li> card from renderItem(item)
         ├─ Kanban.ItemTitle      title, up to three lines
         ├─ Kanban.ItemDescription  muted meta line: id, due date
         ├─ Kanban.ItemBadges     wrapping row of Badge
         └─ Kanban.ItemFooter     row: Kanban.ItemCount … at the start, the assignee at the end
            └─ Kanban.ItemCount   icon + number
```
Columns and cards are application data (`columns`, `items`); the board state is where each card stands: `value` maps a column id to its card ids in order. A card in flight is drawn by Dnd as a lifted clone; the column under it opens a gap where it lands.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Kanban.Root
Generic `Kanban.Root<T>`; `ref` → `HTMLDivElement`. The board: a strip of columns that scrolls sideways inside itself, each column a labelled `<ul>` of cards under a header with the title, a count `Badge` and actions. Mounts its own `Dnd.Root` unless one is already above it. Sets `aria-busy` while loading, `data-loading`, `data-disabled`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `readonly KanbanColumn[]` | — (required) | Columns in their order: `{ id, title, limit? }`; `limit` is a WIP limit — a full column refuses cards from other columns and its count turns orange (`count / limit`). |
| `items` | `readonly T[]` | — (required) | Every card the board can show; `value` decides where each one stands. |
| `getId` | `(item: T) => string` | — (required) | Stable unique id of a card, the one used in `value`. |
| `getLabel` | `(item: T) => string` | `the id` | Spoken by the live region. |
| `value` | `KanbanValue` | — | Card ids per column (controlled): `{ [columnId]: id[] }`. Ids missing from `items` are skipped. |
| `defaultValue` | `KanbanValue` | `{}` | Initial card ids per column (uncontrolled). |
| `onValueChange` | `(value: KanbanValue, move: KanbanMove) => void` | — | A card moved by pointer, touch or keyboard: the new placement, then `{ id, from, to, index }` to save. |
| `renderItem` | `(item: T) => ReactNode` | — (required) | Renders one card; return a `Kanban.Item`. |
| `renderColumnActions` | `(column: KanbanColumn) => ReactNode` | — | Trailing actions of a column header (add a card, a menu); kit controls inside take the `s` tier. |
| `canDrop` | `(id: string, columnId: string) => boolean` | — | A workflow rule: refuses card `id` in column `columnId`; the column turns `danger` before the release and a keyboard move is announced as refused. |
| `loading` | `boolean` | `false` | Columns show skeleton cards in the card geometry; the cards cross-fade in when it turns off. |
| `disabled` | `boolean` | `false` | Read-only board: no drag, no keyboard moves; clicks on cards still work. |
| `labels` | `Partial<KanbanLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children" \| "defaultValue">` | — | `className` (the board height), `aria-label` and the other div attributes. |

### Kanban.Item
`ref` → `HTMLLIElement`. One card: an `<li>` on the floating layer's fill (`layer-floating-bg`) with the raised shadow; return it from `renderItem` (it takes its id from there). Draggable by the whole card, focusable, `aria-keyshortcuts` for Alt + arrows. Presses on buttons, fields and links inside never start a drag.

| Prop | Type | Default | Description |
|---|---|---|---|
| `disabled` | `boolean` | `false` | This card cannot be dragged or moved. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "id">` | — | `children` (the card parts), `className`, `onClick` and the other attributes; `onKeyDown` runs first, `preventDefault()` keeps the move from happening. |

### Kanban.ItemTitle · Kanban.ItemDescription
`ref` → `HTMLSpanElement`. The card title (medium body text, up to three lines) and the muted meta line under it (id, due date; one line, tabular numbers).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

### Kanban.ItemBadges
`ref` → `HTMLDivElement`. A wrapping row of `Badge`s: labels, priority.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Kanban.ItemFooter
`ref` → `HTMLDivElement`. The bottom row: `Kanban.ItemCount`s at the start; the last child, unless a count, sits at the end (the assignee `Avatar`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Kanban.ItemCount
`ref` → `HTMLSpanElement`. A small muted counter with a 14 px icon: comments, attachments, subtasks.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

## Variants

The board has no visual variants: one look, fills over lines.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `limit` (column) | count reads `count / limit`, orange when full; a full column refuses cards from others | a WIP limit per status | — |
| `canDrop` | the column turns `danger` under a refused card; a keyboard move is announced as refused | workflow rules (a blocked ticket cannot be closed) | — |
| `loading` | skeleton cards in the card geometry, no counts | the first load or a refresh | `false` |
| `disabled` | cards do not drag, Alt + arrows do nothing | read-only boards, no permission | `false` |

## States
| State | Driven by | DOM |
|---|---|---|
| idle | — | cards show `cursor: grab`; under a mouse the card gets a `fill-subtle` wash (`@media (hover: hover)` only) |
| carried | a drag | Dnd: the clone lifts on `--prime-shadow-modal`, a dashed accent gap opens where the card lands, cards glide aside |
| over a column | pointer over another column | the gap opens there; an empty column's well fades out |
| refused | `limit` reached, `canDrop` returns `false` | `data-dnd-reject` on the `<ul>`: `danger-soft` fill |
| full | count ≥ `limit` | `data-full` on the column, orange count `count / limit` |
| empty | no cards | a compact `EmptyPage` («Нет карточек») in an 80 px well at the top; the whole column stays a drop area |
| loading | `loading` | `aria-busy` and `data-loading` on the root; `Skeleton` cards; `Crossfade` swaps them for the cards |
| disabled | `disabled` / `Kanban.Item disabled` | `data-disabled` on the root / card; no `aria-roledescription`, no shortcuts |

Motion: the hover wash and the empty well fade on opacity (`fast`, `standard`); the swap from skeletons is `Crossfade`; drag motion is Dnd's (lift, gap, glide, landing). Under `prefers-reduced-motion` all of it is off.

## Layout & spacing
- Give the root a height (`className`): columns span it and every column body scrolls on its own; without one the columns take the height of the tallest.
- The board is a size container. From 40rem of its own width columns keep a fixed 18rem; below it a column takes 85% of the board and snaps (`scroll-snap-type: x mandatory`), so the next column peeks. Snapping is off while a drag auto-scrolls the strip.
- The strip scrolls sideways inside the board, never the page. Cards sit at the top of their column; the drop area runs to the bottom of the column, so a card can be released anywhere in it.
- Column gap `--prime-space-3`, card gap `--prime-space-2`, card padding `--prime-space-3`, column radius `l`, card radius `m`.
- Header actions get the `s` tier; inside a card, kit controls take the `m` host tier (a `Badge` is `s`). Pick a small `Avatar` (`size="s"`).

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves through the cards, column by column. |
| `Alt + ↑` · `Alt + ↓` | Moves the card one place inside its column. |
| `Alt + ←` · `Alt + →` | Moves the card to the neighbouring column at the same row (or its end); focus follows it. The direction follows the writing direction (`dir="rtl"`: ← is the next column). |
| `Escape` | Cancels a drag in flight. |

### ARIA
- Every column is a `<ul>` labelled by its heading (`aria-labelledby`); cards are `<li>` with `aria-roledescription` and `aria-keyshortcuts`.
- A live region (`role="status"`) announces grabbed, dropped, «position N of M», a move to another column and a refusal (`labels`).
- The count is spoken as text («Карточек: 3 из 5»), not only by colour; a full column also reads `count / limit`.
- Touch: a drag starts after a hold; a finger that moves first scrolls the board.
- While loading the root has `aria-busy`; skeletons are hidden from assistive tech.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `count` | `"Карточек: {count}"` | Spoken name of the count badge. |
| `countLimit` | `"Карточек: {count} из {limit}"` | Spoken name of the count badge of a column with a `limit`. |
| `empty` | `"Нет карточек"` | Text of an empty column. |
| `moved` | `"{label}: «{column}», позиция {position} из {total}"` | Live region: a card moved to another column with the keyboard. |
| `refused` | `"{label}: колонка «{column}» не принимает карточку"` | Live region: the next column refused the card (full or `canDrop`). |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A release board: cards move within and between columns by drag, a touch hold or Alt + arrows; a card shows its meta line, labels, comments and assignee — `Kanban.Root`, `Kanban.Item`, `renderItem`, `renderColumnActions`. |
| [structure.tsx](examples/structure.tsx) | Cards take only the parts they need: a title alone, a meta line, labels, a footer with counts and an assignee — `Kanban.ItemTitle`, `Kanban.ItemDescription`, `Kanban.ItemBadges`, `Kanban.ItemFooter`, `Kanban.ItemCount`. |
| [limits.tsx](examples/limits.tsx) | A support queue with a work-in-progress limit and a workflow rule: a full column and a blocked ticket are refused before the release, from the keyboard too — `limit`, `canDrop`. |
| [states.tsx](examples/states.tsx) | Loading draws skeleton cards in the card geometry and cross-fades the cards in; an empty column keeps its drop area; a read-only board drags nothing — `loading`, `disabled`. |
| [controlled.tsx](examples/controlled.tsx) | The placement lives in the parent: every move arrives with its source, target and position to save, and a button resets the board — `value`, `onValueChange`. |
| [narrow.tsx](examples/narrow.tsx) | On a phone-width screen a column takes 85% of the board and snaps into place, so the next one peeks; the strip scrolls inside the board, never the page. |

## Mistakes
- Returning something other than `Kanban.Item` from `renderItem` → the card does not drag and Alt + arrows do nothing.
- Using the array index as the card id → ids must survive a move.
- Keeping the status only on the item and no `value` → the board draws nothing; build `defaultValue` (or `value`) from your data: `{ [status]: ids }`.
- No height on the root inside a fixed region → the page scrolls instead of the column.
- A hover-only action on a card → touch has no hover; put the action in the card or open the card on click.
- Styling a card from an ancestor (`.board .card`) → the flying clone is portalled to `<body>` and loses it; put the class on `Kanban.Item`.
- Drag as the only way to change a status → keep a status field or a menu in the card details too.

## Related
- **Built from:** [Dnd](../dnd/COMPONENT.md), [Badge](../badge/COMPONENT.md), [ScrollContainer](../scroll-container/COMPONENT.md), [Skeleton](../skeleton/COMPONENT.md), [Crossfade](../crossfade/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md)
- **See also:** [DataTable](../data-table/COMPONENT.md), [Card](../card/COMPONENT.md), [Avatar](../avatar/COMPONENT.md), [Timeline](../timeline/COMPONENT.md)
