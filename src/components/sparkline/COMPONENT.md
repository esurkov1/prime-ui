# Sparkline

**Category:** data-display
**Kind:** primitive

> A small line chart with its headline — the latest value, its change against the point before and its date — where any point can be scrubbed.

## When to use
- A metric card on a dashboard: revenue, orders, sign-ups over the last days or weeks.
- A trend next to a number where the shape matters more than exact axes.
- A detail page header that shows how a value moved.

## When not to use
- Exact values on axes, several series, or a legend → a full chart library; Sparkline has no axes.
- Progress toward a goal → [ProgressBar](../progress-bar/COMPONENT.md) or [ProgressCircle](../progress-circle/COMPONENT.md).
- A list of values to compare → [DataTable](../data-table/COMPONENT.md).

## Import
```tsx
import { Sparkline, type SparklinePoint } from "prime-ui-kit";
```

## Anatomy
```
Sparkline              <div>; the headline and the chart
├─ head                title (label) · date of the shown point
├─ value row           value (rolling digits when settled) · change Badge with the trend arrow
└─ plot                role="slider" over the svg line and area
   └─ cursor           guide line and dot of the shown point (aria-hidden)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Sparkline
`ref` → `HTMLDivElement` (the root). A headline (title · date, value · change) over a line chart; the chart is a `role="slider"` that picks a point.

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `SparklinePoint[]` | — (required) | Points oldest first, `{ label, value }`; `label` names the point («8 окт»). Two or more draw a line. A new array cross-fades the line in. |
| `label` | `string` | — (required) | Visible title above the value and the accessible name of the chart. |
| `formatValue` | `(value: number) => string` | `Russian digit groups` | Display of a value in the headline and the spoken point («312 400 ₽»). |
| `labels` | `Partial<SparklineLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className`, `data-*` and the other div attributes on the root. |

## Variants
No variants: one accent line on the surface it sits on. Put it in a `Card` for a dashboard tile.

## States
| State | Driven by | DOM |
|---|---|---|
| at rest | — | the latest point; the value rolls its digits when `data` changes |
| scrubbing | pointer or touch over the plot | `data-scrubbing` on the root; the cursor and the headline follow the pointer with no easing (direct manipulation), digits change in place |
| keyboard | arrows, Home, End on the focused plot | `aria-valuenow` / `aria-valuetext`; the cursor glides to the point (`base` · emphasized) |
| settle | pointer leaves, touch ends, focus leaves | the cursor glides back to the latest point |
| new series | a new `data` array | the line cross-fades in (swap motion); the trend arrow turns half a turn between up and down |

## Layout & spacing
- Takes the width of its container; the plot is 80 px high and inset by the dot radius so the cursor is never clipped.
- In a dashboard, wrap it in `Card.Root` + `Card.Body`; several cards go in a grid.
- Below 320 px the value row wraps the change badge under the value.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `←` · `→` | Previous or next point. |
| `Home` · `End` | First or last point. |
| `Tab` | Focuses the chart; leaving focus returns to the latest point. |

### ARIA
- The plot is `role="slider"` named by `label`; `aria-valuetext` speaks the point («8 окт: 312 400 ₽», `labels.point`).
- The headline with the latest value and change reads as plain text.
- The change carries a sign and an arrow, never color alone.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `point` | `"{label}: {value}"` | Spoken value of the chosen point (`aria-valuetext`); `{label}` and `{value}` are replaced. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Revenue for 30 days in a dashboard card: drag across the chart, the headline follows and the trend arrow turns — `data`, `label`, `formatValue`. |
| [period.tsx](examples/period.tsx) | Another period swaps the series: the line cross-fades in and the headline digits roll to the new total — `data`. |

## Mistakes
- A new array on every render (`data={rows.map(...)}` inline) → the line cross-fades on every render; memoize the series.
- Formatting inside `label` of a point («312 400 ₽») → the point label is its name («8 окт»); format values with `formatValue`.
- A Sparkline without a container width (inside an inline flex row) → give it a width or put it in a `Card`.

## Related
- **Built from:** [Badge](../badge/COMPONENT.md)
- **See also:** [Card](../card/COMPONENT.md), [ProgressBar](../progress-bar/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md)
