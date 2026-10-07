# Spinner

**Category:** feedback
**Kind:** primitive

> An indeterminate loading indicator: a ring with a gap that turns while a request runs.

## When to use
- A region, panel or list is loading and the progress is unknown.
- A status line next to text («Загружаем счета…»).
- Inside a kit component that shows loading (it is the kit's one spinner).

## When not to use
- The progress is known (upload, steps, quota) → use [ProgressBar](../progress-bar/COMPONENT.md) or [ProgressCircle](../progress-circle/COMPONENT.md).
- A button waiting for its request → set `loading` on [Button](../button/COMPONENT.md); it places the spinner itself.
- A table loading its rows → `loading` on [DataTable](../data-table/COMPONENT.md) (skeleton rows keep the layout).
- A whole page failed to load → [EmptyPage](../empty-page/COMPONENT.md) with a retry action.

## Import
```tsx
import { Spinner } from "prime-ui-kit";
```

## Anatomy
```
Spinner          <span role="status">; size and tone
├─ ring          the turning ring (aria-hidden)
└─ label         visually hidden labels.loading
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Spinner
`ref` → `HTMLSpanElement`. A turning ring inside a `role="status"` region with text for screen readers.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | — | Explicit size on the icon scale: 14 · 16 · 20 · 24 · 32. Without it the spinner follows its host like `Icon`: the host's `--prime-icon-size`, else the nearest control tier, else 16. |
| `tone` | `"default" \| "secondary" \| "muted" \| "accent" \| "success" \| "warning" \| "danger"` | `"default"` | Ring color; `default` inherits `currentColor`. |
| `labels` | `Partial<SpinnerLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className`, `aria-hidden`, `data-*` and the other span attributes. |

## Variants

### tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `default` | the color of the surrounding text | inside text, buttons, rows | yes |
| `secondary` | `text-secondary` | a status line in secondary text | |
| `muted` | `text-muted` | a loading region on a card | |
| `accent` | `accent-text` | the one loading spot that should draw the eye | |
| `success` · `warning` · `danger` | the status `*-text` color | loading inside a status block of that tone | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 14px | dense rows, inside `xs` controls | |
| `s` | 16px | next to `body-s` text | |
| `m` | 20px | standalone next to `body-m` text | |
| `l` | 24px | a loading card or panel | |
| `xl` | 32px | a loading page region | |
| — (omitted) | the host's icon size, else the control tier (16 on `m`) | inside a kit control or next to its text | yes |

## States
| State | Driven by | DOM |
|---|---|---|
| spinning | mounted | the ring turns at a constant speed (`slow × 3` per turn, linear) |
| reduced motion | `prefers-reduced-motion` | duration collapses to 0: the ring stays still and visible |
| size / tone | `size`, `tone` | `data-size`, `data-tone` (only for a non-default tone) |

## Layout & spacing
- Next to text: one row, `align-items: center`, gap = the tier gap (`--prime-control-m-gap`).
- In a loading region: centered in the region with its explanation under it, gap `--prime-space-3`.
- Render the real layout around it; never a full-screen overlay of spinners.

## Accessibility

### Keyboard
No keyboard interaction.

### ARIA
- `role="status"` with a visually hidden `labels.loading`, so screen readers learn that something is loading.
- When the host already announces it is busy (`aria-busy` on a button or a region), pass `aria-hidden="true"`.
- Under `prefers-reduced-motion` the ring does not turn and stays visible.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `loading` | `"Загрузка"` | Visually hidden text inside `role="status"`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A loading status next to a short explanation; the spinner takes the text color. |
| [variants.tsx](examples/variants.tsx) | Every ring color; `default` follows the surrounding text — `tone`. |
| [sizes.tsx](examples/sizes.tsx) | Every size on the icon scale, 14 to 32 px — `size`. |
| [loading-region.tsx](examples/loading-region.tsx) | A card that loads its content: the region says it is busy and the spinner stays hidden from screen readers — `aria-hidden`. |

## Mistakes
- A hand-made spinner (`@keyframes spin` on a bordered circle) → use `Spinner`.
- A `Spinner` next to a `loading` Button → the button already shows one.
- Both `aria-busy` on the region and a spoken spinner inside → add `aria-hidden="true"` to the spinner.
- A spinner for a known progress → ProgressBar / ProgressCircle.

## Related
- **Built from:** —
- **See also:** [ProgressBar](../progress-bar/COMPONENT.md), [ProgressCircle](../progress-circle/COMPONENT.md), [Button](../button/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md)
