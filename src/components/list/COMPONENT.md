# List

**Category:** navigation
**Kind:** navigation

> A selectable navigation list of rows: the master half of a list + detail screen (tickets, mail, records).

## When to use
- The list side of a list + detail screen (`Page.Split` → `Page.List`): tickets, letters, invoices worked through one by one; the open one is `current`.
- A short column of records that each open something — a page (`href`, `asChild` with a router link) or a detail pane (`onClick`).
- A short list the team puts in order (funnel stages, queues, priorities) — `onReorder`, a `value` per item; rows the system fixes stay in the same list with `locked`.
- Rows with controls of their own beside the row that opens the record (a stage shown on the board, a ⋯ menu) — `List.ItemActions`.

## When not to use
- App sections → use [Sidebar](../../layout/sidebar/COMPONENT.md) (wide) and [BottomNav](../../layout/bottom-nav/COMPONENT.md) (phone).
- Panels of one screen → use [Tabs](../tabs/COMPONENT.md).
- Conversations of a messenger or an inbox (a preview, «печатает…», unread counts) → use [ChatList](../chat-list/COMPONENT.md).
- Many records compared by columns, sorted, filtered or selected in bulk → use [DataTable](../data-table/COMPONENT.md).
- A static list of label — value facts inside a card (no selection, nothing opens) → `DescriptionList align="end"` in a `Card.Body` of [Card](../card/COMPONENT.md).
- Picking a value from options → use [Select](../select/COMPONENT.md) or [Radio](../radio/COMPONENT.md); a menu of commands → [Dropdown](../dropdown/COMPONENT.md).

## Import
```tsx
import { List } from "prime-ui-kit";
```

## Anatomy
```
List.Root                   <ul aria-label>; size (else the host tier) → row tier; onReorder → Dnd.Sortable <ul>
└─ List.Item                <li> with a full-width <button> (onClick) | <a href> | asChild element | static <div>; current, disabled
   │                         value; with onReorder: Dnd.Handle (busy while saving) at the row's end, after its actions
   ├─ List.ItemIcon         leading Avatar.Root / ProgressCircle / Icon (a tile beside two lines) / Badge.Dot; after the text — a trailing glyph
   ├─ List.ItemText         primary line, truncates
   ├─ List.ItemBadges       badges after the title, on its line (a Badge.Group, «+N» on overflow)
   ├─ List.ItemDescription  second line, muted, truncates; a StatusDot first, then «·»
   ├─ List.ItemMeta         trailing small text (time, date, amount)
   ├─ List.ItemCount        trailing Badge, one tier down
   └─ List.ItemActions      the row's own controls (Switch, Dropdown): beside the row element, one tier down;
                             side="end" after it (a switch always ends the row), side="start" before it
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### List.Root
`ref` → `HTMLUListElement`. `<ul>` of selectable rows: the master half of a list + detail screen; sets the row tier for its items and their parts.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Row tier: height, text, icon and avatar size; counts take one tier down. Without it the tier of its host, else `m`. |
| `onReorder` | `(id: string, beforeId: string \| null) => void \| Promise<void>` | — | Rows reorder by an end handle (drag, touch hold, Alt + ↑ / ↓): item `value` `id` goes before `beforeId` (`null` = last). Apply with `moveBefore`; a returned promise keeps the row busy, a rejection moves it back. |
| `labels` | `Partial<ListLabels>` | — | Built-in strings, see Labels. |
| `aria-label` | `string` | — | Name of the list for screen readers («Обращения»), when no visible heading names it. |
| `children` | `ReactNode` | — | `List.Item`s. |
| `…rest` | `HTMLAttributes<HTMLUListElement>` | — | `className` and the other `ul` attributes. |

### List.Item
`ref` → `HTMLElement` (the `<button>`, `<a>`, `<div>` or `asChild` element, not the `<li>`). `<li>` holding a full-width row: a button (`onClick`), a link (`href`), your router link (`asChild`), or — with none of them — a static `<div>` out of the Tab order.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Stable id of the row; required in a reorderable list (`onReorder` reports it). |
| `current` | `boolean` | `false` | The open record: the selected fill and `aria-current` — `"true"` on a button, `"page"` on a link. |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | — | Opens the record; not called while `disabled`. |
| `href` | `string` | — | Renders an `<a>` instead of a `<button>`; dropped while `disabled`. |
| `target` | `string` | — | Where the `<a>` opens (`href` only). |
| `rel` | `string` | — | Relationship of the `<a>` (`href` only). |
| `asChild` | `boolean` | `false` | Renders the single child (a router link) as the row; its children are the content. |
| `disabled` | `boolean` | `false` | Muted and out of the Tab order: a disabled button, or `aria-disabled` and no navigation on a link. |
| `locked` | `boolean` | `false` | With `onReorder`: the row holds its place (a system stage) and shows a lock in the grip's box; no row moves past it. The row and its `List.ItemActions` work as on any row. |
| `children` | `ReactNode` | — | `List.ItemIcon`, `List.ItemText`, `List.ItemBadges`, `List.ItemDescription`, `List.ItemMeta`, `List.ItemCount`, `List.ItemActions` (also inside a fragment); loose text becomes the text line. |
| `…rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | `className` and native attributes of the row element (`target`, `rel` on a link). |

### List.ItemIcon
`ref` → `HTMLSpanElement`. Leading slot, `aria-hidden` but for a `ProgressCircle`: an `Avatar.Root` or a ring (no `size`: they fit the row; beside `List.ItemDescription` its two lines), an `Icon` (there on a tile), a `Badge.Dot`. After the text, a trailing glyph.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | An `Avatar.Root`, a `ProgressCircle` (a record's term), an `Icon`, or a `Badge.Dot` with `color` (a stage, a project): the large dot. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other `span` attributes. |

### List.ItemText
`ref` → `HTMLSpanElement`. The primary line: medium weight, one line, truncated with an ellipsis.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `className`, `title` (full text when truncated) and the other `span` attributes. |

### List.ItemBadges
`ref` → `HTMLDivElement`. A `Badge.Group` after the title, on its line: every badge of the record, the meaning in its `tone` or `color`. The title gives way first; what does not fit folds into «+N».

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | The `Badge.Root`s of the record (a status, a role). |
| `labels` | `Partial<BadgeGroupLabels>` | — | Built-in strings of the «+N» badge, see the `Badge.Group` labels. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other `div` attributes. |

### List.ItemDescription
`ref` → `HTMLSpanElement`. The second line (a preview, a state): muted, smaller, one line cut with an ellipsis. A `StatusDot` first states the record's state, and a «·» is put after it by itself.

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

### List.ItemActions
`ref` → `HTMLDivElement`. The row's own controls (a `Switch`, a `Dropdown` with its icon `Button`) at its end or its start, beside the row element and never inside it, one tier below the row.

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"start" \| "end"` | `"end"` | `"end"` after the row element: a switch or a menu, label first; a switch always ends its row. `"start"` before it, in the DOM too: a control that leads the row (a selection checkbox), never a switch. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the controls, each named on its own), `className` and the other `div` attributes. |

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

### List.ItemActions side
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `end` | the controls after the row's text and trail | a switch or a ⋯ menu: the label first, the control at the end | yes |
| `start` | the controls before the row's icon and text, first in the DOM and the Tab order | a control that leads the row (a selection checkbox) — never a switch | |

## States
| State | Driven by | DOM |
|---|---|---|
| rest | — | transparent row, secondary text |
| hover | pointer (`@media (hover: hover)`) | `fill-subtle` wash, primary text |
| pressed | `:active` | `fill-subtle-active` |
| current | `current` | `aria-current="true"` (button) or `"page"` (link); `fill-muted-hover` fill, primary text |
| focus-visible | keyboard | the focus ring inside the row edge |
| disabled | `disabled` | `disabled` on a button; `aria-disabled="true"`, no `href` on a link, `tabindex="-1"` on an `asChild` element; `data-disabled="true"`; disabled text; in a reorderable list the handle is disabled and the row holds its place |
| reorderable | `onReorder` | `data-reorderable="true"` on the root (a `Dnd.Sortable` `<ul>`); each `<li>` is a sortable item (`data-dnd-item` = `value`) with a `Dnd.Handle` at its end; drag by the handle (a touch hold on touch), Alt + ↑ / ↓ from the handle or the row; a lifted row leaves a dashed gap in the row's radius, its neighbours glide, the copy (handle and row, in the row's padding and radius) follows the pointer and sets down in its new place without a jump |
| locked | `locked` (with `onReorder`) | `data-locked` on the `<li>`; the Dnd lock (`role="img"`, «{label}: закреплено») in the grip's box, so the columns line up with the movable rows; the row does not drag or move by Alt + arrows, and no other row is put where it would shift it — a keyboard step over it is refused aloud; the row element and its `List.ItemActions` work as on any row |
| nothing to reorder | `onReorder` with fewer than two rows that are not `locked`, or none of them enabled (a stage alone in its phase) | the rows keep their `Dnd.Handle` box, empty: no handle, no lock, no `aria-keyshortcuts`, Alt + arrows do nothing; the row keeps its columns, so lists side by side line up. When a second movable row arrives the handles (and locks) rise in their boxes (`partPresence`); when it leaves they fade out in place |
| saving a move | `onReorder` returned a pending promise | the row stays in its new place, `aria-busy="true"`, the handle is busy (Dnd: a spinner in the disabled grip), the row content dims to 0.6 (`--prime-motion-fade-fast` both ways); a rejection glides the row back |
| own controls | `List.ItemActions` in the item | the row element and the controls stand in one frame that takes the hover, press and current fills for both; the element itself stays clear; `side="start"` controls come before the element in the frame, `data-side` on the actions |
| rows come and go | the data adds or takes out a `List.Item` (`value`, else its key) | a new row rises in once (`enterMotion`), a removed one closes up in place (`listPresence`); the first render stays still |

Root attributes: `data-size`, `role="list"` (the list style reset would drop the list semantics in WebKit). The fill changes on `background-color` with `--prime-motion-fade-xfast` both ways (a fade: reduced motion keeps it).

## Layout & spacing
- The root fills its container (`width: 100%`); rows are 4px apart, each row a full-width button with the tier radius and field padding.
- Put the list on a surface: a `Card.Root` pane in `Page.List`, with a `ScrollContainer` around it when it is long — the list never scrolls by itself.
- Row: leading icon · body (text over description) · trail. Beside two lines the trail stacks — meta on top, count below; beside one line they sit in a row.
- `--list-bleed` (public hook, `0` by default): a host such as `Card.Body` sets it to `1`, and the rows reach past the list's edges by their own inline padding (`--field-px`), so their text stands on the host's content edge and the hover wash runs into the host's padding.
- Nothing wraps: the title, the badges line and the description are one line each. The title gives way to `List.ItemBadges` first (down to its text or 8em), then the badges fold into «+N».- Text and description truncate with an ellipsis; give a long `List.ItemText` a `title` with the full text.
- On a coarse pointer a row is at least the touch target (44px).
- Reorderable (`onReorder`): an `xs` handle box ends each row, 4px after the row element and its `List.ItemActions` (inline-end: on the left in RTL); the row keeps its own padding and fill, so every row's handle stands on one line.
- `List.ItemActions`: the controls one tier below the row, 4px apart, as far from the row's side edge as the row's own text (`--field-px`) — at any row height, so one-line and two-line rows stand on one vertical. The end edge, or the start edge with `side="start"`, where the row's own padding then parts the controls from its icon or text. A row with no `onClick`, `href` or `asChild` is a static `<div>` (no Tab stop, no hover wash) with the same parts and controls. Parts may be passed inside a fragment.
- A locked row keeps every column of the movable rows: its `List.ItemActions` on the same side, the lock in the grip's box. System stages and the team's stages are one list, not two.
- A switch always ends its row (label first). Reordering is a mode of the list: while it is on, `onReorder` is passed, the rows render no switch and the grips stand at the end in its place — never a switch and a grip in one row.
- A colour dot in `List.ItemIcon` is the large `Badge.Dot` (8px) centred in an icon-wide box, so the text lines up with the rows that carry icons.
- The mark in `List.ItemIcon` fits the row: an avatar of the tier and a ring of the row's height (24 · 24 · 32 · 40 · 48) in a one-line row; beside `List.ItemDescription` an avatar, a ring and an `Icon` on the kit's icon tile are as tall as the two lines at most (32 · 32 · 40 · 40 · 40 by tier), so the row keeps its height. A mark with its own `size` keeps it.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves focus between rows; a disabled row is skipped. |
| `Enter` · `Space` | Opens the record; a link row takes Enter only. |
| `Alt + ↑` · `Alt + ↓` | With `onReorder`, moves the row one place up or down (from its handle or the row); a `locked` row does not move, and a step over one is refused and announced. Nothing when no row can move. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- `<ul>` named by `aria-label` (or `aria-labelledby` to a visible heading); each row is an `<li>` with a button or link.
- The open record: `aria-current="true"` on a button (a selection inside the screen), `aria-current="page"` on a link (`href`, `asChild`) — the link points at the current URL. A router link may set it itself.
- The row's name is its text, description, meta and count, in that order; the leading icon or avatar is `aria-hidden` — the text names the row. A leading `ProgressCircle` keeps its `progressbar` role and name: it tells the row's state.
- Arrow keys do not move between rows: rows are ordinary Tab stops, as in the Sidebar.
- `List.ItemActions` stand beside the row element, never inside it: the row's name stays its text. Tab follows the row as it reads: the `side="start"` controls, the row, the `side="end"` controls.
- With `onReorder` each row gets a handle named «Переместить {label}» (`labels.reorderItem`, `{label}` is the row's text line) and `aria-keyshortcuts`, last in the row: Tab reaches the row with its `List.ItemActions`, then the handle; the new place is announced politely («Новый лид: позиция 2 из 5»), a row being saved is `aria-busy`. A `locked` row ends with a lock instead: `role="img"` named «{label}: закреплено» (`labels.lockedItem`); a keyboard step over it is refused aloud («Переговоры: «Новая» закреплено, дальше не переместить», Dnd `labels.blocked`). While no row can move, rows carry neither a handle, a lock nor `aria-keyshortcuts`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

#### List.Root

| Key | Default | Used for |
|---|---|---|
| `reorderItem` | `"Переместить {label}"` | `aria-label` of a row's drag handle (`onReorder`); `{label}` is the row's text line. |
| `lockedItem` | `"{label}: закреплено"` | Name of the lock a `locked` row shows in the grip's place; `{label}` is the row's text line. |

#### List.ItemBadges

| Key | Default | Used for |
|---|---|---|
| `more` | `"+{count}"` | Visible text of the «+N» badge for the badges that did not fit; `{count}` — how many. |
| `moreCount` | `"Ещё {count}"` | What assistive tech reads for that badge instead of its visible text; `{count}` — how many. The values themselves come in its tooltip. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A support ticket queue: the subject with its badge, the state and the client under it, the last update and the open count at the end; a click opens a ticket and makes it the current row — `current`, `onClick`, `List.ItemBadges`, `StatusDot`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: row height, text, icon and count follow the tier — `size`. |
| [states.tsx](examples/states.tsx) | The open record, a regular row and an unavailable one — `current`, `disabled`. |
| [with-icon.tsx](examples/with-icon.tsx) | Leading avatars of clients, icons of queues, devices of sessions, rental terms and colour dots of projects; beside two lines an avatar and a ring are as tall as the lines and an icon stands on a tile, a dot in an icon-wide box — `List.ItemIcon`, `List.ItemDescription`, `ProgressCircle`, `Badge.Dot`. |
| [overflow.tsx](examples/overflow.tsx) | A long inbox in a pane of a fixed height: the list scrolls in a ScrollContainer and long names and previews truncate — `List.ItemText`, `List.ItemDescription`. |
| [as-link.tsx](examples/as-link.tsx) | Rows as links to the invoice pages: a plain link, or your router link through the slot — `href`, `asChild`. |
| [reorder.tsx](examples/reorder.tsx) | Funnel stages in one list: the switches end the rows; a reorder mode swaps them for the grips, the team's stages move by the grip or Alt+arrows and are saved on the server, the system ones hold their places with a lock — `onReorder`, `value`, `locked`, `List.ItemActions`. |
| [row-controls.tsx](examples/row-controls.tsx) | Funnel stages with their own controls: a colour dot names the stage's hue, a switch shows it on the board and a menu edits it, all beside the row that opens the stage — `List.ItemActions`, `Badge.Dot`. |

## Mistakes
- Rows hand-drawn from `Button.Root variant="ghost"` with a `soft` current → `List.Item current`.
- An `Avatar.Root size="s"` or a sized `ProgressCircle` in `List.ItemIcon` to fit the row → leave `size` out; a mark without its own `size` fits the row and its lines.
- A list as app navigation → Sidebar; as tabs of a screen → Tabs.
- Several rows `current` at once → one open record; bulk selection belongs to DataTable.
- A long list without a scroller → wrap it in `ScrollContainer` inside the pane.
- Up / down buttons on rows or a hand-made `Dnd.Sortable` of rows to order them → `List.Root onReorder` with a `value` on every item.
- `onReorder` that rolls the order back itself on an error → return the promise; a rejection moves the row back.
- A Switch or a menu button put inside a row, or a row rebuilt as a `div` to hold one → `List.ItemActions` beside the row element.
- System stages in a list of their own above or below the movable ones, or `disabled` to pin them (it dims the row and lets neighbours pass) → one list, `locked` on the system rows.
- A Switch that leads a row, or stands between the label and the grip → the switch ends the row; reordering is a «Изменить порядок» / «Готово» mode in which the switches leave and the grips take their place ([reorder.tsx](examples/reorder.tsx)).
- A hollow `Icon` circle or a hand-drawn dot as a stage colour → `Badge.Dot color` in `List.ItemIcon`.

## Related
- **Built from:** [Badge](../badge/COMPONENT.md) (`List.ItemCount`, `List.ItemBadges`; `Badge.Dot` in `List.ItemIcon`), [StatusDot](../status-dot/COMPONENT.md) (the state first in `List.ItemDescription`), [Avatar](../avatar/COMPONENT.md) and [ProgressCircle](../progress-circle/COMPONENT.md) (`List.ItemIcon` sizes them to the row), [Dnd](../dnd/COMPONENT.md) (`onReorder`: `Dnd.Sortable`, the busy `Dnd.Handle`, the lock of a `locked` row)
- **See also:** [Page](../../layout/page/COMPONENT.md), [Sidebar](../../layout/sidebar/COMPONENT.md), [Tabs](../tabs/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [Card](../card/COMPONENT.md)
