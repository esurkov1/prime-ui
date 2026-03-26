# Tag

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

A compact chip-style label: optional leading icon (`Tag.Icon`), optional removable close control when `onRemove` is set. Root is a `span` with `data-size` / `data-disabled`; the inner body wraps children in `ControlSizeProvider` so nested icons pick up the same control size tier.

- **Use** for filter chips, selected values (recipients, skills), or metadata labels where space is tight and optional one-click removal helps.
- **Use** `Tag.Icon` when a small icon should align with tag typography and scale with `size`.
- **Do not use** as a toggle or single-choice control; use [Checkbox](../checkbox/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md), or [Select](../select/COMPONENT.md).
- **Do not use** when the whole chip must navigate or submit a primary action; prefer [Button](../button/COMPONENT.md) or [LinkButton](../link-button/COMPONENT.md).
- **Do not use** expecting localized copy for the remove button without wrapping; the built-in remove `aria-label` is fixed to `"Remove"` in source.
- **Do not use** as a status/count pill without removal semantics when [Badge](../badge/COMPONENT.md) fits better.

## Composition

- **`Tag.Root`** — outer `span`; holds a **`span`** body with **`ControlSizeProvider`** around **`children`**, then an optional remove **`button`** when **`onRemove`** is defined. Put plain text, **`Tag.Icon`**, or other nodes inside **`Tag.Root`**; place **`Tag.Icon`** before text when both are used so the icon sits on the left.
- **`Tag.Icon`** — wrapper **`span`** for the icon node; inherits size from the surrounding **`Tag.Root`** context.

### Minimal example

```tsx
import { Tag } from "prime-ui-kit";

export function Example() {
  return <Tag.Root>Label</Tag.Root>;
}
```

## Rules

- Omit **`size`** to follow the nearest ancestor **`ControlSizeProvider`**; context **`xs`** maps to tag size **`s`**. With no provider and no **`size`**, the effective size is **`m`**.
- **`onRemove`** is optional; when present, a **`type="button"`** remove control is rendered with **`aria-label="Remove"`** and **`aria-hidden`** on the cross SVG. **`disabled`** sets **`aria-disabled`** on the root and disables the remove button.
- Without **`onRemove`**, there is no focusable control inside the tag; the root is not a button or link.
- For lists of removable tags, give the group a clear name (**`aria-label`** or **`aria-labelledby`**) so “Remove” has context.
- **`Tag.Icon`** does not force **`aria-hidden`** on icons; if the icon is decorative, rely on adjacent text or set **`aria-hidden`** on the icon content yourself.
- There is no **`variant`** prop; appearance follows **`size`** and whether removal is enabled.

## API

### Tag.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` or from `ControlSizeProvider` | No | Visual tier for height, radius, text, and nested icon scale |
| onRemove | `() => void` | — | No | When set, renders the remove button on the right |
| disabled | `boolean` | — | No | Disables removal and sets `aria-disabled` on the root |
| children | `React.ReactNode` | — | No | Text, `Tag.Icon`, or other nodes |
| className | `string` | — | No | Extra class on the root `span` |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Other root attributes (`data-*`, `aria-*`, etc.) |

### Tag.Icon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | Yes | Icon or other content |
| className | `string` | — | No | Extra class on the wrapper |

## Related

- [Badge](../badge/COMPONENT.md)
- [Button](../button/COMPONENT.md)
- [Input](../input/COMPONENT.md)
- [Select](../select/COMPONENT.md)
- [LinkButton](../link-button/COMPONENT.md)
- [SegmentedControl](../segmented-control/COMPONENT.md)
