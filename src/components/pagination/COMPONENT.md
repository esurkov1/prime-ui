# Pagination

**Category:** navigation

> Page-by-page navigation: arrows, page numbers with ellipsis and a compact «3 / 12» view.

## When to use
- Lists and tables split into pages, usually in their footer.
- Narrow places (cards, mobile footers) — `compact` or `compact="auto"`.

## When not to use
- Steps of a process with names and statuses → use [Stepper](../stepper/COMPONENT.md).
- Switching sections of one screen → use [Tabs](../tabs/COMPONENT.md).
- A table with its own footer → [DataTable](../data-table/COMPONENT.md) already includes pagination.

## Import
```tsx
import { Pagination } from "prime-ui-kit";
```

## API

### Pagination.Root
Renders `<nav>`; does not forward a ref. + native `<nav>` props (`HTMLAttributes<HTMLElement>` except `defaultValue`, `onChange`); `aria-label` always comes from `labels.nav`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `totalPages` | `number` | — (required) | Number of pages. Below `1` nothing is rendered. |
| `value` | `number` | — | Current page (1-based), controlled. Clamped to `1…totalPages`. |
| `defaultValue` | `number` | `1` | Initial page, uncontrolled. |
| `onValueChange` | `(page: number) => void` | — | Called on a page button or arrow click (not when the page does not change). |
| `siblingCount` | `number` | `1` | Pages on each side of the current one before an ellipsis (only when `totalPages > 7`). |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Control tier: button height, radius, text, icon. |
| `compact` | `boolean \| "auto"` | `false` | `true` — arrows + «current / total» instead of numbers; `"auto"` — fills the parent and switches to compact when the container is narrower than 22rem. |
| `labels` | `Partial<PaginationLabels>` | see Accessibility | Screen-reader strings. |
| `className` | `string` | — | Extra class on the `nav`. |

## Variants

### compact
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` | ghost arrow buttons around page numbers; ellipsis «…» for skipped ranges | desktop list and table footers | yes |
| `true` | arrows around «3 / 12» (current in primary medium, total muted, tabular numbers) | cards, mobile footers, tight toolbars | |
| `"auto"` | `display: block; width: 100%`; full view right-aligned, below 22rem container width the compact view with arrows at the edges | responsive footers (DataTable uses this) | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28px square buttons, 12/16 text, icon 14, no gap | dense tables | |
| `s` | 32px, 13/20, icon 16, gap 4 | list and table footers next to an `s` Select | |
| `m` | 36px, 14/20, icon 16, gap 4 | default | yes |
| `l` | 40px, 16/24, icon 20, gap 4 | large layouts | |
| `xl` | 48px, 16/24, icon 20, gap 8 | touch-first screens | |

Button height equals the control height: Pagination lines up with Button, Input and Select of the same `size`.

### Page range
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `totalPages ≤ 7` | every page number, no ellipsis | short lists | |
| `siblingCount={1}` | 1 … 19 20 21 … 40 | most lists | yes |
| `siblingCount={2}` | 1 … 18 19 20 21 22 … 40 | wide footers, frequent jumps | |

**Combinations**
- Recommended: `size="s"` with a rows-per-page Select of the same size in a list footer; `compact="auto"` when the footer can get narrow.
- Avoid: a large `siblingCount` together with `compact="auto"` in a narrow container — the full row overflows before it collapses.

## States
| State | Driven by | DOM |
|---|---|---|
| current page | `value` / `defaultValue` | `aria-current="page"`, `data-current="true"`, `accent-soft` fill + accent text |
| hover / active | pointer | `fill-subtle` / `fill-subtle-active`, primary text |
| focus-visible | keyboard | outer focus ring |
| disabled arrow | first / last page | native `disabled`, `text-disabled` |

Root attributes: `data-size`, `data-compact` (`"true"` / `"false"` / `"auto"`). Controlled: `value` + `onValueChange`; uncontrolled: `defaultValue`.

## Layout & spacing
- In a list footer: range text on the left, controls on the right (`justify-content: space-between`), `gap: var(--prime-space-6)` between the per-page Select and the pager; let the row wrap.
- `compact="auto"` needs a parent with a width — it is a size container.

## Accessibility
- `nav` landmark with `aria-label`; page buttons have `aria-label` from `labels.page(n)` and the current one `aria-current="page"`; the ellipsis is `aria-hidden`.
- Compact view reads «3 из 12» via the visually hidden `labels.of`.
- Keyboard: Tab through buttons, Enter/Space activates.

| `labels` key | Default | Used for |
|---|---|---|
| `nav` | `"Навигация по страницам"` | `aria-label` of the `nav` |
| `previous` | `"Предыдущая страница"` | previous arrow |
| `next` | `"Следующая страница"` | next arrow |
| `page` | `(page) => \`Страница ${page}\`` | page button `aria-label` |
| `of` | `"из"` | hidden word between current and total in the compact view |

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [list-footer.tsx](examples/list-footer.tsx) | Range + rows-per-page Select + `s` pagination | list and table footers |
| [sizes.tsx](examples/sizes.tsx) | Every size next to a Button of the same size | aligning with controls |
| [states.tsx](examples/states.tsx) | Disabled edge arrows, ≤ 7 pages, `siblingCount` 1 and 2 | choosing the range behaviour |
| [compact.tsx](examples/compact.tsx) | `compact` and `compact="auto"` at 36rem and 20rem | narrow and responsive footers |

```tsx
import { Pagination } from "prime-ui-kit";
import * as React from "react";

export function OrdersPager() {
  const [page, setPage] = React.useState(1);
  return <Pagination.Root value={page} totalPages={12} onValueChange={setPage} />;
}
```

## Mistakes
- `page` / `onPageChange` → use `value` / `onValueChange`.
- 0-based page index → pages start at `1`.
- Passing `aria-label` to change the landmark name → use `labels={{ nav: "…" }}`.
- `compact="auto"` inside a shrink-wrapped flex item → give the parent a width.

## Related
- [DataTable](../data-table/COMPONENT.md)
- [Select](../select/COMPONENT.md)
- [Stepper](../stepper/COMPONENT.md)
