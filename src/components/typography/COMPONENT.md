# Typography

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A set of styles for a paragraph, line, or text block with a fixed size scale and optional axes: weight, tracking, italic, and muted color.

## What it’s for

- **Public site and marketing** — consistent large accents and captions on landing pages without manually picking font size and line height.
- **Account area and operational screens** — secondary explanations (`tone="muted"`), small legal copy (`2xs`), and accents inside order cards or notifications.
- **Editorial or educational content** — aligned typography for body text with room for emphasis and links without breaking vertical rhythm.

## Use cases

### Basic

Main paragraph of an article or section description with a required `m` size.

```tsx
import { Typography } from "prime-ui-kit";

export function ArticleLead() {
  return (
    <Typography.Root size="m">
      We updated delivery rules: you now pick the time window in the cart before payment.
    </Typography.Root>
  );
}
```

### Variants and sizes

Metrics panel on a dashboard: a large number and a caption with different weight and tone.

```tsx
import { Typography } from "prime-ui-kit";

export function MetricTile() {
  return (
    <div>
      <Typography.Root size="4xl" weight="semibold" tracking="tight">
        94 %
      </Typography.Root>
      <Typography.Root size="s" tone="muted">
        Share of successful syncs in the last 24 hours
      </Typography.Root>
    </div>
  );
}
```

### In context (order card)

Composite paragraph: nested `Typography.Root` for amount and status, a plain link for the action.

```tsx
import { Typography } from "prime-ui-kit";

export function OrderSummary() {
  return (
    <Typography.Root size="m" as="div">
      Order #9012:{" "}
      <Typography.Root as="span" size="m" weight="semibold">
        in transit
      </Typography.Root>
      . Total{" "}
      <Typography.Root as="span" size="m" weight="medium" tracking="tight">
        4,250 ₽
      </Typography.Root>
      .{" "}
      <a href="/orders/9012" style={{ color: "inherit" }}>
        View details
      </a>
    </Typography.Root>
  );
}
```

### Controlled mode

Not applicable: `Typography.Root` has no internal state or style-change events; all options are set via props at render time.

## Anatomy

Flat API: a single subcomponent `Typography.Root` that renders a native `p`, `span`, or `div` element (`as` prop, default `p`).

## API

### Typography.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| as | `"p" \| "span" \| "div"` | `"p"` | No | Wrapper tag |
| size | `"2xs" \| "xs" \| "s" \| "m" \| "l" \| "xl" \| "2xl" \| "3xl" \| "4xl" \| "5xl" \| "6xl"` | — | Yes | Font size and line-height scale |
| weight | `"regular" \| "medium" \| "semibold"` | `"regular"` | No | Font weight |
| tracking | `"normal" \| "tight" \| "tighter" \| "wide"` | `"normal"` | No | Letter spacing |
| italic | `boolean` | `false` | No | Italic |
| tone | `"default" \| "muted"` | `"default"` | No | Primary or secondary text color |
| className | `string` | — | No | Extra class name |
| children | `React.ReactNode` | — | No | Content |
| ref | `React.Ref<HTMLElement>` | — | No | Ref to the DOM node |
| …rest | `React.HTMLAttributes<HTMLElement>` | — | No | Other HTML attributes for the chosen element |

## Variants

- **size** — eleven steps from `2xs` to `6xl`; each maps to font size and line-height tokens.
- **weight** — `regular` (no `data-weight`), `medium`, `semibold`.
- **tracking** — `normal` (no `data-tracking`), `tight`, `tighter`, `wide`.
- **tone** — `default` (primary content color) and `muted` (secondary).

## States

No interactive states (disabled, loading, validation error). Italic appearance is controlled by the boolean `italic` prop and `data-italic` in the markup.

## Accessibility (a11y)

Page and section heading semantics come from native `h1`–`h6`; `Typography` does not assign a heading role. For interactive fragments inside text, use real links and buttons with meaningful labels. Pass `id`, `aria-*`, and other attributes through `...rest` to the root element when needed.

## Limitations and notes

- The `as` prop only allows `p`, `span`, and `div` — not headings or interactive elements by default.
- There is no separate line-height prop: it is tied to `size` in the component’s CSS module.
- The root class uses `text-wrap: balance` for more even breaks in short blocks; customize wrapping via `className` or outer container styles.

## Related components

- **Label** and **Hint** — field labels and hints in forms.
- **PageContent** — typical page shell with title and description.
- **LinkButton** — text-link action with comfortable click padding.
- **Banner** and **NotificationCard** — blocks where text often pairs with `tone` and a size hierarchy.
