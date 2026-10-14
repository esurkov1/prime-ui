# Sparkline

**Category:** data-display
**Kind:** primitive

> A small chart — a smooth line over a fading area, a bare line or bars — with its headline: the value at rest, its change and its date; any point can be scrubbed.

## When to use
- A metric card on a dashboard: revenue, orders, sign-ups over the last days or weeks.
- A trend next to a number where the shape matters more than exact axes.
- Values with a sign by period — profit, net new customers (`variant="bars"`: up when positive, down when negative), with the current period highlighted (`highlight`).
- A detail page header that shows how a value moved.
- A trend per record in a table cell or a list row (`layout="compact"`): revenue by month per client; one scale for the whole column with `min` / `max`.
- A daily flow over a period — revenue, orders, sign-ups (`summary="sum"`, `compareTo` the previous period).
- A metric against its plan or average (`reference`), or its change over the whole period (`change="first"`).
- A series with missing days — a collector that was down (`value: null` breaks the line).

## When not to use
- Exact values on axes, several series, or a legend → a full chart library on the kit's chart palette (`chartColors`); Sparkline has no axes.
- Progress toward a goal → [ProgressBar](../progress-bar/COMPONENT.md) or [ProgressCircle](../progress-circle/COMPONENT.md).
- Shares of categories or a ranking → [ProgressBar](../progress-bar/COMPONENT.md) with `segments` or `layout="rows"`.
- A list of values to compare → [DataTable](../data-table/COMPONENT.md).

## Import
```tsx
import { Sparkline, type SparklinePoint } from "prime-ui-kit";
```

## Anatomy
```
Sparkline              <div>; the headline and the chart; aria-busy while loading
├─ head                title (label) · date of the shown point
├─ value row           value (rolling digits when settled) · change Badge with the trend arrow
├─ plot                role="slider" over the chart
│  ├─ reference        dashed line at `reference` (aria-hidden)
│  ├─ area · line:     svg gradient area and monotone line, lone points as dots + cursor (guide and dot, aria-hidden)
│  └─ bars:            zero line (chart axis) + a slot per point with its bar (aria-hidden)
└─ reference text      hidden; describes the slider (aria-describedby)
loading:               Skeletons of the date, the value line and the plot
tooltip:               the kit chart tooltip (date · value) right of the pointer, portaled to <body>, aria-hidden
compact:               the plot alone (no head, no value row); loading — the plot Skeleton
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Sparkline
`ref` → `HTMLDivElement` (the root). A headline (title · date, value · change) over an area, line or bar chart; the chart is a `role="slider"` that picks a point, a tooltip beside the pointer shows the value and date. The change hides when a percentage means nothing.

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `SparklinePoint[]` | — (required) | Points oldest first, `{ label, value }`; `label` names the point («8 окт»), `value: null` is a point with no data — the line breaks, the bar is absent. A new array cross-fades the chart in. |
| `label` | `string` | — (required) | Visible title above the value and the accessible name of the chart; with `layout="compact"` only the accessible name. |
| `variant` | `"area" \| "line" \| "bars"` | `"area"` | `area` — a line over an accent gradient that fades to the bottom; `line` — the line alone, for many trends side by side; `bars` — a bar per point standing on a zero line: up when positive, down (danger) when negative. |
| `curve` | `"smooth" \| "linear" \| "step"` | `"smooth"` | Shape of the line (`area`, `line`): `smooth` — a monotone cubic through every point that never overshoots a peak or a trough; `linear` — straight segments; `step` — a level per point, changing halfway between points. |
| `layout` | `"default" \| "compact"` | `"default"` | `default` — the headline over an 80 px plot; `compact` — the plot alone at an `xs` control height with the dot at rest, for a DataTable cell; the scrubbed point shows in the tooltip and `aria-valuetext`. |
| `change` | `"previous" \| "first" \| "none"` | `"previous"` | What the change badge of a shown point compares it with: `previous` — the point before it; `first` — the first point with a value (the change over the period); `none` — no badge. |
| `summary` | `"latest" \| "sum" \| "average"` | `"latest"` | What the headline shows at rest: `latest` — the latest point (or `highlight`), for a level (MRR, conversion); `sum` — the period total, for a flow (revenue per day); `average` — the period mean. |
| `highlight` | `number` | `the latest point with a value` | Index of the point at rest with `summary="latest"` (the current month): the headline returns to it; `bars` draw the other bars quieter. Not allowed with `sum` / `average`. |
| `compareTo` | `number` | — | The same summary for the previous period («прошлые 30 дней»): the badge at rest compares the headline with it. Without it a `sum` / `average` headline shows no change at rest. |
| `min` | `number` | — | The value axis reaches down to at least this value: a floor of zero, or one scale for several sparklines (a table column). Data below widens the scale, never gets cut. |
| `max` | `number` | — | The value axis reaches up to at least this value; data above widens the scale. |
| `reference` | `number` | — | A dashed horizontal line at this value — a plan, a target, an average; the scale holds it and the chart is described by `labels.reference`. |
| `loading` | `boolean` | `false` | The series is on its way: Skeletons of the date, the value and the plot that cross-fade into the data; the title stays, the root is `aria-busy` and the chart is not focusable yet. |
| `formatValue` | `(value: number) => string` | `Russian digit groups` | Display of a value in the headline, the tooltip, the reference description and the spoken point («312 400 ₽»). |
| `labels` | `Partial<SparklineLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className`, `data-*` and the other div attributes on the root. |

## Variants

### variant
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `area` | an accent line over a gradient that fades to the bottom, a dot on the shown point | a continuous trend in a tile (daily revenue) | yes |
| `line` | the accent line alone, a dot on the shown point | many trends side by side, a quiet trend in a dense list | |
| `bars` | a bar per point from a zero line (`--prime-color-chart-axis`): accent up, danger down, value end rounded | values by period, especially with a sign (monthly profit) | |

### curve
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `smooth` | a monotone cubic through every point: round, never above a peak or below a trough | most trends | yes |
| `linear` | straight segments between points | few points where each turn matters | |
| `step` | a level per point, changing halfway between points | values that hold for a period (a price, a plan, a headcount) | |

### change
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `previous` | change against the point before the shown one | period-over-period (this month vs the last) | yes |
| `first` | change against the first point with a value | the change over the whole range («за полгода») | |
| `none` | no badge | a percentage means nothing (a rate near zero, a count of events) | |

### summary
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `latest` | the latest point (or `highlight`) at rest, its date, the dot on it | a level: MRR, a balance, a price, a conversion rate | yes |
| `sum` | the period total at rest, the period as its date («9 сен – 8 окт»), no dot | a flow: revenue, orders, sign-ups per day | |
| `average` | the period mean at rest, the period as its date, no dot | a rate over the period: average check, response time | |

Scrubbing always shows the point under the pointer; leaving returns to the summary. With `compareTo` (the same summary for the previous period) the badge at rest is the change against it — «+8% к прошлым 30 дням».

### layout
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `default` | the headline (title · date, value · change) over an 80 px plot | a dashboard tile, a page header | yes |
| `compact` | the plot alone at the height of an `xs` control (28 px), the dot on the point at rest; scrubbing shows the guide and the tooltip; at least 96 px wide | a DataTable cell or a list row: one trend per record next to its name or total | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `highlight` | the headline rests on that point; in `bars` the other bars are quieter | the current period is not the last point (a year with empty months ahead) | the latest point |
| `min` · `max` | the scale spans at least this range; data outside widens it | one scale for a table column, a floor of zero | the data's own range |
| `reference` | a dashed chart-axis line at the value | a plan, a target, an average | — |
| `loading` | Skeletons of the date, the value and the plot | the series is on its way | `false` |

Put it in a `Card` for a dashboard tile.

## States
| State | Driven by | DOM |
|---|---|---|
| at rest | `summary`, `highlight`, `compareTo` | the latest point or `highlight` (`latest`), or the period total / mean with the period as date and no dot (`sum` / `average`, cursor `data-hidden`); the badge compares with `compareTo` when given; the value rolls its digits when `data` changes or scrubbing ends |
| scrubbing | pointer, touch or the arrow keys | `data-scrubbing` on the root; the guide and the tooltip (`data-state="open"`, date · value, right of the pointer at its height, left of it only where the right has no room in the viewport; from the keyboard beside the point at mid-height) fade in (`fast`), the cursor (or the bar under the pointer) and the headline follow with no easing (direct manipulation), digits change in place |
| keyboard | arrows, Home, End on the focused plot | `aria-valuenow` / `aria-valuetext`, `data-scrubbing`; the cursor moves to the point at once (keyboard steps are high-frequency); in `bars` the current bar keeps its fill, the others go quiet (`fast` opacity) |
| settle | pointer leaves, touch ends, focus leaves | back to the point at rest; the tooltip fades out (`fast`) |
| change hidden | `change="none"`, nothing to compare with, a missing value, a base of 0, or a sign flip | no change Badge: a percentage would mean nothing |
| no data | a point with `value: null` | the line breaks (a point alone between gaps is a dot), no bar; shown, the value reads `labels.empty` (`data-empty`, muted) and the dot fades out, the guide marks the point |
| new series | a new `data` array | the chart cross-fades in (swap motion); the trend arrow turns half a turn between up and down |
| compact | `layout="compact"` | `data-layout="compact"` on the root; no headline: `label` names the slider, the point is spoken through `aria-valuetext` and shown in the tooltip |
| loading | `loading` | `aria-busy` on the root; Skeletons in place of the date, the value and the plot; no slider until the data comes; the data cross-fades in |

## Layout & spacing
- Takes the width of its container; the plot is 80 px high and inset by the dot radius so the cursor is never clipped. The smooth curve never leaves the plot: a monotone cubic does not overshoot the extremes.
- Bars share the width equally, 4 px apart; the zero line sits where 0 falls on the scale (the bottom when every value is positive).
- In a dashboard, wrap it in `Card.Root` + `Card.Body`; several cards go in a grid.
- When the value row does not fit (a narrow card), the change badge wraps under the value.
- `layout="compact"` fits a DataTable row of any tier (plot and dot within an `xs` control height) and takes the cell width, at least `--prime-space-24`; give the column a `width` for an even plot per row. Put the number next to it in its own column: the compact plot shows a value only in its tooltip while scrubbed.
- The tooltip is the kit's chart tooltip, placed like every anchored layer (`usePosition`): right of the pointer at its height, on the left only where the right has no room in the viewport — crossing the middle never moves it; from the keyboard right of the point at mid-height. Portaled, so a card or a table scroller never clips it.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `←` · `→` · `↓` · `↑` | Previous or next point: `←` / `↓` back, `→` / `↑` forward, as on a slider. |
| `Home` · `End` | First or last point. |
| `Tab` | Focuses the chart; leaving focus returns the headline to rest (`summary`, `highlight`). |
| `Escape` | Hides the tooltip and returns the headline to rest. |

### ARIA
- The plot is `role="slider"` named by `label`; `aria-valuetext` speaks the point («8 окт: 312 400 ₽», `labels.point`); a point with no data speaks `labels.empty` («8 окт: Нет данных»). At rest with `sum` / `average` it speaks the period and the summary («9 сен – 8 окт: 8 914 000 ₽»). With `reference` the slider is described by `labels.reference` («Ориентир: 3%», `aria-describedby`). The headline follows the point under the pointer or the arrows, in text.
- The headline with the value and change reads as plain text.
- The change carries a sign and an arrow, never color alone; a negative bar goes down, not only red.
- While `loading` the root is `aria-busy` and the chart is not in the tab order yet.
- `layout="compact"`: no visible title; `label` is only the slider's name, the point still goes to `aria-valuetext`.
- The tooltip is `aria-hidden`: it repeats `aria-valuetext` for sighted users. The plot carries `data-row-click-ignore` (and is a slider), so its pointer and keys never open a DataTable row.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `point` | `"{label}: {value}"` | Spoken value of the chosen point (`aria-valuetext`); `{label}` and `{value}` are replaced. |
| `period` | `"{first} – {last}"` | The date line of a `sum` / `average` headline at rest; `{first}` and `{last}` are the labels of the first and the last point. |
| `empty` | `"Нет данных"` | Shown and spoken in place of the value of a point with `value: null`. |
| `reference` | `"Ориентир: {value}"` | Description of the chart with a `reference` line (`aria-describedby`); `{value}` is replaced. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Revenue for 30 days in a dashboard card: at rest the total for the period against the previous 30 days, drag across the chart to see a day — `data`, `label`, `summary`, `compareTo`, `formatValue`. |
| [variants.tsx](examples/variants.tsx) | The same week as an area, a bare line and bars from zero — `variant`. |
| [states.tsx](examples/states.tsx) | While the series loads the date, the value and the plot are Skeletons in their own places; the title stays — `loading`. |
| [compact.tsx](examples/compact.tsx) | Revenue by month per client in a list: the plot alone at a row's height with the dot on the current month, scrubbing shows the month in a tooltip, the label is the chart's accessible name — `layout`, `label`. |
| [signed-bars.tsx](examples/signed-bars.tsx) | Monthly profit with a sign: losses go below the zero line, the current month rests highlighted and any bar shows its value under the pointer or the arrows — `variant`, `highlight`. |
| [curve.tsx](examples/curve.tsx) | The same month of active users as a smooth curve, straight segments and steps — `curve`. |
| [reference.tsx](examples/reference.tsx) | Checkout conversion against its plan: a dashed reference line, the scale from zero to 5% and the change over the whole period — `reference`, `min`, `max`, `change`. |
| [gaps.tsx](examples/gaps.tsx) | Daily API requests with days the collector was down: the line breaks over a missing day and the headline says there is no data — `data`, `labels`. |
| [period.tsx](examples/period.tsx) | Another period swaps the series: the line cross-fades in and the headline digits roll to the new total — `data`, `summary`. |

## Mistakes
- A new array on every render (`data={rows.map(...)}` inline) → the line cross-fades on every render; memoize the series.
- Formatting inside `label` of a point («312 400 ₽») → the point label is its name («8 окт»); format values with `formatValue`.
- A Sparkline without a container width (inside an inline flex row) → give it a width or put it in a `Card`.
- A Tooltip or a chart library tooltip wrapped around the chart → Sparkline draws its own beside the pointer.
- A daily flow (revenue per day) with the latest day in the headline → `summary="sum"`: the card is about the period; pass `compareTo` for its change.
- A missing day as `0` → the line dives to zero; pass `value: null`, the line breaks and the headline says there is no data.
- Compact sparklines in a column, each on its own scale, when rows must be compared by size → pass the column's `min` / `max` to every row.
- A plan drawn as a second series → `reference`.
- A grey box while the series loads → `loading`.
- A full Sparkline squeezed into a table cell, or its headline hidden with CSS → `layout="compact"`.

## Related
- **Built from:** [Badge](../badge/COMPONENT.md) (change), [Skeleton](../skeleton/COMPONENT.md) (loading), `Icon` (trend arrow), `ChartTooltip` (the chart tooltip shared with ChartFrame)
- **See also:** [ChartFrame](../chart-frame/COMPONENT.md), [DataTable](../data-table/COMPONENT.md) (a compact Sparkline per row), [Card](../card/COMPONENT.md), [ProgressBar](../progress-bar/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md)
