# ChartFrame

**Category:** data-display
**Kind:** composite

> A dashboard panel around any chart — Recharts, ECharts, visx, Chart.js or a hand-drawn SVG — with the title, a headline value, a measured plot area, a series legend, a tooltip body and a data table for screen readers.

## When to use
- A chart with axes or several series on a dashboard or a report page: revenue by month, invoices by week, leads by source.
- Any chart library that should look like the kit: the panel, the type of axis labels, the legend, the tooltip and the loading / empty / error states come from ChartFrame, the plot from the library.
- A library that needs explicit `width` and `height` (Chart.js, visx, Recharts without `ResponsiveContainer`): `renderPlot` hands it the measured size.

## When not to use
- A single number with its trend in a tile → [Sparkline](../sparkline/COMPONENT.md) (in a `Card`).
- Shares of a whole or a ranking → [ProgressBar](../progress-bar/COMPONENT.md) with `segments` or `layout="rows"`, [ProgressCircle](../progress-circle/COMPONENT.md).
- Exact values to read, sort or compare row by row → [DataTable](../data-table/COMPONENT.md).
- A KPI without a chart → [Card](../card/COMPONENT.md) `variant="stat-trend"`.

## Import
```tsx
import { ChartFrame, type ChartFrameSeries, chartColors } from "prime-ui-kit";
```

## Anatomy
```
ChartFrame.Root              <figure>; surface of the depth ladder; state, series, hidden series
├─ ChartFrame.Header         <div>; title column · actions
│  ├─ ChartFrame.Title       <h3>; names the figure and the table
│  ├─ ChartFrame.Description <p>; describes the figure
│  └─ ChartFrame.Actions     <div>; period switch, export
├─ ChartFrame.Value          <div>; headline number (Skeleton while loading)
│  └─ ChartFrame.Delta       <span>; change with a tone
├─ ChartFrame.Plot           <div>; fixed height, measured; Crossfade of plot / Skeleton / empty / error
├─ ChartFrame.Legend         <ul>; a toggle button per series: swatch · name · value
├─ ChartFrame.Table          <table>; visually hidden data, ready state only
└─ ChartFrame.Tooltip        <div>; with `point` portaled beside that point of the plot, else in place for a library's tooltip hook
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### ChartFrame.Root
`ref` → `HTMLElement` (`<figure>`). The panel: a surface of the depth ladder, a figure named by `ChartFrame.Title` and described by `ChartFrame.Description`, `aria-busy` while loading. Owns the state, the series and which of them are hidden; every part reads them.

| Prop | Type | Default | Description |
|---|---|---|---|
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | `"ready"` | What the chart region shows: the plot, Skeletons while `loading`, the empty state, or the load error with a retry (`onRetry`). Changes cross-fade at the same height. |
| `series` | `ChartFrameSeries[]` | `[]` | The series in drawing order, `{ id, label, color?, value? }`: legend entries, tooltip rows, table columns and `renderPlot` colors. `color` is a palette hue; `value` is the legend summary. |
| `hiddenSeries` | `string[]` | — | Ids of the series turned off in the legend (controlled). |
| `defaultHiddenSeries` | `string[]` | `[]` | Initially hidden series (uncontrolled). |
| `onHiddenSeriesChange` | `(hiddenSeries: string[]) => void` | — | The legend turned a series on or off; gets the new list of hidden ids. |
| `formatValue` | `(value: number) => string` | Russian digit groups | Display of a value in the legend, the tooltip and the table («8,4 млн ₽»). |
| `onRetry` | `() => void \| Promise<void>` | — | Loads the data again from the `error` state and shows the retry button; a returned Promise keeps the button loading until it settles. |
| `labels` | `Partial<ChartFrameLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `className` and the other figure attributes. |

### ChartFrame.Header
`ref` → `HTMLDivElement`. The top zone: title and description in the first column, `ChartFrame.Actions` at the end, under them when the panel is narrower than 24rem.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other div attributes. |

### ChartFrame.Title
`ref` → `HTMLHeadingElement`. The name of the chart; names the figure and the data table.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `"h2" \| "h3" \| "h4"` | `"h3"` | Heading level that fits the page outline; the look does not change. |
| `…rest` | `HTMLAttributes<HTMLHeadingElement>` | — | `className` and the other heading attributes. |

### ChartFrame.Description
`ref` → `HTMLParagraphElement`. What the chart measures and over which period; describes the figure.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLParagraphElement>` | — | `className` and the other p attributes. |

### ChartFrame.Actions
`ref` → `HTMLDivElement`. Controls of the chart in the header: a period switch, an export button.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other div attributes. |

### ChartFrame.Value
`ref` → `HTMLDivElement`. The headline number (heading-m, tabular) with an optional `ChartFrame.Delta` beside it; a Skeleton of its geometry while loading, a muted dash after a load error (the number is unknown).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other div attributes. |

### ChartFrame.Delta
`ref` → `HTMLSpanElement`. The change of the headline value («+12% к сентябрю»); the sign is in the text.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color of the change: `success` — good, `danger` — bad; independent of the sign. |
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `className` and the other span attributes. |

### ChartFrame.Plot
`ref` → `HTMLDivElement`. The plot area of a fixed height that measures itself (ResizeObserver). Loading, empty and error cross-fade in its place. SVG text inside takes the caption type in the muted color; a mark with `data-hidden="true"` fades out.

| Prop | Type | Default | Description |
|---|---|---|---|
| `height` | `number \| "fill"` | `240`, `160` under `30rem` | Height of the plot area in px. `fill` takes the free height of a stretched panel (a `PageContent.Cell` with `rows`), the default height at least. |
| `renderPlot` | `(area: ChartFramePlotArea) => ReactNode` | — | Renders the chart at the measured `{ width, height }` with every series `{ id, label, color, hidden }` — for libraries that need explicit sizes (Chart.js, visx). |
| `children` | `ReactNode` | — | A chart that sizes itself to its container (an SVG with a `viewBox`, `ResponsiveContainer`); it fills the area. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other div attributes. |

### ChartFrame.Legend
`ref` → `HTMLUListElement`. The root's series as entries — swatch, name, summary value — each a toggle button that shows or hides its series. Renders nothing without series.

| Prop | Type | Default | Description |
|---|---|---|---|
| `readOnly` | `boolean` | `false` | Entries only name the series and do not toggle them. |
| `…rest` | `HTMLAttributes<HTMLUListElement>` | — | `className` and the other ul attributes. |

### ChartFrame.Tooltip
`ref` → `HTMLDivElement`. The kit's chart tooltip: with `point` it floats beside that point of the plot; without it it is the body for a library's tooltip hook (Recharts `content`). Inside `ChartFrame.Root`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | The point the rows belong to («Неделя 41»). |
| `items` | `ChartFrameTooltipItem[]` | — (required) | `{ id, value }` per series at that point; name and color come from the root's series, rows of hidden series are left out, values go through `formatValue`. |
| `point` | `{ x: number; y: number } \| null` | — | A point in `renderPlot` coordinates (the pointer, or the point the arrows reached): the tooltip floats right of it, left only without room; `null` hides it. Floating, it is `aria-hidden`. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other div attributes. |

### ChartFrame.Table
`ref` → `HTMLTableElement`. The chart's data as a visually hidden table for screen readers, named by the title: a row per point, a column per shown series. Present only in the `ready` state. A visible table is a `DataTable`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `rows` | `ChartFrameTableRow[]` | — (required) | `{ label, values }` per point; `values` by series id, a missing one reads as «—». |
| `…rest` | `HTMLAttributes<HTMLTableElement>` | — | `className` and the other table attributes. |

## Variants

### Delta tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | secondary text | no judgement (no change, a reference figure) | yes |
| `success` | success text | the change is good (revenue up, overdue down) | |
| `warning` | warning text | the change needs attention | |
| `danger` | danger text | the change is bad | |

### Plot
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `renderPlot` | the chart drawn at the measured `{ width, height }`, called once the area has a size | the library needs explicit sizes, or the drawing computes positions in px | |
| `children` | the chart stretched to the area | the chart sizes itself (an SVG with a `viewBox`, `ResponsiveContainer`) | |
| `height` | the area's height in px | the chart needs more or less room than 240 px | 240, 160 under 30rem |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `Legend readOnly` | entries without hover or press | the series cannot be turned off (a stacked total that must add up) | `false` |

### Colors
- A series without `color` takes `chartColors.series[index]` by its place in `series`; past the eighth it is `chartColors.other`. Hiding a series never shifts the colors of the others.
- `color` (a palette hue) maps to the same chart step as everywhere in the kit (`blue` → `chart-1`, `orange` → `chart-2` …, `gray` → `chart-other`), so a category matches its ProgressBar share; `sky` has no chart step and keeps its palette solid (too close to blue).
- `renderPlot` gets each series with its `color` as a CSS value (`var(--prime-color-chart-*)`): pass it to the library as is; the theme switches with no re-render. Gridlines are `chartColors.grid`, the axis line `chartColors.axis`.

## States
| State | Driven by | DOM |
|---|---|---|
| ready | `state="ready"` | `data-state="ready"` on the root; the plot; the legend values; `ChartFrame.Table` present |
| loading | `state="loading"` | `data-state="loading"` and `aria-busy` on the root; Skeletons of the value, the plot and the legend values; the title, actions and legend names stay |
| empty | `state="empty"` | `data-state="empty"` on the root; EmptyPage `compact` (`role="status"`, `labels.empty`) in the plot's place |
| error | `state="error"` | `data-state="error"` on the root; the value is a muted dash; EmptyPage `compact` `tone="danger"` (`role="alert"`, `labels.error`) with the retry button when `onRetry` is set; it waits for a returned Promise |
| swap | `state` changes | the plot region cross-fades (Crossfade, the height stays); the value and legend values fade in from their Skeletons |
| series hidden | a legend toggle, `hiddenSeries` | `aria-pressed="false"`, `data-hidden` on the entry: it keeps its place and color, the swatch becomes a ring, the name quiet; `renderPlot` gets `hidden: true` — a mark with `data-hidden="true"` fades out, the axes keep their scale |
| hover / press | pointer on a legend entry | hover fill (hover-capable pointers only), press scale |

## Layout & spacing
- The root takes its container's width, card padding and radius, zones 16 px apart; on the page it carries the raised whisper, nested in a surface it is a flat tile one step deeper.
- The header puts the title and the description in the first column and the actions at the end; under 24rem of panel width the actions drop under the description.
- The plot is 240 px high (160 px under 30rem of panel width) unless `height` is set; it never changes height between states.
- Legend entries wrap onto more lines; each has a 44 px touch hit area on coarse pointers.
- `ChartFrame.Tooltip` is the floating layer of the ladder with the point's label over rows of swatch · series name · value. With `point` the kit places it like every anchored layer (`usePosition`): right of the point at its height, on the left only where the right has no room in the viewport, inside the viewport, following the plot on scroll. Without `point` the chart library positions it (Recharts `content`).
- SVG `<text>` in the plot takes the caption type in `--prime-color-text-muted`; a class of your own still wins.
- Works from 320 px; the container queries are on the panel's own width, so it adapts in a grid cell as on a phone.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | The header actions, then the legend as one stop (the entry focused last), then the chart's own focusable marks. |
| `←` · `→` · `↑` · `↓` | Previous or next legend entry, wrapping. |
| `Home` · `End` | First or last legend entry. |
| `Enter` · `Space` | Shows or hides the entry's series. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The root is a `<figure>` named by `ChartFrame.Title` and described by `ChartFrame.Description`; `aria-busy` while loading.
- A legend entry is a button with `aria-pressed` — pressed while its series is shown; the legend list is named by `labels.legend`. A hidden series differs by the swatch's shape (a ring) and a quiet name, never by color alone.
- `ChartFrame.Table` is a visually hidden table with the chart's data, named by the title: a row header per point, a column per shown series, values through `formatValue`.
- A `ChartFrame.Tooltip` with `point` is `aria-hidden` and passive (no focus, no presses; `Escape` hides it until the point moves): it repeats what the plot speaks — give a focusable plot an `aria-valuetext`, like the slider in the tooltip example.
- The empty state is `role="status"`, the error `role="alert"` with the retry button.
- The drawing is the library's: hide a decorative SVG (`aria-hidden`) when `ChartFrame.Table` carries the data; marks you make focusable need their own `aria-label`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `empty` | `"Нет данных за период"` | Title of the empty state. |
| `error` | `"Не удалось загрузить график"` | Title of the error state. |
| `retry` | `"Повторить"` | Text of the retry button in the error state. |
| `legend` | `"Ряды графика"` | Accessible name of the legend. |
| `category` | `"Период"` | Header of the first column of `ChartFrame.Table` (what a row is). |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Revenue by month as a hand-drawn SVG line chart in a dashboard panel: the headline with its change, a period switch, a legend that turns series off and a table for screen readers — `series`, `formatValue`, `renderPlot`. |
| [tooltip.tsx](examples/tooltip.tsx) | Invoices by week as grouped bars: the kit tooltip follows the pointer with a row per series, the arrows step through the weeks — `ChartFrame.Tooltip`, `items`, `point`. |
| [fill-height.tsx](examples/fill-height.tsx) | Revenue against the plan beside two KPI tiles: the plot takes the height of the stretched grid cell, and the plan line starts hidden until the legend turns it on — `height`, `defaultHiddenSeries`. |
| [states.tsx](examples/states.tsx) | Loading, empty, error and data swap in the plot's place without moving the panel; the error retries, and the legend of the one series only names it — `state`, `onRetry`, `readOnly`. |
| [controlled.tsx](examples/controlled.tsx) | Lead sources with totals in the legend; the hidden series live in the page state and one button shows them all again — `hiddenSeries`, `onHiddenSeriesChange`. |
| [narrow.tsx](examples/narrow.tsx) | A 320px column: the actions drop under the title, the plot gets lower and a self-sizing SVG stretches to it — `children`, `height`. |

### With a chart library
```tsx
// Recharts: explicit sizes from renderPlot, the kit tooltip body in `content`.
<ChartFrame.Root series={SERIES} formatValue={formatRubles}>
  <ChartFrame.Header>
    <ChartFrame.Title>Выручка</ChartFrame.Title>
  </ChartFrame.Header>
  <ChartFrame.Plot
    renderPlot={({ width, height, series }) => (
      <LineChart width={width} height={height} data={rows}>
        <CartesianGrid stroke={chartColors.grid} vertical={false} />
        <XAxis dataKey="month" stroke={chartColors.axis} />
        <YAxis stroke={chartColors.axis} />
        <Tooltip
          content={({ label, payload }) => (
            <ChartFrame.Tooltip
              label={label}
              items={(payload ?? []).map((p) => ({ id: String(p.dataKey), value: Number(p.value) }))}
            />
          )}
        />
        {series.map((s) => (
          <Line key={s.id} dataKey={s.id} stroke={s.color} hide={s.hidden} dot={false} />
        ))}
      </LineChart>
    )}
  />
  <ChartFrame.Legend />
  <ChartFrame.Table rows={tableRows} />
</ChartFrame.Root>
```
ECharts and Chart.js take the same `width`, `height` and `series[i].color`; their HTML tooltips are strings, so use their own tooltip there or `ChartFrame.Tooltip` with `point` from their hover event.

## Mistakes
- Colors picked per chart (`#3b82f6`) → `series[i].color` from `renderPlot`, or `chartColors`; status tones (`success`, `danger`) never paint categories.
- Unmounting a hidden series → the line disappears in one frame; keep it with `data-hidden={hidden}` so it fades, or let the library animate it (`hide`).
- A spinner or a grey box while the data loads → `state="loading"`.
- An empty chart with axes and no data → `state="empty"`.
- A legend for a single series → the title already names it; leave `ChartFrame.Legend` out.
- Two y-axes of different measures in one frame → two ChartFrames side by side.
- The data only in the drawing → add `ChartFrame.Table`; screen readers cannot read a plot.
- A hand-drawn chart with its tooltip placed by hand (a `foreignObject`, clamped coordinates) → `ChartFrame.Tooltip` with `point`: it flips only when out of room and never jumps at the middle.

## Related
- **Built from:** [Crossfade](../crossfade/COMPONENT.md) (state swap), [Skeleton](../skeleton/COMPONENT.md) (loading), [EmptyPage](../empty-page/COMPONENT.md) (empty, error, retry), `Icon`, `chartColors`, `ChartTooltip` (the chart tooltip shared with Sparkline), [VisuallyHidden](../visually-hidden/COMPONENT.md)
- **See also:** [Sparkline](../sparkline/COMPONENT.md), [Card](../card/COMPONENT.md), [ProgressBar](../progress-bar/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md)
