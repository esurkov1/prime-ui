# Crossfade

**Category:** feedback
**Kind:** layout

> A region that cross-fades between its states (loading → data → empty → error) and glides to the new height, so the page below does not jump.

Continuous state change is a foundation of the kit (foundation §1 rule 7): a region never flips from
one state to another. Crossfade is the mechanic for regions; its loading state is a
[Skeleton](../skeleton/COMPONENT.md) in the shape of the coming content.

## When to use
- A card, panel or page region that switches between loading, data, empty and error states of its own content — every such region, not only the prominent ones.
- A detail panel that shows one record at a time: key it by the record id.
- Any in-place swap of one block for another where an instant flip would be jarring.

## When not to use
- A table loading, empty or failing → set `loading`, `empty`, `error` on [DataTable](../data-table/COMPONENT.md); its body already cross-fades between them.
- Content that only updates (new numbers, one more row) → render it in place; keep the same `state`.
- Panels the user switches between → [Tabs](../tabs/COMPONENT.md).
- Showing and hiding a block (disclosure) → [Accordion](../accordion/COMPONENT.md).
- Floating layers → overlays carry their own motion ([Popover](../popover/COMPONENT.md), [Modal](../modal/COMPONENT.md)).

## Import
```tsx
import { Crossfade } from "prime-ui-kit";
```

## Anatomy
```
Crossfade          <div>; holds the region's height while it changes
├─ leaving layer   the previous state, laid over the new one while it fades out (aria-hidden, inert)
└─ current layer   children of the current state, in flow
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Crossfade
`ref` → `HTMLDivElement`. A region that cross-fades its content when `state` changes and glides to the new height; still on the first render, instant under reduced motion.

| Prop | Type | Default | Description |
|---|---|---|---|
| `state` | `string \| number` | — (required) | Key of what the region shows: `"loading"`, `"ready"`, `"empty"`, `"error"` or a record id. A new value cross-fades the old content into the new one; the same value updates in place. |
| `children` | `ReactNode` | — | Content of the current `state`. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `aria-busy`, `aria-live`, `role` and the other div attributes. |

## Variants
Crossfade has no variants: one treatment, keyed by `state`.

### state
| Value | Looks like | Use when | Default |
|---|---|---|---|
| a status (`"loading"`, `"ready"`, `"empty"`, `"error"`) | the old content fades out over the new one fading in; the height glides | a region's screen states | — |
| a record id | the same cross-fade between two records | a detail panel showing one record at a time | — |
| the same value with new children | updated in place, no motion | data refreshes inside one state | — |

## States
| State | Driven by | DOM |
|---|---|---|
| first render | mount | one layer, `data-state="open"`, no motion |
| swapping | `state` changes | previous layer `data-state="closed"`, `aria-hidden`, `inert`, absolutely placed, fades out over `fast` with `exit` easing and unmounts on `animationend` (timeout fallback); the new layer fades in over `base` with `enter` easing |
| resizing | the new state has another height | root `data-resizing="true"`: height glides from the old to the new value over `base` with `standard` easing, clipped with a `--prime-focus-space` margin, then returns to `auto` |
| reduced motion | `prefers-reduced-motion: reduce` | instant swap: no leaving layer, no glide |

Motion is opacity only, so nothing shifts under the pointer; the leaving content keeps its instance (no remount, no repeated effects) until it is gone.

## Layout & spacing
- No padding, gap or fill of its own: it sits where the swapped content would sit (inside `Card.Body`, a page section, a panel).
- Width follows the parent; height is the current content's height except while gliding.
- The loading state is a `Skeleton` with the geometry of the data it stands for (same rows, same line heights), so the swap to data changes neither layout nor height.

## Accessibility

### Keyboard
No keyboard interaction.

### ARIA
- Renders a plain `<div>`; pass `aria-busy` while the region loads and `aria-live` or `role` when its changes must be announced.
- The leaving layer is `aria-hidden` and `inert`: screen readers and Tab never reach content that is going away.
- Move focus yourself when the focused control was in the old state (e.g. the retry button of an error).

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A card region that cross-fades between loading, data, empty and error and glides to the new height — `state`. |
| [record-switch.tsx](examples/record-switch.tsx) | A detail panel keyed by the record id: picking another client cross-fades the details of a different height — `state`. |

## Mistakes
- A new `state` on every data refresh (`state={Date.now()}`) → key by what the region shows, not by when it was fetched.
- Switching states with `{loading ? <Spinner /> : <List />}` and no wrapper → wrap the region in `Crossfade state={status}` and show a `Skeleton` of the list while it loads.
- A spinner block for content of known shape → a `Skeleton` of that shape; a spinner is for loading with no shape to hold (a button, a status line).
- Wrapping a DataTable to animate its loading / empty / error → the table body already cross-fades; use its props.
- Hand-written `opacity` transitions or `height` animations for a state swap → Crossfade owns both, with tokens and reduced motion.

## Related
- **Built from:** —
- **See also:** [Skeleton](../skeleton/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md), [Spinner](../spinner/COMPONENT.md), [Banner](../banner/COMPONENT.md)
