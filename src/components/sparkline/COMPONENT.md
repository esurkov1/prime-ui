# Sparkline

**Category:** data-display
**Kind:** primitive

> A small chart with no headline of its own — a smooth line over a fading area, a bare, dashed or dotted line, or bars, with comparison lines beside it; `useSparkline` gives the value, change and date a card lays out, and they follow the scrubbed point.

## When to use
- A KPI card on a dashboard: revenue, orders, sign-ups over the last days or weeks — the card lays out the value, change and date from `useSparkline`, the plot sits where the card wants it.
- A trend next to a number where the shape matters more than exact axes.
- Values with a sign by period — profit, net new customers (`variant="bars"`: up when positive, down when negative), with the current period highlighted (`highlight`).
- A trend per record in a table cell or a list row (`layout="compact"`): revenue by month per client; one scale for the whole column with `min` / `max`.
- A daily flow over a period — revenue, orders, sign-ups (`useSparkline` with `summary="sum"`, `compareTo` the previous period).
- A metric against its plan or average (`reference`), or its change over the whole period (`change="first"`).
- A series with missing days — a collector that was down (`value: null` breaks the line).
- A metric where growth is bad — response time, costs, bounce rate (`better="lower"`); a share in percent whose change is in percentage points (`changeUnit="points"`).
- A period value that is neither the sum nor the mean of the days — a median, unique clients (`value`, `compareTo`).
- A row of KPI tiles over one period that follow one cursor (one `point` / `onPointChange` for every reading, `size="s"`), each tile opening its section (`Card.Link`).
- Raw days over any range — a month, a quarter, a year (`{ date, value }`): the kit folds them by days, weeks, months or quarters (`grain`); a card's step switcher is built from `grains` / `setGrain`, a page's switcher sets one `grain` for several tiles.
- A metric against last year, a plan or another channel on one scale (`series`: each line with its chart `color` and `variant`, named in a legend), bars with lines over them included.
- A KPI tile of the latest week or month against the one before, the current one still running (`aggregate="sum"`, `change="previous"`: the cut period compares with the same days of the previous).

## When not to use
- Exact values on axes, series a person turns on and off, or many series of equal weight → [ChartFrame](../chart-frame/COMPONENT.md) around a chart library; Sparkline has no axes, its reading follows one main series and `series` only compares with it.
- Progress toward a goal → [ProgressBar](../progress-bar/COMPONENT.md) or [ProgressCircle](../progress-circle/COMPONENT.md).
- Shares of categories or a ranking → [ProgressBar](../progress-bar/COMPONENT.md) with `segments` or `layout="rows"`.
- A list of values to compare → [DataTable](../data-table/COMPONENT.md).

## Import
```tsx
import { Sparkline, type SparklinePoint, useSparkline } from "prime-ui-kit";
```

## Anatomy
```
useSparkline(options)  the reading: value · valueText · date · change · changeText · changeTone · atRest · grain · grains · setGrain · plot
Sparkline              <div>; the plot and, with `series`, its legend; aria-busy while loading
├─ plot                role="slider" over the chart
│  ├─ reference        dashed line at `reference` (aria-hidden)
│  ├─ area · line:     svg gradient area and monotone line (dashed, dotted), the lines of `series` behind it, lone points as dots + cursor (guide and a dot per line, aria-hidden)
│  └─ bars:            zero line (chart axis) + a slot per point with its bar, the lines of `series` over them (aria-hidden)
├─ legend              with `series`: <ul> of a swatch drawn like each line · its name · its value at the shown point
└─ reference text      hidden; describes the slider (aria-describedby)
loading:               the plot Skeleton
tooltip (compact):     the kit chart tooltip (date · value, a row per line) right of the pointer, portaled to <body>, aria-hidden
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Sparkline
`ref` → `HTMLDivElement` (the root). A plot with no headline: an area, a line or bars and the lines of `series`; a `role="slider"` that picks a point. A headline beside it reads the point through `useSparkline`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `SparklinePoint[]` | — (required) | Points oldest first: `{ label, value }` as it is, or days `{ date, value }` folded by `grain`. `value: null` — no data: the line breaks, no bar. A new array cross-fades in. |
| `series` | `SparklineSeries[]` | — | More lines on the same scale, `{ id, label, data, color?, variant? }`: last year, a plan. Each has a chart `color` and a line `variant`; a legend under the plot names them. |
| `label` | `string` | — (required) | The name of the main series: the slider's accessible name and its entry in the legend of `series`. |
| `variant` | `"area" \| "line" \| "dashed" \| "dotted" \| "bars"` | `"area"` | The main series: `area` — a line over a fading gradient; `line` — the line alone; `dashed`, `dotted` — a broken line; `bars` — a bar per point from zero, down (danger) when negative. |
| `curve` | `"smooth" \| "linear" \| "step"` | `"smooth"` | Shape of the lines: `smooth` — a monotone cubic that never overshoots a peak or a trough; `linear` — straight segments; `step` — a level per point, changing halfway. |
| `layout` | `"default" \| "compact"` | `"default"` | `default` — the plot of its `size` with the legend of `series`; `compact` — an `xs` control height for a DataTable cell, the point in a tooltip. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Plot height 40 · 48 · 80 · 96 · 128 px, the Skeleton the same. `s` fits a KPI tile in a row of four; `compact` keeps the `xs` height. |
| `point` | `number \| null` | — | Index of the scrubbed point, `null` at rest. One `point` on sparklines of one axis moves the cursor of all; `useSparkline` passes its own. |
| `defaultPoint` | `number \| null` | `null` | The scrubbed point at mount (uncontrolled). |
| `onPointChange` | `(point: number \| null) => void` | — | Called with the point index while scrubbing (pointer, touch, arrow keys) and with `null` when the chart returns to rest. |
| `highlight` | `number \| null` | the latest point with a value | The point marked at rest (the current month; `bars` draw the others quieter); `null` — none, the reading rests on the whole period. |
| `grain` | `"auto" \| "day" \| "week" \| "month" \| "quarter"` | — | Step of a dated series: day, ISO week, month, quarter; `auto` — the finest with at most 31 points (16 in `compact`). A cut period is dashed. |
| `defaultGrain` | `"auto" \| "day" \| "week" \| "month" \| "quarter"` | `"auto"` | The step at mount (uncontrolled). |
| `onGrainChange` | `(grain: "auto" \| "day" \| "week" \| "month" \| "quarter") => void` | — | Called with a new step; a switcher of the card (`useSparkline` `setGrain`) or of the page sets it. |
| `aggregate` | `"sum" \| "average" \| "latest"` | `"latest"` | How the days of a dated point make its value: `sum` — a flow; `average` — their mean; `latest` — the last day, a level (MRR). |
| `locale` | `Locale` | `ru` from date-fns | date-fns locale of the month names in the point labels of a dated series. |
| `min` | `number` | — | The value axis reaches down to at least this value: a floor of zero, or one scale for several sparklines (a table column). Data below widens the scale. |
| `max` | `number` | — | The value axis reaches up to at least this value; data above widens the scale. |
| `reference` | `number` | — | A dashed horizontal line at this value — a plan, a target, an average; the scale holds it and the chart is described by `labels.reference`. |
| `loading` | `boolean` | `false` | The series is on its way: a Skeleton of the plot that cross-fades into the data; the root is `aria-busy` and the chart is not focusable yet. |
| `formatValue` | `(value: number) => string` | Russian digit groups | Display of a value in the legend, the compact tooltip, the reference description and the spoken point («312 400 ₽»). |
| `labels` | `Partial<SparklineLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className`, `data-*` and the other div attributes on the root. |

### Types

#### `SparklineReading`
What `useSparkline` returns: the reading of the headline and the props of its plot.

| Field | Type | Default | Description |
|---|---|---|---|
| `value · valueText` | `number \| null · string` | — | The headline value and its display (`formatValue`; `labels.empty` for no data). |
| `date` | `string` | — | The shown point's label, or the period at rest with `sum` / `average` / `value` («1 сен – 22 окт»). |
| `change · changeText · changeTone` | `number \| null · string · "success" \| "danger" \| "neutral"` | — | The change rounded to one decimal (`null` — none to show), its text («+12%», «+0,5 п. п.») and its tone by `better`; a zero change is `neutral`. |
| `atRest` | `boolean` | — | No point is scrubbed: the reading is the one at rest. |
| `grain · grains · setGrain` | `Grain · Grain[] · (grain: SparklineGrain) => void` | — | The step shown, the steps that make two points or more (a switcher's items) and the setter. |
| `plot` | `SparklinePlotProps` | — | Spread onto `<Sparkline>`: the series, the step, the point and `highlight` of this reading. |

### Functions

#### `useSparkline(options)`
`(options: UseSparklineOptions) => SparklineReading`

The reading for a headline you lay out (a KPI card): `data`, `series`, the `grain` and `point` triads, `aggregate`, `summary` (`latest` · `sum` · `average`), `highlight` or an own `value`, `compareTo`, `change` (`previous` · `first` · `none`), `changeUnit`, `better`, `formatValue`, `labels`.

## Variants

### variant
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `area` | an accent line over a gradient that fades to the bottom, a dot on the shown point | a continuous trend in a tile (daily revenue) | yes |
| `line` | the accent line alone, a dot on the shown point | many trends side by side, a quiet trend in a dense list | |
| `dashed` | the line in long dashes | a plan, a forecast, a target path | |
| `dotted` | the line in round dots | a previous period, an estimate | |
| `bars` | a bar per point from a zero line (`--prime-color-chart-axis`): accent up, danger down, value end rounded | values by period, especially with a sign (monthly profit) | |

### series
Each entry is `{ id, label, data, color?, variant? }` — a line on the main series' scale. `variant` is `area`, `line` (default), `dashed` or `dotted`; `color` is a palette hue drawn in its chart color (default: the chart colors in order after the main accent — orange, teal…). Points stand by position beside the main ones (the n-th with the n-th: last year's September beside this year's); dated days fold by the main `grain`; a line shorter than the main series has no value past its end. The reading of `useSparkline` and `highlight` stay with the main series; the legend under the plot names every line and gives each value at the shown point — at rest, with no point marked (`highlight={null}`), the line's total or mean as its days fold (`aggregate`). The compact plot has no legend: its tooltip lists the lines.

### curve
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `smooth` | a monotone cubic through every point: round, never above a peak or below a trough | most trends | yes |
| `linear` | straight segments between points | few points where each turn matters | |
| `step` | a level per point, changing halfway between points | values that hold for a period (a price, a plan, a headcount) | |

### useSparkline: summary
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `latest` | the latest point (or `highlight`) at rest, its date, the dot on it | a level: MRR, a balance, a price, a conversion rate | yes |
| `sum` | the period total at rest, the period as its `date` («9 сен – 8 окт»), no dot (`plot.highlight` is `null`) | a flow: revenue, orders, sign-ups per day | |
| `average` | the period mean at rest, the period as its `date`, no dot | a rate over the period: average check, response time | |

Scrubbing the plot shows the point under the pointer; leaving returns to the summary. With `compareTo` (the same summary for the previous period) the change at rest is against it — «+8% к прошлым 30 дням». A period value that is neither the sum nor the mean of the points (a median, unique clients over the period) is passed as `value` (in place of `summary`): the reading rests on it like on a sum; `compareTo` is the same value for the previous period.

### useSparkline: change
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `previous` | the change against the point before the shown one; a cut period against the same days of the previous | period-over-period (this month vs the last) | |
| `first` | the change against the first point with a value | the change over the whole range («за полгода») | |
| `none` | no change for a point; with `compareTo` the change at rest stays | the value alone, or the change only against the previous period | yes |

### useSparkline: changeUnit
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `percent` | `changeText` «+12%»; `change` is `null` when the base is 0 or the sign flips | counts, money, durations | yes |
| `points` | the difference of the values, `labels.points` («+0,5 п. п.») | a share already in percent: conversion, churn, load | |

A change that rounds to zero (one decimal) is `neutral` («0%»).

### useSparkline: better
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `higher` | growth `success`, a fall `danger` (`changeTone`) | revenue, orders, conversion | yes |
| `lower` | a fall `success`, growth `danger`; the sign still follows the change | response time, costs, bounce rate, deal cycle | |

### grain
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `auto` | the finest step with at most 31 points (16 in `compact`): up to a month by days, up to about seven months by weeks, up to about two and a half years by months, longer by quarters | the range changes (a period switcher) and the step should follow it | yes |
| `day` | a point per day («8 окт») | a day-by-day look at a long range | |
| `week` | a point per ISO week, from Monday («6–12 окт») | weekly rhythm, week-over-week | |
| `month` | a point per month («окт», with the year when the series crosses one) | month-over-month, a year of data | |
| `quarter` | a point per quarter (`labels.quarter`, «III кв.») | several years of data | |

Only for dated points (`{ date, value }`); a series of `{ label, value }` is drawn as it is. A period the series starts or ends inside (the current month) is named by its days («1–22 окт») and drawn dashed — a hatched bar in `bars`; with `change="previous"` it compares with the same days of the period before. The reading's period at rest runs from the first day to the last («1 сен – 22 окт») whatever the step. `useSparkline` holds the step (`grain`, `grains` — the steps that make two points or more — and `setGrain` for a switcher) and passes it to the plot in `plot`.

### aggregate
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `sum` | a point is the total of its days | a flow: revenue, orders, sign-ups | `useSparkline` with `summary="sum"` |
| `average` | a point is the mean of its days | a daily rate: average check, response time | `useSparkline` with `summary="average"` |
| `latest` | a point is its last day with a value | a level: MRR, a balance, headcount | yes (`useSparkline`: with `summary="latest"` and `value`) |

A share or a unique count (a conversion, unique clients) cannot be folded from days: pass the series ready per step as `{ label, value }`.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | a 40 px plot | a tile in a dense side panel | |
| `s` | a 48 px plot | a KPI tile in a row of four | |
| `m` | an 80 px plot | a dashboard card | the host tier, else yes |
| `l` | a 96 px plot | the chart that leads its panel | |
| `xl` | a 128 px plot | a detail page header | |

The Skeleton of `loading` takes the same height. `layout="compact"` keeps the `xs` control height whatever the tier.

### layout
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `default` | the plot of its `size`, the legend of `series` under it | a dashboard tile, a page header | yes |
| `compact` | the plot alone at the height of an `xs` control (28 px), the dot on the point at rest; scrubbing shows the guide and the tooltip; at least 96 px wide | a DataTable cell or a list row: one trend per record next to its name or total | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `highlight` | the dot rests on that point; in `bars` the other bars are quieter; `null` — no point marked (a reading of the whole period) | the current period is not the last point (a year with empty months ahead) | the latest point |
| `min` · `max` | the scale spans at least this range; data outside widens it | one scale for a table column, a floor of zero | the data's own range |
| `reference` | a dashed chart-axis line at the value | a plan, a target, an average | — |
| `loading` | the plot Skeleton | the series is on its way | `false` |

Put it in a `Card` for a dashboard tile: the card's `Card.Label`, `Card.Value`, `Card.Delta` (`changeTone`) and `Card.Meta` hold the reading.

## States
| State | Driven by | DOM |
|---|---|---|
| at rest | `highlight` | the dot on the latest point or `highlight`; `null` hides it (cursor `data-hidden`) while the reading stands for the whole period |
| scrubbing | pointer, touch or the arrow keys | `data-scrubbing` on the root; the guide (and in `compact` the tooltip: `data-state="open"`, date · value, right of the pointer at its height, left of it only where the right has no room in the viewport; from the keyboard beside the point at mid-height) fade in (`fast`), the cursor (or the bar under the pointer) and a reading laid out from `useSparkline` follow with no easing (direct manipulation) |
| keyboard | arrows, Home, End on the focused plot | `aria-valuenow` / `aria-valuetext`, `data-scrubbing`; the cursor moves to the point at once (keyboard steps are high-frequency); in `bars` the current bar keeps its fill, the others go quiet (`fast` opacity) |
| settle | pointer leaves, touch ends, focus leaves | back to the point at rest; the compact tooltip fades out (`fast`) |
| following | `point` set by another chart of the group (`point` / `onPointChange` shared) | `data-scrubbing`; the guide and the dots at that point (a compact tooltip only on the chart under the pointer or the keys); `null` returns every chart to rest |
| no data | a point with `value: null` | the line breaks (a point alone between gaps is a dot), no bar; shown, the value reads `labels.empty` and the dot fades out (`data-empty`), the guide marks the point |
| cut period | a dated period the series starts or ends inside | its label names its days («1–22 окт»); the line over it is dashed (`data-cut`), its bar hatched (`data-partial` on the slot) |
| several lines | `series` | the legend under the plot (`labels.legend`); the cursor puts a dot on every line; the spoken point lists every line (`labels.series`) |
| new step | another `grain` | the points of the new step cross-fade in like a new series |
| new series | a new `data` or `series` array | the chart cross-fades in (swap motion) |
| compact | `layout="compact"` | `data-layout="compact"` on the root; the point is spoken through `aria-valuetext` and shown in the tooltip |
| loading | `loading` | `aria-busy` on the root; the plot Skeleton; no slider until the data comes; the data cross-fades in |

## Layout & spacing
- Takes the width of its container; the plot is as high as its `size` (80 px at `m`) and inset by the dot radius so the cursor is never clipped. The smooth curve never leaves the plot: a monotone cubic does not overshoot the extremes.
- Bars share the width equally, 4 px apart; the zero line sits where 0 falls on the scale (the bottom when every value is positive).
- It draws no headline: the card lays out the reading of `useSparkline` (`Card.Label`, `Card.Value`, `Card.Delta`, `Card.Meta` in a `stat-trend` card) and places the plot where it wants it.
- A tile that opens: `Card.Link` with an `aria-label`. The link stretches over the card and the plot (a slider) stands above it, so a scrub never opens the tile.
- The pointer hits only the plot, never a line, a dot or a bar inside it: the cursor stays one arrow while scrubbing.
- The legend of `series` wraps on a narrow card, 16 between lines, 8 between a swatch and its name.
- `layout="compact"` fits a DataTable row of any tier (plot and dot within an `xs` control height) and takes the cell width, at least `--prime-space-24`; give the column a `width` for an even plot per row. Put the number next to it in its own column: the compact plot shows a value only in its tooltip while scrubbed.
- The tooltip is the compact plot's only, the kit's chart tooltip, placed like every anchored layer (`usePosition`): right of the pointer at its height, on the left only where the right has no room in the viewport — crossing the middle never moves it; from the keyboard right of the point at mid-height. Portaled, so a card or a table scroller never clips it.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `←` · `→` · `↓` · `↑` | Previous or next point: `←` / `↓` back, `→` / `↑` forward, as on a slider. |
| `Home` · `End` | First or last point. |
| `Tab` | Focuses the chart; leaving focus returns it to the point at rest (`highlight`). |
| `Escape` | Returns the chart to rest (and hides the compact tooltip). |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The plot is `role="slider"` named by `label`; `aria-valuetext` speaks the point («8 окт: 312 400 ₽», `labels.point`) and, with `series`, every line («; 2025: 280 000 ₽», `labels.series`); a point with no data speaks `labels.empty`. With `reference` the slider is described by `labels.reference` (`aria-describedby`).
- A headline laid out from `useSparkline` is plain text beside the plot and follows the point; its change carries a sign (`changeText`), never color alone; a negative bar goes down, not only red.
- The legend of `series` is a list named `labels.legend` (`role="list"`); each line has a swatch drawn like it and its name, so no line is told by color alone.
- While `loading` the root is `aria-busy` and the chart is not in the tab order yet.
- The compact tooltip is `aria-hidden`: it repeats `aria-valuetext` for sighted users. The plot carries `data-row-click-ignore` (and is a slider), so its pointer and keys never open a DataTable row.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `point` | `"{label}: {value}"` | Spoken value of the chosen point (`aria-valuetext`); `{label}` and `{value}` are replaced. |
| `period` | `"{first} – {last}"` | The `date` of a `useSparkline` reading at rest with `sum` / `average` / `value`; `{first}` and `{last}` are the first and last day or point. |
| `empty` | `"Нет данных"` | Shown and spoken in place of the value of a point with no data. |
| `reference` | `"Ориентир: {value}"` | Description of the chart with a `reference` line (`aria-describedby`); `{value}` is replaced. |
| `points` | `"{value} п. п."` | The `changeText` of `useSparkline` with `changeUnit="points"`; `{value}` is the signed difference. |
| `quarter` | `"{quarter} кв."` | The name of a quarter point of a dated series; `{quarter}` is its Roman number («III кв.»). |
| `series` | `"{label}: {value}"` | One line of `series` in the spoken point and its value; `{label}` and `{value}` are replaced. |
| `legend` | `"Линии графика"` | The accessible name of the legend of `series`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Revenue for 30 days in a KPI card: the card lays out the reading — the total against the previous 30 days and the period — and the plot under it; drag across the plot to see a day — `useSparkline`, `summary`, `compareTo`, `formatValue`, `label`. |
| [variants.tsx](examples/variants.tsx) | The same week as an area, a bare line, a dashed and a dotted line and bars from zero — `variant`. |
| [sizes.tsx](examples/sizes.tsx) | One week of orders at every tier, from a 40 px plot to a 128 px one — `size`. |
| [states.tsx](examples/states.tsx) | While the series loads the plot is a Skeleton of its own height that cross-fades into the data — `loading`. |
| [compact.tsx](examples/compact.tsx) | Revenue by month per client in a list: the plot alone at a row's height with the dot on the current month, scrubbing shows the month in a tooltip, the label is the chart's accessible name — `layout`, `label`. |
| [signed-bars.tsx](examples/signed-bars.tsx) | Monthly profit with a sign: losses go below the zero line, the current month rests highlighted and any bar shows its value under the pointer or the arrows — `variant`, `highlight`. |
| [series.tsx](examples/series.tsx) | Revenue this year as an area against last year dotted and the plan dashed: each line has its color and look, the legend names them and gives their values at the point — `series`. |
| [combo.tsx](examples/combo.tsx) | Revenue by month as bars with the plan as a dashed line over them, both on one scale and named in the legend — `variant`, `series`. |
| [curve.tsx](examples/curve.tsx) | The same month of active users as a smooth curve, straight segments and steps — `curve`. |
| [reference.tsx](examples/reference.tsx) | Checkout conversion against its plan: a dashed reference line, the scale from zero to 5% and the change over the whole period in percentage points — `reference`, `min`, `max`, `change`, `changeUnit`. |
| [lower-is-better.tsx](examples/lower-is-better.tsx) | First response time by day, where a fall is good: growth paints the change red, a fall green — `better`, `summary`, `compareTo`. |
| [own-value.tsx](examples/own-value.tsx) | Unique clients in dialogs: the period's own count is neither the sum nor the mean of the days, so the card passes it with the previous period's count — `value`, `compareTo`. |
| [gaps.tsx](examples/gaps.tsx) | Daily API requests with days the collector was down: the line breaks over a missing day and the reading says there is no data — `data`, `labels`. |
| [period.tsx](examples/period.tsx) | Another period swaps the days and the step follows them — a month by days, a quarter by weeks, a year by months; the line cross-fades in and the card reads the new total — `data`, `summary`. |
| [grain.tsx](examples/grain.tsx) | A year of daily revenue with a step switcher the card lays out from the reading: the current period is cut at today, hatched, and compared with the same days of the one before — `grains`, `setGrain`, `change`. |
| [shared-grain.tsx](examples/shared-grain.tsx) | One step for every KPI tile: the switcher above them sets it, each tile reads its latest period against the one before — `grain`, `aggregate`, `change`. |
| [controlled.tsx](examples/controlled.tsx) | The KPI tiles of a dashboard follow one cursor: a scrub on any tile moves the point and the reading of all, no tooltip repeats the readings, and each tile opens its section — `point`, `onPointChange`, `size`. |

## Mistakes
- A new array on every render (`data={rows.map(...)}` inline) → the line cross-fades on every render; memoize the series.
- Formatting inside `label` of a point («312 400 ₽») → the point label is its name («8 окт»); format values with `formatValue`.
- A Sparkline without a container width (inside an inline flex row) → give it a width or put it in a `Card`.
- A value, a change or a date computed by hand next to the plot, or a reading and a plot given different options → one `useSparkline`, its reading in the card, `{...reading.plot}` on the plot.
- A Tooltip or a chart library tooltip wrapped around the chart → the card's reading follows the point; a compact plot draws its own tooltip.
- A daily flow (revenue per day) with the latest day as the card's value → `summary="sum"`: the card is about the period; pass `compareTo` for its change.
- A missing day as `0` → the line dives to zero; pass `value: null`, the line breaks and the reading says there is no data.
- Compact sparklines in a column, each on its own scale, when rows must be compared by size → pass the column's `min` / `max` to every row.
- A flat plan drawn as a second line → `reference`; a plan that changes by period → a `dashed` line in `series`.
- Two Sparklines stacked to compare this year with last → one Sparkline with the comparison in `series`.
- Lines of `series` told apart by color alone, or several solid lines in one plot → give each its own `variant` (`dotted` for the past, `dashed` for a plan) and a `label`.
- Response time, costs or bounce rate with growth painted green → `better="lower"`.
- A conversion's change in percent of itself («+62%» for 2,1% → 3,4%) → `changeUnit="points"` («+1,3 п. п.»).
- A median or a unique count forced into `summary="sum"` / `"average"`, or a chart dropped for it → pass the period's own `value` with `compareTo`.
- A grey box while the series loads → `loading`.
- A full Sparkline squeezed into a table cell → `layout="compact"`.
- A row of KPI tiles too tall with an 80 px plot, or `--sparkline-h` set from outside → `size="s"`.
- KPI tiles of one period scrubbed one by one → share `point` and `onPointChange` across their readings.
- Days folded into weeks or months by hand, with labels written for each step → pass the days as `{ date, value }` and set `grain` (a card's switcher from `grains` / `setGrain`).
- A current month compared with the whole previous month («−30%» on the 22nd) → dated points with `change="previous"`: a cut period compares with the same days.
- A level (MRR, a balance) summed over a week → `aggregate="latest"` (the default with `summary="latest"`); a flow under a `latest` reading → `aggregate="sum"`.
- A grain switcher in every tile of one dashboard → one `grain` for all from a switcher of the page.
- A tile with a Sparkline made a link with `Card asChild` + `<a>` → a slider inside a link; use `Card.Link` with an `aria-label`.

## Related
- **Built from:** [Skeleton](../skeleton/COMPONENT.md) (loading), `ChartTooltip` (the chart tooltip shared with ChartFrame), [ScrollContainer](../scroll-container/COMPONENT.md) (the tooltip's floating panel)
- **See also:** [ChartFrame](../chart-frame/COMPONENT.md), [DataTable](../data-table/COMPONENT.md) (a compact Sparkline per row), [Card](../card/COMPONENT.md), [ProgressBar](../progress-bar/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md)
