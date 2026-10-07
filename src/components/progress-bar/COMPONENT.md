# ProgressBar

**Category:** feedback

> Linear progress: one value on a native `<progress>`, or `segments` that split a whole (storage by type, task statuses), with a label, a percentage and status colors.

## When to use
- Determinate progress of an operation: file upload, import, export (`value`).
- How much of a quota or a set of steps is done ("Профиль: 3 из 5 шагов") (`value` + `max`).
- How a whole splits into parts: used space by file type, tasks by status, budget by category (`segments`).
- Several parts of one process in one line (done / in progress) out of a total (`segments` + `max`).
- Per-row progress inside lists (FileUpload rows use it through `FileUpload.ItemProgress`).

## When not to use
- A compact radial indicator, a KPI ring or a ring breakdown → use [ProgressCircle](../progress-circle/COMPONENT.md) (same `value` / `segments` API).
- Unknown duration (no value) → use a spinner, e.g. `Button` `loading`; ProgressBar has no indeterminate mode.
- Navigation through wizard steps → use [Stepper](../stepper/COMPONENT.md).
- Detailed data with axes → use a chart.

## Import
```tsx
import { ProgressBar } from "prime-ui-kit";
```
Types: `ProgressBarRootProps`, `ProgressSegment`, `ProgressBarLabels`.

## Anatomy
```
ProgressBar.Root
├─ header row (only with `label` or `showValue`)
│  ├─ label            from `label`
│  └─ value            from `showValue`, `NN%`
├─ value mode
│  ├─ <progress>       transparent, for assistive tech
│  └─ bar              track, one fill pill with a rounded leading end (`aria-hidden`)
└─ segments mode
   └─ bar              `role="group"`: a pill of parts (flat joints) + the free rest up to `max`
```

## API

### ProgressBar.Root
Leaf component. `forwardRef` to the root `HTMLDivElement`. No native props passthrough.
Pass either `value` or `segments` — the props type is a union of the two modes.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — (value mode, required) | Current value; clamped to `0…max`. |
| `segments` | `ProgressSegment[]` | — (segments mode, required) | Parts in order; each one's width is its share of `max`. |
| `max` | `number` | `100` with `value`; the sum of `segments` with `segments` | Top of the scale; a value `<= 0` falls back to the default. With `segments`, a `max` above the sum leaves the rest as track; below the sum it is ignored. |
| `tone` | `"accent" \| "neutral" \| "success" \| "warning" \| "danger" \| "info"` | `"accent"` | Value mode only: fill color. Segments set `tone` each. |
| `segmentGap` | `"none" \| "hairline"` | `"none"` | Segments mode only, see Variants. |
| `labels` | `Partial<ProgressBarLabels>` | see Accessibility | Segments mode only: accessible texts for empty distributions. |
| `label` | `string` | — | Visible label above the bar and its accessible name (`aria-labelledby`). |
| `showValue` | `boolean` | `false` | Shows the rounded filled percentage at the right of the header (`tabular-nums`, `aria-hidden`). With `segments` it is the sum over `max`. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Line thickness (`--prime-control-<tier>-track`) and label typography. |
| `className` | `string` | — | Class on the root `<div>`. |

### ProgressSegment
| Field | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — (required) | Non-negative weight; negative or non-finite values count as 0. |
| `label` | `string` | — | Name in the accessible distribution text and the segment `title`. |
| `tone` | `"accent" \| "neutral" \| "success" \| "warning" \| "danger" \| "info"` | `"accent"` | Segment fill. |

## Variants

### tone (value or segment)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `accent` | Accent fill on a `fill-strong` track | Progress in flight, the main share | yes |
| `neutral` | `text-secondary` fill | Quiet background work, "other" share | |
| `success` | Success fill | Finished operations, healthy quota, done share | |
| `warning` | Warning fill | Quota almost used, pending / at-risk share | |
| `danger` | Danger fill | Failed or interrupted operation, overdue share | |
| `info` | Info fill | Informational processes next to info UI (sync, indexing) | |

### segmentGap
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `none` | One continuous pill: parts meet at flat joints, the filled share ends with a round cap on the track | Parts of a single process | yes |
| `hairline` | Every part and the free rest are separate pills with a ¾T gap; the bar itself has no track | Distinct categories (file types, statuses) | |

### size
The line thickness T is `--prime-control-<tier>-track`, shared with Slider.

| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | Line 4px, label 12/16, header gap 4 | Dense tables, inline rows | |
| `s` | Line 5px, label 12/16, header gap 4 | Compact lists | |
| `m` | Line 6px, label 13/20, header gap 8 | Default | yes |
| `l` | Line 7px, label 14/20, header gap 8 | Prominent single progress | |
| `xl` | Line 8px, label 14/20, header gap 8 | Hero / onboarding progress, dashboards | |

### showValue
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` | Label only (or no header) | The exact number does not matter | yes |
| `true` | Secondary `NN%` at the right of the header | Uploads, quotas, capacity where the user tracks the number | |

**Combinations**
- Recommended: `accent` while running, then switch to `success` or `danger` with the result; `label` + `showValue` for uploads.
- Recommended: `segments` + `max` + `hairline` + a legend for "used by type"; the free space is the track, no extra "free" segment.
- Pointless: `showValue` with `max` meant as a count ("3 из 5") — put the count into `label`.
- Pointless: one segment without `max` — use `value`.
- Avoid: `danger` for normal high values; more than 5–6 segments; color as the only carrier of meaning — add a legend.

## States
| State | Driven by | DOM |
|---|---|---|
| tone / size | props | `data-tone` (value mode), `data-size` on the root |
| value | `value`, `max` | native `value` / `max` on a transparent `<progress>`; the visible fill is an `aria-hidden` full-width pill that slides by `translate` inside the pill-shaped track (inline-start anchored, RTL aware) over `slow` + `standard`; instant under `prefers-reduced-motion` |
| segments | `segments`, `max`, `segmentGap` | `data-segment-gap` on the group, `data-tone` on each part; widths animate by `flex-grow` over `slow`, instant under reduced motion |
| empty segments | `segments` empty or all `0` | only the track (also with `hairline`); the accessible text is `labels.empty` / `labels.allEmpty` |

Always controlled: pass the current `value` or `segments` on every render.

## Layout & spacing
- `width: 100%` of the parent; the header is a row with the label (ellipsis) and the value.
- Label → bar: the tier `label-gap` (`--prime-space-1` xs/s, `--prime-space-2` m–xl).
- Stack several bars with `--prime-space-4`–`--prime-space-5`; a legend sits `--prime-space-4` under the bar.

## Accessibility
- Value mode: native `<progress>` — role `progressbar` with value and max for screen readers.
- Segments mode: the bar is `role="group"`; its text lists the shares of `max`: "Видео: 38%, Документы: 21%, …" (parts without `label` read as "NN%"). With `label`: `aria-labelledby` the label and `aria-describedby` the visually hidden distribution; without `label`: `aria-label` = distribution.
- Give a value bar a `label`: there is no `aria-label` prop, so a value bar without `label` has no accessible name.
- The percentage text is `aria-hidden`.

| `labels` key | Default | Used for |
|---|---|---|
| `empty` | `"Нет сегментов"` | Accessible text when `segments` is empty |
| `allEmpty` | `"Все сегменты пусты"` | Accessible text when every segment is 0 |

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [file-upload.tsx](examples/file-upload.tsx) | Live uploads in a card: growing progress, `success` when done, `danger` on failure | Per-item progress of background operations |
| [values-and-tones.tsx](examples/values-and-tones.tsx) | 0 / partial / 100, every `tone`, `max={5}` | Showing outcome and custom scales |
| [segments.tsx](examples/segments.tsx) | `segments` with `none` and `hairline`, `max` above the sum, empty list | Parts of a whole |
| [storage-distribution.tsx](examples/storage-distribution.tsx) | Storage by type in a card with a legend, `max` = disk size | "Used by type" breakdowns |
| [sizes.tsx](examples/sizes.tsx) | `xs`…`xl` with `label` and `showValue` | Picking a size |

```tsx
import { ProgressBar } from "prime-ui-kit";

export function ImportProgress() {
  return <ProgressBar.Root value={42} label="Импорт контактов" showValue />;
}

export function TaskStatus() {
  return (
    <ProgressBar.Root
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
- No `label` on a value bar → it has no accessible name; add `label`.
- `value` and `segments` together → a type error; pick one mode.
- `tone` on the root with `segments` → set `tone` on each segment.
- A "Свободно" segment for free space → pass `max` instead; the rest stays track.
- Percentages that do not sum to 100 without `max`, expecting fixed widths → widths are shares of the sum; pass `max`.
- Values over `max` expecting overflow → they are clamped.
- Using it as a spinner with a fake value → use a loading state instead.

## Related
- [ProgressCircle](../progress-circle/COMPONENT.md) — the ring version with the same API (`value` or `segments`).
- [Slider](../slider/COMPONENT.md) — the same line and size scale, but interactive.
- [FileUpload](../file-upload/COMPONENT.md) — `FileUpload.ItemProgress` renders a ProgressBar.
- [Stepper](../stepper/COMPONENT.md) — step navigation.
