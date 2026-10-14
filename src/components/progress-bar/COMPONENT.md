# ProgressBar

**Category:** status
**Kind:** primitive

> Linear progress: one value on a native `<progress>`, `segments` that split a whole (storage by type, leads by source) with an optional legend, or a ranking of rows (top cities, a funnel).

## When to use
- Determinate progress of an operation: file upload, import, export (`value`).
- How much of a quota or a set of steps is done («Профиль: 3 из 5 шагов») (`value` + `max`).
- How a whole splits into parts: used space by file type, tasks by status (`segments`, `max`); categories wear `color`, meanings wear `tone`; `legend` adds color · name · value · share.
- A ranking «label · value · share — bar»: top cities, reasons, funnel steps (`layout="rows"`, `scale`).
- Per-row progress inside lists (FileUpload rows render it).

## When not to use
- A compact radial indicator or KPI ring → use [ProgressCircle](../progress-circle/COMPONENT.md) (same `value` / `segments` API).
- Unknown duration → use [Spinner](../spinner/COMPONENT.md); ProgressBar has no indeterminate mode.
- Navigation through wizard steps → use [Stepper](../stepper/COMPONENT.md).
- A trend over time → use [Sparkline](../sparkline/COMPONENT.md) or a chart on `chartColors`.

## Import
```tsx
import { ProgressBar, type ProgressSegment } from "prime-ui-kit";
```

## Anatomy
```
ProgressBar              <div>; size, tone (value mode), aria-busy while loading
├─ header                label (ellipsis) + percentage (showValue, aria-hidden)
└─ value mode:           <progress> (transparent, for assistive tech) + drawn line
   segments mode:        <div role="group"> — parts pill + free rest; hidden distribution text
   └─ legend             <ul>: swatch · name · value · share per part (legend)
   rows layout:          <ol> — per part: label · value · share over its own bar
   loading:              Skeleton bar (+ legend / row lines) in the same geometry
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### ProgressBar
`ref` → `HTMLDivElement` (the root). Pass `value` (value mode: a native `<progress>`, transparent, under the drawn line) or `segments` (segments mode: a `role="group"` bar of parts described by the legend or the distribution text; `layout="rows"` — an `<ol>`), never both.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Line thickness 4 → 8 px (`--prime-control-<tier>-track`, shared with Slider) and label type. |
| `label` | `string` | — | Visible label above the line and its accessible name; a value bar without it needs `aria-label`. |
| `showValue` | `boolean` | `false` | Shows the rounded filled percentage at the end of the label row (`aria-hidden`); `bar` layout only. |
| `loading` | `boolean` | `false` | The data is on its way: a Skeleton in the bar's geometry cross-fades into the data; the label stays. Pass the last known `value` or `segments` (or `0` / `[]`). |
| `value` | `number` | — | Value mode: the current value, clamped to `0…max`. |
| `max` | `number` | `100` (value mode), the sum of the parts (segments mode) | Value mode: top of the scale. Segments mode: total capacity; a `max` above the sum of the parts leaves the rest as track. |
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"accent"` | Value mode: fill color, telling the outcome. |
| `steps` | `boolean` | `false` | Value mode: draws the scale as `max` equal cells (2–12), each filled whole; `value` rounds to a cell. For a level out of a few: password strength, onboarding steps. |
| `segments` | `ProgressSegment[]` | — | Segments mode: parts in order, `{ value, label?, tone? \| color? }`: `tone` names a meaning (default `accent`), `color` a category, as in its charts. Each part's width is its share of `max`. |
| `segmentGap` | `"none" \| "hairline"` | `"none"` | Segments mode: `none` — one continuous pill; `hairline` — every part and the rest are separate pills. `bar` layout. |
| `legend` | `boolean` | `false` | Segments mode: a legend under the bar, one row per part: color · name · value · share; it becomes the group's description. `bar` layout. |
| `formatValue` | `(value: number) => string` | Russian digit groups | Segments mode: display of a part's value in the legend and the rows («1 840 000 ₽»). |
| `layout` | `"bar" \| "rows"` | `"bar"` | Segments mode: `bar` — every part in one bar; `rows` — a ranking: an `<ol>`, one row per part with label · value · share over its own bar. |
| `scale` | `"sum" \| "max" \| "first"` | `"sum"` | Segments mode: `rows` only: what 100% is. `sum` — bars and shares of the total (`max` raises it); `max` — the leader is a full bar, shares stay of the total; `first` — bars and shares against the first row (a funnel). |
| `labels` | `Partial<ProgressBarLabels>` | — | Segments mode: built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className`, `data-*` and the other div attributes on the root; `aria-label` names the bar when there is no `label`. |

## Variants

### tone (value mode or each segment)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `accent` | accent fill on a `fill-strong` track | progress in flight, the main share | yes |
| `neutral` | `text-secondary` fill | quiet background work, «other» share | |
| `success` | success fill | finished operations, done share | |
| `warning` | warning fill | quota almost used, pending share | |
| `danger` | danger fill | failed or interrupted operation, overdue share | |
| `info` | info fill | informational processes (sync, indexing) | |

### color (each segment, instead of tone)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `blue` · `orange` · `teal` · `yellow` · `pink` · `green` · `purple` · `red` | the hue's step of the chart palette (`--prime-color-chart-1…8`, `--hue-chart`) | categories with no meaning of good or bad: sources, platforms, regions — the same color the category has in charts | |
| `gray` | `--prime-color-chart-other` | the «Прочее» share | |
| `sky` | the palette's sky solid (no chart step: it sits too close to blue) | only when the category is sky elsewhere in the product | |

### layout (segments mode)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `bar` | every part in one bar, optional legend under it | parts of one whole | yes |
| `rows` | one row per part: label · value · share over its own bar | a ranking: top cities, reasons, funnel steps | |

### scale (`rows`)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `sum` | bars and shares of the total | parts of a whole («доля от всех заказов») | yes |
| `max` | the leader is a full bar, shares of the total | a top list where the gap to the leader matters | |
| `first` | bars and shares against the first row | a funnel: each step as a share of the first | |

### segmentGap
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `none` | one continuous pill, flat joints, a round cap on the track | parts of a single process | yes |
| `hairline` | every part and the free rest are separate pills with a ¾T gap | distinct categories (file types, statuses) | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | line 4px, label 12/16 | dense tables, inline rows | |
| `s` | line 5px, label 12/16 | compact lists | |
| `m` | line 6px, label 13/20 | default | yes |
| `l` | line 7px, label 14/20 | a prominent single progress | |
| `xl` | line 8px, label 14/20 | onboarding, dashboards | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `showValue` | secondary `NN%` at the end of the header | uploads, quotas — the user tracks the number | `false` |
| `legend` | rows of swatch · name · value · share under the bar | a distribution the reader compares in numbers | `false` |
| `loading` | a Skeleton bar (and legend or row lines) in the same geometry | the data is on its way | `false` |

## States
| State | Driven by | DOM |
|---|---|---|
| tone / size | props | `data-tone` (value mode), `data-size` on the root |
| value | `value`, `max` | native `value` / `max`; the drawn pill slides by `translate` over `slow` + `standard`, RTL aware |
| segments | `segments`, `max`, `segmentGap` | `data-segment-gap` on the group, `data-tone` or `data-color` per part; widths animate by `flex-grow` over `slow` |
| rows | `layout="rows"`, `scale` | `data-layout="rows"` on the root, an `<ol>`; each bar slides like the value pill |
| loading | `loading` | `aria-busy` on the root; Skeletons in place of the bar, the legend or the rows; the data cross-fades in (`swapMotion`) |
| steps | `steps` (value mode) | `data-steps="true"` on the bar; `max` cells (2–12), filled ones `data-filled`; a cell fills from its start edge (`base` · emphasized), cells of one change go half a stagger step apart — from the start when filling, from the end when emptying |
| empty segments | `segments` empty or all `0` | only the track; accessible text `labels.empty` / `labels.allEmpty` |
| reduced motion | `prefers-reduced-motion` | fill, widths and cells change instantly |

Always controlled: pass the current `value` or `segments` on every render.

## Layout & spacing
- `width: 100%` of the parent; the header is a row with the label (ellipsis) and the value.
- Label → line: the tier `label-gap` (`--prime-space-1` xs/s, `--prime-space-2` m–xl). The label is primary, medium weight; the percentage secondary, tabular numbers.
- Bar → legend `--prime-space-3` (12). Rows (`layout="rows"`) are 12 apart, each header 4 above its bar: the label (secondary, truncates) takes the free width, the value (primary, medium) and the share (muted, at least 4ch) line up at the end in tabular numbers.
- `hairline` gaps and `steps` cells are ¾ of the line thickness apart.
- Stack several bars with `--prime-space-4`–`--prime-space-5`.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No keyboard interaction.

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- Value mode: native `<progress>` — role `progressbar` with value and max.
- Segments mode: `role="group"`; its text lists the shares of `max` («Видео: 38%, Документы: 21%»). With `label` (or `aria-label`) the group is named by it and described by the distribution — or by the legend when `legend` is on; without a name the distribution is the name.
- Rows: an `<ol>` named by `label`; each row reads as text («Москва 1 284 52%»), the bars are `aria-hidden`.
- A category color always sits beside its name (legend, row), so color is never the only cue.
- Without `label`, pass `aria-label`, otherwise a value bar has no accessible name.
- The `showValue` percentage is `aria-hidden`; while `loading` the root is `aria-busy` and the Skeletons are `aria-hidden`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `empty` | `"Нет сегментов"` | Accessible text when `segments` is empty. |
| `allEmpty` | `"Все сегменты пусты"` | Accessible text when every segment is 0. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | An import in progress with its name and percentage — `value`, `label`, `showValue`. |
| [variants.tsx](examples/variants.tsx) | Every fill color; the tone tells the outcome, not the progress — `tone`. |
| [sizes.tsx](examples/sizes.tsx) | Every tier: the line grows from 4 to 8 px like the Slider track — `size`. |
| [states.tsx](examples/states.tsx) | Loading takes the bar's own geometry, so the data lands without a jump — `loading`. |
| [custom-max.tsx](examples/custom-max.tsx) | A scale of steps instead of percent: 3 of 5 profile steps — `max`. |
| [segments.tsx](examples/segments.tsx) | Parts of a whole in one bar: joined or separate pills, free capacity up to `max` and an empty list with its own spoken text — `segments`, `segmentGap`, `max`, `labels`. |
| [legend.tsx](examples/legend.tsx) | Shares of categories in their chart colors with a legend of color · name · value · share — `color`, `legend`, `formatValue`. |
| [ranking.tsx](examples/ranking.tsx) | Rankings as rows of label · value · share over a bar: top cities against the leader and a funnel against its first step — `layout`, `scale`. |
| [steps.tsx](examples/steps.tsx) | The scale as whole cells that fill one after another: 2 of 5 onboarding steps, forward and back — `steps`, `max`. |
| [milestone.tsx](examples/milestone.tsx) | A rare milestone: the last invoice of the quarter fills the bar, the tone turns success and a short confetti burst marks it — `value`, `tone`, `celebrate()`. |

## Mistakes
- No `label` and no `aria-label` → the bar has no accessible name.
- `value` and `segments` together → a type error; pick one mode.
- `tone` on the root with `segments` → set `tone` on each segment.
- A «Свободно» segment for free space → pass `max`; the rest stays track.
- `showValue` with a count scale («3 из 5») → put the count into `label`.
- A fake value as a spinner → use [Spinner](../spinner/COMPONENT.md).
- Categories (sources, platforms) painted with `tone` → `tone` says good or bad; categories take `color`, the same as in their charts.
- The number written into `label` of each row of a hand-built ranking → `layout="rows"` with `formatValue`.
- A grey box while the data loads → `loading` draws the Skeleton in the bar's geometry.

## Related
- **Built from:** [Skeleton](../skeleton/COMPONENT.md)
- **See also:** [ProgressCircle](../progress-circle/COMPONENT.md), [Slider](../slider/COMPONENT.md), [FileUpload](../file-upload/COMPONENT.md), [Spinner](../spinner/COMPONENT.md)
