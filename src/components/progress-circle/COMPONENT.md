# ProgressCircle

**Category:** feedback

> Circular progress — the ring version of ProgressBar: one value or `segments` that split a whole, with status colors and optional content in the center.

## When to use
- Compact metrics and goals in cards and dashboards (84% of plan).
- Progress where horizontal space is short: table cells, list rows, avatars of tasks.
- A value on a custom scale shown as a ring ("7/12").
- A compact breakdown of a whole: tasks by status, storage by type (`segments`), next to a legend.

## When not to use
- Progress with a label and width to spare (uploads, imports) → use [ProgressBar](../progress-bar/COMPONENT.md).
- A breakdown with many parts or long labels → use [ProgressBar](../progress-bar/COMPONENT.md) with `segments` and a legend.
- Unknown duration → use a loading state (e.g. `Button` `loading`); ProgressCircle is always determinate.

## Import
```tsx
import { ProgressCircle } from "prime-ui-kit";
```
Types: `ProgressCircleRootProps`, `ProgressSegment`, `ProgressCircleLabels`.

## Anatomy
```
ProgressCircle.Root
├─ svg (viewBox 0…100, stroke = 1/12 of the diameter)
│  ├─ value mode     `role="progressbar"`: track + one round-capped arc
│  └─ segments mode  `role="group"`: track + parts clockwise from 12 o'clock with flat joints and
│                    round caps at both ends of the filled share; `hairline` → separate round arcs
└─ inner             `children`, centered in the hole (not on xs / s)
```

## API

### ProgressCircle.Root
Leaf component. `forwardRef` to the root `HTMLDivElement`. No native props passthrough.
Pass either `value` or `segments` — the props type is a union of the two modes (same as ProgressBar).

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — (value mode, required) | Current value; clamped to `0…max`. At `0` the arc is hidden. |
| `segments` | `ProgressSegment[]` | — (segments mode, required) | Parts clockwise from the top; each arc is its share of `max`. |
| `max` | `number` | `100` with `value`; the sum of `segments` with `segments` | Top of the scale; a value `<= 0` falls back to the default. With `segments`, a `max` above the sum leaves the rest as track; below the sum it is ignored. |
| `tone` | `"accent" \| "neutral" \| "success" \| "warning" \| "danger" \| "info"` | `"accent"` | Value mode only: arc color. Segments set `tone` each. |
| `segmentGap` | `"none" \| "hairline"` | `"none"` | Segments mode only, see Variants. |
| `labels` | `Partial<ProgressCircleLabels>` | see Accessibility | Segments mode only: accessible texts for empty distributions. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Diameter; the stroke is always 1/12 of it. |
| `label` | `string` | — | Accessible name of the svg (`role="progressbar"` or `role="group"`). Always pass it: it is the only way to name the ring (no `aria-labelledby`, no native props), even when a visible caption sits next to it. |
| `children` | `ReactNode` | — | Centered content: percentage, fraction, icon. Not rendered on `xs` / `s`. A string or number child also becomes `aria-valuetext` (and the visual copy is `aria-hidden`). |
| `className` | `string` | — | Class on the root. |

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 24 diameter, 2px stroke, no inner content | Inline in text or table cells | |
| `s` | 32 diameter, ≈2.7px stroke, no inner content | List rows, compact cards | |
| `m` | 48 diameter, 4px stroke, inner text 12/16 medium | KPI tiles | yes |
| `l` | 64 diameter, ≈5.3px stroke, inner text 16/24 medium | Dashboard cards | |
| `xl` | 80 diameter, ≈6.7px stroke, inner text 18/24 medium | Hero metrics, breakdowns | |

### tone (value or segment)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `accent` | Accent arc on a `fill-strong` track | Progress toward a goal, the main share | yes |
| `neutral` | `text-secondary` arc | Quiet background work, "other" share | |
| `success` | Success arc | Goal reached, done share | |
| `warning` | Warning arc | At risk, quota almost used, pending share | |
| `danger` | Danger arc | Failed, far behind, overdue share | |
| `info` | Info arc | Informational processes (sync, indexing) | |

### segmentGap
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `none` | One continuous ring: parts meet at flat joints; with free capacity the filled share has round caps on the track | Parts of a single process | yes |
| `hairline` | Every part and the free rest are separate round arcs with a ¾-stroke gap; no track | Distinct categories (file types, statuses) | |

**Combinations**
- Recommended: `m` with "NN%" inside and a caption next to the ring; `success` + a check icon at 100%.
- Pointless: `children` on `xs`/`s` (not rendered) — use `label` and a caption outside.
- Recommended: `segments` + `xl` + a legend; the total or the filled percent inside.
- Avoid: long text inside the ring; it is clipped to the inner circle.
- Avoid: more than 4–5 segments, and `hairline` on `xs`/`s` — small parts collapse to dots.

## States
| State | Driven by | DOM |
|---|---|---|
| size / tone | props | `data-size`, `data-tone` (value mode) on the root |
| empty | `value` 0, or `segments` empty / all 0 | arc hidden, track only |
| value | `value`, `max` | `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax`; the arc glides by `stroke-dashoffset` over `slow` (instant under `prefers-reduced-motion`) |
| segments | `segments`, `max`, `segmentGap` | `data-segment-gap` on the svg, `data-tone` on every arc and cap; arcs glide by `stroke-dasharray`/`-dashoffset`, caps by `rotate` |

Always controlled: pass the current `value` or `segments`.

## Layout & spacing
- `display: inline-flex`, does not shrink; place it in a row with its caption using `--prime-space-3` gap, or above a caption with `--prime-space-2`.
- Diameters sit on the 4px grid (`--prime-space-6…20`, rem based); the ring geometry is in viewBox units, so it scales with them.

## Accessibility
- Value mode: the svg has `role="progressbar"` with `aria-valuenow/min/max`; `label` is its only accessible name — always set it. String/number children are read as `aria-valuetext` (the visual copy is `aria-hidden`).
- Segments mode: the svg is `role="group"`; with `label` it is named by it and described by a visually hidden list of shares of `max` ("Принято: 40%, …"); without `label` that list is the name.
- Non-text children (icons) should be `aria-hidden`.

| `labels` key | Default | Used for |
|---|---|---|
| `empty` | `"Нет сегментов"` | Accessible text when `segments` is empty |
| `allEmpty` | `"Все сегменты пусты"` | Accessible text when every segment is 0 |

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [goals-card.tsx](examples/goals-card.tsx) | `m` rings with percentage and captions in a card, three tones | KPI tiles |
| [sizes.tsx](examples/sizes.tsx) | `xs`…`xl`, no inner text on `xs`/`s` | Picking a size |
| [values-and-tones.tsx](examples/values-and-tones.tsx) | 0, every `tone` (success with an icon), `max={12}` | Outcome colors and custom scales |
| [segments.tsx](examples/segments.tsx) | Closed ring of parts, `max` above the sum, `hairline`, empty list | Breakdowns of a whole |

```tsx
import { ProgressCircle } from "prime-ui-kit";

export function PlanProgress() {
  return (
    <ProgressCircle.Root value={84} label="Выполнение плана">
      84%
    </ProgressCircle.Root>
  );
}
```

## Mistakes
- No `label` (even with a visible caption next to the ring) → screen readers get an unnamed progressbar; a caption is not linked to the ring, so always pass `label`.
- Text inside an `xs`/`s` ring → it is not rendered; show it outside.
- `value` and `segments` together → a type error; pick one mode.
- `tone` on the root with `segments` → set `tone` on each segment.

## Related
- [ProgressBar](../progress-bar/COMPONENT.md) — the linear version with the same API (`value` or `segments`).
- [Card](../card/COMPONENT.md) — typical host for KPI rings.
