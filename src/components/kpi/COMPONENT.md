# Kpi

**Category:** data-display
**Kind:** composite

> A KPI card: one figure and what it means — the head says what it is, the value and the line under it say how much and for when; the size decides which parts the card holds.

## When to use
- A figure on a dashboard or a list page: revenue, new clients, overdue — one `Kpi.Root` per figure, each in a `Page.Cell` of the page's `Page.Grid`, one size per row.
- A strip of 6–8 figures over a table or in a side panel — `size="s"`.
- A figure with its trend: `useSparkline` reads the series, the card lays out its value, change and period and holds the `Sparkline` in `Kpi.Media`; scrubbing the chart moves all three.
- A figure against its target (a `ProgressBar` in `Kpi.Media`) or made of parts (a `ProgressBar` of ticks and `Kpi.Legend` in the footer; on XL a ring beside the legend).
- The lead figure of a screen with its breakdown, totals or a note that asks for action — `size="l"` or `"xl"`.
- A figure that opens its report as a whole — `asChild` with a link, or `Kpi.Link` in the title when the card holds a chart.

## When not to use
- A block whose subject is not one figure — a form, a record with its facts and actions, a list, a chart with a legend → [Card](../card/COMPONENT.md).
- A record's label–value facts (a drawer, a profile) → [DescriptionList](../description-list/COMPONENT.md).
- A chart with axes, a legend and its states → [ChartFrame](../chart-frame/COMPONENT.md).
- A short status of an object → [Badge](../badge/COMPONENT.md).

## Import
```tsx
import { Kpi } from "prime-ui-kit";
```

## Anatomy
```
Kpi.Root size? loading? asChild?          the card
  head     Kpi.Icon?                      L, XL
           Kpi.Title (Kpi.Link?)          required; a link in it opens the card
           Kpi.Description?               L, XL — under the title
           Kpi.Actions?                   M, L, XL — the top end; S: Kpi.Period stands here
  figure   Kpi.Value (Kpi.Unit?) · Kpi.Delta?
           Kpi.Period? · Kpi.Meta?        M, L, XL — the line under the value
  media    Kpi.Media?                     M, L, XL
  footer   Kpi.Footer?                    M — Kpi.Legend only; L, XL
             Kpi.Legend · Kpi.Note · Kpi.Total · DescriptionList
```

The parts take these places whatever order they are written in; a part the size does not hold renders nothing.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Kpi.Root
`ref` → `HTMLDivElement` (the card). A KPI card: one figure and what it means. Its size decides which parts it holds; a part it does not hold renders nothing. The parts take fixed places whatever their order.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | The set of parts and their scale: `s` a strip of 6–8 figures, `m` the default, `l` a figure that needs explaining, `xl` the lead figure of a screen. `xs` takes `s`. |
| `loading` | `boolean` | `false` | The figure is loading: the value, the change, the period and the note show a Skeleton in their geometry, the legend its rows; the card is `aria-busy`. The head stays. |
| `asChild` | `boolean` | `false` | The whole card is one link or button: its only child holds the parts; it lifts on hover and presses. No actions inside. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the parts), `className` and the other div attributes of the card. |

### Kpi.Icon
`ref` → `HTMLDivElement`. L and XL: the accent tile of one icon before the title, 40 on L, 48 on XL (the frame's mark) — as tall as the title with its description.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Kpi.Title
`ref` → `HTMLDivElement`. What the figure is, required: one line, cut. 13/16 · 13/16 · 14/20 · 16/24 by size (S · M · L · XL), the title role of the frame a step under the Card's.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Kpi.Link
`ref` → `HTMLAnchorElement`. Inside `Kpi.Title`: the link that opens the figure's report. It stretches over the card while a chart or a control inside stays its own — the way to open a card with a `Sparkline`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `asChild` | `boolean` | `false` | Render the router's link element instead of an `<a>`. |
| `…rest` | `AnchorHTMLAttributes<HTMLAnchorElement>` | — | `href`, `children`, `className` and the other anchor attributes. |

### Kpi.Description
`ref` → `HTMLDivElement`. L and XL: what exactly the figure counts («Оплаченные счета»), 13/20 on L, 14/20 on XL, muted, under the title, one line, a `StatusDot` first allowed; cut before the title.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Kpi.Actions
`ref` → `HTMLDivElement`. M, L, XL: the right slot of the head — one badge, menu or button at the top end. The controls take the size of the card's frame, a step under the card's size (M `s` · L `m` · XL `l`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Kpi.Value
`ref` → `HTMLSpanElement`. The figure: tabular, one line; 20/28 · 24/32 · 30/36 · 36/44 by size.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

### Kpi.Unit
`ref` → `HTMLSpanElement`. Inside `Kpi.Value`: the unit after the figure (₽, %, ч, «млн ₽»), about 0.6 of it and muted; it never grows the line.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

### Kpi.Delta
`ref` → `HTMLSpanElement`. The change: a `Badge` right of the value on its line (16 · 20 · 20 · 24). No base to compare with — leave it out.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number \| null` | — | The signed change: its sign turns the arrow up or down; `0` or none — no arrow. `useSparkline` gives it as `change`. |
| `tone` | `"neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color by meaning, not by sign (churn up is `danger`); `useSparkline` gives it as `changeTone`. |
| `reading` | `KpiDeltaReading` | — | A series reading (`useSparkline`): its `change`, `changeTone` and `changeText` in place of `value`, `tone` and the text; no change — no part. |
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

### Kpi.Period
`ref` → `HTMLSpanElement`. The time the figure stands for («1–22 окт», «Октябрь», «на 22 окт, 09:40»): at the end of the head on S, the start of the line under the value on M, L and XL. Never cut.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

### Kpi.Meta
`ref` → `HTMLSpanElement`. M, L, XL: the note after the period on the line under the value — new data only (a plan, a threshold, what the figure is made of). Cut first.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

### Kpi.Media
`ref` → `HTMLDivElement`. M, L, XL: one picture under the value — a `Sparkline` or a `ProgressBar`, the full width, kept to the bottom. The controls inside take the size two steps under the card.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Kpi.Footer
`ref` → `HTMLDivElement`. The last part, the card padding below the rest, no line: one kind of new data. M holds only `Kpi.Legend`; L adds `Kpi.Note` and two `Kpi.Total`; XL four totals and a `DescriptionList` breakdown.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Kpi.Note
`ref` → `HTMLDivElement`. In `Kpi.Footer`: one phrase about what needs attention after a `StatusDot` of its tone; cut, never wrapped.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "success" \| "warning" \| "danger"` | `"warning"` | The color of the dot; the phrase says the meaning. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Kpi.Total
`ref` → `HTMLDivElement`. In `Kpi.Footer`: a secondary figure — its label over its value, one column of a row of up to four (two on L).

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — (required) | What the figure is («Счетов»). |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Kpi.Legend
`ref` → `HTMLDivElement`. In `Kpi.Footer`: the rows of the parts — color, name, value, share. With `ring` on XL a 2xl `ProgressCircle` stands left of them; otherwise draw the parts in `Kpi.Media` (a `ProgressBar` of ticks).

| Prop | Type | Default | Description |
|---|---|---|---|
| `segments` | `ProgressSegment[]` | — (required) | The parts, the same as the bar or the ring they explain. |
| `max` | `number` | the sum of the parts | 100% of a share. |
| `formatValue` | `(value: number) => string` | — | The display of a part's value («8 364»). |
| `ring` | `boolean` | `false` | XL: the ring of the parts left of the rows. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children" \| "color">` | — | `className` and the other div attributes of the legend (of the ring's root with `ring`). |

## Variants

### size (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `s` | frame xs (padding 12, radius 12); the title 13/16 and the period on one line, the value 20/28 with its change; nothing else | a strip of 6–8 figures, a side panel | |
| `m` | frame s (padding 16, radius 12); the title 13/16 with the slot (a badge, a menu), the value 24/32, the line 12/16, the media, the legend | the default row of 4–5 | the host tier, else `m` |
| `l` | frame m (padding 20, radius 16); the icon 40, the title 14/20 over the description (13/20), a button in the slot, the value 30/36, the line 13/20, a footer: a note or two totals | a row of 3, a figure that needs explaining | |
| `xl` | frame l (padding 24, radius 16); the icon 48, the title 16/24 over the description (14/20), controls 40, the value 36/44, the line 14/20, a footer: four totals, a breakdown, the ring beside its legend | the lead figure of a screen, one or two to a row | |

`xs` takes `s`. The frame is the Card's, a step under the card's size (S `xs` · M `s` · L `m` · XL `l`): the title labels the figure, the figure is the headline. The controls in `Kpi.Actions` take the frame's tier: S `xs` · M `s` · L `m` · XL `l`. `Kpi.Media` keeps its charts light by a rule of its own, not the frame's: the card's tier two steps down — M `xs`, L `s`, XL `m` (a Sparkline 40 · 48 · 80, ticks 16 · 20 · 24).

### tone (Delta · Note)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | the neutral Badge; a muted dot | a change with no good or bad meaning, a zero change | yes (Delta) |
| `success` | the success Badge; a green dot | the change is good — revenue up, costs down | |
| `warning` | the warning Badge; an orange dot | close to a threshold, needs attention | yes (Note) |
| `danger` | the danger Badge; a red dot | the change is bad — churn up, overdue up | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `loading` | the value, the change, the period and the note hold a Skeleton in their geometry, the legend its rows; the data fades in | the report is on its way | `false` |
| `asChild` | the card is the link or button it wraps: a lift on hover, a press, the focus ring | the whole figure opens its report | `false` |
| `ring` (Legend) | on XL the 2xl ProgressCircle of the parts stands left of the legend rows | the lead figure made of parts | `false` |

## States
| State | Driven by | DOM |
|---|---|---|
| size | `size`, the host tier | `data-size` on the card (`xs` → `s`); a part the size does not hold is not rendered |
| loading | `loading` | `aria-busy` on the card; `data-loading` on `Kpi.Value`, `Kpi.Delta`, `Kpi.Period`, `Kpi.Meta`, each holding a `Skeleton`; on `false` the data fades in under the same element (`useSwapIn`, foundation §1 rule 7) |
| change direction | `Kpi.Delta` `value` | the arrow of the Badge (`data-down` turns it half a turn), none for `0` or no value |
| scrubbed point | a `useSparkline` reading | the value, the period and the change follow the point; the change stays on the value's line |
| surface | nesting, `asChild` | `data-depth` from the surfaces around it; `data-interactive` on a link or button card |

## Layout & spacing
- The card is a surface of the depth ladder on the Card's frame a step under its size (`internal/surfaceFrame`): padding 12 · 16 · 20 · 24, gap 8 · 12 · 16 · 20 between its blocks and radius 12 · 12 · 16 · 16 for S · M · L · XL. It fills its grid cell; cards of a row stretch to one height and the media keeps to the bottom, so their charts line up.
- The head answers «what it is» and holds no date (except S). S: the title and the period on one line. M, L, XL: the kit's header row (`internal/headerRow`) — M the title and the slot; L, XL the icon tile as tall as the title with its description (40 · 48), the title, the description (one line, a `StatusDot` first allowed), the slot. A header without a description centres the slot on the title line.
- The slot holds one thing — a badge, a menu or (from L) a button — at the end; it never shrinks, the title gives way. Two actions are one menu; buttons are filled.
- The figure: the value and its change on one line, on one baseline; the line never wraps — S and M write a large sum short («8,7 млн ₽»), L and XL in full. `Kpi.Unit` is about 0.6 of the value and muted, and it never grows the line.
- The line under the value (M, L, XL): the period, then a dot and the note. The period is never cut; the note is cut first. Each part is optional: a row that shares one period sets it once above the row and its cards drop `Kpi.Period`.
- The media (M, L, XL): one picture, the full width, no axes and no dates — the period stands right above it.
- The footer, the card padding below the rest, no line: one kind of new data, never a repeat of the head or the figure. A legend whenever the media is parts or a ring (the only footer of M); a note, up to two totals (L) or four (XL); a `DescriptionList align="end"` breakdown on XL.
- Nothing wraps and nothing leaves the card. The title, the description, the period, the note, the totals and the legend rows are one line each, cut with an ellipsis; the slot and the change never shrink; the value is cut last — a value that does not fit asks for the short form or a larger size, not a narrower font.
- A card that opens: `asChild` with a link makes the whole card the link — nothing interactive inside, no `Kpi.Actions`; a card with a chart or a control opens through `Kpi.Link` in its title instead, which stretches over the card while the chart and the controls stay their own.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | A card with `asChild` is one stop; otherwise the stops are the controls in `Kpi.Actions` and the chart in `Kpi.Media`. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- A card with a `Kpi.Title` is `role="group"` named by it (`aria-labelledby`), so a screen reader moving through a grid of cards hears the figure's name first; a link or a button card (`asChild`) is named by its own text.
- The title, the value, the change and the line under it read in order. Name the change in words (the `Kpi.Delta` text carries its sign), never by its tone alone; the dot of `Kpi.Note` is decorative.
- While `loading` the card is `aria-busy` and the Skeletons are hidden from assistive tech.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Two standard cards of a row: the title, the value with its unit and change, the period and a note under it, a chart at the bottom — `Kpi.Title`, `Kpi.Value`, `Kpi.Unit`, `Kpi.Delta`, `Kpi.Period`, `Kpi.Meta`, `Kpi.Media`. |
| [sizes.tsx](examples/sizes.tsx) | One figure on four sizes, each with everything it holds: S — the title, the period, the value and the change; M adds a badge, the note and the chart; L the icon, the description, a button and totals; XL four totals and a menu — `size`. |
| [strip.tsx](examples/strip.tsx) | A strip of small cards over a table: the title and the period on one line, the value with its change under them; nothing else on S — `size`. |
| [actions.tsx](examples/actions.tsx) | The right slot of the head holds one thing: a badge or a menu on M, a button on L; it stands at the top end and never shrinks — `Kpi.Actions`. |
| [line.tsx](examples/line.tsx) | The line under the value: the period, then the note after a dot; each part is optional — a page with one shared period leaves the period out — `Kpi.Period`, `Kpi.Meta`. |
| [units.tsx](examples/units.tsx) | The unit after the figure, smaller and quieter: rubles, percent, hours, a figure without a unit; S and M write a large sum short — `Kpi.Unit`. |
| [tone.tsx](examples/tone.tsx) | The change by meaning, not by sign: churn up is danger with the arrow up, costs down is success with the arrow down, zero is neutral with no arrow, nothing to compare with — no badge — `Kpi.Delta`, `tone`. |
| [chart.tsx](examples/chart.tsx) | A chart under the value, read from the series: the value, the period and the change come from the reading at rest and follow a scrubbed point; revenue by day as a line, orders by week as bars — `Kpi.Media`, `Kpi.Delta`, `reading`, `useSparkline`. |
| [plan.tsx](examples/plan.tsx) | A figure against its target: a progress bar to the plan under the value, the plan and the time left in the line — `Kpi.Media`, `ProgressBar`. |
| [parts.tsx](examples/parts.tsx) | A figure made of parts: ticks of the parts under the value, their legend — color, name, value, share — in the footer; M shows up to three parts — `Kpi.Legend`, `Kpi.Footer`, `ProgressBar`. |
| [ring.tsx](examples/ring.tsx) | The lead figure made of parts: on XL the ring stands in the footer left of its legend, with no media above it — `Kpi.Legend`, `ring`. |
| [footer.tsx](examples/footer.tsx) | The footer holds one kind of new data: a note on L, totals in columns on L and XL, a breakdown in rows on XL — `Kpi.Footer`, `Kpi.Note`, `Kpi.Total`, `DescriptionList`. |
| [link.tsx](examples/link.tsx) | A card that opens its report: the whole card as one link when nothing inside is a control, or a link in the title that stretches over the card when it holds a chart — `asChild`, `Kpi.Link`. |
| [states.tsx](examples/states.tsx) | Loading: the value, the change and the line under it are Skeletons in their geometry, the head stays; the data fades in — `loading`. |
| [narrow.tsx](examples/narrow.tsx) | On a narrow card nothing wraps and nothing leaves it: the title, the line under the value and the totals are cut with an ellipsis, the value last; the slot keeps its corner — `size`. |

## Mistakes
- A KPI laid out by hand in a `Card` (a label, a big number, a change in your own spans) → `Kpi.Root` with its parts.
- `Kpi.Root` wrapped in a `Card.Root` → it is the card already.
- The period in the title («Выручка за октябрь») or repeated in the note («к 1–22 сен» under «1–22 окт») → the title names the figure, `Kpi.Period` holds the time once; the base of the change follows from it.
- The change and the comparison in one string of the Badge («+18% к сентябрю») → the change in `Kpi.Delta`, new data in `Kpi.Meta`.
- `Kpi.Delta tone="success"` for every «+» → the tone by meaning, the arrow by `value`.
- A unit typed into the value in the same size («8 704 000 ₽» as one string) → the figure, then `Kpi.Unit`.
- A full sum on S or M that does not fit («8 704 000 ₽») → write it short: «8,7» with `Kpi.Unit` «млн ₽».
- A legend under the bar in `Kpi.Media` (`ProgressBar legend`) → `Kpi.Legend` in `Kpi.Footer`.
- A ring alone in `Kpi.Media` → `Kpi.Legend ring` in the footer on XL; on M and L draw the parts as ticks.
- Two things in the slot (a badge and a button) → one; two actions are one menu.
- A card with a `Sparkline` made a link with `asChild` → a slider inside a link; use `Kpi.Link` in the title.
- Different sizes in one row → one size per row.
- A long title or note wrapped to two lines, or a card widened to fit it → shorten the text; the card keeps one line and cuts it.
- Skeletons placed by hand → `Kpi.Root loading`, the parts mounted.

## Related
- **Built from:** [Badge](../badge/COMPONENT.md) (the change), [DescriptionList](../description-list/COMPONENT.md) (the breakdown it keeps on XL), [ProgressCircle](../progress-circle/COMPONENT.md) (the 2xl ring of `Kpi.Legend`), [Skeleton](../skeleton/COMPONENT.md) (the loading parts), `Icon` (the trend arrow), [StatusDot](../status-dot/COMPONENT.md) (the note's dot, the description's state), `internal/iconBox` (the icon tile), `internal/surfaceFrame` (the Card's frame), `internal/headerRow` (the head of M, L, XL), `internal/ProgressLegend` (the legend rows), `internal/surfaceDepth` (the surface), `internal/press` (the link card), `internal/rowLink` (the stretched `Kpi.Link`), `internal/RegionSwap` (the data fades in)
- **See also:** [Sparkline](../sparkline/COMPONENT.md) (`useSparkline` reads a series for the card), [ProgressBar](../progress-bar/COMPONENT.md), [Card](../card/COMPONENT.md), [ChartFrame](../chart-frame/COMPONENT.md), [Page](../../layout/page/COMPONENT.md) (`Page.Grid` for a row of cards)
