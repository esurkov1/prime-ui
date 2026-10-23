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
- Work with a start and an end laid out on a calendar (tasks, bookings, occupancy) → use [Gantt](../gantt/COMPONENT.md).

## Import
```tsx
import { Timeline } from "prime-ui-kit";
```

## Anatomy
```
Timeline.Root                    size container, sets the tier (size, else the host tier)
└─ Timeline.Group label          labelled <ol role="list">; the line runs from its first dot to its last
   ├─ Timeline.Item              <li> + row (div | button | a | asChild element) with the dot
   │  ├─ Timeline.ItemTitle      first line, truncates
   │  ├─ Timeline.ItemBadges     badges after the title, on its line (a Badge.Group, «+N» on overflow)
   │  ├─ Timeline.ItemMeta       second line (date); <strong> emphasizes a part; a StatusDot first, then «·»; repeats, lines stack
   │  └─ Timeline.ItemValue      trailing amount
   │     └─ Timeline.ItemMeta    second line under the amount
   └─ Timeline.Gap               <li>: interval between events (dashed segment, hollow dot)
      └─ Timeline.Description    caption on the right («сейчас»)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Timeline.Root
`ref` → `HTMLDivElement`. A size container that sets the tier for every group and row.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Text, dot and row rhythm: rows 40 · 52 · 64 · 68 · 76 px, dot column → text 8 · 12 · 16 · 16 · 20 px. Without it the tier of its host, else `m`. |
| `children` | `ReactNode` | — (required) | The `Timeline.Group`s. |
| `className` | `string` | — | Class on the element. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | The other div attributes. |

### Timeline.Group
`ref` → `HTMLOListElement`. A labelled `<ol>` of events; the line runs from its first dot to its last.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Group heading («Недавно»); names the list via `aria-labelledby`. |
| `children` | `ReactNode` | — (required) | `Timeline.Item` and `Timeline.Gap` rows. |
| `className` | `string` | — | Class on the element. |
| `…rest` | `Omit<OlHTMLAttributes<HTMLOListElement>, "children">` | — | The other ol attributes. |

### Timeline.Item
`ref` → the row element. An `<li>` with a row: `<div>`, `<button>` (`onClick`), `<a>` (`href`) or your element (`asChild`); the dot is prepended. The row is the kit's list row: hover, press, keyboard focus and `aria-current` are its fills.

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"blue"` | Decorative dot hue for categories, at reduced emphasis. |
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | — | Status dot color at full emphasis; wins over `color`. |
| `onClick` | `MouseEventHandler<HTMLElement>` | — | Renders the row as a `<button>`. |
| `href` | `string` | — | Renders the row as a link (with `target`, `rel`, `download`). |
| `asChild` | `boolean` | `false` | Renders the row as the single child element (a router link). |
| `children` | `ReactNode` | — (required) | `Timeline.ItemTitle`, `Timeline.ItemMeta`, `Timeline.ItemValue`. |
| `className` | `string` | — | Class on the element. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "children" \| "color" \| "onClick">` | — | The other row attributes (`target`, `rel`, `download` with `href`). |

### Timeline.ItemTitle · Timeline.ItemMeta
`ref` → `HTMLSpanElement`. `<span>` lines, one line each, cut with an ellipsis: the event (medium) and the muted secondary line, tabular; a `StatusDot` first states the state. Inside `Timeline.ItemValue` the meta is the value's second line.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The text of the line. |
| `className` | `string` | — | Class on the element. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | The other span attributes. |

### Timeline.ItemBadges
`ref` → `HTMLDivElement`. A `Badge.Group` after the title, on its line: every badge of the event, the meaning in its `tone` or `color`. The title gives way first; what does not fit folds into «+N».

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | The `Badge.Root`s of the event (a status, a kind). |
| `labels` | `Partial<BadgeGroupLabels>` | — | Built-in strings of the «+N» badge, see the `Badge.Group` labels. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other `div` attributes. |

### Timeline.ItemValue
`ref` → `HTMLSpanElement`. A `<span>` with the trailing amount (right-aligned, tabular), a `Timeline.ItemMeta` inside under it. Moves under the meta below 20rem.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"neutral"` | Text color (income `success`, refund `danger`). |
| `children` | `ReactNode` | — (required) | The amount. |
| `className` | `string` | — | Class on the element. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | The other span attributes. |

### Timeline.Gap
`ref` → `HTMLDivElement`. An `<li>` interval between events: a shorter row with a hollow dot on a dashed segment and a muted caption.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"neutral"` | Caption and dot color; `warning` / `danger` flag a long interval. |
| `children` | `ReactNode` | — (required) | The interval caption and an optional `Timeline.Description`. |
| `className` | `string` | — | Class on the element. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | The other div attributes. |

### Timeline.Description
`ref` → `HTMLSpanElement`. The secondary caption of a gap, at its end («сейчас»), in the gap tone.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | rows 40, title 12/16, dot 8, dot column → text 8 | very dense side panels | |
| `s` | rows 52, title 13/20, dot column → text 12 | side panels, drawers | |
| `m` | rows 64, title 14/20, dot 10, dot column → text 16 | page content and cards | yes |
| `l` · `xl` | rows 68 / 76, title 16/24, dot 12, dot column → text 16 / 20 | spacious feeds, detail pages | |

### color (Item)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `blue` | blue dot at reduced emphasis | default category | yes |
| `gray` · `green` · `orange` · `red` · `yellow` · `purple` · `sky` · `pink` · `teal` | dot in the hue | categories | |

### tone (Item · ItemValue · Gap)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | muted dot / primary value / muted gap caption | a status without meaning | ItemValue, Gap |
| `accent` | accent | a pending action | |
| `success` | success | paid, income | |
| `warning` | warning | overdue, a too-long interval | |
| `danger` | danger | refund, failure | |
| `info` | info | informational events | |

On an Item `tone` wins over `color` and shows at full emphasis.

## States
| State | Driven by | DOM |
|---|---|---|
| tier | `size` | `data-size` on the root |
| highlighted | pointer over an interactive row | `:hover` in `@media (hover: hover)`: the list row's `fill-subtle` |
| pressed | pointer or key down on an interactive row | the list row's `fill-subtle-active` |
| current | `aria-current="page"` or `"true"` on the row | `data-current`: the list row's `fill-muted-hover` |
| dot color | `color` / `tone` | `data-color` (without a tone) or `data-tone` |
| interactive | `onClick`, `href`, `asChild` | `data-interactive`; pointer cursor, inset focus ring, the touch row height (`touchTargetRowClass`) |

Timeline keeps no state and has no persistent selection.

## Layout & spacing
- The root is a size container: give it a definite width (`width: min(100%, 30rem)`).
- An event is the kit's list row (`internal/listRow`): control height without a date line (28 · 32 · 36 · 40 · 48), two lines with one (44 · 48 · 56 · 60 · 68), radius and side padding of the tier, 2px between rows. The dot stands in the mark's icon-wide column; below 20rem of root width the value moves under the date line.
- The line runs through the 2px between rows, so it is continuous; group → group `--prime-space-4`.
- Inside a Card put it in `Card.Body`; the card owns the padding.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Interactive rows are one Tab stop each; the focus ring is drawn inside the row. |
| `Enter` · `Space` | Activates a button row; Enter opens a link row. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- Each group is an `<ol role="list">` labelled by its heading (`aria-labelledby`); events are `<li>`. The role keeps the list semantics that WebKit drops under `list-style: none`.
- The dot is `aria-hidden`: put the status into the title or meta, not only the dot color.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

#### Timeline.ItemBadges

| Key | Default | Used for |
|---|---|---|
| `more` | `"+{count}"` | Visible text of the «+N» badge for the badges that did not fit; `{count}` — how many. |
| `moreCount` | `"Ещё {count}"` | What assistive tech reads for that badge instead of its visible text; `{count}` — how many. The values themselves come in its tooltip. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | An operations feed: one labelled group, a line through the dots, the row under the pointer highlighted — `Timeline.Group`, `Timeline.ItemValue`. |
| [variants.tsx](examples/variants.tsx) | Dot hues for categories at reduced emphasis, and status tones on items, values and gaps at full emphasis — `color`, `tone`. |
| [sizes.tsx](examples/sizes.tsx) | Every tier scales text, dot and row rhythm, rows 40 to 76 px — `size`. |
| [structure.tsx](examples/structure.tsx) | A service history with intervals between events, a caption on the right of a gap, two meta lines under a repair, a badge after its title with a state in the meta, and a second value line — `Timeline.Gap`, `Timeline.Description`, `Timeline.ItemMeta`, `Timeline.ItemBadges`, `StatusDot`. |
| [links.tsx](examples/links.tsx) | Rows that open something: an operation page by a link or by your router link through the slot, a receipt in place by a button; one Tab stop each with a focus ring — `href`, `asChild`, `onClick`. |
| [narrow.tsx](examples/narrow.tsx) | At 375 px the title wraps and the amount stays right; below 20rem of its own width the amount moves under the meta line — `Timeline.ItemValue`. |

## Mistakes
- `Timeline.Item` outside `Timeline.Group` → items are `<li>`; always wrap them in a group.
- A process with steps → use Stepper.
- Status only by dot color → put it in the title or meta too.
- `<div onClick>` inside an item → pass `onClick` to `Timeline.Item` (native button, focus ring).
- `Timeline.Root` in a shrink-wrapped flex parent → give it a width.
- Using the timeline to pick a row (a selected / current state) → it has none; use a list with selection (`Select`, `DataTable` row selection) or `Tabs`.

## Related
- **Built from:** `internal/listRow` (the row; it sizes an [Avatar](../avatar/COMPONENT.md), a [ProgressCircle](../progress-circle/COMPONENT.md) and a [Thumbnail](../thumbnail/COMPONENT.md) in the mark), [Badge](../badge/COMPONENT.md) (`Timeline.ItemBadges`), [StatusDot](../status-dot/COMPONENT.md) (the state first in `Timeline.ItemMeta`)
- **See also:** [Stepper](../stepper/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [Gantt](../gantt/COMPONENT.md), [Card](../card/COMPONENT.md)
