# Skeleton

**Category:** status
**Kind:** primitive

> A placeholder in the shape of the content that is loading — text lines, a control, an avatar, a block — so the layout is in place before the data arrives.

## When to use
- A region whose content has a known shape is loading: a list, a card, a profile, a form with saved values.
- The loading state inside [Crossfade](../crossfade/COMPONENT.md): the skeleton holds the data's geometry and cross-fades into it.
- First load of a page section, when the structure is known before the values.

## When not to use
- Loading with no shape to hold (a button waiting for its request, a status line) → [Spinner](../spinner/COMPONENT.md), or `loading` on [Button](../button/COMPONENT.md).
- A known progress (upload, steps) → [ProgressBar](../progress-bar/COMPONENT.md) or [ProgressCircle](../progress-circle/COMPONENT.md).
- A table loading its rows → `loading` on [DataTable](../data-table/COMPONENT.md); it renders skeleton rows of its columns itself.
- Data already on screen being refreshed → keep it and set `aria-busy`; do not swap it back to a skeleton.

## Import
```tsx
import { Skeleton } from "prime-ui-kit";
```

## Anatomy
```
Skeleton           <span aria-hidden="true">; data-shape, data-size
└─ line × lines    shape="text" only: one line box per line, a rounded bar in its middle
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Skeleton
`ref` → `HTMLSpanElement`. A pulsing placeholder in the shape of loading content; `aria-hidden="true"`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `shape` | `"text" \| "control" \| "circle" \| "block"` | `"text"` | `text` — lines of the tier's text; `control` — a field or button of the tier; `circle` — an avatar of the tier; `block` — a box that fills its container (image, chart, card). |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `host tier, else "m"` | Tier of the text line (control text size and line height), the control height or the avatar size. |
| `lines` | `number` | `1` | `text` only: number of lines; the last of several is 60% wide. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` (width, height of a `block`), `data-*` and the other span attributes. |

## Variants

### shape
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `text` | rounded bars on the tier's text line boxes; the last of several lines is 60% wide | titles, names, descriptions, cells | yes |
| `control` | a block of the tier's control height and radius, full width | fields, buttons, selects of a form | |
| `circle` | a circle of the tier's avatar size | avatars, round icons | |
| `block` | a radius-l block that fills its container (at least 64px high) | images, covers, charts, whole cards | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` · `s` · `m` · `l` · `xl` | text: the control text size and line height of the tier; control: the control height; circle: the avatar size | the tier of the content it stands for | host tier, else `m` |

## States
| State | Driven by | DOM |
|---|---|---|
| pulsing | mounted | opacity eases 1 → 0.4 and back (`slow × 5`, `standard`, alternate) |
| reduced motion | `prefers-reduced-motion: reduce` | no pulse: the placeholder stands still and stays visible |
| shape / size | `shape`, `size` | `data-shape`, `data-size` |

## Layout & spacing
- Put skeletons in the real layout of the content: the same grid, gaps and paddings, so the swap to data moves nothing.
- Width: a text line and a control fill their container; narrow them with a `className` (a label is shorter than its field, an amount shorter than a name). Shape defaults have zero specificity, so a `className` always wins.
- Height: text and control come from the tier; a `block` fills its container or takes a height from `className`.
- Inside a sized host (a DataTable, a Popover, a field tier) `size` follows the host tier.

## Accessibility

### Keyboard
No keyboard interaction.

### ARIA
- Decorative: `aria-hidden="true"`, screen readers skip it.
- The loading region announces itself: `aria-busy` on it (Crossfade, a card, a form) and, when the wait matters, a `role="status"` text.
- Under `prefers-reduced-motion` the placeholder does not pulse.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A project card while it loads: the cover, the author and two lines of text take the room of the real content — `shape`, `lines`. |
| [sizes.tsx](examples/sizes.tsx) | Every tier of a text line, a control and an avatar circle: the placeholder matches the content of that tier — `size`, `shape`. |
| [form.tsx](examples/form.tsx) | A settings form while its values load: labels are short text lines, fields and the button are controls of the same tier — `shape`. |
| [with-crossfade.tsx](examples/with-crossfade.tsx) | A list that reloads: placeholder rows of the same geometry cross-fade into the data, nothing jumps — `Crossfade`, `state`. |

## Mistakes
- A hand-drawn grey box with its own `@keyframes` → use `Skeleton`.
- A spinner in the middle of an empty card while its list loads → skeleton rows of that list.
- Skeletons of a different geometry than the data (one tall block for three rows) → the swap jumps; mirror the rows.
- Swapping a skeleton for data without `Crossfade` → wrap the region: `Crossfade state={loading ? "loading" : "ready"}`.
- Returning to a skeleton on every refresh of data already shown → keep the data, set `aria-busy`.

## Related
- **Built from:** —
- **See also:** [Crossfade](../crossfade/COMPONENT.md), [Spinner](../spinner/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md)
