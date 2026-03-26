# Card

**Проектирование по умолчанию:** для демо и экранов используйте **`variant`** и слоты как в примерах ниже; **`flat`** включайте, когда карточка должна визуально совпадать с плоским слоем страницы (без тени).

## About

Composable surfaces for **dashboard KPIs** and **chart shells**: four layout presets driven by **`variant`** on **`Card.Root`**. Typography and spacing use semantic tokens (`--prime-sys-*`). The kit does not ship chart primitives — pass any chart, SVG sparkline, or [ProgressBar](../progress-bar/COMPONENT.md) into **`Card.Media`**, **`Card.Chart`** (**`section`**, edge-to-edge), or padded **`Card.Body`**.

Design alignment (informative):

- **Material Design 3 — Cards:** elevated vs outlined containers; primary/secondary text hierarchy; optional media region ([m3.material.io/components/cards](https://m3.material.io/components/cards/guidelines)).
- **IBM Carbon — Tile:** flexible container, spacing from tokens, grouping on a grid; tiles stay on the base plane unless product needs elevation ([carbondesignsystem.com/components/tile](https://carbondesignsystem.com/components/tile/usage/)).
- **Carbon / IBM Patterns — dashboard cards:** metric + descriptor patterns are often built on tile-like bases ([IBM pattern references from Carbon tile page](https://carbondesignsystem.com/components/tile/usage/)).
- **Atlassian — composition:** complex surfaces are composed from primitives; this component follows the same idea (slots, not one mega-prop API) ([atlassian.design/get-started/develop/composition](https://atlassian.design/get-started/develop/composition)).
- **Responsive dashboards (prime-ui-kit):** use CSS Grid for KPI rows (`repeat(auto-fill, minmax(...))`) and this card for cell content — see [prime-ui skill spacing/grid](https://github.com/esurkov1/prime-ui/blob/main/SKILL/SKILL.md).

- **Use** **`variant="mini"`** for a compact KPI: optional **`IconBox`** + **`Stack`** with **`Label`** and **`Value`**.
- **Use** **`variant="mini-media"`** for the same **`IconBox`** + **`Stack`** row as **`mini`**, then **`Media`** for a sparkline, ring, or thin progress strip (full width below).
- **Use** **`variant="metric"`** for a title row: **`HeaderRow`** with **`Lead`** (badge or icon) and **`Value`**, plus **`Description`** underneath.
- **Use** **`variant="section"`** for a titled block: **`SectionHeader`** + **`Body`** (padded copy or tables) and/or **`Chart`** (full-width chart area, no inner padding).
- **Do not use** as the only focus target for navigation; wrap a [LinkButton](../link-button/COMPONENT.md) or make an inner control focusable instead of the whole card, unless you add explicit `role`/`tabIndex` and keyboard handling.
- **Do not use** decorative icons without **`aria-hidden`** when the text repeats the meaning.

## Composition

- **`Card.Root`** — required **`variant`**: `"mini"` \| `"mini-media"` \| `"metric"` \| `"section"`. Optional **`flat`** removes the default surface shadow (tile-like). Sets `data-variant` / `data-flat` for styling.
- **`Card.IconBox`** — square leading area in **`mini`** and **`mini-media`**: background **`status-information-background`**, radius **`size-control-m-radius`**, icon color via **`status-information-foreground`** (decorative icons: **`aria-hidden`**).
- **`Card.Lead`** — left cluster in **`HeaderRow`** (badge from [Badge](../badge/COMPONENT.md), raw icon, or both).
- **`Card.HeaderRow`** — top row for **`metric`**: typically **`Lead`** + **`Value`**.
- **`Card.Stack`** — vertical block for **`Label`** + **`Value`** in **`mini`** and **`mini-media`**.
- **`Card.Label`** — secondary line (muted).
- **`Card.Value`** — primary metric string.
- **`Card.Description`** — supporting line under the header row (`p`).
- **`Card.Media`** — bottom region with top border; place charts/progress here.
- **`Card.SectionHeader`** — bar with bottom border for **`section`**.
- **`Card.SectionTitle`** — `h3` title.
- **`Card.SectionTrailing`** — optional actions or icon on the right.
- **`Card.Body`** — **`section`**: padded region for text, summaries, or tables. With **`variant="section"`**, the shell has a **minimum height**; a **single element child** can stretch inside the padded box. Override height via **`className`** on **`Root`** if needed.
- **`Card.Chart`** — **`section`**: **no** horizontal or vertical inner padding; mount the chart library root here for **edge-to-edge** drawing under the header. Optional after **`Body`**; then **`Chart`** fills remaining height.

### Mini example

```tsx
import { Card } from "prime-ui-kit";

export function MiniKpi() {
  return (
    <Card.Root variant="mini">
      <Card.IconBox aria-hidden>…</Card.IconBox>
      <Card.Stack>
        <Card.Label>Age</Card.Label>
        <Card.Value>36 years</Card.Value>
      </Card.Stack>
    </Card.Root>
  );
}
```

### Mini + media example

```tsx
import { Card } from "prime-ui-kit";

export function MiniKpiWithSparkline() {
  return (
    <Card.Root variant="mini-media">
      <Card.IconBox aria-hidden>…</Card.IconBox>
      <Card.Stack>
        <Card.Label>Glucose</Card.Label>
        <Card.Value>5.4 mmol/L</Card.Value>
      </Card.Stack>
      <Card.Media>
        <svg aria-hidden viewBox="0 0 120 40" />
      </Card.Media>
    </Card.Root>
  );
}
```

### Metric example

```tsx
import { Badge } from "prime-ui-kit";
import { Card } from "prime-ui-kit";

export function MetricCard() {
  return (
    <Card.Root variant="metric">
      <Card.HeaderRow>
        <Card.Lead>
          <Badge.Root color="blue" variant="filled" size="s">
            CRP
          </Badge.Root>
        </Card.Lead>
        <Card.Value>1.8 mg/L</Card.Value>
      </Card.HeaderRow>
      <Card.Description>Slightly elevated</Card.Description>
    </Card.Root>
  );
}
```

### Section example (chart only)

```tsx
import { Card } from "prime-ui-kit";

export function ChartSection() {
  return (
    <Card.Root variant="section">
      <Card.SectionHeader>
        <Card.SectionTitle>Revenue</Card.SectionTitle>
      </Card.SectionHeader>
      <Card.Chart>
        <div id="revenue-chart" />
      </Card.Chart>
    </Card.Root>
  );
}
```

### Section example (padded content + chart)

```tsx
import { Card } from "prime-ui-kit";

export function ChartSectionWithIntro() {
  return (
    <Card.Root variant="section">
      <Card.SectionHeader>
        <Card.SectionTitle>Revenue</Card.SectionTitle>
      </Card.SectionHeader>
      <Card.Body>
        <p>Short summary or filters.</p>
      </Card.Body>
      <Card.Chart>
        <div id="revenue-chart" />
      </Card.Chart>
    </Card.Root>
  );
}
```

## Rules

- Typography follows the **control `m` tier** (`--prime-sys-size-control-m-text` for values and section titles, `--prime-sys-size-control-m-supportText` for labels and descriptions), aligned with [Label](../label/COMPONENT.md) / [Input](../input/COMPONENT.md) defaults — not reading `headingSection` / `headingSubsection` roles, so KPI copy stays visually consistent with form density.
- Prefer **`flat`** on dense dashboards if shadows feel noisy; default shadow uses **`--prime-sys-elevation-shadow-surface`**.
- **`SectionTitle`** is an **`h3`**; ensure heading levels match the page outline (skip levels appropriately).
- **`Description`** is a **`p`** — only one block per card unless you compose custom markup inside **`Body`** for **`section`**.
- **`variant="section"`** sets a **minimum height** on **`Root`**. Order after **`SectionHeader`**: optional **`Body`** (inset content), optional **`Chart`** (full bleed). If both are present, **`Body`** sizes to its content and **`Chart`** takes the **remaining height**. A **single element child** in **`Chart`** (or in **`Body`** when it is the only block) stretches within that region.
- For **`mini-media`**, keep **`Media`** height predictable so rows in a grid stay aligned, or use one column on narrow viewports.
- Icons in **`IconBox`** / **`Lead`** should not be the sole carrier of meaning; pair with visible text.

## API

### Card.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| variant | `"mini" \| "mini-media" \| "metric" \| "section"` | — | Yes | Layout preset and padding. |
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
| children | `React.ReactNode` | — | No | Padded **`section`** content (text, tables). One **element** child can stretch inside the padded area. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the body `div`. |

### Card.Chart

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | **`section`** chart root; **no** inner padding (edge-to-edge). |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the chart region `div`. |

## Imports

```ts
import { Card } from "prime-ui-kit";
```

CSS for this component is included in the main bundle (`prime-ui-kit/styles.css` / `bundle.css`) when you import the library styles.
