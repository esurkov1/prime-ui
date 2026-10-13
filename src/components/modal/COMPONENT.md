# Modal

**Category:** overlays
**Kind:** overlay

> A dialog over the page for confirmations, short forms and important text.

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
    ├── (grab handle)         below 640px only: aria-hidden bar, a drag starts here
    ├── Modal.Guard           no DOM: holds the dialog (busy / dirty) from inside
    ├── Modal.Header          grid: [Icon] [Title + Description] [Actions] [close button]
    │   ├── Modal.Icon        40 tile with a tone fill
    │   ├── Modal.Title       <h2>, names the dialog
    │   ├── Modal.Description <p>, describes the dialog
    │   └── Modal.Actions     row of tier-s controls before the close button
    ├── Modal.Body            the only scrolling zone
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
| `closeOnOutsideClick` | `boolean` | `true` | A click on the scrim (and a swipe down) closes the dialog; turn off for destructive confirms. |
| `labels` | `Partial<ModalLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | Trigger and Content. |
| `confirmOnEnter` | `boolean` | `true` | Enter inside the dialog clicks the element wrapped in `Modal.Confirm`; Enter on a button or link activates that element instead. |
| `onEnterConfirm` | `(event: KeyboardEvent) => void` | — | Replaces the default Enter confirm. |

### Modal.Content
`ref` → `HTMLDivElement` (the dialog panel). Portal + scrim + `role="dialog"`; renders while open and during its exit animation, showing the children it had open (a record cleared with `open` does not empty the panel mid-motion). Controls inside get size `m`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Width: 360 · 440 · 560 · 720 · 960. Below 640 px of viewport — a full-width bottom sheet with a grab handle; a swipe down from the handle or the header closes it. |
| `container` | `HTMLElement \| null` | `document.body` | Portal target. |
| `aria-label` | `string` | — | Dialog name when there is no Title. |
| `aria-labelledby` | `string` | — | Overrides the Title id. |
| `aria-describedby` | `string` | — | Overrides the Description id. |
| `overlayClassName` | `string` | — | Class on the scrim. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other attributes of the `role="dialog"` element. |

### Modal.Header
`ref` → `HTMLElement`. Renders `<header>`: [Icon] [Title + Description] [Actions] [close button]. + native `HTMLAttributes<HTMLElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `showClose` | `boolean` | `true` | Built-in square ghost `s` close button named by `labels.close`; disabled in place while a `Guard` is `busy`. |
| `children` | `ReactNode` | — | Icon, Title, Description, Actions in any order; each goes to its column. A `Tabs.List` (with `Tabs.Root` around header and body) turns the header into a tab strip. |

### Modal.Actions
`ref` → `HTMLDivElement`. A row of controls at the end of the header, before the close button: a status Badge, a ⋯ Dropdown, an icon button. Controls inside take tier `s`. + native `<div>` props.

### Modal.Icon
`ref` → `HTMLSpanElement`. An `aria-hidden` 40 px tile with a tone fill.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"neutral"` | Soft fill and icon color. |
| `children` | `ReactNode` | — (required) | Icon glyph (sized to the m icon). |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other attributes of the tile. |

### Modal.Title · Modal.Description
`ref` → `HTMLHeadingElement` / `HTMLParagraphElement`. `<h2>` (title-m) / `<p>` (body-s, muted); their ids name and describe the dialog. + native props except `id`.

### Modal.Body
`ref` → `HTMLDivElement`. The only scrolling zone (a ScrollContainer), 16 gap between blocks. + native `<div>` props.

### Modal.Footer
`ref` → `HTMLElement`. Renders `<footer>` with the actions, primary last, and an optional `Meta` at the start. + native `HTMLAttributes<HTMLElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `layout` | `"fill" \| "end"` | `"fill" (xs/s/m), "end" (l/xl)` | `fill`: equal-width buttons in one row; `end`: auto width, at the end. Stacked on phones (viewport below 640 px) and in a dialog narrower than 360 px. |

### Modal.Meta
`ref` → `HTMLParagraphElement`. A `<p>` at the start of the footer: short muted status text («Есть несохранённые изменения»); the buttons keep their width at the end. Not part of the dialog description. + native `<p>` props.

### Modal.Guard
No DOM, no ref. Holds the dialog from anywhere inside Content, where the form state lives; renders only the built-in «discard changes?» confirm. Closing from code is never held.

| Prop | Type | Default | Description |
|---|---|---|---|
| `busy` | `boolean` | `false` | A request runs: Escape, a press outside, a swipe, the close button and `Close` do nothing; the close button and the `Close` child stay in place, disabled. |
| `dirty` | `boolean` | `false` | Unsaved changes: any of those dismisses first asks «Не сохранять изменения?» (a ConfirmDialog with `labels.discard*`); confirming closes the dialog. |

### Modal.Trigger · Modal.Close · Modal.Confirm
No DOM: clone the single child and chain its `onClick` (unless the child's handler calls `preventDefault()`). `Close` goes through a `Guard` and makes its child `disabled` while the guard is busy.

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

Below 640px of viewport every size becomes a full-width bottom sheet with a grab handle.

### layout (Footer)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fill` | Equal-width buttons in one row, gap 12 | Narrow dialogs with two actions | for `xs`, `s`, `m` |
| `end` | Auto-width buttons at the end, gap 8 | Wide dialogs | for `l`, `xl` |

With a `Modal.Meta` the footer is a row in any layout: the status takes the free room at the start, the buttons keep their width at the end. On phones (viewport below 640px, where the dialog is a bottom sheet) and in a dialog narrower than 360px, actions stack full width in DOM order (primary last), the status above them.

### tone (Icon)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | `fill-muted` tile, secondary icon | Settings, generic dialogs | yes |
| `accent` | `accent-soft` tile, accent icon | Product features, invitations | |
| `success` | `success-soft` tile, success icon | Done / completed | |
| `warning` | `warning-soft` tile, warning icon | Risky but reversible | |
| `danger` | `danger-soft` tile, danger icon | Delete confirmations | |
| `info` | `info-soft` tile, info icon | Informational notices | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `showClose` | Close button at the end of the header | Default | `true` |
| `showClose={false}` | No close button | The footer has an explicit cancel and Escape is enough | |
| Header + Footer, no Body | Hairline between them | Confirmations | |
| Header only | Header with full bottom padding | Short notices | |

**Combinations** — destructive confirm: use [ConfirmDialog](../confirm-dialog/COMPONENT.md). An edit form: `Modal.Guard busy={saving} dirty={changed}`, `Modal.Meta` «Есть несохранённые изменения» while changed, the submit Button `loading` while saving.

**Hierarchy** — one primary action, last in the footer and wrapped in `Modal.Confirm`; the secondary is `outline` neutral.

## States
| State | Driven by | DOM |
|---|---|---|
| open / closed | `open` / `defaultOpen` / `onOpenChange` | `data-state="open" \| "closed"` on the scrim and the dialog (closed while the exit animation plays) |
| size | `size` on Content | `data-size` on the dialog |
| header with description | a `Modal.Description` inside | `data-has-description="true"` on the header |
| footer layout | `layout` or the size default | `data-layout` on the footer |
| icon tone | `tone` on Icon | `data-tone` on the tile |
| while open | — | focus trapped inside, page scroll locked, siblings of the portal `inert` (the toast region stays usable) |
| closing | `open` turns false | the dialog keeps showing the children it had open while the exit motion plays |
| busy | `Modal.Guard busy` | Escape, the scrim, a swipe, the close button and `Modal.Close` do nothing; the close button and the `Close` child are `disabled` in place |
| dirty | `Modal.Guard dirty` | a dismiss opens the «Не сохранять изменения?» ConfirmDialog (`labels.discard*`); its confirm closes the dialog; no swipe |
| swiping | below 640px, a drag down from the handle or the header (with `closeOnOutsideClick`) | `data-swiping` and `--swipe-offset` on the dialog while the pointer drags it; past 30% of its height or on a flick it closes, otherwise it glides back |

Loading or disabled actions use the Button props (`loading`, `disabled`) inside the footer.

Motion (`overlayMotion`): the scrim fades in and out over `base`; the dialog fades and scales from 0.98 over `base` and leaves over `fast`; as a bottom sheet it slides up over `slow` and down over `base`. Content stays mounted until the exit ends; under `prefers-reduced-motion` it unmounts at once.

## Layout & spacing
- Dialog padding `--prime-modal-padding` (24) on every zone; header 24 top / 20 bottom, body 20 with a 16 gap between blocks, footer 20 top / 24 bottom.
- Max height = viewport minus `--prime-modal-viewport-padding` on both sides; only the body scrolls.
- Tabs in the header: a `Tabs.List` inside `Modal.Header` (with `Tabs.Root` around the header and the body) spans the header's last row. The header becomes the tab strip, edge to edge and without the hairline; the active tab is the body rising into it, the panels sit in the body.
- Fields inside take the floating layer's fill; a card inside is the next layer (`floating-1`), a flat tile. Group fields with a 20 gap.
- Narrow viewport (< 640px): bottom sheet, full width, top corners `--prime-sheet-radius`, a grab handle strip on top, up to `100dvh − --prime-sheet-top-gap` high, the bottom safe-area inset below the content.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Escape` | Closes the dialog (`closeOnEscape`); focus returns to the opener. |
| `Enter` | Clicks `Modal.Confirm` from a text field or the dialog itself. Enter on a button, link or `role="button"` (Cancel included) activates that element instead; a `<textarea>`, a `<select>`, an `<input>` of type checkbox / radio / file / button / submit / reset, a contenteditable element and the header keep their own Enter. |
| `Tab` · `Shift+Tab` | Cycles focus inside the dialog. |

### ARIA
- `role="dialog"`, `aria-modal="true"`, named by Title (or `aria-label`), described by Description.
- Focus moves into the dialog on open (an `autoFocus` field wins) and returns to the opener on close — also after a scrim click (foundation §8).
- The page behind is `inert` and its scroll is locked.
- Only the topmost layer reacts: a Select open inside the dialog closes first.
- On a narrow viewport a swipe down is an extra way out; the close button and Escape stay. A destructive confirm (`closeOnOutsideClick={false}`) does not close by swipe. The grab handle is `aria-hidden`.
- A busy `Guard` keeps the close button and the `Close` child in place, `disabled`; a dirty one opens a `role="alertdialog"` confirm with focus on «Продолжить».

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
| [structure.tsx](examples/structure.tsx) | Optional parts: an icon tile with a header-only notice, and a header with a footer but no body — `Modal.Icon`, `Modal.Body`, `Modal.Footer`. |
| [sizes.tsx](examples/sizes.tsx) | Every width; xs, s and m fill the footer with equal buttons, l and xl align them to the end — `size`. |
| [long-content.tsx](examples/long-content.tsx) | A long body scrolls on its own while the header and the footer stay in place — `Modal.Body`. |
| [custom-container.tsx](examples/custom-container.tsx) | The dialog portals into a given node instead of the document body — `container`. |
| [guard.tsx](examples/guard.tsx) | An edit form that holds the dialog: changes make any dismiss ask first and show a note in the footer; while saving nothing closes it — `Modal.Guard`, `Modal.Meta`. |
| [dismiss.tsx](examples/dismiss.tsx) | A destructive confirm closes only from its buttons, and not at all while the request runs — `closeOnOutsideClick`, `closeOnEscape`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent owns the open state and opens the dialog from code, without a trigger — `open`, `onOpenChange`. |
| [in-form.tsx](examples/in-form.tsx) | A settings form in a dialog: the footer button submits the form and an empty name shakes the field and keeps it open until it is filled — `Modal.Body`, `Modal.Footer`, `error`. |

## Mistakes
- Destructive confirm that closes on a stray scrim click → `closeOnOutsideClick={false}`.
- Primary action not in `Modal.Confirm` → Enter does nothing; wrap it.
- Primary action first in the footer → put it last (DOM order is the visual order).
- Busy or unsaved state lifted out of the form into Root props → put `Modal.Guard` next to the form, inside Content.
- `key` or a conditional around `Modal.Root` to reset a form → the dialog unmounts at once, without its exit; keep the Root mounted and drive `open`.
- Scrolling wrapper inside Modal.Body → Body already scrolls.
- Long multi-section forms in a modal → use Drawer.

## Related
- **Built from:** [Button](../button/COMPONENT.md) (header close button), [ScrollContainer](../scroll-container/COMPONENT.md) (`Modal.Body`), [ConfirmDialog](../confirm-dialog/COMPONENT.md) (the `Modal.Guard` discard confirm), `Icon` (the close glyph)
- **See also:** [ConfirmDialog](../confirm-dialog/COMPONENT.md) (a destructive confirm built on Modal `s`), [Drawer](../drawer/COMPONENT.md) (the same header, body, footer and `Guard` at the edge), [Popover](../popover/COMPONENT.md), [CommandMenu](../command-menu/COMPONENT.md)
