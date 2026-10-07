# Dnd

**Category:** layout

> Pointer-driven drag and drop: reorderable lists, draggable items and drop zones on one shared session, with a lifted clone, a gap where the item lands, auto-scroll, touch support and a keyboard path.

## When to use
- Reordering a list, a row of chips or a set of settings by hand (`Dnd.Sortable`).
- Moving an item between lists to an exact position: a board of columns (several `Dnd.Sortable` with one `kind`).
- Moving an item onto a target with no inner order: a folder, an assignee (`Dnd.Draggable` + `Dnd.DropZone`).
- Any custom drag that none of the parts cover, through the hooks (`useDragSource`, `useDropTarget`, `useSortableList`).

## When not to use
- Picking files from the computer → use [FileUpload](../file-upload/COMPONENT.md) (native file drop).
- Ordering that is a plain setting with few options → a [Select](../select/COMPONENT.md) or [SegmentedControl](../segmented-control/COMPONENT.md) is faster and works everywhere.
- Dragging values (a slider thumb, a color square) → use [Slider](../slider/COMPONENT.md) or [ColorPicker](../color-picker/COMPONENT.md).
- Reordering table rows or a virtualized list → not covered yet; the engine measures the DOM, so only mounted items take part.

## Import
```tsx
import { Dnd, moveBefore } from "prime-ui-kit";
```

## Anatomy
```
Dnd.Root                         session owner: overlay (portal), live region, labels — mount once
├─ Dnd.Sortable                  list container and drop target; renders items in the drawn order
│  └─ Dnd.SortableItem           one item (li in ul/ol, div otherwise); the gap is drawn before it
│     └─ Dnd.Handle              optional grip button (with `handle` on the list)
├─ Dnd.Draggable                 an item to carry elsewhere; stays in place, faded, until the drop
└─ Dnd.DropZone                  a box that takes dropped items
```
A drag in flight is drawn by `Dnd.Root` as a clone of the lifted element above every layer (`--prime-z-toast`), following the pointer. The page gets `data-dnd-active="mouse | touch | pen"` on `<html>` for the length of the gesture.

## API

### Dnd.Root
Provider. No DOM of its own except the portalled overlay and a visually hidden live region.

| Prop | Type | Default | Description |
|---|---|---|---|
| `labels` | `Partial<DndLabels>` | Russian defaults | Built-in strings, see Accessibility. |
| `children` | `ReactNode` | — | The app or the screen that drags. |

One `Dnd.Root` per app, above every screen that drags. A drag crosses component boundaries by nature; two roots could never hand an item from one to the other. Without a root the parts render normally but are not draggable (keyboard reorder still works).

### Dnd.Sortable
Generic component: `Dnd.Sortable<T>`. Renders `<div>`, `<ul>` or `<ol>`. No ref forwarding. Registers itself as the drop target; items come and go during a drag, so the list, not each item, is the target.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `readonly T[]` | — (required) | Items in their current order. |
| `getId` | `(item: T) => string` | — (required) | Stable unique id. Must match `Dnd.SortableItem id`. |
| `getLabel` | `(item: T) => string` | the id | Spoken by the live region. |
| `onReorder` | `(id: string, beforeId: string \| null) => DndReorderResult \| void \| Promise<…>` | — (required) | The item `id` lands in front of `beforeId` (`null` = last). With connected lists `id` may belong to another list: move it into this one. Apply it with `moveBefore`. Return `{ ok: false }` (or reject) to roll the drawn order back at once. |
| `renderItem` | `(item: T, index: number) => ReactNode` | — (required) | Returns a `Dnd.SortableItem`. |
| `axis` | `"x" \| "y"` | `"y"` | Direction of the list: a vertical column or a single horizontal row. Wrapping multi-row grids are not supported (the insertion point is read along one axis). |
| `handle` | `boolean` | `false` | Only `Dnd.Handle` starts a drag. |
| `disabled` | `boolean` | `false` | No drag, no keyboard reorder. |
| `kind` | `string` | unique per list | Drag kind. Lists sharing a `kind` exchange items (connected lists); by default each list is separate. |
| `canDrop` | `(id: string) => boolean` | accept all | Refuses an item by id (typically one from another list); the list gets `data-dnd-reject` and turns `danger` before the release. |
| `as` | `"div" \| "ul" \| "ol"` | `"div"` | Root element; `ul`/`ol` render items as `li`. |
| `className` | `string` | — | Extra class (layout of the list: gap). |
| `aria-label` | `string` | — | Name of the list. |

Sets `data-axis` and, while an item is in flight, `data-dragging`. The default layout is a flex column with `--prime-space-2` gap.

### Dnd.SortableItem
Renders `<li>` inside `ul`/`ol`, `<div>` otherwise. Throws outside `Dnd.Sortable`. No ref forwarding.

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — (required) | The item id (same as `getId`). |
| `disabled` | `boolean` | `false` | This item cannot be dragged or moved. |
| `className` | `string` | — | Extra class: the look of the row (fill, radius, padding). |
| `children` | `ReactNode` | — | Row content. |

+ native `HTMLAttributes<HTMLElement>` except `id`; `onPointerDown` and `onKeyDown` run first, `preventDefault()` there keeps the drag from starting. Sets `data-disabled`, `data-handle`, `data-lifted` (while carried), `data-dnd-item`, `aria-roledescription`, `aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown"` and `tabIndex={0}` (not with `handle`: the grip is the tab stop).

Presses on `button, input, select, textarea, a[href]` and `[data-dnd-ignore]` inside an item are those controls' presses, never a drag; mark other elements with `data-dnd-ignore` to opt them out.

### Dnd.Handle
`forwardRef` to `<button type="button">`. The grip, 28px (`control-xs`), icon from lucide, `text-muted` → `text-secondary` on hover.

| Prop | Type | Default | Description |
|---|---|---|---|
| `aria-label` | `string` | `labels.handle` | Accessible name. |
| `children` | `ReactNode` | grip icon | Custom glyph. |
| `className` | `string` | — | Extra class. |

+ native `<button>` props except `type`. A press on it always starts the drag, even inside a list that ignores buttons; `Alt+↑/↓` on the focused grip reorders its item.

### Dnd.Draggable
Generic: `Dnd.Draggable<TData>`. Renders the `as` element. No ref forwarding.

| Prop | Type | Default | Description |
|---|---|---|---|
| `kind` | `string` | — (required) | What it is; zones accept by kind. |
| `id` | `string` | — (required) | Unique within its kind. |
| `data` | `TData` | — | Payload handed to the zone's `onDrop`. |
| `label` | `string` | the id | Spoken by the live region. |
| `disabled` | `boolean` | `false` | Not draggable. |
| `handle` | `boolean` | `false` | Only a `Dnd.Handle` inside it starts the drag. |
| `as` | `"div" \| "li" \| "span" \| "article" \| "section"` | `"div"` | Element. |
| `onDragStart` | `(item, point, origin) => void` | — | Fired once the press became a drag. |
| `onDragEnd` | `(item, outcome: "drop" \| "release" \| "cancel") => void` | — | Always fired at the end. |
| `className` | `string` | — | Extra class. |

+ native `HTMLAttributes<HTMLElement>` except `id`. Sets `data-dragging` while carried (the source stays in place at reduced opacity) and `data-disabled`. A draggable has no keyboard path of its own; offer a button or menu for the same move (WCAG 2.2 *Dragging Movements*).

### Dnd.DropZone
Generic: `Dnd.DropZone<TData>`. Renders the `as` element. No ref forwarding.

| Prop | Type | Default | Description |
|---|---|---|---|
| `accepts` | `string \| readonly string[] \| (item: DragItem) => boolean` | — (required) | Kinds it takes, or a predicate. |
| `onDrop` | `(item: DragItem<TData>) => void` | — (required) | An accepted item landed. |
| `canDrop` | `(item: DragItem<TData>) => boolean` | accept all | Refuses an item the zone would otherwise take; the zone turns `danger` before the release. |
| `onEnter` | `(item) => void` | — | An accepted item came over. |
| `onLeave` | `() => void` | — | It left (also fires at the end of a drag over the zone). |
| `flashOnDrop` | `boolean` | `false` | Flashes the zone after a drop. |
| `disabled` | `boolean` | `false` | Not a target. |
| `as` | `"div" \| "section" \| "li" \| "ul" \| "ol" \| "span"` | `"div"` | Element. |
| `className` | `string` | — | Extra class: the zone's own look. |

+ native `HTMLAttributes<HTMLElement>` except `onDrop`. State is mirrored by `data-dnd-over`, `data-dnd-reject`, `data-dnd-flash` and `data-disabled`. Where zones overlap, the innermost wins, then the smaller one.

### Hooks and helpers
For custom drags; the parts above are built on them.

| Export | Use |
|---|---|
| `moveBefore(items, id, beforeId, getId)` | Pure: `items` with `id` moved in front of `beforeId` (`null` = last). The body of every `onReorder`. |
| `useSortableList(options)` | The whole sortable engine: `containerProps`, `itemProps(id)`, `order`, `gap`, `gapBefore`, `draggingId`. Draw a `data-dnd-gap` element before the item `gapBefore` names. |
| `useDragSource(options)` | `props(item)` for any element: `data-dnd-item`, `onPointerDown`. `draggingId` is the id in flight. |
| `useDropTarget(options)` | `props` (ref + data attributes) for any element; `resolve` turns a pointer position into what a drop would mean, `canDrop` vetoes it. |
| `useDraggedItem(kind?)` | The item in flight (or `null`), to react to a drag you did not start. |

## Variants

### axis (Dnd.Sortable)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `y` | Column; the gap opens above or below neighbours | Lists, settings, menus | yes |
| `x` | One row of items; the gap opens left or right | Chips, tabs, tag strips | |

### Combinations
- `handle` + `as="ul"`: rows with their own controls and a grip.
- Several `Dnd.Sortable` with one `kind`: a board. Drop an item on an exact position of another column; give each column `canDrop` to limit it. Keyboard `Alt`+arrows move within a list only, so offer a button or menu for moving between lists.
- `Dnd.Draggable` in a `Dnd.Sortable` is not supported: items of a list are `Dnd.SortableItem`; use `Draggable` + `DropZone` for targets without an inner order.

## States
| State | How it shows |
|---|---|
| idle | Items show `cursor: grab`; no hover change. |
| carried | Clone follows the pointer, lifted on `--prime-shadow-modal`, scale 1.02; the sortable source is removed from the layout (`data-lifted`) and a dashed accent gap of the item's size and `border-radius` stands in its place; neighbours glide aside. `Dnd.Draggable` stays in place at 0.4 opacity (`data-dragging`). |
| over a zone | `data-dnd-over`: `accent-soft` fill and a dashed accent outline. |
| over a refusing zone or list | `data-dnd-reject`: `danger-soft` fill, and the clone gets a dashed `danger` outline. |
| dropped | The clone glides to the item's new place, sets down (lift and shadow ease off) and is swapped for the real element; if the item has no place to land (it left the list), the clone dissolves; a zone with `flashOnDrop` flashes `accent-soft` (`data-dnd-flash`). |
| released over nothing | A sortable honours the gap it showed (`outcome: "release"`); a zone drop does not happen. |
| cancelled | `Escape`, or a system-cancelled pointer: the clone flies back to its origin, nothing changes. |
| disabled | `data-disabled`, no cursor change, no `aria-roledescription`. |
| focus | Focus ring on items and the handle in both themes. |

All motion is on the system tokens: the lift is `--prime-motion-duration-fast`, the neighbours' glide and the landing are `--prime-motion-duration-base`, the drop flash is `--prime-motion-duration-slow` twice, all on `--prime-motion-easing-standard` (read through `readDragMotion`, so an app override applies). under `prefers-reduced-motion` the lift, the gap animation, the glide and the flash are off.

## Layout & spacing
- The list gap is `--prime-space-2`; override it with `className` (for example a wider gap).
- The look of a row or a card is the consumer's: give `Dnd.SortableItem` / `Dnd.Draggable` a fill (`--prime-color-field-bg` on a card, `--prime-color-bg-surface` on a sunken column), a radius and padding. The clone is a copy of the element with its classes, so it looks the same in flight. Do not rely on ancestor selectors for the row's look: the clone is portalled to `<body>`.
- The clone is sized to the source and positioned fixed; a scrollable ancestor under the pointer auto-scrolls within 64px of its edge.
- Keep the zone's height stable between states; it only changes fill and outline.

## Accessibility
- Every gesture runs on pointer events (mouse, touch, pen); the HTML5 drag API is not used.
- **Touch**: a drag starts after a 180ms hold and is abandoned if the finger moves more than 10px first, so lists keep ordinary scrolling. `touch-action` stays `manipulation`.
- **Keyboard**: `Alt+↑/↓` (`axis="x"`: `Alt+←/→`) on a focused sortable item or its handle moves it one place; plain arrows keep their meaning. Items are tab stops (with `handle`, the grip is). `Escape` cancels a drag in flight.
- A live region (`role="status"`, `aria-live="polite"`) announces: grabbed, dropped, returned, cancelled, moved to position N of M.
- `aria-roledescription` on every draggable item; the clone is `aria-hidden`.
- A click that ends a drag on the dragged element is swallowed, so a card's own click does not fire after a drop.
- Provide a non-drag way to make the same move for `Dnd.Draggable` (a button, a menu).

`labels` keys (`Dnd.Root`; `{label}`, `{position}`, `{total}` are substituted):

| Key | Default |
|---|---|
| `handle` | `Перетащить` |
| `roleDescription` | `перетаскиваемый элемент` |
| `grabbed` | `{label}: взят` |
| `dropped` | `{label}: перемещён` |
| `returned` | `{label}: возвращён на место` |
| `cancelled` | `{label}: перемещение отменено` |
| `moved` | `{label}: позиция {position} из {total}` |

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sortable-list.tsx](examples/sortable-list.tsx) | Task list in a card, the whole row is the grip, keyboard hint with `Kbd` | Ordered settings, priorities, menus |
| [sortable-handle.tsx](examples/sortable-handle.tsx) | `handle` + `Dnd.Handle`, a `Switch` in every row, async `onReorder` | Rows that carry their own controls |
| [horizontal.tsx](examples/horizontal.tsx) | `axis="x"` single row of `Tag` chips | Filters, keywords, tag strips |
| [board.tsx](examples/board.tsx) | Connected lists: tickets move between columns to an exact position, `canDrop` limits "В работе" | Boards, any "move between lists" screen |
| [drop-zones.tsx](examples/drop-zones.tsx) | `Dnd.Draggable` files onto `Dnd.DropZone` folders, a locked folder refuses, `flashOnDrop` | "Put this there" where the target has no inner order |

```tsx
import { Dnd, moveBefore } from "prime-ui-kit";

export function Example() {
  const [items, setItems] = useState(initial);
  return (
    <Dnd.Root>
      <Dnd.Sortable
        aria-label="Задачи"
        items={items}
        getId={(item) => item.id}
        onReorder={(id, beforeId) =>
          setItems((current) => moveBefore(current, id, beforeId, (item) => item.id))
        }
        renderItem={(item) => <Dnd.SortableItem id={item.id}>{item.title}</Dnd.SortableItem>}
      />
    </Dnd.Root>
  );
}
```

## Mistakes
- No `Dnd.Root` above the screen → nothing drags. Mount it once at the app root.
- A `Dnd.SortableItem` `id` that differs from `getId(item)` → the item never moves.
- Rendering items yourself instead of through `renderItem` → the list cannot draw the drop gap or the optimistic order.
- Using `index` as the id → ids must survive a reorder.
- Styling a row from an ancestor selector (`.list .row`) → the flying clone loses it; style the item's own class.
- Starting a drag from a button inside a row without `handle` → presses on buttons and fields are theirs; use `Dnd.Handle`.
- A drag-only move with no alternative → add a button or menu for the same action.
- Putting a `Dnd.Draggable` inside a `Dnd.Sortable` → use `SortableItem`; to move between lists use `Draggable` + `DropZone`.

## Related
[FileUpload](../file-upload/COMPONENT.md) · [Card](../card/COMPONENT.md) · [Kbd](../kbd/COMPONENT.md) · [ScrollContainer](../scroll-container/COMPONENT.md)
