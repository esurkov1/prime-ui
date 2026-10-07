# Modal

**Category:** overlays
**Kind:** overlay

> A dialog over the page for confirmations, short forms and important text.

## When to use
- Confirming a destructive or irreversible action.
- A short form that must be finished or cancelled before returning to the page.
- Important information that needs an explicit acknowledgement.

## When not to use
- Long forms, filters or record details next to the page → use [Drawer](../drawer/COMPONENT.md).
- A light confirm or form tied to one button, without blocking the page → use [Popover](../popover/COMPONENT.md).
- Searching and running commands → use [CommandMenu](../command-menu/COMPONENT.md).
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
    ├── Modal.Header          grid: [Icon] [Title + Description] [close button]
    │   ├── Modal.Icon        40 tile with a tone fill
    │   ├── Modal.Title       <h2>, names the dialog
    │   └── Modal.Description <p>, describes the dialog
    ├── Modal.Body            the only scrolling zone
    └── Modal.Footer          actions, primary last
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
| `onOpenChange` | `(open: boolean) => void` | — | Called on every open and close: trigger, close button, `Close`, Escape, scrim click, code. |
| `closeOnEscape` | `boolean` | `true` | Escape closes the dialog. |
| `closeOnOutsideClick` | `boolean` | `true` | A click on the scrim closes the dialog; turn off for destructive confirms. |
| `labels` | `Partial<ModalLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | Trigger and Content. |
| `confirmOnEnter` | `boolean` | `true` | Enter inside the dialog clicks the element wrapped in `Modal.Confirm`. |
| `onEnterConfirm` | `(event: KeyboardEvent) => void` | — | Replaces the default Enter confirm. |

### Modal.Content
`ref` → `HTMLDivElement` (the dialog panel). Portal + scrim + `role="dialog"`; renders while open and during its exit animation. Controls inside get size `m`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Width: 440 · 560 · 720 · 960. Below 640 px of viewport — a full-width bottom sheet. |
| `container` | `HTMLElement \| null` | `document.body` | Portal target. |
| `aria-label` | `string` | — | Dialog name when there is no Title. |
| `aria-labelledby` | `string` | — | Overrides the Title id. |
| `aria-describedby` | `string` | — | Overrides the Description id. |
| `overlayClassName` | `string` | — | Class on the scrim. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other attributes of the `role="dialog"` element. |

### Modal.Header
`ref` → `HTMLElement`. Renders `<header>`: [Icon] [Title + Description] [close button]. + native `HTMLAttributes<HTMLElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `showClose` | `boolean` | `true` | Built-in square ghost `s` close button named by `labels.close`. |
| `children` | `ReactNode` | — | Icon, Title, Description in any order; the icon goes to the leading slot. |

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
`ref` → `HTMLElement`. Renders `<footer>` with the actions, primary last. + native `HTMLAttributes<HTMLElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `layout` | `"fill" \| "end"` | `"fill" (s/m), "end" (l/xl)` | `fill`: equal-width buttons in one row; `end`: auto width, at the end. Narrower than 360 px — stacked. |

### Modal.Trigger · Modal.Close · Modal.Confirm
No DOM: clone the single child and chain its `onClick` (unless the child's handler calls `preventDefault()`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactElement` | — (required) | One element, usually a Button. |

## Variants
The dialog has one look: `bg-raised`, `--prime-modal-radius` (16), `shadow-modal`, on a `bg-scrim`. Header, body and footer are separated by faint inset hairlines.

### size (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `s` | 440 wide, equal-width footer buttons | Confirmations | |
| `m` | 560 wide, equal-width footer buttons | Short forms | yes |
| `l` | 720 wide, footer buttons right-aligned | Two-column forms | |
| `xl` | 960 wide, footer buttons right-aligned | Tables, previews | |

Below 640px of viewport every size becomes a full-width bottom sheet.

### layout (Footer)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fill` | Equal-width buttons in one row, gap 12 | Narrow dialogs with two actions | for `s`, `m` |
| `end` | Auto-width buttons at the end, gap 8 | Wide dialogs | for `l`, `xl` |

When the dialog itself is narrower than 360px, actions stack full width in DOM order (primary last).

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

**Combinations** — destructive confirm: `size="s"`, `Modal.Icon tone="danger"`, `closeOnOutsideClick={false}`, outline neutral «Отмена» in `Modal.Close`, solid `tone="danger"` action in `Modal.Confirm` with `loading` during the request.

**Hierarchy** — one primary action, last in the footer and wrapped in `Modal.Confirm`; the secondary is `outline` neutral.

## States
| State | Driven by | DOM |
|---|---|---|
| open / closed | `open` / `defaultOpen` / `onOpenChange` | `data-state="open" \| "closed"` on the scrim and the dialog (closed while the exit animation plays) |
| size | `size` on Content | `data-size` on the dialog |
| header with description | a `Modal.Description` inside | `data-has-description="true"` on the header |
| footer layout | `layout` or the size default | `data-layout` on the footer |
| icon tone | `tone` on Icon | `data-tone` on the tile |
| while open | — | focus trapped inside, page scroll locked, siblings of the portal `inert` |

Loading or disabled actions use the Button props (`loading`, `disabled`) inside the footer.

## Layout & spacing
- Dialog padding `--prime-modal-padding` (24) on every zone; header 24 top / 20 bottom, body 20 with a 16 gap between blocks, footer 20 top / 24 bottom.
- Max height = viewport minus `--prime-modal-viewport-padding` on both sides; only the body scrolls.
- Fields inside get the surface field fill; cards inside become sunken tiles. Group fields with a 20 gap.
- Narrow viewport (< 640px): bottom sheet, full width, top corners rounded.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Escape` | Closes the dialog (`closeOnEscape`); focus returns to the opener. |
| `Enter` | Clicks `Modal.Confirm` unless focus is in a `<textarea>`, a `<select>`, an `<input>` of type checkbox / radio / file / button / submit / reset, a contenteditable element, inside the header, or on the Confirm element itself. A plain `<button>` in the body does not block it. |
| `Tab` · `Shift+Tab` | Cycles focus inside the dialog. |

### ARIA
- `role="dialog"`, `aria-modal="true"`, named by Title (or `aria-label`), described by Description.
- Focus moves into the dialog on open (an `autoFocus` field wins) and returns to the opener on close — also after a scrim click (foundation §8).
- The page behind is `inert` and its scroll is locked.
- Only the topmost layer reacts: a Select open inside the dialog closes first.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `close` | `"Закрыть"` | `aria-label` of the header close button. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A trigger opens a dialog with a title, a field and two actions; Enter presses the confirm — `Modal.Trigger`, `Modal.Confirm`. |
| [structure.tsx](examples/structure.tsx) | Optional parts: an icon tile with a header-only notice, and a header with a footer but no body — `Modal.Icon`, `Modal.Body`, `Modal.Footer`. |
| [sizes.tsx](examples/sizes.tsx) | Every width; s and m fill the footer with equal buttons, l and xl align them to the end — `size`. |
| [long-content.tsx](examples/long-content.tsx) | A long body scrolls on its own while the header and the footer stay in place — `Modal.Body`. |
| [custom-container.tsx](examples/custom-container.tsx) | The dialog portals into a given node instead of the document body — `container`. |
| [dismiss.tsx](examples/dismiss.tsx) | A destructive confirm closes only from its buttons, and not at all while the request runs — `closeOnOutsideClick`, `closeOnEscape`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent owns the open state and opens the dialog from code, without a trigger — `open`, `onOpenChange`. |
| [in-form.tsx](examples/in-form.tsx) | A settings form in a dialog: the footer button submits the form and an empty name keeps it open — `Modal.Body`, `Modal.Footer`, `error`. |

## Mistakes
- Destructive confirm that closes on a stray scrim click → `closeOnOutsideClick={false}`.
- Primary action not in `Modal.Confirm` → Enter does nothing; wrap it.
- Primary action first in the footer → put it last (DOM order is the visual order).
- `size="xs"` → not supported; sizes are `s`–`xl`.
- Scrolling wrapper inside Modal.Body → Body already scrolls.
- Long multi-section forms in a modal → use Drawer.

## Related
- **Built from:** [Button](../button/COMPONENT.md) (header close button), [ScrollContainer](../scroll-container/COMPONENT.md) (`Modal.Body`)
- **See also:** [Drawer](../drawer/COMPONENT.md), [Popover](../popover/COMPONENT.md), [CommandMenu](../command-menu/COMPONENT.md)
