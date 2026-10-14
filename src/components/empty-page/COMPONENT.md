# EmptyPage

**Category:** status
**Kind:** composite

> Empty or failed state of a page, a block or a menu: icon, title, explanation and an action — a retry for a failed load.

## When to use
- A list, table or page has no data yet (first run) and the user should know what to do.
- A search or filter returned nothing (`layout="compact"` inside menus and lists).
- A region failed to load and the user can retry (`tone="danger"` + `EmptyPage.RetryButton`) — the region error of every data block.
- Inside a card or data region that should keep its height (`layout="fill"`).

## When not to use
- A message about the page while data is present (a failed refresh over shown data) → use [Banner](../banner/COMPONENT.md); the data stays.
- A transient result of an action → use [Notification](../notification/COMPONENT.md).
- Loading in progress → a [Skeleton](../skeleton/COMPONENT.md) of the content (a [Spinner](../spinner/COMPONENT.md) when there is no shape to hold), not an empty state; [Crossfade](../crossfade/COMPONENT.md) swaps it for the data or the empty state.

## Import
```tsx
import { EmptyPage } from "prime-ui-kit";
```

## Anatomy
```
EmptyPage.Root               centered column; size, layout, tone (role="alert" when danger)
├─ EmptyPage.Icon            tile with one icon; tone (default: the root's)
├─ EmptyPage.Title           <h2> (as)
├─ EmptyPage.Description     <p>
└─ EmptyPage.Actions         row of buttons
   └─ EmptyPage.RetryButton  the kit's «Повторить» (Button outline neutral + refresh icon); onRetry
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### EmptyPage.Root
`ref` → `HTMLDivElement`. A centered column: icon tile, title, description, actions; parts rise in one after another on first render.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Icon tile, title type and padding; given to the controls inside. |
| `layout` | `"default" \| "fill" \| "compact"` | `"default"` | `default` sizes by content; `fill` stretches to the parent's height and centers; `compact` — a quiet state inside a menu or list: smaller text and icon, no entrance motion. |
| `tone` | `"neutral" \| "danger"` | `"neutral"` | `neutral` — nothing here (yet); `danger` — the region failed to load: the icon tile turns danger and the root is `role="alert"` unless you pass a `role`. |
| `labels` | `Partial<EmptyPageLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `role` (`status` in a filtered list), `aria-labelledby` and the other div attributes. |

### EmptyPage.Icon
`ref` → `HTMLDivElement`. A `<div>` tile holding one icon.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "accent" \| "danger"` | the root's `tone` | `neutral` — no data yet, `accent` — a first run and a call to start, `danger` — a failed load. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the icon), `className` and the other div attributes. |

### EmptyPage.Title
`ref` → the element. An `<h2>` (or `as`) capped at the reading width.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `"h2" \| "h3" \| "h4" \| "p"` | `"h2"` | Tag that fits the outline; the look does not change. `p` inside menus, lists and table cells. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `id` (for `aria-labelledby`), `className` and the other attributes. |

### EmptyPage.Description
`ref` → `HTMLParagraphElement`. A `<p>` capped at the reading width.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `id` (for `aria-labelledby`), `className` and the other attributes. |

### EmptyPage.Actions
`ref` → `HTMLDivElement`. A `<div>` row of buttons that wraps when narrow.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (Buttons in the same `size`), `className` and the other div attributes. |

### EmptyPage.RetryButton
`ref` → `HTMLButtonElement`. The kit's retry of a failed region: an outline neutral Button with the refresh icon and `labels.retry`, in the root's tier. Put it in `EmptyPage.Actions`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `onRetry` | `() => void \| Promise<void>` | — (required) | Loads the region again. A returned Promise keeps the button loading until it settles; on reject the error state stays and the button is ready again. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" \| "type">` | — | `children` (text instead of `labels.retry`), `disabled`, `className` and the other button attributes. |

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

### tone (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | muted tile | nothing here (yet) | yes |
| `danger` | danger-soft tile; the root announces itself (`role="alert"`) | the region failed to load | |

### tone (Icon, overrides the root's)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | muted tile | no data yet | the root's tone |
| `accent` | accent-soft tile | first run, a call to start | |
| `danger` | danger-soft tile | failed to load | |

## States
| State | Driven by | DOM |
|---|---|---|
| first render | mount (not `compact`) | parts rise in (`enterMotion`), `--prime-motion-stagger` apart; collapses under reduced motion |
| layout | `layout` | `data-layout="fill" \| "compact"` (none for `default`) |
| size | `size` | `data-size`; controls inside get the same tier |
| error | `tone="danger"` | `data-tone="danger"`, `role="alert"` (unless a `role` is passed), the icon tile danger |
| retrying | `onRetry` returned a Promise that is pending | the RetryButton shows its loading state (`aria-busy`, spinner in place of the icon, same width) and ignores presses; resolve — the owner swaps the region (Crossfade), reject — the error stays and the button is ready |

## Layout & spacing
- Centered column, gap `--prime-space-2`; icon → title adds `--prime-space-2`, actions sit `--prime-space-3` lower.
- Title and description are capped at the reading width; actions wrap.
- Buttons in Actions take the root's tier from context (`EmptyPage.RetryButton` too).
- A region error fills its region like the data would (`layout="fill"` in a card), so the swap to data does not move the page.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Enter` · `Space` | On `EmptyPage.RetryButton`: retry the load; while the retry runs the button is loading and ignores presses. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- `tone="danger"` makes the root `role="alert"`, so the failure is announced when it appears; a `role` you pass replaces it.
- The title is an `<h2>` (`as` picks `h3` / `h4` by the outline, `p` inside menus, lists and table cells); link the root to it with `aria-labelledby` when the empty state replaces a whole region.
- In a filtered menu or list set `role="status"`, so screen readers announce «Ничего не найдено».
- The icon is decorative: pass it with `aria-hidden`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `retry` | `"Повторить"` | Text of `EmptyPage.RetryButton`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | An empty search result: icon, title, description and two actions — `EmptyPage.Icon`, `EmptyPage.Actions`. |
| [variants.tsx](examples/variants.tsx) | The tone tells why the area is empty: no data yet, a first run, or a failed load with a retry — `tone`, `EmptyPage.RetryButton`. |
| [sizes.tsx](examples/sizes.tsx) | Every tier changes the icon tile, the title and the padding; buttons in Actions take the same size — `size`. |
| [data-region.tsx](examples/data-region.tsx) | An empty data region: the empty state stretches over the rest of a card with a header — `layout`. |
| [region-error.tsx](examples/region-error.tsx) | A data region that failed to load: the error state takes the region, the retry shows its loading until the data cross-fades in; its text comes from labels — `tone`, `layout`, `EmptyPage.RetryButton`, `onRetry`, `labels`. |
| [compact.tsx](examples/compact.tsx) | The quiet empty state of a search panel: no entrance motion, smaller text, a paragraph title, one action — `layout`, `as`. |
| [narrow.tsx](examples/narrow.tsx) | In a 320 px side panel the text wraps under the tile and the actions wrap to a second line. |

## Mistakes
- Buttons in a non-`m` EmptyPage without `size` → they take the root's tier from context; do not pass another one.
- A failed load drawn as a neutral empty state → `tone="danger"` on the root; the icon follows.
- A hand-made «Повторить» with its own pending flag → `EmptyPage.RetryButton` with an async `onRetry`.
- Clearing the error the moment the retry starts → keep the error state until the retry settles; the button shows the wait.
- Showing an empty state while data is loading → show loading first.
- Several primary buttons → one primary, placed last.
- A default empty state inside a menu → use `layout="compact"`; the entrance motion on every keystroke is noise.
- An `<h2>` title inside a menu, listbox or table cell → `EmptyPage.Title as="p"`.

## Related
- **Built from:** [Button](../button/COMPONENT.md) (RetryButton), Icon (`action.refresh`)
- **See also:** [Crossfade](../crossfade/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [Banner](../banner/COMPONENT.md), [Notification](../notification/COMPONENT.md), [Card](../card/COMPONENT.md)
