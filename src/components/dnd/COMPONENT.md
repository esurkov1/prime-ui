# Dnd

**Category:** interaction
**Kind:** composite

> Pointer-driven drag and drop: reorderable lists, draggable items and drop zones on one shared session, with a lifted clone, a gap where the item lands, auto-scroll, touch support and a keyboard path.

## When to use
- Reordering a list, a row of chips or a set of settings by hand (`Dnd.Sortable`).
- Reordering tiles in a wrapping grid: photos, covers (`axis="grid"`).
- Moving an item between lists to an exact position: a board of columns (several `Dnd.Sortable` with one `kind`; Alt + ← / → moves across from the keyboard).
- A list with a pinned first row or a system item that must hold its place (`locked`).
- Reordering the rows of a table of your own (`as="tbody"`; a group's heading row in `header`). For records in a [DataTable](../data-table/COMPONENT.md) use its `onReorder`.
- Moving an item onto a target with no inner order: a folder, an assignee (`Dnd.Draggable` + `Dnd.DropZone`).

## When not to use
- Picking files from the computer → use [FileUpload](../file-upload/COMPONENT.md) (native file drop).
- An order that is a plain setting with few options → a [Select](../select/COMPONENT.md) or [SegmentedControl](../segmented-control/COMPONENT.md) is faster.
- Dragging values (a slider thumb, a color square) → use [Slider](../slider/COMPONENT.md) or [ColorPicker](../color-picker/COMPONENT.md).
- Reordering a virtualized list → not covered: the engine measures the DOM, so only mounted items take part.

## Import
```tsx
import { Dnd, moveBefore } from "prime-ui-kit";
```

## Anatomy
```
Dnd.Root                         session owner: overlay (portal), live region, labels — mount once
├─ Dnd.Sortable                  list container and drop target; renders items in the drawn order
│  ├─ header                     optional content before the items that never moves (a group's heading row)
│  ├─ Dnd.SortableItem           one item (li in ul/ol, div otherwise); the gap is drawn before it
│  │  └─ Dnd.Handle              optional grip: a ghost icon-only Button (with `handle` on the list); a lock in a `locked` item
│  ├─ empty                      the `empty` content while the list has no items
│  └─ children                   optional content after the items that never moves (an add tile)
├─ Dnd.Draggable                 an item to carry elsewhere; stays in place, faded, until the drop
└─ Dnd.DropZone                  a box that takes dropped items
```
A drag in flight is drawn by `Dnd.Root` as a clone of the lifted element above every layer, following the pointer; an item without a fill of its own flies on the fill of the surface it was lifted from (`--prime-color-layer-current`). A refusal with a reason shows the reason in a chip under the clone. The page gets `data-dnd-active="mouse | touch | pen"` on `<html>` for the length of the gesture.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Dnd.Root
No ref, no DOM of its own besides the portalled overlay and a visually hidden live region. Owns the one drag session the app shares — mount it once above every screen that drags. Without a root the parts render but do not drag.

| Prop | Type | Default | Description |
|---|---|---|---|
| `labels` | `Partial<DndLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | The app or the screen that drags. |

### Dnd.Sortable
Generic `Dnd.Sortable<T>`; `ref` → `HTMLElement`. Renders `<div>`, `<ul>` or `<ol>` and registers itself as the drop target; draws the gap and the optimistic order. Sets `data-axis` and `data-dragging`; a gap leaving mid-drag fades out as an out-of-flow copy marked `data-dnd-ghost`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `readonly T[]` | — (required) | Items in their current order. |
| `getId` | `(item: T) => string` | — (required) | Stable unique id; must match `Dnd.SortableItem id`. |
| `getLabel` | `(item: T) => string` | `the id` | Spoken by the live region. |
| `onReorder` | `(id: string, beforeId: string \| null) => void \| Promise<void>` | — (required) | The item `id` lands in front of `beforeId` (`null` = last); with connected lists `id` may come from another list. Apply it with `moveBefore`. Return a promise to save on a server: a drop or a keyboard move stays drawn in its new place until it settles; resolve — apply the order (before resolving); reject — the item glides back. |
| `renderItem` | `(item: T, index: number) => ReactNode` | — (required) | Returns a `Dnd.SortableItem`. During a drag `index` is the place the item will have on release (the carried item at the gap), so a shown position follows the gap. Parts marked `data-dnd-mirror` are kept in step on the carried copy (rolling digits roll). |
| `children` | `ReactNode` | — | Content after the items that never moves and takes no drop position: an add tile at the end of a grid. Inside `ul` / `ol` it must be `li`. |
| `axis` | `"x" \| "y" \| "grid"` | `"y"` | A column, a single row, or a wrapping grid (`display: grid`; the host sets the tracks and the cells' size, the gap takes a cell). Keyboard: Alt + ↑ / ↓ in a column, Alt + ← / → in a row and a grid. |
| `handle` | `boolean` | `false` | Only `Dnd.Handle` starts a drag; the rest of the item stays free for clicks and text selection. |
| `disabled` | `boolean` | `false` | No drag, no keyboard reorder. |
| `kind` | `string` | `unique per list` | Lists sharing a `kind` exchange items (a board): by pointer at an exact position, and by keyboard — Alt + the arrows across the axis (← / → in a column, ↑ / ↓ in a row, in the writing direction) move the item to the same row of the neighbouring list of the kind, in document order; focus follows and the move is announced with the list's name (`aria-label` / `aria-labelledby`). |
| `canDrop` | `(id: string) => boolean \| string` | — | Refuses an item by id: `false`, or a string that says why — spoken by the live region and shown in a chip under the carried copy (a keyboard move across says it too). The list gets `data-dnd-reject` and turns `danger` before the release. |
| `empty` | `ReactNode` | — | Shown while the list has no items, as its own `li` / `div` (`data-dnd-empty`; `role="presentation"` in a `ul`): in the flow until a gap opens in the list, then out of the flow, fading (`fast`), so the gap takes its place. |
| `as` | `"div" \| "ul" \| "ol" \| "tbody"` | `"div"` | Root element; `ul` / `ol` render items as `li`; `tbody` renders them as table rows `tr`: the gap is a row of the lifted row's height whose cell spans every column, and the row flies inside a copy of its table with every column at the width it had. |
| `header` | `ReactNode` | — | Content in front of the items that never moves and takes no drop position: the heading row of a group in a `tbody`. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "children">` | — | `className` (the list layout), `aria-label` (the name of the list) and the other attributes of the list element. |

### Dnd.SortableItem
`ref` → `HTMLElement`. `<li>` inside `ul` / `ol`, `<tr>` inside `tbody`, `<div>` otherwise; throws outside `Dnd.Sortable`. Sets `data-lifted`, `data-dnd-item`, `data-dnd-kind`, `data-locked`, `aria-roledescription`, `aria-keyshortcuts` and `tabIndex={0}` (not with `handle`). Presses on buttons, fields, links and `[data-dnd-ignore]` inside never start a drag; the browser's own drag of an image or a link inside is stopped (`dragstart` is prevented), so it never takes the gesture over.

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — (required) | The item id (same as `getId`). |
| `disabled` | `boolean` | `false` | This item cannot be dragged or moved (others may still move past it). |
| `locked` | `boolean` | `false` | Holds its place: it does not drag or move, and no item is put where it would shift it — by pointer the gap never stands there, by keyboard the step does not happen, an item from another list takes the nearest free place after it. Its `Dnd.Handle` turns into a lock. A pinned first row, a system column. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "id">` | — | `className` (the row look: fill, radius, padding), `aria-labelledby` / `aria-describedby` (name the item by its visible title and description: an `aria-label` replaces what the item shows) and the other attributes; `onPointerDown` / `onKeyDown` run first, `preventDefault()` keeps the drag from starting. |

### Dnd.Handle
`ref` → `HTMLButtonElement`. The grip: a ghost icon-only `xs` Button with the `action.drag` icon; a press always starts the drag, Alt+arrows on it reorder its item. In a `locked` item it is a lock instead: a `<span role="img">` named `labels.locked` with the `status.locked` icon, the grip's size, no ref.

| Prop | Type | Default | Description |
|---|---|---|---|
| `aria-label` | `string` | `labels.handle` | Accessible name. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" \| "children">` | — | `className`, `disabled` and the other button attributes. |

### Dnd.Draggable
Generic `Dnd.Draggable<TData>`; `ref` → `HTMLElement`. Renders the `as` element; stays in place at reduced opacity (`data-dragging`) while carried. The browser's own drag of an image or a link inside is stopped (in the capture phase: `onDragStart` here is the kit's event). Has no keyboard path of its own: offer a button or a menu for the same move.

| Prop | Type | Default | Description |
|---|---|---|---|
| `kind` | `string` | — (required) | What it is; zones accept by kind. |
| `id` | `string` | — (required) | Unique within its kind. |
| `data` | `TData` | — | Payload handed to the zone's `onDrop`. |
| `label` | `string` | `the id` | Spoken by the live region. |
| `disabled` | `boolean` | `false` | Not draggable. |
| `handle` | `boolean` | `false` | Only a `Dnd.Handle` inside starts the drag. |
| `as` | `"div" \| "li" \| "span" \| "article" \| "section"` | `"div"` | Element. |
| `onDragStart` | `(item, point, origin) => void` | — | Fired once the press became a drag. |
| `onDragEnd` | `(item, outcome: "drop" \| "release" \| "cancel") => void` | — | Always fired at the end. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "id">` | — | `className` and the other attributes. |

### Dnd.DropZone
Generic `Dnd.DropZone<TData>`; `ref` → `HTMLElement`. Renders the `as` element; state is mirrored by `data-dnd-over`, `data-dnd-reject`, `data-dnd-flash`. Where zones overlap, the innermost wins.

| Prop | Type | Default | Description |
|---|---|---|---|
| `accepts` | `string \| readonly string[] \| ((item: DragItem) => boolean)` | — (required) | Kinds it takes, or a predicate. |
| `onDrop` | `(item: DragItem<TData>) => void` | — (required) | An accepted item landed. |
| `canDrop` | `(item: DragItem<TData>) => boolean \| string` | — | Refuses an item: `false`, or a string that says why (spoken, and shown under the carried copy); the zone turns `danger` before the release. |
| `onEnter · onLeave` | `(item) => void · () => void` | — | An accepted item came over / left. |
| `flashOnDrop` | `boolean` | `false` | Flashes the zone after a drop. |
| `disabled` | `boolean` | `false` | Not a target. |
| `as` | `"div" \| "section" \| "li" \| "ul" \| "ol" \| "span"` | `"div"` | Element. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "onDrop">` | — | `className` (the zone's own look) and the other attributes. |

### moveBefore
`moveBefore(items, id, beforeId, getId)` returns `items` with `id` moved in front of `beforeId` (`null` = last): the body of every `onReorder`.

## Variants

### axis (Dnd.Sortable)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `y` | a column; the gap opens above or below neighbours | lists, settings, menus | yes |
| `x` | one row of items; the gap opens left or right | chips, tabs, tag strips | |
| `grid` | a wrapping grid in reading order; the gap is a cell | photo galleries, tiles | |

### as (Dnd.Sortable)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `div` | a flex column / row / grid of `div` items | most lists | yes |
| `ul` · `ol` | the same with `li` items | a list that reads as one to assistive tech | |
| `tbody` | table rows (`tr` items) in the table's own layout; the gap is a row across every column; the row flies inside a one-row copy of its table at its column widths | rows of a table (`axis="y"`) | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `handle` | only the grip starts a drag; the row keeps its controls | rows with buttons, switches, text | `false` |
| `kind` shared | lists exchange items at an exact position; Alt + ← / → moves across | boards | unique per list |
| `locked` (item) | a lock where the grip would be; the item holds its place, nothing moves past it | a pinned first row, a system column | `false` |
| `empty` | a line of the list's own while it is empty; a gap opening takes its place | columns, lists that may run out | — |
| `canDrop` → string | the refusal says why: live region and a chip under the clone | workflow rules a person must understand | — |
| `flashOnDrop` | the zone flashes `accent-soft` after a drop | the eye must follow where the item went | `false` |

## States
| State | Driven by | DOM |
|---|---|---|
| idle | — | items show `cursor: grab` |
| carried | a drag | the clone follows the pointer, lifted on `--prime-shadow-modal`, scale 1.02; a sortable source leaves the layout (`data-lifted`) and a dashed accent gap of its size and radius fades in and glides with the items as the landing spot moves; entering a connected list, it fades out in the list it left and in where it opens; crossing empty space (the gutter between lists) leaves the gap in the last list that takes the item; neighbours glide aside; a `Dnd.Draggable` stays at 0.4 opacity (`data-dragging`) |
| over a zone | pointer over an accepting zone | `data-dnd-over`: `accent-soft` fill, dashed accent outline |
| refused | `canDrop` returns `false` or a string | `data-dnd-reject`: `danger-soft` fill; the clone gets a dashed `danger` outline; a string is spoken once and shown in the tooltip's inverse chip under the clone (it fades in, `fast`) |
| locked | `locked` on an item | `data-locked`; no `aria-roledescription` or shortcuts; `Dnd.Handle` is a lock; the gap never stands where it would shift the item |
| empty | `empty` and no items | `data-dnd-empty` element in the list; out of the flow and faded once a gap opens in the list |
| dropped | release over a target, or over empty space while a list holds the gap | the clone glides to the item's new place and is swapped for the real element; `data-dnd-flash` with `flashOnDrop`; the clone sets down into the look the item will have in place — its resting shadow, or under the mouse its hover look: the item gets `data-dnd-hover` until the pointer leaves it or presses, so a host styles its hover lift on `:is(:hover, [data-dnd-hover])` and the card never dips to flat and lifts again |
| cancelled | Escape, a system-cancelled pointer | the clone flies back, nothing changes |
| saving | `onReorder` returned a pending promise (a drop or a keyboard move) | the item stays drawn in its new place until the promise settles; a rejection glides it back over `base` |
| moved from the keyboard | Alt + an arrow | the items glide to their new places over `base`, like during a drag |
| disabled | `disabled` | `data-disabled`, no `aria-roledescription` |

All motion is on the tokens (lift `fast`, glide and landing `base`, flash `slow`, `standard` easing; `data-dnd-flash` clears when the flash animation ends); under `prefers-reduced-motion` the lift, the gap fade, the glide, the flash, the reason chip and the empty fade are off.

**Host attributes — the styling contract.** Style a host on these, never on the kit's classes:

| Attribute | On | Means |
|---|---|---|
| `data-dnd-active="mouse \| touch \| pen"` | `<html>` | a drag is in flight (hide hover-only actions, stop snapping) |
| `data-dnd-item`, `data-dnd-kind` | every draggable | its id and kind |
| `data-lifted` | a sortable item | it is carried: out of the layout, the gap stands for it |
| `data-dragging` | a `Dnd.Draggable` / a sortable list | it is carried (the source fades) / an item of the list is in the air |
| `data-locked`, `data-disabled`, `data-handle` | an item | `locked`, `disabled`, the list has `handle` |
| `data-dnd-hover` | an item that just landed under the mouse | style its hover on `:is(:hover, [data-dnd-hover])` |
| `data-dnd-landing` | an item | hidden while the clone lands on it |
| `data-axis` | a `Dnd.Sortable` | `x`, `y` or `grid` (a host widens its rule with it: `.gallery[data-axis]`) |
| `data-dnd-over`, `data-dnd-reject` | a list or a zone | an accepted item is over it / the spot refuses it |
| `data-dnd-flash` | a `Dnd.DropZone` | flashing after a drop (`flashOnDrop`) |
| `data-dnd-gap`, `data-dnd-ghost` | the gap / a leaving gap's copy | count cells without them (`:not([data-dnd-ghost])`) |
| `data-dnd-empty` | the `empty` element | the list is empty |
| `data-dnd-mirror` | a part the host marks | kept in step on the carried copy |
| `data-dnd-ignore`, `data-dnd-handle` | a part the host marks | a press here never drags / always drags |

## Layout & spacing
- The list gap is `--prime-space-2`; override it with `className` (widen the rule with `[data-axis]` so it wins: `.gallery[data-axis] { gap: … }`).
- A grid (`axis="grid"`) is `display: grid`: the host sets the tracks (`grid-template-columns`) and the cells' size; the gap takes a cell, and a carried item resizes to the cell it would land in.
- The reason chip stands `--prime-tooltip-offset` under the carried copy, start-aligned, at most `--prime-tooltip-max-width` wide.
- The look of a row is the consumer's: give `Dnd.SortableItem` / `Dnd.Draggable` a fill, a radius and padding on its own class — the clone is portalled to `<body>`, ancestor selectors do not reach it. A table row is the exception: it flies inside empty copies (`display: contents`) of its ancestors up to the nearest surface (`data-depth`), so the table's own cell styles still apply.
- A scrollable ancestor under the pointer auto-scrolls within 64 px of its edge (a `ScrollContainer` strip works).
- Keep a zone's height stable between states; it only changes fill and outline.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves to the list items (with `handle`, to the grips). |
| `Alt + ↑` · `Alt + ↓` | Moves the item one place (`axis="x"` and `"grid"`: Alt + ← / → in the writing direction). |
| `Alt + ←` · `Alt + →` | In lists sharing a `kind`: moves the item to the same row of the neighbouring list (`axis="x"`: Alt + ↑ / ↓); focus follows. |
| `Escape` | Cancels a drag in flight. |

### ARIA
- A live region (`role="status"`, `aria-live="polite"`) announces grabbed, dropped, returned, cancelled, «position N of M», a move to another list by its name and a refusal with its reason, from `labels`.
- Every draggable item has `aria-roledescription` and `aria-keyshortcuts` (with the across keys in linked lists); the clone is `aria-hidden`.
- Name an item by what it shows: `aria-labelledby` on its visible title and `aria-describedby` on its description. An `aria-label` on the item replaces its content for assistive tech — use it only when the item shows no text (a photo tile). Name every linked list (`aria-label` or `aria-labelledby` on its heading): that name is spoken when an item moves into it.
- A `locked` item has no role description or shortcuts; its `Dnd.Handle` is a lock named `labels.locked`.
- Touch: a drag starts after a hold; a finger that moves first scrolls the page.
- `Dnd.Draggable` has no keyboard path of its own — offer a button or a menu for the same move.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `handle` | `"Перетащить"` | Name of `Dnd.Handle`. |
| `locked` | `"Закреплено"` | Name of the lock a `Dnd.Handle` shows in a `locked` item. |
| `roleDescription` | `"перетаскиваемый элемент"` | `aria-roledescription` of every draggable item. |
| `grabbed` | `"{label}: взят"` | Live region: picked up. |
| `dropped` | `"{label}: перемещён"` | Live region: dropped on a target. |
| `returned` | `"{label}: возвращён на место"` | Live region: released over nothing. |
| `cancelled` | `"{label}: перемещение отменено"` | Live region: cancelled (Escape, interruption). |
| `moved` | `"{label}: позиция {position} из {total}"` | Live region: moved with the keyboard. |
| `movedTo` | `"{label}: «{list}», позиция {position} из {total}"` | Live region: moved to a linked list with the keyboard; `{list}` is its accessible name. |
| `refused` | `"{label}: «{list}» не принимает элемент"` | Live region: a linked list refused a keyboard move (`canDrop` answered `false`). |
| `refusedReason` | `"{label}: {reason}"` | Live region: a target refused the item and said why (`canDrop` answered a string). |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Project tasks reordered by dragging the whole row; one root above, the move applied with a helper — `Dnd.Root`, `Dnd.Sortable`, `onReorder`, `moveBefore`. |
| [handle.tsx](examples/handle.tsx) | Notification channels with switches: only the grip starts a drag, and the async save can roll the order back — `handle`, `Dnd.Handle`, `onReorder`. |
| [grid.tsx](examples/grid.tsx) | Product photos in a wrapping grid: a photo carried across rows lands in reading order, the gap takes a cell, Alt + ← / → steps it one place — `axis`. |
| [locked.tsx](examples/locked.tsx) | Sections of a workspace menu: the home section is pinned first with a lock in place of its grip, the rest reorder around nothing past it; each row is named by its visible title — `locked`, `handle`, `aria-labelledby`. |
| [board.tsx](examples/board.tsx) | A ticket board: columns share one kind, so a ticket lands in another column at an exact position or moves there with Alt + ← / →, an empty column says so, and a full column refuses it before the release with the reason under the ticket — `kind`, `canDrop`, `empty`, `onReorder`. |
| [drop-zones.tsx](examples/drop-zones.tsx) | Documents carried onto folders: a zone takes items by kind, a locked folder refuses before the release and says why under the carried file, the target flashes where the file landed — `Dnd.Draggable`, `Dnd.DropZone`, `canDrop`, `flashOnDrop`. |
| [narrow.tsx](examples/narrow.tsx) | A row of status filters in a 320 px strip: tags reorder sideways and the strip scrolls when a tag is held near its edge — `axis`. |

## Mistakes
- No `Dnd.Root` above the screen → nothing drags. Mount it once at the app root.
- A `Dnd.SortableItem` `id` that differs from `getId(item)` → the item never moves.
- Rendering items yourself instead of through `renderItem` → the list cannot draw the gap or the optimistic order.
- Using `index` as the id → ids must survive a reorder.
- Styling a row from an ancestor selector (`.list .row`) → the flying clone loses it.
- Starting a drag from a button inside a row without `handle` → presses on controls are theirs; use `Dnd.Handle`.
- A drag-only move with no alternative → add a button or a menu for the same action.
- `aria-label` on an item that shows a title and a description → it hides them; point `aria-labelledby` / `aria-describedby` at them.
- `draggable={false}` on every image inside an item → not needed: the kit stops the browser's own drag inside its items.
- A pinned row kept first by re-sorting the array after every move → `locked` on its item.
- An empty-list message rendered next to the list → pass it as `empty`: the gap takes its place while an item is over the list.
- `canDrop` returning `false` where the rule is not obvious → return the reason as a string.

## Related
- **Built from:** [Button](../button/COMPONENT.md), `Icon` (`action.drag` for the grip, `status.locked` for a locked item's lock)
- **See also:** [Kanban](../kanban/COMPONENT.md), [DataTable](../data-table/COMPONENT.md) (`onReorder`), [FileUpload](../file-upload/COMPONENT.md), [ScrollContainer](../scroll-container/COMPONENT.md), [Card](../card/COMPONENT.md)
