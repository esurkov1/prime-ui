# ProgressBar

**Category:** feedback

> Linear progress indicator on a native `<progress>` with a label, a percentage and a status color.

## When to use
- Determinate progress of an operation: file upload, import, export.
- How much of a quota or a set of steps is done ("Профиль: 3 из 5 шагов").
- Per-row progress inside lists (FileUpload rows use it through `FileUpload.ItemProgress`).

## When not to use
- Progress made of several parts or a distribution of shares → use [SegmentedProgressBar](../segmented-progress-bar/COMPONENT.md).
- A compact radial indicator or a KPI ring → use [ProgressCircle](../progress-circle/COMPONENT.md).
- Unknown duration (no value) → use a spinner, e.g. `Button` `loading`; ProgressBar has no indeterminate mode.
- Navigation through wizard steps → use [Stepper](../stepper/COMPONENT.md).

## Import
```tsx
import { ProgressBar } from "prime-ui-kit";
```

## API

### ProgressBar.Root
Leaf component. `forwardRef` to the inner `HTMLProgressElement`. No native props passthrough.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — (required) | Current value; clamped to `0…max`. |
| `max` | `number` | `100` | Top of the scale; a value `<= 0` falls back to `100`. |
| `label` | `string` | — | Visible label above the track and the accessible name of the `<progress>` (`aria-labelledby`). |
| `showValue` | `boolean` | `false` | Shows the rounded percentage at the right of the header (`tabular-nums`, `aria-hidden`). |
| `tone` | `"accent" \| "success" \| "warning" \| "danger"` | `"accent"` | Fill color. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Track height and label typography. |
| `className` | `string` | — | Class on the root `<div>`. |

## Variants

### tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `accent` | Accent fill on a `fill-strong` track | Progress in flight | yes |
| `success` | Success fill | Finished operations, healthy quota | |
| `warning` | Warning fill | Quota almost used, slow progress | |
| `danger` | Danger fill | Failed or interrupted operation | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | Track 4px, label 12/16, header gap 4 | Dense tables, inline rows | |
| `s` | Track 4px, label 12/16, header gap 4 | Compact lists | |
| `m` | Track 4px, label 13/20, header gap 8 | Default | yes |
| `l` | Track 8px, label 14/20, header gap 8 | Prominent single progress | |
| `xl` | Track 8px, label 14/20, header gap 8 | Hero / onboarding progress | |

### showValue
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` | Label only (or no header) | The exact number does not matter | yes |
| `true` | Secondary `NN%` at the right of the header | Uploads, quotas where the user tracks the number | |

**Combinations**
- Recommended: `accent` while running, then switch to `success` or `danger` with the result; `label` + `showValue` for uploads.
- Pointless: `showValue` with `max` meant as a count ("3 из 5") — put the count into `label` as in the example.
- Avoid: `danger` for normal high values — use it for failures only.

## States
| State | Driven by | DOM |
|---|---|---|
| tone / size | props | `data-tone`, `data-size` on the root |
| value | `value`, `max` | native `value` / `max` on `<progress>`; the visible fill is an `aria-hidden` layer over the track that slides by `translate` (inline-start anchored, RTL aware) over `slow` + `standard` in every browser; instant under `prefers-reduced-motion` |

Always controlled: pass the current `value` on every render.

## Layout & spacing
- `width: 100%` of the parent; the header is a row with the label (ellipsis) and the value.
- Label → track: `--prime-space-1` (xs/s) or `--prime-space-2` (m–xl).
- Stack several bars with `--prime-space-4`–`--prime-space-5`.

## Accessibility
- Native `<progress>`: role `progressbar` with value and max for screen readers.
- Give every bar a `label`: there is no `aria-label` prop, so a bar without `label` has no accessible name.
- The percentage text is `aria-hidden` (the native value is announced instead).
- ProgressBar has no `labels`.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [file-upload.tsx](examples/file-upload.tsx) | Live uploads in a card: growing progress, `success` when done, `danger` on failure | Per-item progress of background operations |
| [values-and-tones.tsx](examples/values-and-tones.tsx) | 0 / partial / 100, `success` / `warning` / `danger`, `max={5}` | Showing outcome and custom scales |
| [sizes.tsx](examples/sizes.tsx) | `xs`…`xl` with `label` and `showValue` | Picking a size |

```tsx
import { ProgressBar } from "prime-ui-kit";

export function ImportProgress() {
  return <ProgressBar.Root value={42} label="Импорт контактов" showValue />;
}
```

## Mistakes
- No `label` → the progress has no accessible name; add `label`.
- `tone="info"` / `tone="neutral"` → not supported; use `accent`.
- Values over `max` expecting overflow → they are clamped.
- Using it as a spinner with a fake value → use a loading state instead.

## Related
- [SegmentedProgressBar](../segmented-progress-bar/COMPONENT.md), [ProgressCircle](../progress-circle/COMPONENT.md) — other progress forms.
- [FileUpload](../file-upload/COMPONENT.md) — `FileUpload.ItemProgress` renders a ProgressBar.
