# Badge

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

A compact, non-interactive label for status, category, or counts. Optional `Badge.Dot` and `Badge.Icon` slots align a decorative dot or an icon with text; `variant="status"` adds a built-in presence dot and live-region semantics.

- **When to use:** surface short metadata next to headings, table rows, or list items (stage, environment, stock, role).
- **When to use:** show presence or mode with `variant="status"` when short visible copy fits the layout; use `label` when screen readers need more than `children` alone (see Rules).
- **When to use:** pair a semantic `color` and `variant` (`filled`, `light`, `lighter`, `stroke`) with density and emphasis needs on dashboards and catalogs.
- **When to use:** combine `Badge.Icon` with text or icon-only content when the icon should inherit badge sizing from `ControlSizeProvider`.
- **When not to use:** as the primary control for a click or navigation — use [Button](../button/COMPONENT.md) or [LinkButton](../link-button/COMPONENT.md) instead.
- **When not to use:** for removable or selectable tags — use [Tag](../tag/COMPONENT.md).
- **When not to use:** for keyboard shortcut glyphs — use [Kbd](../kbd/COMPONENT.md).

## Composition

- **`Badge.Root`** — root `div`; wraps `children` in `ControlSizeProvider` so nested icons can inherit control size. With **`variant="status"`**, renders a built-in status dot (`aria-hidden`), sets `role="status"`, optional `aria-label` from `label`, and ignores `color` for styling (dot color follows `status`).
- **`Badge.Dot`** — optional decorative dot inside the label (`span`, `aria-hidden`); use with non-status variants when you need a manual indicator next to text or icons.
- **`Badge.Icon`** — optional `span` wrapper for an icon node; place it before or after text, or use it alone for icon-only badges. Order of `Dot`, `Icon`, and text is up to layout needs.

### Minimal example

```tsx
import { Badge } from "prime-ui-kit";

export function Example() {
  return <Badge.Root>New</Badge.Root>;
}
```

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
