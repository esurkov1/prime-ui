# Card

**Defaults:** use **`variant`** and documented slots as in the canonical example below. Set **`flat`** when the card should read as a flat surface on the page (no elevation shadow).

## About

Composable surfaces for **dashboard KPIs**, **lists**, **CTA tiles**, **split metrics**, **media headers**, and **chart shells**: layout presets are driven by **`variant`** on **`Card.Root`**. Typography and spacing use semantic tokens (`--prime-sys-*`). The kit does not ship chart primitives — mount a chart library root, SVG, or [ProgressBar](../progress-bar/COMPONENT.md) inside **`Card.Media`**, **`Card.Chart`** (**`panel`**, edge-to-edge), padded **`Card.Body`**, or **`Card.Cover`**.

Further reading: [Material Design 3 — Cards](https://m3.material.io/components/cards/guidelines), [IBM Carbon — Tile](https://carbondesignsystem.com/components/tile/usage/), [Nielsen Norman Group — Dashboard Design](https://www.nngroup.com/articles/dashboard-design/).

- **Use** **`variant="mini"`** for a compact KPI: optional **`IconBox`** + **`Stack`** with **`Label`** and **`Value`**.
- **Use** **`variant="mini-media"`** for the same leading row as **`mini`**, then **`Media`** for a sparkline, ring, or thin progress strip.
- **Use** **`variant="metric"`** for a title row: **`HeaderRow`** with **`Lead`** (badge or icon) and **`Value`**, plus **`Description`** underneath.
- **Use** **`variant="panel"`** for a titled block: **`SectionHeader`** + **`Body`** (padded copy or tables) and/or **`Chart`** (full-width chart area, no inner padding).
- **Use** **`variant="stat-trend"`** for a large KPI with period delta: **`Label`**, **`Value`**, **`Delta`** (`trend`: `up` | `down` | `neutral`).
- **Use** **`variant="cta"`** for a call-to-action tile: **`Title`**, **`CtaBody`**, **`Actions`**.
- **Use** **`variant="list"`** for activity or alerts: **`ListHeader`**, **`List`** / **`ListItem`**.
- **Use** **`variant="split"`** for two related metrics: **`Split`** with two **`SplitCell`** blocks (often **`IconBox`** + **`Stack`** each).
- **Use** **`variant="cover"`** for media on top: **`Cover`**, then **`Stack`** and optional **`Actions`**.
- **Do not use** the whole card as the only focus target for navigation; prefer [LinkButton](../link-button/COMPONENT.md) or an inner control, unless you add explicit `role` / `tabIndex` and keyboard handling.
- **Do not use** decorative icons without **`aria-hidden`** when the text already conveys the meaning.

## Canonical example

Rich **`panel`**: section header with trailing control, padded intro in **`Body`**, and an edge-to-edge **`Chart`** region for a real chart root.

```tsx
import { Card, Icon, Typography } from "prime-ui-kit";

export function RevenuePanelCard() {
  return (
    <Card.Root variant="panel">
      <Card.SectionHeader>
        <Card.SectionTitle>Revenue</Card.SectionTitle>
        <Card.SectionTrailing>
          <Icon name="nav.layoutGrid" aria-hidden />
        </Card.SectionTrailing>
      </Card.SectionHeader>
      <Card.Body>
        <Typography.Root variant="body-small" tone="muted">
          Quarter-to-date summary; the chart mounts below with no horizontal or vertical padding inside
          Card.Chart.
        </Typography.Root>
      </Card.Body>
      <Card.Chart>
        <div id="revenue-chart" aria-hidden />
      </Card.Chart>
    </Card.Root>
  );
}
```

## Playground snippets

Live demos use these files (same order as the **Card** section in the playground):

| Scenario | Snippet | Notes |
|----------|---------|-------|
| Mini | [`mini.tsx`](../../../playground/snippets/card/mini.tsx) | `variant="mini"`: **`IconBox`** + **`Stack`** (**`Label`**, **`Value`**) |
| Mini + media | [`mini-media.tsx`](../../../playground/snippets/card/mini-media.tsx) | `variant="mini-media"`: same as mini + bottom **`Media`** |
| Metric | [`metric.tsx`](../../../playground/snippets/card/metric.tsx) | `variant="metric"`: **`HeaderRow`** (**`Lead`**, **`Value`**) + **`Description`** |
| Stat + trend | [`stat-trend.tsx`](../../../playground/snippets/card/stat-trend.tsx) | `variant="stat-trend"`: **`Value`** + **`Delta`** (`trend`) |
| CTA | [`cta.tsx`](../../../playground/snippets/card/cta.tsx) | `variant="cta"`: **`Title`**, **`CtaBody`**, **`Actions`** |
| List | [`list.tsx`](../../../playground/snippets/card/list.tsx) | `variant="list"`: **`ListHeader`**, **`List`** / **`ListItem`** |
| Split | [`split.tsx`](../../../playground/snippets/card/split.tsx) | `variant="split"`: **`Split`** with two **`SplitCell`** blocks |
| Cover | [`cover.tsx`](../../../playground/snippets/card/cover.tsx) | `variant="cover"`: **`Cover`**, **`Stack`**, **`Actions`** |
| Panel (chart only) | [`panel.tsx`](../../../playground/snippets/card/panel.tsx) | `variant="panel"`: **`SectionHeader`** + edge-to-edge **`Chart`** |
| Panel (body + chart) | [`panel-content-chart.tsx`](../../../playground/snippets/card/panel-content-chart.tsx) | same **`panel`**: **`Body`** + **`Chart`** |
| Flat surface | [`flat.tsx`](../../../playground/snippets/card/flat.tsx) | **`flat`** prop: shadow vs no shadow on **`mini`** |
| KPI grid | [`row.tsx`](../../../playground/snippets/card/row.tsx) | several mini cards in playground `introFeatureGrid` |

Supporting CSS modules in that folder: `flat.module.css`, `mini-media.module.css`, `variants-stack.module.css`.

## Extended examples

Copy-oriented scenarios (English copy, `prime-ui-kit` imports) live next to this file. For single-variant demos, see **Playground snippets** above.

| File | Scenario |
|------|----------|
| [examples/mini-kpi.tsx](./examples/mini-kpi.tsx) | **`mini`**: компактный KPI с иконкой |
| [examples/metric-dashboard.tsx](./examples/metric-dashboard.tsx) | KPI row: **`stat-trend`**, **`metric`**, **`mini-media`** |
| [examples/list-card.tsx](./examples/list-card.tsx) | Activity list with header link |
| [examples/media-mini.tsx](./examples/media-mini.tsx) | **`mini-media`**: sparkline and **`ProgressBar`** |
| [examples/split-layout.tsx](./examples/split-layout.tsx) | **`split`**: two metrics in one tile |
| [examples/cta-cover.tsx](./examples/cta-cover.tsx) | **`cta`** tile and **`cover`** with gradient banner |

## Composition

- **`Card.Root`** — required **`variant`**: `"mini"` \| `"mini-media"` \| `"metric"` \| `"panel"` \| `"stat-trend"` \| `"cta"` \| `"list"` \| `"split"` \| `"cover"`. Optional **`flat`** removes the default surface shadow. Sets `data-variant` / `data-flat` for styling.
- **`Card.IconBox`** — square leading area in **`mini`** and **`mini-media`**: background **`status-information-background`**, radius **`size-control-m-radius`**, icon color via **`status-information-foreground`** (decorative icons: **`aria-hidden`**).
- **`Card.Lead`** — left cluster in **`HeaderRow`** (badge from [Badge](../badge/COMPONENT.md), raw icon, or both).
- **`Card.HeaderRow`** — top row for **`metric`**: typically **`Lead`** + **`Value`**.
- **`Card.Stack`** — vertical block for **`Label`** + **`Value`** in **`mini`** and **`mini-media`**.
- **`Card.Label`** — secondary line (muted).
- **`Card.Value`** — primary metric string.
- **`Card.Description`** — supporting line under the header row (`p`).
- **`Card.Media`** — bottom region with top border; place charts or progress here.
- **`Card.SectionHeader`** — bar with bottom border for **`panel`**.
- **`Card.SectionTitle`** — `h3` title.
- **`Card.SectionTrailing`** — optional actions or icon on the right.
- **`Card.Body`** — **`panel`**: padded region for text, summaries, or tables. With **`variant="panel"`**, the shell has a **minimum height**; a **single element child** can stretch inside the padded box. Override height via **`className`** on **`Root`** if needed.
- **`Card.Chart`** — **`panel`**: **no** horizontal or vertical inner padding; mount the chart library root here for **edge-to-edge** drawing under the header. Optional after **`Body`**; then **`Chart`** fills remaining height.
- **`Card.Title`** — **`h3`** with **`title`** styles; use in **`cta`**, **`list`** header, **`cover`** stack.
- **`Card.Delta`** — supporting line for **`stat-trend`**; optional **`trend`** sets `data-trend` for color (`up` \| `down` \| `neutral`).
- **`Card.CtaBody`** — body copy in **`cta`**.
- **`Card.Actions`** — row of actions (border-top); use in **`cta`** and **`cover`**.
- **`Card.Cover`** — top media region for **`cover`** (image or decorative block; keep meaningful images described in text for a11y).
- **`Card.Split`** / **`Card.SplitCell`** — two-column grid for **`split`**.
- **`Card.ListHeader`** — top bar for **`list`** (border-bottom).
- **`Card.List`** / **`Card.ListItem`** — semantic **`ul`** / **`li`** for **`list`**.

## Rules

- Typography follows the **control `m` tier** (`--prime-sys-size-control-m-text` for values and section titles, `--prime-sys-size-control-m-supportText` for labels and descriptions), aligned with [Label](../label/COMPONENT.md) / [Input](../input/COMPONENT.md) defaults.
- Prefer **`flat`** on dense dashboards if shadows feel noisy; default shadow uses **`--prime-sys-elevation-shadow-surface`**.
- **`SectionTitle`** and **`Title`** are **`h3`**; match heading levels to the page outline.
- **`Description`** is a **`p`** — only one block per card unless you compose custom markup inside **`Body`** for **`panel`**.
- **`variant="panel"`** sets a **minimum height** on **`Root`**. Order after **`SectionHeader`**: optional **`Body`**, optional **`Chart`**. If both are present, **`Body`** sizes to its content and **`Chart`** takes the **remaining height**. A **single element child** in **`Chart`** (or in **`Body`** when it is the only block) stretches within that region.
- For **`mini-media`**, keep **`Media`** height predictable so grid rows align, or use one column on narrow viewports.
- Icons in **`IconBox`** / **`Lead`** should not be the sole carrier of meaning; pair with visible text.
- Decorative content in **`Cover`** should not rely on imagery alone for critical information — repeat key facts in **`Stack`**.
- **`List`** uses a real **`ul`**; keep **`ListItem`** text meaningful for screen readers.

## API

### Card.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| variant | `"mini" \| "mini-media" \| "metric" \| "panel" \| "stat-trend" \| "cta" \| "list" \| "split" \| "cover"` | — | Yes | Layout preset and padding. |
| flat | `boolean` | `false` | No | When `true`, no drop shadow (surface still bordered). |
| className | `string` | — | No | Extra class on the root. |
| children | `React.ReactNode` | — | No | Slots listed in Composition. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Native attributes on the root `div`. |

### Card.IconBox

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Icon node. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the wrapper `div`. |

### Card.Lead

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Badge, icon, or group. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the wrapper `div`. |

### Card.HeaderRow

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Typically `Lead` + `Value`. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the flex row. |

### Card.Stack

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | `Label` + `Value` for mini. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the stack `div`. |

### Card.Label

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Secondary label text. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Attributes on the `span`. |

### Card.Value

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Primary value. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Attributes on the `span`. |

### Card.Description

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Supporting copy. |
| …rest | `React.HTMLAttributes<HTMLParagraphElement>` | — | No | Attributes on the `p`. |

### Card.Media

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Chart, SVG, or progress. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the region `div`. |

### Card.Title

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Heading text (`h3`). |
| …rest | `React.HTMLAttributes<HTMLHeadingElement>` | — | No | Attributes on the `h3`. |

### Card.Delta

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| trend | `"up" \| "down" \| "neutral"` | — | No | Sets `data-trend` for color. |
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Delta / period copy. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Attributes on the `span`. |

### Card.CtaBody

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Supporting copy in **`cta`**. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the `div`. |

### Card.Actions

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Buttons / links row. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the `div`. |

### Card.Cover

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Image or media block (`cover` variant). |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the `div`. |

### Card.Split

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Typically two **`SplitCell`** children. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the grid `div`. |

### Card.SplitCell

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | One metric column: **`Label`** + **`Value`**, or **`IconBox`** + **`Stack`**. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the cell `div`. |

### Card.ListHeader

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Title row for **`list`**. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the `div`. |

### Card.List

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | **`ListItem`** nodes. |
| …rest | `React.HTMLAttributes<HTMLUListElement>` | — | No | Attributes on the `ul` (forwardRef). |

### Card.ListItem

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Row content. |
| …rest | `React.HTMLAttributes<HTMLLIElement>` | — | No | Attributes on the `li` (forwardRef). |

### Card.SectionHeader

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Title row content. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the header `div`. |

### Card.SectionTitle

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Heading text. |
| …rest | `React.HTMLAttributes<HTMLHeadingElement>` | — | No | Attributes on the `h3`. |

### Card.SectionTrailing

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Icons or actions. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the trailing `div`. |

### Card.Body

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Padded **`panel`** content (text, tables). One **element** child can stretch inside the padded area. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the body `div`. |

### Card.Chart

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | **`panel`** chart root; **no** inner padding (edge-to-edge). |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the chart region `div`. |

## Imports

```ts
import { Card } from "prime-ui-kit";
```

CSS for this component is included in the main bundle (`prime-ui-kit/styles.css` / `bundle.css`) when you import the library styles.
