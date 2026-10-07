# ProgressBar

**Category:** feedback
**Kind:** primitive

> Linear progress: one value on a native `<progress>`, or `segments` that split a whole (storage by type, task statuses), with a label, a percentage and status colors.

## When to use
- Determinate progress of an operation: file upload, import, export (`value`).
- How much of a quota or a set of steps is done («Профиль: 3 из 5 шагов») (`value` + `max`).
- How a whole splits into parts: used space by file type, tasks by status (`segments`, `max`).
- Per-row progress inside lists (FileUpload rows render it).

## When not to use
- A compact radial indicator or KPI ring → use [ProgressCircle](../progress-circle/COMPONENT.md) (same `value` / `segments` API).
- Unknown duration → use [Spinner](../spinner/COMPONENT.md); ProgressBar has no indeterminate mode.
- Navigation through wizard steps → use [Stepper](../stepper/COMPONENT.md).

## Import
```tsx
import { ProgressBar, type ProgressSegment } from "prime-ui-kit";
```

## Anatomy
```
ProgressBar              <div>; size, tone (value mode)
├─ header                label (ellipsis) + percentage (showValue, aria-hidden)
└─ value mode:           <progress> (transparent, for assistive tech) + drawn line
   segments mode:        <div role="group"> — parts pill + free rest; hidden distribution text
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### ProgressBar
`ref` → `HTMLDivElement` (the root). Props of both modes; pass either `value` (value mode) or `segments` (segments mode), never both.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Line thickness 4 → 8 px (`--prime-control-<tier>-track`, shared with Slider) and label type. |
| `label` | `string` | — | Visible label above the line and its accessible name. |
| `showValue` | `boolean` | `false` | Shows the rounded filled percentage at the end of the label row (`aria-hidden`). |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className`, `data-*` and the other div attributes on the root; `aria-label` names the bar when there is no `label`. |

### ProgressBar · value mode
A native `<progress>` (transparent, for assistive tech) under the drawn line.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — (required) | The current value, clamped to `0…max`. |
| `max` | `number` | `100` | Top of the scale. |
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"accent"` | Fill color, telling the outcome. |

### ProgressBar · segments mode
A `role="group"` bar of parts, named by `label` and described by the distribution text.

| Prop | Type | Default | Description |
|---|---|---|---|
| `segments` | `ProgressSegment[]` | — (required) | Parts in order, `{ value, label?, tone? }` (`tone` default `accent`); each part's width is its share of `max`. |
| `max` | `number` | — | Total capacity. Default: the sum of the parts; a larger `max` leaves the rest as track. |
| `segmentGap` | `"none" \| "hairline"` | `"none"` | `none` — one continuous pill; `hairline` — every part and the rest are separate pills. |
| `labels` | `Partial<ProgressBarLabels>` | — | Built-in strings, see Labels. |

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

## States
| State | Driven by | DOM |
|---|---|---|
| tone / size | props | `data-tone` (value mode), `data-size` on the root |
| value | `value`, `max` | native `value` / `max`; the drawn pill slides by `translate` over `slow` + `standard`, RTL aware |
| segments | `segments`, `max`, `segmentGap` | `data-segment-gap` on the group, `data-tone` per part; widths animate by `flex-grow` over `slow` |
| empty segments | `segments` empty or all `0` | only the track; accessible text `labels.empty` / `labels.allEmpty` |
| reduced motion | `prefers-reduced-motion` | fill and widths change instantly |

Always controlled: pass the current `value` or `segments` on every render.

## Layout & spacing
- `width: 100%` of the parent; the header is a row with the label (ellipsis) and the value.
- Label → line: the tier `label-gap` (`--prime-space-1` xs/s, `--prime-space-2` m–xl).
- Stack several bars with `--prime-space-4`–`--prime-space-5`.

## Accessibility

### Keyboard
No keyboard interaction.

### ARIA
- Value mode: native `<progress>` — role `progressbar` with value and max.
- Segments mode: `role="group"`; its text lists the shares of `max` («Видео: 38%, Документы: 21%»). With `label` (or `aria-label`) the group is named by it and described by the distribution; without a name the distribution is the name.
- Without `label`, pass `aria-label`, otherwise a value bar has no accessible name.
- The `showValue` percentage is `aria-hidden`.

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
| [custom-max.tsx](examples/custom-max.tsx) | A scale of steps instead of percent: 3 of 5 profile steps — `max`. |
| [segments.tsx](examples/segments.tsx) | Parts of a whole in one bar: joined or separate pills, free capacity up to `max` and an empty list — `segments`, `segmentGap`, `max`. |

## Mistakes
- No `label` and no `aria-label` → the bar has no accessible name.
- `value` and `segments` together → a type error; pick one mode.
- `tone` on the root with `segments` → set `tone` on each segment.
- A «Свободно» segment for free space → pass `max`; the rest stays track.
- `showValue` with a count scale («3 из 5») → put the count into `label`.
- A fake value as a spinner → use [Spinner](../spinner/COMPONENT.md).

## Related
- **Built from:** —
- **See also:** [ProgressCircle](../progress-circle/COMPONENT.md), [Slider](../slider/COMPONENT.md), [FileUpload](../file-upload/COMPONENT.md), [Spinner](../spinner/COMPONENT.md)
