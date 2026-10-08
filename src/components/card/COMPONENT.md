# Card

**Category:** data-display
**Kind:** composite

> A filled surface block with structural templates for metrics, charts, lists, calls to action and covers.

## When to use
- KPI tiles on a dashboard (`mini`, `stat-trend`, `split`).
- A chart or text widget with a header and controls (`panel`).
- A settings or profile form grouped on its own surface (`panel` + `Body` + `Footer`).
- An activity list (`list`), a call to action (`cta`), a tile with an image on top (`cover`).

## When not to use
- A whole page region with a title and description → [PageContent](../page-content/COMPONENT.md) sections; do not wrap every section in a card.
- Tabular data → use [DataTable](../data-table/COMPONENT.md) (it has its own fill).
- A message about the page state → [Banner](../banner/COMPONENT.md); nothing to show yet → [EmptyPage](../empty-page/COMPONENT.md).
- Content that floats over the page → [Popover](../popover/COMPONENT.md), [Modal](../modal/COMPONENT.md) or [Drawer](../drawer/COMPONENT.md).

## Import
```tsx
import { Card } from "prime-ui-kit";
```

## Anatomy
```
Card.Root variant="panel"        Header(Title, …trailing) · Body · Media · Footer
Card.Root variant="mini"         Icon · Label · Value · Media?
Card.Root variant="stat-trend"   Label · Value · Delta
                                 or Header(Badge or Icon, Value) · Description
Card.Root variant="split"        Body(cell × 2: any element, e.g. <div> with Icon · Label · Value)
Card.Root variant="cta"          Title · Description · Footer
Card.Root variant="list"         Header(Title, …trailing) · List(ListItem …)
Card.Root variant="cover"        Media · Body(Title, Description) · Footer
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Card.Root
`ref` → `HTMLDivElement`. A layer of the surface ladder (`data-depth` one above the surface around it: white on the light page, the next layer when nested; radius 12, the raised whisper only on the page, no border) and a size container; `variant` picks the template layout of its parts.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"panel" \| "mini" \| "stat-trend" \| "split" \| "cta" \| "list" \| "cover"` | `"panel"` | Structural template: titled block with zones (`panel`), KPI tiles, a call to action, a list or a cover tile. |
| `flat` | `boolean` | `false` | No raised shadow: a flat tile for dense grids. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `role` + `aria-labelledby` for a landmark block, and the other div attributes. |

### Card.Header
`ref` → `HTMLDivElement`. The top row: `Card.Title` first, anything after it (a control, a quiet caption) at the end. In `panel` and `list` it is a padded zone with a faint hairline below; in `stat-trend` it can pair a leading badge or icon with a compact `Card.Value`. Wraps below 22rem.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Title
`ref` → `HTMLHeadingElement`. The card heading (`<h3>`, title-s; title-m in `cta`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `"h2" \| "h3" \| "h4"` | `"h3"` | Heading level that fits the page outline; the look does not change. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Description
`ref` → `HTMLParagraphElement`. Secondary text (`<p>`, body-s, wraps): under the title of `cta` and `cover`, under the header of `stat-trend`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Body
`ref` → `HTMLDivElement`. The padded content zone (gap 16). In `split` it is the two-cell grid: each child is a cell (stacked below 22rem); in `cover` it holds the title and the description 4 apart.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Media
`ref` → `HTMLDivElement`. A chart, an image or a gauge: edge to edge under the header or the body in `panel`, the 128–192px cover on top in `cover`, the full-width bottom slot in `mini`. A chart SVG needs a CSS height.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Footer
`ref` → `HTMLDivElement`. The bottom row of buttons, wrapping: right-aligned under a faint hairline in `panel` and `list`, under a full-width hairline in `cta`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Icon
`ref` → `HTMLDivElement`. The 40px accent tile of a KPI holding one icon; it spans the label and the value rows in `mini` and a `split` cell.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Label · Card.Value · Card.Delta
`ref` → `HTMLSpanElement`. Metric text: the label (body-s, truncates), the value (tabular, sized by the template and the card width) and the change.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Delta: color by meaning, not by sign (churn up is `danger`). |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.List · Card.ListItem
`ref` → `HTMLUListElement` / `HTMLLIElement`. The `list` template: a `<ul>` of `<li>` rows with faint hairlines between them; head it with `Card.Header`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

## Variants

### variant (structural templates)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `panel` | no root padding; `Header` with a faint hairline, padded `Body`, edge-to-edge `Media`, right-aligned `Footer` | chart widgets, settings forms, any titled block | yes |
| `mini` | 40px accent `Icon` tile beside the label and the title-l value; a `Media` child is a full-width bottom slot | a compact KPI tile, with a sparkline or a ProgressBar | |
| `stat-trend` | label, large value (adapts to the card width), delta; or a `Header` (lead left, heading-m value right) + description | the main number of a dashboard row; a KPI with a qualifier badge | |
| `split` | `Body` with two metric cells and a faint hairline; stacked below 22rem | two related metrics in one tile | |
| `cta` | title, body-s text, `Footer` under a hairline | a call to action | |
| `list` | `Header` with a hairline, items with faint hairlines | recent events, short lists | |
| `cover` | 128–192px `Media` on top, title and description, `Footer` | campaign, project or product tiles | |

### tone (Delta)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | `text-secondary` | a change with no good/bad meaning | yes |
| `success` | `success-text` | the change is good | |
| `warning` | `warning-text` | the change needs attention | |
| `danger` | `danger-text` | the change is bad | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `flat` | same fill, no shadow | dense grids of tiles | `false` |

## States
| State | Driven by | DOM |
|---|---|---|
| template | `variant` | `data-variant` |
| flat | `flat` | `data-flat` |
| depth | nesting: one above the nearest surface (the page and the AppShell panel are 0) | `data-depth` (`1`–`4`, `floating-1`/`floating-2` inside a floating layer); the fill is `--prime-color-layer-current`, the shadow only at depth 1 |
| card width | container queries | `split` stacks below 22rem, `Header` wraps below 22rem, the `stat-trend` value changes at 20rem / 36rem |

Card is static: no hover, focus or press of its own.

## Layout & spacing
- Grid of cards: `repeat(auto-fit, minmax(min(100%, 14rem), 1fr))`, gap `--prime-space-4`.
- Padding `--prime-card-padding-m` (20); `Body` gap `--prime-card-gap` (16); fields inside `Body` 20 apart, one ladder step off the card.
- Depth comes from nesting (foundation §4): on the page — the AppShell panel is the page — a card is layer 1 (white in light) with the raised whisper; inside another card it is the next layer, a flat tile. The ladder stops at layer 4.
- Long values wrap, labels truncate; a chart SVG needs a CSS height.
- In a `Header` the title takes the free width; a control or a caption after it sits at the end without a wrapper.

## Accessibility

### Keyboard
No keyboard interaction.

### ARIA
- `Card.Root` is a plain `<div>`; give it `role="region"` + `aria-labelledby` only when it is a landmark-worthy block.
- `Card.Title` renders `<h3>`; directly under the page title pass `as="h2"`.
- Decorative icons in `Card.Icon` and cover images in `Card.Media` get `aria-hidden`; controls in `Card.Header` need their own names.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A company settings panel: a header, fields on the surface fill and buttons in the footer — `Card.Header`, `Card.Body`, `Card.Footer`. |
| [variants.tsx](examples/variants.tsx) | KPI templates: an icon tile with a value, a badge with a value in the header row, and a large value with its change — `variant`, `Card.Delta`. |
| [kpi-media.tsx](examples/kpi-media.tsx) | A KPI with a sparkline or a fill level in the bottom slot of `mini` — `Card.Media`. |
| [panel-chart.tsx](examples/panel-chart.tsx) | A chart widget: a header with a period switch, a summary line and an edge-to-edge chart — `Card.Header`, `Card.Media`. |
| [content-templates.tsx](examples/content-templates.tsx) | Content templates: a call to action, an events list and a campaign tile with a cover — `Card.Footer`, `Card.List`, `Card.Media`. |
| [flat.tsx](examples/flat.tsx) | A flat tile without the raised shadow next to the default one, for dense grids — `flat`. |
| [narrow.tsx](examples/narrow.tsx) | The card is a size container: the split template stacks its cells below 22rem and the trend value shrinks below 20rem. |

## Mistakes
- A `<div>` with a border styled as a card → use `Card.Root`; depth comes from fill, not lines.
- Wrapping every page section in a card → use PageContent sections.
- `Card.Delta tone="success"` for every «+» → choose the tone by meaning.
- Custom padding on a `panel` root → padding belongs to `Header` / `Body` / `Footer`.
- A wrapper `<div>` around the label and the value of `mini` → put `Icon`, `Label`, `Value` straight into the root (or into a `split` cell); the template lays them out.
- A chart SVG with only a `viewBox` → give it a CSS height.

## Related
- **Built from:** —
- **See also:** [PageContent](../page-content/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [Badge](../badge/COMPONENT.md), [ProgressBar](../progress-bar/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md)
