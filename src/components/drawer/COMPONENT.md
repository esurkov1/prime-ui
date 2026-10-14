# Drawer

**Category:** overlays
**Kind:** overlay

> A modal panel that slides in from the side: filters, forms and record details without leaving the page.

## When to use
- Editing settings or a record without leaving the page.
- Filters or navigation on narrow screens (`side="left"`).
- Read-only details of a list row (order, user, event), with its status and a ⋯ menu in the header (`Drawer.Actions`).
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
   ├─ Drawer.Header            grid: [Icon] [Title + Description] [Actions] [close Button]
   │  ├─ Drawer.Icon           tone tile around an Icon, or an Avatar.Root / Thumbnail.Root with no tile
   │  ├─ Drawer.Title          <h2>
   │  ├─ Drawer.Description    <p>
   │  └─ Drawer.Actions        row of tier-s controls before the close button
   ├─ Drawer.Body              the only scrolling zone (ScrollContainer)
   └─ Drawer.Footer            always: Close or Cancel + the main action, primary last
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
| `closeOnOutsideClick` | `boolean` | `true` | A click on the scrim closes the dialog; turn off for destructive confirms. |
| `labels` | `Partial<DrawerLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | Trigger and Content. |

### Drawer.Content
`ref` → `HTMLDivElement` (the dialog panel). Portal + scrim + `role="dialog"` panel at the edge; renders while open and during its exit animation, showing the children it had open (a record cleared with `open` does not empty the panel mid-motion).

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
`ref` → `HTMLElement`. Renders `<header>`: [Icon] [Title + Description] [Actions] [close button]. + native `HTMLAttributes<HTMLElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `showClose` | `boolean` | `true` | Built-in square ghost `s` close button named by `labels.close`; disabled in place while a `Guard` is `busy`. |
| `children` | `ReactNode` | — | Icon, Title, Description, Actions in any order; each goes to its column. A `Tabs.List` (with `Tabs.Root` around header and body) turns the header into a tab strip. |

### Drawer.Actions
`ref` → `HTMLDivElement`. A row of controls at the end of the header, before the close button: a status Badge, a ⋯ Dropdown, an icon button. Controls inside take tier `s`. + native `<div>` props.

### Drawer.Icon
`ref` → `HTMLSpanElement`. An `aria-hidden` 40 px tile with a tone fill; around an `Avatar.Root` or a `Thumbnail.Root` (the record's picture) no tile — `data-media`, the avatar sized to 40 px.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"neutral"` | Soft fill and icon color; not used around a picture. |
| `children` | `ReactNode` | — (required) | An icon glyph (sized to the m icon), or the record's picture: an `Avatar.Root` (sized to the tile) or a `Thumbnail.Root`. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other attributes of the tile. |

### Drawer.Title · Drawer.Description
`ref` → `HTMLHeadingElement` / `HTMLParagraphElement`. `<h2>` (title-m) / `<p>` (body-s, muted); their ids name and describe the dialog. + native props except `id`.

### Drawer.Body
`ref` → `HTMLDivElement`. The only scrolling zone (a ScrollContainer), 16 gap between blocks. + native `<div>` props.

### Drawer.Footer
`ref` → `HTMLElement`. Renders `<footer>` with the actions, primary last, and an optional `Meta` at the start. + native `HTMLAttributes<HTMLElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `layout` | `"fill" \| "end"` | `"end"` | `fill`: equal-width buttons in one row; `end`: auto width, at the end. Stacked on phones (viewport below 640 px) and in a dialog narrower than 360 px. |

### Drawer.Meta
`ref` → `HTMLParagraphElement`. A `<p>` at the start of the footer: short muted status text («Есть несохранённые изменения»); the buttons keep their width at the end. Not part of the dialog description. + native `<p>` props.

### Drawer.Guard
No DOM, no ref. Holds the dialog from anywhere inside Content, where the form state lives; renders only the built-in «discard changes?» confirm. Closing from code is never held.

| Prop | Type | Default | Description |
|---|---|---|---|
| `busy` | `boolean` | `false` | A request runs: Escape, a press outside, the close button and `Close` do nothing; the close button and the `Close` child stay in place, disabled. |
| `dirty` | `boolean` | `false` | Unsaved changes: any of those dismisses first asks «Не сохранять изменения?» (a ConfirmDialog with `labels.discard*`); confirming closes the dialog. |

### Drawer.Trigger · Drawer.Close
No DOM: clone the single child and chain its `onClick` (unless the child's handler calls `preventDefault()`). `Close` goes through a `Guard` and makes its child `disabled` while the guard is busy.

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
`neutral` (default) · `accent` · `success` · `warning` · `danger` · `info` — soft tile fill and icon color, as in Modal. Around the record's picture — an `Avatar.Root` or a `Thumbnail.Root` (found by element type) — there is no tile and no tone: `data-media`, the avatar sized to 40 px, so a person's or an object's card shows its picture in the header.

## States
| State | Driven by | DOM |
|---|---|---|
| open / closed | `open` / `defaultOpen` / `onOpenChange` | `data-state` on the scrim and the panel; mounted until the slide-out ends |
| side / size | Content props | `data-side`, `data-size` on the panel |
| open: trapped | while open | focus trapped, page scroll locked, siblings of the portal `inert` (the toast region stays usable); a drawer opened from a Modal or another drawer stacks above it |
| closing | `open` turns false | the panel keeps showing the children it had open while it slides out |
| busy | `Drawer.Guard busy` | Escape, the scrim, the close button and `Drawer.Close` do nothing; the close button and the `Close` child are `disabled` in place |
| dirty | `Drawer.Guard dirty` | a dismiss opens the «Не сохранять изменения?» ConfirmDialog (`labels.discard*`); its confirm closes the drawer |

Motion: the scrim fades, the panel slides from its side over `slow` and leaves over `base` (`overlayMotion`); under `prefers-reduced-motion` it unmounts at once. The drawer has no touch gestures: it is not dragged or swiped away — it closes by its buttons, Escape and the scrim, with the same slide-out.

## Layout & spacing
- A drawer has three zones: `Drawer.Header` (title, the × close button), `Drawer.Body` (the content, the only zone that scrolls) and `Drawer.Footer` (the actions). The footer is not optional decoration — it is where the drawer is finished:
  - read-only details: `Drawer.Close` around `<Button.Root variant="outline" tone="neutral">Закрыть</Button.Root>`, plus the record's main action (solid, last) when it has one;
  - a form: «Отмена» (`Drawer.Close`, outline neutral) and the submit button (solid, last; `type="submit" form={formId}`), `Drawer.Meta` for «Есть несохранённые изменения»;
  - one acknowledgement: `<Drawer.Footer layout="fill">`.
  Both the header × and the footer button stay: the × is the quick way out at the top, the footer is the end of the reading or editing path, where the hand already is.
- Zone padding `--prime-drawer-padding`; hairlines between header, body and footer.
- Full viewport height; only the body scrolls, with its own side padding.
- Tabs in the header: a `Tabs.List` inside `Drawer.Header` (with `Tabs.Root` around the header and the body) spans the header's last row. The header becomes the tab strip, edge to edge and without the hairline; the active tab is the body rising into it, the panels sit in the body.
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
- No swipe: the close button, `Drawer.Close`, Escape and the scrim are the ways out.
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
| [overview.tsx](examples/overview.tsx) | Order details next to the list: the three zones of every drawer — a header with a close button, a read-only body and a footer with Close and the main action — `Drawer.Trigger`, `Drawer.Body`, `Drawer.Footer`. |
| [structure.tsx](examples/structure.tsx) | Optional parts: an icon tile in the header and one full-width action in the footer — `Drawer.Icon`, `Drawer.Footer`, `layout`. |
| [sizes.tsx](examples/sizes.tsx) | Every panel width, 360 to 800 px; below 640 px of viewport the panel takes the full width — `size`. |
| [placement.tsx](examples/placement.tsx) | The panel slides from the right for details and from the left for filters, rounded only on the edge facing the page — `side`. |
| [header-actions.tsx](examples/header-actions.tsx) | A record card: its status and a ⋯ menu sit in the header before the close button, one tier smaller — `Drawer.Actions`. |
| [client-card.tsx](examples/client-card.tsx) | A client card from the list: the contact's avatar heads the panel in place of an icon tile, then the details — `Drawer.Icon`, `Avatar.Root`. |
| [guard.tsx](examples/guard.tsx) | A form that holds the drawer from inside: after an edit Escape, the scrim and Cancel ask before discarding, the footer says so, and saving locks every way out — `Drawer.Guard`, `Drawer.Meta`. |
| [long-content.tsx](examples/long-content.tsx) | A long body scrolls on its own while the header and the footer stay in place — `Drawer.Body`. |
| [dismiss.tsx](examples/dismiss.tsx) | An import closes only from its buttons, and not at all while it runs — `closeOnOutsideClick`, `closeOnEscape`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent owns the state and opens the drawer from a link, without a trigger — `open`, `onOpenChange`. |
| [in-form.tsx](examples/in-form.tsx) | A settings form in the panel: the footer button submits the form and an empty name shakes the field and keeps it open until it is filled — `Drawer.Body`, `Drawer.Footer`, `error`. |
| [screen.tsx](examples/screen.tsx) | A create form in a Drawer: grouped fields, errors on submit with focus on the first invalid field, a loading submit, a toast and the new row in the list — `Drawer.Guard`, `busy`, `dirty`. |

## Mistakes
- A drawer without `Drawer.Footer` → add one: «Закрыть» for details, «Отмена» + the submit button for a form. The header × alone is not the end of the panel.
- Save or Cancel buttons at the end of the body, or in the header → they go in `Drawer.Footer`, which stays in place while the body scrolls.
- A delete confirmation in a Drawer → use ConfirmDialog.
- Busy or unsaved state lifted out of the form into Root props → put `Drawer.Guard` next to the form, inside Content.
- Clearing the record together with `open` and rendering a skeleton for «no record» → not needed: the panel keeps its last content while it slides out.
- A Badge or a menu as a custom child of the header text column → put them in `Drawer.Actions`.
- Expecting Enter to submit via `Drawer.Confirm` → Drawer has no Confirm; use a `<form>` with a submit button.
- `side="top"` or `side="bottom"` → only `left` and `right`; a panel from the bottom edge is a [Sheet](../sheet/COMPONENT.md).
- Expecting a swipe to close a drawer → it has none; keep the header × and a footer button. A panel that swipes away is a [Sheet](../sheet/COMPONENT.md).
- Padding on a wrapper inside Body → Body already pads and scrolls.

## Related
- **Built from:** [Button](../button/COMPONENT.md) (close button), [ScrollContainer](../scroll-container/COMPONENT.md) (`Drawer.Body`), [ConfirmDialog](../confirm-dialog/COMPONENT.md) (the `Drawer.Guard` discard confirm), `Icon` (the close glyph)
- **See also:** [Modal](../modal/COMPONENT.md) (the same header, body, footer and `Guard` in the centre), [Sheet](../sheet/COMPONENT.md) (the same parts raised from the bottom edge for a short task), [ConfirmDialog](../confirm-dialog/COMPONENT.md) (a destructive confirm), [Sidebar](../../layout/sidebar/COMPONENT.md), [Popover](../popover/COMPONENT.md), [Avatar](../avatar/COMPONENT.md) (a person's picture in `Drawer.Icon`)
