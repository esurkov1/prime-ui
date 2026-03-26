# Badge

**Default sizing:** When designing screens or samples, prefer **`size="m"`** unless the scenario explicitly needs another value.

## About

A compact, non-interactive label for status, category, or counts. Optional `Badge.Dot` and `Badge.Icon` slots align a decorative dot or an icon with text; `variant="status"` adds a built-in presence dot and live-region semantics.

- **Use** for short metadata next to headings, table rows, or list items (stage, environment, stock, role).
- **Use** `variant="status"` for presence when visible copy fits; pass **`label`** when assistive tech needs more than `children` alone (see Rules).
- **Use** semantic **`color`** with **`variant`** (`filled`, `light`, `lighter`, `stroke`) for emphasis on dashboards and catalogs.
- **Use** **`Badge.Icon`** when the icon should inherit badge sizing from the surrounding `ControlSizeProvider` (root provides it for children).
- **Do not use** as the primary control for clicks or navigation — use [Button](../button/COMPONENT.md) or [LinkButton](../link-button/COMPONENT.md).
- **Do not use** for removable or selectable tags — use [Tag](../tag/COMPONENT.md).
- **Do not use** for keyboard shortcut glyphs — use [Kbd](../kbd/COMPONENT.md).

## Composition

- **`Badge.Root`** — root `div`; wraps `children` in `ControlSizeProvider` so nested icons can inherit control size. With **`variant="status"`**, renders a built-in status dot (`aria-hidden`), sets `role="status"`, optional `aria-label` from `label`, and ignores `color` for styling (dot color follows `status`).
- **`Badge.Dot`** — optional decorative dot (`span`, `aria-hidden`); use with non-status variants when you need a manual indicator next to text or icons.
- **`Badge.Icon`** — optional `span` wrapper for an icon node; place it before or after text, or use it alone for icon-only badges.

## Examples

### Canonical

Source of truth: [`examples/canonical.tsx`](./examples/canonical.tsx).

```tsx
import { Badge } from "prime-ui-kit";

export default function BadgeCanonicalExample() {
  return <Badge.Root>New</Badge.Root>;
}
```

### Extended (copy from repo)

| File | Scenario |
|------|----------|
| [`examples/status-presence.tsx`](./examples/status-presence.tsx) | Presence: `variant="status"`, `status`, `label` |
| [`examples/ecommerce-inventory.tsx`](./examples/ecommerce-inventory.tsx) | Stock, promo, secure checkout with `Badge.Icon` |
| [`examples/inbox-labels.tsx`](./examples/inbox-labels.tsx) | Priority, unread, channel type, `Badge.Dot` |
| [`examples/admin-tags.tsx`](./examples/admin-tags.tsx) | Environment, access, feature-flag labels |

Playground snippets under `playground/snippets/badge/` mirror matrix demos (sizes, variants, colors, disabled, context); prefer **`examples/*.tsx`** for product-shaped English samples and **`import { … } from "prime-ui-kit"`** only.

## Note for LLM consumers

- **Imports:** In consumer code and doc samples, import **`Badge`** (and **`Icon`** when needed) from **`"prime-ui-kit"`** only — not from `@/components/...`.
- **Status mode:** When **`variant="status"`**, set **`label`** if visible **`children`** do not carry enough meaning alone (e.g. generic “Away” without whose presence). The built-in dot is **`aria-hidden`**; do not use it as the only state signal.
- **Tag vs Badge:** **Badge** is read-only metadata; **Tag** is for removable/filter chips — see [Tag](../tag/COMPONENT.md).
- **Sizing:** Omit **`size`** to follow the nearest **`ControlSizeProvider`**; otherwise default effective size is **`m`** (context **`xs`** maps to badge **`s`**).
- **Colors:** **`color`** is ignored for styling when **`variant="status"`**; use **`status`** for the dot.

## Rules

- Omit `size` to inherit from the nearest `ControlSizeProvider` / control-surface context; if none is present, the effective size is **`m`**. Context value **`xs`** maps to badge size **`s`**.
- With **`variant="status"`**, pass **`label`** when visible `children` alone are not enough for assistive tech (e.g. a generic word without whose status it is).
- **`Badge.Dot`** (both manual and the built-in status dot) is **`aria-hidden`** — do not rely on it alone to communicate state.
- **`disabled`** dims the badge via `data-disabled`; there is no loading, error, or focus ring — the badge is not keyboard-operable.
- **`color`** applies only when **`variant` is not `"status"`**; for status mode, dot appearance is driven by **`status`** (default **`online`** when unset).

## API

### Badge.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `color` | `"gray" \| "red" \| "blue" \| "green" \| "orange" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | No | Semantic palette; ignored for styling when `variant="status"`. |
| `variant` | `"filled" \| "light" \| "lighter" \| "stroke" \| "status"` | `"light"` | No | Fill, stroke, or status layout with built-in dot. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | from context or `"m"` | No | Explicit size; otherwise derived from control surface context, else `"m"`. |
| `disabled` | `boolean` | — | No | Muted look; sets `data-disabled`. |
| `status` | `"online" \| "offline" \| "away" \| "busy"` | `"online"` | No | Dot semantics when `variant="status"`; ignored otherwise. |
| `label` | `string` | — | No | `aria-label` on the root when `variant="status"`. |
| `children` | `React.ReactNode` | — | No | Text, `Badge.Dot`, `Badge.Icon`, or icons. |
| `className` | `string` | — | No | Extra class on the root. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other attributes and `ref` on the root `div`. |

### Badge.Icon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `children` | `React.ReactNode` | — | Yes | Icon node. |
| `className` | `string` | — | No | Wrapper class. |
| … | `Omit<React.HTMLAttributes<HTMLDivElement>, "children">` | — | No | Other wrapper attributes. |

### Badge.Dot

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `className` | `string` | — | No | Extra class on the dot. |
| … | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Other `span` attributes; node is `aria-hidden`. |

## Related

- [Tag](../tag/COMPONENT.md)
- [Typography](../typography/COMPONENT.md)
- [Button](../button/COMPONENT.md)
- [LinkButton](../link-button/COMPONENT.md)
- [Kbd](../kbd/COMPONENT.md)
