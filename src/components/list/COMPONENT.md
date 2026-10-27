# List

**Category:** navigation
**Kind:** navigation

> A list of records or places built of the kit's one list row — the row Sidebar, menus, Select, CommandMenu, Timeline and the file queue stand on: a mark, a title with its number and badges, a description, meta and controls.

## When to use
- The list side of a list + detail screen: tickets, letters, invoices, deals — `current` marks the open record.
- A section of records in a card or a drawer: sessions, members, documents, API keys, each with its own actions.
- Settings rows: a switch at the end, the row toggles it.
- A choice of rows: several with checkboxes (`multiple`), or one with a check at the end.
- An order people change: funnel stages, sections — `onReorder` with grips.

## When not to use
- Conversations with previews, unread counts and typing → [ChatList](../chat-list/COMPONENT.md) (it stands on List).
- Columns of data a person sorts and compares → [DataTable](../data-table/COMPONENT.md).
- Label · value pairs of one record → [DescriptionList](../description-list/COMPONENT.md).
- App navigation → [Sidebar](../../layout/sidebar/COMPONENT.md) (the same row).
- Actions in a floating panel → [Dropdown](../dropdown/COMPONENT.md); a value in a field → [Select](../select/COMPONENT.md) (the same row inside).
- Records of one shape a person types into → [FieldList](../field-list/COMPONENT.md).

## Import
```tsx
import { List } from "prime-ui-kit";
```

## Anatomy
```
List.Root                   <ul>; size → row tier; a value → listbox; onReorder → sortable
├─ List.Group               a heading 28 tall over its rows
└─ List.Item                <li> with the row: a button, a link, a plain box or the asChild element
   ├─ List.ItemIcon         mark: Icon (a tile beside a description) / Avatar.Root / ProgressCircle / Thumbnail.Root / Badge.Dot
   ├─ List.ItemText         title, weight 500; number after it
   ├─ List.ItemBadges       badges on the title's line, «+N»
   ├─ List.ItemDescription  the line under the title; StatusDot first
   ├─ List.ItemMeta         time, date, value at the end
   ├─ List.ItemCount        plain number, or a Badge with color
   └─ List.ItemActions      the row's own controls beside its element
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### List.Root
`ref` → `HTMLUListElement`. A list of records or places built of the kit's one list row, rows 2 apart, no box of its own. With a value it is a choice; with `onReorder` its rows move. The same row stands in Sidebar, menus, Select, Timeline.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Row tier: a row 28 · 32 · 36 · 40 · 48 tall, with a description 44 · 48 · 56 · 60 · 68; text, mark and controls follow. |
| `value` | `string \| string[] \| null` | — | The chosen row's `value` (an array with `multiple`); makes the list a choice (`role="listbox"`). Controlled with `onValueChange`. |
| `defaultValue` | `string \| string[] \| null` | — | The first choice of an uncontrolled choice. |
| `onValueChange` | `(value: string \| string[] \| null) => void` | — | Called with the new choice when a row is chosen or unchecked. |
| `multiple` | `boolean` | `false` | Several rows: a checkbox column, a checked row in the accent's soft tone. Without it one row: a check at the end, its place held on every row. |
| `indicator` | `"start" \| "end"` | `"start"` | Where the checkboxes of a `multiple` choice stand: before the mark or at the row's end. |
| `onReorder` | `(value: string, beforeValue: string \| null) => void \| Promise<void>` | — | Rows move by their grips and Alt+arrows (each row needs a `value`); a returned promise keeps the row busy until it settles, a rejection moves it back. |
| `handle` | `"end" \| "start" \| "row"` | `"end"` | The grip of a reorderable list: at the row's end in the controls' place, at its start, or none — the whole row is dragged. |
| `actions` | `"always" \| "hover"` | `"always"` | When `List.ItemActions` show: always, or on hover and keyboard focus in the row (on touch always). |
| `labels` | `Partial<ListLabels>` | — | Overrides of the grip's and the lock's names (see Labels). |
| `aria-label` | `string` | — | Names the list (or `aria-labelledby` to a visible heading). |
| `children` | `ReactNode` | — | `List.Item` and `List.Group`. |
| `…rest` | `Omit<HTMLAttributes<HTMLUListElement>, "children" \| "defaultValue" \| "onChange">` | — | `className` and the other `ul` attributes. |

### List.Group
`ref` → `HTMLLIElement`. Rows under a heading 28 tall (the caption role, muted, as in Sidebar and menus); the next group starts right after.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | The heading; it names the group of rows. |
| `children` | `ReactNode` | — | The group's `List.Item`s. |
| `…rest` | `Omit<HTMLAttributes<HTMLLIElement>, "children">` | — | `className` and the other `li` attributes. |

### List.Item
`ref` → the row element (`button`, `a`, `div` or the `asChild` element). One row: one line, or two with `List.ItemDescription`; its own controls stand beside the element, never inside.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | The row's id: needed by a choice and by `onReorder`; also the key of the row's enter and leave. |
| `current` | `boolean` | `false` | The open record or page: a fill step, `aria-current` (`"page"` on a link, `"true"` on a button). |
| `onClick` | `MouseEventHandler` | — | Makes the row a button. |
| `href` | `string` | — | Makes the row a link. |
| `target` | `string` | — | Link target, with `href`. |
| `rel` | `string` | — | Link relation, with `href`. |
| `asChild` | `boolean` | `false` | Renders the only child (a router link) as the row, with the parts inside it. |
| `disabled` | `boolean` | `false` | Out of action: title, description, mark and meta in the disabled colour; no click, no Tab stop. |
| `locked` | `boolean` | `false` | With `onReorder`: the row holds its place — a lock in the grip's place; others cannot pass it. |
| `children` | `ReactNode` | — | `List.ItemIcon`, `List.ItemText`, `List.ItemBadges`, `List.ItemDescription`, `List.ItemMeta`, `List.ItemCount`, `List.ItemActions`; loose text becomes the title. |
| `…rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | `className`, `type` and the other attributes of the row element. |

### List.ItemIcon
`ref` → `HTMLSpanElement`. The mark: an `Icon` bare beside one line, on a tile beside a description; an `Avatar.Root`, a `ProgressCircle` or a `Thumbnail.Root` sized under the row; a `Badge.Dot`. After the text, a trailing glyph.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | — | The tile's colour beside a description, when it means something; neutral by default. |
| `children` | `ReactNode` | — (required) | One `Icon`, `Avatar.Root`, `ProgressCircle`, `Thumbnail.Root` or `Badge.Dot`; a mark without its own `size` takes the row's. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### List.ItemText
`ref` → `HTMLSpanElement`. The title: weight 500, one line cut with an ellipsis; beside badges it gives way first, down to its text or 8em.

| Prop | Type | Default | Description |
|---|---|---|---|
| `number` | `ReactNode` | — | The record's number after the title («#4821»): muted, figures in columns, never cut. |
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

### List.ItemBadges
`ref` → `HTMLDivElement`. The record's badges on the title's line, as tall as it, always whole: what does not fit folds into «+N».

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | `Badge.Root`s; the meaning is the badge's `tone` or `color`. |
| `labels` | `Partial<BadgeGroupLabels>` | — | Overrides of the «+N» texts (see Labels). |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other div attributes. |

### List.ItemDescription
`ref` → `HTMLSpanElement`. The line under the title, muted, one line; a `StatusDot` first, the rest after «·». Makes the row two lines.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

### List.ItemMeta
`ref` → `HTMLSpanElement`. A time, a date or a value at the end, figures in columns; beside a description it stands over the count.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

### List.ItemCount
`ref` → `HTMLSpanElement` (the number or the Badge). A count at the end: a plain muted number; a `Badge` as tall as the title's line when `color` or `variant` asks for attention.

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | — | Badge hue: something new needs attention. |
| `variant` | `"solid" \| "soft" \| "outline"` | — | Badge treatment; `soft` once `color` is set. |
| `children` | `ReactNode` | — (required) | The number. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children" \| "color">` | — | `className` and the other span attributes. |

### List.ItemActions
`ref` → `HTMLDivElement`. The row's own controls beside its element: Buttons as tall as the row minus 8 (a tier down beside a description), soft; ghost beside a Switch, which ends the row.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (controls, each with its own name), `className` and the other div attributes. |

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | row 28, with a description 44; text 12/16 | a dense side list, a list in a small panel | |
| `s` | row 32, 48; text 13/20 | the rows of menus and Select (a tier under the page) | |
| `m` | row 36, 56; text 14/20, description 13/20 | the default list of a page, a card or a drawer | host tier, else `m` |
| `l` | row 40, 60; text 16/24 | a roomy list, a lead block | |
| `xl` | row 48, 68 | a list on a wide screen or for touch | |

### multiple
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` | one row chosen: a check at the end, its place held on every row | a role, a plan, one option | `false` |
| `true` | a checkbox column; a checked row in the accent's soft tone | watchers, recipients, rows to act on together | |

### indicator
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `start` | checkboxes before the mark | the usual choice of several | `start` |
| `end` | checkboxes at the row's end | the choice is secondary to the rows' own reading | |

### handle
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `end` | the grip at the row's end, in the controls' place; the text never moves | the usual reorderable list | `end` |
| `start` | the grip before the row's text | a list read as a column of handles (a settings order) | |
| `row` | no grip: the whole row is dragged | rows with nothing else to press | |

### actions
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `always` | the row's controls always shown | the default; touch, keyboard and pointer see them | `always` |
| `hover` | the controls come on hover and focus in the row; on touch always | a dense list where many rows carry the same buttons | |

### Flags
| Flag | Looks like | Use when | Default |
|---|---|---|---|
| `current` (Item) | a fill step, the text in its colour | the open record or page | `false` |
| `disabled` (Item) | title, description, mark and meta in the disabled colour | the row is out of action | `false` |
| `locked` (Item) | a lock in the grip's place | with `onReorder`, the row holds its place | `false` |

## States
| State | Driven by | DOM |
|---|---|---|
| hover | pointer over a row that opens or toggles | a light fill (`fill-subtle`) |
| pressed | pointer down | one step stronger (`fill-subtle-active`), the row does not move |
| current | `current` | a fill step (`fill-muted-hover`), `aria-current` |
| checked | a choice with `multiple` | the accent's soft tone, `aria-selected`, the checkbox |
| chosen | a single choice | the check at the end, `aria-selected`, no fill |
| focus | keyboard | a 2px ring inside the row edge |
| disabled | `disabled` | the disabled colour, no click, `aria-disabled` |
| reordering | `onReorder` | grips (or locks), `aria-busy` on a row being saved |
| entering · leaving | rows the data adds or takes out | they rise in and close up in place |

## Layout & spacing
The list is the kit's one list row (`internal/listRow`) stacked 2 apart; no box of its own.

| | `xs` | `s` | `m` | `l` | `xl` |
|---|---|---|---|---|---|
| row | 28 | 32 | 36 | 40 | 48 |
| with a description | 44 | 48 | 56 | 60 | 68 |
| padding ↕ · ↔ | 6 · 8 | 6 · 8 | 8 · 12 | 8 · 12 | 12 · 16 |
| radius | 6 | 8 | 8 | 10 | 12 |
| mark beside one line | glyph 14 · picture 16 | 16 · 20 | 16 · 24 | 20 · 24 | 20 · 32 |
| mark beside a description | 32 | 32 | 40 | 40 | 40 |
| mark → text | 8 / 8 | 8 / 8 | 8 / 12 | 8 / 12 | 12 / 16 |
| title · description | 12/16 · 12/16 | 13/20 · 12/16 | 14/20 · 13/20 | 16/24 · 14/20 | 16/24 · 14/20 |
| badges | 16 | 16 | 20 | 24 | 24 |
| button · beside a description | 20 · 28 | 24 · 28 | 28 · 32 | 32 · 36 | 40 · 40 |

- A mark never grows the row: a picture beside one line is under the row's line (a ring or a thumbnail has no size under 24, so none on `xs` and `s` without a description); beside a description every mark is as tall as the two lines, a glyph on a neutral tile (`tone` colours it when the colour means something).
- Marks stand on every row of a list (or a group) or on none.
- Everything at the end stands on the row's centre line: meta → count → controls → a switch last. Beside a description a meta and a count stand in one column, the meta over the count.
- Badges stay on the title's line and are never cut: the title gives way first, down to its text or 8em, then the badges fold into «+N». The `number` follows the title and is never cut.
- Buttons in `List.ItemActions` are soft and as tall as the row minus 8 (beside a description a tier down); beside a Switch they are ghost. One or two actions are icon buttons with a Tooltip; from three, one «⋯».
- In a host with padding (`Card.Body`, a page, a drawer) the rows bleed (`--list-bleed: 1`): the text stands on the content edge, the wash runs into the padding. A list that is the host's first or last block bleeds its first and last row the same way along the block axis (a group heading first keeps its place).
- A list in which nothing opens, toggles, chooses or reorders (no `onClick`, `href`, `asChild`, `type`, `Switch` row, choice or `onReorder`) and no row is `current` has no side inset: text and marks stand on the content edge, `List.ItemActions` on the end edge, and the list does not bleed sideways. One row with a fill (an interactive or `current` one) makes every row of the list keep the inset, so a mixed list stays aligned.
- A `StatusDot` in `List.ItemDescription` may come from your own component: the line finds it by its `data-status-dot` when it is the first element, and puts the «·» after it.
- On a narrow column the row's text keeps 96; controls that leave less drop to a line of their own at the row's end.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves between rows and their controls as the row reads; a choice is one stop. |
| `Enter` · `Space` | Opens the record (a link row takes Enter only); in a choice, checks or unchecks the row. |
| `↑` · `↓` · `Home` · `End` | In a choice, moves between the options; they stop at the ends. |
| `Alt + ↑` · `Alt + ↓` | With `onReorder`, moves the row one place (from its grip or the row); a `locked` row does not move, and a step over one is refused aloud. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- `<ul>` named by `aria-label`; each row is an `<li>` with a button, a link or a plain box. With a value the list is a `listbox` (`aria-multiselectable` with `multiple`) of `option`s with `aria-selected`.
- The open record: `aria-current="page"` on a link, `"true"` on a button. A checked row is never told by its tone alone: the checkbox or the check says it.
- The row's name is its title, number, badges, description, meta and count; a mark is `aria-hidden`, a `ProgressCircle` keeps its name.
- `List.ItemActions` stand beside the row element: the row's name stays its text. A row without its own action toggles its Switch on a click anywhere; the Switch keeps the keyboard and its name.
- With `onReorder` each row gets a grip named «Переместить {label}» (`labels.reorderItem`); a `locked` row a lock `role="img"` named «{label}: закреплено». The new place is announced politely.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

#### List.Root

| Key | Default | Used for |
|---|---|---|
| `reorderItem` | `"Переместить {label}"` | `aria-label` of a row's grip (`onReorder`); `{label}` is the row's title. |
| `lockedItem` | `"{label}: закреплено"` | Name of the lock a `locked` row shows in the grip's place; `{label}` is the row's title. |

#### List.ItemBadges

| Key | Default | Used for |
|---|---|---|
| `more` | `"+{count}"` | Visible text of the «+N» badge for the badges that did not fit; `{count}` — how many. |
| `moreCount` | `"Ещё {count}"` | What assistive tech reads for that badge instead of its visible text; `{count}` — how many. The values themselves come in its tooltip. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A support queue: the subject with its number and badge, the state and the client under it, the last update over the new replies; a click opens a ticket and makes it the current row — `current`, `onClick`, `number`, `List.ItemBadges`, `StatusDot`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: a row 28 to 48 tall, with a description 44 to 68; the mark, the text, the count and the controls follow the tier — `size`. |
| [states.tsx](examples/states.tsx) | The open record, a regular row and an unavailable one, whose title, description and mark all fade — `current`, `disabled`. |
| [with-icon.tsx](examples/with-icon.tsx) | Every mark, alone and beside a description: an icon bare and on a tile, an avatar, a progress ring, a thumbnail, a colour dot; a mark without its own size takes the row's and never grows it — `List.ItemIcon`, `List.ItemDescription`, `ProgressCircle`, `Thumbnail.Root`, `Badge.Dot`. |
| [overflow.tsx](examples/overflow.tsx) | A long inbox in a pane of a fixed height: the list scrolls in a ScrollContainer, long subjects and clients are cut at the end and the numbers never are — `List.ItemText`, `number`, `List.ItemDescription`. |
| [as-link.tsx](examples/as-link.tsx) | Rows as links to the invoice pages: a plain link, or your router link through the slot; the amount stands at the end — `href`, `asChild`, `List.ItemMeta`. |
| [groups.tsx](examples/groups.tsx) | Mailboxes in groups under their headings, as in the Sidebar and menus: a count is a plain number, the new ones a coloured badge — `List.Group`, `label`, `List.ItemCount`. |
| [actions.tsx](examples/actions.tsx) | Documents with their buttons: icon buttons with a tooltip, soft, as tall as the row minus 8; the list shows them always or on hover and keyboard focus in the row — `List.ItemActions`, `actions`. |
| [row-controls.tsx](examples/row-controls.tsx) | Funnel stages with a switch at the end: a click anywhere on the row toggles it, the menu beside it is a ghost button so it does not argue with the switch — `List.ItemActions`, `List.ItemCount`, `Badge.Dot`. |
| [reorder.tsx](examples/reorder.tsx) | Funnel stages in one order: the grips are always there — at the end by default, at the start, or the whole row is dragged; the team's stages move and are saved on the server, the system ones hold their places with a lock — `onReorder`, `handle`, `value`, `locked`. |
| [controlled.tsx](examples/controlled.tsx) | A choice held by the screen: several watchers with checkboxes (a checked row in the accent's soft tone), and one role with a check at the end — `value`, `onValueChange`, `multiple`, `indicator`. |
| [narrow.tsx](examples/narrow.tsx) | On a phone column nothing wraps inside a line: the title gives way to its floor and the badges fold into a count, icon controls stay, a labelled button drops under the text — `List.ItemBadges`, `List.ItemActions`. |

## Mistakes
- An `Avatar.Root size="s"` or a sized `ProgressCircle` in `List.ItemIcon` to fit the row → leave `size` out; the mark takes the row's and never grows it.
- Marks on some rows of a list and not on others → a mark on every row or on none.
- A checkbox in `List.ItemActions` to pick rows → `multiple` with `value` on `List.Root`: the checkbox column, the tone and the keyboard come with it.
- A count as a coloured Badge on every row → a plain number; `color` only for what is new and needs attention.
- Badges at the end of the row → `List.ItemBadges` on the title's line; the end belongs to meta and controls.
- A soft Button beside a Switch → ghost; the Switch ends the row.
- A «⋯» menu for one action → one or two icon buttons with a Tooltip; «⋯» from three.
- Separate lists for the system and the team's stages of one order → one list, `locked` on the rows that hold their places.
- A list wrapped in a hand-drawn bordered box → put it in `Card.Body`; the rows bleed into its padding.

## Related
- **Built from:** `internal/listRow` (the one row: tier, mark, text, end, controls, states; it sizes an [Avatar](../avatar/COMPONENT.md), a [ProgressCircle](../progress-circle/COMPONENT.md) or a [Thumbnail](../thumbnail/COMPONENT.md) in the mark), [StatusDot](../status-dot/COMPONENT.md) (the state first in `List.ItemDescription`), [Badge](../badge/COMPONENT.md) (`List.ItemBadges`, `List.ItemCount` with `color`), [Checkbox](../checkbox/COMPONENT.md) (`Checkbox.Indicator` of a `multiple` choice), [Dnd](../dnd/COMPONENT.md) (`onReorder`: `Dnd.Sortable`, `Dnd.Handle`, the lock), [Switch](../switch/COMPONENT.md) (a row that toggles its Switch), `Icon` (the check of a single choice), `internal/headerRow` (the description line and the title floor), `internal/interactiveElement` (button, link, plain box or slot), `internal/listPresence` and `internal/partPresence` (rows and grips that come and go), `internal/rovingFocus` (arrow keys of a choice), `internal/touchTarget`, `internal/fieldClasses`
- **See also:** [ChatList](../chat-list/COMPONENT.md), [Sidebar](../../layout/sidebar/COMPONENT.md), [Dropdown](../dropdown/COMPONENT.md), [Select](../select/COMPONENT.md), [Timeline](../timeline/COMPONENT.md), [Card](../card/COMPONENT.md), [DataTable](../data-table/COMPONENT.md)
