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
Breadcrumb.Root           <nav aria-label> + <ol>; size; chevrons between levels; auto-collapse into a «…» menu
├─ Breadcrumb.Item        <li>: a link (href → LinkButton, or a router link with asChild), text, or the current page (current)
└─ Breadcrumb.Ellipsis    <li> with «…» for levels skipped on purpose
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Breadcrumb.Root
`ref` → `HTMLElement` (the `<nav>`). `<nav aria-label>` with an `<ol>`; draws the chevrons between levels, sets the size and folds levels that do not fit into a «…» menu button that lists them: the middle ones, then the first one too.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Text of the links, the current page and the ellipsis; chevrons, icons and the collapse menu take the same tier. Without it the tier of its host, else `m`. |
| `labels` | `Partial<BreadcrumbLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | `Breadcrumb.Item`s and `Breadcrumb.Ellipsis`, in order; no separators by hand. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `className` and the other `nav` attributes; an `aria-label` here overrides `labels.nav`. |

### Breadcrumb.Item
`ref` → `HTMLLIElement`. `<li>`: a muted `LinkButton` (`href`, or the consumer's router link with `asChild`), plain text, or the current page (`current`). A press on the link goes through `Page.Guard`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | — | Renders a link; without it (and without `asChild`) the item is text. |
| `asChild` | `boolean` | `false` | The single child (a router `Link`) is the level's link with the same look; its own text is the level. In the «…» menu of a folded path it is the menu item. |
| `current` | `boolean` | — | Current page: `aria-current="page"` (on the link when `href` is set), primary text, medium weight. Usually the last item, without `href`. |
| `aria-label` | `string` | — | Name of a link without visible text (e.g. a home icon); set on the link, not the `li`. |
| `children` | `ReactNode` | — | Text or an `Icon`; with `asChild` one element. A string also becomes the `title` of a text item (full text when truncated). |
| `…rest` | `Omit<LiHTMLAttributes<HTMLLIElement>, "aria-label">` | — | `className` and the other `li` attributes. |

### Breadcrumb.Ellipsis
`ref` → `HTMLLIElement`. `<li>` with «…» for levels skipped on purpose, with visually hidden `labels.ellipsis`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<LiHTMLAttributes<HTMLLIElement>, "children">` | — | `className` and the other `li` attributes. |

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
| link (`href`) | a `LinkButton` in the muted trail tone (`tone="muted"`): muted text, primary on hover and focus, no underline | every ancestor level | |
| text (no `href`, no `current`) | muted text | a level without its own page | yes |
| current (`current`) | primary text, medium weight | the last item — this page | |
| icon link (`href` + `aria-label`, `Icon` child) | icon at the tier icon size | a «home» root | |
| router link (`asChild`, one `Link` child) | the same muted link, the consumer's element | an app with a client router: the path moves without a reload | |

Use links for every ancestor and `current` on the last item; `s` above a `heading-m` page title. Avoid `href` on the current item and two `current` items.

## States
| State | Driven by | DOM |
|---|---|---|
| current | `current` | `aria-current="page"` on the text span, or on the link when the item has `href` |
| hover / focus-visible on links | pointer / keyboard | text → primary; focus ring from LinkButton |
| truncation | width | each level truncates with an ellipsis, max width `2 × --prime-space-24` (192); the current page shrinks at half the rate of the others |
| auto-collapse | 2+ levels whose whole path does not fit the width uncut (measured on every resize) | `data-collapsible="true"`, `data-collapsed="true"`; middle levels are `display: none` and replaced by «… ›»: a ghost menu button (`Dropdown.Trigger`, named by `labels.ellipsis`) whose menu lists them — links stay links, a level without `href` is a disabled row |
| deep collapse | the path folded as above still does not fit | `data-collapsed="deep"`; the first level folds too: «…» › current page, the menu lists every level before it |
| collapse menu open | a press, `Enter` or `ArrowDown` on the «…» | `aria-expanded="true"` on the button; a `role="menu"` panel at the tier size |
| held | a `Page.Guard` that is `busy` or `dirty` on the page | a press on a level's link (in the path or the «…» menu) stops before it navigates; `dirty` asks first, then repeats it |

Root attributes: `data-size`, `data-collapsible` (`"true"` / `"false"`), `data-collapsed` (`"true"` / `"deep"`).

## Layout & spacing
- A single level takes its content width (at most the row). A path of 2+ levels fills the row (`inline-size: 100%`) and folds by that width, so a wider row unfolds it again; its intrinsic width stays the whole path, so a host that measures natural widths (the `Page.TopBar` plan) reads it uncut. Inside a flex row give it a box that takes the room it may use (`flex: 1 1 auto; min-width: 0`).
- In a `Page.Heading` the path up holds the list a record belongs to (1–2 levels); the record itself is the `Page.Title` (in a top bar the path's last level, after the chevron), not the breadcrumb's `current` item.
- Above a page title: `gap: var(--prime-space-2)` between the trail and the title row.
- The list never wraps. Chevrons sit inside each level after the first, in the placeholder text color, at the tier icon size.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves focus between the level links and the «…» of a collapsed path; the current page is not focusable. |
| `Enter` | Follows the link; on the «…» opens the menu of the hidden levels. |
| `ArrowDown` · `ArrowUp` · `Escape` | In the menu of hidden levels: move between them, close it and return to the «…». |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- `nav` landmark with `aria-label` from `labels.nav`; an ordered list.
- The current page has `aria-current="page"`; the chevrons are `aria-hidden` spans inside the levels, so every list item is a level.
- Collapsed levels leave the layout and the tab order (no invisible focus stops); the automatic «…» is a menu button (`aria-haspopup="menu"`) named by `labels.ellipsis`, and its menu lists them as links.
- Icon-only links need `aria-label` on the Item.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `nav` | `"Навигационная цепочка"` | `aria-label` of the `nav` landmark. |
| `ellipsis` | `"Скрытые разделы"` | Name of the collapse menu button and hidden text of `Breadcrumb.Ellipsis`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | The path to this page: links to the levels above and the current page last — `href`, `current`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier; text and chevrons follow the control tier — `size`. |
| [with-icon.tsx](examples/with-icon.tsx) | The root level as a home icon; a link without text is named for screen readers — `aria-label`. |
| [overflow.tsx](examples/overflow.tsx) | A long path: levels truncate, and in a 320px container the middle ones collapse into a «…» menu that lists them — `Breadcrumb.Item`, `current`. |
| [ellipsis.tsx](examples/ellipsis.tsx) | Levels skipped on purpose shown as «…» whose hidden text names them for screen readers — `Breadcrumb.Ellipsis`, `labels`. |
| [router.tsx](examples/router.tsx) | Router links as the levels above: the path moves without a reload; render it inside a router — `asChild`, `current`. |

## Mistakes
- Separators by hand between items → the root draws the chevrons.
- `<Breadcrumb.Item href="…" current>` → the current page has no `href`.
- Breadcrumb inside a flex row collapsing to zero width → give it `flex: 1 1 auto; min-width: 0`.
- Home icon link without `aria-label` → add `aria-label="Главная"`.
- `href` + `onClick` with `preventDefault()` and `navigate()` for a router → `asChild` with the router's `Link`.

## Related
- **Built from:** [LinkButton](../link-button/COMPONENT.md) (`tone="muted"`), [Button](../button/COMPONENT.md) and [Dropdown](../dropdown/COMPONENT.md) (the collapse menu), Icon (`nav.chevronRight`), [VisuallyHidden](../visually-hidden/COMPONENT.md)
- **See also:** [Tabs](../tabs/COMPONENT.md), [Page](../../layout/page/COMPONENT.md), [Stepper](../stepper/COMPONENT.md)
