# SegmentedProgressBar

**Default `size`:** use **`m`** for the size axis unless the screen explicitly needs another tier.

## Canonical

- **`SegmentedProgressBar`** — proportional **stacked** bar: **`SegmentedProgressBar.Root`** only; one segment per category, width ∝ **`value`** (weight).
- **`segments`:** each item has **`value`** (≥ 0, clamped), optional **`label`** (tooltip + assistive copy), optional **`tone`**: **`primary` | `success` | `warning` | `danger` | `neutral`** (default **`primary`**).
- **`segmentGap`:** **`none`** (default, continuous bar) or **`hairline`** (1px separators via track background).
- **`label`:** optional visible title above the track; when set, the track uses **`aria-labelledby`** + **`aria-describedby`** with a visually hidden distribution string; without **`label`**, **`aria-label`** is the distribution text.
- **Not** a native **`<progress>`** — track is **`role="group"`**; use [ProgressBar](../progress-bar/COMPONENT.md) for a single determinate fraction.
- **Not** for picking a segment — use [SegmentedControl](../segmented-control/COMPONENT.md); **not** for steps — use [Stepper](../stepper/COMPONENT.md).

## Extended

### About

`SegmentedProgressBar` shows a part-to-whole breakdown: segment widths follow **`value[i] / sum(values)`** via **`flex-grow`**, so layout stays correct in shrink-to-fit parents. Percentages in the accessibility description are rounded to whole numbers.

- **When to use** — status mixes (errors / pending / success), survey or poll shares, rollout phase allocation, storage or budget split by category.
- **When to use** — **`segmentGap="none"`** for one solid bar; **`hairline`** when segments should read as separate columns.
- **When to use** — per-segment **`label`** for tooltips and clearer **`aria-*`** distribution text.
- **When not to use** — a single task completion percentage; use **ProgressBar**.
- **When not to use** — interactive selection or toggles; use **SegmentedControl**.
- **When not to use** — discrete wizard steps; use **Stepper**.

### Composition

- **`SegmentedProgressBar.Root`** — outer wrapper with **`data-size`**, **`data-segment-gap`**, optional visible **`label`**, optional visually hidden distribution **`span`** (when **`label`** is set), and a **`role="group"`** track with one **`div`** per segment (presentational fills).

### Scenarios (see `examples/`)

| Scenario | Approach |
|----------|----------|
| Multi-phase rollout | Weight segments by cohort or phase (e.g. internal / beta / GA); use **`tone`** to distinguish states. → [`examples/multi-phase-rollout.tsx`](examples/multi-phase-rollout.tsx) |
| Distribution / breakdown | **`label`** for the chart title; **`label`** on each segment for tooltips and the spoken distribution string. → [`examples/distribution-breakdown.tsx`](examples/distribution-breakdown.tsx) |
| Gaps between segments | Default **`segmentGap="none"`**; **`hairline`** for visible separators without changing weights. → [`examples/segment-gaps.tsx`](examples/segment-gaps.tsx) |
| Size ladder | **`size="s" | "m" | "l" | "xl"`** — same tokens scale as ProgressBar. → [`examples/size-ladder.tsx`](examples/size-ladder.tsx) |
| Category mix (storage-style) | Multiple **`tone`** values for categories that are not “good/bad”, e.g. content types. → [`examples/storage-mix.tsx`](examples/storage-mix.tsx) |

### Minimal example

```tsx
import { SegmentedProgressBar } from "prime-ui-kit";

export function Example() {
  return (
    <SegmentedProgressBar.Root
      segments={[
        { value: 30, label: "Errors", tone: "danger" },
        { value: 25, label: "Pending", tone: "warning" },
        { value: 35, label: "Success", tone: "success" },
        { value: 10, label: "Other", tone: "neutral" },
      ]}
    />
  );
}
```

### Rules

- **Weights** are non-negative; invalid numbers are treated as **`0`**. If the sum is **`0`**, the track shows no fills (track background only).
- **Layout** uses **`flex-grow`** from weights, not `%` width, so proportions stay correct when the parent shrinks.
- **`segmentGap`:** **`none`** — track background **`surface-accentSoft`**; **`hairline`** — **`gap: 1px`** on the track, background **`border-subtle`**, segments sit on top so a thin line shows between fills.
- **`tone`** omitted → **`primary`**.
- Segment **`label`** → native **`title`** on the segment **div**.

## API

### SegmentedProgressBar.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `segments` | `SegmentedProgressSegment[]` | — | Yes | Non-negative weights; layout is proportional to the sum. |
| `label` | `string` | — | No | Text above the track; **`aria-labelledby`** + **`aria-describedby`** when set. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Track height and label typography (aligned with ProgressBar). |
| `segmentGap` | `"none" \| "hairline"` | `"none"` | No | Gap between segment fills. |
| `className` | `string` | — | No | Class on the outer wrapper. |
| `ref` | `React.Ref<HTMLDivElement>` | — | No | Ref to the **`role="group"`** track element. |

### SegmentedProgressSegment

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `value` | `number` | Yes | Weight ≥ 0; contributes to proportion. |
| `label` | `string` | No | Tooltip and assistive segment label in the distribution string. |
| `tone` | `"primary" \| "success" \| "warning" \| "danger" \| "neutral"` | No | Default **`primary`**. |

## Related

- [ProgressBar](../progress-bar/COMPONENT.md) — single determinate progress on **`<progress>`**.
- [ProgressCircle](../progress-circle/COMPONENT.md) — circular fraction.
- [Typography](../typography/COMPONENT.md) — headings and legends beside the bar.

## LLM note

- Export: **`import { SegmentedProgressBar } from "prime-ui-kit"`** — public surface is **`SegmentedProgressBar.Root`** only (namespace object).
- **`SegmentedProgressBarRootProps`:** **`segments`** (required), **`label?`**, **`size?`**, **`segmentGap?`**, **`className?`**; **`ref`** → track **`div`** (**`role="group"`**).
- **`SegmentedProgressSegment`:** **`value`** (number), **`label?`**, **`tone?`** — **`tone`** literals: **`primary`**, **`success`**, **`warning`**, **`danger`**, **`neutral`**.
- **`size`** literals: **`s`**, **`m`**, **`l`**, **`xl`** — default **`m`**.
- **`segmentGap`** literals: **`none`**, **`hairline`** — default **`none`**.
- Do not describe this as a native progress bar; it is **`role="group"`**, not **`role="progressbar"`**.
- Do not suggest **SegmentedControl** or **Stepper** for the same job unless the UX is selection or steps, not a static breakdown.
- For a single 0–100% task, recommend **ProgressBar** instead.
