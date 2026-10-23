# Drawer

**Category:** overlays
**Kind:** overlay

> A modal panel that slides in from the side: filters, forms and record details without leaving the page.

## When to use
- Editing settings or a record without leaving the page.
- Filters or navigation on narrow screens (`side="left"`).
- Read-only details of a list row (order, user, event), with its number by the name (`Drawer.Title number`), its context on the line under it (`Drawer.Description`), its status and assignee under that (`Drawer.Badges`) and a ⋯ menu in the header (`Drawer.Actions`).
- Long content (history, logs) that needs a tall scrolling area.

## When not to use
- Confirmations of a destructive action → use [ConfirmDialog](../confirm-dialog/COMPONENT.md); short decisions → [Modal](../modal/COMPONENT.md).
- A short task that ends by itself — pick a date, choose an action — raised from the bottom edge → use [Sheet](../sheet/COMPONENT.md).
- A small panel anchored to a button, without blocking the page → use [Popover](../popover/COMPONENT.md).
- Persistent app navigation → use [Sidebar](../../layout/sidebar/COMPONENT.md).
- Collapsible content inside the page → use [Accordion](../accordion/COMPONENT.md).

## Import
```tsx
import { Drawer } from "prime-ui-kit";
```

## Anatomy
```
Drawer.Root                    state and dismiss policy (no DOM)
├─ Drawer.Trigger              clones its child; opens on click
└─ Drawer.Content              portal + scrim + role="dialog" panel at the side
   ├─ Drawer.Guard             no DOM: holds the drawer (busy / dirty) from inside
   ├─ Drawer.Header            grid: the header row (frame `l`, no line under it): [Icon] [Title + Badges / Description] [Actions] [close Button]
   │  ├─ Drawer.Title          <h2> name + muted `number`; `loading` holds it with a skeleton
   │  ├─ Drawer.Description    <p> text only, a `StatusDot` first allowed, one line with an ellipsis in a record header
   │  ├─ Drawer.Badges         one row of Badges after the title, chip tier s, extra folded into «+N»
   │  ├─ Drawer.Actions        one tab-wide switcher or value picker (a Select), then buttons and a ⋯ Dropdown, at the dialog's tier
   │  └─ Drawer.Icon           optional: tone tile around an Icon, or a picture, 48
   ├─ Drawer.Body              the only scrolling zone (ScrollContainer)
   │  └─ Drawer.Section        <section>: <h3> label, description, Drawer.Actions at the heading's end
   └─ Drawer.Footer            when there is something to do: Cancel + submit, the record's action; drawn only with content
      ├─ Drawer.Actions        the start group: an action apart from the main pair
      ├─ Drawer.Meta           <p>, muted status at the start
      └─ Drawer.Close          clones its child; closes on click
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Drawer.Root
No DOM, no ref. State and dismiss policy.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled visibility; together with `onOpenChange`. |
| `defaultOpen` | `boolean` | `false` | Initial visibility, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called on every open and close: trigger, close button, `Close`, Escape, scrim click, code. A `Guard` holds the dismisses (not code). |
| `closeOnEscape` | `boolean` | `true` | Escape closes the dialog. |
| `closeOnOutsideClick` | `boolean` | `true` | A click on the scrim closes the dialog. A destructive action is confirmed in a ConfirmDialog; unsaved changes are held by `Guard`. |
| `labels` | `Partial<DrawerLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | Trigger and Content. |

### Drawer.Content
`ref` → `HTMLDivElement` (the dialog panel). Portal + scrim + `role="dialog"` panel at the edge, side by side; renders while open and during its exit animation, showing the children it had open (a record cleared with `open` does not empty the panel mid-motion).

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"left" \| "right"` | `"right"` | Edge the panel slides from; rounded only on the edge facing the page. No swipe: the drawer closes by its buttons, Escape and the scrim. A panel from the bottom edge is a Sheet. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Width: 360 · 480 · 640 · 800. Below 640 px of viewport — full width, without corners. |
| `aria-label` | `string` | — | Dialog name when there is no Title. |
| `aria-labelledby` | `string` | — | Overrides the Title id. |
| `aria-describedby` | `string` | — | Overrides the Description id. |
| `overlayClassName` | `string` | — | Class on the scrim. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other attributes of the `role="dialog"` element. |

### Drawer.Header
`ref` → `HTMLElement`. `<header>`, the kit's header row, frame `l`, no line under it: [Icon] [Title + Badges / Description] [Actions] [close button]. One line each, nothing wraps.

| Prop | Type | Default | Description |
|---|---|---|---|
| `showClose` | `boolean` | `true` | Built-in square ghost close button at the dialog's control tier, named by `labels.close`; disabled in place while a `Guard` is `busy`. |
| `children` | `ReactNode` | — | Icon, Title, Description, Badges, Actions in any order; each goes to its place. A `Tabs.List` (with `Tabs.Root` around header and body) turns the header into a tab strip. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `className` and the other attributes of the `<header>`. |

### Drawer.Actions
`ref` → `HTMLDivElement`. Header: a tab-wide switcher or picker (`SegmentedControl`, `Select`), then buttons and the ⋯ menu, at the dialog's tier, at the end of the title line; at the end of a `Drawer.Section` heading. In `Drawer.Footer`: the start group.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `children` and the other attributes of the row. |

### Drawer.Icon
`ref` → `HTMLSpanElement`. Optional mark of the header row, 48 px: an `aria-hidden` tone tile; around the record's picture (an `Avatar.Root` or a `Thumbnail.Root` inside) no tile (`data-media`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"neutral"` | Soft fill and icon color; not used around a picture. |
| `children` | `ReactNode` | — (required) | An `Icon`, or the record's picture: an `Avatar.Root` or a `Thumbnail.Root` (or a `ProgressCircle`), sized by the slot. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other attributes of the tile. |

### Drawer.Title
`ref` → `HTMLHeadingElement`. `<h2>` (16/24) of the header row; its id names the dialog. In a record header (an `Icon`, `Badges` or a `number`) one line with an ellipsis, giving way to the badges; in a question dialog it wraps.

| Prop | Type | Default | Description |
|---|---|---|---|
| `number` | `ReactNode` | — | The record's number («#678», «№ 1042», «INV-2026-0142»): muted after the name, never cut, part of the dialog's name. Never in `Description`. |
| `loading` | `boolean` | `false` | The name loads (a record opened by a link): a `Skeleton` holds the title line and `aria-busy` is set, so the header never moves; the name fades in. |
| `…rest` | `Omit<HTMLAttributes<HTMLHeadingElement>, "id">` | — | `className`, `children` and the other attributes except `id` (the dialog owns it). |

### Drawer.Description
`ref` → `HTMLParagraphElement`. `<p>` (14/20) under the title; its id describes the dialog. In a record header one line with an ellipsis, a `StatusDot` may stand first; in a question dialog it wraps.

| Prop | Type | Default | Description |
|---|---|---|---|
| `loading` | `boolean` | `false` | Its data loads: a `Skeleton` holds the line's place and `aria-busy` is set, so the header never moves; the data fades in. |
| `…rest` | `Omit<HTMLAttributes<HTMLParagraphElement>, "id">` | — | `className`, `children` and the other attributes except `id` (the dialog owns it). |

### Drawer.Badges
`ref` → `HTMLDivElement`. The badges after the title, on its line: one `Badge.Group`, chip tier `s`, one row, the rest folds into «+N». A status or person picker is a `Select` in `Actions`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `loading` | `boolean` | `false` | The record loads: a `Skeleton` holds the line and `aria-busy` is set, so the header never moves; the badges fade in. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (`Badge.Root`s), `className`, `aria-label` (a named row is `role="group"`) and the other attributes of the row. |

### Drawer.Body
`ref` → `HTMLDivElement`. The only scrolling zone (a ScrollContainer), 16 gap between blocks. No line parts it from the header and the footer: while it is scrolled its edge fades under them.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `children` and the other attributes of the zone. |

### Drawer.Section
`ref` → `HTMLElement`. A titled `<section>` of the body: an `<h3>` (title-s, under the `<h2>` title), an optional description, a `Drawer.Actions` at the end of the heading row; the content 16 below, sections 32 apart, in any wrapper. Fields group in a `Fieldset`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — (required) | The heading of the section; it names the `<section>`. |
| `description` | `ReactNode` | — | One line of context under the heading (body-s). |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "title">` | — | `children` (the content and an optional `Drawer.Actions`), `className` and the other attributes of the `<section>`. |

### Drawer.Footer
`ref` → `HTMLElement`. Renders `<footer>` with the actions, primary last, with no line above it, only while it holds something (it enters and closes up in place); at the start one thing — an optional `Drawer.Actions` (an action apart) and `Meta`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `layout` | `"fill" \| "end"` | `"end"` | `fill`: equal-width buttons in one row, wrapping rather than cutting a label; `end`: auto width, at the end. Stacked on phones (viewport below 640 px) and in a dialog narrower than 360 px. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `className`, `children` and the other attributes of the `<footer>`. |

### Drawer.Meta
`ref` → `HTMLParagraphElement`. A `<p>` at the start of the footer: short muted status text («Есть несохранённые изменения»); the buttons keep their width at the end. Not part of the dialog description.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLParagraphElement>` | — | `className`, `children` and the other attributes of the `<p>`. |

### Drawer.Guard
No DOM, no ref. Holds the dialog from anywhere inside Content, where the form state lives; renders only the built-in «discard changes?» confirm. While `busy` or `dirty` the browser also asks before the tab closes or reloads. Closing from code is never held.

| Prop | Type | Default | Description |
|---|---|---|---|
| `busy` | `boolean` | `false` | A request runs: Escape, a press outside, the close button and `Close` do nothing; the close button and the `Close` child stay in place, disabled. |
| `dirty` | `boolean` | `false` | Unsaved changes: any of those dismisses asks «Не сохранять изменения?» (a ConfirmDialog with `labels.discard*`); confirming closes the dialog. |

### Drawer.Trigger · Drawer.Close
No DOM: each clones its child. `Trigger` and `Close` chain its `onClick` (skipped after `preventDefault()`): open; close through `Guard`, `disabled` while it is busy.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactElement` | — (required) | One element, usually a Button. |

## Variants

### side (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `right` | slides from the right, rounded on its left edge | details and forms | yes |
| `left` | slides from the left, rounded on its right edge | filters, mobile navigation | |

### size (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `s` | 360 wide | details, short help | |
| `m` | 480 wide | settings forms | yes |
| `l` | 640 wide | wide forms | |
| `xl` | 800 wide | tables, previews | |

Below 640px of viewport every size is full width and loses its corners.

### layout (Footer)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `end` | auto-width buttons at the end | most drawers | yes |
| `fill` | equal-width buttons in one row | one full-width action («Понятно») | |

### tone (Icon)
`neutral` (default) · `accent` · `success` · `warning` · `danger` · `info` — soft tile fill and icon color, as in Modal. Around the record's picture — an `Avatar.Root` or a `Thumbnail.Root` anywhere inside, also from your own wrapper component (`<ClientAvatar />`) — there is no tile and no tone: `data-media`, and the picture takes the mark's 48 px (avatar `xl`, thumbnail `l`) whatever `size` it was given, so every header with a mark has the same one.

## States
| State | Driven by | DOM |
|---|---|---|
| open / closed | `open` / `defaultOpen` / `onOpenChange` | `data-state` on the scrim and the panel; mounted until the slide-out ends |
| dismiss | `closeOnEscape`, `closeOnOutsideClick` (both default `true`) | Escape and a scrim press ask the Root to close; `false` turns that way off |
| side / size | Content props | `data-side`, `data-size` on the panel |
| open: trapped | while open | focus trapped, page scroll locked, siblings of the portal `inert` (the toast region stays usable); a drawer opened from a Modal or another drawer stacks above it |
| closing | `open` turns false | the panel keeps showing the children it had open while it slides out |
| busy | `Drawer.Guard busy` | Escape, the scrim, the close button and `Drawer.Close` do nothing; the close button and the `Close` child are `disabled` in place |
| dirty | `Drawer.Guard dirty` | a dismiss opens the «Не сохранять изменения?» ConfirmDialog (`labels.discard*`); its confirm closes the drawer |
| leaving the tab | `Drawer.Guard busy` or `dirty` | the browser asks before the tab closes or reloads (`beforeunload`), as with `Page.Guard` |
| title loading | `Drawer.Title loading` | a `Skeleton` holds the title line, `aria-busy` on the `<h2>`; the name fades in under the same element |
| badges loading | `Drawer.Badges loading` | a `Skeleton` of the chip height holds the badges' place, `aria-busy` on the row; the badges fade in |
| description loading | `Drawer.Description loading` | a `Skeleton` holds the line, `aria-busy` on the `<p>`; the data fades in under the same element |
| picture mark | an `Avatar.Root` or a `Thumbnail.Root` inside `Drawer.Icon` | `data-media` on the icon, no tile; the picture's `data-size` is the slot's (`l` / `m`) |
| record header | a `Drawer.Icon`, `Drawer.Badges`, or a `Drawer.Title number` | one line per line: the title (down to its text or 8em, then the badges fold into «+N») and the description ellipsize, the number keeps its width; a cut line carries its whole text in `title`; a header without them is a question: its title and text wrap |
| badges overflow | `Drawer.Badges` wider than the panel | the badges that do not fit wait behind a «+N» badge (`Badge.Group overflow="count"`, `data-overflowed`) whose tooltip lists them; the row never wraps |

Motion: the scrim fades, the panel slides from its side over `slow` and leaves over `base` (`overlayMotion`); under `prefers-reduced-motion` it unmounts at once. The drawer has no touch gestures: it is not dragged or swiped away — it closes by its buttons, Escape and the scrim, with the same slide-out.

## Layout & spacing
- The header has one anatomy, the same in every modal, drawer and sheet and on a Card — the header row of the kit at frame `l` (title 16/24, description 14/20, mark 48), one line each, nothing wraps; no line parts it from the body:
  ```
  (mark)  Александра #678  [Telegram] [VIP] [+1]       [Статус ⌄] [Анна Котова ⌄] [⋯] [×]
          ● Новая · Аренда байка Пхукет · заявка 19 сент, 06:37
  ```
  - `Drawer.Title`: the record's name, then its `number` muted («#678», «№ 1042»); `loading` holds it with a Skeleton while the name loads. The name ellipsizes, the number never does; both are the dialog's name.
  - `Drawer.Description` under the title: the record's context in plain text, one line with an ellipsis in a record header; a `StatusDot` may stand first for the record's state. The whole text stays the dialog's description. A number never goes here.
  - `Drawer.Badges` after the title, on its line, 6 apart: one container for every badge of the record (a status, a channel, a counter — the meaning is the badge's `tone` or `color`), chip tier `s`. The title gives way to its text (or 8em) first, then what does not fit waits behind «+N», whose tooltip lists it. A picker of a status or a person is a `Select` in `Drawer.Actions`, never a badge.
  - The header places the parts whatever the order in code; write them in the order Icon, Title, Badges, Description, Actions anyway.
  - end — `Drawer.Actions`: first one switcher or value picker for the whole open tab (a `SegmentedControl`, a `Datepicker` period, a `Select` of the status or the assignee), then neutral buttons — icon buttons with a Tooltip — and a ⋯ Dropdown for the rest, all at the dialog's control tier (the close button's), centred on the title line; with a footer only the picker and «Ещё» stay in the header, the accent button stands in the footer, a danger action lives in «Ещё» behind a ConfirmDialog. Each child keeps its cell by its place: another control in the same place cross-fades inside the cell, a control rendered only on some tabs rises in and closes up.
  - `Drawer.Icon` is optional, the header row's mark (48): a glyph on the tone tile, or a picture (`Avatar.Root`, `Thumbnail.Root`) with no tile.
  - A question or a form keeps a plain header: its title and description wrap; only an `Drawer.Icon`, `Drawer.Badges` or a `number` make it a record header, whose lines are one line each.
- A drawer has three zones: `Drawer.Header` (title, the × close button), `Drawer.Body` (the content, the only zone that scrolls) and `Drawer.Footer` (the actions). The footer is there only when the drawer has something to do; with nothing in it the kit does not draw it, and it rises in and closes up in place as its actions come and go (a save shown while the form is dirty):
  - read-only details: no footer — the header × closes; the record's main action (solid) alone when it has one. Never a footer «Закрыть»: it repeats the ×;
  - a form: «Отмена» (`Drawer.Close`, soft neutral) and the submit button (solid, last; `type="submit" form={formId}`), `Drawer.Meta` for «Есть несохранённые изменения»;
  - one acknowledgement: `<Drawer.Footer layout="fill">`;
  - an action apart from the main pair («Выйти»; deleting the record goes in the header's «⋯» through a ConfirmDialog): `Drawer.Actions` inside the footer puts it at the start, at the footer's tier; stacked on a phone it comes first and the primary stays last.
- Zone padding `--prime-drawer-padding` (24, frame `l`); no lines between header, body and footer — air parts them, and the scrolled body fades under the header and the footer.
- Full viewport height; only the body scrolls, with its own side padding.
- Safe-area insets (`--prime-safe-area-*`): the fill runs to the screen edges, the content steps in — the first zone's top air and the last zone's bottom air become max(24, the top / bottom inset), the side padding on the screen edge (both sides below 640px) max(`--prime-drawer-padding`, the left / right inset).
- Tabs in the header: a `Tabs.List` inside `Drawer.Header` (with `Tabs.Root` around the header and the body) spans the header's last row. The header becomes the tab strip, edge to edge and flush with the body; the active tab is the body rising into it, the panels sit in the body.
- Fields inside get the surface field fill.
- Titled groups of the body (a record's contacts, its deals, its history): `Drawer.Section label` — an `<h3>` under the drawer's `<h2>` title, an optional `description`, a `Drawer.Actions` at the end of its heading row; content 16 below, sections 32 apart — directly in the body, in a `Tabs.Panel` or in a form, with no spacing wrapper of your own. A tab's blocks: a `Drawer.Section` with a label, or a self-titled block (a `ChartFrame`, a `Card` with its `Card.Title`) directly in the panel — a `Tabs.Panel` in the body stands its blocks 32 apart, the step between sections, by itself. A group of fields is a `Fieldset`; a page section is `Page.Section`.
- With a `Drawer.Meta` the buttons stay one row: when the footer runs short the status goes above them first.
- `Drawer.Actions` stay at the end of the title line and never wrap: on a phone keep them to one picker or icon button and the ⋯ beside the × (the rest goes into the ⋯ menu).
- Opening a record: the header and its tabs come at once, the body as a `Skeleton` in the data's geometry. A record opened from a list row comes with the data the row already has (its title, often its status) at once, and only the rest loads (`Drawer.Description loading`); a record opened by a link knows only its id, so `Drawer.Title loading` and `Drawer.Badges loading` hold the title and the badges too. Read-only data swaps under a `Crossfade`; a form gets no `Crossfade` around it — its fields render once the record is there, so typing and focus are never cross-faded. Never a skeleton of your own in the header.
- Focus on open lands on the panel itself, so a header action (a ⋯ with a Tooltip) is not focused and its tooltip does not pop up; a form that should start typing at once puts `autoFocus` on its first field.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Escape` | Closes the drawer (`closeOnEscape`); focus returns to the trigger. |
| `Tab` · `Shift+Tab` | Cycle focus inside the drawer. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- `role="dialog"`, `aria-modal="true"`, named by `Drawer.Title` (or `aria-label`), described by `Drawer.Description`.
- On open focus moves to the panel itself (its title and description are read; an `autoFocus` field wins), without the ring after a click; Tab goes on to the first control. On close it returns to the opener, including after a scrim click.
- The page behind is `inert`, scroll is locked; only the topmost layer reacts.
- A drawer opened from a Modal stacks above it.
- No swipe: the close button, `Drawer.Close`, Escape and the scrim are the ways out.
- A `Guard` that is `busy` keeps the close button and the `Close` child in place, `disabled`; a `dirty` one opens a `role="alertdialog"` confirm with focus on «Продолжить».

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `close` | `"Закрыть"` | `aria-label` of the header close button. |
| `discardTitle` | `"Не сохранять изменения?"` | Title of the confirm a dismiss opens while a `Guard` is `dirty`. |
| `discardDescription` | `"Изменения в форме пропадут."` | Its description. |
| `discardConfirm` | `"Не сохранять"` | Its confirm button: close and lose the changes. |
| `discardCancel` | `"Продолжить"` | Its cancel button: back to the form. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Order details next to the list: the three zones of every drawer — a header with a close button, a read-only body and a footer with the main action — `Drawer.Trigger`, `Drawer.Body`, `Drawer.Footer`. |
| [structure.tsx](examples/structure.tsx) | Optional parts: an icon tile in the header and one full-width action in the footer — `Drawer.Icon`, `Drawer.Footer`, `layout`. |
| [sizes.tsx](examples/sizes.tsx) | Every panel width, 360 to 800 px; below 640 px of viewport the panel takes the full width — `size`. |
| [placement.tsx](examples/placement.tsx) | The panel slides from the right for details and from the left for filters, rounded only on the edge facing the page — `side`. |
| [header-actions.tsx](examples/header-actions.tsx) | The one header of a record: the name with its number and its plain statuses on one line, a line of data under it, and at the end the status and the assignee as pickers, a button and the ⋯ menu — `Drawer.Title`, `number`, `Drawer.Badges`, `Drawer.Description`, `Drawer.Actions`, `Select.Root`. |
| [footer-actions.tsx](examples/footer-actions.tsx) | A profile panel: Sign out, a neutral button, stands apart at the start of the footer, the main action keeps the end; on a phone the column puts it first and the main action last — `Drawer.Footer`, `Drawer.Actions`. |
| [client-card.tsx](examples/client-card.tsx) | A client card from the list: the contact's avatar heads the panel in place of an icon tile, then the details in titled sections, one with its own action — `Drawer.Icon`, `Avatar.Root`, `Drawer.Section`, `Drawer.Actions`. |
| [record-picture.tsx](examples/record-picture.tsx) | A vehicle's panel headed by its photo: the name and the plate beside the picture, a line of data under them, and the status badges on the name's line, after the plate — `Drawer.Icon`, `Thumbnail.Root`, `Drawer.Badges`. |
| [tab-switcher.tsx](examples/tab-switcher.tsx) | A model card with tabs: one switcher for the whole open tab stands in the header before the record's icon buttons — the text language on the description tab, the period on the analytics tab, whose two self-titled charts the panel spaces by itself — `Drawer.Actions`, `Tabs.Root`, `Tabs.Panel`. |
| [loading.tsx](examples/loading.tsx) | A record card that opens before its data arrives: the title and the status come from the list row, the line of data between them and the body hold their place in skeletons, then the data fades in — `Drawer.Description`, `loading`. |
| [link-loading.tsx](examples/link-loading.tsx) | A record opened by a link knows only its id: the title, the line of data under it and the badges hold their place in skeletons, the body keeps the data's geometry, then the name and the data fade in — `Drawer.Title`, `loading`. |
| [guard.tsx](examples/guard.tsx) | A form that holds the drawer from inside: after an edit Escape, the scrim and Cancel ask before discarding, the footer says so, and saving locks every way out — `Drawer.Guard`, `Drawer.Meta`. |
| [long-content.tsx](examples/long-content.tsx) | A long body scrolls on its own while the header and the footer stay in place — `Drawer.Body`. |
| [dismiss.tsx](examples/dismiss.tsx) | An import closes only from its buttons, and not at all while it runs — `closeOnOutsideClick`, `closeOnEscape`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent owns the state and opens the drawer from a link, without a trigger — `open`, `onOpenChange`. |
| [in-form.tsx](examples/in-form.tsx) | A settings form in the panel: the footer button submits the form and an empty name shakes the field and keeps it open until it is filled — `Drawer.Body`, `Drawer.Footer`, `error`. |
| [screen.tsx](examples/screen.tsx) | A create form in a Drawer opened from the primary action in its top bar: grouped fields, errors on submit with focus on the first invalid field, a loading submit, a toast and the new row in the list — `Drawer.Trigger`, `Drawer.Guard`. |

## Mistakes
- «Закрыть» in `Drawer.Footer` → remove it: the header × closes the drawer; a footer holds only what the drawer does (Cancel + submit, the record's action), or the drawer has none.
- Save or Cancel buttons at the end of the body, or in the header → they go in `Drawer.Footer`, which stays in place while the body scrolls.
- A delete confirmation in a Drawer → use ConfirmDialog.
- A hand-made heading row (`Typography as="h3"` + buttons) over a group in the body → `Drawer.Section label` with `Drawer.Actions`.
- A wrapper with its own gap around `Drawer.Section`s or self-titled blocks inside a `Tabs.Panel`, or around sections in a form → not needed: the panel in the body stands its blocks 32 apart, and sections keep 32 between them in any wrapper.
- A `Drawer.Section` only to space a block that already names itself (a chart, a titled card) → put it directly in the `Tabs.Panel`; the panel spaces it.
- A `Skeleton` placed by hand in `Drawer.Title` or `Drawer.Description` while the record loads → their `loading`; a placeholder title that shifts the header when the name arrives → `Drawer.Title loading`.
- A start-side button («Выйти») put inside `Drawer.Meta` → `Drawer.Actions` inside `Drawer.Footer`; `Meta` is status text only.
- Busy or unsaved state lifted out of the form into Root props → put `Drawer.Guard` next to the form, inside Content.
- Clearing the record together with `open` and rendering a skeleton for «no record» → not needed: the panel keeps its last content while it slides out.
- A status `Badge` in the header's `Drawer.Actions`, or inside `Drawer.Description` → put it in `Drawer.Badges`, after the title (or a `StatusDot` first in the description): the kit sizes it and keeps the row on one line.
- The badges above the text (a three-line header in the wrong order) → `Drawer.Title`, then `Drawer.Description`, then `Drawer.Badges`; the kit places them in that order whatever order they are written in.
- The record number in `Drawer.Description` («Заявка #678 · …») or typed into the title text → `Drawer.Title number="#678"`: muted beside the name, never cut.
- A long name wrapped onto two title lines, or a second description line → in a record header both are one line with an ellipsis; the whole text is in the dialog's name and description.
- The status or the assignee as a `Badge` in a `Dropdown.Trigger` → a `Select` in `Drawer.Actions`, as tall as the buttons beside it.
- The assignee picked from a custom menu of plain rows → a `Select` in `Drawer.Actions` with `Avatar.Root` in the trigger and the items.
- A control that applies to the whole tab (the text language, the period) repeated in section headings or put in one section → one switcher in the header's `Drawer.Actions`, before the buttons, rendered only on the tabs it applies to.
- A menu or a button as a custom child of the header text column → put it in `Drawer.Actions`.
- A Badge with its own `size` in `Drawer.Badges` → leave `size` out: the row gives every header the same chip tier.
- An avatar wrapped in its own box, or given its own `size`, in `Drawer.Icon` → pass the `Avatar.Root` (or your component that renders it) as it is: the slot drops the tile and sets its 48 px box.
- Expecting Enter to submit via `Drawer.Confirm` → Drawer has no Confirm; use a `<form>` with a submit button.
- `side="top"` or `side="bottom"` → only `left` and `right`; a panel from the bottom edge is a [Sheet](../sheet/COMPONENT.md).
- Expecting a swipe to close a drawer → it has none; keep the header × and a footer button. A panel that swipes away is a [Sheet](../sheet/COMPONENT.md).
- Padding on a wrapper inside Body → Body already pads and scrolls.

## Related
- **Built from:** the dialog shared with Modal and Sheet (`internal/overlay/DialogParts`), [Badge](../badge/COMPONENT.md) (`Drawer.Badges`: a one-line `Badge.Group` of chip tier s), [StatusDot](../status-dot/COMPONENT.md) (the state in front of a record's description), [Button](../button/COMPONENT.md) (close button), [ScrollContainer](../scroll-container/COMPONENT.md) (`Drawer.Body`), `internal/mediaSlot` (a record's Avatar or Thumbnail in `Drawer.Icon`), [Skeleton](../skeleton/COMPONENT.md) (`Drawer.Title loading`, `Drawer.Badges loading`, `Drawer.Description loading`), [ConfirmDialog](../confirm-dialog/COMPONENT.md) (the `Drawer.Guard` discard confirm), `Icon` (the close glyph)
- **See also:** [Modal](../modal/COMPONENT.md) (the same header, body, footer and `Guard` in the centre), [Sheet](../sheet/COMPONENT.md) (the same parts raised from the bottom edge for a short task), [ConfirmDialog](../confirm-dialog/COMPONENT.md) (a destructive confirm), [Sidebar](../../layout/sidebar/COMPONENT.md), [Popover](../popover/COMPONENT.md), [Avatar](../avatar/COMPONENT.md) (a person's picture in `Drawer.Icon`)
