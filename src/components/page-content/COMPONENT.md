# PageContent

## About

Semantic **page column** primitives: **`PageContent.Section`** (a **`<section>`** page region without its own outer padding), **`PageContent.Root`** (full padded column with optional **`maxWidth`**), **`PageContent.Title`** → **`<h1>`**, **`PageContent.Description`** with **`measure`**, and **`PageContent.Body`**. Typography uses kit tokens.

- **Use `PageContent.Section`** when a parent already applies outer padding (e.g. an inset wrapper inside **`AppShell.Main`**, or the same pattern as playground routes) — without wrapping in **`Root`**.
- **Use `PageContent.Root`** when you need that outer padding and optional **`maxWidth`** (`full` | `readable` | `wide`; default **`full`**).
- **Use `Description` `measure="full"`** when the parent column is already inset; default **`measure="readable"`** keeps the lead ~65ch for reading.

## Composition

- **`PageContent.Root`** — outer wrapper: padding + optional max-width (`data-max-width`).
- **`PageContent.Section`** — **`<section>`** without extra outer padding; pair with **`aria-labelledby`** pointing at **`PageContent.Title`** `id`.
- **`PageContent.Header`** — stacks title + description with spacing.
- **`PageContent.Title`** — **`<h1>`** (one per route).
- **`PageContent.Description`** — **`<p>`** lead; **`measure`** controls max width.
- **`PageContent.Body`** — main blocks below the header (demos, forms, tables).

### Canonical example (inside an inset content column)

```tsx
import { PageContent } from "prime-ui-kit";

export function DocRouteBody() {
  return (
    <PageContent.Section aria-labelledby="page-heading">
      <PageContent.Header>
        <PageContent.Title id="page-heading">Settings</PageContent.Title>
        <PageContent.Description measure="full">
          Manage your workspace profile and notifications.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>{/* page blocks */}</PageContent.Body>
    </PageContent.Section>
  );
}
```

### Canonical example (standalone column)

```tsx
import { PageContent } from "prime-ui-kit";

export function StandalonePage() {
  return (
    <PageContent.Root maxWidth="readable">
      <PageContent.Header>
        <PageContent.Title>Account</PageContent.Title>
        <PageContent.Description>Billing and security.</PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>{/* … */}</PageContent.Body>
    </PageContent.Root>
  );
}
```

### Playground

Live demo and API tables: **`playground/sections/PageContentSection.tsx`** — **`Section`** → **`Header`** (**`Title`**, **`Description measure="full"`**) → **`Body`**. There is no **`playground/snippets/page-content/`** tree; the section is the single demo surface.

## Rules

- Prefer **one** `h1` per view — **`PageContent.Title`**.
- Do not nest **`PageContent.Root`** inside a region that already applies the same outer padding unless you intentionally want double padding; use **`Section`** instead.
- **`Description`** defaults to a readable measure; use **`measure="full"`** when the layout already constrains width.

## API

### PageContent.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| maxWidth | `full` \| `readable` \| `wide` | `full` | No | Limits the content column; drives `data-max-width` when not `full`. |
| className | `string` | — | No | Class on the root wrapper. |
| children | `React.ReactNode` | — | No | Header, body, nested sections. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Native `div` attributes, including `ref` (`forwardRef`). |

### PageContent.Section

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Class on **`<section>`** (page region without outer padding—use when an inset wrapper or **`PageContent.Root`** already provides margins). |
| children | `React.ReactNode` | — | No | Usually **`Header`** + **`Body`** (playground routes follow this). |
| …rest | `React.HTMLAttributes<HTMLElement>` | — | No | Native **`<section>`** attributes, including `ref` (`forwardRef`). |

### PageContent.Header

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Class on the header block (title + description). |
| children | `React.ReactNode` | — | No | Usually **`PageContent.Title`** and **`PageContent.Description`** (`measure` as needed). |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Native `div` attributes. |

### PageContent.Title

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Class on **`<h1>`**. |
| children | `React.ReactNode` | — | No | Page heading. |
| …rest | `React.HTMLAttributes<HTMLHeadingElement>` | — | No | Native **`h1`** attributes, including `ref` (`forwardRef`). |

### PageContent.Description

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| measure | `readable` \| `full` | `readable` | No | `readable` — ~65ch; `full` — parent width (e.g. when the content column is already inset). |
| className | `string` | — | No | Class on the lead **`<p>`**. |
| children | `React.ReactNode` | — | No | Intro text under the title. |
| …rest | `React.HTMLAttributes<HTMLParagraphElement>` | — | No | Native **`p`** attributes, including `ref` (`forwardRef`). |

### PageContent.Body

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Class on the main content wrapper below the header. |
| children | `React.ReactNode` | — | No | Page content under the header. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Native `div` attributes. |

## Related

- [Typography](../typography/COMPONENT.md) — inline roles elsewhere on the page.
- [AppShell](../../layout/app-shell/AppShell.tsx) — grid shell (`nav` + **`main`**); page padding is app-level (e.g. **`PageContent.Root`** or a wrapper inside **`main`**).
