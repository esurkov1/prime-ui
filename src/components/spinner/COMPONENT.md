# Spinner

**Category:** status
**Kind:** primitive

> An indeterminate loading indicator: the kit ring with the share unknown — a quarter arc turning on a faint track while a request runs.

## When to use
- A region is busy and has no content shape to hold (a running job, a request with no layout yet).
- A status line next to text («Загружаем счета…»).
- Inside a kit component that shows loading (it is the kit's one spinner).

## When not to use
- The progress is known (upload, steps, quota) → use [ProgressBar](../progress-bar/COMPONENT.md) or [ProgressCircle](../progress-circle/COMPONENT.md).
- A named process on the data scale whose share is not known yet (an import card) → [ProgressCircle](../progress-circle/COMPONENT.md) `value={null}`: a `progressbar` with your name that can show the share once it arrives.
- A button waiting for its request → set `loading` on [Button](../button/COMPONENT.md); it places the spinner itself.
- Content of a known shape is loading (a list, a card, a form) → [Skeleton](../skeleton/COMPONENT.md) of that shape inside [Crossfade](../crossfade/COMPONENT.md).
- A table loading its rows → `loading` on [DataTable](../data-table/COMPONENT.md) (skeleton rows keep the layout).
- A whole page failed to load → [EmptyPage](../empty-page/COMPONENT.md) with a retry action.

## Import
```tsx
import { Spinner } from "prime-ui-kit";
```

## Anatomy
```
Spinner          <span role="status">; size and tone
├─ ring          the kit ring (internal/ring, value null): a quarter arc on a faint track (aria-hidden)
└─ label         visually hidden labels.loading
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Spinner
`ref` → `HTMLSpanElement`. The kit ring with the share unknown — a quarter arc turning on a faint track, at the line weight — inside a `role="status"` region with text for screen readers.

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
| spinning | mounted | the ring turns at a constant speed (`--prime-motion-loop × 3` per turn, linear) |
| reduced motion | `prefers-reduced-motion` | the ring keeps turning, twice as slow (`--prime-motion-loop × 6` per turn) and linear: a loading cue is information, so the token is not zeroed |
| size / tone | `size`, `tone` | `data-size` (the explicit size, else the host control tier, else `m`), `data-tone` (only for a non-default tone) |

## Layout & spacing
- The ring fills the icon box: a stroke of two border widths (the line weight, an icon's stroke) — a round-capped quarter arc in the tone color over an 18% track of it; `inline-flex`, `vertical-align: middle`. The svg turns as a whole (a compositor transform).
- Next to text: one row, `align-items: center`, gap = the tier gap (`--prime-control-m-gap`).
- In a loading region: centered in the region with its explanation under it, gap `--prime-space-3`.
- Render the real layout around it; never a full-screen overlay of spinners.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No keyboard interaction.

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- `role="status"` with a visually hidden `labels.loading`, so screen readers learn that something is loading.
- When the host already announces it is busy (`aria-busy` on a button or a region), pass `aria-hidden="true"`.
- Under `prefers-reduced-motion` the ring keeps turning, slower and linear, so the loading cue stays readable.

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
- **Built from:** `internal/ring` (the ring drawing, shared with ProgressCircle and the circle Button), [VisuallyHidden](../visually-hidden/COMPONENT.md)
- **See also:** [Skeleton](../skeleton/COMPONENT.md), [ProgressBar](../progress-bar/COMPONENT.md), [ProgressCircle](../progress-circle/COMPONENT.md), [Button](../button/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md)
