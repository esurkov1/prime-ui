# Dnd

**Category:** layout
**Kind:** composite

> Pointer-driven drag and drop: reorderable lists, draggable items and drop zones on one shared session, with a lifted clone, a gap where the item lands, auto-scroll, touch support and a keyboard path.

## When to use
- Reordering a list, a row of chips or a set of settings by hand (`Dnd.Sortable`).
- Moving an item between lists to an exact position: a board of columns (several `Dnd.Sortable` with one `kind`).
- Moving an item onto a target with no inner order: a folder, an assignee (`Dnd.Draggable` + `Dnd.DropZone`).

## When not to use
- Picking files from the computer → use [FileUpload](../file-upload/COMPONENT.md) (native file drop).
- An order that is a plain setting with few options → a [Select](../select/COMPONENT.md) or [SegmentedControl](../segmented-control/COMPONENT.md) is faster.
- Dragging values (a slider thumb, a color square) → use [Slider](../slider/COMPONENT.md) or [ColorPicker](../color-picker/COMPONENT.md).
- Reordering table rows or a virtualized list → not covered: the engine measures the DOM, so only mounted items take part.

## Import
```tsx
import { Dnd, moveBefore } from "prime-ui-kit";
```

## Anatomy
```
Dnd.Root                         session owner: overlay (portal), live region, labels — mount once
├─ Dnd.Sortable                  list container and drop target; renders items in the drawn order
│  └─ Dnd.SortableItem           one item (li in ul/ol, div otherwise); the gap is drawn before it
│     └─ Dnd.Handle              optional grip: a ghost icon-only Button (with `handle` on the list)
├─ Dnd.Draggable                 an item to carry elsewhere; stays in place, faded, until the drop
└─ Dnd.DropZone                  a box that takes dropped items
```
A drag in flight is drawn by `Dnd.Root` as a clone of the lifted element above every layer, following the pointer. The page gets `data-dnd-active="mouse | touch | pen"` on `<html>` for the length of the gesture.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Dnd.Root
No ref, no DOM of its own besides the portalled overlay and a visually hidden live region. Owns the one drag session the app shares — mount it once above every screen that drags. Without a root the parts render but do not drag.

| Prop | Type | Default | Description |
|---|---|---|---|
| `labels` | `Partial<DndLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | The app or the screen that drags. |

### Dnd.Sortable
Generic `Dnd.Sortable<T>`; `ref` → `HTMLElement`. Renders `<div>`, `<ul>` or `<ol>` and registers itself as the drop target; draws the gap and the optimistic order. Sets `data-axis` and `data-dragging`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `readonly T[]` | — (required) | Items in their current order. |
| `getId` | `(item: T) => string` | — (required) | Stable unique id; must match `Dnd.SortableItem id`. |
| `getLabel` | `(item: T) => string` | `the id` | Spoken by the live region. |
| `onReorder` | `(id: string, beforeId: string \| null) => DndReorderResult \| Promise<DndReorderResult>` | — (required) | The item `id` lands in front of `beforeId` (`null` = last); with connected lists `id` may come from another list. Apply it with `moveBefore`; return `{ ok: false }` (or reject) to roll the drawn order back. |
| `renderItem` | `(item: T, index: number) => ReactNode` | — (required) | Returns a `Dnd.SortableItem`. |
| `axis` | `"x" \| "y"` | `"y"` | A column or a single row; wrapping grids are not supported. |
| `handle` | `boolean` | `false` | Only `Dnd.Handle` starts a drag; the rest of the item stays free for clicks and text selection. |
| `disabled` | `boolean` | `false` | No drag, no keyboard reorder. |
| `kind` | `string` | `unique per list` | Lists sharing a `kind` exchange items (a board). |
| `canDrop` | `(id: string) => boolean` | — | Refuses an item by id; the list gets `data-dnd-reject` and turns `danger` before the release. |
| `as` | `"div" \| "ul" \| "ol"` | `"div"` | Root element; `ul` / `ol` render items as `li`. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "children">` | — | `className` (the list layout), `aria-label` (the name of the list) and the other attributes of the list element. |

### Dnd.SortableItem
`ref` → `HTMLElement`. `<li>` inside `ul` / `ol`, `<div>` otherwise; throws outside `Dnd.Sortable`. Sets `data-lifted`, `data-dnd-item`, `aria-roledescription`, `aria-keyshortcuts` and `tabIndex={0}` (not with `handle`). Presses on buttons, fields, links and `[data-dnd-ignore]` inside never start a drag.

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — (required) | The item id (same as `getId`). |
| `disabled` | `boolean` | `false` | This item cannot be dragged or moved. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "id">` | — | `className` (the row look: fill, radius, padding) and the other attributes; `onPointerDown` / `onKeyDown` run first, `preventDefault()` keeps the drag from starting. |

### Dnd.Handle
`ref` → `HTMLButtonElement`. The grip: a ghost icon-only `xs` Button with the `action.drag` icon; a press always starts the drag, Alt+arrows on it reorder its item.

| Prop | Type | Default | Description |
|---|---|---|---|
| `aria-label` | `string` | `labels.handle` | Accessible name. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" \| "children">` | — | `className`, `disabled` and the other button attributes. |

### Dnd.Draggable
Generic `Dnd.Draggable<TData>`; `ref` → `HTMLElement`. Renders the `as` element; stays in place at reduced opacity (`data-dragging`) while carried. Has no keyboard path of its own: offer a button or a menu for the same move.

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
| `canDrop` | `(item: DragItem<TData>) => boolean` | — | Refuses an item; the zone turns `danger` before the release. |
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

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `handle` | only the grip starts a drag; the row keeps its controls | rows with buttons, switches, text | `false` |
| `kind` shared | lists exchange items at an exact position | boards | unique per list |
| `flashOnDrop` | the zone flashes `accent-soft` after a drop | the eye must follow where the item went | `false` |

## States
| State | Driven by | DOM |
|---|---|---|
| idle | — | items show `cursor: grab` |
| carried | a drag | the clone follows the pointer, lifted on `--prime-shadow-modal`, scale 1.02; a sortable source leaves the layout (`data-lifted`) and a dashed accent gap of its size and radius fades in and glides with the items as the landing spot moves; entering a connected list, it fades out in the list it left and in where it opens; crossing empty space (the gutter between lists) leaves the gap in the last list that takes the item; neighbours glide aside; a `Dnd.Draggable` stays at 0.4 opacity (`data-dragging`) |
| over a zone | pointer over an accepting zone | `data-dnd-over`: `accent-soft` fill, dashed accent outline |
| refused | `canDrop` returns `false` | `data-dnd-reject`: `danger-soft` fill; the clone gets a dashed `danger` outline |
| dropped | release over a target, or over empty space while a list holds the gap | the clone glides to the item's new place and is swapped for the real element; `data-dnd-flash` with `flashOnDrop` |
| cancelled | Escape, a system-cancelled pointer | the clone flies back, nothing changes |
| disabled | `disabled` | `data-disabled`, no `aria-roledescription` |

All motion is on the tokens (lift `fast`, glide and landing `base`, flash `slow`, `standard` easing; `data-dnd-flash` clears when the flash animation ends); under `prefers-reduced-motion` the lift, the gap fade, the glide and the flash are off.

## Layout & spacing
- The list gap is `--prime-space-2`; override it with `className`.
- The look of a row is the consumer's: give `Dnd.SortableItem` / `Dnd.Draggable` a fill, a radius and padding on its own class — the clone is portalled to `<body>`, ancestor selectors do not reach it.
- A scrollable ancestor under the pointer auto-scrolls within 64 px of its edge (a `ScrollContainer` strip works).
- Keep a zone's height stable between states; it only changes fill and outline.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves to the list items (with `handle`, to the grips). |
| `Alt + ↑` · `Alt + ↓` | Moves the item one place (`axis="x"`: Alt + ← / →). |
| `Escape` | Cancels a drag in flight. |

### ARIA
- A live region (`role="status"`, `aria-live="polite"`) announces grabbed, dropped, returned, cancelled and «position N of M» from `labels`.
- Every draggable item has `aria-roledescription` and `aria-keyshortcuts`; the clone is `aria-hidden`.
- Touch: a drag starts after a hold; a finger that moves first scrolls the page.
- `Dnd.Draggable` has no keyboard path of its own — offer a button or a menu for the same move.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `handle` | `"Перетащить"` | Name of `Dnd.Handle`. |
| `roleDescription` | `"перетаскиваемый элемент"` | `aria-roledescription` of every draggable item. |
| `grabbed` | `"{label}: взят"` | Live region: picked up. |
| `dropped` | `"{label}: перемещён"` | Live region: dropped on a target. |
| `returned` | `"{label}: возвращён на место"` | Live region: released over nothing. |
| `cancelled` | `"{label}: перемещение отменено"` | Live region: cancelled (Escape, interruption). |
| `moved` | `"{label}: позиция {position} из {total}"` | Live region: moved with the keyboard. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Project tasks reordered by dragging the whole row; one root above, the move applied with a helper — `Dnd.Root`, `Dnd.Sortable`, `onReorder`, `moveBefore`. |
| [handle.tsx](examples/handle.tsx) | Notification channels with switches: only the grip starts a drag, and the async save can roll the order back — `handle`, `Dnd.Handle`, `onReorder`. |
| [board.tsx](examples/board.tsx) | A ticket board: columns share one kind, so a ticket lands in another column at an exact position, and a full column refuses it before the release — `kind`, `canDrop`, `onReorder`. |
| [drop-zones.tsx](examples/drop-zones.tsx) | Documents carried onto folders: a zone takes items by kind, a locked folder refuses before the release, the target flashes where the file landed — `Dnd.Draggable`, `Dnd.DropZone`, `canDrop`, `flashOnDrop`. |
| [narrow.tsx](examples/narrow.tsx) | A row of status filters in a 320 px strip: tags reorder sideways and the strip scrolls when a tag is held near its edge — `axis`. |

## Mistakes
- No `Dnd.Root` above the screen → nothing drags. Mount it once at the app root.
- A `Dnd.SortableItem` `id` that differs from `getId(item)` → the item never moves.
- Rendering items yourself instead of through `renderItem` → the list cannot draw the gap or the optimistic order.
- Using `index` as the id → ids must survive a reorder.
- Styling a row from an ancestor selector (`.list .row`) → the flying clone loses it.
- Starting a drag from a button inside a row without `handle` → presses on controls are theirs; use `Dnd.Handle`.
- A drag-only move with no alternative → add a button or a menu for the same action.

## Related
- **Built from:** [Button](../button/COMPONENT.md)
- **See also:** [FileUpload](../file-upload/COMPONENT.md), [ScrollContainer](../scroll-container/COMPONENT.md), [Card](../card/COMPONENT.md)
