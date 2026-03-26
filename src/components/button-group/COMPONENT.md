# ButtonGroup

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A composite control made of several button-like segments inside one outline: shared size, shared borders, and rounded corners only on the outer corners.

## When to use it

- **Analytics and reports** — switch aggregation interval (day / week / month) as one visual block without a dropdown.
- **Editors and toolbars** — group formatting or view (icons and labels) so tools read as a single block.
- **Billing and plans** — pick a plan in a card row: segments span the column width with a clear “selected” state.

## Use cases

The scenarios below differ by screen and API shape; do not duplicate the same pattern with different labels only.

### Basic

Catalog filter: three mutually exclusive options “All / In stock / On order” — the user sees the group as one control.

```tsx
import { ButtonGroup } from "prime-ui-kit";

export function StockFilterStrip() {
  return (
    <ButtonGroup.Root aria-label="Product availability" size="m">
      <ButtonGroup.Item type="button">All</ButtonGroup.Item>
      <ButtonGroup.Item pressed type="button">
        In stock
      </ButtonGroup.Item>
      <ButtonGroup.Item type="button">On order</ButtonGroup.Item>
    </ButtonGroup.Root>
  );
}
```

### Variants and sizes

Compact panel on mobile and spacious on desktop: only `size` changes; plus a vertical stack for a narrow settings column.

```tsx
import { ButtonGroup } from "prime-ui-kit";

export function DensityPreview() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
      <ButtonGroup.Root aria-label="Sort, size s" size="s">
        <ButtonGroup.Item pressed type="button">
          By date
        </ButtonGroup.Item>
        <ButtonGroup.Item type="button">By price</ButtonGroup.Item>
        <ButtonGroup.Item type="button">By rating</ButtonGroup.Item>
      </ButtonGroup.Root>
      <ButtonGroup.Root aria-label="Task priority, vertical" orientation="vertical" size="l">
        <ButtonGroup.Item pressed type="button">
          Urgent
        </ButtonGroup.Item>
        <ButtonGroup.Item type="button">Normal</ButtonGroup.Item>
        <ButtonGroup.Item type="button">Low</ButtonGroup.Item>
      </ButtonGroup.Root>
    </div>
  );
}
```

### In context (form / modal / sidebar / …)

Short search form: segments submit and reset the form with native button types.

```tsx
import { ButtonGroup } from "prime-ui-kit";

export function SearchMiniForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320 }}
    >
      <label htmlFor="q">Query</label>
      <input id="q" name="q" type="search" />
      <ButtonGroup.Root aria-label="Search actions" size="m">
        <ButtonGroup.Item type="submit">Search</ButtonGroup.Item>
        <ButtonGroup.Item type="reset">Reset</ButtonGroup.Item>
      </ButtonGroup.Root>
    </form>
  );
}
```

### Controlled mode

Documentation section tabs: parent holds the section key; active segment has `pressed`.

```tsx
import * as React from "react";
import { ButtonGroup } from "prime-ui-kit";

type SectionKey = "overview" | "api" | "examples";

export function DocsSectionSwitch() {
  const [section, setSection] = React.useState<SectionKey>("overview");

  return (
    <ButtonGroup.Root aria-label="Help section" size="m">
      <ButtonGroup.Item pressed={section === "overview"} type="button" onClick={() => setSection("overview")}>
        Overview
      </ButtonGroup.Item>
      <ButtonGroup.Item pressed={section === "api"} type="button" onClick={() => setSection("api")}>
        API
      </ButtonGroup.Item>
      <ButtonGroup.Item
        pressed={section === "examples"}
        type="button"
        onClick={() => setSection("examples")}
      >
        Examples
      </ButtonGroup.Item>
    </ButtonGroup.Root>
  );
}
```

## Anatomy

- **`ButtonGroup.Root`** — `div` with `data-size`, and with vertical layout `data-orientation="vertical"`; wraps **`ButtonGroupProvider`**, **`ControlSizeProvider`** (nested controls inherit size).
- **`ButtonGroup.Item`** — native **`button`** with segment class; must be used inside the root (context).
- **`ButtonGroup.Icon`** — **`span`** with `aria-hidden` for SVG inside a segment.

Public API: **`ButtonGroup`** object with **`Root`**, **`Item`**, **`Icon`**.

## API

### ButtonGroup.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| orientation | `"horizontal" \| "vertical"` | `"horizontal"` | no | Flex direction for segments. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | no | Height, radius, type size, and icon size from one token tier for the group. |
| children | `React.ReactNode` | — | yes | Group content (usually several `Item`). |
| className | `string` | — | no | Extra class on the root. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | no | Other wrapper attributes (`aria-label`, `role`, handlers, etc.). |

### ButtonGroup.Item

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| pressed | `boolean` | — | no | Selected segment: `data-state="on"`; with a boolean — `aria-pressed`. |
| type | `"button" \| "submit" \| "reset"` | `"button"` | no | Behavior inside a form. |
| disabled | `boolean` | — | no | Blocks click and inactive styling. |
| children | `React.ReactNode` | — | no | Text, `Icon`, etc. |
| className | `string` | — | no | Extra class on the segment. |
| …rest | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | no | Other button attributes. |

### ButtonGroup.Icon

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | Usually an icon (SVG). |
| className | `string` | — | no | Extra class on the wrapper. |
| …rest | `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">` | — | no | Other `span` attributes. |

## Variants

There is no separate `variant` prop: the group has one visual style — “segments with a shared border”. Differences come from **`size`**, **`orientation`**, **`pressed`**, and **`disabled`** on items.

## States

- **Default segment** — no `pressed` and no `disabled`.
- **Selected** — `pressed={true}`: background and text color like active; `aria-pressed="true"`.
- **Unselected with explicit boolean** — `pressed={false}`: `aria-pressed="false"`.
- **Disabled** — `disabled`: `not-allowed` cursor, reduced opacity, hover does not change background.

## Accessibility (a11y)

- On **`Root`**, set **`aria-label`** (or **`aria-labelledby`** if a visible heading is nearby) so the group is announced as one switcher or action set.
- For icon-only segments, use **`aria-label`** on **`Item`**; **`ButtonGroup.Icon`** is **`aria-hidden`**, with no duplicate text inside the icon.
- When used as a single-value switcher, keep **`pressed`** in sync with logic and avoid multiple `pressed` segments unless intentional.

## Limitations and notes

- No **`asChild`**: a segment always renders as **`<button>`**.
- No built-in **`fullWidth`**: stretch via **`className`** on the root (e.g. container width) and **`flex-1`** / **`min-w-0`** on items.
- Mutually exclusive choice across segments is implemented by the parent (state + **`onClick`**); the component does not manage its own “radio group”.
- **`Item`** outside **`Root`** will throw a context error.

## Related components

- **`Button`** — single action with fill variants and loading state; not a replacement for a segmented group.
- **`SegmentedControl`** — when you need a switcher pattern with different kit API and markup.
- **`Radio`** or native **`radio`** — when “one of N” form semantics and field submission matter.
