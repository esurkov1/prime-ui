# Timeline

**Category:** data-display

> An event feed: dots on a thin line, event title and date, an optional amount on the right, grouped under labels.

## When to use
- Activity or operation history with dates and amounts (payments, rentals, orders).
- Maintenance / audit history with intervals between events (`Timeline.Gap`).
- A selectable list of events where the row opens details (`onClick`, `href`, `asChild`).

## When not to use
- Steps of a process the user goes through → use [Stepper](../stepper/COMPONENT.md).
- Records with many attributes to compare or sort → use [DataTable](../data-table/COMPONENT.md).
- A short list of recent events inside a dashboard card without a line → `Card variant="list"` from [Card](../card/COMPONENT.md).
- Transient system messages → use [Notification](../notification/COMPONENT.md).

## Import
```tsx
import { Timeline } from "prime-ui-kit";
```

## Anatomy
```
Timeline.Root                    size container, sets the tier
└── Timeline.Group label         labelled <ol>; the line runs from its first dot to its last
    ├── Timeline.Item            <li> + row (div | button | a | asChild element) with the dot
    │   ├── Timeline.Title       first line
    │   ├── Timeline.Meta        second line (date, relative time)
    │   │   └── Timeline.MetaPrimary   emphasized part (or <strong>)
    │   └── Timeline.Value       trailing amount
    │       └── Timeline.ValueMeta     second line under the amount
    └── Timeline.Gap             <li>: interval between events (dashed segment, hollow dot)
```

## API

### Timeline.Root
`<div>`. Forwards `ref`. Provides `size` to nested controls.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of text, dots and row rhythm. |
| `highlight` | `"selected" \| "hover"` | `"selected"` | Who gets the highlighted look: the `active` row, or the row under the pointer / with keyboard focus. |
| `children` | `ReactNode` | — (required) | `Timeline.Group` elements. |
| `className` | `string` | — | Extra class. |

+ native `<div>` props except `children`.

### Timeline.Group
Renders `<div>` (label) + `<ol>`. Forwards `ref` to the `<ol>`; native props go to the `<ol>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Group heading; labels the list via `aria-labelledby`. |
| `children` | `ReactNode` | — (required) | `Timeline.Item` and `Timeline.Gap`. |
| `className` | `string` | — | Class on the `<ol>`. |

+ native `<ol>` props except `children`.

### Timeline.Item
Renders `<li>` with a row element. Forwards `ref` to the row (`<div>`, `<button>`, `<a>` or the `asChild` element).

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `PaletteColor` (`"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"`) | `"blue"` | Decorative dot hue at reduced emphasis (55%). Ignored when `tone` is set. |
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | — | Status dot color at full emphasis; wins over `color`. |
| `active` | `boolean` | `false` | Highlighted / selected row: `data-state="active"`, `aria-current="true"`. |
| `href` | `string` | — | Renders the row as `<a>`. |
| `asChild` | `boolean` | `false` | Renders the row as the single child element (router link); the dot is prepended to its children. |
| `onClick` | `React.MouseEventHandler<HTMLElement>` | — | Renders the row as `<button type="button">` (unless `href` / `asChild`). |
| `target` / `rel` / `download` | anchor attributes | — | Passed to the row (for `href`). |
| `children` | `ReactNode` | — (required) | `Timeline.Title`, `Timeline.Meta`, `Timeline.Value`. |
| `className` | `string` | — | Class on the row. |

+ native HTML props of the row except `children`, `color`, `onClick`.

### Timeline.Title
`<span>`. No ref forwarding.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Event text; weight 500, wraps when narrow. |
| `className` | `string` | — | Extra class. |

+ native `<span>` props except `children`.

### Timeline.Meta
`<span>`. No ref forwarding.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Date and relative time; muted, `tabular-nums`. `<strong>` inside is emphasized like `MetaPrimary`. |
| `className` | `string` | — | Extra class. |

+ native `<span>` props except `children`.

### Timeline.MetaPrimary
`<span>`. No ref forwarding.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Emphasized part of the meta line: primary text, weight 500. |
| `className` | `string` | — | Extra class. |

+ native `<span>` props except `children`.

### Timeline.Value
`<span>`. No ref forwarding.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"neutral"` | Text color of the amount. |
| `children` | `ReactNode` | — (required) | Amount, optionally followed by `Timeline.ValueMeta`. |
| `className` | `string` | — | Extra class. |

+ native `<span>` props except `children`.

### Timeline.ValueMeta
`<span>`. No ref forwarding.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Second line under the amount (category, unit): meta size, muted. |
| `className` | `string` | — | Extra class. |

+ native `<span>` props except `children`.

### Timeline.Gap
Renders `<li>` + `<div>`. Forwards `ref` to the `<div>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"neutral"` | Caption and hollow dot color. |
| `trailing` | `ReactNode` | — | Caption on the right («сейчас»). |
| `children` | `ReactNode` | — (required) | Interval caption («40 дней · 2 200 км без обслуживания»). |
| `className` | `string` | — | Class on the `<div>`. |

+ native `<div>` props except `children`.

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | Rows 40, title 12/16, meta caption, dot 8, label caption | Very dense side panels | |
| `s` | Rows 52, title 13/20, meta caption, label body-s | Side panels, drawers | |
| `m` | Rows 64, title 14/20, meta body-s 13/20, dot 10, label title-s | Page content and cards | yes |
| `l` | Rows 68, title 16/24, meta body-m, dot 12, label title-m | Spacious feeds | |
| `xl` | Rows 76, title 16/24, larger paddings, dot 12, label title-m | Large detail pages | |

### highlight
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `selected` | The `active` row has a `fill-subtle-active` pill (radius 12), accent title and dot; interactive rows get a faint `fill-subtle` hover | A row selects a detail view and the selection persists | yes |
| `hover` | The row under the pointer or with keyboard focus gets the pill, accent title and dot, transiently; `active` keeps only `aria-current` | Rows are links that open a page | |

### Item `color`
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `blue` | Blue dot at 55% | Default category | yes |
| `gray` | Gray dot | Neutral / system events | |
| `green` | Green dot | Category hue | |
| `orange` | Orange dot | Category hue | |
| `red` | Red dot | Category hue (repairs, incidents) | |
| `yellow` | Yellow dot | Category hue | |
| `purple` | Purple dot | Category hue | |
| `sky` | Sky dot | Category hue | |
| `pink` | Pink dot | Category hue | |
| `teal` | Teal dot | Category hue | |

### Item `tone`
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | Muted-text dot | A status without meaning (draft) | — (unset: `color` is used) |
| `accent` | Accent dot | Current / pending action | |
| `success` | Success dot | Paid, completed | |
| `warning` | Warning dot | Overdue, needs attention | |
| `danger` | Danger dot | Refund, failure | |
| `info` | Info (sky) dot | Informational system events | |

### Value `tone`
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | Primary text, weight 500 | Plain amounts | yes |
| `accent` | Accent text | Highlighted amount | |
| `success` | Success text | Income | |
| `warning` | Warning text | Amount at risk | |
| `danger` | Danger text | Expense / refund | |
| `info` | Info text | Informational amount | |

### Gap `tone`
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | Muted caption and hollow dot on a dashed segment | Normal interval | yes |
| `accent` | Accent caption and dot | Waiting on an action | |
| `success` | Success caption and dot | Interval within norms | |
| `warning` | Warning caption and dot | Interval too long | |
| `danger` | Danger caption and dot | Critical interval | |
| `info` | Info caption and dot | Informational note | |

### Row element (structural)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| none of `onClick` / `href` / `asChild` | Static `<div>` row | Read-only feed | yes |
| `onClick` | `<button>` row, pointer cursor, hover wash, inset focus ring | Selecting a row | |
| `href` | `<a>` row | Row opens a page | |
| `asChild` | Your element (router link) | Client-side routing | |

**Combinations**
- Recommended: `color` for categories in read-only feeds; `tone` on Item + Value together for statuses (`success` income, `danger` refund); `highlight="hover"` with `href` rows; `Gap tone="warning"` for too-long intervals.
- Allowed but rare: `tone` on Value only (keep the dot categorical).
- Avoid: `color` and `tone` together on one item (`tone` wins silently); more than one `active` row; `highlight="hover"` with `onClick` selection (selection becomes invisible).

**Sizes**
Default `m` rows are 64px. Inside a Card use `m`; in a 320–375px drawer `s`.

**Hierarchy**
One `active` row at most; amounts are the only right-aligned content; use group labels instead of extra headings.

## States
| State / attribute | Element | Driven by |
|---|---|---|
| `data-size`, `data-highlight` | Root | `size`, `highlight` |
| `data-state="active" \| "inactive"` | `<li>` and row | `active` |
| `aria-current="true"` | row | `active` |
| `data-color` | row | `color` (only when no `tone`) |
| `data-tone` | row / Value / Gap row | `tone` (Value always has it, default `neutral`; Gap default `neutral`) |
| `data-interactive="true"` | row | `onClick`, `href` or `asChild` |
| hover / focus-visible | interactive row | `fill-subtle` wash (or the full highlight with `highlight="hover"`), inset focus ring |

Selection is controlled by the parent through `active`; Timeline keeps no state.

## Layout & spacing
- The root fills its width and is a size container; give it a definite width (`width: min(100%, 30rem)`), a shrink-wrapped parent collapses it.
- Group label → first row `--prime-space-2` (m); group → group `--prime-space-4`.
- Row grid: dot column · text · value. Below 20rem of root width the value moves under the meta line.
- Inside a Card put it in `Card.Body`; the card owns the padding.
- Rows touch (no gap) so the line is continuous; the line stops at each dot edge.

## Accessibility
- Each group is an `<ol>` labelled by its heading (`aria-labelledby`); items are `<li>`.
- The dot is `aria-hidden`; meaning must be in the title or meta text, not only in the dot color.
- `active` sets `aria-current="true"`.
- Interactive rows are native `<button>` / `<a>` (one Tab stop per row, Enter / Space); the focus ring is drawn inside the row.
- No `labels` keys.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [activity-feed.tsx](examples/activity-feed.tsx) | «Недавно» group with an `active` row | Operation histories with amounts |
| [service-history.tsx](examples/service-history.tsx) | `Timeline.Gap` intervals, `trailing`, `tone="warning"`, `ValueMeta` | Maintenance and audit histories |
| [selectable.tsx](examples/selectable.tsx) | `onClick` rows, controlled `active`, `tone` on dot and amount | Selecting a row for details |
| [hover-highlight.tsx](examples/hover-highlight.tsx) | `highlight="hover"` with `href` rows | Rows that open pages |
| [in-card.tsx](examples/in-card.tsx) | Two groups in `Card.Body`, dot `color` | Dashboard activity widgets |
| [colors-and-tones.tsx](examples/colors-and-tones.tsx) | All `color` hues; every `tone` on Item, Value and Gap | Choosing dot and status colors |
| [sizes.tsx](examples/sizes.tsx) | Tiers xs–xl | Choosing density |
| [narrow.tsx](examples/narrow.tsx) | 375px and 280px widths | Mobile layouts |

```tsx
import { Timeline } from "prime-ui-kit";

export function PaymentsFeed() {
  return (
    <Timeline.Root>
      <Timeline.Group label="Недавно">
        <Timeline.Item tone="success">
          <Timeline.Title>Оплата получена · Иван К.</Timeline.Title>
          <Timeline.Meta>
            <Timeline.MetaPrimary>07.10.26</Timeline.MetaPrimary> · 2 ч. назад
          </Timeline.Meta>
          <Timeline.Value tone="success">+6 300 ₽</Timeline.Value>
        </Timeline.Item>
      </Timeline.Group>
    </Timeline.Root>
  );
}
```

## Mistakes
- `Timeline.Item` outside `Timeline.Group` → items are `<li>`; always wrap them in a group.
- A process with steps («Шаг 1 из 3») → use Stepper.
- Status only by dot color → put the status in the title or meta too.
- `<div onClick>` inside an item for selection → pass `onClick` to `Timeline.Item` (native button, focus ring).
- `Timeline.Root` inside a shrink-wrapped flex parent → give it a width; the size container collapses otherwise.
- Custom dashed separators between events → use `Timeline.Gap`.

## Related
- [Stepper](../stepper/COMPONENT.md) — process steps.
- [DataTable](../data-table/COMPONENT.md) — tabular records.
- [Card](../card/COMPONENT.md) — host for feed widgets.
