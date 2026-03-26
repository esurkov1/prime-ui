# Breadcrumb

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

A composite breadcrumb: a `nav` with an ordered list (`ol`) of segments—links via `LinkButton`, plain text, optional custom separators, and an optional ellipsis for collapsed middle segments. `Root` sets type scale and control size for links, the current segment, the ellipsis, and the default separator icon.

**When to use**

- **Hierarchical paths** — storefront, catalog, or docs where users jump to a parent level without opening the main menu.
- **Deep screens** — account, orders, or admin flows where the trail clarifies “where am I” (e.g. orders → order detail).
- **Long trails** — show root, near parent, and leaf while collapsing the middle with `Ellipsis`.

**When not to use**

- **Primary navigation** — use the main nav or sidebar for top-level IA; breadcrumbs are supplemental.
- **Flat IA** — a single section or two levels rarely needs a trail; a page title or back control may be enough.
- **Interactive “collapsed path”** — `Ellipsis` is static text, not a menu; build a dropdown or popover separately if users must pick hidden levels.
- **Replacing a page title** — breadcrumbs orient; they do not substitute a clear `h1` or heading for the page.

## Composition

- **`Breadcrumb.Root`** renders `nav` (default `aria-label="Breadcrumb"`) and a single **`ol`**. Put **`Breadcrumb.Item`**, **`Breadcrumb.Separator`**, and **`Breadcrumb.Ellipsis`** only as **direct children** of that list (each part renders an `li`).
- **Typical pattern:** `[Item] [Separator] [Item] [Separator] … [Item]`; use **`Ellipsis`** between separators when the path is long. Order is flexible, but stray non-`li` children would break list semantics—stick to these parts.
- **`Item` with `href`** renders a **`LinkButton`**; **`Item` without `href`** renders a **`span`** (use **`current`** on the last segment for current-page styling and `aria-current="page"`).
- **`Separator`** defaults to a chevron **`Icon`** (`nav.chevronRight`, `tone="subtle"`). Override with **`children`** (e.g. `/`) for a custom glyph or text.
- **`Root`** provides breadcrumb **`size`** to nested parts via context and **`ControlSizeProvider`**.

### Minimal example

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

## Rules

- **Current page:** set **`current`** on the segment that represents the active page. **`aria-current="page"`** is applied only on the **non-link** branch (`span`); if **`href`** is set, the item is always a link and does **not** receive **`aria-current`**—for a proper current-page marker, omit **`href`** on that item and use **`current`**.
- **No controlled “value” API** — markup is presentational; URLs and navigation are app-owned. There is no **`asChild`** on these parts.
- **`Item` props are not an escape hatch** — only **`href`**, **`current`**, **`children`**, **`className`**, and **`aria-label`** are supported; extra **`li`** attributes are not forwarded.
- **Icon-only first item** — set a meaningful **`aria-label`** on **`Item`** when **`href`** is set and **`children`** has no visible text.
- **Override root label** — pass your own **`aria-label`** (or other **`nav`** attributes) via **`Root`** **`...rest`** after the documented props; defaults can be overridden per HTML merging rules.
- **Separators** — **`aria-hidden="true"`** on **`Separator`** so assistive tech ignores decorative dividers; keep meaningful order in **`Item`** text instead.
- **List layout** — items use flex with wrap in styles; very narrow layouts may wrap segments; do not rely on breadcrumbs as the only orientation cue on mobile if the path is long.
- **No disabled, loading, or error props** — not part of this API.

## API

### Breadcrumb.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | `Item`, `Separator`, and `Ellipsis` nodes as direct children of the inner `ol` |
| className | `string` | — | no | Extra class on the `nav` |
| size | `BreadcrumbSize` | `"m"` | no | Type scale for links, current text, ellipsis, and default separator icon (`"s"` \| `"m"` \| `"l"` \| `"xl"`) |
| …rest | `React.HTMLAttributes<HTMLElement>` | — | no | Additional attributes on the `nav` (e.g. custom `aria-label`) |

### Breadcrumb.Item

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| href | `string` | — | no | If set, renders `LinkButton`; otherwise renders a `span` |
| current | `boolean` | — | no | Current page styling and `aria-current="page"` on the `span` when there is no `href` |
| children | `React.ReactNode` | — | no | Label or custom content (e.g. icon) |
| className | `string` | — | no | Class on the `li` |
| aria-label | `string` | — | no | For link items without visible text (e.g. icon-only home) |

### Breadcrumb.Separator

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | `Icon` `nav.chevronRight` (`tone="subtle"`) | no | Custom separator content |
| className | `string` | — | no | Class on the `li` |

### Breadcrumb.Ellipsis

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | no | Class on the `li` that displays the ellipsis character |

## Related

- [LinkButton](../link-button/COMPONENT.md) — used inside `Item` when `href` is set.
- [Typography](../typography/COMPONENT.md) — for page titles or captions next to the trail.
