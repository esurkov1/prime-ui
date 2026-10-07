# Card

**Category:** data-display
**Kind:** composite

> A filled surface block with structural templates for metrics, charts, lists, calls to action and covers.

## When to use
- KPI tiles on a dashboard (`mini`, `mini-media`, `metric`, `stat-trend`, `split`).
- A chart or text widget with a header and controls (`panel`).
- A settings or profile form grouped on its own surface (`panel` + `Body` + `Actions`).
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
Card.Root variant="panel"        SectionHeader(SectionTitle, SectionTrailing) · Body · Chart · Actions
Card.Root variant="mini"         IconBox · Stack(Label, Value)
Card.Root variant="mini-media"   IconBox · Stack(Label, Value) · Media
Card.Root variant="metric"       HeaderRow(Badge or Icon, Value) · Description
Card.Root variant="stat-trend"   Label · Value · Delta
Card.Root variant="split"        Split(cell × 2: any element, e.g. IconBox + Stack)
Card.Root variant="cta"          Title · Description · Actions
Card.Root variant="list"         SectionHeader(SectionTitle, …) · List(ListItem …)
Card.Root variant="cover"        Cover · Title · Label · Actions
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Card.Root
`ref` → `HTMLDivElement`. The filled surface (card fill, radius 12, raised shadow, no border) and a size container; `variant` picks the template layout of its parts.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"panel" \| "mini" \| "mini-media" \| "metric" \| "stat-trend" \| "split" \| "cta" \| "list" \| "cover"` | `"panel"` | Structural template: titled block with zones (`panel`), KPI tiles, a call to action, a list or a cover tile. |
| `flat` | `boolean` | `false` | No raised shadow: a flat tile for dense grids. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `role` + `aria-labelledby` for a landmark block, and the other div attributes. |

### Card.SectionHeader · Card.SectionTitle · Card.SectionTrailing
`panel` and `list` header: a row with a faint hairline below, the title (`<h3>`) and a trailing slot for controls.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `"h2" \| "h3" \| "h4"` | `"h3"` | SectionTitle: Heading level that fits the page outline; the look does not change. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Body · Card.Actions · Card.Chart
`panel` zones: the padded body (gap 16), the right-aligned footer row of buttons with a hairline above, and an edge-to-edge chart slot.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Title
The title of the `cta`, `list` and `cover` templates (`<h3>`, title-m).

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `"h2" \| "h3" \| "h4"` | `"h3"` | Heading level that fits the page outline; the look does not change. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Label · Card.Value · Card.Description · Card.Delta
Metric text: the label (body-s), the value (sized by the template and the card width), a description and the change.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Delta: color by meaning, not by sign (churn up is `danger`). |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.IconBox · Card.Stack · Card.HeaderRow · Card.Media
Template layout parts: the 40px accent icon tile, the label + value column, the `metric` header row (a leading badge or icon, the value at the end), and the bottom media slot of `mini-media`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Cover · Card.Split · Card.List · Card.ListItem
Template parts: the `cover` media, the `split` grid whose two children are the cells (stacked below 22rem), and the `list` `<ul>` / `<li>` items with faint hairlines (head it with `Card.SectionHeader`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

## Variants

### variant (structural templates)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `panel` | no root padding; header with a faint hairline, padded `Body`, edge-to-edge `Chart`, right-aligned `Actions` | chart widgets, settings forms, any titled block | yes |
| `mini` | 40px accent icon tile + label and title-l value | a compact KPI tile | |
| `mini-media` | `mini` plus a full-width bottom `Media` slot | a KPI with a sparkline or a ProgressBar | |
| `metric` | header row (lead left, heading-m value right) + description | a KPI with a qualifier badge | |
| `stat-trend` | label, large value (adapts to the card width), delta | the main number of a dashboard row | |
| `split` | two metric cells with a hairline; stacked below 22rem | two related metrics in one tile | |
| `cta` | title, body-s text, actions under a hairline | a call to action | |
| `list` | list header with a hairline, items with faint hairlines | recent events, short lists | |
| `cover` | 128–192px media on top, title, label, actions | campaign, project or product tiles | |

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
| card width | container queries | `split` stacks below 22rem, `HeaderRow` wraps below 22rem, the `stat-trend` value changes at 20rem / 36rem |

Card is static: no hover, focus or press of its own.

## Layout & spacing
- Grid of cards: `repeat(auto-fit, minmax(min(100%, 14rem), 1fr))`, gap `--prime-space-4`.
- Padding `--prime-card-padding-m` (20); `Body` gap `--prime-card-gap` (16); fields inside `Body` 20 apart, on the surface field fill.
- Long values wrap, labels truncate; a chart SVG needs a CSS height.

## Accessibility

### Keyboard
No keyboard interaction.

### ARIA
- `Card.Root` is a plain `<div>`; give it `role="region"` + `aria-labelledby` only when it is a landmark-worthy block.
- `Card.Title` and `Card.SectionTitle` render `<h3>`; directly under the page title pass `as="h2"`.
- Decorative icons in `IconBox` and covers get `aria-hidden`; controls in `SectionTrailing` need their own names.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A company settings panel: a section header, fields on the surface fill and actions at the end — `Card.SectionHeader`, `Card.Body`, `Card.Actions`. |
| [variants.tsx](examples/variants.tsx) | KPI templates: an icon tile with a value, a badge with a value, and a large value with its change — `variant`, `Card.Delta`. |
| [mini-media.tsx](examples/mini-media.tsx) | A KPI with a sparkline or a fill level in the bottom slot — `Card.Media`. |
| [panel-chart.tsx](examples/panel-chart.tsx) | A chart widget: a header with a period switch, a summary line and an edge-to-edge chart — `Card.SectionTrailing`, `Card.Chart`. |
| [content-templates.tsx](examples/content-templates.tsx) | Content templates: a call to action, an events list and a campaign tile with a cover — `Card.Description`, `Card.List`, `Card.Cover`. |
| [flat.tsx](examples/flat.tsx) | A flat tile without the raised shadow next to the default one, for dense grids — `flat`. |
| [narrow.tsx](examples/narrow.tsx) | The card is a size container: the split template stacks its cells below 22rem and the trend value shrinks below 20rem. |

## Mistakes
- A `<div>` with a border styled as a card → use `Card.Root`; depth comes from fill, not lines.
- Wrapping every page section in a card → use PageContent sections.
- `Card.Delta tone="success"` for every «+» → choose the tone by meaning.
- Custom padding on a `panel` root → padding belongs to `SectionHeader` / `Body` / `Actions`.
- A chart SVG with only a `viewBox` → give it a CSS height.

## Related
- **Built from:** —
- **See also:** [PageContent](../page-content/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [Badge](../badge/COMPONENT.md), [ProgressBar](../progress-bar/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md)
