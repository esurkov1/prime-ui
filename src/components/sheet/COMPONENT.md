# Sheet

**Category:** overlays
**Kind:** overlay

> A panel raised from the bottom edge for a short task that ends by itself: pick a date, choose an action, leave a few words.

## When to use
- A pick that closes the sheet: a date, a status, a delivery slot (`Datepicker.Panel` straight in the body).
- A short list of actions on one record («Повторить заказ», «Скачать счёт») — each closes the sheet.
- A short note or a question the person answers in place, on a phone first: one or two fields with an explicit submit (`Sheet.Footer`).

## When not to use
- Record details, forms, filters that stay open while the person works → use [Drawer](../drawer/COMPONENT.md) (a side panel).
- A decision or a short form in the centre of the screen → use [Modal](../modal/COMPONENT.md) (it becomes a bottom sheet on phones by itself).
- A destructive confirm → use [ConfirmDialog](../confirm-dialog/COMPONENT.md).
- Actions anchored to a button on a desktop → use [Dropdown](../dropdown/COMPONENT.md) (it becomes a sheet on phones by itself).

## Import
```tsx
import { Sheet } from "prime-ui-kit";
```

## Anatomy
```
Sheet.Root                     state and dismiss policy (no DOM)
├─ Sheet.Trigger               clones its child; opens on click
└─ Sheet.Content               portal + scrim + role="dialog" panel at the bottom edge
   ├─ (grab handle)            aria-hidden bar on top while the sheet swipes (`closeOnOutsideClick`); a drag starts here
   ├─ Sheet.Guard              no DOM: holds the sheet (busy / dirty) from inside
   ├─ Sheet.Header             optional: [Icon] [Title / Description / Badges] [Actions] [close Button]
   │  ├─ Sheet.Title           line 1: <h2> name + muted `number`; `loading` holds it with a skeleton
   │  ├─ Sheet.Description     line 2: <p> text only, one line in a record header
   │  ├─ Sheet.Badges          line 3: one row of Badges, tier m: status picker, assignee picker, statuses, «+N»
   │  ├─ Sheet.Actions         one tab-wide switcher, then buttons (icon buttons, a ⋯ Dropdown), tier s, on line 1
   │  └─ Sheet.Icon            optional: tone tile around an Icon, or a picture, 40, centred on lines 1–2
   ├─ Sheet.Body               the content; the only scrolling zone (ScrollContainer)
   └─ Sheet.Footer             optional: only for a form with an explicit submit
      ├─ Sheet.Actions         the start group: an action apart from the main pair
      ├─ Sheet.Meta            <p>, muted status at the start
      └─ Sheet.Close           clones its child; closes on click
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Sheet.Root
No DOM, no ref. State and dismiss policy.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled visibility; together with `onOpenChange`. |
| `defaultOpen` | `boolean` | `false` | Initial visibility, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called on every open and close: trigger, close button, `Close`, Escape, scrim click, code. A `Guard` holds the dismisses (not code). |
| `closeOnEscape` | `boolean` | `true` | Escape closes the dialog. |
| `closeOnOutsideClick` | `boolean` | `true` | A click on the scrim (and a swipe down, which draws the grab handle) closes the dialog. A destructive action is confirmed in a ConfirmDialog; unsaved changes are held by `Guard`. |
| `labels` | `Partial<SheetLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | Trigger and Content. |

### Sheet.Content
`ref` → `HTMLDivElement` (the dialog panel). Portal + scrim + `role="dialog"` panel raised from the bottom edge, as tall as its content, with a grab handle while it swipes. Header and footer are optional: without a header name it with `aria-label`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `aria-label` | `string` | — | Dialog name when there is no Title. |
| `aria-labelledby` | `string` | — | Overrides the Title id. |
| `aria-describedby` | `string` | — | Overrides the Description id. |
| `overlayClassName` | `string` | — | Class on the scrim. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other attributes of the `role="dialog"` element. |

### Sheet.Header
`ref` → `HTMLElement`. Renders `<header>`: [Icon] [Title / Description / Badges] [Actions] [close button] — the title on line 1 with the actions and the close button centred on it, the description on line 2, the badges on line 3.

| Prop | Type | Default | Description |
|---|---|---|---|
| `showClose` | `boolean` | `true` | Built-in square ghost `s` close button named by `labels.close`; disabled in place while a `Guard` is `busy`. |
| `children` | `ReactNode` | — | Icon, Title, Description, Badges, Actions in any order; each goes to its place. A `Tabs.List` (with `Tabs.Root` around header and body) turns the header into a tab strip. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `className` and the other attributes of the `<header>`. |

### Sheet.Actions
`ref` → `HTMLDivElement`. Header: a tab-wide switcher (`SegmentedControl`, `Datepicker`), then buttons (a status is a badge), tier `s`, on line 1; under the title below 12rem. In `Sheet.Footer`: the start group at the footer tier.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `children` and the other attributes of the row. |

### Sheet.Icon
`ref` → `HTMLSpanElement`. Optional mark centred on lines 1–2: an `aria-hidden` 40 px tone tile; around the record's picture (an `Avatar.Root` or a `Thumbnail.Root` anywhere inside, also from your own component) no tile (`data-media`), the picture at 40 px.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"neutral"` | Soft fill and icon color; not used around a picture. |
| `children` | `ReactNode` | — (required) | An `Icon` (sized to the m icon), or the record's picture: an `Avatar.Root` (size `l`) or a `Thumbnail.Root` (size `m`), set by the slot. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other attributes of the tile. |

### Sheet.Title
`ref` → `HTMLHeadingElement`. Line 1: `<h2>` (title-m); its id names the dialog. In a record header (with `Badges` or a `number`) the name is one line with an ellipsis (the whole name in its `title` while cut); in a question dialog it wraps.

| Prop | Type | Default | Description |
|---|---|---|---|
| `number` | `ReactNode` | — | The record's number («#678», «№ 1042», «INV-2026-0142»): muted after the name, never cut, part of the dialog's name. Never in `Description`. |
| `loading` | `boolean` | `false` | The name loads (a record opened by a link): a `Skeleton` holds the title line and `aria-busy` is set, so the header never moves; the name fades in. |
| `…rest` | `Omit<HTMLAttributes<HTMLHeadingElement>, "id">` | — | `className`, `children` and the other attributes except `id` (the dialog owns it). |

### Sheet.Description
`ref` → `HTMLParagraphElement`. Line 2: `<p>` (body-s, muted), text only, 4 under the title; its id describes the dialog. In a record header one line with an ellipsis (the whole text in its `title` while cut); in a question dialog it wraps under the title.

| Prop | Type | Default | Description |
|---|---|---|---|
| `loading` | `boolean` | `false` | Its data loads: a `Skeleton` holds the line's place and `aria-busy` is set, so the header never moves; the data fades in. |
| `…rest` | `Omit<HTMLAttributes<HTMLParagraphElement>, "id">` | — | `className`, `children` and the other attributes except `id` (the dialog owns it). |

### Sheet.Badges
`ref` → `HTMLDivElement`. Line 3 of a record header: a `Badge.Group` — the pickers first (status; assignee with `Badge.Avatar`, or an `outline` «Назначить»; each a `Badge.Root` in a `Dropdown.Trigger`), then the statuses. Chip tier `m`; one row, the rest behind «+N».

| Prop | Type | Default | Description |
|---|---|---|---|
| `loading` | `boolean` | `false` | The record loads: a `Skeleton` holds the line and `aria-busy` is set, so the header never moves; the badges fade in. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (`Badge.Root`s, the pickers in their `Dropdown.Root`), `className`, `aria-label` (a named row is `role="group"`) and the other attributes of the row. |

### Sheet.Body
`ref` → `HTMLDivElement`. The only scrolling zone (a ScrollContainer), 16 gap between blocks.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `children` and the other attributes of the zone. |

### Sheet.Footer
`ref` → `HTMLElement`. Renders `<footer>` with the actions, primary last, only while it holds something (it enters and closes up in place); at the start an optional `Sheet.Actions` (an action apart) and `Meta`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `layout` | `"fill" \| "end"` | `"end"` | `fill`: equal-width buttons in one row, wrapping rather than cutting a label; `end`: auto width, at the end. Stacked on phones (viewport below 640 px) and in a dialog narrower than 360 px. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `className`, `children` and the other attributes of the `<footer>`. |

### Sheet.Meta
`ref` → `HTMLParagraphElement`. A `<p>` at the start of the footer: short muted status text («Есть несохранённые изменения»); the buttons keep their width at the end. Not part of the dialog description.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLParagraphElement>` | — | `className`, `children` and the other attributes of the `<p>`. |

### Sheet.Guard
No DOM, no ref. Holds the dialog from anywhere inside Content, where the form state lives; renders only the built-in «discard changes?» confirm. While `busy` or `dirty` the browser also asks before the tab closes or reloads. Closing from code is never held.

| Prop | Type | Default | Description |
|---|---|---|---|
| `busy` | `boolean` | `false` | A request runs: Escape, a press outside, a swipe, the close button and `Close` do nothing; the close button and the `Close` child stay in place, disabled. The grab handle stays and takes no drag. |
| `dirty` | `boolean` | `false` | Unsaved changes: any of those dismisses (a swipe glides back first) asks «Не сохранять изменения?» (a ConfirmDialog with `labels.discard*`); confirming closes the dialog. |

### Sheet.Trigger · Sheet.Close
No DOM: each clones its child. `Trigger` and `Close` chain its `onClick` (skipped after `preventDefault()`): open; close through `Guard`, `disabled` while it is busy.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactElement` | — (required) | One element, usually a Button. |

## Variants
Sheet has no `variant`, `side` or `size`: it always rises from the bottom edge, centred at `--prime-sheet-width` (560) on a tablet or desktop, full width on a phone, and as tall as its content.

### Structure
| Value | Looks like | Use when | Default |
|---|---|---|---|
| content alone | the handle, then the body; named by `aria-label` | the content says what it is — a calendar under a «Дата отгрузки» button | |
| header + body | a title (and description) above the content; the header keeps its × | the content needs a title to be understood — actions «Заказ № 1042» | |
| header + body + footer | «Отмена» and the submit under the form | a short form that needs an explicit submit | |

### layout (Footer)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `end` | auto-width buttons at the end | a short form | yes |
| `fill` | equal-width buttons in one row | two equal answers | |

### tone (Icon)
`neutral` (default) · `accent` · `success` · `warning` · `danger` · `info` — soft tile fill and icon color, as in Modal. Around the record's picture — an `Avatar.Root` or a `Thumbnail.Root` anywhere inside, also from your own wrapper component — there is no tile and no tone: `data-media`, and the picture takes the tile's 40 px (avatar `l`, thumbnail `m`) whatever `size` it was given.

## States
| State | Driven by | DOM |
|---|---|---|
| open / closed | `open` / `defaultOpen` / `onOpenChange` | `data-state` on the scrim and the panel; mounted until the slide-down ends |
| dismiss | `closeOnEscape`, `closeOnOutsideClick` (both default `true`) | Escape, a scrim press and a swipe down ask the Root to close; `false` turns that way off (`closeOnOutsideClick={false}`: no handle, no swipe) |
| swiping | a drag down from the handle or the header (with `closeOnOutsideClick`; without it there is no handle and no swipe) | `data-swiping` and `--swipe-offset` on the panel while the pointer drags it, `data-swipe-dismissed` while it glides out after a closing release — both mirrored on the scrim, which carries `--swipe-progress` (0…1) |
| open: trapped | while open | focus trapped, page scroll locked, siblings of the portal `inert`; a sheet opened from another overlay stacks above it |
| closing | `open` turns false | the panel keeps showing the children it had open while it slides down |
| busy | `Sheet.Guard busy` | Escape, the scrim, a swipe, the close button and `Sheet.Close` do nothing; the close button and the `Close` child are `disabled` in place; the handle stays, `data-swipe-disabled` on the panel (no grab cursor) |
| dirty | `Sheet.Guard dirty` | a dismiss opens the «Не сохранять изменения?» ConfirmDialog (`labels.discard*`); a swipe past the threshold glides back and asks the same |
| leaving the tab | `Sheet.Guard busy` or `dirty` | the browser asks before the tab closes or reloads (`beforeunload`), as with `Page.Guard` |
| title loading | `Sheet.Title loading` | a `Skeleton` holds the title line, `aria-busy` on the `<h2>`; the name fades in under the same element |
| description loading | `Sheet.Description loading` | a `Skeleton` holds the line, `aria-busy` on the `<p>`; the data fades in under the same element |
| actions below | the title would get less than 12rem beside `Sheet.Actions` | `data-actions-below` on the header: the actions move under the title and the description |
| picture mark | an `Avatar.Root` or a `Thumbnail.Root` inside `Sheet.Icon` | `data-media` on the icon, no tile; the picture's `data-size` is the slot's (`l` / `m`) |
| record header | `Sheet.Badges`, or a `Sheet.Title number` | one line per line: the name and the description ellipsize, the number keeps its width; a cut line carries its whole text in `title` |
| badges overflow | `Sheet.Badges` wider than the dialog | the badges that do not fit wait behind a «+N» badge (`Badge.Group overflow="count"`) whose tooltip lists them; the row never wraps |
| badges loading | `Sheet.Badges loading` | a `Skeleton` of the chip height holds line 2, `aria-busy` on the row; the badges fade in |

Motion: the scrim fades, the sheet slides up over `slow` and down over `base` (`overlayMotion`); under `prefers-reduced-motion` it unmounts at once. A swipe down moves the sheet with the pointer; on release it closes past 30% of its height or on a quick flick and glides the rest of the way out, otherwise it glides back — both over `base` on the `emphasized` (iOS sheet) curve. A pull upward meets growing resistance and stops at 24; the sheet's fill continues that far below the screen edge. The scrim thins as the sheet goes down. The drag starts from the handle or the header, never from the body, so its content scrolls and its controls work as usual.

## Layout & spacing
- A sheet is a short task that ends by itself — a pick, a tap on an action, a swipe down. Its zones follow the task, not a template:
  - **No footer by default.** A footer only for a form with an explicit submit: «Отмена» (`Sheet.Close`, soft neutral) and the submit (solid, last; `type="submit" form={formId}`).
  - **The header is optional.** Keep it when the content needs a title to be understood (a list of actions on «Заказ № 1042»). Drop it — and with it the × and the hairline — when the content speaks for itself (a calendar opened from a «Дата отгрузки» button): name the sheet with `aria-label` on `Sheet.Content`.
- The header has one anatomy, the same in every modal, drawer and sheet — three lines in the text column, the actions and the close button centred on the first:
  ```
  Александра #678                              [icon buttons] [⋯] [×]
  Аренда байка Пхукет · заявка 19 сент, 06:37
  [Новая ⌄] [(АК) Анна Котова ⌄] [Telegram] [Ждёт человека] [+1]
  ```
  - line 1 — `Sheet.Title`: the record's name, then its `number` muted («#678», «№ 1042»); `loading` holds it with a Skeleton while the name loads. The name ellipsizes, the number never does; both are the dialog's name.
  - line 2 — `Sheet.Description`, 4 under the title: the record's context in plain text, one line with an ellipsis in a record header; the whole text stays the dialog's description. A status or a number never goes here.
  - line 3 — `Sheet.Badges`, 8 under the line above, right over the body: the record's working controls — first the pickers — the status (a `Badge.Root` inside a `Dropdown.Trigger`), the assignee (`Badge.Avatar` + the name, or an `outline` «Назначить») — then the plain statuses. The kit sizes them (chip tier `m`) and keeps one row: what does not fit waits behind «+N».
  - The header places the lines in this order whatever the order in code; write them in it anyway (Title, Description, Badges).
  - end — `Sheet.Actions`: first one switcher for the whole open tab (a `SegmentedControl`, a `Datepicker` period), then the buttons — ghost icon buttons with a Tooltip and a ⋯ Dropdown — at the close button's tier, centred on line 1; a status never goes here. Each child keeps its cell by its place: another control in the same place cross-fades inside the cell, a control rendered only on some tabs rises in and closes up.
  - `Sheet.Icon` is optional, before the text and centred on lines 1–2: a glyph on the tone tile, or a picture (`Avatar.Root`, `Thumbnail.Root`) with no tile; both are 40 px.
  - A question or a form keeps a plain header: its title and description wrap; only `Sheet.Badges` or a `number` make it a record header.
- A form's action apart from its submit pair: `Sheet.Actions` inside `Sheet.Footer` puts it at the start, at the footer's tier; stacked on a phone it comes first and the primary stays last.
- The content is the sheet's own, across its width: `Datepicker.Panel` or a column of actions straight in `Sheet.Body` — never a Card or a padded box inside it.
- Zone padding `--prime-sheet-padding`, width `--prime-sheet-width`. The bottom-sheet surface (`src/internal/sheet.module.css`, shared with a Modal and the floating layers on a phone) gives the height by content up to the top gap, the rounded top, the handle strip and the bottom safe-area inset below the content.
- Only the body scrolls; header and footer stay in place.
- Tabs in the header: a `Tabs.List` inside `Sheet.Header` (with `Tabs.Root` around the header and the body) spans the header's last row. The header becomes the tab strip, edge to edge and without the hairline; the active tab is the body rising into it, the panels sit in the body.
- Fields inside get the surface field fill.

```tsx
<Sheet.Content aria-label="Дата отгрузки">
  <Sheet.Body>
    <Datepicker.Panel mode="single" value={date} onValueChange={pick} />
  </Sheet.Body>
</Sheet.Content>
```

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Escape` | Closes the sheet (`closeOnEscape`); focus returns to the trigger. |
| `Tab` · `Shift+Tab` | Cycle focus inside the sheet. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- `role="dialog"`, `aria-modal="true"`, named by `Sheet.Title` — without a header by `aria-label` on `Sheet.Content`; described by `Sheet.Description`.
- Focus moves into the sheet on open and returns to the opener on close, including after a scrim click.
- The page behind is `inert`, scroll is locked; only the topmost layer reacts.
- A swipe down from the grab handle or the header is an extra way out next to Escape and the scrim, following `closeOnOutsideClick`: with it off there is no swipe and no handle. The handle is `aria-hidden`.
- A `Guard` that is `busy` holds every dismiss: the handle stays and takes no drag. A `dirty` one glides a swipe back and opens a `role="alertdialog"` confirm with focus on «Продолжить», as every other dismiss does.

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
| [overview.tsx](examples/overview.tsx) | Actions with an order raised from the bottom edge: a header names the order, a column of actions follows, and each action closes the sheet — `Sheet.Trigger`, `Sheet.Header`, `Sheet.Close`. |
| [structure.tsx](examples/structure.tsx) | The content alone: a date sheet with no header and no footer, the calendar across its width, named by `aria-label`; a pick or a swipe down closes it — `aria-label`, `Sheet.Body`. |
| [header-actions.tsx](examples/header-actions.tsx) | The courier is at the door: an icon tile heads the sheet, the order's number stands by its name, a line of data under it and its statuses under that, a ⋯ menu sits before the close button, and two equal buttons fill the footer — `Sheet.Icon`, `Sheet.Badges`, `Sheet.Actions`, `layout`. |
| [guard.tsx](examples/guard.tsx) | A review form that holds the sheet: after an edit a swipe, the scrim, Escape and Cancel ask before discarding and the footer says so; sending locks every way out — `Sheet.Guard`, `Sheet.Meta`. |
| [dismiss.tsx](examples/dismiss.tsx) | A handover the courier must answer: no swipe, scrim or Escape closes the sheet, only its two buttons — `closeOnOutsideClick`, `closeOnEscape`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent owns the state and raises the sheet from a link in the text, without a trigger — `open`, `onOpenChange`. |
| [in-form.tsx](examples/in-form.tsx) | A short form that needs an explicit submit: the one case for a footer, Cancel and Send under the field, an empty comment keeps the sheet open — `Sheet.Footer`, `error`. |

## Mistakes
- `<Drawer.Content side="bottom">` → there is no bottom Drawer; a panel from the bottom edge is `Sheet`.
- «Отмена» / «Готово» buttons under a sheet that closes on a pick → drop the footer; the pick, the swipe, the scrim and Escape close it.
- A header with only a title over a calendar or a list that already says what it is → drop the header and name the sheet with `aria-label`.
- No header and no `aria-label` → the dialog has no name; give `Sheet.Content` an `aria-label`.
- A status `Badge` in the header's `Sheet.Actions`, or inside `Sheet.Description` → put it in `Sheet.Badges`, line 3: the kit sizes it and keeps the row on one line.
- The badges above the text, or the record number in `Sheet.Description` → `Sheet.Title number`, then `Sheet.Description`, then `Sheet.Badges`, in that order on screen whatever the order in code.
- A long name wrapped onto two title lines in a record header → it is one line with an ellipsis; the whole name stays the dialog's name.
- A control that applies to the whole tab (the text language, the period) repeated in section headings or put in one section → one switcher in the header's `Sheet.Actions`, before the buttons, rendered only on the tabs it applies to.
- A Badge with its own `size` in `Sheet.Badges` → leave `size` out: the row gives every header the same chip tier.
- A `Skeleton` placed by hand in `Sheet.Title` or `Sheet.Description` → their `loading`.
- A start-side button («Выйти», «Удалить») put inside `Sheet.Meta` → `Sheet.Actions` inside `Sheet.Footer`; `Meta` is status text only.
- A Card or a padded `div` around the content → put it straight into `Sheet.Body`, across its width.
- Record details or a long form in a sheet → use Drawer; a sheet is a short task.
- `closeOnOutsideClick={false}` and `closeOnEscape={false}` with no header × and no `Sheet.Close` → nothing closes it; keep a button that answers.

## Related
- **Built from:** the dialog shared with Modal and Drawer (`internal/overlay/DialogParts`), [Badge](../badge/COMPONENT.md) (`Sheet.Badges`: a one-line `Badge.Group` of tier m), [Button](../button/COMPONENT.md) (close button), [ScrollContainer](../scroll-container/COMPONENT.md) (`Sheet.Body`), `internal/mediaSlot` (a record's Avatar or Thumbnail in `Sheet.Icon`), [Skeleton](../skeleton/COMPONENT.md) (`Sheet.Description loading`), [ConfirmDialog](../confirm-dialog/COMPONENT.md) (the `Sheet.Guard` discard confirm), `Icon` (the close glyph)
- **See also:** [Drawer](../drawer/COMPONENT.md) (the same parts as a side panel), [Modal](../modal/COMPONENT.md) (the same parts in the centre), [Datepicker](../datepicker/COMPONENT.md) (`Datepicker.Panel` in a sheet), [Dropdown](../dropdown/COMPONENT.md)
