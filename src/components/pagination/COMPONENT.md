# Pagination

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

Single-component navigation for paged lists: “previous” and “next” arrows, clickable page numbers, and a shortened row with an ellipsis when there are many pages.

## When to use it

- **Catalog and search** — product listings or query results when data arrives in chunks from the server.
- **Event log and audit** — operation tables in admin: flip pages without scrolling thousands of rows.
- **Media library** — preview grids or file lists split into fixed-size pages.
- **Publishing and learning** — multi-page article or lesson where a “page” is a logical chunk of content.
- **Internal tools** — browsing API responses or logs with pagination in a wide bar under the table.
- **Compact mobile** — bottom or top bar with a smaller `size` when space is tight but there are many pages.

## Use cases

Examples from different product areas; each screen has its own meaning and prop set.

### Basic

Storefront: the user pages through results; page state lives in React.

```tsx
import * as React from "react";
import { Pagination } from "prime-ui-kit";

export function CatalogPagination() {
  const [page, setPage] = React.useState(1);
  const totalPages = 48;

  return (
    <Pagination.Root page={page} totalPages={totalPages} onPageChange={setPage} />
  );
}
```

### Variants / sizes

Moderation panel on desktop: larger hit area and number text via `size`, with the same controlled paging.

```tsx
import * as React from "react";
import { Pagination } from "prime-ui-kit";

export function ModerationQueuePagination() {
  const [page, setPage] = React.useState(1);

  return (
    <Pagination.Root
      page={page}
      totalPages={32}
      onPageChange={setPage}
      size="l"
      siblingCount={2}
    />
  );
}
```

### In context (list bar)

Orders table footer: summary “showing N–M” on the left, full-width pagination on the toolbar row to the right.

```tsx
import * as React from "react";
import { Pagination } from "prime-ui-kit";

export function OrdersFooterBar() {
  const [page, setPage] = React.useState(2);
  const pageSize = 25;
  const totalItems = 412;
  const totalPages = Math.ceil(totalItems / pageSize);
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontSize: 14, opacity: 0.8 }}>
        Showing {from}–{to} of {totalItems}
      </span>
      <Pagination.Root page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
```

### Controlled mode

Page is synced with the request: changing the number refetches data; when the response is empty (`totalPages === 0`), the nav block is not shown.

```tsx
import * as React from "react";
import { Pagination } from "prime-ui-kit";

type PageResult = { items: unknown[]; totalPages: number };

export function InvoicesPagination() {
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<PageResult | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await fetch(`/api/invoices?page=${page}`);
      const json = (await res.json()) as PageResult;
      if (!cancelled) setData(json);
    })();
    return () => {
      cancelled = true;
    };
  }, [page]);

  if (!data || data.totalPages < 1) {
    return null;
  }

  return (
    <Pagination.Root page={page} totalPages={data.totalPages} onPageChange={setPage} />
  );
}
```

## Anatomy

Flat API: a `Pagination` object is exported with a single subcomponent, `Root`.

- **`Pagination.Root`** — a `nav` element with `aria-label="Pagination"`. Inside: two arrow buttons (`Button.Root` with icons) and a series of number buttons or non-interactive cells with an ellipsis (`span`, `aria-hidden`).

## API

### Pagination.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `page` | `number` | — | Yes | Current page; clamped to `1 … totalPages` when computed. |
| `totalPages` | `number` | — | Yes | Number of pages. If `< 1`, the component returns `null`. |
| `onPageChange` | `(page: number) => void` | — | Yes | Handler for page changes (number or arrow). |
| `siblingCount` | `number` | `1` | No | How many numbers to show left and right of the current page in the shortened row (when `totalPages > 7`). |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Button size and matching ellipsis cell size. |
| `className` | `string` | — | No | Extra class on the root `nav`. |

## Variants

There is no separate `variant` prop. Visual roles are fixed in the markup: the active page is a `Button` with `variant="primary"` and `mode="filled"`; other numbers and arrows use `variant="neutral"`, `mode="ghost"`. User-facing “variant” of scale is only `size`.

## States

- **Current page** — the matching button has `aria-current="page"`.
- **First page** — “previous” button is `disabled`.
- **Last page** — “next” button is `disabled`.
- **Single page** — both arrows are inactive.
- **No pages** — when `totalPages < 1`, nothing is rendered.

## Accessibility (a11y)

- Root is semantic `nav` with label `aria-label="Pagination"`.
- Arrows have `aria-label` “Previous page” / “Next page” (in the kit source they are in English).
- Page numbers use `aria-label` like `Page N`.
- Ellipsis is decorative: `aria-hidden="true"`, not in tab order.

## Limitations and notes

- No uncontrolled mode: `page` and `onPageChange` are always required.
- You cannot swap slot markup or arrow text without forking: structure is fixed.
- Page numbers and arrow labels are not localized via props; for another language use a wrapper or a custom implementation.
- URL sync (`?page=`) is the router or parent’s job, not the component’s.

## Related components

- **DataTable** — tables with built-in data pagination; `Pagination` fits custom lists and simple tables without DataTable.
- **Button** — pagination is built on kit buttons; styles align with the control system.
