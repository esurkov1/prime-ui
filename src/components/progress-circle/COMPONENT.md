# ProgressCircle

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

`ProgressCircle` is a circular completion indicator: an SVG ring with `progressbar` role and optional centered content.

## What it’s for

- **Loading and background tasks** — show copy or report preparation percentage in the ring center next to a Cancel button.
- **Subscriptions and licenses** — visualize “month 4 of 12” or remaining period via `max` and a label in the center or beside the ring.
- **Service booking and step flows** — show current step of five (e.g. “Step 2 of 5”) without a linear bar when a compact status icon matters.

## Use cases

### Basic

Common case: readiness percentage for one operation with a centered label.

```tsx
import { ProgressCircle } from "prime-ui-kit";

export function BackupStatus() {
  return (
    <section>
      <ProgressCircle.Root value={68} max={100} size="l">
        68%
      </ProgressCircle.Root>
      <div>
        <strong>Backup</strong>
        <p>About a minute left</p>
      </div>
    </section>
  );
}
```

### Variants and sizes

Another scenario: instructor dashboard — three compact rings with different `size` for different assignment groups.

```tsx
import { ProgressCircle } from "prime-ui-kit";

export function ClassProgressRow() {
  return (
    <div>
      <div>
        <ProgressCircle.Root value={90} size="s">
          90%
        </ProgressCircle.Root>
        <div>Group A</div>
      </div>
      <div>
        <ProgressCircle.Root value={55} size="m">
          55%
        </ProgressCircle.Root>
        <div>Group B</div>
      </div>
      <div>
        <ProgressCircle.Root value={40} size="xl">
          40%
        </ProgressCircle.Root>
        <div>Group C</div>
      </div>
    </div>
  );
}
```

### In context (booking card)

Slot selection screen: the ring shows day occupancy (seats vs venue capacity), with text and button alongside without changing layout.

```tsx
import { Button, ProgressCircle } from "prime-ui-kit";

export function VenueDayCard() {
  const booked = 42;
  const capacity = 60;

  return (
    <article>
      <ProgressCircle.Root value={booked} max={capacity} size="l">
        <span>
          {booked}/{capacity}
        </span>
      </ProgressCircle.Root>
      <div>
        <h3>Saturday, 2:00 PM</h3>
        <p>North Hall — seats still available</p>
      </div>
      <Button.Root size="s" type="button">
        Book
      </Button.Root>
    </article>
  );
}
```

### Controlled mode

Data comes from state or a subscription (simulated import progress stream).

```tsx
import * as React from "react";

import { ProgressCircle } from "prime-ui-kit";

export function CatalogImportMonitor() {
  const [done, setDone] = React.useState(0);
  const total = 200;

  React.useEffect(() => {
    if (done >= total) return;
    const t = window.setInterval(() => setDone((n) => Math.min(total, n + 20)), 900);
    return () => window.clearInterval(t);
  }, [done, total]);

  return (
    <div>
      <ProgressCircle.Root value={done} max={total} size="xl" label={`Imported ${done} of ${total} items`}>
        <span>{Math.round((done / total) * 100)}%</span>
      </ProgressCircle.Root>
      <span>Processing supplier catalog…</span>
    </div>
  );
}
```

## Anatomy

- **`ProgressCircle.Root`** — `display: inline-flex` wrapper with `data-size`.
  - **`<svg role="progressbar">`** — track and fill arc (`stroke-dasharray` / `stroke-dashoffset`).
  - **Optional center block** — children render in a container above the SVG when `children` are provided.

## API

### ProgressCircle.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `value` | `number` | — | Yes | Current value; clamped to `[0, max]`. |
| `max` | `number` | `100` | No | Upper bound; if `max <= 0`, `100` is used. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Diameter and stroke width from `progressCircle` primitives. |
| `label` | `string` | — | No | Text for `aria-label` on the SVG when there is no visible label in the center. |
| `children` | `React.ReactNode` | — | No | Content inside the ring. |
| `className` | `string` | — | No | Extra class on the root element. |
| `ref` | `React.Ref<HTMLDivElement>` | — | No | Ref on the root `div`. |

## Variants

There is no separate `variant` prop: one visual style (track and accent arc from system colors). Adjust **visual size** via `size` (`s` → `xl`) and **the numeric range** via the `value` / `max` pair.

## States

- **Fill** is driven by `value`; the arc is computed relative to `max`.
- **Out of range**: values below `0` become `0`, above `max` become `max`.
- **Invalid max**: when `max <= 0`, `100` is used to avoid division by zero and an empty scale.
- There are no built-in “loading”, “error”, or “disabled” states — reflect those with adjacent markup or by pausing `value` updates.

## Accessibility (a11y)

- SVG is **`role="progressbar"`** with **`aria-valuenow`**, **`aria-valuemin={0}`**, **`aria-valuemax`** equal to the effective `max`.
- **`label`** sets **`aria-label`** on the SVG — use it when the center has no text, or screen readers may lack a name for the indicator.
- The component is **not focusable** and does not expect keyboard input: it is decorative/informational; progress control stays with the parent.

## Limitations and notes

- No **indeterminate** mode (infinite loading without a number) — only a definite fraction via `value` and `max`.
- No **`asChild`** or polymorphic root: always a wrapper with SVG inside.
- **Full container width** is not supported: root is `inline-flex`; wrap in your own flex/grid container to stretch.

## Related components

- **`ProgressBar`** — linear same meaning “fraction of max” when the axis should be horizontal or inline in a form.
- **`Typography`** — labels and units beside the ring or inside `children`.
- **`Button`** — Cancel, Retry, etc. next to a long-running operation indicator.
