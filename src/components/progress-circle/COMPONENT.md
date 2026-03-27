# ProgressCircle

**Default `size`:** use **`m`** for the size axis unless the layout explicitly needs another tier.

## Canonical

- **Playground demos** mirror **`playground/snippets/progress/circle-*.tsx`** (`circle-sizes`, `circle-max-scale`, `circle-states`, `circle-controlled`, `circle-composition`, `circle-a11y-label`); package **`examples/`** follow the same scenarios.
- **`ProgressCircle`** — circular fraction of a known maximum: **`ProgressCircle.Root`** only (`inline-flex` root, SVG ring + optional centered **`children`**).
- **Semantics:** SVG has **`role="progressbar"`** with **`aria-valuenow`**, **`aria-valuemin={0}`**, **`aria-valuemax`** (effective max after clamping / safe fallback).
- **`value`** (required) and **`max`** (default **`100`**) — progress is **fully controlled**; **`value`** is clamped to **`[0, max]`**; if **`max <= 0`**, the scale falls back to **`100`** internally.
- **`label`** — optional accessible name on the SVG (**`aria-label`**); use when the center has no text or the visible center text does not describe the bar.
- **`size`:** **`s` | `m` | `l` | `xl`** — diameter and stroke from **`progressCircle`** primitives.
- **`children`** — optional centered slot (short number, percent, icon); omit for a ring-only indicator (then set **`label`** for a11y).
- **No indeterminate mode**, no **`disabled` / `loading` / `error`** props — reflect those in surrounding UI or by freezing **`value`**.
- **Not** a focusable control; **not** polymorphic (**no `asChild`**).

## Extended

### About

Circular progress: an SVG ring showing **`value` / `max`**, with optional content inside the ring.

- **When to use** — compact share of a known total (percent, steps, seats, quota) where a round indicator reads better than a bar.
- **When to use** — with **`max`** when the scale is not 0–100 (months in a plan, steps in a wizard, large numeric caps).
- **When to use** — **`children`** for the focal number or short label in the middle of the ring.
- **When not to use** — indeterminate or endless spinners without a numeric fraction (no built-in indeterminate API).
- **When not to use** — as the primary interactive target; pair with [Button](../button/COMPONENT.md) or links for actions.
- **When not to use** — when a horizontal bar is clearer; see [ProgressBar](../progress-bar/COMPONENT.md).

### Composition

- **`ProgressCircle.Root`** — root **`div`** with **`data-size`**, inner size CSS variable, SVG (**`progressbar`**), then optional **`children`** wrapper centered over the ring.
- Order: pass **`value`** / **`max`** / **`size`** / **`label`** on **`Root`**; put visual center content in **`children`** when needed.

### Scenarios (see `examples/`; playground: `playground/snippets/progress/circle-*.tsx`)

| Scenario | Approach |
|----------|----------|
| Sizes | Same **`value`** across **`size`** **`s`–`xl`** (diameter and stroke from **`progressCircle`**). → [`examples/sizes.tsx`](examples/sizes.tsx) |
| Non‑100 scale | Same arc fraction for different **`max`** (percent, steps, large totals). → [`examples/max-scale.tsx`](examples/max-scale.tsx) |
| Value clamping | Empty, partial, full ring; out-of-range **`value`** clamps to **`0`** and **`max`**. → [`examples/states.tsx`](examples/states.tsx) |
| Controlled value | Drive **`value`** from parent state (polling, upload simulation). → [`examples/controlled.tsx`](examples/controlled.tsx) |
| Composition | **`children`** for **`Typography`**, icons, short numeric copy. → [`examples/composition.tsx`](examples/composition.tsx) |
| Accessible name | Set **`label`** when the center has no descriptive text ( **`aria-label`** on SVG). → [`examples/a11y-label.tsx`](examples/a11y-label.tsx) |
| Dashboard KPI (extra) | Ring inside [Card](../card/COMPONENT.md) **`mini-media`** **`Card.Media`** — no dedicated circle snippet. → [`examples/dashboard-ring.tsx`](examples/dashboard-ring.tsx) |

### Minimal example

```tsx
import { ProgressCircle } from "prime-ui-kit";

export function Example() {
  return <ProgressCircle.Root value={40} />;
}
```

### Rules

- Progress is **always prop-driven** — no internal stored progress.
- **`value`** clamped to **`[0, max]`**; negatives → **`0`**, above **`max`** → **`max`**.
- If **`max <= 0`**, internal scale uses **`100`** to avoid division by zero.
- **`label`** maps to **`aria-label`** on the SVG; prefer visible **`children`** text that describes the bar when it fully names the task.
- Root is **`inline-flex`** — align inside your own flex or grid row when pairing with captions.
- One visual style; scale with **`size`** only.

## API

### ProgressCircle.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `number` | — | Yes | Current value; clamped to `[0, max]` |
| max | `number` | `100` | No | Upper bound; if `max <= 0`, `100` is used |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Diameter and stroke from `progressCircle` primitives |
| label | `string` | — | No | Accessible name for the SVG (`aria-label`) |
| children | `React.ReactNode` | — | No | Centered content inside the ring |
| className | `string` | — | No | Extra class on the root `div` |
| ref | `React.Ref<HTMLDivElement>` | — | No | Ref on the root `div` |

## Related

- [ProgressBar](../progress-bar/COMPONENT.md) — linear fraction when a horizontal bar fits better.
- [SegmentedProgressBar](../segmented-progress-bar/COMPONENT.md) — multiple segments on one track.
- [Card](../card/COMPONENT.md) — KPI tiles; **`mini-media`** **`Card.Media`** for rings or thin progress.
- [Typography](../typography/COMPONENT.md) — captions and units beside or under the ring.

## LLM note

- **Playground circle snippets:** `circle-sizes`, `circle-max-scale`, `circle-states`, `circle-controlled`, `circle-composition`, `circle-a11y-label` under **`playground/snippets/progress/`** — keep **`COMPONENT.md`** and **`examples/`** aligned with them.
- Export: **`import { ProgressCircle } from "prime-ui-kit"`** — **`ProgressCircle.Root`** only (object namespace).
- **`ProgressCircleRootProps`**: **`value`** (required), **`max?`** (default 100), **`size?`** (default **`m`**), **`label?`**, **`children?`**, **`className?`**, **`ref`** → **`HTMLDivElement`**.
- **`size`** literals: **`s`**, **`m`**, **`l`**, **`xl`**.
- SVG: **`role="progressbar"`**, **`aria-valuenow`**, **`aria-valuemin={0}`**, **`aria-valuemax`** = effective max; **`aria-label`** from **`label`** when provided.
- **No** indeterminate, **no** `disabled`/`loading`/`error` props — control **`value`** and surrounding UI instead.
- **No** `asChild` / polymorphic root — fixed **`div`** + SVG + optional inner **`div`** for **`children`**.
- When the center is empty or non-descriptive, require **`label`** for an accessible name.
- Prefer [ProgressBar](../progress-bar/COMPONENT.md) for linear indeterminate or strip layouts unless the design specifically needs a ring.
