# Breadcrumb

**Category:** navigation (Навигация)

> Breadcrumbs: the path to the current page.

## When to use
- Detail and nested pages, above the page title, to show where the page sits and to jump up a level.
- Deep hierarchies (catalogs, documentation) — the trail truncates and collapses instead of wrapping.

## When not to use
- Switching sections of the same screen → use [Tabs](../tabs/COMPONENT.md).
- Progress through a sequential process → use [Stepper](../stepper/COMPONENT.md).
- Primary app navigation → use [Sidebar](../../layout/sidebar/COMPONENT.md).
- A single "back" or standalone link → use [LinkButton](../link-button/COMPONENT.md).

## Import
```tsx
import { Breadcrumb } from "prime-ui-kit";
```

## Anatomy
- `Breadcrumb.Root` — `<nav aria-label>` with an `<ol>`; sets the size and enables auto-collapse.
  - `Breadcrumb.Item` — `<li>`: a link (`href`, rendered by LinkButton), plain text, or the current page (`current`).
  - `Breadcrumb.Separator` — `<li aria-hidden>` with a chevron (or custom children).
  - `Breadcrumb.Ellipsis` — `<li>` with a manual «…» for skipped levels.

## API
No part forwards a ref.

### Breadcrumb.Root
+ native `<nav>` props (`HTMLAttributes<HTMLElement>`); an `aria-label` passed here overrides `labels.nav`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Text, chevron and icon size of links, current page and ellipsis. |
| `labels` | `Partial<BreadcrumbLabels>` | see Accessibility | Built-in strings. |
| `children` | `ReactNode` | — (required) | Items, separators and ellipsis, in order. |
| `className` | `string` | — | Extra class on the `nav`. |

### Breadcrumb.Item
No native props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | — | Renders a muted link (`LinkButton`). Without `href` the item is text. |
| `current` | `boolean` | — | Current page: `aria-current="page"`, primary text, medium weight. Use on the last item without `href`. |
| `aria-label` | `string` | — | Name of a link without visible text (e.g. a home icon). |
| `children` | `ReactNode` | — | Text or an icon. A string child also becomes the `title` of a text item (full text on hover when truncated). |
| `className` | `string` | — | Extra class on the `li`. |

### Breadcrumb.Separator
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | chevron icon | Custom separator. |
| `className` | `string` | — | Extra class. |

### Breadcrumb.Ellipsis
| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Extra class. |

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 12/16 text, 14 icon, no gap | dense panels | |
| `s` | 13/20 text, 16 icon, gap 4 | page headers above a heading | |
| `m` | 14/20 text, 16 icon, gap 4 | default | yes |
| `l` | 16/24 text, 20 icon, gap 8 | large page headers | |
| `xl` | 18/24 text (title-l), 20 icon, gap 8 | hero headers | |

### Item kind
| Value | Looks like | Use when | Default |
|---|---|---|---|
| link (`href`) | muted text, medium weight; primary text on hover and focus, no underline | every ancestor level | |
| text (no `href`, no `current`) | muted text | a level without its own page | yes |
| current (`current`) | primary text, medium weight | the last item — this page | |
| icon link (`href` + `aria-label`, icon child) | icon at the tier icon size | a "home" root | |

**Combinations**
- Recommended: links for every ancestor, `current` on the last item, `Separator` between each pair; `s` above a `heading-m` page title.
- Avoid: `href` on the current item; separators at the start or the end; two `current` items.

## States
| State | Driven by | DOM |
|---|---|---|
| current | `current` | `aria-current="page"` on the text span |
| hover / focus-visible on links | pointer / keyboard | text → primary; focus ring from LinkButton |
| truncation | width | each segment truncates with an ellipsis, max width `2 × --prime-space-24`; the current item shrinks last |
| auto-collapse | 5+ children (item, separator, item, separator, item) and container `< 30rem` | `data-collapsible="true"`; middle items are visually hidden (still announced) and replaced by «… ›» |

Root attributes: `data-size`, `data-collapsible` (`"true"` / `"false"`).

## Layout & spacing
- The root is a size container (`container-type: inline-size`, `inline-size: 100%`): inside a flex row give it `flex: 1 1 auto; min-width: 0`.
- Above a page title: `gap: var(--prime-space-2)` between the trail and the title row.
- The list never wraps.

## Accessibility
- `nav` landmark with `aria-label` from `labels.nav`; an ordered list; separators and the auto «…» are `aria-hidden`.
- `Breadcrumb.Ellipsis` has visually hidden text `labels.ellipsis`.
- Icon-only links need `aria-label` on the Item.

| `labels` key | Default | Used for |
|---|---|---|
| `nav` | `"Навигационная цепочка"` | `aria-label` of the `nav` |
| `ellipsis` | `"Скрытые разделы"` | hidden text of `Breadcrumb.Ellipsis` |

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [page-header.tsx](examples/page-header.tsx) | `s` trail with a home icon above the title and actions | detail page headers |
| [sizes.tsx](examples/sizes.tsx) | Five size tiers | matching the header size |
| [collapse.tsx](examples/collapse.tsx) | Truncation, auto-collapse at 320px, manual `Breadcrumb.Ellipsis` | deep hierarchies, narrow screens |

```tsx
import { Breadcrumb } from "prime-ui-kit";

export function OrderTrail() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="/orders">Заказы</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item current>№ 48 213</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
```

## Mistakes
- Items without `Breadcrumb.Separator` between them → add a separator between every pair.
- `<Breadcrumb.Item href="…" current>` → the current page has no `href`.
- Breadcrumb inside a flex row collapsing to zero width → give it `flex: 1 1 auto; min-width: 0`.
- Home icon link without `aria-label` → add `aria-label="Главная"`.

## Related
- [LinkButton](../link-button/COMPONENT.md)
- [Tabs](../tabs/COMPONENT.md)
- [PageContent](../page-content/COMPONENT.md)
