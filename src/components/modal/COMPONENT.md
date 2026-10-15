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
    ├── Modal.Header          grid: [Icon] [Title + Description] [Actions] [close button]
    │   ├── Modal.Icon        40 tile with a tone fill; no tile around an Avatar.Root / Thumbnail.Root
    │   ├── Modal.Title       <h2>, names the dialog
    │   ├── Modal.Description <p>, describes the dialog
    │   └── Modal.Actions     row of tier-s controls before the close button
    ├── Modal.Body            the only scrolling zone
    │   └── Modal.Section     <section>: <h3> label, description, Modal.Actions at the heading's end
    └── Modal.Footer          actions, primary last
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
`ref` → `HTMLElement`. Renders `<header>`: [Icon] [Title + Description] [Actions] [close button].

| Prop | Type | Default | Description |
|---|---|---|---|
| `showClose` | `boolean` | `true` | Built-in square ghost `s` close button named by `labels.close`; disabled in place while a `Guard` is `busy`. |
| `children` | `ReactNode` | — | Icon, Title, Description, Actions in any order; each goes to its column. A `Tabs.List` (with `Tabs.Root` around header and body) turns the header into a tab strip. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `className` and the other attributes of the `<header>`. |

### Modal.Actions
`ref` → `HTMLDivElement`. A row of controls at the end of the header, before the close button: a status Badge, a ⋯ Dropdown, an icon button; or at the end of a `Modal.Section` heading. Controls inside take tier `s`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `children` and the other attributes of the row. |

### Modal.Icon
`ref` → `HTMLSpanElement`. An `aria-hidden` 40 px tile with a tone fill; around an `Avatar.Root` or a `Thumbnail.Root` (the record's picture) no tile — `data-media`, the avatar sized to 40 px.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"neutral"` | Soft fill and icon color; not used around a picture. |
| `children` | `ReactNode` | — (required) | An `Icon` (sized to the m icon), or the record's picture: an `Avatar.Root` (sized to the tile) or a `Thumbnail.Root`. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other attributes of the tile. |

### Modal.Title · Modal.Description
`ref` → `HTMLHeadingElement` / `HTMLParagraphElement`. `<h2>` (title-m) / `<p>` (body-s, muted); their ids name and describe the dialog.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<HTMLAttributes<HTMLHeadingElement \| HTMLParagraphElement>, "id">` | — | `className`, `children` and the other attributes except `id` (the dialog owns it). |

### Modal.Body
`ref` → `HTMLDivElement`. The only scrolling zone (a ScrollContainer), 16 gap between blocks.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `children` and the other attributes of the zone. |

### Modal.Section
`ref` → `HTMLElement`. A titled `<section>` of the body: an `<h3>` (title-s, under the `<h2>` title), an optional description, a `Modal.Actions` at the end of the heading row; the content 16 below, sections 32 apart. Fields group in a `Fieldset`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — (required) | The heading of the section; it names the `<section>`. |
| `description` | `ReactNode` | — | One line of context under the heading (body-s). |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "title">` | — | `children` (the content and an optional `Modal.Actions`), `className` and the other attributes of the `<section>`. |

### Modal.Footer
`ref` → `HTMLElement`. Renders `<footer>` with the actions, primary last, and an optional `Meta` at the start.

| Prop | Type | Default | Description |
|---|---|---|---|
| `layout` | `"fill" \| "end"` | `"fill"` for `xs` `s` `m`, `"end"` for `l` `xl` | `fill`: equal-width buttons in one row; `end`: auto width, at the end. Stacked on phones (viewport below 640 px) and in a dialog narrower than 360 px. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `className`, `children` and the other attributes of the `<footer>`. |

### Modal.Meta
`ref` → `HTMLParagraphElement`. A `<p>` at the start of the footer: short muted status text («Есть несохранённые изменения»); the buttons keep their width at the end. Not part of the dialog description.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLParagraphElement>` | — | `className`, `children` and the other attributes of the `<p>`. |

### Modal.Guard
No DOM, no ref. Holds the dialog from anywhere inside Content, where the form state lives; renders only the built-in «discard changes?» confirm. Closing from code is never held.

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
| `fill` | Equal-width buttons in one row, gap 12 | Narrow dialogs with two actions | for `xs`, `s`, `m` |
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

Around the record's picture — an `Avatar.Root` or a `Thumbnail.Root` (found by element type) — there is no tile and no tone: `data-media`, the avatar sized to 40 px.

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
| header with description | a `Modal.Description` inside | `data-has-description="true"` on the header |
| footer layout | `layout` or the size default | `data-layout` on the footer |
| icon tone | `tone` on Icon | `data-tone` on the tile |
| while open | — | focus trapped inside, page scroll locked, siblings of the portal `inert` (the toast region stays usable) |
| closing | `open` turns false | the dialog keeps showing the children it had open while the exit motion plays |
| busy | `Modal.Guard busy` | Escape, the scrim, a swipe, the close button and `Modal.Close` do nothing; the close button and the `Close` child are `disabled` in place |
| dirty | `Modal.Guard dirty` | a dismiss opens the «Не сохранять изменения?» ConfirmDialog (`labels.discard*`); its confirm closes the dialog; a swipe past the threshold glides back and asks the same |
| sheet | a centred dialog on a phone viewport | `data-sheet` on the dialog: the bottom-sheet surface, the grab handle while it swipes |
| swiping | as a phone sheet, a drag down from the handle or the header (with `closeOnOutsideClick`; without it there is no handle and no swipe) | `data-swiping` and `--swipe-offset` on the dialog while the pointer drags it; past 30% of its height or on a flick it closes, otherwise it glides back; a busy `Modal.Guard` sets `data-swipe-disabled` and the handle takes no drag |
| placement | `placement` on Content | `data-placement` on the dialog |

Loading or disabled actions use the Button props (`loading`, `disabled`) inside the footer.

Motion (`overlayMotion`): the scrim fades in and out over `base`; the dialog fades and scales from 0.98 over `base` and leaves over `fast`; as a bottom sheet it slides up over `slow` and down over `base`. Content stays mounted until the exit ends; under `prefers-reduced-motion` it unmounts at once.

## Layout & spacing
- Dialog padding `--prime-modal-padding` (24) on every zone; header 24 top / 20 bottom, body 20 with a 16 gap between blocks, footer 20 top / 24 bottom.
- Max height = viewport minus `--prime-modal-viewport-padding` on both sides; only the body scrolls.
- Tabs in the header: a `Tabs.List` inside `Modal.Header` (with `Tabs.Root` around the header and the body) spans the header's last row. The header becomes the tab strip, edge to edge and without the hairline; the active tab is the body rising into it, the panels sit in the body.
- Fields inside take the floating layer's fill; a card inside is the next layer (`floating-1`), a flat tile. Group fields with a 20 gap.
- Titled groups of a long body: `Modal.Section label` — an `<h3>` under the dialog's `<h2>` title, an optional `description`, a `Modal.Actions` at the end of its heading row; content 16 below, sections 32 apart. A group of fields is a `Fieldset`.
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
| [structure.tsx](examples/structure.tsx) | Optional parts: an icon tile with a header-only notice, and a header with a status before the close button and a footer with no body between them — `Modal.Icon`, `Modal.Actions`, `Modal.Footer`. |
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
- A hand-made heading row (`Typography as="h3"` + buttons) over a group in the body → `Modal.Section label` with `Modal.Actions`.
- Busy or unsaved state lifted out of the form into Root props → put `Modal.Guard` next to the form, inside Content.
- `key` or a conditional around `Modal.Root` to reset a form → the dialog unmounts at once, without its exit; keep the Root mounted and drive `open`.
- Scrolling wrapper inside Modal.Body → Body already scrolls.
- Long multi-section forms in a modal → use Drawer.

## Related
- **Built from:** the dialog shared with Drawer and Sheet (`internal/overlay/DialogParts`, `internal/overlay/ModalDialog`), [Button](../button/COMPONENT.md) (header close button), [ScrollContainer](../scroll-container/COMPONENT.md) (`Modal.Body`), [Avatar](../avatar/COMPONENT.md) and [Thumbnail](../thumbnail/COMPONENT.md) (a record's picture in `Modal.Icon`), [ConfirmDialog](../confirm-dialog/COMPONENT.md) (the `Modal.Guard` discard confirm), `Icon` (the close glyph)
- **See also:** [ConfirmDialog](../confirm-dialog/COMPONENT.md) (a destructive confirm built on Modal `s`), [Drawer](../drawer/COMPONENT.md) (the same header, body, footer and `Guard` at the edge), [Popover](../popover/COMPONENT.md), [CommandMenu](../command-menu/COMPONENT.md)
