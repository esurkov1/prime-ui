# SegmentedProgressBar

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

A horizontal **stacked** bar: one segment per category, with widths proportional to each segment’s **`value`** (weight). Use semantic **`tone`** colors for status (success, warning, danger, etc.) and optional labels for tooltips and assistive-tech descriptions.

- **Use** for part-to-whole breakdowns—e.g. job outcomes (errors / pending / success), survey responses, or storage by type.
- **Use** with **`segmentGap="hairline"`** (default) when segments should read as distinct columns; use **`none`** for a continuous strip.
- **Use** with **`label`** when the bar needs a visible title; the **distribution** string is still exposed to screen readers via **`aria-describedby`**.
- **Do not use** for a single continuous fraction of one task—use [ProgressBar](../progress-bar/COMPONENT.md) (native `<progress>`).
- **Do not use** for interactive selection—use [SegmentedControl](../segmented-control/COMPONENT.md).
- **Do not use** for discrete steps—use [Stepper](../stepper/COMPONENT.md).

## Composition

- **`SegmentedProgressBar`** is a single-part namespace: only **`SegmentedProgressBar.Root`** is public.
- **`SegmentedProgressBar.Root`** renders a wrapper `div` with `data-size` and `data-segment-gap`, an optional **`label`**, a visually hidden **`<span>`** with the distribution text when **`label`** is set, and a **`role="group"`** track containing one **`div`** per segment.

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

## Rules

- **Weights** are **non-negative**; each **`value`** is clamped to **`≥ 0`**. Invalid numbers are treated as **`0`**.
- **Segment sizes** follow **`value[i] / sum(values)`** via **`flex-grow`** on the track (not `%` width), so layout stays correct in shrink-to-fit parents (e.g. playground `stack` preview). If the sum is **`0`**, the track is empty (track background only).
- **Percentages** in the accessibility description are **rounded** to whole numbers.
- **`segmentGap`** defaults to **`hairline`** (1px gap, `--prime-sys-color-border-subtle` between segments); **`none`** removes the gap.
- **`tone`** defaults to **`primary`** when omitted; allowed values: **`primary`**, **`success`**, **`warning`**, **`danger`**, **`neutral`**.
- **`label`** on each segment is passed to **`title`** on the segment for tooltips; it also appears in the **distribution** string for assistive tech when provided.
- The bar is **not** a single native **`progressbar`**; the track is **`role="group"`** with **`aria-label`** (no visible label) or **`aria-labelledby`** + **`aria-describedby`** (with label).

## API

### SegmentedProgressBar.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `segments` | `SegmentedProgressSegment[]` | — | Yes | Non-negative weights; layout is proportional to the sum. |
| `label` | `string` | — | No | Text above the track; when set, the group uses **`aria-labelledby`** and **`aria-describedby`**. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Track height and label typography (same scale as ProgressBar). |
| `segmentGap` | `"none" \| "hairline"` | `"hairline"` | No | Gap between segment fills. |
| `className` | `string` | — | No | Class on the outer wrapper. |
| `ref` | `React.Ref<HTMLDivElement>` | — | No | Ref to the **`role="group"`** track element. |

### SegmentedProgressSegment

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `value` | `number` | Yes | Weight **`≥ 0`**; contributes to proportion. |
| `label` | `string` | No | Tooltip and assistive-tech segment label. |
| `tone` | `"primary" \| "success" \| "warning" \| "danger" \| "neutral"` | No | Default **`primary`**. |

## Related

- [ProgressBar](../progress-bar/COMPONENT.md) — single determinate progress on `<progress>`.
- [ProgressCircle](../progress-circle/COMPONENT.md) — circular fraction.
- [Typography](../typography/COMPONENT.md) — headings and legends beside the bar.
