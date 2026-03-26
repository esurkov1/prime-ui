# Tag

**Default sizing:** when designing screens and examples, start with **`m`** for `size` wherever a size axis exists unless the scenario explicitly needs another value.

## About

A compact chip-style label: optional leading icon (`Tag.Icon`), optional removable close control when `onRemove` is set. Root is a `span` with `data-size` / `data-disabled`; the inner body wraps children in `ControlSizeProvider` so nested icons pick up the same control size tier.

**When to use**

- Filter chips and applied facets where each selection should be dismissible in one click.
- Selected values (recipients, skills, topics) with optional removal.
- Tight metadata labels (environment, version, channel) when a pill shape reads better than body text; add `Tag.Icon` when a small glyph clarifies meaning.

**When not to use**

- As a toggle or single-choice control — prefer [Checkbox](../checkbox/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md), or [Select](../select/COMPONENT.md).
- When the whole chip must navigate or submit a primary action — prefer [Button](../button/COMPONENT.md) or [LinkButton](../link-button/COMPONENT.md).
- Expecting localized copy for the remove control without wrapping — the built-in remove `aria-label` is fixed to `"Remove"` in source; name the surrounding group (`aria-label` / `aria-labelledby`) for context.
- As a numeric or status **badge** — prefer [Badge](../badge/COMPONENT.md) when the UI is count-only or notification-style.

## Composition

- **`Tag.Root`** — outer `span`; holds a **`span`** body with **`ControlSizeProvider`** around **`children`**, then an optional remove **`button`** when **`onRemove`** is defined. Put plain text, **`Tag.Icon`**, or other nodes inside **`Tag.Root`**; place **`Tag.Icon`** before text when both are used so the icon sits on the left.
- **`Tag.Icon`** — wrapper **`span`** for the icon node; inherits size from the surrounding **`Tag.Root`** context.

### Canonical example

```tsx
import { Tag } from "prime-ui-kit";

export function Example() {
  return <Tag.Root size="m">Design systems</Tag.Root>;
}
```

### Extended examples

- [`./examples/01-filter-chips.tsx`](./examples/01-filter-chips.tsx) — Catalog filters: applied facets as removable chips backed by a `Set` in state.
- [`./examples/02-removable-selected-values.tsx`](./examples/02-removable-selected-values.tsx) — Selected skills: removable tags inside `fieldset` / `legend` so each “Remove” control has group context.
- [`./examples/03-status-metadata.tsx`](./examples/03-status-metadata.tsx) — Status / release metadata: read-only chips with `Tag.Icon` + text, no `onRemove`.
- [`./examples/04-tag-sizes.tsx`](./examples/04-tag-sizes.tsx) — Size ladder `s` through `xl` in one row.

**LLM note:** Prefer reading the runnable files under `./examples/*.tsx` for full scenarios, prop combinations, and composition patterns; this page keeps the contract (rules + API tables) authoritative.

## Rules

- Omit **`size`** to follow the nearest ancestor **`ControlSizeProvider`**; context **`xs`** maps to tag size **`s`**. With no provider and no **`size`**, the effective size is **`m`**.
- **`onRemove`** is optional; when present, a **`type="button"`** remove control is rendered with **`aria-label="Remove"`** and **`aria-hidden`** on the cross SVG. **`disabled`** sets **`aria-disabled`** on the root and disables the remove button.
- Without **`onRemove`**, there is no focusable control inside the tag; the root is not a button or link.
- For lists of removable tags, name the group so “Remove” has context — e.g. **`fieldset`** + **`legend`** (as in `./examples`) or **`aria-label`** / **`aria-labelledby`** on a suitable wrapper.
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
