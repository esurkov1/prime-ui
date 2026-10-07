# Breadcrumb

**Category:** navigation
**Kind:** navigation

> Breadcrumbs: the path to the current page.

## When to use
- Detail and nested pages, above the page title, to show where the page sits and to jump up a level.
- Deep hierarchies (catalogs, documentation) — the trail truncates and collapses instead of wrapping.

## When not to use
- Switching sections of the same screen → use [Tabs](../tabs/COMPONENT.md).
- Progress through a sequential process → use [Stepper](../stepper/COMPONENT.md).
- Primary app navigation → use [Sidebar](../../layout/sidebar/COMPONENT.md).
- A single «back» or standalone link → use [LinkButton](../link-button/COMPONENT.md).

## Import
```tsx
import { Breadcrumb } from "prime-ui-kit";
```

## Anatomy
```
Breadcrumb.Root           <nav aria-label> + <ol>; size; chevrons between levels; auto-collapse
├─ Breadcrumb.Item        <li>: a link (href → LinkButton), text, or the current page (current)
└─ Breadcrumb.Ellipsis    <li> with «…» for levels skipped on purpose
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Breadcrumb.Root
`ref` → `HTMLElement` (the `<nav>`). `<nav aria-label>` with an `<ol>`; draws the chevrons between levels, sets the size and collapses the middle levels on narrow containers.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Text of the links, the current page and the ellipsis; chevrons and icons take the same tier. |
| `labels` | `Partial<BreadcrumbLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | `Breadcrumb.Item`s and `Breadcrumb.Ellipsis`, in order; no separators by hand. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `className` and the other `nav` attributes; an `aria-label` here overrides `labels.nav`. |

### Breadcrumb.Item
No ref. `<li>`: a muted `LinkButton` (`href`), plain text, or the current page (`current`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | — | Renders a link; without it the item is text. |
| `current` | `boolean` | — | Current page: `aria-current="page"`, primary text, medium weight. The last item, without `href`. |
| `aria-label` | `string` | — | Name of a link without visible text (e.g. a home icon). |
| `children` | `ReactNode` | — | Text or an `Icon`. A string also becomes the `title` of a text item (full text when truncated). |
| `className` | `string` | — | Extra class on the `li`. |

### Breadcrumb.Ellipsis
No ref. `<li>` with «…» for levels skipped on purpose, with visually hidden `labels.ellipsis`.

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
| icon link (`href` + `aria-label`, `Icon` child) | icon at the tier icon size | a «home» root | |

Use links for every ancestor and `current` on the last item; `s` above a `heading-m` page title. Avoid `href` on the current item and two `current` items.

## States
| State | Driven by | DOM |
|---|---|---|
| current | `current` | `aria-current="page"` on the text span |
| hover / focus-visible on links | pointer / keyboard | text → primary; focus ring from LinkButton |
| truncation | width | each level truncates with an ellipsis, max width `2 × --prime-space-24`; the current item shrinks last |
| auto-collapse | 3+ levels and a container `< 30rem` | `data-collapsible="true"`; middle levels are visually hidden (still announced) and replaced by «… ›» |

Root attributes: `data-size`, `data-collapsible` (`"true"` / `"false"`).

## Layout & spacing
- The root is a size container (`container-type: inline-size`, `inline-size: 100%`): inside a flex row give it `flex: 1 1 auto; min-width: 0`.
- Above a page title: `gap: var(--prime-space-2)` between the trail and the title row.
- The list never wraps.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves focus between the level links; the current page is not focusable. |
| `Enter` | Follows the link. |

### ARIA
- `nav` landmark with `aria-label` from `labels.nav`; an ordered list.
- The current page has `aria-current="page"`; chevrons and the automatic «…» are `aria-hidden`.
- Collapsed middle levels are only visually hidden and stay announced.
- Icon-only links need `aria-label` on the Item.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `nav` | `"Навигационная цепочка"` | `aria-label` of the `nav` landmark. |
| `ellipsis` | `"Скрытые разделы"` | Hidden text of `Breadcrumb.Ellipsis`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | The path to this page: links to the levels above and the current page last — `href`, `current`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier; text and chevrons follow the control tier — `size`. |
| [with-icon.tsx](examples/with-icon.tsx) | The root level as a home icon; a link without text is named for screen readers — `aria-label`. |
| [overflow.tsx](examples/overflow.tsx) | A long path: levels truncate, and in a 320px container the middle ones collapse into «…» that screen readers still read. |
| [ellipsis.tsx](examples/ellipsis.tsx) | Levels skipped on purpose shown as «…» with hidden text for screen readers — `Breadcrumb.Ellipsis`. |

## Mistakes
- Separators by hand between items → the root draws the chevrons.
- `<Breadcrumb.Item href="…" current>` → the current page has no `href`.
- Breadcrumb inside a flex row collapsing to zero width → give it `flex: 1 1 auto; min-width: 0`.
- Home icon link without `aria-label` → add `aria-label="Главная"`.

## Related
- **Built from:** [LinkButton](../link-button/COMPONENT.md), Icon (`nav.chevronRight`)
- **See also:** [Tabs](../tabs/COMPONENT.md), [PageContent](../page-content/COMPONENT.md), [Stepper](../stepper/COMPONENT.md)
