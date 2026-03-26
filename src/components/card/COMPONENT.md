# Card

**Проектирование по умолчанию:** для демо и экранов используйте **`variant`** и слоты как в примерах ниже; **`flat`** включайте, когда карточка должна визуально совпадать с плоским слоем страницы (без тени).

## About

Composable surfaces for **dashboard KPIs**, **lists**, **CTA tiles**, **split metrics**, **media headers**, and **chart shells**: layout presets driven by **`variant`** on **`Card.Root`**. Typography and spacing use semantic tokens (`--prime-sys-*`). The kit does not ship chart primitives — pass any chart, SVG sparkline, or [ProgressBar](../progress-bar/COMPONENT.md) into **`Card.Media`**, **`Card.Chart`** (**`panel`**, edge-to-edge), padded **`Card.Body`**, or **`Card.Cover`**.

**Ссылки на паттерны карточек и дашбордов (для ориентира по типам плиток):**

1. [Material Design 3 — Cards (guidelines)](https://m3.material.io/components/cards/guidelines)
2. [IBM Carbon — Tile (usage)](https://carbondesignsystem.com/components/tile/usage/)
3. [Ant Design — Card](https://ant.design/components/card)
4. [Shopify Polaris — Legacy Card](https://polaris.shopify.com/components/layout-and-structure/legacy-card)
5. [shadcn/ui — Card](https://ui.shadcn.com/docs/components/card)
6. [Atlassian Design — Composition](https://atlassian.design/get-started/develop/composition)
7. [PatternFly — Card](https://www.patternfly.org/components/card/)
8. [GOV.UK Design System — Card](https://design-system.service.gov.uk/components/card/)
9. [Nielsen Norman Group — Dashboard Design](https://www.nngroup.com/articles/dashboard-design/)
10. [GitHub Primer — Card](https://primer.style/product/components/card/)

**Кратко по смыслу:** MD3 и большинство дизайн-систем описывают карточку как контейнер с заголовком, опциональным медиа и действиями; Carbon использует **tile** для группировки на сетке; в дашбордах часто выделяют KPI, списки активности, CTA и сравнение метрик — см. NN/g про структуру дашборда. **Responsive dashboards (prime-ui-kit):** CSS Grid для рядов KPI (`repeat(auto-fill, minmax(...))`) — [prime-ui skill](https://github.com/esurkov1/prime-ui/blob/main/SKILL/SKILL.md).

- **Use** **`variant="mini"`** for a compact KPI: optional **`IconBox`** + **`Stack`** with **`Label`** and **`Value`**.
- **Use** **`variant="mini-media"`** for the same **`IconBox`** + **`Stack`** row as **`mini`**, then **`Media`** for a sparkline, ring, or thin progress strip (full width below).
- **Use** **`variant="metric"`** for a title row: **`HeaderRow`** with **`Lead`** (badge or icon) and **`Value`**, plus **`Description`** underneath.
- **Use** **`variant="panel"`** for a titled block: **`SectionHeader`** + **`Body`** (padded copy or tables) and/or **`Chart`** (full-width chart area, no inner padding).
- **Use** **`variant="stat-trend"`** for a large KPI with period delta: **`Label`**, **`Value`**, **`Delta`** (`trend`: `up` | `down` | `neutral`).
- **Use** **`variant="cta"`** for a call-to-action tile: **`Title`**, **`CtaBody`**, **`Actions`** (buttons / links).
- **Use** **`variant="list"`** for activity or alerts: **`ListHeader`** (e.g. **`Title`** + link), **`List`** / **`ListItem`**.
- **Use** **`variant="split"`** for two related metrics: **`Split`** with two **`SplitCell`** blocks (typically **`Label`** + **`Value`** each).
- **Use** **`variant="cover"`** for media on top: **`Cover`** (image or block), then **`Stack`** and optional **`Actions`**.
- **Do not use** as the only focus target for navigation; wrap a [LinkButton](../link-button/COMPONENT.md) or make an inner control focusable instead of the whole card, unless you add explicit `role`/`tabIndex` and keyboard handling.
- **Do not use** decorative icons without **`aria-hidden`** when the text repeats the meaning.

## Composition

- **`Card.Root`** — required **`variant`**: `"mini"` \| `"mini-media"` \| `"metric"` \| `"panel"` \| `"stat-trend"` \| `"cta"` \| `"list"` \| `"split"` \| `"cover"`. Optional **`flat`** removes the default surface shadow (tile-like). Sets `data-variant` / `data-flat` for styling.
- **`Card.IconBox`** — square leading area in **`mini`** and **`mini-media`**: background **`status-information-background`**, radius **`size-control-m-radius`**, icon color via **`status-information-foreground`** (decorative icons: **`aria-hidden`**).
- **`Card.Lead`** — left cluster in **`HeaderRow`** (badge from [Badge](../badge/COMPONENT.md), raw icon, or both).
- **`Card.HeaderRow`** — top row for **`metric`**: typically **`Lead`** + **`Value`**.
- **`Card.Stack`** — vertical block for **`Label`** + **`Value`** in **`mini`** and **`mini-media`**.
- **`Card.Label`** — secondary line (muted).
- **`Card.Value`** — primary metric string.
- **`Card.Description`** — supporting line under the header row (`p`).
- **`Card.Media`** — bottom region with top border; place charts/progress here.
- **`Card.SectionHeader`** — bar with bottom border for **`panel`**.
- **`Card.SectionTitle`** — `h3` title.
- **`Card.SectionTrailing`** — optional actions or icon on the right.
- **`Card.Body`** — **`panel`**: padded region for text, summaries, or tables. With **`variant="panel"`**, the shell has a **minimum height**; a **single element child** can stretch inside the padded box. Override height via **`className`** on **`Root`** if needed.
- **`Card.Chart`** — **`panel`**: **no** horizontal or vertical inner padding; mount the chart library root here for **edge-to-edge** drawing under the header. Optional after **`Body`**; then **`Chart`** fills remaining height.
- **`Card.Title`** — **`h3`** with **`title`** styles; use in **`cta`**, **`list`** header, **`cover`** stack.
- **`Card.Delta`** — supporting line for **`stat-trend`**; optional **`trend`** sets `data-trend` for color (`up` \| `down` \| `neutral`).
- **`Card.CtaBody`** — body copy in **`cta`**.
- **`Card.Actions`** — row of actions (border-top); use in **`cta`** and **`cover`**.
- **`Card.Cover`** — top media region for **`cover`** (image or decorative block; keep meaningful images described elsewhere for a11y).
- **`Card.Split`** / **`Card.SplitCell`** — two-column grid for **`split`**.
- **`Card.ListHeader`** — top bar for **`list`** (border-bottom).
- **`Card.List`** / **`Card.ListItem`** — semantic **`ul`** / **`li`** for **`list`**.

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

### Panel example (chart only)

```tsx
import { Card } from "prime-ui-kit";

export function ChartSection() {
  return (
    <Card.Root variant="panel">
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

### Panel example (padded content + chart)

```tsx
import { Card } from "prime-ui-kit";

export function ChartSectionWithIntro() {
  return (
    <Card.Root variant="panel">
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

### Stat + trend example

```tsx
import { Card } from "prime-ui-kit";

export function StatTrendCard() {
  return (
    <Card.Root variant="stat-trend">
      <Card.Label>Revenue (30d)</Card.Label>
      <Card.Value>$420k</Card.Value>
      <Card.Delta trend="up">+18% vs prior month</Card.Delta>
    </Card.Root>
  );
}
```

### CTA example

```tsx
import { Button, Card, LinkButton } from "prime-ui-kit";

export function CtaCard() {
  return (
    <Card.Root variant="cta">
      <Card.Title>Export report</Card.Title>
      <Card.CtaBody>Download a CSV for the selected period.</Card.CtaBody>
      <Card.Actions>
        <LinkButton.Root href="#">Download</LinkButton.Root>
        <Button.Root mode="ghost" type="button" variant="neutral">
          Cancel
        </Button.Root>
      </Card.Actions>
    </Card.Root>
  );
}
```

### List example

```tsx
import { Card } from "prime-ui-kit";
import { LinkButton } from "prime-ui-kit";

export function ListCard() {
  return (
    <Card.Root variant="list">
      <Card.ListHeader>
        <Card.Title>Recent activity</Card.Title>
        <LinkButton.Root href="#">View all</LinkButton.Root>
      </Card.ListHeader>
      <Card.List>
        <Card.ListItem>Payment received</Card.ListItem>
        <Card.ListItem>New comment on ticket #12</Card.ListItem>
      </Card.List>
    </Card.Root>
  );
}
```

### Split example

```tsx
import { Card } from "prime-ui-kit";

export function SplitCard() {
  return (
    <Card.Root variant="split">
      <Card.Split>
        <Card.SplitCell>
          <Card.Label>Conversion</Card.Label>
          <Card.Value>3.8%</Card.Value>
        </Card.SplitCell>
        <Card.SplitCell>
          <Card.Label>AOV</Card.Label>
          <Card.Value>$64</Card.Value>
        </Card.SplitCell>
      </Card.Split>
    </Card.Root>
  );
}
```

### Cover example

```tsx
import { Card } from "prime-ui-kit";

export function CoverCard() {
  return (
    <Card.Root variant="cover">
      <Card.Cover>
        <img alt="" src="/hero.jpg" />
      </Card.Cover>
      <Card.Stack>
        <Card.Title>Campaign</Card.Title>
        <Card.Label>Last 7 days</Card.Label>
        <Card.Description>Compared to control.</Card.Description>
      </Card.Stack>
    </Card.Root>
  );
}
```

## Rules

- Typography follows the **control `m` tier** (`--prime-sys-size-control-m-text` for values and section titles, `--prime-sys-size-control-m-supportText` for labels and descriptions), aligned with [Label](../label/COMPONENT.md) / [Input](../input/COMPONENT.md) defaults — not reading `headingSection` / `headingSubsection` roles, so KPI copy stays visually consistent with form density.
- Prefer **`flat`** on dense dashboards if shadows feel noisy; default shadow uses **`--prime-sys-elevation-shadow-surface`**.
- **`SectionTitle`** is an **`h3`**; ensure heading levels match the page outline (skip levels appropriately).
- **`Description`** is a **`p`** — only one block per card unless you compose custom markup inside **`Body`** for **`panel`**.
- **`variant="panel"`** sets a **minimum height** on **`Root`**. Order after **`SectionHeader`**: optional **`Body`** (inset content), optional **`Chart`** (full bleed). If both are present, **`Body`** sizes to its content and **`Chart`** takes the **remaining height**. A **single element child** in **`Chart`** (or in **`Body`** when it is the only block) stretches within that region.
- For **`mini-media`**, keep **`Media`** height predictable so rows in a grid stay aligned, or use one column on narrow viewports.
- Icons in **`IconBox`** / **`Lead`** should not be the sole carrier of meaning; pair with visible text.
- **`Title`** is an **`h3`** (like **`SectionTitle`**); avoid duplicate heading levels on the same screen.
- Decorative content in **`Cover`** should not rely on **`img alt`** alone for critical information — repeat key facts in **`Stack`**.
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
| children | `React.ReactNode` | — | No | One metric column. |
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
