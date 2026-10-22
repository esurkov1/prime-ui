# Crossfade

**Category:** status
**Kind:** layout

> A region that cross-fades between its states (loading → data → empty → error): the data replaces the loading skeleton in place, settled states glide to the new height, so the page below does not jump.

Continuous state change is a foundation of the kit (foundation §1 rule 7): a region never flips from
one state to another, and nothing that loads unfolds. Crossfade is the mechanic for regions; its
loading state is the state `"loading"`, a [Skeleton](../skeleton/COMPONENT.md) in the shape of the
coming content from the first render, which the data replaces in place — a short fade, the height
settled in one frame. Only a swap between settled states (data, empty, error, another record)
glides the height.

## When to use
- A card, panel or page region that switches between loading, data, empty and error states of its own content — every such region, not only the prominent ones.
- A detail panel that shows one record at a time: key it by the record id.
- Any in-place swap of one block for another where an instant flip would be jarring.
- A region as high as its panel (a board, a chat, a full-height table) that swaps states: `fill`.
- An optional block (a notice, a bulk-action bar) that comes and goes in a grid or a flex column: empty children leave no box, so the gap closes too.

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
`ref` → `HTMLDivElement`. A region that cross-fades its content when `state` changes and, between settled states, glides from the height on screen to the new one; still on the first render. A state that turns back within the swap hold never shows.

| Prop | Type | Default | Description |
|---|---|---|---|
| `state` | `string \| number` | — (required) | Key of what the region shows: `"loading"`, `"ready"`, `"empty"`, `"error"` or a record id. A new value cross-fades; the same one updates in place. A swap into or out of `"loading"` never glides the height. |
| `fill` | `boolean` | `false` | The region takes its parent's height (a flex or grid item, or a sized block) and every state stretches to it; the height never glides. A `Crossfade` that is the child of a `Page.Cell` fills it unless `fill` is set. |
| `children` | `ReactNode` | — | Content of the current `state`. Nothing (`null`, `false`) leaves no box once the old state has faded: no gap in a grid or a flex column. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `aria-busy`, `aria-live`, `role` and the other div attributes. |

## Variants
Crossfade has no variants: one treatment, keyed by `state`.

### Flags
| Flag | Looks like when on | Use when | Default |
|---|---|---|---|
| `fill` | the root takes its parent's height; each state's content stretches to it; the leaving layer covers the whole root; no height glide | a full-height region: a board, a chat, a pane in a fixed-height page | `false` |

### state
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `"loading"` | the Skeleton; entering or leaving it the content swaps in place with a short fade (`fast`), the height settles at once | the region waits for its data | — |
| a settled status (`"ready"`, `"empty"`, `"error"`) | the old content fades out over the new one fading in; the height glides | a region's screen states | — |
| a record id | the same cross-fade between two records | a detail panel showing one record at a time | — |
| the same value with new children | updated in place, no motion | data refreshes inside one state | — |

## States
| State | Driven by | DOM |
|---|---|---|
| first render | mount | one layer, `data-state="open"`, no motion |
| held | `state` changes; a swap out of `"loading"` or back to a state still on screen does not wait | for the swap hold (120 ms, foundation §7 rule 8) root `data-held="true"` keeps the height on screen (`data-resizing="true"`), the old layer stays shown and the new one, already in the document, unseen; a `state` that turns back within it brings the old layer back as it was — no fade, no glide; another one replaces the waiting one unseen |
| swapping | the hold is over | previous layer `data-state="closed"`, `aria-hidden`, `inert`, absolutely placed, fades out over `fast` with `exit` easing and unmounts once faded (timeout fallback), clipped to the root while it leaves (`data-swapping="true"`); the new layer fades in over `base` with `enter` easing. The fades run from the opacity on screen, over the part of the clock the distance takes |
| reversing | `state` turns back to a state whose layer is still fading out | no hold: that layer takes its place again and fades back in from where it is, the other fades out from where it is, the height glides back from where it is — no restart, no dip |
| loading swap | `state` changes into or out of `"loading"` | as swapping, but the new layer fades in over `fast` and the root takes the new height at once (no `data-resizing`) |
| resizing | a swap between settled states, the new one more than 2px off the height on screen | root `data-resizing="true"`: height glides from the height on screen to the new one over `base` with `standard` easing (a swap mid-glide starts from where it is; new content that settles later — a part portalled in, an image — moves the target and the glide turns to it), clipped with a `--prime-focus-space` margin, then returns to `auto` |
| reduced motion | `prefers-reduced-motion: reduce` | once the hold is over the old layer goes before it is painted and the height does not glide; the new layer still fades in (the fade clock, foundation §7 rule 12) |
| focus handoff | focus was in the old state when `state` changed | focus moves into the new layer: its first tab stop, else the layer itself (`tabindex="-1"`); focus elsewhere stays |
| empty | the current state renders nothing (`null`, `false`, `""`) | no current layer; once nothing is leaving the root is `:empty` and `display: none` — no box and no gap in its grid or flex parent |
| filling | `fill` | `data-fill="true"`; the root is a one-cell grid (`flex: 1`, `height: 100%`, `min-height: 0`), layers stretch to it |

Motion is opacity only, so nothing shifts under the pointer; the leaving content keeps its instance (no remount, no repeated effects) until it is gone. Each state is a block formatting context, so it measures the same in flow and laid over as it leaves.

## Layout & spacing
- No padding, gap or fill of its own: it sits where the swapped content would sit (inside `Card.Body`, a page section, a panel).
- Width spans the parent's inline size, also as the item of a centring grid (`place-items: center`): shrunk to its content there, a child that is an inline-size container (a Card, a LoginForm) would collapse. Inside a centring flex column give it `align-self: stretch` through `className`. Height is the current content's height except while gliding — or, with `fill`, the parent's height (the parent needs one: a flex or grid column with a height, `Page.Root fill`).
- An empty Crossfade has no box: an optional block above a list keeps the page rhythm whether it is there or not.
- The loading state is a `Skeleton` with the geometry of the data it stands for (same rows, same line heights), so the swap to data changes neither layout nor height. The swap out of `"loading"` never glides, so a skeleton of another height shows as a jump.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No keyboard interaction.

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- Renders a plain `<div>`; pass `aria-busy` while the region loads and `aria-live` or `role` when its changes must be announced.
- The leaving layer is `aria-hidden` and `inert`: screen readers and Tab never reach content that is going away.
- Focus in the old state (the retry button of an error) moves into the new one: its first tab stop, or the new content itself; focus elsewhere on the page stays where it is.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A card region that cross-fades between loading, data, empty and error and glides to the new height — `state`. |
| [record-switch.tsx](examples/record-switch.tsx) | A detail panel keyed by the record id: picking another client cross-fades the details of a different height — `state`. |
| [fill.tsx](examples/fill.tsx) | A deal board that fills its panel's height while it swaps between loading and data, and a notice slot above it that takes no room while empty — `fill`, `state`. |
| [screen.tsx](examples/screen.tsx) | Screen states: the title and the date of the statement in its top bar, a page-level error in a Banner with a retry, a region loading with a Skeleton of its rows and a table skeleton, the table error in place and a first-run EmptyPage; regions cross-fade between states — `state`. |

## Mistakes
- A new `state` on every data refresh (`state={Date.now()}`) → key by what the region shows, not by when it was fetched.
- Switching states with `{loading ? <Spinner /> : <List />}` and no wrapper → wrap the region in `Crossfade state={status}` and show a `Skeleton` of the list while it loads.
- A spinner block for content of known shape → a `Skeleton` of that shape; a spinner is for loading with no shape to hold (a button, a status line).
- Wrapping a DataTable to animate its loading / empty / error → the table body already cross-fades; use its props.
- Hand-written `opacity` transitions or `height` animations for a state swap → Crossfade owns both, with tokens and reduced motion.
- An effect that moves focus out of a state that is going away (the retry button of an error) → Crossfade hands focus to the new state itself.
- `height: 100%` on the content of a full-height region → `fill` on the Crossfade; its layers stretch.
- `fill` around a card on a full-screen canvas (a sign-in page) → the card stretches to the canvas height; leave `fill` off and put the Crossfade around the card inside the canvas.
- A loading state that renders nothing (`{loading ? null : <List />}`) → the region grows from zero when the data arrives; content that mounts already loaded appears in place, and a loading state is a `Skeleton` in the data's geometry.
- A loading state under another key (`"pending"`, `"fetching"`) → the swap to data glides the height as if it were a settled state; name it `"loading"`.
- Splitting empty ↔ list out of the Crossfade, or holding a removed record until the refetch, to stop the region folding → key `state` by the region's status; a status that turns back within the hold never moves, and a change inside one state (a row added or removed) moves only that row.
- Rendering an optional block conditionally outside Crossfade (`{notice && <Banner />}`) → it pops in and out; keep the Crossfade and pass `null` when there is nothing to show.

## Related
- **Built from:** —
- **See also:** [Skeleton](../skeleton/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md), [Spinner](../spinner/COMPONENT.md), [Banner](../banner/COMPONENT.md)
