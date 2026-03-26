# DashboardCard

**Проектирование по умолчанию:** для демо и экранов используйте **`variant`** и слоты как в примерах ниже; **`flat`** включайте, когда карточка должна визуально совпадать с плоским слоем страницы (без тени).

## About

Composable surfaces for **dashboard KPIs** and **chart shells**: four layout presets driven by **`variant`** on **`DashboardCard.Root`**. Typography and spacing use semantic tokens (`--prime-sys-*`). The kit does not ship chart primitives — pass any chart, SVG sparkline, or [ProgressBar](../progress-bar/COMPONENT.md) into **`DashboardCard.Media`**, **`DashboardCard.Chart`** (**`section`**, edge-to-edge), or padded **`DashboardCard.Body`**.

Design alignment (informative):

- **Material Design 3 — Cards:** elevated vs outlined containers; primary/secondary text hierarchy; optional media region ([m3.material.io/components/cards](https://m3.material.io/components/cards/guidelines)).
- **IBM Carbon — Tile:** flexible container, spacing from tokens, grouping on a grid; tiles stay on the base plane unless product needs elevation ([carbondesignsystem.com/components/tile](https://carbondesignsystem.com/components/tile/usage/)).
- **Carbon / IBM Patterns — dashboard cards:** metric + descriptor patterns are often built on tile-like bases ([IBM pattern references from Carbon tile page](https://carbondesignsystem.com/components/tile/usage/)).
- **Atlassian — composition:** complex surfaces are composed from primitives; this component follows the same idea (slots, not one mega-prop API) ([atlassian.design/get-started/develop/composition](https://atlassian.design/get-started/develop/composition)).
- **Responsive dashboards (prime-ui-kit):** use CSS Grid for KPI rows (`repeat(auto-fill, minmax(...))`) and this card for cell content — see [prime-ui skill spacing/grid](https://github.com/esurkov1/prime-ui/blob/main/SKILL/SKILL.md).

- **Use** **`variant="mini"`** for a compact KPI: optional **`IconBox`** + **`Stack`** with **`Label`** and **`Value`**.
- **Use** **`variant="metric"`** for a title row: **`HeaderRow`** with **`Lead`** (badge or icon) and **`Value`**, plus **`Description`** underneath.
- **Use** **`variant="metric-media"`** like metric, then **`Media`** for a sparkline, ring, or thin progress strip.
- **Use** **`variant="section"`** for a titled block: **`SectionHeader`** + **`Body`** (padded copy or tables) and/or **`Chart`** (full-width chart area, no inner padding).
- **Do not use** as the only focus target for navigation; wrap a [LinkButton](../link-button/COMPONENT.md) or make an inner control focusable instead of the whole card, unless you add explicit `role`/`tabIndex` and keyboard handling.
- **Do not use** decorative icons without **`aria-hidden`** when the text repeats the meaning.

## Composition

- **`DashboardCard.Root`** — required **`variant`**: `"mini"` \| `"metric"` \| `"metric-media"` \| `"section"`. Optional **`flat`** removes the default surface shadow (tile-like). Sets `data-variant` / `data-flat` for styling.
- **`DashboardCard.IconBox`** — square leading area in **`mini`**: background **`status-information-background`**, radius **`size-control-m-radius`**, icon color via **`status-information-foreground`** (decorative icons: **`aria-hidden`**).
- **`DashboardCard.Lead`** — left cluster in **`HeaderRow`** (badge from [Badge](../badge/COMPONENT.md), raw icon, or both).
- **`DashboardCard.HeaderRow`** — top row for **`metric`** / **`metric-media`**: typically **`Lead`** + **`Value`**.
- **`DashboardCard.Stack`** — vertical block for **`Label`** + **`Value`** in **`mini`**.
- **`DashboardCard.Label`** — secondary line (muted).
- **`DashboardCard.Value`** — primary metric string.
- **`DashboardCard.Description`** — supporting line under the header row (`p`).
- **`DashboardCard.Media`** — bottom region with top border; place charts/progress here.
- **`DashboardCard.SectionHeader`** — bar with bottom border for **`section`**.
- **`DashboardCard.SectionTitle`** — `h3` title.
- **`DashboardCard.SectionTrailing`** — optional actions or icon on the right.
- **`DashboardCard.Body`** — **`section`**: padded region for text, summaries, or tables. With **`variant="section"`**, the shell has a **minimum height**; a **single element child** can stretch inside the padded box. Override height via **`className`** on **`Root`** if needed.
- **`DashboardCard.Chart`** — **`section`**: **no** horizontal or vertical inner padding; mount the chart library root here for **edge-to-edge** drawing under the header. Optional after **`Body`**; then **`Chart`** fills remaining height.

### Mini example

```tsx
import { DashboardCard } from "prime-ui-kit";

export function MiniKpi() {
  return (
    <DashboardCard.Root variant="mini">
      <DashboardCard.IconBox aria-hidden>…</DashboardCard.IconBox>
      <DashboardCard.Stack>
        <DashboardCard.Label>Age</DashboardCard.Label>
        <DashboardCard.Value>36 years</DashboardCard.Value>
      </DashboardCard.Stack>
    </DashboardCard.Root>
  );
}
```

### Metric example

```tsx
import { Badge } from "prime-ui-kit";
import { DashboardCard } from "prime-ui-kit";

export function MetricCard() {
  return (
    <DashboardCard.Root variant="metric">
      <DashboardCard.HeaderRow>
        <DashboardCard.Lead>
          <Badge.Root color="blue" variant="filled" size="s">
            CRP
          </Badge.Root>
        </DashboardCard.Lead>
        <DashboardCard.Value>1.8 mg/L</DashboardCard.Value>
      </DashboardCard.HeaderRow>
      <DashboardCard.Description>Slightly elevated</DashboardCard.Description>
    </DashboardCard.Root>
  );
}
```

### Section example (chart only)

```tsx
import { DashboardCard } from "prime-ui-kit";

export function ChartSection() {
  return (
    <DashboardCard.Root variant="section">
      <DashboardCard.SectionHeader>
        <DashboardCard.SectionTitle>Revenue</DashboardCard.SectionTitle>
      </DashboardCard.SectionHeader>
      <DashboardCard.Chart>
        <div id="revenue-chart" />
      </DashboardCard.Chart>
    </DashboardCard.Root>
  );
}
```

### Section example (padded content + chart)

```tsx
import { DashboardCard } from "prime-ui-kit";

export function ChartSectionWithIntro() {
  return (
    <DashboardCard.Root variant="section">
      <DashboardCard.SectionHeader>
        <DashboardCard.SectionTitle>Revenue</DashboardCard.SectionTitle>
      </DashboardCard.SectionHeader>
      <DashboardCard.Body>
        <p>Short summary or filters.</p>
      </DashboardCard.Body>
      <DashboardCard.Chart>
        <div id="revenue-chart" />
      </DashboardCard.Chart>
    </DashboardCard.Root>
  );
}
```

## Rules

- Typography follows the **control `m` tier** (`--prime-sys-size-control-m-text` for values and section titles, `--prime-sys-size-control-m-supportText` for labels and descriptions), aligned with [Label](../label/COMPONENT.md) / [Input](../input/COMPONENT.md) defaults — not reading `headingSection` / `headingSubsection` roles, so KPI copy stays visually consistent with form density.
- Prefer **`flat`** on dense dashboards if shadows feel noisy; default shadow uses **`--prime-sys-elevation-shadow-surface`**.
- **`SectionTitle`** is an **`h3`**; ensure heading levels match the page outline (skip levels appropriately).
- **`Description`** is a **`p`** — only one block per card unless you compose custom markup inside **`Body`** for **`section`**.
- **`variant="section"`** sets a **minimum height** on **`Root`**. Order after **`SectionHeader`**: optional **`Body`** (inset content), optional **`Chart`** (full bleed). If both are present, **`Body`** sizes to its content and **`Chart`** takes the **remaining height**. A **single element child** in **`Chart`** (or in **`Body`** when it is the only block) stretches within that region.
- For **`metric-media`**, keep **`Media`** height predictable so rows in a grid stay aligned, or use one column on narrow viewports.
- Icons in **`IconBox`** / **`Lead`** should not be the sole carrier of meaning; pair with visible text.

## API

### DashboardCard.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| variant | `"mini" \| "metric" \| "metric-media" \| "section"` | — | Yes | Layout preset and padding. |
| flat | `boolean` | `false` | No | When `true`, no drop shadow (surface still bordered). |
| className | `string` | — | No | Extra class on the root. |
| children | `React.ReactNode` | — | No | Slots listed in Composition. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Native attributes on the root `div`. |

### DashboardCard.IconBox

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Icon node. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the wrapper `div`. |

### DashboardCard.Lead

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Badge, icon, or group. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the wrapper `div`. |

### DashboardCard.HeaderRow

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Typically `Lead` + `Value`. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the flex row. |

### DashboardCard.Stack

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | `Label` + `Value` for mini. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the stack `div`. |

### DashboardCard.Label

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Secondary label text. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Attributes on the `span`. |

### DashboardCard.Value

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Primary value. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Attributes on the `span`. |

### DashboardCard.Description

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Supporting copy. |
| …rest | `React.HTMLAttributes<HTMLParagraphElement>` | — | No | Attributes on the `p`. |

### DashboardCard.Media

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Chart, SVG, or progress. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the region `div`. |

### DashboardCard.SectionHeader

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Title row content. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the header `div`. |

### DashboardCard.SectionTitle

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Heading text. |
| …rest | `React.HTMLAttributes<HTMLHeadingElement>` | — | No | Attributes on the `h3`. |

### DashboardCard.SectionTrailing

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Icons or actions. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the trailing `div`. |

### DashboardCard.Body

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Padded **`section`** content (text, tables). One **element** child can stretch inside the padded area. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the body `div`. |

### DashboardCard.Chart

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | **`section`** chart root; **no** inner padding (edge-to-edge). |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the chart region `div`. |

## Imports

```ts
import { DashboardCard } from "prime-ui-kit";
```

CSS for this component is included in the main bundle (`prime-ui-kit/styles.css` / `bundle.css`) when you import the library styles.
