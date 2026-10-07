# ProgressCircle

**Category:** feedback
**Kind:** primitive

> Circular progress — the ring version of ProgressBar: one value or `segments` that split a whole, with status colors and optional content in the center.

## When to use
- Compact metrics and goals in cards and dashboards (84% of plan).
- Progress where horizontal space is short: table cells, list rows.
- A value on a custom scale shown as a ring («7/12»).
- A compact breakdown of a whole: tasks by status, storage by type (`segments`).

## When not to use
- Progress with a label and width to spare (uploads, imports) → use [ProgressBar](../progress-bar/COMPONENT.md).
- A breakdown with many parts or long labels → [ProgressBar](../progress-bar/COMPONENT.md) with `segments`.
- Unknown duration → use [Spinner](../spinner/COMPONENT.md); ProgressCircle is always determinate.

## Import
```tsx
import { ProgressCircle, type ProgressSegment } from "prime-ui-kit";
```

## Anatomy
```
ProgressCircle           <div>; size, tone (value mode), children in the center
├─ svg                   role="progressbar" (value) or role="group" (segments); track + arcs
├─ description           visually hidden distribution (segments with aria-label)
└─ inner                 children in the hole of the ring (not on xs / s)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### ProgressCircle
`ref` → `HTMLDivElement` (the root). Props of both modes; pass either `value` (value mode) or `segments` (segments mode), never both.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Diameter 24 · 32 · 48 · 64 · 80 px; the stroke is 1/12 of it. |
| `children` | `ReactNode` | — | Content in the center (number, percent, `Icon`). Not rendered on `xs` / `s`; a string or number stays available as `aria-valuetext`. |
| `aria-label` | `string` | — | Accessible name of the ring (set on the svg). Always pass it. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className`, `data-*` and the other div attributes on the root. |

### ProgressCircle · value mode
The svg is `role="progressbar"`: a track and one round-capped arc.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — (required) | The current value, clamped to `0…max`. |
| `max` | `number` | `100` | Top of the scale. |
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"accent"` | Arc color, telling the outcome. |

### ProgressCircle · segments mode
The svg is `role="group"`: parts clockwise from the top, described by the distribution text.

| Prop | Type | Default | Description |
|---|---|---|---|
| `segments` | `ProgressSegment[]` | — (required) | Parts in order, `{ value, label?, tone? }` (`tone` default `accent`); each part's length is its share of `max`. |
| `max` | `number` | — | Total capacity. Default: the sum of the parts (they close the ring); a larger `max` leaves the rest as track. |
| `segmentGap` | `"none" \| "hairline"` | `"none"` | `none` — one continuous ring; `hairline` — every part and the rest are separate round arcs. |
| `labels` | `Partial<ProgressCircleLabels>` | — | Built-in strings, see Labels. |

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 24 diameter, no inner content | inline in text or table cells | |
| `s` | 32 diameter, no inner content | list rows, compact cards | |
| `m` | 48 diameter, inner text 12/16 | KPI tiles | yes |
| `l` | 64 diameter, inner text 16/24 | dashboard cards | |
| `xl` | 80 diameter, inner text 18/24 | hero metrics, breakdowns | |

The stroke is always 1/12 of the diameter.

### tone (value mode or each segment)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `accent` | accent arc on a `fill-strong` track | progress toward a goal, the main share | yes |
| `neutral` | `text-secondary` arc | quiet background work, «other» share | |
| `success` | success arc | goal reached, done share | |
| `warning` | warning arc | at risk, quota almost used | |
| `danger` | danger arc | failed, overdue share | |
| `info` | info arc | informational processes (sync, indexing) | |

### segmentGap
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `none` | one continuous ring, flat joints; with free capacity the filled share has round caps | parts of a single process | yes |
| `hairline` | every part and the free rest are separate round arcs; no track | distinct categories | |

## States
| State | Driven by | DOM |
|---|---|---|
| size / tone | props | `data-size`, `data-tone` (value mode) on the root |
| empty | `value` 0, or `segments` empty / all 0 | arc hidden, track only |
| value | `value`, `max` | `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax`; the arc glides by `stroke-dashoffset` over `slow` |
| segments | `segments`, `max`, `segmentGap` | `data-segment-gap` on the svg, `data-tone` on every arc and cap; arcs glide by dash, caps by `rotate` |
| reduced motion | `prefers-reduced-motion` | arcs change instantly |

Always controlled: pass the current `value` or `segments`.

## Layout & spacing
- `display: inline-flex`, never shrinks; a caption sits next to it with `--prime-space-3` or under it with `--prime-space-2`.
- Diameters sit on the 4px grid (`--prime-space-6…20`); the ring geometry is in viewBox units.

## Accessibility

### Keyboard
No keyboard interaction.

### ARIA
- Value mode: the svg is `role="progressbar"` with `aria-valuenow` / `-min` / `-max`; a string or number child becomes `aria-valuetext`.
- Segments mode: the svg is `role="group"`; with `aria-label` it is described by the distribution («Видео: 38%, Документы: 21%»), without it the distribution is its name.
- Always pass `aria-label`: a caption next to the ring is not linked to it.
- The inner text is `aria-hidden` when it is already the `aria-valuetext`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `empty` | `"Нет сегментов"` | Accessible text when `segments` is empty. |
| `allEmpty` | `"Все сегменты пусты"` | Accessible text when every segment is 0. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A plan ring with the percentage in the center, named for screen readers — `value`, `aria-label`. |
| [variants.tsx](examples/variants.tsx) | Every arc color; the tone tells the outcome, not the progress — `tone`. |
| [sizes.tsx](examples/sizes.tsx) | Diameters 24 to 80 px; the center text is not rendered on `xs` and `s` — `size`. |
| [inner-content.tsx](examples/inner-content.tsx) | The center holds a percentage, a count on its own scale or an icon — `children`, `max`. |
| [segments.tsx](examples/segments.tsx) | Parts of a whole clockwise from the top: a closed ring, free capacity up to `max`, separate arcs and an empty list — `segments`, `segmentGap`. |

## Mistakes
- No `aria-label` (even with a visible caption) → screen readers get an unnamed progressbar.
- Text inside an `xs` / `s` ring → it is not rendered; show it outside.
- `value` and `segments` together → a type error; pick one mode.
- `tone` on the root with `segments` → set `tone` on each segment.
- Long text inside the ring → it is clipped to the inner circle.

## Related
- **Built from:** —
- **See also:** [ProgressBar](../progress-bar/COMPONENT.md), [Card](../card/COMPONENT.md), [Spinner](../spinner/COMPONENT.md)
