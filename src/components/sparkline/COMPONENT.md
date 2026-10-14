# Sparkline

**Category:** data-display
**Kind:** primitive

> A small line or bar chart with its headline — the value at rest, its change against the point before and its date — where any point can be scrubbed.

## When to use
- A metric card on a dashboard: revenue, orders, sign-ups over the last days or weeks.
- A trend next to a number where the shape matters more than exact axes.
- Values with a sign by period — profit, net new customers (`variant="bars"`: up when positive, down when negative), with the current period highlighted (`highlight`).
- A detail page header that shows how a value moved.
- A trend per record in a table cell or a list row (`layout="compact"`): revenue by month per client.

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
└─ plot                role="slider" over the chart
   ├─ line:            svg line and area + cursor (guide line and dot, aria-hidden)
   └─ bars:            zero line (chart axis) + a slot per point with its bar (aria-hidden)
loading:               Skeletons of the date, the value line and the plot
compact:               the plot alone (no head, no value row); loading — the plot Skeleton
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Sparkline
`ref` → `HTMLDivElement` (the root). A headline (title · date, value · change) over a line or bar chart; the chart is a `role="slider"` that picks a point. The change hides when a percentage means nothing (the previous value is 0 or the sign flips).

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `SparklinePoint[]` | — (required) | Points oldest first, `{ label, value }`; `label` names the point («8 окт»). Two or more draw a line. A new array cross-fades the line in. |
| `label` | `string` | — (required) | Visible title above the value and the accessible name of the chart; with `layout="compact"` only the accessible name. |
| `layout` | `"default" \| "compact"` | `"default"` | `default` — the headline over an 80 px plot; `compact` — the plot alone at an `xs` control height with the dot at rest, for a DataTable cell; the point stays in `aria-valuetext`. |
| `variant` | `"line" \| "bars"` | `"line"` | `line` — a line over a soft area; `bars` — a bar per point standing on a zero line: up when positive, down (danger) when negative, the value end rounded. |
| `highlight` | `number` | `the latest point` | Index of the point at rest (the current month): the headline shows it when nobody scrubs and leaving the chart returns to it; `bars` draw the other bars quieter. |
| `loading` | `boolean` | `false` | The series is on its way: Skeletons of the date, the value and the plot that cross-fade into the data; the title stays, the root is `aria-busy` and the chart is not focusable yet. |
| `formatValue` | `(value: number) => string` | `Russian digit groups` | Display of a value in the headline and the spoken point («312 400 ₽»). |
| `labels` | `Partial<SparklineLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className`, `data-*` and the other div attributes on the root. |

## Variants

### variant
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `line` | an accent line over a soft area, a dot on the shown point | a continuous trend (daily revenue) | yes |
| `bars` | a bar per point from a zero line (`--prime-color-chart-axis`): accent up, danger down, value end rounded | values by period, especially with a sign (monthly profit) | |

### layout
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `default` | the headline (title · date, value · change) over an 80 px plot | a dashboard tile, a page header | yes |
| `compact` | the plot alone at the height of an `xs` control (28 px), the dot on the point at rest, the guide line only while scrubbing; at least 96 px wide | a DataTable cell or a list row: one trend per record next to its name or total | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `highlight` | the headline rests on that point; in `bars` the other bars are quieter | the current period is not the last point (a year with empty months ahead) | the latest point |
| `loading` | Skeletons of the date, the value and the plot | the series is on its way | `false` |

Put it in a `Card` for a dashboard tile.

## States
| State | Driven by | DOM |
|---|---|---|
| at rest | — | the latest point or `highlight`; the value rolls its digits when `data` changes |
| scrubbing | pointer, touch or the arrow keys | `data-scrubbing` on the root; the cursor (or the bar under the pointer) and the headline follow with no easing (direct manipulation), digits change in place |
| keyboard | arrows, Home, End on the focused plot | `aria-valuenow` / `aria-valuetext`, `data-scrubbing`; the cursor moves to the point at once (keyboard steps are high-frequency); in `bars` the current bar keeps its fill, the others go quiet (`fast` opacity) |
| settle | pointer leaves, touch ends, focus leaves | back to the point at rest |
| change hidden | the first point, the previous value is 0, or the sign flips | no change Badge: a percentage would mean nothing |
| new series | a new `data` array | the chart cross-fades in (swap motion); the trend arrow turns half a turn between up and down |
| compact | `layout="compact"` | `data-layout="compact"` on the root; no headline: `label` names the slider, the point is spoken through `aria-valuetext`; the guide fades in while scrubbing (`fast`) |
| loading | `loading` | `aria-busy` on the root; Skeletons in place of the date, the value and the plot; no slider until the data comes; the data cross-fades in |

## Layout & spacing
- Takes the width of its container; the plot is 80 px high and inset by the dot radius so the cursor is never clipped.
- Bars share the width equally, 4 px apart; the zero line sits where 0 falls on the scale (the bottom when every value is positive).
- In a dashboard, wrap it in `Card.Root` + `Card.Body`; several cards go in a grid.
- When the value row does not fit (a narrow card), the change badge wraps under the value.
- `layout="compact"` fits a DataTable row of any tier (plot and dot within an `xs` control height) and takes the cell width, at least `--prime-space-24`; give the column a `width` for an even plot per row. Put the number next to it in its own column: the compact plot shows no value.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `←` · `→` · `↓` · `↑` | Previous or next point: `←` / `↓` back, `→` / `↑` forward, as on a slider. |
| `Home` · `End` | First or last point. |
| `Tab` | Focuses the chart; leaving focus returns to the point at rest (the latest or `highlight`). |

### ARIA
- The plot is `role="slider"` named by `label`; `aria-valuetext` speaks the point («8 окт: 312 400 ₽», `labels.point`). The headline is the tooltip of the chart: the value of the point under the pointer or the arrows, in text.
- The headline with the value and change reads as plain text.
- The change carries a sign and an arrow, never color alone; a negative bar goes down, not only red.
- While `loading` the root is `aria-busy` and the chart is not in the tab order yet.
- `layout="compact"`: no visible title; `label` is only the slider's name, the point still goes to `aria-valuetext`. The plot carries `data-row-click-ignore` (and is a slider), so its pointer and keys never open a DataTable row.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `point` | `"{label}: {value}"` | Spoken value of the chosen point (`aria-valuetext`); `{label}` and `{value}` are replaced. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Revenue for 30 days in a dashboard card: drag across the chart, the headline follows and the trend arrow turns — `data`, `label`, `formatValue`. |
| [variants.tsx](examples/variants.tsx) | The same week as a line and as bars from zero — `variant`. |
| [states.tsx](examples/states.tsx) | While the series loads the date, the value and the plot are Skeletons in their own places; the title stays — `loading`. |
| [compact.tsx](examples/compact.tsx) | Revenue by month per client in a list: the plot alone at a row's height with the dot on the current month, the label is the chart's accessible name — `layout`, `label`. |
| [signed-bars.tsx](examples/signed-bars.tsx) | Monthly profit with a sign: losses go below the zero line, the current month rests highlighted and any bar shows its value under the pointer or the arrows — `variant`, `highlight`. |
| [period.tsx](examples/period.tsx) | Another period swaps the series: the line cross-fades in and the headline digits roll to the new total — `data`. |

## Mistakes
- A new array on every render (`data={rows.map(...)}` inline) → the line cross-fades on every render; memoize the series.
- Formatting inside `label` of a point («312 400 ₽») → the point label is its name («8 окт»); format values with `formatValue`.
- A Sparkline without a container width (inside an inline flex row) → give it a width or put it in a `Card`.
- A separate tooltip over the bars → the headline already shows the scrubbed point; a floating tooltip would cover the next bar.
- A grey box while the series loads → `loading`.
- A full Sparkline squeezed into a table cell, or its headline hidden with CSS → `layout="compact"`.

## Related
- **Built from:** [Badge](../badge/COMPONENT.md) (change), [Skeleton](../skeleton/COMPONENT.md) (loading), `Icon` (trend arrow)
- **See also:** [DataTable](../data-table/COMPONENT.md) (a compact Sparkline per row), [Card](../card/COMPONENT.md), [ProgressBar](../progress-bar/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md)
