# List

**Category:** navigation
**Kind:** navigation

> A selectable navigation list of rows: the master half of a list + detail screen (conversations, tickets, mail, records).

## When to use
- The list side of a list + detail screen (`PageContent.Split` → `PageContent.List`): dialogs, tickets, letters, invoices worked through one by one; the open one is `current`.
- A short column of records that each open something — a page (`href`, `asChild` with a router link) or a detail pane (`onClick`).
- A short list the team puts in order (funnel stages, queues, priorities) — `onReorder`, a `value` per item.

## When not to use
- App sections → use [Sidebar](../../layout/sidebar/COMPONENT.md) (wide) and [BottomNav](../../layout/bottom-nav/COMPONENT.md) (phone).
- Panels of one screen → use [Tabs](../tabs/COMPONENT.md).
- Many records compared by columns, sorted, filtered or selected in bulk → use [DataTable](../data-table/COMPONENT.md).
- A static list of facts inside a card (no selection, nothing opens) → use `Card.List` of [Card](../card/COMPONENT.md) `variant="list"`.
- Picking a value from options → use [Select](../select/COMPONENT.md) or [Radio](../radio/COMPONENT.md); a menu of commands → [Dropdown](../dropdown/COMPONENT.md).

## Import
```tsx
import { List } from "prime-ui-kit";
```

## Anatomy
```
List.Root                   <ul aria-label>; size → row tier (ControlSizeProvider); onReorder → Dnd.Sortable <ul>
└─ List.Item                <li> with a full-width <button> | <a href> | asChild element; current, disabled
   │                         value; with onReorder: Dnd.Handle (or a Spinner while saving) before the row element
   ├─ List.ItemIcon         leading Avatar.Root / Icon (aria-hidden); after the text — a trailing glyph
   ├─ List.ItemText         primary line, truncates
   ├─ List.ItemDescription  second line, muted, truncates
   ├─ List.ItemMeta         trailing small text (time, date, amount)
   └─ List.ItemCount        trailing Badge, one tier down
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### List.Root
`ref` → `HTMLUListElement`. `<ul>` of selectable rows: the master half of a list + detail screen; sets the row tier for its items and their parts.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Row tier: height, text, icon and avatar size; counts take one tier down. |
| `onReorder` | `(id: string, beforeId: string \| null) => void \| Promise<void>` | — | Rows reorder by a leading handle (drag, touch hold, Alt + ↑ / ↓): item `value` `id` goes before `beforeId` (`null` = last). Apply with `moveBefore`; a returned promise keeps the row busy, a rejection moves it back. |
| `labels` | `Partial<ListLabels>` | — | Built-in strings, see Labels. |
| `aria-label` | `string` | — | Name of the list for screen readers («Диалоги»), when no visible heading names it. |
| `children` | `ReactNode` | — | `List.Item`s. |
| `…rest` | `HTMLAttributes<HTMLUListElement>` | — | `className` and the other `ul` attributes. |

### List.Item
`ref` → `HTMLElement` (the `<button>`, `<a>` or `asChild` element, not the `<li>`). `<li>` holding a full-width row: a button, a link (`href`) or your router link (`asChild`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Stable id of the row; required in a reorderable list (`onReorder` reports it). |
| `current` | `boolean` | `false` | The open record: the selected fill and `aria-current` — `"true"` on a button, `"page"` on a link. |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | — | Opens the record; not called while `disabled`. |
| `href` | `string` | — | Renders an `<a>` instead of a `<button>`; dropped while `disabled`. |
| `asChild` | `boolean` | `false` | Renders the single child (a router link) as the row; its children are the content. |
| `disabled` | `boolean` | `false` | Muted and out of the Tab order: a disabled button, or `aria-disabled` and no navigation on a link. |
| `children` | `ReactNode` | — | `List.ItemIcon`, `List.ItemText`, `List.ItemDescription`, `List.ItemMeta`, `List.ItemCount`; loose text becomes the text line. |
| `…rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | `className` and native attributes of the row element (`target`, `rel` on a link). |

### List.ItemIcon
`ref` → `HTMLSpanElement`. Leading `aria-hidden` slot: an `Avatar.Root` sized to the tier, or an `Icon`. After the text it is a trailing glyph.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | An `Avatar.Root` or an `Icon`. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other `span` attributes. |

### List.ItemText
`ref` → `HTMLSpanElement`. The primary line: medium weight, one line, truncated with an ellipsis.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `className`, `title` (full text when truncated) and the other `span` attributes. |

### List.ItemDescription
`ref` → `HTMLSpanElement`. The second line (a preview, a status): muted, smaller, truncated.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `className` and the other `span` attributes. |

### List.ItemMeta
`ref` → `HTMLSpanElement`. Small muted text at the end of the row (a time, a date, an amount); on top beside two lines.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `className` and the other `span` attributes. |

### List.ItemCount
`ref` → `HTMLSpanElement` (the Badge). A soft `Badge` one tier below the rows at the end of the row; below the meta beside two lines.

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | Badge hue; a hue for what needs attention (unread). |
| `children` | `ReactNode` | — (required) | The number or a short status. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children" \| "color">` | — | `className` and the other `span` attributes. |

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28 one-line row, 12 text, caption description, 20 avatar | dense side panels | |
| `s` | 32 row, 13 text, caption description, 24 avatar | compact panes | |
| `m` | 36 row, 14 text, body-s description, 32 avatar | default | yes |
| `l` | 40 row, 16 text, 40 avatar | roomy panes, touch-first screens | |
| `xl` | 48 row, 16 text, 48 avatar | hero lists | |

A second line or an avatar makes a row taller than the one-line height; the vertical padding stays the tier's.

### Item kind
| Value | Looks like | Use when | Default |
|---|---|---|---|
| button | the row opens a record in place (`onClick`) | a detail pane on the same screen | yes |
| link (`href`) | the same row as an `<a>` | each record has its own URL | |
| router link (`asChild`) | the same row as your `<Link>` | client routing | |

### List.ItemCount color
`gray` (default) for a plain number; a hue for what needs attention (`blue` for unread). Any palette hue.

## States
| State | Driven by | DOM |
|---|---|---|
| rest | — | transparent row, secondary text |
| hover | pointer (`@media (hover: hover)`) | `fill-subtle` wash, primary text |
| pressed | `:active` | `fill-subtle-active` |
| current | `current` | `aria-current="true"` (button) or `"page"` (link); `fill-muted-hover` fill, primary text |
| focus-visible | keyboard | the focus ring inside the row edge |
| disabled | `disabled` | `disabled` on a button; `aria-disabled="true"`, no `href` on a link, `tabindex="-1"` on an `asChild` element; `data-disabled="true"`; disabled text; in a reorderable list the handle is disabled and the row holds its place |
| reorderable | `onReorder` | `data-reorderable="true"` on the root (a `Dnd.Sortable` `<ul>`); each `<li>` is a sortable item (`data-dnd-item` = `value`) with a leading `Dnd.Handle`; drag by the handle (a touch hold on touch), Alt + ↑ / ↓ from the handle or the row; a lifted row leaves a dashed gap in the row's radius, its neighbours glide, the copy (handle and row, in the row's padding and radius) follows the pointer and sets down in its new place without a jump |
| saving a move | `onReorder` returned a pending promise | the row stays in its new place, `aria-busy="true"`, a `Spinner` stands in for the handle, the row content dims to 0.6 (`--prime-motion-duration-fast` both ways); a rejection glides the row back |

Root attribute: `data-size`. The fill changes on `background-color` with `--prime-motion-duration-xfast` both ways (0 under reduced motion).

## Layout & spacing
- The root fills its container (`width: 100%`); rows are 4px apart, each row a full-width button with the tier radius and field padding.
- Put the list on a surface: a `Card.Root` pane in `PageContent.List`, with a `ScrollContainer` around it when it is long — the list never scrolls by itself.
- Row: leading icon · body (text over description) · trail. Beside two lines the trail stacks — meta on top, count below; beside one line they sit in a row.
- Text and description truncate with an ellipsis; give a long `List.ItemText` a `title` with the full text.
- On a coarse pointer a row is at least the touch target (44px).
- Reorderable (`onReorder`): an `xs` handle box sits before each row, 4px from it; the row keeps its own padding and fill.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves focus between rows; a disabled row is skipped. |
| `Enter` · `Space` | Opens the record; a link row takes Enter only. |
| `Alt + ↑` · `Alt + ↓` | With `onReorder`, moves the row one place up or down (from its handle or the row). |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- `<ul>` named by `aria-label` (or `aria-labelledby` to a visible heading); each row is an `<li>` with a button or link.
- The open record: `aria-current="true"` on a button (a selection inside the screen), `aria-current="page"` on a link (`href`, `asChild`) — the link points at the current URL. A router link may set it itself.
- The row's name is its text, description, meta and count, in that order; the leading icon or avatar is `aria-hidden` — the text names the row.
- Arrow keys do not move between rows: rows are ordinary Tab stops, as in the Sidebar.
- With `onReorder` each row gets a handle named «Переместить {label}» (`labels.reorderItem`, `{label}` is the row's text line) and `aria-keyshortcuts`; the new place is announced politely («Новый лид: позиция 2 из 5»), a row being saved is `aria-busy`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `reorderItem` | `"Переместить {label}"` | `aria-label` of a row's drag handle (`onReorder`); `{label}` is the row's text line. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Support dialogs with a preview, the time and the unread count; a click opens a dialog and makes it the current row — `current`, `onClick`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: row height, text, icon and count follow the tier — `size`. |
| [states.tsx](examples/states.tsx) | The open record, a regular row and an unavailable one — `current`, `disabled`. |
| [with-icon.tsx](examples/with-icon.tsx) | Leading avatars of clients and icons of queues; the slot sizes the avatar to the row tier — `List.ItemIcon`. |
| [overflow.tsx](examples/overflow.tsx) | A long inbox in a pane of a fixed height: the list scrolls in a ScrollContainer and long names and previews truncate. |
| [as-link.tsx](examples/as-link.tsx) | Rows as links to the invoice pages: a plain link, or your router link through the slot — `href`, `asChild`. |
| [reorder.tsx](examples/reorder.tsx) | Funnel stages in the team's order: a stage moves by its handle or Alt+arrows and is saved on the server — `onReorder`, `value`. |

## Mistakes
- Rows hand-drawn from `Button.Root variant="ghost"` with a `soft` current → `List.Item current`.
- An `Avatar.Root size="s"` in `List.ItemIcon` to fit the row → leave `size` out; the slot sizes the avatar to the tier.
- A list as app navigation → Sidebar; as tabs of a screen → Tabs.
- Several rows `current` at once → one open record; bulk selection belongs to DataTable.
- A long list without a scroller → wrap it in `ScrollContainer` inside the pane.
- Up / down buttons on rows or a hand-made `Dnd.Sortable` of rows to order them → `List.Root onReorder` with a `value` on every item.
- `onReorder` that rolls the order back itself on an error → return the promise; a rejection moves the row back.

## Related
- **Built from:** [Badge](../badge/COMPONENT.md) (`List.ItemCount`), [Dnd](../dnd/COMPONENT.md) (`onReorder`: `Dnd.Sortable`, `Dnd.Handle`), [Spinner](../spinner/COMPONENT.md) (a move being saved)
- **See also:** [PageContent](../page-content/COMPONENT.md), [Sidebar](../../layout/sidebar/COMPONENT.md), [Tabs](../tabs/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [Card](../card/COMPONENT.md), [Avatar](../avatar/COMPONENT.md)
