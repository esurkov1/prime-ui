# Badge

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A compact, non-standalone label (badge) for status, category, or count, with optional slots for a dot and an icon.

## When to use it

- **Catalogs and orders:** label delivery stage, payment type, or row priority without a dedicated column.
- **Internal dashboards and reports:** user roles, environment (staging), filter tags next to a heading.
- **Profiles and collaboration:** short presence or mode labels (“Online”, “Busy”) next to a name or in a participant list.

## Use cases

### Basic

A counter or short label next to a tab or section heading.

```tsx
import { Badge } from "prime-ui-kit";

export function TabWithCount() {
  return (
    <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
      Inbox
      <Badge.Root color="blue" variant="light" size="m">
        12
      </Badge.Root>
    </h2>
  );
}
```

### With variants and sizes

Marketing block: different emphasis levels for article topic tags.

```tsx
import { Badge } from "prime-ui-kit";

export function ArticleTopics() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Badge.Root color="purple" variant="filled" size="s">
        Guide
      </Badge.Root>
      <Badge.Root color="teal" variant="lighter" size="m">
        Updated
      </Badge.Root>
      <Badge.Root color="orange" variant="stroke" size="m">
        Beta
      </Badge.Root>
    </div>
  );
}
```

### In a card context

Product row: price, title, and an “In stock” label with an icon and dot.

```tsx
import { Badge, Icon } from "prime-ui-kit";

export function ProductRow() {
  return (
    <article
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: 12,
        borderRadius: 8,
        border: "1px solid var(--border-subtle, #e5e5e5)",
      }}
    >
      <div>
        <div style={{ fontWeight: 600 }}>Mechanical keyboard</div>
        <div style={{ fontSize: 14, opacity: 0.7 }}>SKU KB-204</div>
      </div>
      <Badge.Root color="green" variant="light" size="m">
        <Badge.Dot />
        <Badge.Icon>
          <Icon name="status.locked" />
        </Badge.Icon>
        In stock
      </Badge.Root>
    </article>
  );
}
```

### Presence status

An indicator with a meaningful label for assistive technologies.

```tsx
import { Badge } from "prime-ui-kit";

export function PresenceRow({ name }: { name: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span>{name}</span>
      <Badge.Root variant="status" status="away" size="m" label={`${name}: away`}>
        Away
      </Badge.Root>
    </div>
  );
}
```

### Icons in different positions

Icons can sit to the left of text, to the right, or be used alone without text.

```tsx
import { Badge, Icon } from "prime-ui-kit";

export function IconPositions() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {/* Icon on the left */}
      <Badge.Root color="blue" variant="light" size="m">
        <Badge.Icon>
          <Icon name="field.email" />
        </Badge.Icon>
        Email
      </Badge.Root>

      {/* Icon on the right */}
      <Badge.Root color="red" variant="light" size="m">
        New
        <Badge.Icon>
          <Icon name="nav.chevronRight" />
        </Badge.Icon>
      </Badge.Root>

      {/* Icon only */}
      <Badge.Root color="sky" variant="light" size="m">
        <Badge.Icon>
          <Icon name="action.copy" />
        </Badge.Icon>
      </Badge.Root>

      {/* Dot and icon combined */}
      <Badge.Root color="purple" variant="stroke" size="m">
        <Badge.Dot />
        <Badge.Icon>
          <Icon name="status.locked" />
        </Badge.Icon>
        Protected
      </Badge.Root>
    </div>
  );
}
```

## Anatomy

Flat compound API:

- `Badge.Root` — `div` wrapper; with `variant="status"`, a built-in status dot and `role="status"` are added.
- `Badge.Dot` — decorative dot inside the content (`span`, `aria-hidden`).
- `Badge.Icon` — aligns the icon with text in a row (`span`).

Children inside `Badge.Root` are wrapped in `ControlSizeProvider` so nested icons can inherit size.

## API

### Badge.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `color` | `"gray" \| "red" \| "blue" \| "green" \| "orange" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | No | Semantic color; does not affect styling when `variant="status"`. |
| `variant` | `"filled" \| "light" \| "lighter" \| "stroke" \| "status"` | `"light"` | No | Fill density, stroke, or status mode with a dot. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | from `ControlSizeContext` or `"m"` | No | Explicit size; without the prop, the control surface context is used (with `xs` → `s` mapping), otherwise `"m"`. |
| `disabled` | `boolean` | — | No | Muted appearance, `data-disabled`. |
| `status` | `"online" \| "offline" \| "away" \| "busy"` | `"online"` | No | Dot variant only for `variant="status"`. |
| `label` | `string` | — | No | `aria-label` on the root when `variant="status"`. |
| `children` | `React.ReactNode` | — | No | Text, `Badge.Dot`, `Badge.Icon`, icons. |
| `className` | `string` | — | No | Extra class on the root. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | No | Standard attributes and `ref` for the root `div`. |

### Badge.Icon

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `children` | `React.ReactNode` | — | Yes | Icon node. |
| `className` | `string` | — | No | Wrapper class. |
| … | `Omit<React.HTMLAttributes<HTMLDivElement>, "children">` | — | No | Other wrapper attributes. |

### Badge.Dot

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `className` | `string` | — | No | Dot class. |
| … | `React.HTMLAttributes<HTMLSpanElement>` | — | No | `span` attributes; node is hidden from assistive technologies. |

## Variants

- **`filled`** — solid fill for the chosen `color`, strongest emphasis.
- **`light`** — soft background and contrasting text; default style.
- **`lighter`** — lighter background, secondary labels on dense screens.
- **`stroke`** — transparent background and colored border.
- **`status`** — built-in indicator dot; dot color comes from `status`, text stays in `children`.

## States

- **Default** — default styles from `variant`, `color`, `size`.
- **`disabled`** — visual dimming via `data-disabled` for all variants, including `status`.

There are no separate loading, error, or focus states: the badge is a static label, not a button or input.

## Accessibility (a11y)

- With **`variant="status"`**, the root gets `role="status"` and an optional `aria-label` from the `label` prop; pass `label` when short inner text is not enough for meaning (e.g. only “Online” without a name).
- **`Badge.Dot`** uses `aria-hidden` — it does not duplicate the meaning of adjacent text.
- The badge is not keyboard-operable; for actions, use a button or link nearby, or a wrapper with the appropriate role.

## Limitations and notes

- The badge **does not** replace a button, link, or field; handle clickable scenarios with separate controls.
- The **`color`** prop is ignored for styling when **`variant="status"`** (`status` drives the dot).
- Size without an explicit `size` depends on **`ControlSizeProvider`** higher in the tree; outside that context **`m`** is used.
- **Icons** inside `Badge.Icon` automatically inherit size from `Badge.Root` via `ControlSizeProvider` — you do not need to set icon size explicitly when it should match the badge.

## Related components

- **Tag** — interactive or removable label with different UX (dismiss, selection).
- **Typography** — primary text next to the badge.
- **Button / LinkButton** — when the label should be an action, not a caption.
- **Kbd** — for keyboard shortcuts, not statuses.
