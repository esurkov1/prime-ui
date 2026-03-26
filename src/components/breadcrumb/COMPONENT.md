# Breadcrumb

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## Canonical

**What it is:** A `nav` with an ordered list (`ol`) of trail segments. **`Breadcrumb.Item`** with **`href`** uses **`LinkButton`**; without **`href`** it is plain text. **`Breadcrumb.Separator`** defaults to a subtle chevron icon; **`Breadcrumb.Ellipsis`** renders a static middle collapse marker (`…`). **`Breadcrumb.Root`** sets **`size`** (`s` | `m` | `l` | `xl`) for links, current text, ellipsis, and the default separator icon via context and **`ControlSizeProvider`**.

**When to use**

- Hierarchical URLs (docs, catalog, admin) where jumping to a parent beats reopening the main nav.
- Deep screens (orders, settings leaf pages) to answer “where am I”.
- Long trails where you manually keep root, near parent, and leaf and insert **`Ellipsis`** for skipped middle levels.

**When not to use**

- Primary IA — sidebars and top nav own top-level structure; breadcrumbs are supplemental.
- Flat or two-level apps — a title or back control may be enough.
- Need to pick hidden levels — **`Ellipsis`** is not interactive; use a dropdown or popover separately.
- As the only page heading — keep a real **`h1`** (or [Typography](../typography/COMPONENT.md)); breadcrumbs do not replace it.

**Minimal pattern**

```tsx
import { Breadcrumb } from "prime-ui-kit";

export function Example() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item current>Current page</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
```

**Non‑negotiables**

- **Current page:** omit **`href`** on the active segment and set **`current`**. With **`href`**, the segment is always a link and does **not** get **`aria-current="page"`**.
- **List semantics:** only **`Item`**, **`Separator`**, and **`Ellipsis`** as **direct** children of **`Root`** (each renders an **`li`**). Do not inject arbitrary wrappers inside the list.
- **No routing API:** URLs and navigation are app-owned; there is no `asChild`, no controlled “value”, and **no built‑in auto-collapse** — you place **`Ellipsis`** where you want it.

**Runnable examples (package import)**

| Scenario | File |
|----------|------|
| Minimal trail | [`examples/canonical.tsx`](./examples/canonical.tsx) |
| Deep docs path | [`examples/deep-documentation.tsx`](./examples/deep-documentation.tsx) |
| E‑commerce PDP | [`examples/ecommerce-product.tsx`](./examples/ecommerce-product.tsx) |
| SaaS settings hierarchy | [`examples/saas-settings.tsx`](./examples/saas-settings.tsx) |
| Long path + ellipsis | [`examples/long-path-ellipsis.tsx`](./examples/long-path-ellipsis.tsx) |

Playground demos (app alias `@/…`): `playground/snippets/breadcrumb/` — sizes, states, composition (icon home + custom separator), narrow container, long ellipsis.

---

## Extended

### Composition

- **`Breadcrumb.Root`** — `nav` with default **`aria-label="Breadcrumb"`**; spread **`…rest`** for overrides (e.g. localized label). Inner structure is a single **`ol`**.
- **Typical sequence:** `[Item] [Separator] [Item] [Separator] … [Item]`; for a collapsed middle, use **`[Item] [Separator] … [Ellipsis] [Separator] … [Item]`** as in [`long-path-ellipsis.tsx`](./examples/long-path-ellipsis.tsx).
- **`Separator`** — **`aria-hidden="true"`**; override **`children`** for `/`, `>`, or other glyphs.
- **Icon-only first item** — set **`aria-label`** on **`Item`** when **`href`** is set and there is no visible text.

### Scenarios (extended)

1. **Deep documentation path** — mirror the doc tree so each segment links to its index page; last segment is current text ([`deep-documentation.tsx`](./examples/deep-documentation.tsx)).
2. **E‑commerce** — storefront → category → subcategory → … → SKU name; every ancestor is a link, PDP title is **`current`** ([`ecommerce-product.tsx`](./examples/ecommerce-product.tsx)).
3. **SaaS settings hierarchy** — org → settings area → section → leaf (e.g. invoices); matches how admins mental-model nested admin URLs ([`saas-settings.tsx`](./examples/saas-settings.tsx)).
4. **Long trail + ellipsis** — show first levels and the tail; **`Ellipsis`** stands in for omitted middle **only visually** — screen readers still read the visible segments in order ([`long-path-ellipsis.tsx`](./examples/long-path-ellipsis.tsx)). On very narrow viewports the row may **wrap** (flex wrap in styles); do not rely on breadcrumbs alone for mobile orientation if the path is long.

### Rules

- **`Item` props are not an escape hatch** — only **`href`**, **`current`**, **`children`**, **`className`**, and **`aria-label`**; extra **`li`** attributes are not forwarded.
- **No disabled, loading, or error props** on **`Item`**.
- **Separators** are decorative; meaning lives in **`Item`** labels and route targets.

### API

#### Breadcrumb.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | `Item`, `Separator`, and `Ellipsis` as direct children of the inner `ol` |
| className | `string` | — | no | Extra class on the `nav` |
| size | `BreadcrumbSize` | `"m"` | no | Scale for links, current text, ellipsis, default separator icon (`"s"` \| `"m"` \| `"l"` \| `"xl"`) |
| …rest | `React.HTMLAttributes<HTMLElement>` | — | no | Additional attributes on the `nav` |

#### Breadcrumb.Item

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| href | `string` | — | no | If set, renders `LinkButton`; otherwise renders a `span` |
| current | `boolean` | — | no | Current-page styling and `aria-current="page"` on the `span` when there is no `href` |
| children | `React.ReactNode` | — | no | Label or custom content (e.g. icon) |
| className | `string` | — | no | Class on the `li` |
| aria-label | `string` | — | no | For link items without visible text (e.g. icon-only home) |

#### Breadcrumb.Separator

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | `Icon` `nav.chevronRight` (`tone="subtle"`) | no | Custom separator content |
| className | `string` | — | no | Class on the `li` |

#### Breadcrumb.Ellipsis

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | no | Class on the `li` that displays the ellipsis character |

### Related

- [LinkButton](../link-button/COMPONENT.md) — used inside `Item` when `href` is set.
- [Typography](../typography/COMPONENT.md) — page titles and captions beside the trail.

---

## Note for LLM and codegen

- Import **`Breadcrumb`** from **`prime-ui-kit`**; compose **`Root` → `Item` / `Separator` / `Ellipsis`** only — no hidden slots or `asChild`.
- Mark the active route with **`current`** and **no `href`** on that **`Item`**; otherwise **`aria-current="page"`** will not apply.
- Collapsing the path is **manual**: insert **`Breadcrumb.Ellipsis`** between **`Separator`** nodes; it is **not** a menu and does not expose hidden links to assistive tech.
- Icon-only links require **`aria-label`** on **`Item`**.
- For copy-paste recipes, prefer the five files under **`src/components/breadcrumb/examples/`**; for interactive kit demos see **`playground/snippets/breadcrumb/`**.
