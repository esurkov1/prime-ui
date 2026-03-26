# Breadcrumb

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A composite breadcrumb component: a `nav` with an `ol` list, link or plain-text items for the current page, optional separators, and an ellipsis for long paths.

## What it’s for

- **Storefront and catalog** — show the path “home → category → subcategory → product” and jump up a level quickly.
- **Account and operational screens** — orient users in flows like “orders → order detail” without hunting through the menu.
- **Knowledge base and docs** — long section trees with the middle of the path collapsed behind an ellipsis.

## Use cases

Each example stands on its own; scenarios do not repeat the same task.

### Basic

Typical chain: all parents are clickable, the last item is the current page.

```tsx
import { Breadcrumb } from "prime-ui-kit";

export function OrderBreadcrumb() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/orders">Orders</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item current>Order #1042</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
```

### Sizes

Same navigation pattern in a compact report header: the whole block scales via `size`.

```tsx
import { Breadcrumb } from "prime-ui-kit";

export function ReportHeaderBreadcrumb() {
  return (
    <Breadcrumb.Root size="s">
      <Breadcrumb.Item href="/analytics">Analytics</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/analytics/2025">2025</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item current>Q1</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
```

### In a narrow column

Learning portal: middle level has no link (module title only), lesson is the current page. In a narrow column items wrap thanks to `flex-wrap` on the list.

```tsx
import { Breadcrumb } from "prime-ui-kit";

export function CourseLessonBreadcrumb() {
  return (
    <div style={{ maxWidth: 240 }}>
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/courses">Courses</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>Module 3</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item current>Introduction</Breadcrumb.Item>
      </Breadcrumb.Root>
    </div>
  );
}
```

### Home icon and custom separator

Support center: first hop is icon-only (needs `aria-label`), levels separated by a slash instead of a chevron via `children` on `Separator`. The `itemHome` class aligns the icon in the breadcrumb style module (in the kit repo — `@/components/breadcrumb/Breadcrumb.module.css`; use an equivalent class in your app).

```tsx
import { Breadcrumb, Icon } from "prime-ui-kit";
import styles from "@/components/breadcrumb/Breadcrumb.module.css";

export function HelpBreadcrumb() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="/help" className={styles.itemHome} aria-label="Help">
        <Icon name="nav.home" tone="default" />
      </Breadcrumb.Item>
      <Breadcrumb.Separator>/</Breadcrumb.Separator>
      <Breadcrumb.Item href="/help/billing">Billing</Breadcrumb.Item>
      <Breadcrumb.Separator>/</Breadcrumb.Separator>
      <Breadcrumb.Item current>Refunds</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
```

### Long path and Ellipsis

Deep catalog structure: the middle of the path is collapsed into `Ellipsis`; root, nearest parent, and leaf stay visible.

```tsx
import { Breadcrumb } from "prime-ui-kit";

export function DeepCatalogBreadcrumb() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/catalog">Catalog</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Ellipsis />
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/catalog/furniture/chairs/office">Office chairs</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item current>Model X</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
```

## Anatomy

`Breadcrumb.Root` (`nav` → `ol`) may contain, in any order:

- `Breadcrumb.Item` — `li` with `LinkButton` (if `href` is set) or `span` (otherwise; with `current` — current-page styling and `aria-current="page"`).
- `Breadcrumb.Separator` — `li` with `aria-hidden`, between items; default is a chevron icon.
- `Breadcrumb.Ellipsis` — `li` with an ellipsis character.

`Root` provides size context (`BreadcrumbSizeContext` and `ControlSizeProvider`) for links and icons.

## API

### Breadcrumb.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | `Item`, `Separator`, and `Ellipsis` nodes inside the list |
| className | `string` | — | no | Extra class on `nav` |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | no | Type scale for links, current page, and ellipsis; separator and home icon size |
| …rest | `React.HTMLAttributes<HTMLElement>` | — | no | Other `nav` attributes (e.g. your own `aria-label` instead of the default) |

### Breadcrumb.Item

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| href | `string` | — | no | If set — link; otherwise plain `span` |
| current | `boolean` | — | no | Current page: styling and `aria-current="page"` |
| children | `React.ReactNode` | — | no | Label or icon |
| className | `string` | — | no | Class on `li` (e.g. `itemHome` from breadcrumb module styles for the home icon) |
| aria-label | `string` | — | no | Required for links without visible text (icon-only) |

### Breadcrumb.Separator

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | `nav.chevronRight` icon | no | Custom separator between items |
| className | `string` | — | no | Class on `li` |

### Breadcrumb.Ellipsis

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | no | Class on `li` with the “…” character |

## Variants

There is no separate `variant` prop. Visual hierarchy comes from:

- `size` on the root (`s` … `xl`);
- muted link color and stronger contrast for the current page (module styles);
- custom `children` on `Separator` (chevron, slash, text).

## States

- **Link** — `Item` with `href`: interactive `LinkButton`, hover/focus from the link button.
- **Current page** — `Item` with `current` and no `href`: `span` with `aria-current="page"` and the current-item class.
- **Inactive segment** — `Item` without `href` and without `current`: plain `span` (e.g. section title with no URL).

Breadcrumbs expose no explicit `disabled`, `loading`, or `error` props.

## Accessibility (a11y)

- Root is `nav` with default `aria-label="Breadcrumb"`; override with root attributes if needed.
- Path is an ordered `ol` / `li` list.
- Current position is marked with `aria-current="page"` on the matching item.
- Separators are hidden from the accessibility tree (`aria-hidden`).
- For icon-only links, set a meaningful `aria-label` on `Item`.

## Limitations and notes

- No `asChild` mode and no built-in “controlled” state — this is presentational path markup; data and navigation are app-owned.
- `Ellipsis` does not expand or open a menu: it is a static marker; a full collapsed path with a dropdown must be composed separately.
- Extra attributes on `Item` (beyond those in the API) are not forwarded — extend only by changing the source or wrapping.

## Related components

- **LinkButton** — inside `Item` with `href` for kit-styled links.
- **Icon** — default chevron in `Separator` and icon-only first item.
- **Typography** — when you need a page title or section caption next to breadcrumbs.
