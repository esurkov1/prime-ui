# Pagination

**Default `size`:** use **`m`** for the size axis unless the toolbar or table footer explicitly needs another tier.

## Canonical

- **`Pagination`** is a single compound export: **`Pagination.Root`** only (`Pagination = { Root }`).
- **Controlled API:** **`page`**, **`totalPages`**, and **`onPageChange`** are all required; there is no uncontrolled mode.
- **Semantics:** root is a **`nav`** with **`aria-label="Pagination"`**, **`data-size`**, previous/next **ghost** **`Button.Root`** cells with **`Button.Icon`**, numeric page **`Button.Root`** cells (current page **`primary`** **`filled`**), and ellipsis **`span`**s (**`aria-hidden`**).
- **Range logic:** if **`totalPages ≤ 7`**, every page index is shown; otherwise the row is shortened with **`siblingCount`** (default **`1`**) and **`…`** segments while keeping first and last pages visible.
- **Edge cases:** **`totalPages < 1`** renders **`null`**; **`page`** is clamped to **`1 … totalPages`** for display and clicks; previous/next are **`disabled`** on the first/last page.
- **Copy:** arrow and **“Page N”** strings are fixed in the implementation (English); there are no i18n props on **`Pagination`**.

## Extended

### About

Chunked navigation for lists and tables: chevron previous/next, numbered pages, and ellipses for long ranges.

- **Use** when the dataset is split into discrete pages and **`totalPages`** is known (server-driven or client-side paging).
- **Use** in table footers, list toolbars, or search result bars alongside a short range summary.
- **Do not use** as the only paging affordance when the product is infinite-scroll-only with no page index.
- **Do not use** when **`totalPages < 1`** and you still need chrome—**`Pagination.Root`** returns nothing; show an empty state or omit the bar in the parent.
- **Do not use** when you must replace inner markup or strings; structure and **Button** wiring are fixed—fork or wrap at app level if you need deep customization.

### Composition

- **`Pagination.Root`** — the only public part. Renders the **`nav`** row; **`className`** merges onto that **`nav`** only.
- Full-width or “meta left / pager right” layouts are parent responsibility (flex or grid around **`Pagination.Root`**)—there is no **`fullWidth`** prop on **`Pagination`**.

### Scenarios (see `examples/`)

| Scenario | Approach |
|----------|----------|
| Table footer | Pair a range summary with **`Pagination.Root`** in a footer row; keep **`page`** in sync with fetched rows. → [`examples/table-footer.tsx`](examples/table-footer.tsx) |
| Compact toolbar | Set **`size="s"`** for denser toolbars or mobile-adjacent rows. → [`examples/compact.tsx`](examples/compact.tsx) |
| Full-width list bar | **`display: flex`**, **`justify-content: space-between`**, **`flex-wrap`**: meta text + pager. → [`examples/full-width-list.tsx`](examples/full-width-list.tsx) |
| Controlled page index | Store **`page`** in React state (or router); update from **`onPageChange`** and any other controls (e.g. jump to first/last). → [`examples/controlled-page.tsx`](examples/controlled-page.tsx) |
| Canonical wiring | Minimal **`Pagination.Root`** with required props; reference for imports and props. → [`examples/canonical-composition.tsx`](examples/canonical-composition.tsx) |

### Minimal example

```tsx
import { Pagination } from "prime-ui-kit";

export function Example() {
  return (
    <Pagination.Root page={1} totalPages={5} onPageChange={() => {}} />
  );
}
```

### Canonical composition (reference)

For **default wiring**, **long ranges**, and **`siblingCount`**, open **`examples/canonical-composition.tsx`** next to this file. Imports use **`"prime-ui-kit"`** so snippets work in an app after installing the package.

### Example files in `examples/`

| File | Scenario |
|------|----------|
| `canonical-composition.tsx` | Required props, default size, long range + `siblingCount` |
| `table-footer.tsx` | English table footer: row range + pager |
| `compact.tsx` | English compact row: `size="s"` |
| `full-width-list.tsx` | English full-width bar: summary + pager |
| `controlled-page.tsx` | English controlled state + jump buttons |

### Rules

- **Controlled only:** **`page`**, **`totalPages`**, and **`onPageChange`** are required.
- **`page`** is clamped internally to **`1 … totalPages`** before rendering and when handling clicks.
- If **`totalPages < 1`**, the component returns **`null`**.
- The active page button sets **`aria-current="page"`**; other page buttons use **`aria-label`** of the form **`Page {n}`**; arrows use **“Previous page”** / **“Next page”**.
- Syncing **`page`** to the URL, router, or query params is the parent’s responsibility.

## API

### Pagination.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| page | `number` | — | Yes | Current page; clamped to `1 … totalPages` for display and navigation |
| totalPages | `number` | — | Yes | Page count; if `< 1`, renders nothing |
| onPageChange | `(page: number) => void` | — | Yes | Called when the user selects a page or an arrow |
| siblingCount | `number` | `1` | No | How many page indices to show on each side of the current page when `totalPages > 7` |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Control and ellipsis scale (`--prime-sys-size-control-*`) |
| className | `string` | — | No | Extra class on the root `nav` |

## Related

- [Button](../button/COMPONENT.md) — page and arrow cells are **`Button.Root`** + **`Button.Icon`**.
- [DataTable](../data-table/COMPONENT.md) — typical host for a footer pager.

## LLM note

- **Imports:** **`import { Pagination } from "prime-ui-kit"`** — use **`Pagination.Root`** only; there is no flat **`Pagination`** element.
- **Props:** **`page`**, **`totalPages`**, **`onPageChange`** required; optional **`siblingCount`**, **`size`**, **`className`**.
- **`size`** literals: **`s`**, **`m`**, **`l`**, **`xl`** — default **`m`**; maps to **`data-size`** on the root **`nav`**.
- **`totalPages < 1`:** render is **`null`** — parent must handle empty data or hide the footer.
- **No uncontrolled mode** — always pass **`page`** and **`onPageChange`**; lift state to the parent or router.
- **Layout:** no **`fullWidth`** on **`Pagination`**; wrap in flex/grid and align in the parent.
- **Strings:** labels are English and built-in; do not assume i18n props exist on **`Pagination`**.
