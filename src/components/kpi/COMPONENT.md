# Kpi

**Category:** data-display
**Kind:** primitive

> A KPI card: one figure and what it means — its title and period, the value, the change with what it compares, and an optional icon, chart, progress or actions.

## When to use
- A KPI tile on a dashboard or a list page: revenue, new clients, overdue — one `Kpi.Root` per figure, each in a `Page.Cell` of the page's `Page.Grid`.
- A figure with its trend: `useSparkline` reads the series, the card lays out its value, change and period and holds the `Sparkline` in `Kpi.Media`; scrubbing the chart moves all three.
- A figure against a target (a `ProgressBar` to the plan) or split by stage (a `ProgressBar` with `segments` and `legend`).
- A record's facts in a drawer: dense rows of two or four (`valueSize="m"`), or facts whose value is a phrase («Выдать PCX 160», `valueSize="s"`).
- Related figures of one block in one card (conversion · average order) — `Kpi.Group`.
- A figure that opens its report as a whole — `asChild` with a link.

## When not to use
- A block whose subject is not one figure — a form, a record with its facts and actions, a list, a cover tile, a chart with a legend → [Card](../card/COMPONENT.md).
- A record's total at the end of its card → `Card.Total`; many label–value facts of one record → [DescriptionList](../description-list/COMPONENT.md).
- A chart with axes, a legend and its states → [ChartFrame](../chart-frame/COMPONENT.md).
- A short status of an object → [Badge](../badge/COMPONENT.md).

## Import
```tsx
import { Kpi } from "prime-ui-kit";
```

## Anatomy
```
Kpi.Root valueSize? loading? size? flat? asChild?     the card (the kit's Card)
  head    Kpi.Icon? · Kpi.Title
                     Kpi.Description? · Kpi.Period?    the line under the title, the period last
          Kpi.Actions?                                 the top end
  figure  Kpi.Value
          Kpi.Delta? · Kpi.Meta?                       the change row under the value
  media   Kpi.Media?                                   a Sparkline, a ProgressBar, a breakdown
Kpi.Group                                              one card, its Kpi.Root are cells
```

The parts take these places whatever order they are written in; a block without its parts is not drawn.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Kpi.Root
`ref` → `HTMLDivElement` (the card). A KPI card: the kit's `Card` with one figure inside. The parts take fixed places whatever their order: the head, the value over its change row, the media at the bottom.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | The card's tier: its padding and the tier of the controls in `Kpi.Actions`; the type roles stay. |
| `valueSize` | `"s" \| "m" \| "l"` | `"l"` | The step of `Kpi.Value`, one for a row: `l` heading-l, `m` heading-m (dense rows, a drawer), `s` body-m medium — a value that is a line of text. |
| `loading` | `boolean` | `false` | The figure is loading: the value, the change and the reference line show a Skeleton in their geometry, the card is `aria-busy`; the data fades in. The head stays. |
| `flat` | `boolean` | `false` | No raised shadow: a flat tile for dense grids. |
| `asChild` | `boolean` | `false` | The whole card is one link or button (`Card.Root asChild`): its only child holds the parts; a link draws the corner arrow. No actions inside. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the parts), `className` and the other div attributes of the card. |

### Kpi.Icon
`ref` → `HTMLDivElement`. The 40px accent tile of one icon, leading the title, centred on its two lines.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Kpi.Title
`ref` → `HTMLDivElement`. What the figure is: title-s, semibold, one line, cut.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Kpi.Description
`ref` → `HTMLSpanElement`. What the figure counts («Оплаченные счета»): body-s, muted, on the line under the title, before the period.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Kpi.Period
`ref` → `HTMLSpanElement`. The time the figure stands for: an interval («1–31 окт») or a moment («на 22 окт, 09:40»); always last on the line under the title, in the secondary ink.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Kpi.Actions
`ref` → `HTMLDivElement`. The top end of the card: a button, a menu, a period or grain switch, 8 apart, centred on the title.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Kpi.Value
`ref` → `HTMLSpanElement`. The figure: tabular, the step of `valueSize`. A `Badge.Root` inside stands beside the text, 8 apart.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "success" \| "warning" \| "danger"` | — | The ink by meaning (an amount due is `warning`). |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Kpi.Delta
`ref` → `HTMLSpanElement`. The change: a `Badge` one step below the card on its own row under the value, so a value that changes width never moves it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number \| null` | — | The signed change: its sign turns the arrow up or down (half a turn); `0` or none — no arrow. `useSparkline` gives it as `change`. |
| `tone` | `"neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color by meaning, not by sign (churn up is `danger`); `useSparkline` gives it as `changeTone`. |
| `reading` | `KpiDeltaReading` | — | A series reading (`useSparkline`): its `change`, `changeTone` and `changeText` in place of `value`, `tone` and the text; no change — no part. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Kpi.Meta
`ref` → `HTMLSpanElement`. The reference line after the change: what it compares with, what backs the figure («к сентябрю · 3,56 млн ₽»). body-s, muted, tabular.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "success" \| "warning" \| "danger"` | — | The ink by meaning; without it the line is muted. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Kpi.Media
`ref` → `HTMLDivElement`. A `Sparkline`, a `ProgressBar` or a breakdown: the full width, kept to the bottom so the cards of a row line it up.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Kpi.Group
`ref` → `HTMLDivElement` (the card). Related figures in one card: each `Kpi.Root` inside is a cell, equal columns, a faint line between them; stacked below 22rem.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | The tier of the group's card. |
| `flat` | `boolean` | `false` | No raised shadow. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the `Kpi.Root` cells), `className` and the other div attributes of the card. |

## Variants

### valueSize (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `l` | heading-l, tabular | the figure of a dashboard row | yes |
| `m` | heading-m | dense rows of four, a record's figures in a drawer | |
| `s` | body-m medium, the size of the text | a value that is a phrase: the fact cards of a record | |

### tone (Value · Delta · Meta)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | the neutral Badge (Delta), the primary ink (Value), muted (Meta) | a change or a value with no good or bad meaning | yes (Delta) |
| `success` | the success Badge / `success-text` | the change is good, a payment | |
| `warning` | the warning Badge / `warning-text` | needs attention, an amount due | |
| `danger` | the danger Badge / `danger-text` | the change is bad | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `loading` | the value, the change and the reference line hold a Skeleton in their geometry; the data fades in | the report is on its way | `false` |
| `flat` | the card without its raised shadow | dense grids of tiles | `false` |
| `asChild` | the card is the link or button it wraps: the corner arrow, a lift on hover, a press, the focus ring | the whole figure opens its report | `false` |

## States
| State | Driven by | DOM |
|---|---|---|
| value step | `valueSize` | `data-value-size` on the box inside the card; the value's text role |
| loading | `loading` | `aria-busy` on the card; `data-loading` on `Kpi.Value`, `Kpi.Delta`, `Kpi.Meta`, each holding a `Skeleton`; on `false` the data fades in under the same element (`useSwapIn`, foundation §1 rule 7) |
| change direction | `Kpi.Delta` `value` | the arrow of the Badge (`data-down` turns it half a turn), none for `0` or no value |
| scrubbed point | a `useSparkline` reading | the value, the period and the change follow the point; the change keeps its row, so nothing moves |
| card | `size`, `flat`, `asChild`, nesting | the kit's Card: `data-size`, `data-depth`, `data-flat`, `data-interactive` |
| card width | container queries | below 22rem actions with a labelled button or link drop under the title and share its width (icon buttons, a switch, a mark stay in the corner); the description gives way before the period, which is never cut |
| group width | container queries | below 22rem the cells of a `Kpi.Group` stack, the line between them across |

## Layout & spacing
- The card is the kit's `Card` with the figure in its `Card.Body`: its padding follows the card tier (16 · 20 · 24), its depth the surfaces around it — inside a drawer or another card it is the next layer, a flat tile.
- Three blocks 16 apart. The head: `Kpi.Icon` (40, 12 before the text), the title (title-s, semibold, one line, cut) over the line under it (body-s, muted): `Kpi.Description` · `Kpi.Period`, the period always last in the secondary ink and never cut (the description gives way); `Kpi.Actions` at the end, centred on the two lines — below 22rem actions with a labelled button drop under the title and share its width. The figure: the value on one line (its unit never wraps away; a phrase at `valueSize="s"` may wrap), and 4 under it the change row on one line — the `Kpi.Delta` Badge, then `Kpi.Meta`, 8 apart, the reference line cut — so the card keeps its height while a scrubbed reading changes. The media: kept to the bottom, so the cards of a row line their charts and bars up.
- The change has a row of its own: a value that changes width — a point scrubbed on the chart — never moves it.
- Time has one place, the end of the line under the title (`Kpi.Period`): an interval for a flow («1–31 окт», «Октябрь»), a moment for a state («на 22 окт, 09:40»). What the change compares with goes in `Kpi.Meta` («к сентябрю», «за неделю»). A period the whole row shares is set once above it (a switch in `Page.Tools`) and the cards drop their period line; a state keeps its moment. The freshness of the data («обновлено в 09:40») is said once, in the page's description.
- A card with its own step or period switch puts it in `Kpi.Actions`; with `useSparkline` the switch sets `setGrain` and `Kpi.Period` shows the reading's `date`.
- A card that opens (`asChild` with a link) draws the arrow in its top corner; the title keeps clear of it (`--corner-mark-room`). Nothing interactive inside such a card: no `Kpi.Actions`.
- `Kpi.Group` sets its cells in equal columns, 20 to each side of a faint line; below 22rem they stack, 16 to each side of the line.
- Cards of one row take one `valueSize`.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | A card with `asChild` is one stop; otherwise the stops are the controls in `Kpi.Actions` and the chart in `Kpi.Media`. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- A card with a `Kpi.Title` is `role="group"` named by it (`aria-labelledby`), so a screen reader moving through a grid of cards hears the figure's name first; a link or a button card (`asChild`) is named by its own text.
- The title, the period, the value and the change read in order. Name the change in words (the `Kpi.Delta` text carries its sign), never by its tone alone.
- A `loading` card is `aria-busy`; its Skeletons are decorative (`aria-hidden`). The dot between the description and the period is `aria-hidden`.
- The icon in `Kpi.Icon` and the arrow of `Kpi.Delta` are decorative; controls in `Kpi.Actions` need their own names.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A row of KPI cards: the title over what the figure counts and its period, the value, and the change with what it compares under it — `Kpi.Title`, `Kpi.Period`, `Kpi.Value`, `Kpi.Delta`, `Kpi.Meta`. |
| [variants.tsx](examples/variants.tsx) | The change in every tone, chosen by its meaning and not by its sign: churn up is bad, the arrow still shows where it went — `Kpi.Delta`, `tone`. |
| [sizes.tsx](examples/sizes.tsx) | The card at every tier: the padding steps 16 · 20 · 24 and the button in its actions takes the tier, the text keeps its roles — `size`. |
| [states.tsx](examples/states.tsx) | A card while its report loads next to the loaded one: the title and the period stay, the value, the change and the reference line hold their place — `loading`. |
| [with-icon.tsx](examples/with-icon.tsx) | An icon tile leading the title and the line under it, centred on both — `Kpi.Icon`. |
| [chart.tsx](examples/chart.tsx) | Revenue by day with its trend: the card reads the series — the total of 1–22 October against the same days of September at rest, a day against the day before while scrubbing — and switches the step in its actions; orders by week as bars — `useSparkline`, `Kpi.Period`, `Kpi.Delta`, `Kpi.Actions`, `Kpi.Media`. |
| [progress.tsx](examples/progress.tsx) | A figure against its target and a figure split by stage: a bar to the plan with what is left, and the leads of the month by stage with a legend — `Kpi.Media`, `ProgressBar`. |
| [actions.tsx](examples/actions.tsx) | Actions in the top end of the card: a button for the step it calls for, a menu for the rest; the figure and its change stay in their places — `Kpi.Actions`. |
| [text-values.tsx](examples/text-values.tsx) | Fact cards of a record whose value is a line of text in one style, a phrase and a number alike, one of them in a tone — `valueSize`, `tone`. |
| [grouped.tsx](examples/grouped.tsx) | Related figures of one block in one card, a faint line between them: each figure keeps its own title, value and change — `Kpi.Group`. |
| [fixed-size.tsx](examples/fixed-size.tsx) | A record's figures in a drawer-width column, two and four to a row, every value one denser step — `valueSize`. |
| [link.tsx](examples/link.tsx) | Cards that are links to their reports: one tab stop each, the corner arrow, a lift on hover and the focus ring; the title keeps clear of the arrow — `asChild`. |
| [shared-period.tsx](examples/shared-period.tsx) | One period for the whole row: the switch above the cards sets it once, the cards drop their own period line, and a state keeps its moment — `Kpi.Period`. |
| [narrow.tsx](examples/narrow.tsx) | On a narrow card the title and the line under it cut, the actions keep their corner, and a group stacks its figures below 22rem — `Kpi.Actions`, `Kpi.Group`. |

## Mistakes
- A KPI laid out by hand in a `Card` (a label, a big number, a change in your own spans) → `Kpi.Root` with its parts.
- `Kpi.Root` wrapped in a `Card.Root` → it is the card already.
- The period written into the title («Выручка за октябрь») or under the value → the title names the figure, `Kpi.Period` holds the time.
- The change and the comparison in one string of the Badge («+18% к сентябрю») → the change in `Kpi.Delta`, the comparison in `Kpi.Meta`.
- `Kpi.Delta tone="success"` for every «+» → the tone by meaning, the arrow by `value`.
- A change of a scrubbed point counted by hand → `useSparkline` gives it for the point and for the period at rest: `<Kpi.Delta reading={reading} />`, `<Kpi.Period>{reading.date}</Kpi.Period>`.
- `value`, `tone` and the text of `Kpi.Delta` copied one by one from a reading, under your own check for an empty change → `reading`: it takes all three and draws nothing when there is no change.
- The same period repeated on every card of a row that shares one → set it once above the row, drop `Kpi.Period`.
- Buttons laid out by hand beside the title or under the figure → `Kpi.Actions`.
- A `Typography` inside `Kpi.Value` to change its size → `valueSize`; cards of one row at different value sizes → one `valueSize` for the row.
- Skeletons placed by hand → `Kpi.Root loading`, the parts mounted.
- Two figures split by your own border in one card → `Kpi.Group`.

## Related
- **Built from:** [Card](../card/COMPONENT.md) (the surface, its tier, depth and link), [Badge](../badge/COMPONENT.md) (the change), [Skeleton](../skeleton/COMPONENT.md) (the loading parts), `Icon` (the trend arrow), `internal/iconBox` (the icon tile), `internal/RegionSwap` (the data fades in)
- **See also:** [Sparkline](../sparkline/COMPONENT.md) (`useSparkline` reads a series for the card), [ProgressBar](../progress-bar/COMPONENT.md), [Card](../card/COMPONENT.md), [DescriptionList](../description-list/COMPONENT.md), [ChartFrame](../chart-frame/COMPONENT.md), [Page](../../layout/page/COMPONENT.md) (`Page.Grid` for a row of cards)
