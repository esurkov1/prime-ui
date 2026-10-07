# SegmentedProgressBar

**Category:** feedback (Обратная связь)

> One bar made of proportional segments: storage by type, task statuses, a funnel or quotas.

## When to use
- Showing how a whole splits into parts: used space by file type, tasks by status, budget by category.
- Several progress parts in one line (done / in progress / overdue).

## When not to use
- A single value toward a goal → use [ProgressBar](../progress-bar/COMPONENT.md) or [ProgressCircle](../progress-circle/COMPONENT.md).
- Navigating discrete wizard steps → use [Stepper](../stepper/COMPONENT.md).
- Choosing one of several options → use [SegmentedControl](../segmented-control/COMPONENT.md).
- Detailed data with axes → use a chart.

## Import
```tsx
import { SegmentedProgressBar } from "prime-ui-kit";
```
Types: `SegmentedProgressSegment`, `SegmentedProgressBarRootProps`, `SegmentedProgressBarLabels`.

## API

### SegmentedProgressBar.Root
Leaf component. `forwardRef` to the track `HTMLDivElement` (`role="group"`). No native props passthrough.

| Prop | Type | Default | Description |
|---|---|---|---|
| `segments` | `SegmentedProgressSegment[]` | — (required) | Segments in order; each one's width is its share of the sum of all values. |
| `label` | `string` | — | Visible label above the track; the track is labelled by it and described by the distribution text. Without `label` the distribution text is the track's `aria-label`. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Track height and label typography (same scale as ProgressBar). |
| `segmentGap` | `"none" \| "hairline"` | `"none"` | Gap between segments, see Variants. |
| `labels` | `Partial<SegmentedProgressBarLabels>` | see Accessibility | Accessible texts for empty states. |
| `className` | `string` | — | Class on the root `<div>`. |

### SegmentedProgressSegment
| Field | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — (required) | Non-negative weight; negative or non-finite values count as 0. |
| `label` | `string` | — | Name used in the accessible distribution text and as the segment `title`. |
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger"` | `"accent"` | Segment fill. |

## Variants

### tone (segment)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `accent` | Accent fill | The main or "in progress" share | yes |
| `success` | Success fill | Done / accepted | |
| `warning` | Warning fill | Pending / at risk | |
| `danger` | Danger fill | Overdue / rejected | |
| `neutral` | `fill-strong-hover` fill, slightly darker than the track | Free space, "other" | |

### segmentGap
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `none` | One continuous pill on a `fill-strong` track | Parts of a single process | yes |
| `hairline` | Segments as separate pills with a 4px gap, track background transparent | Distinct categories (file types, statuses) | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | Track 4px, label 12/16, gap 4 | Table cells | |
| `s` | Track 4px, label 12/16, gap 4 | Compact lists | |
| `m` | Track 4px, label 13/20, gap 8 | Default | yes |
| `l` | Track 8px, label 14/20, gap 8 | Prominent summaries | |
| `xl` | Track 8px, label 14/20, gap 8 | Dashboards hero | |

**Combinations**
- Recommended: `hairline` + a legend for categories; `neutral` for the "free" remainder.
- Pointless: one segment only — use ProgressBar.
- Avoid: more than 5–6 segments; color as the only carrier of meaning — add a legend.

## States
| State | Driven by | DOM |
|---|---|---|
| size / gap | props | `data-size`, `data-segment-gap` on the root |
| segment tone | `segment.tone` | `data-tone` on each segment |
| empty | `segments` empty or all values 0 | only the `fill-strong` track with `segmentGap="none"`; with `"hairline"` the track is transparent, so an empty bar is invisible (show a text or use `none` when data can be empty). The accessible text is `labels.empty` / `labels.allEmpty` |

Segment widths animate (flex-grow transition; none under `prefers-reduced-motion`).

## Layout & spacing
- `width: 100%` of the parent. Label → track: `--prime-space-1` (xs/s) or `--prime-space-2` (m–xl).
- Put a legend under the bar with `--prime-space-4` from it.

## Accessibility
- The track is `role="group"`; its accessible text lists the shares: "Видео: 38%, Документы: 21%, …" (segments without `label` are read as "NN%").
- With `label`: `aria-labelledby` the label and `aria-describedby` the visually hidden distribution; without `label`: `aria-label` = distribution.

| `labels` key | Default | Used for |
|---|---|---|
| `empty` | `"Нет сегментов"` | Accessible text when `segments` is empty |
| `allEmpty` | `"Все сегменты пусты"` | Accessible text when every segment is 0 |

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [storage-distribution.tsx](examples/storage-distribution.tsx) | Storage by type in a card with a legend, `hairline`, `neutral` free space | "Used by type" breakdowns |
| [sizes.tsx](examples/sizes.tsx) | `xs`…`xl` with labels | Picking a size |
| [segment-gap.tsx](examples/segment-gap.tsx) | `none` vs `hairline`, empty `segments` | Gap choice and the empty state |

```tsx
import { SegmentedProgressBar } from "prime-ui-kit";

export function TaskStatus() {
  return (
    <SegmentedProgressBar.Root
      label="Задачи"
      segments={[
        { value: 55, label: "Выполнено", tone: "success" },
        { value: 25, label: "В работе" },
        { value: 20, label: "Просрочено", tone: "danger" },
      ]}
    />
  );
}
```

## Mistakes
- Passing percentages that do not sum to 100 and expecting fixed widths → widths are always shares of the sum.
- Segments without `label` → screen readers hear only percentages; give each segment a label.
- `tone="info"` → not supported for segments.

## Related
- [ProgressBar](../progress-bar/COMPONENT.md), [ProgressCircle](../progress-circle/COMPONENT.md).
- [Stepper](../stepper/COMPONENT.md) — step navigation.
