# EmptyPage

**Category:** feedback

> Empty state of a page or a block: icon, title, explanation and an action.

## When to use
- A list, table or page has no data yet (first run) and the user should know what to do.
- A search or filter returned nothing.
- Data failed to load and the user can retry.
- Inside a card or data region that should keep its height (`layout="fill"`).

## When not to use
- A short "no rows" line inside a table → use the [DataTable](../data-table/COMPONENT.md) `empty` slot.
- A message about the page while data is present → use [Banner](../banner/COMPONENT.md).
- A transient result of an action → use [Notification](../notification/COMPONENT.md).
- Loading in progress → show a loading state, not an empty state.

## Import
```tsx
import { EmptyPage } from "prime-ui-kit";
```

## Anatomy
```
EmptyPage.Root              centered column, provides size to children
├─ EmptyPage.Icon           rounded icon tile (tone)
├─ EmptyPage.Title          <h2>
├─ EmptyPage.Description    <p>, secondary text
└─ EmptyPage.Actions        centered row of buttons
```

## API

### EmptyPage.Root
`forwardRef` to `HTMLDivElement`. + native `<div>` props (`aria-labelledby`, `role`, …).

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Icon tile, type sizes and padding. Provided to children via the control-size context (pass it to Buttons explicitly). |
| `layout` | `"default" \| "fill"` | `"default"` | `default`: compact block sized by content. `fill`: stretches over the height of a flex parent and centers the content. |
| `className` | `string` | — | Class on the root. |
| `children` | `ReactNode` | — | Parts. |

### EmptyPage.Icon
No ref. + native `<div>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "accent" \| "danger"` | `"neutral"` | Tile color. |
| `children` | `ReactNode` | — | An svg icon (mark it `aria-hidden`); sized by the tier. |
| `className` | `string` | — | Class. |

### EmptyPage.Title
`forwardRef` to `HTMLHeadingElement`. + native `<h2>` props. Semibold title capped at the reading width.

### EmptyPage.Description
`forwardRef` to `HTMLParagraphElement`. + native `<p>` props. Secondary text capped at the reading width.

### EmptyPage.Actions
No ref. + native `<div>` props. Wrapping centered row, gap `--prime-space-2`.

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | Padding 24 × 12, tile 32 / icon 16, title 14/20, description 12/16 | Inside small cards, popovers | |
| `s` | Padding 32 × 16, tile 40 / icon 20, title 14/20, description 13/20 | Cards, side panels, table regions | |
| `m` | Padding 40 × 16, tile 48 / icon 24, title 16/24, description 14/20 | Sections and data regions | yes |
| `l` | Padding 48 × 24, tile 56 / icon 24, title 18/24, description 14/20 | Large regions | |
| `xl` | Padding 64 × 32, tile 64 / icon 32, title 20/28, description 16/24 | A whole empty page | |

### tone (EmptyPage.Icon)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | `fill-muted` tile, secondary icon | No data / no results | yes |
| `accent` | Accent soft tile, accent icon | First run, invitation to create something | |
| `danger` | Danger soft tile, danger icon | Loading failed | |

### layout
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `default` | Height by content | Standalone empty states | yes |
| `fill` | Grows to fill a flex parent, content centered | Inside cards/regions with a fixed or min height | |

**Combinations**
- Recommended: `neutral` + "Сбросить фильтры" for no results; `accent` + a primary action for first run; `danger` + an outline "Повторить".
- Hierarchy: at most one primary (solid) button, placed last; the rest outline/ghost.
- Pointless: `layout="fill"` in a parent that is not a flex column with height.

## States
| State | Driven by | DOM |
|---|---|---|
| size | `size` | `data-size` on Root |
| fill | `layout="fill"` | `data-layout="fill"` on Root |
| tone | Icon `tone` | `data-tone` on Icon |

First render: the parts fade and rise in one after another (`--prime-motion-stagger` apart, `base` · `enter`); they are interactive from the first frame, and the motion collapses under reduced motion.

## Layout & spacing
- Base gap `--prime-space-2`; icon → title gets `--prime-space-2` more; description → actions `--prime-space-3` more.
- Text is centered and capped at `--prime-layout-reading-max-width`; long words wrap.
- EmptyPage has no fill or radius of its own: the host card/region provides the surface.

## Accessibility
- Give the title an `id` and the root `aria-labelledby` so the region is named.
- Mark the icon `aria-hidden`; the title carries the meaning.
- Title is an `<h2>`: make sure it fits the page heading outline.
- EmptyPage has no `labels`.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [data-region.tsx](examples/data-region.tsx) | Card region with a header and `layout="fill"`, accent icon, two actions | Empty list/table area |
| [no-results.tsx](examples/no-results.tsx) | Search with no results: Icon, Title, Description, Actions | Filters/queries returning nothing |
| [icon-tones.tsx](examples/icon-tones.tsx) | `neutral`, `accent`, `danger` icon tones | Choosing the tone by cause |
| [sizes.tsx](examples/sizes.tsx) | `xs`…`xl` with a button of the same size | Picking a size |

```tsx
import { Button, EmptyPage } from "prime-ui-kit";

export function NoInvoices() {
  return (
    <EmptyPage.Root aria-labelledby="no-invoices-title">
      <EmptyPage.Title id="no-invoices-title">Счетов нет</EmptyPage.Title>
      <EmptyPage.Description>Выставленные счета появятся здесь.</EmptyPage.Description>
      <EmptyPage.Actions>
        <Button.Root>Выставить счёт</Button.Root>
      </EmptyPage.Actions>
    </EmptyPage.Root>
  );
}
```

## Mistakes
- Buttons in a non-`m` EmptyPage without `size` → pass the same `size` to them.
- `tone` on `EmptyPage.Root` → `tone` belongs to `EmptyPage.Icon`.
- Showing an empty state while data is loading → show loading first.
- Several primary buttons → one primary, placed last.

## Related
- [DataTable](../data-table/COMPONENT.md) — built-in `empty` slot for tables.
- [Banner](../banner/COMPONENT.md), [Notification](../notification/COMPONENT.md).
- [Card](../card/COMPONENT.md) — host surface for data regions.
