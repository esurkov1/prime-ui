# ProgressCircle

**Category:** feedback

> Circular progress indicator: a track, a rounded arc and optional content in the center.

## When to use
- Compact metrics and goals in cards and dashboards (84% of plan).
- Progress where horizontal space is short: table cells, list rows, avatars of tasks.
- A value on a custom scale shown as a ring ("7/12").

## When not to use
- Progress with a label and width to spare (uploads, imports) → use [ProgressBar](../progress-bar/COMPONENT.md).
- Several parts or shares → use [SegmentedProgressBar](../segmented-progress-bar/COMPONENT.md).
- Unknown duration → use a loading state (e.g. `Button` `loading`); ProgressCircle is always determinate.

## Import
```tsx
import { ProgressCircle } from "prime-ui-kit";
```

## API

### ProgressCircle.Root
Leaf component. `forwardRef` to the root `HTMLDivElement`. No native props passthrough.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — (required) | Current value; clamped to `0…max`. At `0` the arc is hidden. |
| `max` | `number` | `100` | Top of the scale; `<= 0` falls back to `100`. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Diameter and stroke width. |
| `tone` | `"accent" \| "success" \| "warning" \| "danger"` | `"accent"` | Arc color. |
| `label` | `string` | — | `aria-label` of the `role="progressbar"` svg. Always pass it: it is the only way to name the ring (no `aria-labelledby`, no native props), even when a visible caption sits next to it. |
| `children` | `ReactNode` | — | Centered content: percentage, fraction, icon. Not rendered on `xs` / `s`. A string or number child also becomes `aria-valuetext` (and the visual copy is `aria-hidden`). |
| `className` | `string` | — | Class on the root. |

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 24 diameter, 3px stroke, no inner content | Inline in text or table cells | |
| `s` | 32 diameter, 4px stroke, no inner content | List rows, compact cards | |
| `m` | 48 diameter, 4px stroke, inner text 12/16 medium | KPI tiles | yes |
| `l` | 64 diameter, 6px stroke, inner text 16/24 medium | Dashboard cards | |
| `xl` | 80 diameter, 8px stroke, inner text 18/24 medium | Hero metrics | |

### tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `accent` | Accent arc on a `fill-strong` track | Neutral progress toward a goal | yes |
| `success` | Success arc | Goal reached | |
| `warning` | Warning arc | At risk, quota almost used | |
| `danger` | Danger arc | Failed, far behind | |

**Combinations**
- Recommended: `m` with "NN%" inside and a caption next to the ring; `success` + a check icon at 100%.
- Pointless: `children` on `xs`/`s` (not rendered) — use `label` and a caption outside.
- Avoid: long text inside the ring; it is clipped to the inner circle.

## States
| State | Driven by | DOM |
|---|---|---|
| size / tone | props | `data-size`, `data-tone` on the root |
| empty | `value` 0 | arc hidden (opacity 0), track only |
| value | `value`, `max` | `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax`; the arc animates (none under `prefers-reduced-motion`) |

Always controlled: pass the current `value`.

## Layout & spacing
- `display: inline-flex`, does not shrink; place it in a row with its caption using `--prime-space-3` gap, or above a caption with `--prime-space-2`.
- Diameters sit on the 4px grid (rem based).

## Accessibility
- The svg has `role="progressbar"` with `aria-valuenow/min/max`; `label` is its only accessible name — always set it.
- String/number children are read as `aria-valuetext`; non-text children (icons) should be `aria-hidden`.
- ProgressCircle has no `labels`.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [goals-card.tsx](examples/goals-card.tsx) | `m` rings with percentage and captions in a card, three tones | KPI tiles |
| [sizes.tsx](examples/sizes.tsx) | `xs`…`xl`, no inner text on `xs`/`s` | Picking a size |
| [values-and-tones.tsx](examples/values-and-tones.tsx) | 0, accent, success with an icon, warning, danger, `max={12}` | Outcome colors and custom scales |

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
- `tone="info"` → not supported; use `accent`.

## Related
- [ProgressBar](../progress-bar/COMPONENT.md), [SegmentedProgressBar](../segmented-progress-bar/COMPONENT.md).
- [Card](../card/COMPONENT.md) — typical host for KPI rings.
