# Drawer

**Category:** overlays
**Kind:** overlay

> A modal side panel that slides in from the edge: filters, forms and record details.

## When to use
- Editing settings or a record without leaving the page.
- Filters or navigation on narrow screens (`side="left"`).
- Read-only details of a list row (order, user, event).
- Long content (history, logs) that needs a tall scrolling area.

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
| `closeOnOutsideClick` | `boolean` | `true` | A click on the scrim closes the dialog; turn off for destructive confirms. |
| `labels` | `Partial<DrawerLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | Trigger and Content. |

### Drawer.Content
`ref` → `HTMLDivElement` (the dialog panel). Portal + scrim + `role="dialog"` panel at the edge; renders while open and during its exit animation.

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"left" \| "right"` | `"right"` | Edge the panel slides from; rounded only on the edge facing the page. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Width: 360 · 480 · 640 · 800. Below 640 px of viewport — full width, square corners. |
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

### size (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `s` | 360 wide | details, short help | |
| `m` | 480 wide | settings forms | yes |
| `l` | 640 wide | wide forms | |
| `xl` | 800 wide | tables, previews | |

Below 640px of viewport every size is full width with square corners.

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
| open: trapped | while open | focus trapped, page scroll locked, siblings of the portal `inert` (the toast region stays usable); a drawer opened from a Modal or another drawer stacks above it |

Motion: the scrim fades, the panel slides from its side over `slow` and leaves over `base` (`overlayMotion`); under `prefers-reduced-motion` it unmounts at once.

## Layout & spacing
- Zone padding `--prime-drawer-padding`; hairlines between header, body and footer.
- Full viewport height; only the body scrolls, with its own side padding.
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
| [placement.tsx](examples/placement.tsx) | The panel slides from the right for details and from the left for filters — `side`. |
| [long-content.tsx](examples/long-content.tsx) | A long body scrolls on its own while the header and the footer stay in place — `Drawer.Body`. |
| [dismiss.tsx](examples/dismiss.tsx) | An import closes only from its buttons, and not at all while it runs — `closeOnOutsideClick`, `closeOnEscape`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent owns the state and opens the drawer from a link, without a trigger — `open`, `onOpenChange`. |
| [in-form.tsx](examples/in-form.tsx) | A settings form in the panel: the footer button submits the form and an empty name keeps it open — `Drawer.Body`, `Drawer.Footer`, `error`. |

## Mistakes
- A delete confirmation in a Drawer → use Modal.
- Expecting Enter to submit via `Drawer.Confirm` → Drawer has no Confirm; use a `<form>` with a submit button.
- `side="top"` / `"bottom"` → only `left` and `right`.
- Padding on a wrapper inside Body → Body already pads and scrolls.

## Related
- **Built from:** Button, Icon, ScrollContainer
- **See also:** [Modal](../modal/COMPONENT.md), [Sidebar](../../layout/sidebar/COMPONENT.md), [Popover](../popover/COMPONENT.md)
