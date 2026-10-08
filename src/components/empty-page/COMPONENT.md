# EmptyPage

**Category:** feedback
**Kind:** composite

> Empty state of a page, a block or a menu: icon, title, explanation and an action.

## When to use
- A list, table or page has no data yet (first run) and the user should know what to do.
- A search or filter returned nothing (`layout="compact"` inside menus and lists).
- Data failed to load and the user can retry.
- Inside a card or data region that should keep its height (`layout="fill"`).

## When not to use
- A message about the page while data is present → use [Banner](../banner/COMPONENT.md).
- A transient result of an action → use [Notification](../notification/COMPONENT.md).
- Loading in progress → a [Skeleton](../skeleton/COMPONENT.md) of the content (a [Spinner](../spinner/COMPONENT.md) when there is no shape to hold), not an empty state; [Crossfade](../crossfade/COMPONENT.md) swaps it for the data or the empty state.

## Import
```tsx
import { EmptyPage } from "prime-ui-kit";
```

## Anatomy
```
EmptyPage.Root               centered column; size, layout
├─ EmptyPage.Icon            tile with one icon; tone
├─ EmptyPage.Title           <h2> (as)
├─ EmptyPage.Description     <p>
└─ EmptyPage.Actions         row of buttons
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### EmptyPage.Root
`ref` → `HTMLDivElement`. A centered column: icon tile, title, description, actions; parts rise in one after another on first render.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Icon tile, title type and padding; given to the controls inside. |
| `layout` | `"default" \| "fill" \| "compact"` | `"default"` | `default` sizes by content; `fill` stretches to the parent's height and centers; `compact` — a quiet state inside a menu or list: smaller text and icon, no entrance motion. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `role` (`status` in a filtered list), `aria-labelledby` and the other div attributes. |

### EmptyPage.Icon
`ref` → `HTMLDivElement`. A `<div>` tile holding one icon.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "accent" \| "danger"` | `"neutral"` | `neutral` — no data yet, `accent` — a first run and a call to start, `danger` — a failed load. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the icon), `className` and the other div attributes. |

### EmptyPage.Title · EmptyPage.Description
`ref` → the element. `<h2>` (or `as`) and `<p>`, both capped at the reading width.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `"h2" \| "h3" \| "h4" \| "p"` | `"h2"` | Title: tag that fits the outline; the look does not change. `p` inside menus, lists and table cells. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `id` (for `aria-labelledby`), `className` and the other attributes. |

### EmptyPage.Actions
`ref` → `HTMLDivElement`. A `<div>` row of buttons that wraps when narrow.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (Buttons in the same `size`), `className` and the other div attributes. |

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` · `s` | small tile, title-s, compact padding | inside cards, tables, side panels | |
| `m` | 48px tile, title-m, body-m description | regions and pages | yes |
| `l` · `xl` | large tile, title-l / heading-s, roomy padding | whole empty pages, onboarding | |

### layout
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `default` | sized by its content | most cases | yes |
| `fill` | stretches to the parent's height, centered | a card or data region that keeps its height | |
| `compact` | panel padding, body-s title, caption description, small tile, no entrance motion | menus, listboxes, command lists that filter to nothing | |

### tone (Icon)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | muted tile | no data yet | yes |
| `accent` | accent-soft tile | first run, a call to start | |
| `danger` | danger-soft tile | failed to load | |

## States
| State | Driven by | DOM |
|---|---|---|
| first render | mount (not `compact`) | parts rise in (`enterMotion`), `--prime-motion-stagger` apart; collapses under reduced motion |
| layout | `layout` | `data-layout="fill" \| "compact"` (none for `default`) |
| size | `size` | `data-size`; controls inside get the same tier |

## Layout & spacing
- Centered column, gap `--prime-space-2`; icon → title adds `--prime-space-2`, actions sit `--prime-space-3` lower.
- Title and description are capped at the reading width; actions wrap.
- Pass the same `size` to the buttons in Actions.

## Accessibility

### Keyboard
No keyboard interaction.

### ARIA
- The title is an `<h2>` (`as` picks `h3` / `h4` by the outline, `p` inside menus, lists and table cells); link the root to it with `aria-labelledby` when the empty state replaces a whole region.
- In a filtered menu or list set `role="status"`, so screen readers announce «Ничего не найдено».
- The icon is decorative: pass it with `aria-hidden`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | An empty search result: icon, title, description and two actions — `EmptyPage.Icon`, `EmptyPage.Actions`. |
| [sizes.tsx](examples/sizes.tsx) | Every tier changes the icon tile, the title and the padding; buttons in Actions take the same size — `size`. |
| [icon-tones.tsx](examples/icon-tones.tsx) | The tile tone tells why the area is empty: no data yet, a first run, or a failed load — `tone`. |
| [data-region.tsx](examples/data-region.tsx) | An empty data region: the empty state stretches over the rest of a card with a header — `layout`. |
| [compact.tsx](examples/compact.tsx) | The quiet empty state of a search panel: no entrance motion, smaller text, a paragraph title, one action — `layout`, `as`. |
| [narrow.tsx](examples/narrow.tsx) | In a 320 px side panel the text wraps under the tile and the actions wrap to a second line. |

## Mistakes
- Buttons in a non-`m` EmptyPage without `size` → pass the same `size` to them.
- `tone` on `EmptyPage.Root` → `tone` belongs to `EmptyPage.Icon`.
- Showing an empty state while data is loading → show loading first.
- Several primary buttons → one primary, placed last.
- A default empty state inside a menu → use `layout="compact"`; the entrance motion on every keystroke is noise.
- An `<h2>` title inside a menu, listbox or table cell → `EmptyPage.Title as="p"`.

## Related
- **Built from:** —
- **See also:** [DataTable](../data-table/COMPONENT.md), [Banner](../banner/COMPONENT.md), [Notification](../notification/COMPONENT.md), [Card](../card/COMPONENT.md)
