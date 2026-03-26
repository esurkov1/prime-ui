# SegmentedProgressBar

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

A full-width horizontal bar split into colored segments whose widths are proportional to **non-negative** numeric **values** (shares of the total). Use for dashboards and status summaries where several categories add up to one whole (for example error / pending / success counts).

- **Use** when you need to show a **composition** (parts of 100%) with distinct semantic colors.
- **Use** with **`label`** for a visible title and optional **`ariaLabel`** for a precise screen-reader name.
- **Do not use** for a single scalar completion value — use **ProgressBar** or **ProgressCircle** instead.
- **Do not use** when segments are not parts of one total; the component always normalizes by the **sum of segment values**.

## Composition

- **`SegmentedProgressBar`** exposes only **`SegmentedProgressBar.Root`**.
- The root wraps an optional caption and a **`role="img"`** track (graphic summary) with **`aria-label`**. Segments are **flex** items with **`flex-grow`** equal to their **value**, so proportions match the data without manual percentages.

### Minimal example

```tsx
import { SegmentedProgressBar } from "prime-ui-kit";

export function RunSummary() {
  return (
    <SegmentedProgressBar.Root
      segments={[
        { value: 30, label: "Errors", tone: "danger" },
        { value: 25, label: "Waiting", tone: "pending" },
        { value: 45, label: "Success", tone: "success" },
      ]}
    />
  );
}
```

## Rules

- **Values** must be **≥ 0**; negative values are treated as **0**.
- **Proportions** are **value / sum(values)**. The scale is arbitrary (e.g. `3, 2, 5` is the same as `30, 20, 50`).
- Segments with **value 0** are omitted from the bar.
- If the **sum is 0**, the track shows an **empty** state and **`aria-label`** is **`No data`** (optionally prefixed by **`label`**).
- **`tone`** defaults to **`primary`** when omitted.
- **`aria-label`** on the group defaults to a comma-separated list of **`label` + rounded percentage** per segment, or **`Segment {n}`** if **`label`** is missing. Override with **`ariaLabel`** for i18n or richer copy.

## API

### SegmentedProgressBar.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `segments` | `SegmentedProgressSegment[]` | — | Yes | Items with **`value`**, optional **`label`** and **`tone`**. |
| `label` | `string` | — | No | Visible caption above the track; also prepended to the default **`aria-label`**. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Track height and caption typography (aligned with **ProgressBar**). |
| `ariaLabel` | `string` | — | No | Accessible name for the **`role="img"`** track; overrides auto-generated text. |
| `className` | `string` | — | No | Class on the outer wrapper. |
| `ref` | `React.Ref<HTMLDivElement>` | — | No | Ref to the outer wrapper. |

### SegmentedProgressSegment

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `value` | `number` | Yes | Weight; must be non-negative for inclusion. |
| `label` | `string` | No | Legend text and default **a11y** segment name. |
| `tone` | `SegmentedProgressTone` | No | Palette token for the segment fill. |
| `id` | `string` | No | Unique **React** `key` when **`label` + `value` + `tone`** repeat across segments. |

### SegmentedProgressTone

| Value | Visual role |
|-------|-------------|
| `primary` | Primary action fill (`--prime-sys-color-action-primaryBackground`). |
| `success` | Success emphasis. |
| `warning` | Warning emphasis. |
| `danger` | Error emphasis. |
| `neutral` | Raised surface + subtle border. |
| `pending` | “Away” / waiting emphasis (yellow family). |
| `info` | Information emphasis (blue family). |

## Related

- [ProgressBar](../progress-bar/COMPONENT.md) — single determinate scalar on **`<progress>`**.
- [ProgressCircle](../progress-circle/COMPONENT.md) — circular scalar indicator.
- [Typography](../typography/COMPONENT.md) — titles and legends beside the bar.
