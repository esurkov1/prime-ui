# VisuallyHidden

**Category:** status
**Kind:** primitive

> Text that screen readers read and nobody sees: the words behind an icon, a badge or a change on the screen.

## When to use
- A count or a status the layout shows by position or colour, said in words («: три счёта ждут оплаты»).
- An announcement after an action that changes no visible text: `role="status"` + `aria-live="polite"`, the message set after the action.
- A description for `aria-describedby` that sighted users read elsewhere on the screen.

## When not to use
- The name of an icon-only button → `aria-label` on the button.
- A meaningful icon → `Icon` with `label`.
- A message that sighted users need too → a [Notification](../notification/COMPONENT.md), a [Banner](../banner/COMPONENT.md) or a field `hint` / `error`.
- Kit components that already announce their own changes (Notification, field errors, Select loading, TagSelect selection) → nothing to add.

## Import
```tsx
import { VisuallyHidden } from "prime-ui-kit";
```

## Anatomy
```
VisuallyHidden    <span>: out of sight (1px, clipped), pinned to its containing block, still in the accessibility tree
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### VisuallyHidden
`ref` → `HTMLSpanElement`. A `<span>` that is out of sight and still read by screen readers (the sr-only recipe, pinned so it never stretches a scrolling column).

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | The text to read. |
| `live` | `"polite" \| "assertive"` | — | An announcement region, read as a whole on every change: `polite` — `role="status"`, `assertive` — `role="alert"` (urgent only). |
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `id` (to point `aria-describedby` at it), `className` and the other span attributes. |

## Variants
One look: none. It renders no pixels and takes no room.

## States
| State | Driven by | DOM |
|---|---|---|
| hidden text | children | a clipped `<span>` |
| live region | `live="polite"` (`"assertive"` for an urgent one) | `role="status"` (`"alert"`), `aria-live`, `aria-atomic`: read as a whole when its text changes; mount it empty first, then set the message |

## Layout & spacing
- Takes no room and never scrolls its column: it is pinned to the start of the nearest positioned ancestor.
- Put it next to what it explains, inside the same element when it completes that element's name.

## Accessibility

### Keyboard
No keyboard interaction.

### ARIA
- The text stays in the accessibility tree: it joins the accessible name of the element around it.
- With `live="polite"` it is a polite live region (`role="status"`), with `live="assertive"` an alert (`role="alert"`) for what cannot wait; keep it mounted and change its text — a region mounted together with its message is often not read.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A count that sighted users read from the layout, said in words to screen readers, and a polite announcement after an action — `VisuallyHidden`, `live`. |
| [assertive.tsx](examples/assertive.tsx) | A failed save shown by a badge on screen and announced at once, interrupting the screen reader — `live`. |

## Mistakes
- `display: none` or `hidden` for screen-reader text → both remove it from the accessibility tree.
- A live region mounted with its first message → mount it empty, then set the text.
- `role="status"` and `aria-live` written by hand → `live="polite"` sets them together, atomic.
- `live="assertive"` for a routine result («Сохранено») → it interrupts the reader; keep it for errors that block.
- VisuallyHidden as the only name of a button that has `aria-label` → the `aria-label` wins; use one of them.
- Hidden text that repeats the visible label → screen readers read it twice.

## Related
- **Built from:** —
- **See also:** [Notification](../notification/COMPONENT.md), [Tooltip](../tooltip/COMPONENT.md); kit components that speak through it: [Select](../select/COMPONENT.md) (loading announcement), [TagSelect](../tag-select/COMPONENT.md) (hidden-tag count, announcements), [Datepicker](../datepicker/COMPONENT.md) (month title), [Button](../button/COMPONENT.md), [Input](../input/COMPONENT.md), [Pagination](../pagination/COMPONENT.md), [Breadcrumb](../breadcrumb/COMPONENT.md), [Spinner](../spinner/COMPONENT.md), [ProgressBar](../progress-bar/COMPONENT.md), [ProgressCircle](../progress-circle/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [FileUpload](../file-upload/COMPONENT.md)
