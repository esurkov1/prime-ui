# Pagination

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

Page navigation for chunked lists: previous and next controls with chevron icons, numeric page buttons, and ellipsis cells when there are many pages.

- **Use** for server-driven or client-paged tables, search results, and any UI where the user moves between discrete page indices.
- **Use** when you already know **`totalPages`** and can keep **`page`** in sync (controlled pattern).
- **Do not use** as the only paging affordance when you rely on infinite scroll and never expose page numbers—this component assumes explicit pages.
- **Do not use** when **`totalPages` is less than 1** and you still need a visible empty state; the root returns **`null`** in that case, so render a message or hide the bar in the parent.
- **Do not use** expecting localized arrow or “Page N” strings from props; labels are fixed in the implementation (English).
- **Do not use** if you must replace inner markup (custom arrows, slots); structure and **`Button`** wiring are fixed—extend or fork for deep customization.

## Composition

- **`Pagination`** is a single-part namespace: **`Pagination.Root`** only (exported as **`Pagination = { Root }`**).
- **`Pagination.Root`** renders a **`nav`** with **`aria-label="Pagination"`**, **`data-size`**, and a row of controls: **previous** (ghost neutral **`Button`** with **`Button.Icon`**), a sequence of numeric page **`Button.Root`** cells or ellipsis **`span`**s (**`aria-hidden`**), then **next** (same as previous).
- Page items use **`Button.Root`** with **`size`** from the root; the current page uses **`variant="primary"`** and **`mode="filled"`**; other numbers and arrows use **`variant="neutral"`** and **`mode="ghost"`**.

### Minimal example

```tsx
import { Pagination } from "prime-ui-kit";

export function Example() {
  return (
    <Pagination.Root page={1} totalPages={5} onPageChange={() => {}} />
  );
}
```

## Rules

- **Controlled only:** **`page`**, **`totalPages`**, and **`onPageChange`** are required; there is no uncontrolled mode.
- **`page`** is clamped internally to **`1 … totalPages`** before rendering and when handling clicks.
- If **`totalPages < 1`**, the component returns **`null`** (render nothing).
- With **`totalPages ≤ 7`**, every page number is shown. With more pages, the row is shortened using **`siblingCount`** (default **`1`**) and ellipsis segments (**`…`**).
- **First page:** previous control is **`disabled`**. **Last page:** next is **`disabled`**. **Single page:** both arrows are **`disabled`**.
- The active page button sets **`aria-current="page"`**; other page buttons use **`aria-label={`Page ${n}`}`**; arrows use **“Previous page”** / **“Next page”**.
- **`className`** merges onto the root **`nav`** only.
- Syncing **`page`** to the URL, router, or query params is the responsibility of the parent.

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

- [Button](../button/COMPONENT.md)
- [DataTable](../data-table/COMPONENT.md)
