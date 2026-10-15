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
│  │  └─ Dnd.Handle              optional grip, last in the item: a ghost icon-only Button (with `handle` on the list); a lock in a `locked` item; busy while the item's move is saved
│  ├─ empty                      the `empty` content while the list has no items
│  └─ children                   optional content after the items that never moves (an add tile)
├─ Dnd.Draggable                 an item to carry elsewhere; stays in place, faded, until the drop
└─ Dnd.DropZone                  a box that takes dropped items
```
A drag in flight is drawn by `Dnd.Root` as a clone of the lifted element above every layer, following the pointer. The clone flies inside empty copies (`display: contents`) of its ancestors up to the nearest surface (`data-depth`) and that surface's `data-theme`, so the host's variables and selectors (a List row's tier padding and radius) dress it exactly as the item in place, and it sets down without a jump; an item without a fill of its own flies on the fill of the surface it was lifted from (`--prime-color-layer-current`). A refusal with a reason shows the reason in the tooltip's chip under the clone. The page gets `data-dnd-active="mouse | touch | pen"` on `<html>` for the length of the gesture (the holding cursor), and every list of the carried item's kind gets `data-dnd-carrying`.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Dnd.Root
No ref, no DOM of its own besides the portalled overlay and a visually hidden live region. Owns the one drag session the app shares: mount it once above every screen that drags; a root inside another renders only its children. Without a root nothing drags.

| Prop | Type | Default | Description |
|---|---|---|---|
| `labels` | `Partial<DndLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | The app or the screen that drags. |

### Dnd.Sortable
Generic `Dnd.Sortable<T>`; `ref` → `HTMLElement`. The list and its drop target: renders the items through `renderItem`, draws the gap and the optimistic order. Sets `data-axis`, `data-disabled`, `data-dragging`, `data-dnd-carrying`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `readonly T[]` | — (required) | Items in their current order. |
| `getId` | `(item: T) => string` | — (required) | Stable unique id; must match `Dnd.SortableItem id`. |
| `getLabel` | `(item: T) => string` | the `id` | Spoken by the live region. |
| `onReorder` | `(id: string, beforeId: string \| null) => void \| Promise<void>` | — (required) | Item `id` lands in front of `beforeId` (`null` = last), maybe from a linked list. Apply it with `moveBefore`; a returned promise keeps the item still and busy until it settles, a rejection moves it back. |
| `renderItem` | `(item: T, index: number) => ReactNode` | — (required) | Returns a `Dnd.SortableItem`. During a drag `index` is the place the item will have on release, so a shown position follows the gap; parts marked `data-dnd-mirror` stay in step on the carried copy. |
| `children` | `ReactNode` | — | Content after the items that never moves and takes no drop position: an add tile at the end of a grid. Inside `ul` / `ol` it must be `li`. |
| `axis` | `"x" \| "y" \| "grid"` | `"y"` | A column, a single row, or a wrapping grid (`display: grid`; the host sets the tracks and the cells' size, the gap takes a cell). Keyboard: Alt + ↑ / ↓ in a column, Alt + ← / → in a row and a grid. |
| `handle` | `boolean` | `false` | Only `Dnd.Handle` starts a drag; the rest of the item stays free for clicks and text selection. |
| `disabled` | `boolean` | `false` | No drag, no keyboard reorder. |
| `kind` | `string` | unique per list | Lists sharing a `kind` exchange items (a board): an item from another list arrives in `onReorder` with an `id` not in `items`. Alt + the arrows across the axis move it by keyboard. Name each list: it is spoken. |
| `canDrop` | `(id: string) => boolean \| string` | — | Refuses an item by id: `false`, or a string that says why (spoken and shown under the carried copy). The list turns `danger` before the release. |
| `empty` | `ReactNode` | — | Shown while the list has no items, inside a dashed drop slot while the list takes drops; fades out when a gap opens in the list, so the gap takes its place. |
| `as` | `"div" \| "ul" \| "ol" \| "tbody"` | `"div"` | Root element; `ul` / `ol` render items as `li`, `tbody` as table rows `tr` (the gap is a row across every column, the carried copy keeps every cell's width). |
| `header` | `ReactNode` | — | Content in front of the items that never moves and takes no drop position: the heading row of a group in a `tbody`. |
| `aria-label` | `string` | — | Accessible name of the list. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "children">` | — | `className` (the list layout), `aria-label` (the name of the list) and the other attributes of the list element. |

### Dnd.SortableItem
`ref` → `HTMLElement`. `<li>` inside `ul` / `ol`, `<tr>` inside `tbody`, `<div>` otherwise; throws outside `Dnd.Sortable`. One item; presses on controls inside never drag. Without `handle` it takes the keys, and a named `<div>` item is a `button`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — (required) | The item id (same as `getId`). |
| `disabled` | `boolean` | `false` | This item cannot be dragged or moved (others may still move past it). |
| `locked` | `boolean` | `false` | Holds its place: it does not move and nothing is put where it would shift it. Its `Dnd.Handle` turns into a lock. A pinned first row, a system column. |
| `className` | `string` | — | The row look: fill, radius, padding. |
| `children` | `ReactNode` | — | The row content. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "id">` | — | `aria-labelledby` / `aria-describedby` (the visible title and description) and the other attributes. |

### Dnd.Handle
`ref` → `HTMLButtonElement` (`HTMLSpanElement` in a `locked` item). The grip: a ghost icon-only `xs` Button that starts the drag and takes the item's keys; busy while saving. In a `locked` item it is a lock. Place it last in the item, after its controls.

| Prop | Type | Default | Description |
|---|---|---|---|
| `aria-label` | `string` | `labels.handle` | Accessible name. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" \| "children">` | — | `className`, `disabled` and the other button attributes. |

### Dnd.Draggable
Generic `Dnd.Draggable<TData>`; `ref` → `HTMLElement`. An item carried onto a `Dnd.DropZone`; stays in place, faded, while carried; a named one is a `button`. No keyboard path: offer a button or a menu for the same move.

| Prop | Type | Default | Description |
|---|---|---|---|
| `kind` | `string` | — (required) | What it is; zones accept by kind. |
| `id` | `string` | — (required) | Unique within its kind. |
| `data` | `TData` | — | Payload handed to the zone's `onDrop`. |
| `label` | `string` | the `id` | Spoken by the live region. |
| `disabled` | `boolean` | `false` | Not draggable. |
| `handle` | `boolean` | `false` | Only a `Dnd.Handle` inside starts the drag. |
| `as` | `"div" \| "li" \| "span" \| "article" \| "section"` | `"div"` | Element. |
| `onDragStart` | `(item, point, origin) => void` | — | Fired once the press became a drag. |
| `onDragEnd` | `(item, outcome: "drop" \| "release" \| "cancel") => void` | — | Always fired at the end. |
| `className` | `string` | — | Class on the item. |
| `children` | `ReactNode` | — | The item content. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "id" \| "onDragStart" \| "onDragEnd">` | — | `className` and the other attributes. |

### Dnd.DropZone
Generic `Dnd.DropZone<TData>`; `ref` → `HTMLElement`. Renders the `as` element; state is mirrored by `data-dnd-over`, `data-dnd-reject`, `data-dnd-flash`. Where zones overlap, the innermost wins.

| Prop | Type | Default | Description |
|---|---|---|---|
| `accepts` | `string \| readonly string[] \| ((item: DragItem) => boolean)` | — (required) | Kinds it takes, or a predicate. |
| `onDrop` | `(item: DragItem<TData>) => void` | — (required) | An accepted item landed. |
| `canDrop` | `(item: DragItem<TData>) => boolean \| string` | — | Refuses an item: `false`, or a string that says why (spoken, and shown under the carried copy); the zone turns `danger` before the release. |
| `onEnter · onLeave` | `(item) => void · () => void` | — | An accepted item came over / left. |
| `flashOnDrop` | `boolean` | `false` | Flashes the zone after a drop, so the eye can follow where the item went. |
| `disabled` | `boolean` | `false` | Not a target. |
| `as` | `"div" \| "section" \| "li" \| "ul" \| "ol" \| "span"` | `"div"` | Element. |
| `className` | `string` | — | The zone look. |
| `children` | `ReactNode` | — | The zone content. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "onDrop">` | — | The other attributes. |

### Functions

#### `moveBefore(items, id, beforeId, getId)`
`<T>(items: readonly T[], id: string, beforeId: string \| null, getId: (item: T) => string) => T[]`

Returns `items` with `id` moved in front of `beforeId` (`null` = last): the body of every `onReorder`.

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
| `empty` | the list's own line inside a dashed drop slot while it is empty (no slot when the list is `disabled`); a gap opening takes its place | columns, lists that may run out | — |
| `canDrop` → string | the refusal says why: live region and a chip under the clone | workflow rules a person must understand | — |
| `flashOnDrop` | after a drop the zone's fill starts at `accent-soft` and fades back to its own | the eye must follow where the item went | `false` |

## States
| State | Driven by | DOM |
|---|---|---|
| idle | — | items show `cursor: grab` |
| carried | a drag | the clone follows the pointer, lifted on `--prime-shadow-modal`, scale 1.02; a sortable source leaves the layout (`data-lifted`) and a dashed accent gap of its size and radius fades in and glides with the items as the landing spot moves; entering a connected list, it fades out in the list it left and in where it opens; crossing empty space (the gutter between lists) leaves the gap in the last list that takes the item; neighbours glide aside; a `Dnd.Draggable` stays at 0.4 opacity (`data-dragging`) |
| over a zone | pointer over an accepting zone | `data-dnd-over`: `accent-soft` fill, dashed accent outline |
| refused | `canDrop` returns `false` or a string | `data-dnd-reject`: `danger-soft` fill fading in (`fast`); the clone gets a dashed `danger` outline; a string is spoken once and shown in the tooltip's inverse chip under the clone (it drops in, `fast`) |
| locked | `locked` on an item | `data-locked`; no `aria-roledescription` or shortcuts; `Dnd.Handle` is a lock; the gap never stands where it would shift the item, a keyboard step past it does not happen, and an item from another list takes the nearest free place after it |
| empty | `empty` and no items | `data-dnd-empty` element in the list (an `li` with `role="presentation"` in `ul` / `ol`, a `div` otherwise), a dashed drop slot around it; out of the flow and faded (`fast`) once a gap opens in the list |
| dropped | release over a target, or over empty space while a list holds the gap | the clone glides to the item's new place and is swapped for the real element; `data-dnd-flash` with `flashOnDrop`; the clone sets down into the look the item will have in place — its resting shadow, or under the mouse its hover look: the item gets `data-dnd-hover` until the pointer leaves it or presses, so a host styles its hover lift on `:is(:hover, [data-dnd-hover])` and the card never dips to flat and lifts again |
| cancelled | Escape, a system-cancelled pointer | the clone flies back, nothing changes |
| saving | `onReorder` returned a pending promise (a drop or a keyboard move) | the item stays drawn in its new place until the promise settles, with `aria-busy` and `data-pending`, and holds still; its `Dnd.Handle` is busy; apply the new order before resolving; a rejection glides it back over `base` |
| moved from the keyboard | Alt + an arrow | the items glide to their new places over `base`, like during a drag |
| disabled | `disabled` | `data-disabled` on the item (and on the list), no `aria-roledescription` |

All motion is on the tokens (lift `fast`, a transition from the clone's resting size; glide and landing `base`; flash `slow`, an animation of the zone's fill that `data-dnd-flash` marks while it runs; the faded source and the refusal fill `fast`; `standard` easing); under `prefers-reduced-motion` the lift, the gap fade, the glide, the flash and the reason chip's drop are off, while the faded source, the refusal fill, the reason chip's fade and the empty fade stay (they run on the fade clocks).

An item's own `onPointerDown` / `onKeyDown` run before the kit's: `preventDefault()` in them keeps the drag from starting. Presses on buttons, fields, links and `[data-dnd-ignore]` inside an item never start a drag. The browser's own drag of an image or a link inside an item or a `Dnd.Draggable` is stopped in the capture phase, so `onDragStart` on `Dnd.Draggable` is the kit's event.

**Host attributes — the styling contract.** Style a host on these, never on the kit's classes:

| Attribute | On | Means |
|---|---|---|
| `data-dnd-active="mouse \| touch \| pen"` | `<html>` | a drag is in flight: the holding cursor everywhere |
| `data-dnd-carrying` (`DND_CARRYING_ATTRIBUTE`) | a `Dnd.Sortable` | an item of its kind is carried: scope a host's drag-time look to it (hide hover-only actions, stop snapping in the scroller around it) |
| `data-dnd-item`, `data-dnd-kind` | every draggable | its id and kind |
| `data-lifted` | a sortable item | it is carried: out of the layout, the gap stands for it |
| `data-dragging` | a `Dnd.Draggable` / a sortable list | it is carried (the source fades) / an item of the list is in the air |
| `data-locked`, `data-disabled`, `data-handle`, `data-pending` | an item | `locked`, `disabled`, the list has `handle`, its move is being saved |
| `data-dnd-hover` | an item that just landed under the mouse | style its hover on `:is(:hover, [data-dnd-hover])` |
| `data-dnd-landing` | an item | hidden while the clone lands on it |
| `data-axis` | a `Dnd.Sortable` | `x`, `y` or `grid` (a host widens its rule with it: `.gallery[data-axis]`) |
| `data-dnd-over`, `data-dnd-reject` | a list or a zone | an accepted item is over it / the spot refuses it |
| `data-dnd-flash` | a `Dnd.DropZone` | flashing after a drop (`flashOnDrop`) |
| `data-dnd-gap`, `data-dnd-ghost` | the gap / a leaving gap's out-of-flow copy, fading out mid-drag | count cells without them (`:not([data-dnd-ghost])`) |
| `data-dnd-empty` | the `empty` element | the list is empty |
| `data-dnd-mirror` | a part the host marks | kept in step on the carried copy (a shown position from `renderItem`'s `index`; rolling digits roll) |
| `data-dnd-ignore`, `data-dnd-handle` | a part the host marks | a press here never drags / always drags |

## Layout & spacing
- The distance between items is `--prime-space-2`; a host sets `--dnd-sortable-gap` on the list for another one.
- A grid (`axis="grid"`) is `display: grid`: the host sets the tracks (`grid-template-columns`) and the cells' size; the gap takes a cell, and a carried item resizes to the cell it would land in.
- A `Dnd.Handle` ends its item: the last child, after the item's own controls (a switch, a remove button), at the inline end (on the left in RTL); a `locked` item's lock takes the same place, so the grips of every row stand on one line. In a table it is the last cell.
- The reason chip stands `--prime-tooltip-offset` under the carried copy, start-aligned, at most `--prime-tooltip-max-width` wide.
- The look of a row is the consumer's: give `Dnd.SortableItem` / `Dnd.Draggable` a radius on its own class (the gap and the clone's fill take it) and keep the row's look within its ancestors up to the nearest surface (`data-depth`) — the clone flies inside empty copies (`display: contents`) of exactly those, so their variables and selectors still apply. A table row flies in a one-row copy of its table inside them.
- A scrollable ancestor under the pointer auto-scrolls within 64 px of its edge (a `ScrollContainer` strip works).
- Keep a zone's height stable between states; it only changes fill and outline.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves to the list items (with `handle`, to the grips). |
| `Alt + ↑` · `Alt + ↓` | Moves the item one place (`axis="x"` and `"grid"`: Alt + ← / → in the writing direction). |
| `Alt + ←` · `Alt + →` | In lists sharing a `kind`: moves the item to the same row of the neighbouring list (`axis="x"`: Alt + ↑ / ↓); focus follows. |
| `Escape` | Cancels a drag in flight. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- A live region (`role="status"`, `aria-live="polite"`) announces grabbed, dropped, returned, cancelled, «position N of M», a move to another list by its name and a refusal with its reason, from `labels`.
- The keyboard target of a sortable item has `aria-keyshortcuts` (with the across keys in linked lists) and `aria-roledescription` and is in the tab order: the item itself (`tabIndex={0}`; a named `<div>` item is a `button`, an `li` or a `tr` keeps its role), or with `handle` its grip. A role description stands only on an element with a role. The clone is `aria-hidden`.
- While `onReorder`'s promise is pending, the item has `aria-busy` and holds still, and its `Dnd.Handle` is busy.
- In lists sharing a `kind`, Alt + the across arrows move the item to the same row of the neighbouring list in document order; focus follows the item.
- Name an item by what it shows: `aria-labelledby` on its visible title and `aria-describedby` on its description. An `aria-label` on the item replaces its content for assistive tech — use it only when the item shows no text (a photo tile). Name every linked list (`aria-label` or `aria-labelledby` on its heading): that name is spoken when an item moves into it.
- A `locked` item has no role description or shortcuts; its `Dnd.Handle` is a lock: a `<span role="img">` named `labels.locked` with the `status.locked` icon at the grip's size, taking the grip's `ref` and attributes.
- Touch: a drag starts after a hold; a finger that moves first scrolls the page.
- `Dnd.Draggable` has no keyboard path of its own — offer a button or a menu for the same move.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `handle` | `"Перетащить"` | Name of `Dnd.Handle`. |
| `locked` | `"Закреплено"` | Name of the lock a `Dnd.Handle` shows in a `locked` item. |
| `roleDescription` | `"перетаскиваемый элемент"` | `aria-roledescription` of every draggable item (its grip with `handle`). |
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
| [drop-zones.tsx](examples/drop-zones.tsx) | Documents carried onto folders: a zone takes items by kind and gets the document as data, a locked folder refuses before the release and says why under the carried file, a syncing folder is no target at all, a document on signing stays put, the line above follows the drag, the target flashes where the file landed — `Dnd.Draggable`, `Dnd.DropZone`, `data`, `canDrop`, `disabled`, `onDragStart`, `onDragEnd`, `onEnter`, `onLeave`, `flashOnDrop`. |
| [table.tsx](examples/table.tsx) | A project estimate as a table: each stage is its own body of rows under a heading row that never moves, a row is carried by its grip within a stage or into another, and the rows stay table rows — `as`, `header`, `kind`, `handle`. |
| [states.tsx](examples/states.tsx) | A contract's approval route: a step already signed stays where it is while the rest reorder around it, and once the route is approved the whole list holds still — `Dnd.SortableItem`, `Dnd.Sortable`, `disabled`. |
| [narrow.tsx](examples/narrow.tsx) | A row of status filters in a 320 px strip: tags reorder sideways and the strip scrolls when a tag is held near its edge — `axis`. |

## Mistakes
- No `Dnd.Root` above the screen → nothing drags. Mount it once at the app root.
- A `Dnd.SortableItem` `id` that differs from `getId(item)` → the item never moves.
- Rendering items yourself instead of through `renderItem` → the list cannot draw the gap or the optimistic order.
- Using `index` as the id → ids must survive a reorder.
- Styling a row from an ancestor above the nearest surface (`data-depth`) → the flying clone loses it; keep the row's look on the row and its hosts inside the surface.
- Starting a drag from a button inside a row without `handle` → presses on controls are theirs; use `Dnd.Handle`.
- A drag-only move with no alternative → add a button or a menu for the same action.
- `aria-label` on an item that shows a title and a description → it hides them; point `aria-labelledby` / `aria-describedby` at them.
- `draggable={false}` on every image inside an item → not needed: the kit stops the browser's own drag inside its items.
- A pinned row kept first by re-sorting the array after every move → `locked` on its item.
- An empty-list message rendered next to the list → pass it as `empty`: it stands in the drop slot, and the gap takes its place while an item is over the list.
- A drag-time look keyed to `<html data-dnd-active>` → key it to the list's `data-dnd-carrying`.
- `canDrop` returning `false` where the rule is not obvious → return the reason as a string.

## Related
- **Built from:** [Button](../button/COMPONENT.md), `Icon` (`action.drag` for the grip, `status.locked` for a locked item's lock), [VisuallyHidden](../visually-hidden/COMPONENT.md)
- **See also:** [Kanban](../kanban/COMPONENT.md), [DataTable](../data-table/COMPONENT.md) (`onReorder`), [FileUpload](../file-upload/COMPONENT.md), [ScrollContainer](../scroll-container/COMPONENT.md), [Card](../card/COMPONENT.md)
