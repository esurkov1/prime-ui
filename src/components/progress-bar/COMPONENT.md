# ProgressBar

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A horizontal completion indicator built on the native `progress` element: fill ratio is set with `value` and `max`, with optional label and size.

## When to use it

- **Data upload and transfer:** show how much has been sent or downloaded (bytes, packets) when `max` is not a standard scale.
- **Multi-step flows:** visually tie the user to progress through a form, checklist, or setup wizard (“step 2 of 5”).
- **Background work in the product:** a short “building report / indexing” block with a clear label and without cluttering the UI.

## Use cases

Each example targets a different screen type and prop set.

### Basic

The most common case: scale up to 100, no label.

```tsx
import { ProgressBar } from "prime-ui-kit";

export function CourseProgressTeaser() {
  return <ProgressBar.Root value={40} max={100} />;
}
```

### Sizes and track density

Same percentage logic, but visual hierarchy: a compact bar in a list and a large one on a status page.

```tsx
import { ProgressBar } from "prime-ui-kit";

export function SyncListRow() {
  return (
    <>
      <ProgressBar.Root value={18} max={100} size="s" />
      <ProgressBar.Root value={18} max={100} size="xl" label="Catalog sync" />
    </>
  );
}
```

### Inside a card

The bar sits between the title and supporting copy so the user sees both the percentage and the operation context.

```tsx
import { ProgressBar } from "prime-ui-kit";
import { Typography } from "prime-ui-kit";

export function ReportCard() {
  return (
    <section>
      <Typography.Root size="l" weight="semibold">
        Building export
      </Typography.Root>
      <ProgressBar.Root value={72} max={100} size="m" label="Collecting data" />
      <Typography.Root size="s" tone="muted">
        You can close the tab; the report will appear under “Ready files”.
      </Typography.Root>
    </section>
  );
}
```

### Controlled mode

The value lives in screen state (simulated upload, manual step, server response).

```tsx
import * as React from "react";
import { Button, ProgressBar } from "prime-ui-kit";

export function ManualStepsDemo() {
  const [value, setValue] = React.useState(20);

  return (
    <>
      <ProgressBar.Root value={value} max={100} label={`Done: ${value}%`} />
      <Button.Root mode="stroke" size="m" variant="neutral" onClick={() => setValue((v) => Math.min(100, v + 10))}>
        Add 10%
      </Button.Root>
    </>
  );
}
```

## Anatomy

- **`ProgressBar.Root`** — root wrapper (`div` with `data-size`), optionally a **`span`** for the label (`label`) and a native **`<progress>`** with the track class.

Public API: a `ProgressBar` object with a single **`Root`** field.

## API

### ProgressBar.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `value` | `number` | — | Yes | Current value; clamped to `[0, max]`. |
| `max` | `number` | `100` | No | Upper bound; if `max <= 0`, `100` is used. |
| `label` | `string` | — | No | Text above the track; sets `aria-labelledby` on `progress`. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Track height and label font size. |
| `className` | `string` | — | No | Class on the wrapper around the label and `progress`. |
| `ref` | `React.Ref<HTMLProgressElement>` | — | No | Ref to the native `progress`. |

## Variants

There is no separate `variant` prop: appearance is consistent across the kit. Differences come only from **`size`** and the parent container width (the track spans the full wrapper width).

## States

- **Fill** is defined by **`value`** / **`max`** (including 0 and 100%).
- **Out of range:** negative values are treated as `0`, values above `max` as `max`.
- There are no **`disabled`**, **`loading`**, or **`error`** props; if you need inactivity, handle it at the screen level (e.g. hide or disable the whole block).

## Accessibility (a11y)

- Uses native **`progress`**: **`progressbar`** role and **`value`** / **`max`** wired to the browser’s accessibility API.
- With **`label`**, the label gets a stable `id` referenced by **`aria-labelledby`** on the bar so the indicator name is announced together with the percentage/fraction the system reports.
- The bar itself is not keyboard-focusable (non-interactive); focus stays on nearby buttons and fields.

## Limitations and notes

- No **indeterminate** progress mode in the API: `value` is required and always clamped; an endless spinner is a different pattern.
- **Horizontal** only; vertical bars are not supported.
- Extra HTML attributes are not forwarded to **`progress`**; extend markup with an outer wrapper.
- For a circular indicator in the same kit, use **ProgressCircle**.

## Related components

- **ProgressCircle** — circular progress when space is tight or a single number is emphasized.
- **Typography** — headings and secondary text around the bar.
- **Button** — “cancel”, “pause”, or manual progress changes next to the indicator.
