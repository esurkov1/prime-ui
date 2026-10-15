# Pagination

**Category:** navigation
**Kind:** navigation

> Page-by-page navigation: arrows, page numbers with ellipsis and a compact «3 / 12» view.

## When to use
- Lists and tables split into pages, usually in their footer.
- Narrow places (cards, mobile footers): it turns compact by itself below 22rem of its width; `compact` forces that view.

## When not to use
- Steps of a process with names and statuses → use [Stepper](../stepper/COMPONENT.md).
- Switching sections of one screen → use [Tabs](../tabs/COMPONENT.md).
- A table → [DataTable](../data-table/COMPONENT.md) already renders Pagination in its footer.

## Import
```tsx
import { Pagination } from "prime-ui-kit";
```

## Anatomy
```
Pagination              <nav aria-label={labels.nav}>; size and compact mode
├─ previous             ghost icon-only Button (nav.chevronLeft)
├─ pages                ghost `tight` Buttons with numbers, the current one in the Button `current` state; «…» for skipped ranges (aria-hidden)
├─ summary              «3 / 12» in the compact view (below 22rem, or `compact`)
└─ next                 ghost icon-only Button (nav.chevronRight)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Pagination
`ref` → `HTMLElement`. A `<nav>` named by `labels.nav` with `Button`s: ghost previous and next, ghost page numbers with ellipses, the current page in the Button `current` state.

| Prop | Type | Default | Description |
|---|---|---|---|
| `totalPages` | `number` | — (required) | Number of pages. Below `1` nothing is rendered. |
| `value` | `number` | — | Current page (1-based), controlled; clamped to `1…totalPages`. |
| `defaultValue` | `number` | `1` | Initial page, uncontrolled. |
| `onValueChange` | `(page: number) => void` | — | Called when a page button or an arrow picks another page. |
| `siblingCount` | `number` | `1` | Pages on each side of the current one before an ellipsis (when `totalPages > 2·siblingCount+5`). |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Control tier of the buttons: height 28 · 32 · 36 · 40 · 48. Without it the tier of its host, else `m`. |
| `compact` | `boolean` | `false` | Always arrows + «current / total» instead of numbers. Without it the nav fills its parent and shows that view only below 22rem of its width. |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Where the page numbers sit in the width the nav fills: centred under a list, `end` beside a range line (the DataTable footer). The compact view keeps its arrows at the edges. |
| `labels` | `Partial<PaginationLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "defaultValue" \| "onChange">` | — | `className`, `data-*` and the other `<nav>` attributes; `aria-label` comes from `labels.nav`. |

## Variants

### compact
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` | fills the parent: arrows around page numbers placed by `align`, «…» for skipped ranges; below 22rem of its width the compact view with arrows at the edges | list and table footers, anywhere the width varies | yes |
| `true` | arrows around «3 / 12» (current in primary medium, total muted, tabular figures) at any width | tight toolbars, a pager that must never show numbers | |

### align
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `center` | the numbers centred in the width the nav fills | a pager under a list or a grid of cards | yes |
| `start` | the numbers at the start | a pager under left-aligned content | |
| `end` | the numbers at the end | beside a range line in a footer (the DataTable footer passes it) | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28 px buttons, 12/16 text, no gap | dense tables | |
| `s` | 32 px, 13/20, gap 4 | list footers next to an `s` Select | |
| `m` | 36 px, 14/20, gap 4 | most places | yes |
| `l` | 40 px, 16/24, gap 4 | large layouts | |
| `xl` | 48 px, 16/24, gap 8 | touch-first screens | |

### siblingCount
| Value | Looks like | Use when | Default |
|---|---|---|---|
| any, `totalPages ≤ 2 × siblingCount + 5` (7 by default) | every page number, no ellipsis | short lists | |
| `1` | 1 … 19 20 21 … 40 | most lists | yes |
| `2` | 1 … 18 19 20 21 22 … 40 | wide footers, frequent jumps | |

## States
| State | Driven by | DOM |
|---|---|---|
| current page | `value` / `defaultValue` | the Button `current` state: `aria-current="page"`, `data-current`, the selected fill |
| hover / active | pointer | `fill-subtle` / `fill-subtle-active`, primary text, press scale |
| focus-visible | keyboard | outer focus ring of the Button |
| disabled arrow | first / last page | native `disabled`, `text-disabled` |
| size / compact / align | `size` (else the host tier), `compact`, `align` | `data-size`, `data-compact` (`"auto"` · `"compact"`), `data-align` |

## Layout & spacing
- In a list footer: the range text on the left, rows-per-page Select and Pagination on the right (`justify-content: space-between`), the row wraps.
- By default the nav fills its parent and is a size container: it needs a parent with a width.
- Page numbers use the Button `tight` density: tabular figures, a square footprint up to two digits; wider numbers grow the button.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves between the arrows and the page numbers. |
| `Enter` · `Space` | Opens the focused page. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- A `<nav>` landmark named by `labels.nav`.
- The current page has `aria-current="page"`; every page button is named by `labels.page` («Страница 3»).
- The edge arrows are `disabled`; the ellipsis is `aria-hidden`.
- The compact view reads «3 из 12» through the visually hidden `labels.of`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `nav` | `"Навигация по страницам"` | `aria-label` of the `<nav>`. |
| `previous` | `"Предыдущая страница"` | Name of the previous-page arrow. |
| `next` | `"Следующая страница"` | Name of the next-page arrow. |
| `page` | `"Страница {page}"` | Name of a page button; `{page}` is replaced. |
| `of` | `"из"` | Hidden word between the current and the total page in the compact view. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Pages of an order list: arrows, page numbers and the current page — `totalPages`, `defaultValue`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier; buttons are as high as Button and Input of the same tier, 28 to 48 px — `size`. |
| [overflow.tsx](examples/overflow.tsx) | Up to 7 pages without an ellipsis, then a window around the current page; a wider window — `siblingCount`. |
| [controlled.tsx](examples/controlled.tsx) | A list footer owns the page: changing rows per page returns it to page 1, the pages at the end beside the range — `value`, `onValueChange`, `align`. |
| [narrow.tsx](examples/narrow.tsx) | A 320 px card footer: by default the numbers give way to «current / total» on a narrow width, `compact` always shows it — `compact`. |

## Mistakes
- `page` / `onPageChange` → use `value` / `onValueChange`.
- A 0-based page index → pages start at `1`.
- Passing `aria-label` to rename the landmark → use `labels={{ nav: "…" }}`.
- Pagination inside a shrink-wrapped flex item → give the parent a width; it measures its own container.
- A pager under a DataTable → the table renders its own.

## Related
- **Built from:** [Button](../button/COMPONENT.md), Icon (`nav.chevronLeft`, `nav.chevronRight`), [VisuallyHidden](../visually-hidden/COMPONENT.md)
- **See also:** [DataTable](../data-table/COMPONENT.md), [Select](../select/COMPONENT.md), [Stepper](../stepper/COMPONENT.md)
