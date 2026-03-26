# ProgressBar

**Default `size`:** use **`m`** for the size axis unless the layout explicitly needs another tier.

## Canonical

- **`ProgressBar`** — horizontal determinate meter: only **`ProgressBar.Root`** is public; it wraps a native **`<progress>`** (role **`progressbar`**) and optional **`label`**.
- **`value`** is **required** and clamped to **`[0, max]`**; **`max`** defaults to **`100`** (if **`max <= 0`**, **`100`** is used).
- **`size`:** **`s` | `m` | `l` | `xl`** — track height and label scale (**`ProgressBarSize`**).
- **Not indeterminate:** the API does not omit **`value`** or set an indeterminate native state — for unknown duration, use loading patterns on controls (for example [Button](../button/COMPONENT.md) **`loading`** + **`Button.Spinner`**) or other kit feedback; see **`examples/indeterminate-busy-state.tsx`**.
- **A11y:** with **`label`**, **`aria-labelledby`** references the label **`span`**; the bar is not focusable.
- **No `disabled` / `loading` / `error`** on the root — hide or mute the block at screen level if needed.

## Extended

### About

`ProgressBar` is a horizontal completion indicator for operations that map to a numeric range: file transfer, form steps, or any bounded task.

- **When to use** — uploads, downloads, or sync where you can compute **`value`** and **`max`**.
- **When to use** — multi-step flows where “step *k* of *n*” should match a single fill (**`value={k}`**, **`max={n}`**).
- **When to use** — when a short visible name should be tied to the meter for sighted users and assistive tech (**`label`**).
- **When not to use** — indeterminate or endless busy states without a numeric model; prefer **`Button`** **`loading`**, spinners, or other patterns.
- **When not to use** — vertical or circular meters; for a ring indicator see [ProgressCircle](../progress-circle/COMPONENT.md).
- **When not to use** — when you need extra native attributes on **`<progress>`** beyond what the wrapper sets; they are not forwarded — compose or wrap at the app layer if required.

### Composition

- **`ProgressBar.Root`** — outer **`div`** with **`data-size`**, optional **`label`** (**`<span>`** + generated **`id`**), then **`<progress>`** with **`value`**, **`max`**, and **`className`** on the track. Width follows the parent (full width of the container).

### Scenarios (see `examples/`)

| Scenario | Approach |
|----------|----------|
| Labeled meter | Set **`label`** so copy sits above the track and **`aria-labelledby`** is wired. → [`examples/labeled.tsx`](examples/labeled.tsx) |
| Upload / download | Update **`value`** from bytes (or percent); keep filename or status in [Typography](../typography/COMPONENT.md) around the bar. → [`examples/upload-progress.tsx`](examples/upload-progress.tsx) |
| Step progress | **`value`** = current step, **`max`** = total steps; label like “Step *k* of *n*”. → [`examples/step-progress.tsx`](examples/step-progress.tsx) |
| Indeterminate / unknown duration | Do **not** force **`ProgressBar`** without a real **`value`**; use **`Button`** **`loading`** (and optional muted copy). → [`examples/indeterminate-busy-state.tsx`](examples/indeterminate-busy-state.tsx) |
| Wizard / report block | Stack **Typography** + **`ProgressBar.Root`** + muted helper text. → [`examples/wizard-composition.tsx`](examples/wizard-composition.tsx) |

### Minimal example

```tsx
import { ProgressBar } from "prime-ui-kit";

export function Example() {
  return <ProgressBar.Root value={40} max={100} />;
}
```

### Rules

- **Controlled usage** — pass React state into **`value`**; there is no internal uncontrolled store.
- **Refs** — **`ref`** targets the native **`<progress>`** element.
- **Clamping** — negative **`value`** becomes **`0`**; **`value > max`** becomes **`max`**.

## API

### ProgressBar.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | `number` | — | Yes | Current value; clamped to `[0, max]` after `max` is normalized. |
| `max` | `number` | `100` | No | Upper bound; if `max <= 0`, `100` is used. |
| `label` | `string` | — | No | Text above the track; `aria-labelledby` references this element when set. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Track height and label typography scale. |
| `className` | `string` | — | No | Class on the outer wrapper around the label and `progress`. |
| `ref` | `React.Ref<HTMLProgressElement>` | — | No | Ref to the native `progress` element. |

## Related

- [SegmentedProgressBar](../segmented-progress-bar/COMPONENT.md) — multiple proportional segments instead of one value.
- [ProgressCircle](../progress-circle/COMPONENT.md) — circular determinate indicator.
- [Typography](../typography/COMPONENT.md) — headings and supporting copy around a status block.
- [Button](../button/COMPONENT.md) — cancel, pause, or **`loading`** next to long-running work.

## LLM note

- Export: **`import { ProgressBar } from "prime-ui-kit"`** — **`ProgressBar.Root`** only.
- **`ProgressBarRootProps`**: **`value`** (required), **`max?`**, **`label?`**, **`size?`**, **`className?`**, **`ref?`** — no `disabled`, `loading`, or indeterminate flag.
- **`size`** literals: **`s`**, **`m`**, **`l`**, **`xl`** — default **`m`**.
- **`value`** is always required; do not suggest omitting **`value`** for a “loading” bar — use **Button** **`loading`** / **`Button.Spinner`** or another pattern.
- Native **`<progress>`** is not a props bag: extra attributes are **not** forwarded from **`ProgressBar.Root`**.
- Step flows: **`value={currentStep}`**, **`max={totalSteps}`** (not necessarily 0–100).
