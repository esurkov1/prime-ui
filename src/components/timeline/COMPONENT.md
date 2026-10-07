# Timeline

**Category:** data-display
**Kind:** composite

> An event feed: dots on a thin line, event title and date, an optional amount on the right, grouped under labels.

## When to use
- Activity or operation history with dates and amounts (payments, rentals, orders).
- Maintenance / audit history with intervals between events (`Timeline.Gap`).
- A list of events where a row opens details (`onClick`, `href`, `asChild`).

## When not to use
- Steps of a process the user goes through → use [Stepper](../stepper/COMPONENT.md).
- Records with many attributes to compare or sort → use [DataTable](../data-table/COMPONENT.md).
- Transient system messages → use [Notification](../notification/COMPONENT.md).

## Import
```tsx
import { Timeline } from "prime-ui-kit";
```

## Anatomy
```
Timeline.Root                    size container, sets the tier
└─ Timeline.Group label          labelled <ol>; the line runs from its first dot to its last
   ├─ Timeline.Item              <li> + row (div | button | a | asChild element) with the dot
   │  ├─ Timeline.Title          first line
   │  ├─ Timeline.Meta           second line (date)
   │  │  └─ Timeline.MetaPrimary emphasized part
   │  └─ Timeline.Value          trailing amount
   │     └─ Timeline.ValueMeta   second line under the amount
   └─ Timeline.Gap               <li>: interval between events (dashed segment, hollow dot)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Timeline.Root
`ref` → `HTMLDivElement`. A size container that sets the tier for every group and row.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Text, dot and row rhythm: rows 40 · 52 · 64 · 68 · 76 px. |
| `highlight` | `"current" \| "hover"` | `"current"` | Who gets the highlighted look (pill, accent title and dot): the `current` row, or the row under the pointer / keyboard focus. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `children` (`Timeline.Group`), `className` and the other div attributes. |

### Timeline.Group
`ref` → `HTMLOListElement`. A labelled `<ol>` of events; the line runs from its first dot to its last.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Group heading («Недавно»); names the list via `aria-labelledby`. |
| `…rest` | `Omit<OlHTMLAttributes<HTMLOListElement>, "children">` | — | `children` (`Timeline.Item`, `Timeline.Gap`), `className` and the other ol attributes. |

### Timeline.Item
`ref` → the row element. An `<li>` with a row: `<div>`, `<button>` (`onClick`), `<a>` (`href`) or your element (`asChild`); the dot is prepended.

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"blue"` | Decorative dot hue for categories, at reduced emphasis. |
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | — | Status dot color at full emphasis; wins over `color`. |
| `current` | `boolean` | `false` | The current row (open detail, latest event): `aria-current`, `data-state="active"`; highlighted in `highlight="current"`. |
| `onClick` | `MouseEventHandler<HTMLElement>` | — | Renders the row as a `<button>`. |
| `href` | `string` | — | Renders the row as a link (with `target`, `rel`, `download`). |
| `asChild` | `boolean` | `false` | Renders the row as the single child element (a router link). |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "children" \| "color" \| "onClick">` | — | `children` (Title, Meta, Value), `className` and the other row attributes. |

### Timeline.Title · Timeline.Meta · Timeline.MetaPrimary
`<span>` lines: the event (medium, accent on the highlighted row, wraps), the muted date line with tabular numbers, and its emphasized part.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

### Timeline.Value · Timeline.ValueMeta
`<span>`: the trailing amount (right-aligned, tabular) and a muted second line under it. Moves under the meta below 20rem.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"neutral"` | Value: text color (income `success`, refund `danger`). |
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

### Timeline.Gap
`ref` → `HTMLDivElement`. An `<li>` interval between events: a shorter row with a hollow dot on a dashed segment and a muted caption.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"neutral"` | Caption and dot color; `warning` / `danger` flag a long interval. |
| `trailing` | `ReactNode` | — | A caption on the right («сейчас»). |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `children` (the interval caption), `className` and the other div attributes. |

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | rows 40, title 12/16, dot 8 | very dense side panels | |
| `s` | rows 52, title 13/20 | side panels, drawers | |
| `m` | rows 64, title 14/20, dot 10 | page content and cards | yes |
| `l` · `xl` | rows 68 / 76, title 16/24, dot 12 | spacious feeds, detail pages | |

### highlight
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `current` | the `current` row has a `fill-subtle-active` pill, accent title and dot; interactive rows get a faint hover | a row opens a detail view and stays open | yes |
| `hover` | the row under the pointer or keyboard focus gets the pill, transiently | rows are links that open a page | |

### color (Item)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `blue` | blue dot at reduced emphasis | default category | yes |
| `gray` · `green` · `orange` · `red` · `yellow` · `purple` · `sky` · `pink` · `teal` | dot in the hue | categories | |

### tone (Item · Value · Gap)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | muted dot / primary value / muted gap caption | a status without meaning | Value, Gap |
| `accent` | accent | a pending action | |
| `success` | success | paid, income | |
| `warning` | warning | overdue, a too-long interval | |
| `danger` | danger | refund, failure | |
| `info` | info | informational events | |

On an Item `tone` wins over `color` and shows at full emphasis.

## States
| State | Driven by | DOM |
|---|---|---|
| tier / highlight | `size`, `highlight` | `data-size`, `data-highlight` on the root |
| current | `current` | `data-state="active"` on the `<li>` and the row, `aria-current="true"` |
| dot color | `color` / `tone` | `data-color` (without a tone) or `data-tone` |
| interactive | `onClick`, `href`, `asChild` | `data-interactive`; `fill-subtle` hover, inset focus ring |

Timeline keeps no state: the parent owns `current`.

## Layout & spacing
- The root is a size container: give it a definite width (`width: min(100%, 30rem)`).
- Row grid: dot column · text · value; below 20rem of root width the value moves under the meta line.
- Rows touch so the line is continuous; group → group `--prime-space-4`.
- Inside a Card put it in `Card.Body`; the card owns the padding.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Interactive rows are one Tab stop each; the focus ring is drawn inside the row. |
| `Enter` · `Space` | Activates a button row; Enter opens a link row. |

### ARIA
- Each group is an `<ol>` labelled by its heading (`aria-labelledby`); events are `<li>`.
- The dot is `aria-hidden`: put the status into the title or meta, not only the dot color.
- `current` sets `aria-current="true"`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | An operations feed: one labelled group, a line through the dots and the current row highlighted — `Timeline.Group`, `current`. |
| [variants.tsx](examples/variants.tsx) | Dot hues for categories at reduced emphasis, and status tones on items, values and gaps at full emphasis — `color`, `tone`. |
| [sizes.tsx](examples/sizes.tsx) | Every tier scales text, dot and row rhythm, rows 40 to 76 px — `size`. |
| [structure.tsx](examples/structure.tsx) | A service history with intervals between events, a caption on the right of a gap and a second value line — `Timeline.Gap`, `trailing`, `Timeline.ValueMeta`. |
| [selectable.tsx](examples/selectable.tsx) | Rows with a click handler become buttons that open a detail view; the open row stays current — `onClick`, `current`. |
| [hover-highlight.tsx](examples/hover-highlight.tsx) | Link rows highlighted only under the pointer or keyboard focus, with no persistent current row — `highlight`, `href`. |
| [narrow.tsx](examples/narrow.tsx) | At 375 px the title wraps and the amount stays right; below 20rem of its own width the amount moves under the meta line. |

## Mistakes
- `Timeline.Item` outside `Timeline.Group` → items are `<li>`; always wrap them in a group.
- A process with steps → use Stepper.
- Status only by dot color → put it in the title or meta too.
- `<div onClick>` inside an item → pass `onClick` to `Timeline.Item` (native button, focus ring).
- `Timeline.Root` in a shrink-wrapped flex parent → give it a width.
- More than one `current` row, or `highlight="hover"` with click selection → the selection becomes invisible.

## Related
- **Built from:** —
- **See also:** [Stepper](../stepper/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [Card](../card/COMPONENT.md)
