# Modal

**Category:** overlays
**Kind:** overlay

> A dialog over the page for a short form or important text that must be finished or acknowledged before the page goes on.

## When to use
- A short form that must be finished or cancelled before returning to the page.
- Important information that needs an explicit acknowledgement.

## When not to use
- Long forms, filters or record details next to the page → use [Drawer](../drawer/COMPONENT.md).
- A light confirm or form tied to one button, without blocking the page → use [Popover](../popover/COMPONENT.md).
- Searching and running commands → use [CommandMenu](../command-menu/COMPONENT.md).
- Confirming a destructive or weighty action → use [ConfirmDialog](../confirm-dialog/COMPONENT.md): the request, its pending state and its failure are built in.
- Non-blocking status messages → use [Notification](../notification/COMPONENT.md) or [Banner](../banner/COMPONENT.md).

## Import
```tsx
import { Modal } from "prime-ui-kit";
```

## Anatomy
```
Modal.Root                    state and dismiss policy (no DOM)
├── Modal.Trigger             clones its child; opens on click
└── Modal.Content             portal + scrim + role="dialog"
    ├── (grab handle)         as a phone sheet with `closeOnOutsideClick`: aria-hidden bar, a drag starts here
    ├── Modal.Guard           no DOM: holds the dialog (busy / dirty) from inside
    ├── Modal.Header          grid: [Icon] [Title / Description / Badges] [Actions] [close button]
    │   ├── Modal.Title       line 1: <h2> name + muted `number`, names the dialog; `loading` holds it with a skeleton
    │   ├── Modal.Description line 2: <p> text, describes the dialog; one line in a record header
    │   ├── Modal.Badges      line 3: one row of Badges, tier m: status picker, assignee picker, statuses, «+N»
    │   ├── Modal.Actions     one tab-wide switcher, then buttons (icon buttons, a ⋯ Dropdown), tier s, on line 1
    │   └── Modal.Icon        optional: 40 tile with a tone fill, or a picture with no tile, centred on lines 1–2
    ├── Modal.Body            the only scrolling zone
    │   └── Modal.Section     <section>: <h3> label, description, Modal.Actions at the heading's end
    └── Modal.Footer          actions, primary last
        ├── Modal.Actions     the start group: an action apart from the main pair
        ├── Modal.Meta        <p>, muted status at the start
        ├── Modal.Close       clones its child; closes on click
        └── Modal.Confirm     clones its child; Enter clicks it
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Modal.Root
No DOM, no ref. State and dismiss policy.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled visibility; together with `onOpenChange`. |
| `defaultOpen` | `boolean` | `false` | Initial visibility, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called on every open and close: trigger, close button, `Close`, Escape, scrim click, code. A `Guard` holds the dismisses (not code). |
| `closeOnEscape` | `boolean` | `true` | Escape closes the dialog. |
| `closeOnOutsideClick` | `boolean` | `true` | A click on the scrim (and a swipe down, which draws the grab handle) closes the dialog. A destructive action is confirmed in a ConfirmDialog; unsaved changes are held by `Guard`. |
| `labels` | `Partial<ModalLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | Trigger and Content. |
| `confirmOnEnter` | `boolean` | `true` | Enter inside the dialog clicks the element wrapped in `Modal.Confirm`; Enter on a button, link, `textarea`, `select`, checkbox or in the header keeps its own meaning. |
| `onEnterConfirm` | `(event: KeyboardEvent) => void` | — | Replaces the default Enter confirm (the `Modal.Confirm` click). |

### Modal.Content
`ref` → `HTMLDivElement` (the dialog panel). Portal + scrim + `role="dialog"`, side by side; renders while open and during its exit animation, showing the children it had open (a record cleared with `open` does not empty the panel mid-motion). Controls inside get size `m`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Width: 360 · 440 · 560 · 720 · 960. |
| `placement` | `"center" \| "top"` | `"center"` | `center`: in the middle; on a phone a bottom sheet that swipes down (`closeOnOutsideClick`). `top`: near the top edge at every width, growing downward — a search palette above the on-screen keyboard. |
| `container` | `HTMLElement \| null` | `document.body` | Portal target. |
| `aria-label` | `string` | — | Dialog name when there is no Title. |
| `aria-labelledby` | `string` | — | Overrides the Title id. |
| `aria-describedby` | `string` | — | Overrides the Description id. |
| `overlayClassName` | `string` | — | Class on the scrim. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other attributes of the `role="dialog"` element. |

### Modal.Header
`ref` → `HTMLElement`. Renders `<header>`: [Icon] [Title / Description / Badges] [Actions] [close button] — the title on line 1 with the actions and the close button centred on it, the description on line 2, the badges on line 3.

| Prop | Type | Default | Description |
|---|---|---|---|
| `showClose` | `boolean` | `true` | Built-in square ghost `s` close button named by `labels.close`; disabled in place while a `Guard` is `busy`. |
| `children` | `ReactNode` | — | Icon, Title, Description, Badges, Actions in any order; each goes to its place. A `Tabs.List` (with `Tabs.Root` around header and body) turns the header into a tab strip. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `className` and the other attributes of the `<header>`. |

### Modal.Actions
`ref` → `HTMLDivElement`. Header: a tab-wide switcher (`SegmentedControl`, `Datepicker`), then buttons (a status is a badge), tier `s`, on line 1; under the title below 12rem; at the end of a `Modal.Section` heading. In `Modal.Footer`: the start group at the footer tier.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `children` and the other attributes of the row. |

### Modal.Icon
`ref` → `HTMLSpanElement`. Optional mark centred on lines 1–2: an `aria-hidden` 40 px tone tile; around the record's picture (an `Avatar.Root` or a `Thumbnail.Root` anywhere inside, also from your own component) no tile (`data-media`), the picture at 40 px.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"neutral"` | Soft fill and icon color; not used around a picture. |
| `children` | `ReactNode` | — (required) | An `Icon` (sized to the m icon), or the record's picture: an `Avatar.Root` (size `l`) or a `Thumbnail.Root` (size `m`), set by the slot. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other attributes of the tile. |

### Modal.Title
`ref` → `HTMLHeadingElement`. Line 1: `<h2>` (title-m); its id names the dialog. In a record header (with `Badges` or a `number`) the name is one line with an ellipsis (the whole name in its `title` while cut); in a question dialog it wraps.

| Prop | Type | Default | Description |
|---|---|---|---|
| `number` | `ReactNode` | — | The record's number («#678», «№ 1042», «INV-2026-0142»): muted after the name, never cut, part of the dialog's name. Never in `Description`. |
| `loading` | `boolean` | `false` | The name loads (a record opened by a link): a `Skeleton` holds the title line and `aria-busy` is set, so the header never moves; the name fades in. |
| `…rest` | `Omit<HTMLAttributes<HTMLHeadingElement>, "id">` | — | `className`, `children` and the other attributes except `id` (the dialog owns it). |

### Modal.Description
`ref` → `HTMLParagraphElement`. Line 2: `<p>` (body-s, muted), text only, 4 under the title; its id describes the dialog. In a record header one line with an ellipsis (the whole text in its `title` while cut); in a question dialog it wraps under the title.

| Prop | Type | Default | Description |
|---|---|---|---|
| `loading` | `boolean` | `false` | Its data loads: a `Skeleton` holds the line's place and `aria-busy` is set, so the header never moves; the data fades in. |
| `…rest` | `Omit<HTMLAttributes<HTMLParagraphElement>, "id">` | — | `className`, `children` and the other attributes except `id` (the dialog owns it). |

### Modal.Badges
`ref` → `HTMLDivElement`. Line 3 of a record header: a `Badge.Group` — the pickers first (status; assignee with `Badge.Avatar`, or an `outline` «Назначить»; each a `Badge.Root` in a `Dropdown.Trigger`), then the statuses. Chip tier `m`; one row, the rest behind «+N».

| Prop | Type | Default | Description |
|---|---|---|---|
| `loading` | `boolean` | `false` | The record loads: a `Skeleton` holds the line and `aria-busy` is set, so the header never moves; the badges fade in. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (`Badge.Root`s, the pickers in their `Dropdown.Root`), `className`, `aria-label` (a named row is `role="group"`) and the other attributes of the row. |

### Modal.Body
`ref` → `HTMLDivElement`. The only scrolling zone (a ScrollContainer), 16 gap between blocks.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `children` and the other attributes of the zone. |

### Modal.Section
`ref` → `HTMLElement`. A titled `<section>` of the body: an `<h3>` (title-s, under the `<h2>` title), an optional description, a `Modal.Actions` at the end of the heading row; the content 16 below, sections 32 apart, in any wrapper. Fields group in a `Fieldset`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — (required) | The heading of the section; it names the `<section>`. |
| `description` | `ReactNode` | — | One line of context under the heading (body-s). |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "title">` | — | `children` (the content and an optional `Modal.Actions`), `className` and the other attributes of the `<section>`. |

### Modal.Footer
`ref` → `HTMLElement`. Renders `<footer>` with the actions, primary last; at the start an optional `Modal.Actions` (an action apart from the main pair) and `Meta`. Stacked, the start comes first and the primary stays last.

| Prop | Type | Default | Description |
|---|---|---|---|
| `layout` | `"fill" \| "end"` | `"fill"` for `xs` `s` `m`, `"end"` for `l` `xl` | `fill`: equal-width buttons in one row, wrapping rather than cutting a label; `end`: auto width, at the end. Stacked on phones (viewport below 640 px) and in a dialog narrower than 360 px. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `className`, `children` and the other attributes of the `<footer>`. |

### Modal.Meta
`ref` → `HTMLParagraphElement`. A `<p>` at the start of the footer: short muted status text («Есть несохранённые изменения»); the buttons keep their width at the end. Not part of the dialog description.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLParagraphElement>` | — | `className`, `children` and the other attributes of the `<p>`. |

### Modal.Guard
No DOM, no ref. Holds the dialog from anywhere inside Content, where the form state lives; renders only the built-in «discard changes?» confirm. While `busy` or `dirty` the browser also asks before the tab closes or reloads. Closing from code is never held.

| Prop | Type | Default | Description |
|---|---|---|---|
| `busy` | `boolean` | `false` | A request runs: Escape, a press outside, a swipe, the close button and `Close` do nothing; the close button and the `Close` child stay in place, disabled. The grab handle stays and takes no drag. |
| `dirty` | `boolean` | `false` | Unsaved changes: any of those dismisses (a swipe glides back first) asks «Не сохранять изменения?» (a ConfirmDialog with `labels.discard*`); confirming closes the dialog. |

### Modal.Trigger · Modal.Close · Modal.Confirm
No DOM: each clones its child. `Trigger` and `Close` chain its `onClick` (skipped after `preventDefault()`): open; close through `Guard`, `disabled` while it is busy. `Confirm` adds no handler: it marks the Enter target.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactElement` | — (required) | One element, usually a Button. |

## Variants
The dialog has one look: the floating layer of the ladder (`data-depth="floating"`: white in light, a step above a card in dark), `--prime-modal-radius` (16), `shadow-modal`, on a `bg-scrim`. Header, body and footer are separated by faint inset hairlines.

### size (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 360 wide, equal-width footer buttons | One or two fields (rename, a code) | |
| `s` | 440 wide, equal-width footer buttons | Confirmations | |
| `m` | 560 wide, equal-width footer buttons | Short forms | yes |
| `l` | 720 wide, footer buttons right-aligned | Two-column forms | |
| `xl` | 960 wide, footer buttons right-aligned | Tables, previews | |

Below 640px of viewport a centred dialog of every size becomes a full-width bottom sheet (`data-sheet`) with a grab handle while it swipes.

### placement (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `center` | In the middle of the viewport; a bottom sheet on a phone | Every dialog | yes |
| `top` | Near the top edge at every width, growing downward; no swipe | A search palette whose field must stay put and above the on-screen keyboard ([CommandMenu](../command-menu/COMPONENT.md)) | |

### layout (Footer)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fill` | Equal-width buttons in one row, gap 12; never narrower than their labels — when they do not fit, the last ones wrap to a row of their own | Narrow dialogs with two actions | for `xs`, `s`, `m` |
| `end` | Auto-width buttons at the end, gap 8 | Wide dialogs | for `l`, `xl` |

With a `Modal.Meta` the footer is a row in any layout: the status takes the free room at the start, the buttons keep their width at the end and stay one row — when the footer runs short the status goes above them first. On phones (viewport below 640px, where the dialog is a bottom sheet) and in a dialog narrower than 360px, actions stack full width in DOM order (primary last), the status above them.

### tone (Icon)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | `fill-muted` tile, secondary icon | Settings, generic dialogs | yes |
| `accent` | `accent-soft` tile, accent icon | Product features, invitations | |
| `success` | `success-soft` tile, success icon | Done / completed | |
| `warning` | `warning-soft` tile, warning icon | Risky but reversible | |
| `danger` | `danger-soft` tile, danger icon | A warning about a risky step | |
| `info` | `info-soft` tile, info icon | Informational notices | |

Around the record's picture — an `Avatar.Root` or a `Thumbnail.Root` anywhere inside, also from your own wrapper component — there is no tile and no tone: `data-media`, and the picture takes the tile's 40 px (avatar `l`, thumbnail `m`) whatever `size` it was given.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `showClose` | Close button at the end of the header | Default | `true` |
| `showClose={false}` | No close button | The footer has an explicit cancel and Escape is enough | |
| Header + Footer, no Body | Hairline between them | An acknowledgement | |
| Header only | Header with full bottom padding | Short notices | |

**Combinations** — destructive confirm: use [ConfirmDialog](../confirm-dialog/COMPONENT.md). An edit form: `Modal.Guard busy={saving} dirty={changed}`, `Modal.Meta` «Есть несохранённые изменения» while changed, the submit Button `loading` while saving.

**Hierarchy** — one primary action, last in the footer and wrapped in `Modal.Confirm`; the secondary is `outline` neutral. A form is the exception: its primary is the `type="submit" form={formId}` button, outside `Modal.Confirm` — Enter in a field submits the form natively.

## States
| State | Driven by | DOM |
|---|---|---|
| open / closed | `open` / `defaultOpen` / `onOpenChange` | `data-state="open" \| "closed"` on the scrim and the dialog (closed while the exit animation plays) |
| dismiss | `closeOnEscape`, `closeOnOutsideClick` (both default `true`) | Escape, and a scrim press or the phone sheet's swipe, ask the Root to close; `false` turns that way off (no handle, no swipe) |
| Enter confirms | `confirmOnEnter` (default `true`), `onEnterConfirm` | Enter in a field clicks the `Modal.Confirm` child, or calls `onEnterConfirm` instead; a focused button or link keeps its own Enter |
| size | `size` on Content | `data-size` on the dialog |
| header with lines under the title | a `Modal.Badges` or a `Modal.Description` inside | `data-multiline="true"` on the header: the parts hang from the top, the actions and the close button centred on line 1 |
| footer layout | `layout` or the size default | `data-layout` on the footer |
| icon tone | `tone` on Icon | `data-tone` on the tile |
| while open | — | focus trapped inside, page scroll locked, siblings of the portal `inert` (the toast region stays usable) |
| closing | `open` turns false | the dialog keeps showing the children it had open while the exit motion plays |
| busy | `Modal.Guard busy` | Escape, the scrim, a swipe, the close button and `Modal.Close` do nothing; the close button and the `Close` child are `disabled` in place |
| dirty | `Modal.Guard dirty` | a dismiss opens the «Не сохранять изменения?» ConfirmDialog (`labels.discard*`); its confirm closes the dialog; a swipe past the threshold glides back and asks the same |
| leaving the tab | `Modal.Guard busy` or `dirty` | the browser asks before the tab closes or reloads (`beforeunload`), as with `Page.Guard` |
| title loading | `Modal.Title loading` | a `Skeleton` holds the title line, `aria-busy` on the `<h2>`; the name fades in under the same element |
| description loading | `Modal.Description loading` | a `Skeleton` holds the line, `aria-busy` on the `<p>`; the data fades in under the same element |
| actions below | the title would get less than 12rem beside `Modal.Actions` | `data-actions-below` on the header: the actions move under the title and the description |
| picture mark | an `Avatar.Root` or a `Thumbnail.Root` inside `Modal.Icon` | `data-media` on the icon, no tile; the picture's `data-size` is the slot's (`l` / `m`) |
| record header | `Modal.Badges`, or a `Modal.Title number` | one line per line: the name and the description ellipsize, the number keeps its width; a cut line carries its whole text in `title` |
| badges overflow | `Modal.Badges` wider than the dialog | the badges that do not fit wait behind a «+N» badge (`Badge.Group overflow="count"`) whose tooltip lists them; the row never wraps |
| badges loading | `Modal.Badges loading` | a `Skeleton` of the chip height holds line 2, `aria-busy` on the row; the badges fade in |
| sheet | a centred dialog on a phone viewport | `data-sheet` on the dialog: the bottom-sheet surface, the grab handle while it swipes |
| swiping | as a phone sheet, a drag down from the handle or the header (with `closeOnOutsideClick`; without it there is no handle and no swipe) | `data-swiping` and `--swipe-offset` on the dialog while the pointer drags it; past 30% of its height or on a flick it closes, otherwise it glides back; a busy `Modal.Guard` sets `data-swipe-disabled` and the handle takes no drag |
| placement | `placement` on Content | `data-placement` on the dialog |

Loading or disabled actions use the Button props (`loading`, `disabled`) inside the footer.

Motion (`overlayMotion`): the scrim fades in and out over `base`; the dialog fades and scales from 0.98 over `base` and leaves over `fast`; as a bottom sheet it slides up over `slow` and down over `base`. Content stays mounted until the exit ends; under `prefers-reduced-motion` it unmounts at once.

## Layout & spacing
- The header has one anatomy, the same in every modal, drawer and sheet — three lines in the text column, the actions and the close button centred on the first:
  ```
  Александра #678                              [icon buttons] [⋯] [×]
  Аренда байка Пхукет · заявка 19 сент, 06:37
  [Новая ⌄] [(АК) Анна Котова ⌄] [Telegram] [Ждёт человека] [+1]
  ```
  - line 1 — `Modal.Title`: the record's name, then its `number` muted («#678», «№ 1042»); `loading` holds it with a Skeleton while the name loads. The name ellipsizes, the number never does; both are the dialog's name.
  - line 2 — `Modal.Description`, 4 under the title: the record's context in plain text, one line with an ellipsis in a record header; the whole text stays the dialog's description. A status or a number never goes here.
  - line 3 — `Modal.Badges`, 8 under the line above, right over the body: the record's working controls — first the pickers — the status (a `Badge.Root` inside a `Dropdown.Trigger`), the assignee (`Badge.Avatar` + the name, or an `outline` «Назначить») — then the plain statuses. The kit sizes them (chip tier `m`) and keeps one row: what does not fit waits behind «+N».
  - The header places the lines in this order whatever the order in code; write them in it anyway (Title, Description, Badges).
  - end — `Modal.Actions`: first one switcher for the whole open tab (a `SegmentedControl`, a `Datepicker` period), then the buttons — ghost icon buttons with a Tooltip and a ⋯ Dropdown — at the close button's tier, centred on line 1; a status never goes here. Each child keeps its cell by its place: another control in the same place cross-fades inside the cell, a control rendered only on some tabs rises in and closes up.
  - `Modal.Icon` is optional, before the text and centred on lines 1–2: a glyph on the tone tile, or a picture (`Avatar.Root`, `Thumbnail.Root`) with no tile; both are 40 px.
  - A question or a form keeps a plain header: its title and description wrap; only `Modal.Badges` or a `number` make it a record header.
- An action apart from the main pair («Удалить» of a record, «Выйти»): `Modal.Actions` inside `Modal.Footer` puts it at the start, at the footer's tier; stacked on a phone it comes first and the primary stays last.
- Dialog padding `--prime-modal-padding` (24) on every zone; header 24 top / 20 bottom, body 20 with a 16 gap between blocks, footer 20 top / 24 bottom.
- Max height = viewport minus `--prime-modal-viewport-padding` on both sides; only the body scrolls.
- Tabs in the header: a `Tabs.List` inside `Modal.Header` (with `Tabs.Root` around the header and the body) spans the header's last row. The header becomes the tab strip, edge to edge and without the hairline; the active tab is the body rising into it, the panels sit in the body.
- Fields inside take the floating layer's fill; a card inside is the next layer (`floating-1`), a flat tile. Group fields with a 20 gap.
- Titled groups of a long body: `Modal.Section label` — an `<h3>` under the dialog's `<h2>` title, an optional `description`, a `Modal.Actions` at the end of its heading row; content 16 below, sections 32 apart — directly in the body, in a `Tabs.Panel` or in a form, with no spacing wrapper of your own. A group of fields is a `Fieldset`.
- Narrow viewport (< 640px), `placement="center"`: the shared bottom-sheet surface (`src/internal/sheet.module.css`) — full width, rounded top, a grab handle strip on top while it swipes, up to the sheet top gap high, the bottom safe-area inset below the content.
- `placement="top"`: the dialog hangs from a line 12% of the viewport down (between `--prime-modal-viewport-padding` and `--prime-space-24`) and grows downward.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Escape` | Closes the dialog (`closeOnEscape`); focus returns to the opener. |
| `Enter` | Clicks `Modal.Confirm` from a text field or the dialog itself. Enter on a button, link or `role="button"` (Cancel included) activates that element instead; a `<textarea>`, a `<select>`, an `<input>` of type checkbox / radio / file / button / submit / reset, a contenteditable element and the header keep their own Enter. |
| `Tab` · `Shift+Tab` | Cycles focus inside the dialog. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- `role="dialog"`, `aria-modal="true"`, named by `Modal.Title` (or `aria-label`), described by `Modal.Description`.
- Focus moves into the dialog on open (an `autoFocus` field wins) and returns to the opener on close — also after a scrim click (foundation §8).
- The page behind is `inert` and its scroll is locked.
- Only the topmost layer reacts: a Select open inside the dialog closes first.
- As a phone sheet a swipe down is an extra way out; the close button and Escape stay. With `closeOnOutsideClick={false}` there is no swipe and no grab handle; the handle is `aria-hidden`.
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
| [overview.tsx](examples/overview.tsx) | A trigger opens a dialog with a title, a field and two actions; Enter presses the confirm — `Modal.Trigger`, `Modal.Confirm`. |
| [structure.tsx](examples/structure.tsx) | Optional parts: an icon tile with a header-only notice, and a record header — the status on its own line under the name and the text — with a footer and no body between them — `Modal.Icon`, `Modal.Badges`, `Modal.Footer`. |
| [sizes.tsx](examples/sizes.tsx) | Every width; xs, s and m fill the footer with equal buttons, l and xl align them to the end — `size`. |
| [long-content.tsx](examples/long-content.tsx) | A long body in titled sections scrolls on its own while the header and the footer stay in place; the primary closes the dialog and is the Enter target — `Modal.Body`, `Modal.Section`, `Modal.Confirm`. |
| [custom-container.tsx](examples/custom-container.tsx) | The dialog portals into a given node instead of the document body — `container`. |
| [guard.tsx](examples/guard.tsx) | An edit form that holds the dialog: changes make any dismiss ask first and show a note in the footer, the submit button saves the form, and while saving nothing closes it — `Modal.Guard`, `Modal.Meta`. |
| [enter-key.tsx](examples/enter-key.tsx) | Enter in a dialog: handing a workspace over takes a click, never Enter in its field; in the tags dialog Enter adds the typed tag instead of closing — `confirmOnEnter`, `onEnterConfirm`. |
| [dismiss.tsx](examples/dismiss.tsx) | A step the person has to finish: the payment details dialog closes only from its buttons, and not at all while they are saved — `closeOnOutsideClick`, `closeOnEscape`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent owns the open state and opens the dialog from code, without a trigger — `open`, `onOpenChange`. |
| [in-form.tsx](examples/in-form.tsx) | A settings form in a dialog: the footer submit button submits the form, Enter in a field does the same, and an empty name shakes the field and keeps it open until it is filled — `Modal.Body`, `Modal.Footer`, `error`. |

## Mistakes
- A destructive confirm built as a Modal → use ConfirmDialog. A destructive step that needs input (type the name to delete) stays a Modal with `closeOnOutsideClick={false}`.
- Primary action not in `Modal.Confirm` → Enter does nothing; wrap it. In a form, the `type="submit"` button is the primary and stays outside `Modal.Confirm`: Enter in a field submits the form.
- Primary action first in the footer → put it last (DOM order is the visual order).
- «Удалить» as a third footer button of an edit dialog → the footer is the dialog's answer (Cancel + the primary); deleting the record goes to the last `tone="danger"` item of a ⋯ `Dropdown` in `Modal.Actions`, confirmed by a ConfirmDialog.
- A wrapper with its own gap around `Modal.Section`s inside a `Tabs.Panel` or a form → not needed: sections keep 32 between them in any wrapper.
- A hand-made heading row (`Typography as="h3"` + buttons) over a group in the body → `Modal.Section label` with `Modal.Actions`.
- Busy or unsaved state lifted out of the form into Root props → put `Modal.Guard` next to the form, inside Content.
- `key` or a conditional around `Modal.Root` to reset a form → the dialog unmounts at once, without its exit; keep the Root mounted and drive `open`.
- A status `Badge` in the header's `Modal.Actions`, or inside `Modal.Description` → put it in `Modal.Badges`, line 3: the kit sizes it and keeps the row on one line.
- The badges above the text, or the record number in `Modal.Description` → `Modal.Title number`, then `Modal.Description`, then `Modal.Badges`, in that order on screen whatever the order in code.
- A long name wrapped onto two title lines in a record header → it is one line with an ellipsis; the whole name stays the dialog's name.
- A control that applies to the whole tab (the text language, the period) repeated in section headings or put in one section → one switcher in the header's `Modal.Actions`, before the buttons, rendered only on the tabs it applies to.
- A Badge with its own `size` in `Modal.Badges` → leave `size` out: the row gives every header the same chip tier.
- A `Skeleton` placed by hand in `Modal.Title` or `Modal.Description` → their `loading`.
- A start-side button («Выйти», «Удалить») put inside `Modal.Meta` → `Modal.Actions` inside `Modal.Footer`; `Meta` is status text only.
- Scrolling wrapper inside Modal.Body → Body already scrolls.
- Long multi-section forms in a modal → use Drawer.

## Related
- **Built from:** the dialog shared with Drawer and Sheet (`internal/overlay/DialogParts`, `internal/overlay/ModalDialog`), [Badge](../badge/COMPONENT.md) (`Modal.Badges`: a one-line `Badge.Group` of tier m), [Button](../button/COMPONENT.md) (header close button), [ScrollContainer](../scroll-container/COMPONENT.md) (`Modal.Body`), `internal/mediaSlot` (a record's Avatar or Thumbnail in `Modal.Icon`), [Skeleton](../skeleton/COMPONENT.md) (`Modal.Description loading`), [ConfirmDialog](../confirm-dialog/COMPONENT.md) (the `Modal.Guard` discard confirm), `Icon` (the close glyph)
- **See also:** [ConfirmDialog](../confirm-dialog/COMPONENT.md) (a destructive confirm built on Modal `s`), [Drawer](../drawer/COMPONENT.md) (the same header, body, footer and `Guard` at the edge), [Popover](../popover/COMPONENT.md), [CommandMenu](../command-menu/COMPONENT.md)
