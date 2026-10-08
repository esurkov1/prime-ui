# Drawer

**Category:** overlays
**Kind:** overlay

> A modal panel that slides in from the edge: filters, forms and record details at the side, a bottom sheet on a phone.

## When to use
- Editing settings or a record without leaving the page.
- Filters or navigation on narrow screens (`side="left"`).
- Read-only details of a list row (order, user, event).
- Long content (history, logs) that needs a tall scrolling area.
- A short task on a phone — pick a date, choose an action, fill two fields — in a bottom sheet (`side="bottom"`).

## When not to use
- Confirmations and short decisions → use [Modal](../modal/COMPONENT.md).
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
└─ Drawer.Content              portal + scrim + role="dialog" panel at the edge
   ├─ (grab handle)            side="bottom" only: aria-hidden bar, a drag starts here
   ├─ Drawer.Header            grid: [Icon] [Title + Description] [close Button]
   │  ├─ Drawer.Icon
   │  ├─ Drawer.Title          <h2>
   │  └─ Drawer.Description    <p>
   ├─ Drawer.Body              the only scrolling zone (ScrollContainer)
   └─ Drawer.Footer            actions, primary last
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
| `onOpenChange` | `(open: boolean) => void` | — | Called on every open and close: trigger, close button, `Close`, Escape, scrim click, code. |
| `closeOnEscape` | `boolean` | `true` | Escape closes the dialog. |
| `closeOnOutsideClick` | `boolean` | `true` | A click on the scrim (and a swipe on a bottom sheet) closes the dialog; turn off for destructive confirms. |
| `labels` | `Partial<DrawerLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | Trigger and Content. |

### Drawer.Content
`ref` → `HTMLDivElement` (the dialog panel). Portal + scrim + `role="dialog"` panel at the edge; renders while open and during its exit animation.

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"left" \| "right" \| "bottom"` | `"right"` | Edge the panel slides from; rounded only on the edge facing the page. `bottom` is a sheet: a grab handle on top, height by content. A swipe toward the edge closes the panel (with `closeOnOutsideClick`): a bottom sheet from its handle or header, a side drawer by touch anywhere (by mouse from the header). |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Width: 360 · 480 · 640 · 800; a bottom sheet is centred and at least 560 (`--prime-sheet-min-width`). Below 640 px of viewport — full width; side drawers lose their corners. |
| `aria-label` | `string` | — | Dialog name when there is no Title. |
| `aria-labelledby` | `string` | — | Overrides the Title id. |
| `aria-describedby` | `string` | — | Overrides the Description id. |
| `overlayClassName` | `string` | — | Class on the scrim. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other attributes of the `role="dialog"` element. |

### Drawer.Header
`ref` → `HTMLElement`. Renders `<header>`: [Icon] [Title + Description] [close button]. + native `HTMLAttributes<HTMLElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `showClose` | `boolean` | `true` | Built-in square ghost `s` close button named by `labels.close`. |
| `children` | `ReactNode` | — | Icon, Title, Description in any order; the icon goes to the leading slot. |

### Drawer.Icon
`ref` → `HTMLSpanElement`. An `aria-hidden` 40 px tile with a tone fill.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"neutral"` | Soft fill and icon color. |
| `children` | `ReactNode` | — (required) | Icon glyph (sized to the m icon). |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other attributes of the tile. |

### Drawer.Title · Drawer.Description
`ref` → `HTMLHeadingElement` / `HTMLParagraphElement`. `<h2>` (title-m) / `<p>` (body-s, muted); their ids name and describe the dialog. + native props except `id`.

### Drawer.Body
`ref` → `HTMLDivElement`. The only scrolling zone (a ScrollContainer), 16 gap between blocks. + native `<div>` props.

### Drawer.Footer
`ref` → `HTMLElement`. Renders `<footer>` with the actions, primary last. + native `HTMLAttributes<HTMLElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `layout` | `"fill" \| "end"` | `"end"` | `fill`: equal-width buttons in one row; `end`: auto width, at the end. Stacked on phones (viewport below 640 px) and in a dialog narrower than 360 px. |

### Drawer.Trigger · Drawer.Close
No DOM: clone the single child and chain its `onClick` (unless the child's handler calls `preventDefault()`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactElement` | — (required) | One element, usually a Button. |

## Variants

### side (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `right` | slides from the right, rounded on its left edge | details and forms | yes |
| `left` | slides from the left, rounded on its right edge | filters, mobile navigation | |
| `bottom` | rises from the bottom, rounded on top, grab handle, height by content | a short task on a phone | |

### size (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `s` | 360 wide | details, short help | |
| `m` | 480 wide | settings forms | yes |
| `l` | 640 wide | wide forms | |
| `xl` | 800 wide | tables, previews | |

A bottom sheet is centred at its width, never narrower than 560 (`--prime-sheet-min-width`), so a tablet gets a real sheet. Below 640px of viewport every size is full width; side drawers lose their corners, the sheet keeps its top radius.

### layout (Footer)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `end` | auto-width buttons at the end | most drawers | yes |
| `fill` | equal-width buttons in one row | one full-width action («Понятно») | |

### tone (Icon)
`neutral` (default) · `accent` · `success` · `warning` · `danger` · `info` — soft tile fill and icon color, as in Modal.

## States
| State | Driven by | DOM |
|---|---|---|
| open / closed | `open` / `defaultOpen` / `onOpenChange` | `data-state` on the scrim and the panel; mounted until the slide-out ends |
| side / size | Content props | `data-side`, `data-size` on the panel |
| swiping | a drag toward the edge (with `closeOnOutsideClick`) | `data-swiping` and `--swipe-offset` on the panel while the pointer drags it; `data-swipe-dismissed` while it glides out after a closing release; `--swipe-progress` (0…1) on the scrim |
| open: trapped | while open | focus trapped, page scroll locked, siblings of the portal `inert` (the toast region stays usable); a drawer opened from a Modal or another drawer stacks above it |

Motion: the scrim fades, the panel slides from its side over `slow` and leaves over `base` (`overlayMotion`); under `prefers-reduced-motion` it unmounts at once. A swipe moves the panel with the pointer; on release it closes past 30% of its size or on a quick flick and glides the rest of the way out from where it was let go, otherwise it glides back — both over `base` on the `emphasized` (iOS sheet) curve. A pull the other way meets growing resistance and stops at 24; the panel's fill continues that far past the screen edge, so it never comes away from it. The scrim follows the panel: its fill thins in proportion to how far out the panel is, tracks the finger while dragging and glides with the panel on release. A bottom sheet drags from its handle or header; a side drawer by touch anywhere (not on text fields, sliders or sideways scrollers), by mouse from the header.

## Layout & spacing
- Zone padding `--prime-drawer-padding`; hairlines between header, body and footer.
- Full viewport height; only the body scrolls, with its own side padding.
- Bottom sheet: width by `size`, at least `--prime-sheet-min-width` (560); height by content up to `100dvh − --prime-sheet-top-gap`, radius `--prime-sheet-radius`, a `--prime-sheet-handle-area` strip with the handle bar, the bottom safe-area inset below the content.
- Fields inside get the surface field fill.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Escape` | Closes the drawer (`closeOnEscape`); focus returns to the trigger. |
| `Tab` · `Shift+Tab` | Cycle focus inside the drawer. |

### ARIA
- `role="dialog"`, `aria-modal="true"`, named by Title (or `aria-label`), described by Description.
- Focus moves into the panel on open and returns to the opener on close, including after a scrim click.
- The page behind is `inert`, scroll is locked; only the topmost layer reacts.
- A drawer opened from a Modal stacks above it.
- A swipe toward the edge is an extra way out; the close button and Escape stay. The grab handle is `aria-hidden`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `close` | `"Закрыть"` | `aria-label` of the header close button. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Order details next to the list: a trigger, a header with a close button and a read-only body — `Drawer.Trigger`, `Drawer.Body`. |
| [structure.tsx](examples/structure.tsx) | Optional parts: an icon tile in the header and one full-width action in the footer — `Drawer.Icon`, `Drawer.Footer`, `layout`. |
| [sizes.tsx](examples/sizes.tsx) | Every panel width, 360 to 800 px; below 640 px of viewport the panel takes the full width — `size`. |
| [placement.tsx](examples/placement.tsx) | The panel slides from the right for details, from the left for filters and up from the bottom as a sheet — `side`. |
| [date-sheet.tsx](examples/date-sheet.tsx) | A date picked in a bottom sheet: a grab handle on top, a swipe down or a pick closes it — `side`, `Drawer.Body`. |
| [long-content.tsx](examples/long-content.tsx) | A long body scrolls on its own while the header and the footer stay in place — `Drawer.Body`. |
| [dismiss.tsx](examples/dismiss.tsx) | An import closes only from its buttons, and not at all while it runs — `closeOnOutsideClick`, `closeOnEscape`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent owns the state and opens the drawer from a link, without a trigger — `open`, `onOpenChange`. |
| [in-form.tsx](examples/in-form.tsx) | A settings form in the panel: the footer button submits the form and an empty name shakes the field and keeps it open until it is filled — `Drawer.Body`, `Drawer.Footer`, `error`. |

## Mistakes
- A delete confirmation in a Drawer → use Modal.
- Expecting Enter to submit via `Drawer.Confirm` → Drawer has no Confirm; use a `<form>` with a submit button.
- `side="top"` → only `left`, `right` and `bottom`.
- Swipe as the only way to close → keep `Drawer.Header` with its close button (or `Drawer.Close`); a swipe is an extra gesture.
- Padding on a wrapper inside Body → Body already pads and scrolls.

## Related
- **Built from:** Button, Icon, ScrollContainer
- **See also:** [Modal](../modal/COMPONENT.md), [Sidebar](../../layout/sidebar/COMPONENT.md), [Popover](../popover/COMPONENT.md)
