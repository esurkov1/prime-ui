# Card

**Category:** data-display (Данные)

> A filled surface block with structural templates for metrics, charts, lists, calls to action and covers.

## When to use
- KPI tiles on a dashboard (`mini`, `mini-media`, `metric`, `stat-trend`, `split`).
- A chart or text widget with a header and controls (`panel`).
- A settings or profile form grouped on its own surface (`panel` + `Body` + `Actions`).
- An activity list (`list`), a call to action (`cta`), a tile with an image on top (`cover`).

## When not to use
- A whole page region with a title and description → use [PageContent](../page-content/COMPONENT.md) sections; do not wrap every section in a card.
- Tabular data → use [DataTable](../data-table/COMPONENT.md) (it has its own fill).
- A message about the page state → use [Banner](../banner/COMPONENT.md); nothing to show yet → [EmptyPage](../empty-page/COMPONENT.md).
- Content that floats over the page → use [Popover](../popover/COMPONENT.md), [Modal](../modal/COMPONENT.md) or [Drawer](../drawer/COMPONENT.md).
- Collapsible groups → use [Accordion](../accordion/COMPONENT.md).

## Import
```tsx
import { Card } from "prime-ui-kit";
```

## Anatomy
```
Card.Root variant="mini"         IconBox · Stack(Label, Value)
Card.Root variant="mini-media"   IconBox · Stack(Label, Value) · Media
Card.Root variant="metric"       HeaderRow(Lead, Value) · Description
Card.Root variant="stat-trend"   Label · Value · Delta
Card.Root variant="split"        Split > SplitCell(IconBox, Stack(Label, Value)) ×2
Card.Root variant="panel"        SectionHeader(SectionTitle, SectionTrailing) · Body · Chart · Actions
Card.Root variant="cta"          Title · CtaBody · Actions
Card.Root variant="list"         ListHeader(Title, link) · List > ListItem … · Actions
Card.Root variant="cover"        Cover · Stack(Title, Label) · Actions
```
The parts are free slots: every part works in any template, but the spacing rules above are tuned for these trees.

## API

### Card.Root
`<div>`. Forwards `ref`. No `asChild`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"mini" \| "mini-media" \| "metric" \| "panel" \| "stat-trend" \| "cta" \| "list" \| "split" \| "cover"` | `"panel"` | Structural template: layout, padding and the value text role. |
| `flat` | `boolean` | `false` | Removes the card shadow. No border in either case. |
| `className` | `string` | — | Extra class. |
| `children` | `ReactNode` | — | Parts. |

+ native `<div>` props (`HTMLAttributes<HTMLDivElement>`). `data-variant` / `data-flat` are always set by the component.

### Card.Delta
`<span>`. No ref forwarding. Change of a metric: body-s, weight 500, `tabular-nums`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color by meaning (good / bad), independent of the sign. |
| `children` | `ReactNode` | — | Content ("+18% к сентябрю"). |
| `className` | `string` | — | Extra class. |

+ native `<span>` props. `data-tone` is always set by the component.

### Card.IconBox
`<div>`. No ref forwarding. 40px tile (`control-l-height`), radius 8, `accent-soft` fill, `accent-text` icon 20px. In `mini`, `mini-media`, `SplitCell`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<div>` props (`HTMLAttributes<HTMLDivElement>`).

### Card.Lead
`<div>`. No ref forwarding. Leading element of a `HeaderRow` (badge, icon in `text-secondary`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<div>` props (`HTMLAttributes<HTMLDivElement>`).

### Card.HeaderRow
`<div>`. No ref forwarding. Row with space-between: lead left, value right (`metric`). Wraps below 22rem card width.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<div>` props (`HTMLAttributes<HTMLDivElement>`).

### Card.Stack
`<div>`. No ref forwarding. Column with `--prime-space-1` gap for Label + Value (or Title + Label in `cover`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<div>` props (`HTMLAttributes<HTMLDivElement>`).

### Card.Label
`<span>`. No ref forwarding. Metric caption: body-s, `text-secondary`, one line with ellipsis.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<span>` props (`HTMLAttributes<HTMLSpanElement>`).

### Card.Value
`<span>`. No ref forwarding. The number: title-l (heading-m in `metric`, heading-l in `stat-trend`), `tabular-nums`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<span>` props (`HTMLAttributes<HTMLSpanElement>`).

### Card.Description
`<p>`. No ref forwarding. Secondary line: body-s, `text-secondary`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<p>` props (`HTMLAttributes<HTMLParagraphElement>`).

### Card.Media
`<div>`. No ref forwarding. Bottom full-width slot of `mini-media` (sparkline, ProgressBar); min height 40px.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<div>` props (`HTMLAttributes<HTMLDivElement>`).

### Card.Title
Heading (`<h3>` by default). No ref forwarding. Card title: title-s (title-m in `cta`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `"h2" \| "h3" \| "h4"` | `"h3"` | Heading level for the page outline; the look does not change. |
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native heading props (`HTMLAttributes<HTMLHeadingElement>`).

### Card.Actions
`<div>`. No ref forwarding. Action row, `gap` 8. In `panel` / `list` it is the footer: right-aligned, faint hairline above. In `cta` a hairline above.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<div>` props (`HTMLAttributes<HTMLDivElement>`).

### Card.CtaBody
`<div>`. No ref forwarding. Body text of a `cta` card: body-s, `text-secondary`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<div>` props (`HTMLAttributes<HTMLDivElement>`).

### Card.Cover
`<div>`. No ref forwarding. Top media of a `cover` card: full width, 128–192px high, sunken fill; the child image/element covers it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<div>` props (`HTMLAttributes<HTMLDivElement>`).

### Card.Split
`<div>`. No ref forwarding. Two-column grid for `split`; one column below 22rem card width.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<div>` props (`HTMLAttributes<HTMLDivElement>`).

### Card.SplitCell
`<div>`. No ref forwarding. One cell of `Split`; a hairline separates the cells. With an `IconBox` it becomes a row.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<div>` props (`HTMLAttributes<HTMLDivElement>`).

### Card.ListHeader
`<div>`. No ref forwarding. Header row of a `list` card (title + link); faint hairline below when followed by `List`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<div>` props (`HTMLAttributes<HTMLDivElement>`).

### Card.List
`<ul>`. Forwards `ref`. List of a `list` card (no bullets).

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<ul>` props (`HTMLAttributes<HTMLUListElement>`).

### Card.ListItem
`<li>`. Forwards `ref`. Item: body-m, padding 12 × card padding, faint hairline between items.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<li>` props (`HTMLAttributes<HTMLLIElement>`).

### Card.SectionHeader
`<div>`. No ref forwarding. Header of a `panel` card: title + trailing, min height 36px; faint hairline below when followed by `Body`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<div>` props (`HTMLAttributes<HTMLDivElement>`).

### Card.SectionTitle
Heading (`<h3>` by default). No ref forwarding. Panel title: title-s.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `"h2" \| "h3" \| "h4"` | `"h3"` | Heading level for the page outline; the look does not change. |
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native heading props (`HTMLAttributes<HTMLHeadingElement>`).

### Card.SectionTrailing
`<div>`. No ref forwarding. Right side of `SectionHeader`: controls, icon 16px in `text-secondary`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<div>` props (`HTMLAttributes<HTMLDivElement>`).

### Card.Body
`<div>`. No ref forwarding. Padded content of a `panel`: column with `--prime-card-gap` (16) gap; a single child stretches.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<div>` props (`HTMLAttributes<HTMLDivElement>`).

### Card.Chart
`<div>`. No ref forwarding. Edge-to-edge chart area of a `panel` (no side padding); a single child stretches.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. |
| `className` | `string` | — | Extra class. |

+ native `<div>` props (`HTMLAttributes<HTMLDivElement>`).

## Variants

### variant (structural templates)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `mini` | Row: 40px accent icon tile + label (body-s) and value (title-l); padding 20 | A compact KPI tile | |
| `mini-media` | `mini` row plus a full-width bottom `Media` slot | A KPI with a sparkline or a ProgressBar | |
| `metric` | Column: header row (badge/lead left, heading-m value right) + description; gap 8 | A KPI with a qualifier badge (SLA, period) | |
| `stat-trend` | Column: label, large heading-l value (heading-m below 20rem, display-s above 36rem card width), delta | The main number of a dashboard with its change | |
| `split` | Two metric cells side by side with a hairline between; stacked below 22rem | Two related metrics in one tile | |
| `panel` | No padding on the root; header (title + trailing) with a faint hairline, padded `Body`, edge-to-edge `Chart`, footer `Actions` right-aligned with a hairline above | Chart widgets, settings forms, any titled block | yes |
| `cta` | Column: title-m title, body-s text, actions under a hairline; gap 12 | A call to action (export, upgrade, connect) | |
| `list` | No padding on the root; list header with hairline, items separated by faint hairlines | Recent events, short lists with a "Все" link | |
| `cover` | No padding; 128–192px media on top, title + label, actions | Campaign, project or product tiles | |

All variants share: `--prime-color-card-bg` fill, radius 12 (`--prime-card-radius`), `--prime-card-shadow`, no border.

### flat (visual flag)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` | Card fill + barely visible raised shadow | Cards on the page canvas | yes |
| `true` | Same fill, no shadow (`data-flat`) | Dense grids of tiles where many shadows add noise | |

### Card.Delta `tone`
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | `text-secondary` | A change with no good/bad meaning | yes |
| `success` | `success-text` | The change is good (revenue up, churn down) | |
| `warning` | `warning-text` | The change needs attention | |
| `danger` | `danger-text` | The change is bad (churn up) | |

**Combinations**
- Recommended: a row of `mini` / `stat-trend` cards for KPIs; `panel` for charts and forms; `Delta tone` by meaning, not by sign (`+0,6 п. п.` churn is `danger`).
- Allowed but rare: `flat` cards in dense grids; parts outside their template (e.g. `Description` in `stat-trend`).
- Avoid: a card inside a card for layout (a nested card becomes a sunken tile without shadow — use it only for a real inner block); borders around cards; a `cover` without a meaningful image.

**Sizes**
Card has no `size`. Padding is `--prime-card-padding-m` (20); `Body` gap is `--prime-card-gap` (16). The card fills its column (`width: 100%`); set widths with the grid around it.

**Hierarchy**
One `stat-trend` (the main number) per dashboard row, the rest `mini` or `metric`. In a panel footer: one primary Button, the rest `ghost`.

## States
Card is not interactive (no hover, focus or selection).

| Attribute | Element | Driven by |
|---|---|---|
| `data-variant` | Root | `variant` (always set, default `panel`) |
| `data-flat="true"` | Root | `flat` |
| `data-tone` | Delta | `tone` (always set, default `neutral`) |

Surface context: the card sets `--prime-color-field-bg: var(--prime-color-field-bg-surface)` (fields inside stay distinguishable), `--avatar-ring` to its fill, and for its children `--prime-color-card-bg: var(--prime-color-bg-sunken)` + `--prime-card-shadow: none`, so a nested card or table becomes a sunken tile. Inside AppShell content, Modal, Drawer or Popover the card itself is a sunken tile without shadow.

## Layout & spacing
- Grid of cards: `repeat(auto-fit, minmax(min(100%, 14rem), 1fr))` with `gap: var(--prime-space-4)`.
- Fields inside `Card.Body`: field → field `--prime-space-5` (20).
- The card is a size container (`container-type: inline-size`): `split` stacks below 22rem, `HeaderRow` wraps below 22rem, `stat-trend` value changes at 20rem / 36rem.
- Long values wrap (`overflow-wrap: anywhere`); labels truncate with ellipsis.
- Charts: give the SVG a fixed CSS height; `Card.Chart` stretches it edge to edge.

## Accessibility
- `Card.Root` is a plain `<div>`; give it `role="region"` + `aria-labelledby` only when it is a landmark-worthy block.
- `Card.Title` and `Card.SectionTitle` render `<h3>` by default; directly under a page `<h1>` (`PageContent.Title`) pass `as="h2"` so no level is skipped.
- Decorative icons in `IconBox` and decorative covers get `aria-hidden`.
- Controls in `SectionTrailing` need their own accessible names (e.g. `aria-label="Период"` on SegmentedControl).
- No `labels` keys.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [metrics.tsx](examples/metrics.tsx) | `mini`, `metric`, `stat-trend` with `Delta` success / danger | KPI rows on dashboards |
| [mini-media.tsx](examples/mini-media.tsx) | `mini-media` with a sparkline and a ProgressBar | KPI with a trend or fill level |
| [responsive.tsx](examples/responsive.tsx) | `split` and `stat-trend` at 18rem and 40rem | Two related metrics; container-query behaviour |
| [panel-chart.tsx](examples/panel-chart.tsx) | `panel` with header switch, body text, edge-to-edge chart | Chart widgets |
| [content.tsx](examples/content.tsx) | `cta`, `list`, `cover` | Calls to action, activity lists, tiles with media |
| [settings.tsx](examples/settings.tsx) | `panel` with a form and footer actions | Settings and profile forms |
| [flat.tsx](examples/flat.tsx) | Default shadow vs `flat` | Dense tile grids |

```tsx
import { Card } from "prime-ui-kit";

export function RevenueCard() {
  return (
    <Card.Root variant="stat-trend">
      <Card.Label>Выручка за месяц</Card.Label>
      <Card.Value>₽ 4,2 млн</Card.Value>
      <Card.Delta tone="success">+18% к сентябрю</Card.Delta>
    </Card.Root>
  );
}
```

## Mistakes
- `<div className="card">` with a border → use `Card.Root`; depth comes from fill, not lines.
- Wrapping every page section in a card → use PageContent sections; cards are for bounded blocks.
- `Card.Delta tone="success"` for every "+" → choose the tone by meaning.
- Custom padding on `Card.Root variant="panel"` → padding belongs to `SectionHeader` / `Body` / `Actions`.
- A chart SVG with only a `viewBox` → give it a CSS height, or it scales to a square.
- Setting a white background on fields inside a card → leave the field context; the card switches it.

## Related
- [DataTable](../data-table/COMPONENT.md) — tables on their own fill.
- [Badge](../badge/COMPONENT.md) — qualifiers in `Card.Lead`.
- [ProgressBar](../progress-bar/COMPONENT.md) — fill level in `Card.Media`.
- [SegmentedControl](../segmented-control/COMPONENT.md) — period switch in `SectionTrailing`.
- [PageContent](../page-content/COMPONENT.md) — page sections around cards.
